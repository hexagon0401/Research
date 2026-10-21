#!/usr/bin/env python3
"""Prepare reviewed, de-identified report transcripts from a PRIVATE input manifest.

Requires PyMuPDF (see requirements-reports.txt). Original files stay in .local.
The manifest and exact privacy terms must never be committed. No document script,
external relationship, instruction or link is executed or fetched.
"""
import argparse
import hashlib
import html
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

import fitz

MAX_XML = 16 * 1024 * 1024


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def local(tag):
    return tag.split('}')[-1]


def xml_blocks(path):
    """Read each paragraph once, including nested tables, memos and Word notes."""
    result = []
    with zipfile.ZipFile(path) as archive:
        names = sorted(n for n in archive.namelist() if n.startswith('Contents/section') and n.endswith('.xml')) if path.suffix == '.hwpx' else [n for n in ['word/document.xml', 'word/footnotes.xml', 'word/endnotes.xml'] if n in archive.namelist()]
        if not names or sum(archive.getinfo(n).file_size for n in names) > MAX_XML:
            raise ValueError('Missing or oversized document XML')
        for name in names:
            data = archive.read(name)
            if b'<!DOCTYPE' in data.upper() or b'<!ENTITY' in data.upper():
                raise ValueError('External XML declarations are not supported')
            tree = ET.fromstring(data)
            parents = {child: parent for parent in tree.iter() for child in parent}

            def text_of(node):
                tag = local(node.tag)
                if tag == 'p':
                    return ''  # Nested paragraphs have their own record.
                if tag in {'lineBreak', 'br', 'cr'}:
                    return '\n'
                if tag == 'tab':
                    return '\t'
                if tag in {'footnoteReference', 'endnoteReference'}:
                    ref = next((v for k, v in node.attrib.items() if local(k) == 'id'), '')
                    return f'[각주 {ref}]'
                if tag == 't':
                    return (node.text or '') + ''.join(text_of(c) + (c.tail or '') for c in node)
                return ''.join(text_of(c) for c in node)

            for paragraph in tree.iter():
                if local(paragraph.tag) != 'p':
                    continue
                text = ''.join(text_of(child) for child in paragraph)
                if not text.strip():
                    continue
                kind = 'note' if name != 'word/document.xml' and name.startswith('word/') else 'body'
                parent = parents.get(paragraph)
                while parent is not None:
                    if local(parent.tag) == 'fieldBegin' and parent.attrib.get('type') == 'MEMO':
                        kind = 'memo'
                    if local(parent.tag) in {'footnote', 'endnote'}:
                        ref = next((v for k, v in parent.attrib.items() if local(k) == 'id'), '')
                        if ref.startswith('-') or ref == '0':
                            text = ''
                        else:
                            text = f'[각주 {ref}] ' + text
                    parent = parents.get(parent)
                if text.strip():
                    result.append({'kind': kind, 'text': text})
    return result


def clean_text(text, terms):
    text = re.sub(r'[1-3]\s*학년\s*\d+\s*반\s*\d+\s*번', '[학급 정보 비공개]', text)
    for term in sorted(terms, key=len, reverse=True):
        text = text.replace(term, '[비공개]')
    return text


def check_text(text, terms):
    normalized = re.sub(r'\s+', '', text).casefold()
    if any(re.sub(r'\s+', '', t).casefold() in normalized for t in terms):
        raise ValueError('Privacy identifier remains in a public candidate')


