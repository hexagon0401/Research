import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile
spec=importlib.util.spec_from_file_location('intake',Path(__file__).parents[1]/'scripts/intake-originals.py')
intake=importlib.util.module_from_spec(spec)
spec.loader.exec_module(intake)

class IntakeTests(unittest.TestCase):
 def test_docx_is_preserved_and_extraction_stays_private_and_draft(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'fixture.docx';output=root/'.local/intake'
   with zipfile.ZipFile(source,'w') as archive:
    archive.writestr('word/document.xml','<document xmlns:w="urn:test"><w:p><w:r><w:t>Intake fixture only</w:t></w:r></w:p></document>')
   original=source.read_bytes();result=intake.inspect_report(source,output)
   destination=output/result['sha256']
   self.assertEqual((destination/'original.docx').read_bytes(),original)
   self.assertEqual((destination/'extracted.txt').read_text(),'Intake fixture only')
   record=json.loads((destination/'intake.json').read_text())
   self.assertEqual(record['publicationState'],'draft');self.assertEqual(record['privacyReview'],'pending')
   self.assertEqual(record['rightsReview'],'pending')
   self.assertEqual(intake.inspect_report(source,output)['sha256'],result['sha256'])
 def test_public_destinations_and_renamed_files_are_rejected(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'fake.pdf';source.write_text('Not a PDF')
   with self.assertRaises(ValueError):intake.inspect_report(source,root/'.local/intake')
   source.write_bytes(b'%PDF-1.4\n')
   with self.assertRaises(ValueError):intake.inspect_report(source,root/'public/.local/intake')
 def test_hwp_is_not_claimed_as_extracted(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'fixture.hwp';source.write_bytes(bytes.fromhex('d0cf11e0a1b11ae1')+b'fixture')
   result=intake.inspect_report(source,root/'.local/intake')
   self.assertEqual(result['extractionStatus'],'HWP_PARSER_REQUIRED')
   self.assertFalse((root/'.local/intake'/result['sha256']/'extracted.txt').exists())

if __name__=='__main__':unittest.main()
