-- Free-plan compatible: no extensions, scheduled jobs, workers, or paid features.
begin;

-- Never silently reuse an existing public bucket for private research.
do $$ begin
 if exists(select 1 from storage.buckets where id in ('research-originals','research-reader') and public) then
  raise exception 'Research buckets must be private before applying this migration';
 end if;
end $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values
 ('research-originals','research-originals',false,20971520,array['application/pdf','application/vnd.hancom.hwp','application/x-hwp','application/vnd.hancom.hwpx','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
 ('research-reader','research-reader',false,20971520,array['application/pdf','application/vnd.hancom.hwp','application/x-hwp','application/vnd.hancom.hwpx','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict(id) do nothing;

create table if not exists public.research_assets(
 id text primary key check(id ~ '^[a-zA-Z0-9_-]{1,80}$'),
 document_id text not null check(document_id ~ '^[A-Z][A-Z0-9-]{1,63}$'),
 title text not null check(length(btrim(title)) between 1 and 240),
 revision text not null check(revision ~ '^rev-[0-9]{3,}$'),
 kind text not null check(kind in ('reader_pdf','original')),
 mime_type text not null check(mime_type in ('application/pdf','application/vnd.hancom.hwp','application/x-hwp','application/vnd.hancom.hwpx','application/vnd.openxmlformats-officedocument.wordprocessingml.document')),
 byte_size bigint not null check(byte_size between 1 and 20971520),
 sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'),
 bucket_id text not null default 'research-reader' check(bucket_id='research-reader'),
 object_path text not null,
 publication_state text not null default 'draft' check(publication_state in ('draft','published','withdrawn')),
 rights_approved boolean not null default false,
 privacy_approved boolean not null default false,
 project_slugs text[] not null check(cardinality(project_slugs) between 1 and 6 and project_slugs <@ array['corporate-resilience','technology-and-advantage','mission-and-responsibility','strategic-capability','state-firm-models','conditional-partnership']::text[]),
 uploaded_at timestamptz not null default now(),
 published_at timestamptz,
 unique(bucket_id,object_path),
 check(kind<>'reader_pdf' or mime_type='application/pdf'),
 check(object_path ~ ('^'||document_id||'/'||revision||'/[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}$')),
 check(publication_state<>'published' or (rights_approved and privacy_approved and published_at is not null))
);

alter table public.research_assets enable row level security;
revoke all on public.research_assets from public,anon,authenticated;
grant select,insert,update,delete on public.research_assets to service_role;
drop policy if exists iir_assets_private on public.research_assets;
create policy iir_assets_private on public.research_assets as restrictive for all to anon,authenticated using(false) with check(false);

-- A restrictive guard also defeats unrelated permissive bucket-wide policies.
-- Dashboard/service_role operations remain available; browsers cannot upload/read.
drop policy if exists iir_private_buckets on storage.objects;
create policy iir_private_buckets on storage.objects as restrictive for all to anon,authenticated
 using(bucket_id not in ('research-originals','research-reader'))
 with check(bucket_id not in ('research-originals','research-reader'));

commit;
