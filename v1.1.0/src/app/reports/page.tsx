import type { Metadata } from "next";
import Link from "next/link";
import { ReportList } from "@/components/report-list";
import { Localized as L } from "@/components/preferences";
import { reports } from "@/content/report-catalog";
export const metadata: Metadata = {
  title: "Original report transcripts",
  description:
    "Read de-identified Korean research reports, with original locators and reading PDFs.",
};
export default function Reports() {
  return (
    <main id="main" className="section-shell">
      <div className="page-intro">
        <Link href="/library" className="back-link">
          ← <L en="Reference library" ko="자료실" />
        </Link>
        <span className="eyebrow">
          SOURCE ARCHIVE / {reports.length} REPORTS
        </span>
        <h1>
          <L en="Read the source." ko="원문을 직접 읽기." />
        </h1>
        <p>
          <L
            en="Korean source transcripts, not a new synthesis or a reviewed translation. Personal identifiers are removed; research claims retain their original, unverified status."
            ko="새로 쓴 통합 보고서나 검수 번역이 아닌, 한국어 원문 전사본입니다. 개인 식별정보를 제거했으며 연구 주장은 원문 그대로 미검증 상태로 구분합니다."
          />
        </p>
        <div className="callout">
          <L
            en="PDF text layers may omit lettering inside figures. Page previews and the de-identified PDF preserve the figures. Word and HWPX copies reflow paragraphs, notes and tables; their original pagination is not asserted."
            ko="PDF 전사에는 이미지 안의 글자가 빠질 수 있습니다. 쪽 이미지와 개인정보 제거 PDF에서 도표를 확인할 수 있습니다. DOCX·HWPX는 문단·메모·각주·표를 풀어 썼으며 원래 쪽 배치를 재현하지 않습니다."
          />
        </div>
      </div>
      <section className="page-content" aria-label="Report transcripts">
        <ReportList />
      </section>
    </main>
  );
}
