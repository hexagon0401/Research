import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../src/content/',import.meta.url);
const read = async (name)=>JSON.parse(await readFile(new URL(name,root),'utf8'));
const normalize=(s)=>s.replace(/[\s\u200b\ufeff]/gu,'');
const count=(s)=>{const c=new Map();for(const ch of s)c.set(ch,(c.get(ch)??0)+1);return c;};
const difference=(a,b)=>[...new Set([...a.keys(),...b.keys()])].filter(ch=>a.get(ch)!==b.get(ch));
const hash=(s)=>createHash('sha256').update(s).digest('hex');
const catalogue=await read('reports/catalog.json');
const manifest={revision:'reading-002',translationStatus:'editorial-author-review-pending',reports:[],totalParagraphs:0};
for(const report of catalogue){
 const name=report.id.toLowerCase();const raw=await read(`reports/${name}.json`);const edition=await read(`readings/${name}.json`);const translated=await read(`translations/${name}.json`);
 const allowed=new Set(raw.sections.flatMap(s=>s.blocks.map(b=>b.id)));const covered=new Set();const ids=new Set();
 let source=raw.sections.flatMap(s=>s.blocks.map(b=>b.text.replace(/^\s*[-–—]\s*\d+\s*[-–—]\s*$/gm,''))).join('');
 for(const header of edition.omittedRunningHeaders??[]){if(!source.includes(header.text))throw new Error(`Missing header provenance ${report.id}`);source=source.replace(header.text,'');}
 for(const correction of edition.glyphCorrections??[]){if(correction.from!=='U+E09D'||correction.to!=='α')throw new Error(`Unreviewed glyph correction ${report.id}`);source=source.replaceAll('\ue09d','α');}
 let destination='';
 for(const p of edition.paragraphs){
  if(ids.has(p.id))throw new Error(`Duplicate reading ID ${p.id}`);ids.add(p.id);
  if(hash(p.ko)!==p.sourceTextSha256)throw new Error(`Incorrect text fingerprint ${p.id}`);
  for(const id of p.sourceBlockIds){if(!allowed.has(id))throw new Error(`Unknown source anchor ${id}`);covered.add(id);}
  const en=translated.paragraphs[p.id];
  if(!en?.en?.trim()||en.sourceTextSha256!==p.sourceTextSha256)throw new Error(`Missing or stale English ${p.id}`);
  const text=en.en.replace(/https?:\/\/\S+/g,'');
  if(/[가-힣]/u.test(text))throw new Error(`Untranslated Korean in English ${p.id}`);
  destination+=p.ko;
 }
 const changed=difference(count(normalize(source)),count(normalize(destination)));
 if(changed.length)throw new Error(`Source character loss/change ${report.id}: ${changed.join(' ')}`);
 for(const s of raw.sections)for(const b of s.blocks)if(b.text.trim()&&!covered.has(b.id))throw new Error(`Unmapped original block ${b.id}`);
 if(!translated.complete||translated.sourceCount!==ids.size||translated.translatedCount!==ids.size)throw new Error(`Incorrect coverage status ${report.id}`);
 manifest.reports.push({id:report.id,paragraphCount:ids.size,translatedCount:ids.size,sourceCharacterCoverage:'complete',translationStatus:manifest.translationStatus});manifest.totalParagraphs+=ids.size;
}
if(process.argv.includes('--write-manifest'))await writeFile(new URL('readings/manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
console.log(`${manifest.reports.length} reports · ${manifest.totalParagraphs} bilingual passages · source characters preserved · translation fingerprints current`);
