"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Localized as L } from "./preferences";
const PdfCanvas = dynamic(() => import("./pdf-canvas"), {
  ssr: false,
  loading: () => <p role="status">Loading PDF viewer… / PDF 뷰어를 준비합니다.</p>,
});
export function PdfReader({ url, title, format }: { url: string; title: string; format: string }) {
  const [open, setOpen] = useState(false);
  return (
    <section id="reading-pdf" className="reading-pdf" aria-label="Source PDF">
      <span className="eyebrow">THE DOCUMENT / PDF</span>
      <h2><L en="Return to the document." ko="문서의 모습으로 읽기." /></h2>
      <p><L en={format === "pdf" ? "A copy with personal identifiers removed. The document's layout is preserved." : "A PDF reading copy converted from the supplied document. Its layout has been reflowed."} ko={format === "pdf" ? "개인 식별정보를 제거한 원문 PDF입니다. 문서의 배치를 보존했습니다." : "제공된 문서를 PDF로 변환한 열람본입니다. 읽기용으로 서식을 재배치했습니다."} /></p>
      <div className="report-actions">
        <button className="pdf-toggle" aria-expanded={open} aria-controls="inline-pdf" onClick={() => setOpen(!open)}>
          <L en={open ? "Close PDF viewer ↑" : "Read the PDF here ↓"} ko={open ? "PDF 접기 ↑" : "PDF 펼쳐 보기 ↓"} />
        </button>
        <a className="inline-link" href={url} download={`${title}.pdf`}><L en="Download PDF" ko="PDF 다운로드" /> ↓</a>
      </div>
      <div id="inline-pdf" hidden={!open}>{open && <PdfCanvas url={url} title={title} />}</div>
    </section>
  );
}
