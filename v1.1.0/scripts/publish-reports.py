#!/usr/bin/env python3
"""Upload reviewed reports to the configured private project; never logs credentials or signed links."""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import time
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timezone


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text())
    base = os.environ.get('SUPABASE_URL', '').rstrip('/')
    key = os.environ.get('SUPABASE_SECRET_KEY')
    if not re.fullmatch(r'https://[a-z0-9]{10,40}\.supabase\.co', base) or not key:
        raise ValueError('Connect the project URL and server secret securely')
    headers = {'apikey': key, 'Authorization': 'Bearer ' + key}

    def resumable(bucket, object_path, data, content_type):
        metadata = {'bucketName': bucket, 'objectName': object_path, 'contentType': content_type, 'cacheControl': '3600'}
        upload_headers = {**headers, 'Tus-Resumable': '1.0.0', 'Upload-Length': str(len(data)), 'Upload-Metadata': ','.join(k + ' ' + base64.b64encode(v.encode()).decode() for k, v in metadata.items()), 'x-upsert': 'false'}
        req = urllib.request.Request(base + '/storage/v1/upload/resumable', method='POST', data=b'', headers=upload_headers)
        with urllib.request.urlopen(req, timeout=60) as response:
            location = urllib.parse.urljoin(base, response.headers['Location'])
        parsed = urllib.parse.urlparse(location)
        if parsed.scheme != 'https' or parsed.netloc != urllib.parse.urlparse(base).netloc or not parsed.path.startswith('/storage/v1/upload/resumable/'):
            raise ValueError('Unexpected resumable destination')
        offset = 0
        while offset < len(data):
            chunk = data[offset:offset + 6 * 1024 * 1024]
            req = urllib.request.Request(location, method='PATCH', data=chunk, headers={**headers, 'Tus-Resumable': '1.0.0', 'Upload-Offset': str(offset), 'Content-Type': 'application/offset+octet-stream'})
            with urllib.request.urlopen(req, timeout=60) as response:
                new_offset = int(response.headers['Upload-Offset'])
            if new_offset != offset + len(chunk):
                raise ValueError('Unexpected resumable offset')
            offset = new_offset

    def request(path, method='GET', data=None, content_type='application/json', authenticated=True, extra=None):
        req = urllib.request.Request(base + path, method=method, data=data,
                                     headers={**(headers if authenticated else {}), 'Content-Type': content_type, **(extra or {})})
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req, timeout=60) as response:
                    return response.status, response.read()
            except urllib.error.HTTPError as error:
                if error.code not in [502, 503, 504] or attempt == 2:
                    raise
                error.close()
                time.sleep(attempt + 1)

    for bucket in ['research-originals', 'research-reader']:
        _, body = request('/storage/v1/bucket/' + bucket)
        info = json.loads(body)
        if info['public']:
            raise ValueError('Expected a private research bucket')
    request('/rest/v1/research_assets?select=id&limit=1')
    records = []
    mime = {'pdf': 'application/pdf', 'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'hwpx': 'application/vnd.hancom.hwpx'}
    for entry in manifest['reports']:
        source = Path(entry['source'])
        report = json.loads((Path('src/content/reports') / (entry['id'].lower() + '.json')).read_text())
        directory = source.parent / 'publication'
        if not (directory / 'verified.json').is_file():
            raise ValueError('Review verification record is missing')
        previous_path = directory / 'cloud-verification.json'
        if previous_path.is_file() and hashlib.sha256(source.read_bytes()).hexdigest() == entry['originalSha256']:
            previous = json.loads(previous_path.read_text())
            _, stored = request('/rest/v1/research_assets?id=eq.' + report['assetId'] + '&select=sha256,publication_state')
            if previous.get('signedDownloadVerified') and any(r['sha256'] == report['readerSha256'] and r['publication_state'] == 'published' for r in json.loads(stored)):
                records.append(previous)
                print(json.dumps({'id': report['id'], 'resumed': True, 'checksumsPreviouslyVerified': True}), flush=True)
                continue
        pairs = [
            ('research-originals', f'{entry["id"]}/rev-001/source.{report["format"]}', source, entry['originalSha256'], mime[report['format']]),
            ('research-reader', f'{entry["id"]}/rev-001/reader.pdf', directory / 'reader.pdf', report['readerSha256'], 'application/pdf'),
        ]
        for bucket, object_path, file, checksum, content_type in pairs:
            data = file.read_bytes()
            if not 0 < len(data) <= 20 * 1024 * 1024 or hashlib.sha256(data).hexdigest() != checksum:
                raise ValueError('Size or local checksum mismatch')
            read_path = f'/storage/v1/object/authenticated/{bucket}/{object_path}'
            try:
                _, remote = request(read_path)
            except urllib.error.HTTPError as error:
                if error.code not in [400, 404]:
                    raise
                error_body = error.read()
                if b'not found' not in error_body.lower() and b'not_found' not in error_body.lower() and error.code != 404:
                    raise ValueError('Object lookup failed; upload was not attempted')
                try:
                    if len(data) > 6 * 1024 * 1024:
                        resumable(bucket, object_path, data, content_type)
                    else:
                        request(f'/storage/v1/object/{bucket}/{object_path}', 'POST', data, content_type, extra={'x-upsert': 'false'})
                except urllib.error.HTTPError as upload_error:
                    # A gateway retry may follow an already accepted upload.
                    # The authenticated read + checksum below remains decisive.
                    if upload_error.code not in [400, 409]:
                        raise
                _, remote = request(read_path)
            if hashlib.sha256(remote).hexdigest() != checksum:
                raise ValueError('Remote checksum mismatch; refusing overwrite or publication')
        _, existing = request('/rest/v1/research_assets?id=eq.' + report['assetId'] + '&select=sha256')
        if any(r['sha256'] != report['readerSha256'] for r in json.loads(existing)):
            raise ValueError('Existing metadata has a different checksum')
        record = {'id': report['assetId'], 'document_id': report['id'], 'title': report['title'] + ' — 개인정보 제거 열람본', 'revision': 'rev-001', 'kind': 'reader_pdf', 'mime_type': 'application/pdf', 'byte_size': report['readerByteSize'], 'sha256': report['readerSha256'], 'bucket_id': 'research-reader', 'object_path': f'{report["id"]}/rev-001/reader.pdf', 'publication_state': 'draft', 'rights_approved': False, 'privacy_approved': True, 'project_slugs': report['projects']}
        # Verify an actual anonymous signed download before publishing metadata.
        _, signed_body = request('/storage/v1/object/sign/research-reader/' + record['object_path'], 'POST', json.dumps({'expiresIn': 300}).encode())
        signed = json.loads(signed_body)['signedURL']
        signed_url = urllib.parse.urljoin(base + '/storage/v1/', signed.lstrip('/')) if not signed.startswith('/storage/v1/') else base + signed
        parsed = urllib.parse.urlparse(signed_url)
        if parsed.scheme != 'https' or parsed.netloc != urllib.parse.urlparse(base).netloc or not parsed.path.startswith('/storage/v1/object/sign/research-reader/'):
            raise ValueError('Unexpected signed URL destination')
        with urllib.request.urlopen(signed_url, timeout=60) as response:
            if hashlib.sha256(response.read()).hexdigest() != report['readerSha256']:
                raise ValueError('Signed download checksum mismatch')
        record.update(publication_state='published', rights_approved=True, published_at=datetime.now(timezone.utc).isoformat())
        request('/rest/v1/research_assets?on_conflict=id', 'POST', json.dumps(record, ensure_ascii=False).encode(), extra={'Prefer': 'resolution=merge-duplicates'})
        records.append({'id': report['id'], 'preservationUploaded': True, 'readerUploaded': True, 'checksumsVerified': True, 'signedDownloadVerified': True, 'metadataPublished': True})
        (directory / 'cloud-verification.json').write_text(json.dumps(records[-1], indent=2) + '\n')
        print(json.dumps(records[-1]), flush=True)
    Path('.local/cloud-reports-verification.json').write_text(json.dumps({'checkedAt': datetime.now(timezone.utc).isoformat(), 'reports': records}, indent=2) + '\n')


if __name__ == '__main__':
    main()
