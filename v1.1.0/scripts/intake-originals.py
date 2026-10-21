#!/usr/bin/env python3
"""Preserve an uploaded report privately; never uploads, publishes, or edits it."""
import argparse
import hashlib
import json
import shutil
import subprocess
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

MAX_FILE = 32 * 1024 * 1024
MAX_XML = 16 * 1024 * 1024
SUPPORTED = {'.pdf', '.hwp', '.hwpx', '.docx'}

def inspect_report(source: Path, output_root: Path):
    source = source.resolve(strict=True)
    suffix = source.suffix.lower()
    if suffix not in SUPPORTED or not source.is_file():
        raise ValueError('Expected a PDF, HWP, HWPX, or DOCX report')
    if source.stat().st_size > MAX_FILE or source.stat().st_size == 0:
        raise ValueError('Intake supports nonempty files up to 32 MiB; storage delivery is capped at 20 MiB')
    with source.open('rb') as handle:
        signature = handle.read(8)
        handle.seek(0)
        digest = hashlib.file_digest(handle, 'sha256').hexdigest()
    if suffix == '.pdf' and not signature.startswith(b'%PDF-'):
        raise ValueError('PDF extension does not match the file signature')
    if suffix == '.hwp' and signature != bytes.fromhex('d0cf11e0a1b11ae1'):
        raise ValueError('HWP extension does not match the compound-document signature')
    if suffix in {'.docx', '.hwpx'} and not signature.startswith(b'PK'):
        raise ValueError('XML document extension does not match its ZIP container')
    output_root = output_root.resolve()
    # No original or extracted text may be written into a web-served directory.
    if any(name in {'public', 'src', '.next'} for name in output_root.parts):
        raise ValueError('The intake destination must be a private .local/intake directory')
    if '.local' not in output_root.parts:
        raise ValueError('Use a Git-ignored .local/intake destination')
    directory = output_root / digest
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    original = directory / ('original' + suffix)
    if not original.exists():
        shutil.copyfile(source, original)
    original.chmod(0o600)
    if hashlib.sha256(original.read_bytes()).hexdigest() != digest:
        raise ValueError('Preserved original failed checksum verification')
    extracted = ''
    status = 'NOT_EXTRACTED'
    if suffix == '.pdf' and shutil.which('pdftotext'):
        result = subprocess.run(['pdftotext', '-layout', str(original), '-'], capture_output=True, timeout=30)
        if result.returncode == 0:
            extracted = result.stdout.decode('utf-8', errors='replace')
            status = 'TEXT_EXTRACTED' if extracted.strip() else 'OCR_REQUIRED'
        else:
            status = 'PDF_EXTRACTION_FAILED'
    elif suffix in {'.docx', '.hwpx'}:
        with zipfile.ZipFile(original) as archive:
            names = ['word/document.xml'] if suffix == '.docx' else sorted(n for n in archive.namelist() if n.startswith('Contents/section') and n.endswith('.xml'))
            if not names or sum(archive.getinfo(n).file_size for n in names) > MAX_XML:
                raise ValueError('Missing document XML or excessive uncompressed XML size')
            paragraphs = []
            for name in names:
                data = archive.read(name)
                if b'<!DOCTYPE' in data.upper() or b'<!ENTITY' in data.upper():
                    raise ValueError('Unsupported XML declaration')
                tree = ET.fromstring(data)
                for paragraph in tree.iter():
                    if paragraph.tag.split('}')[-1] == 'p':
                        text = ''.join(n.text or '' for n in paragraph.iter() if n.tag.split('}')[-1] == 't')
                        if text.strip():
                            paragraphs.append(text)
            extracted = '\n\n'.join(paragraphs)
            status = 'TEXT_EXTRACTED' if extracted.strip() else 'EXTRACTION_EMPTY'
    elif suffix == '.hwp':
        status = 'HWP_PARSER_REQUIRED'
    if extracted:
        (directory / 'extracted.txt').write_text(extracted, encoding='utf-8')
        (directory / 'extracted.txt').chmod(0o600)
    record = {
        'sha256': digest, 'originalFilename': unicodedata.normalize('NFC', source.name),
        'sourcePath': str(source), 'byteSize': source.stat().st_size,
        'format': suffix[1:], 'intakeAt': datetime.now(timezone.utc).isoformat(),
        'extractionStatus': status, 'publicationState': 'draft',
        'privacyReview': 'pending', 'rightsReview': 'pending',
        'storageEligibleBySize': source.stat().st_size <= 20 * 1024 * 1024,
        'note': 'Local preservation only. No upload, publication, scientific verification, or OCR implied.'
    }
    (directory / 'intake.json').write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    (directory / 'intake.json').chmod(0o600)
    return {'sha256':digest, 'format':suffix[1:], 'bytes':record['byteSize'], 'extractionStatus':status, 'publicationState':'draft'}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('files', nargs='+', type=Path)
    parser.add_argument('--output', type=Path, default=Path('.local/intake'))
    args = parser.parse_args()
    for source in args.files:
        print(json.dumps(inspect_report(source, args.output), ensure_ascii=False))
