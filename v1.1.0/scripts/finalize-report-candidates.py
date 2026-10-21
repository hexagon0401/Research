#!/usr/bin/env python3
"""Export only checked report candidates; originals and exact privacy terms stay private."""
import argparse
import hashlib
import importlib.util
import json
import re
import shutil
import unicodedata
from pathlib import Path

import fitz

spec = importlib.util.spec_from_file_location('reports', Path(__file__).with_name('report-documents.py'))
reports = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reports)


def normalized(value):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', value))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--export-reading-pdfs', action='store_true', help='Also export reviewed PDFs as versioned public static files; NEVER copies originals')
    args = parser.parse_args()
    config = json.loads(args.manifest.read_text())
    catalog = []
    for entry in config['reports']:
        source = Path(entry['source'])
        directory = source.parent / 'publication'
        report = json.loads((directory / 'prepared.json').read_text())
        pdf = directory / 'reader.pdf'
        if reports.digest(source) != entry['originalSha256']:
            raise ValueError('Original changed')
        with fitz.open(pdf) as doc:
            pdf_text = '\n'.join(p.get_text() for p in doc)
            reports.check_text(pdf_text, config['privacyTerms'])
            if doc.embfile_count():
                raise ValueError('Reading PDF contains attachments')
            if source.suffix != '.pdf':
                # Page footers may split paragraphs. Remove only our generated footer.
                body = re.sub(rf'{report["id"]}/rev-001·\d+/\d+', '', normalized(pdf_text))
                missing = [b['id'] for s in report['sections'] for b in s['blocks'] if normalized(b['text']) not in body]
                if missing:
                    raise ValueError(f'Paragraphs missing in rendered PDF: {missing}')
            elif len(doc) != report['sourcePageCount']:
                raise ValueError('Page count changed')
            report['readerPageCount'] = len(doc)
            report['readerByteSize'] = pdf.stat().st_size
            report['readerSha256'] = reports.digest(pdf)
            media_root = Path('public/report-media') / report['id'].lower()
            for section in report['sections']:
                if not section['hasFigures']:
                    continue
                media_root.mkdir(parents=True, exist_ok=True)
                page = doc[section['number'] - 1]
                # WebP previews keep graphs visible without loading the whole PDF.
                pix = page.get_pixmap(matrix=fitz.Matrix(1280 / page.rect.width, 1280 / page.rect.width), alpha=False)
                filename = f'page-{section["number"]:02}.webp'
                pix.pil_save(media_root / filename, format='WEBP', quality=84)
                section['preview'] = {'src': f'/report-media/{report["id"].lower()}/{filename}', 'width': pix.width, 'height': pix.height, 'alt': f'{report["id"]} 원문 {section["number"]}쪽의 도표·이미지와 배치 — 개인정보 제거 사본'}
        figures = []
        for number, figure in enumerate(report.pop('media', [])):
            image = directory / figure['file']
            media_root = Path('public/report-media') / report['id'].lower()
            media_root.mkdir(parents=True, exist_ok=True)
            with fitz.open(image) as picture:
                pix = picture[0].get_pixmap(alpha=False)
                filename = f'figure-{number + 1:02}.webp'
                pix.pil_save(media_root / filename, format='WEBP', quality=90)
                figures.append({'src': f'/report-media/{report["id"].lower()}/{filename}', 'width': pix.width, 'height': pix.height, 'alt': figure['alt']})
        report['figures'] = figures
        report['downloadState'] = 'pending'
        report['readerUrl'] = None
        if args.export_reading_pdfs:
            pdf_path = Path('public/report-pdfs') / report['id'].lower() / report['revision'] / 'reader.pdf'
            pdf_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(pdf, pdf_path)
            if reports.digest(pdf_path) != report['readerSha256']:
                raise ValueError('Static reading copy checksum mismatch')
            report['readerUrl'] = '/' + pdf_path.relative_to('public').as_posix()
            report['downloadState'] = 'static'
        report['sectionCount'] = len(report['sections'])
        report['figurePageCount'] = sum(s['hasFigures'] for s in report['sections']) + len(figures)
        public_path = Path('src/content/reports') / (report['id'].lower() + '.json')
        public_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        summary = {k: v for k, v in report.items() if k not in ['sections', 'figures']}
        summary['sectionCount'] = len(report['sections'])
        summary['figurePageCount'] = sum(s['hasFigures'] for s in report['sections']) + len(figures)
        catalog.append(summary)
        (directory / 'verified.json').write_text(json.dumps({'originalUnchanged': True, 'privacyCheck': 'passed', 'paragraphInclusion': 'passed' if source.suffix != '.pdf' else 'all PDF pages retained', 'readerSha256': report['readerSha256'], 'state': 'reviewed-local-copy'}, indent=2) + '\n')
        print(json.dumps({'id': report['id'], 'readerPages': report['readerPageCount'], 'bytes': report['readerByteSize'], 'sections': len(report['sections']), 'state': 'exported-reviewed-copy'}))
    Path('src/content/reports/catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
