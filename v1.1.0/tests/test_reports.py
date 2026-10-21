import hashlib
import importlib.util
import tempfile
import unittest
import zipfile
from pathlib import Path

import fitz

spec = importlib.util.spec_from_file_location('reports', Path(__file__).parents[1] / 'scripts/report-documents.py')
reports = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reports)


class ReportTests(unittest.TestCase):
    def test_hwpx_nested_table_and_memo_are_not_duplicated_in_outer_paragraph(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'fixture.hwpx'
            with zipfile.ZipFile(source, 'w') as archive:
                archive.writestr('Contents/section0.xml', '<sec><p><run><t>Outer<lineBreak/>line</t><tbl><p><run><t>Cell</t></run></p></tbl><fieldBegin type="MEMO"><subList><p><run><t>Note</t></run></p></subList></fieldBegin></run></p></sec>')
            blocks = reports.xml_blocks(source)
            self.assertEqual([b['text'] for b in blocks], ['Outer\nline', 'Cell', 'Note'])
            self.assertEqual([b['kind'] for b in blocks], ['body', 'body', 'memo'])

    def test_word_footnotes_and_references_are_retained(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'fixture.docx'
            with zipfile.ZipFile(source, 'w') as archive:
                archive.writestr('word/document.xml', '<doc><p><r><t>Claim</t><footnoteReference id="1"/></r></p></doc>')
                archive.writestr('word/footnotes.xml', '<notes><footnote id="1"><p><r><t>Actual reference</t></r></p></footnote></notes>')
            blocks = reports.xml_blocks(source)
            self.assertEqual(blocks[0]['text'], 'Claim[각주 1]')
            self.assertEqual(blocks[1]['kind'], 'note')
            self.assertIn('Actual reference', blocks[1]['text'])

    def test_xml_entities_are_not_accepted(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'fixture.docx'
            with zipfile.ZipFile(source, 'w') as archive:
                archive.writestr('word/document.xml', '<!DOCTYPE doc [<!ENTITY x SYSTEM "file:///unavailable">]><doc><p><t>&x;</t></p></doc>')
            with self.assertRaises(ValueError):
                reports.xml_blocks(source)

    def test_pdf_redaction_removes_identifier_bytes_and_preserves_original(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'original.pdf'
            target = Path(directory) / 'reader.pdf'
            doc = fitz.open()
            page = doc.new_page()
            page.insert_text((50, 50), 'Student A / 3123')
            page.insert_text((50, 100), 'Research value: 0.17')
            doc.set_metadata({'author': 'Student A'})
            doc.save(source)
            doc.close()
            original = hashlib.sha256(source.read_bytes()).hexdigest()
            sections, count = reports.prepare_pdf(source, target, ['Student A', '3123'])
            self.assertGreater(count, 0)
            self.assertIn('Research value: 0.17', sections[0]['blocks'][0]['text'])
            self.assertNotIn('Student A', sections[0]['blocks'][0]['text'])
            with fitz.open(target) as reviewed:
                self.assertFalse(reviewed.metadata.get('author'))
            self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), original)


if __name__ == '__main__':
    unittest.main()
