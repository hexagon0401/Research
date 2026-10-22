import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { reports, reportTitlesEn } from "@/content/report-catalog";
import { getReport } from "@/content/report-repository";
import { getReadingEdition } from "@/content/reading-repository";
import type { ReadingTable as TableData } from "@/content/reading-tables";
import { Localized as L } from "@/components/preferences";
import { ParallelReading } from "@/components/parallel-reading";
import { PdfReader } from "@/components/pdf-reader";
import { ReadingReturn } from "@/components/reading-return";
import { researchConnections } from "@/content/research-connections";

export function generateStaticParams() { return reports.map((r) => ({ id: r.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const source = reports.find((r) => r.id === id);
  return { title: source?.title ?? "Report not found", description: source?.description };
}
function Highlight({ text, terms, href, label }: { text: string; terms: string[]; href: string; label: string }) {
  const term = terms.find((value) => text.includes(value));
  if (!term) return <>{text}</>;
  const at = text.indexOf(term);
  return <>{text.slice(0, at)}<mark><Link href={href} title={label}>{term}</Link></mark>{text.slice(at + term.length)}</>;
}
function ReadingTable({ table, language }: { table: TableData; language: "ko" | "en" }) {
 return <div className="reading-table-scroll" tabIndex={0} role="region" aria-label={language === "ko" ? "원문 표 · 가로로 스크롤할 수 있습니다" : "Source table · scroll horizontally"}><table><caption>{table.caption[language]}</caption><thead><tr>{table.headers[language].map((h,i) => <th key={i} scope="col">{h}</th>)}</tr></thead><tbody>{table.rows.map((row,i) => <tr key={i}>{row[language].map((cell,j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const r = await getReport((await params).id);
  if (!r) notFound();
  const reading = await getReadingEdition(r.id);
  const connection = researchConnections[r.id];
  const preferredTerm = connection?.termsKo.find((term) => reading.paragraphs.some((p) => p.ko.length > 90 && p.ko.includes(term)));
  const placed = new Set<string>();
  let highlighted = 0;
  const paired = reading.paragraphs.filter((p) => !p.suppressedBy).map((p) => {
    const aliases = [...p.sourceBlockIds, ...(p.aliasIds ?? [])].filter((id) => !placed.has(id));
    aliases.forEach((id) => placed.add(id));
    const highlightedHere = highlighted < 3 && p.ko.length > 90 && Boolean(preferredTerm && p.ko.includes(preferredTerm));
    if (highlightedHere) highlighted += 1;
    return { ...p, aliases, highlightedHere };
  });
  return (
    <main id="main" className="section-shell report-page reading-page">
      <header className="page-intro">
        <Link href="/archive" className="back-link">← <L en="Research archive" ko="연구 아카이브" /></Link>
        <span className="eyebrow">{r.id} / {r.year} / FULL TEXT</span>
        <h1 lang="ko">{r.title}</h1>
        <p lang="en" className="report-title-translation">{reportTitlesEn[r.id]}</p>
        <p lang="ko">{r.description}</p>
        {connection && <p className="report-connection"><span className="eyebrow"><L en="ONE CONNECTED INQUIRY" ko="하나로 이어지는 연구" /></span><L ko={connection.ko} en={connection.en} /> <ReadingReturn fallback={connection.scene} /></p>}
        <p className="report-caption"><L en="Korean: layout corrected, wording preserved. English: editorial translation, pending author review. Personal identifiers removed." ko="한국어: 서식 교정·표현 보존. 영어: 편집 번역·저자 최종 검수 전. 개인 식별정보 제거." /></p>
        <details className="reading-disclosure"><summary><L en="About this edition and its sources" ko="이 전사본과 출처 안내" /></summary>
          <p><L en="The source's claims and draft notes are preserved, including statements that have not been independently verified. Translation does not validate those claims. Numerical analyses have not been reproduced." ko="독립적으로 검증되지 않은 주장과 초안 메모를 포함해 원문의 내용을 보존했습니다. 번역 제공은 주장의 검증을 뜻하지 않으며 수치 분석을 재현하지 않았습니다." /></p>
          {r.titleType === "catalogue" && <p><L en="This is an editorial catalogue title, not necessarily the document's original printed title." ko="목록용 편집 제목이며 원본에 인쇄된 제목과 다를 수 있습니다." /></p>}
          <p className="mono">ORIGINAL SHA-256: {r.originalSha256}<br />PDF SHA-256: {r.readerSha256}</p>
          <Link href="/methods"><L en="Methods & limitations ↗" ko="방법론과 한계 ↗" /></Link>
        </details>
        <nav className="report-actions" aria-label="Reading shortcuts"><a className="inline-link" href="#transcript"><L en="Read the full text ↓" ko="전문 읽기 ↓" /></a><a className="inline-link" href="#reading-pdf"><L en="PDF viewer & download ↓" ko="PDF 뷰어·다운로드 ↓" /></a></nav>
      </header>
      <nav className="reading-toc" aria-label="Report contents"><span><L en="Source locations" ko="원문 위치" /></span>{r.sections.map((s) => <a key={s.id} href={`#${s.id}`}><L en={r.locator === "page" ? `p. ${s.number}` : `§ ${s.number}`} ko={r.locator === "page" ? `${s.number}쪽` : `구간 ${s.number}`} /></a>)}</nav>
      <div id="transcript" className="report-transcript">
        <ParallelReading>
          {r.sections.map((s) => <section key={s.id} id={s.id} className="transcript-section reading-section">
            <h2 className="reading-location"><a href={`#${s.id}`}>{r.id} · <L en={r.locator === "page" ? `Source page ${s.number}` : `Source paragraph group ${s.number}`} ko={r.locator === "page" ? `원문 ${s.number}쪽` : `원문 문단 묶음 ${s.number}`} /></a></h2>
            {paired.filter((p) => p.sectionId === s.id).map((p) => <section id={p.id} key={p.id} className={`reading-pair transcript-${p.kind}`} data-reading-pair data-connected={p.highlightedHere ? "true" : undefined} aria-label={p.id}>
              {p.aliases.map((id) => <span key={id} id={id} className="legacy-reading-anchor" />)}
              <div className="reading-ko" lang="ko">{p.kind !== "body" && <span className="reading-note-label">{p.kind === "memo" ? "원문 메모" : p.kind === "running-header" ? "원문 머리말" : p.kind === "field-label" ? "원문 항목" : "원문 각주"}</span>}{p.table ? <ReadingTable table={p.table} language="ko" /> : <p>{p.highlightedHere && connection ? <Highlight text={p.ko} terms={connection.termsKo} href={`/#${connection.scene}`} label={connection.ko} /> : p.ko}</p>}</div>
              <div className="reading-en" lang="en">{p.kind !== "body" && <span className="reading-note-label">{p.kind === "memo" ? "Source memo" : p.kind === "running-header" ? "Source header" : p.kind === "field-label" ? "Source field" : "Source note"}</span>}{p.table ? <ReadingTable table={p.table} language="en" /> : <p>{p.en ? p.highlightedHere && connection ? <Highlight text={p.en} terms={connection.termsEn} href={`/#${connection.scene}`} label={connection.en} /> : p.en : <span className="translation-pending">Editorial translation in progress.</span>}</p>}</div>
              {p.highlightedHere && connection && <p className="reading-context"><Link href={`/#${connection.scene}`}><L ko={connection.ko} en={connection.en} /> ↗</Link></p>}
            </section>)}
            {s.preview && <details className="report-preview"><summary><L en="Source figures and page layout" ko="이 쪽의 도표·배치 확인" /></summary><figure><Image unoptimized loading="lazy" src={s.preview.src} width={s.preview.width} height={s.preview.height} sizes="(max-width: 768px) 100vw, 850px" alt={s.preview.alt} /><figcaption><L en={`De-identified source copy, page ${s.number}. Figures are as reported, not independently reproduced.`} ko={`개인정보 제거 사본 ${s.number}쪽. 원문 도표이며 수치를 독립적으로 재현한 결과가 아닙니다.`} /></figcaption></figure></details>}
          </section>)}
        </ParallelReading>
        {r.figures.length > 0 && <section className="report-figures"><h2><L en="Figures supplied with the document" ko="원문에 포함된 도판" /></h2>{r.figures.map((f) => <figure key={f.src}><Image unoptimized loading="lazy" src={f.src} width={f.width} height={f.height} alt={f.alt} sizes="(max-width: 768px) 100vw, 850px" /></figure>)}</section>}
      </div>
      {r.readerUrl && <PdfReader url={r.readerUrl} title={`${r.id} ${r.title}`} format={r.format} />}
      <nav className="reader-next"><Link href="/archive">← <L en="All research" ko="모든 연구" /></Link>{connection && <ReadingReturn fallback={connection.scene} />}</nav>
    </main>
  );
}