def prepare_pdf(source, target, terms):
    doc = fitz.open(source)
    redactions = 0
    image_pages = set()
    for number, page in enumerate(doc):
        if page.get_images():
            image_pages.add(number + 1)
        original_text = page.get_text()
        # Some Korean PDFs store header digits as separate text objects and
        # extraction order becomes "학년 반 번 이름 2 1 11". Redact that visual
        # line as a unit instead of leaving the detached class numbers behind.
        rows = []
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                y = line['bbox'][1]
                row = next((r for r in rows if abs(r['y'] - y) < 2), None)
                if row is None:
                    row = {'y': y, 'spans': []}
                    rows.append(row)
                row['spans'].extend(line['spans'])
        for row in rows:
            row_text = re.sub(r'\s+', '', ''.join(s['text'] for s in sorted(row['spans'], key=lambda s: s['bbox'][0])))
            if '학년' in row_text and '반' in row_text and '번' in row_text:
                rect = fitz.Rect(row['spans'][0]['bbox'])
                for span in row['spans'][1:]:
                    rect |= fitz.Rect(span['bbox'])
                page.add_redact_annot(rect, fill=(1, 1, 1), cross_out=False)
                redactions += 1
        phrases = set(terms) | set(re.findall(r'[1-3]\s*학년\s*\d+\s*반\s*\d+\s*번', original_text))
        for phrase in phrases:
            for rect in page.search_for(phrase):
                page.add_redact_annot(rect, fill=(1, 1, 1), cross_out=False)
                redactions += 1
        # Identifiers were reviewed as text outside the research figures.
        # Preserve plots and geographic screenshots while deleting text bytes.
        page.apply_redactions(images=0, graphics=0, text=0)
        for annotation in list(page.annots() or []):
            page.delete_annot(annotation)
    doc.set_toc([])
    doc.scrub(remove_links=True, redact_images=0)
    doc.set_metadata({})
    doc.save(target, garbage=4, deflate=True)
    doc.close()
    sections = []
    with fitz.open(target) as reviewed:
        for number, page in enumerate(reviewed):
            text = page.get_text('text', sort=True).strip()
            check_text(text, terms)
            sections.append({'number': number + 1, 'blocks': [{'kind': 'body', 'text': text}], 'hasFigures': number + 1 in image_pages})
    return sections, redactions


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    args = parser.parse_args()
    config = json.loads(args.manifest.read_text())
    terms = config['privacyTerms']
    catalog = []
    public_root = Path('src/content/reports')
    public_root.mkdir(parents=True, exist_ok=True)
    for item in config['reports']:
        source = Path(item['source']).resolve(strict=True)
        if '.local' not in source.parts or digest(source) != item['originalSha256']:
            raise ValueError('Use an unchanged, privately preserved original')
        report_id = item['id']
        if not re.fullmatch(r'S\d{2}', report_id):
            raise ValueError('Invalid source ID')
        out = source.parent / 'publication'
        out.mkdir(exist_ok=True, mode=0o700)
        if source.suffix == '.pdf':
            sections, redactions = prepare_pdf(source, out / 'reader.pdf', terms)
            locator = 'page'
            method = 'PDF text layer; figures remain available in the reviewed PDF and page previews. Image text is not silently invented as transcription.'
        else:
            blocks = xml_blocks(source)
            redactions = sum(b['text'] != clean_text(b['text'], terms) for b in blocks)
            blocks = [{'kind': b['kind'], 'text': clean_text(b['text'], terms)} for b in blocks]
            sections = [{'number': i // 20 + 1, 'blocks': blocks[i:i + 20], 'hasFigures': False} for i in range(0, len(blocks), 20)]
            locator = 'paragraph'
            method = 'Document XML paragraphs, tables flattened, memo and footnote text labelled. Original pagination and formatting are not reproduced.'
        for section in sections:
            section['id'] = f'{report_id}-L{section["number"]:03}'
            for number, block in enumerate(section['blocks']):
                block['id'] = f'{section["id"]}-P{number + 1:03}'
                check_text(block['text'], terms)
        report = {k: item[k] for k in ['id', 'title', 'titleType', 'year', 'description', 'projects', 'originalSha256']}
        report.update(format=source.suffix[1:], originalByteSize=source.stat().st_size, locator=locator,
                      sourcePageCount=len(sections) if locator == 'page' else None,
                      transcriptionMethod=method, verificationStatus='SOURCE_TRANSCRIBED_CLAIMS_UNVERIFIED',
                      revision='rev-001', assetId=f'{report_id.lower()}-reader-rev-001',
                      privacyStatus='identifiers-removed', sections=sections)
        media = []
        if item.get('reviewedMedia'):
            with zipfile.ZipFile(source) as archive:
                for number, figure in enumerate(item['reviewedMedia']):
                    name = figure['entry']
                    if not name.startswith('word/media/') or not name.endswith('.png'):
                        raise ValueError('Only explicitly reviewed Word PNG media are supported')
                    data = archive.read(name)
                    filename = f'figure-{number + 1:02}.png'
                    (out / filename).write_bytes(data)
                    media.append({'file': filename, 'alt': figure['alt']})
        report['media'] = media
        (out / 'prepared.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        (out / 'review.json').write_text(json.dumps({'redactions': redactions, 'originalSha256': digest(source), 'originalUnchanged': True, 'state': 'private-candidate'}, indent=2) + '\n')
        catalog.append({**{k: v for k, v in report.items() if k != 'sections'}, 'sectionCount': len(sections)})
        print(json.dumps({'id': report_id, 'format': report['format'], 'sections': len(sections), 'redactions': redactions}))
    Path('.local/report-catalog-candidates.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
