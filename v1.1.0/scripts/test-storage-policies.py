#!/usr/bin/env python3
"""Exercise the migration in a disposable, network-isolated local Postgres."""
from pathlib import Path
import os
import subprocess
import time

name = 'iir-policies-' + str(os.getpid())
def docker(*args, input=None, check=True):
    result=subprocess.run(['docker',*args],input=input,text=True,capture_output=True)
    if check and result.returncode:
        raise RuntimeError(result.stderr or result.stdout)
    return result

def sql(text, check=True):
    return docker('exec','-i',name,'psql','-U','postgres','-v','ON_ERROR_STOP=1',input=text,check=check)

try:
    docker('run','--rm','-d','--network','none','--memory','256m','--cpus','1','--name',name,'-e','POSTGRES_PASSWORD=isolated-local-test', 'postgres:17-alpine')
    for attempt in range(60):
        if docker('exec',name,'pg_isready','-h','127.0.0.1','-U','postgres',check=False).returncode==0:
            break
        time.sleep(.25)
    else: raise RuntimeError('Local Postgres did not start')
    sql('''
create role anon; create role authenticated; create role service_role bypassrls;
create schema storage;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id bigint generated always as identity,bucket_id text,name text);
alter table storage.objects enable row level security;
grant usage on schema storage to anon,authenticated,service_role;
grant select,insert,update,delete on storage.objects to anon,authenticated,service_role;
grant usage on sequence storage.objects_id_seq to anon,authenticated,service_role;
create policy broad_existing_policy on storage.objects for all to anon,authenticated using(true) with check(true);
''')
    migration=(Path(__file__).parents[1]/'supabase/migrations/202610210001_original_files.sql').read_text()
    sql(migration);sql(migration)
    print('PASS: migration is repeatable')
    sql('''
insert into storage.objects(bucket_id,name) values ('research-originals','private.hwp'),('research-reader','approved.pdf'),('other-bucket','unrelated.pdf');
insert into public.research_assets(id,document_id,title,revision,kind,mime_type,byte_size,sha256,object_path,project_slugs)
values('fixture','S06','Policy test fixture','rev-001','reader_pdf','application/pdf',10,repeat('a',64),'S06/rev-001/reader.pdf',array['corporate-resilience']);
''')
    for role in ['anon','authenticated']:
        result=sql(f"set role {role}; select bucket_id from storage.objects order by bucket_id;")
        assert 'other-bucket' in result.stdout and 'research-reader' not in result.stdout and 'research-originals' not in result.stdout
        assert sql(f'set role {role}; select * from public.research_assets;',check=False).returncode!=0
        assert sql(f"set role {role}; insert into storage.objects(bucket_id,name) values('research-reader','injected.pdf');",check=False).returncode!=0
        assert sql(f"set role {role}; update storage.objects set name='changed' where bucket_id='research-reader';").stdout.strip().endswith('UPDATE 0')
        assert sql(f"set role {role}; delete from storage.objects where bucket_id='research-reader';").stdout.strip().endswith('DELETE 0')
        print('PASS:',role,'cannot read research objects or metadata, upload, modify, or delete; unrelated bucket preserved')
    assert sql("update public.research_assets set publication_state='published',published_at=now() where id='fixture';",check=False).returncode!=0
    sql("update public.research_assets set rights_approved=true,privacy_approved=true,publication_state='published',published_at=now() where id='fixture';")
    result=sql("set role service_role; select id from public.research_assets;")
    assert 'fixture' in result.stdout
    assert sql("update public.research_assets set object_path='S06/rev-001/../../secret.pdf' where id='fixture';",check=False).returncode!=0
    print('PASS: approval gates and path constraints; service role can read for signing')
    sql("update storage.buckets set public=true where id='research-reader';")
    assert sql(migration,check=False).returncode!=0
    print('PASS: existing public research bucket is rejected')
finally:
    docker('rm','-f',name,check=False)
