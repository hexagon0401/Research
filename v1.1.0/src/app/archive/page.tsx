import type { Metadata } from "next";
import Link from "next/link";
import { Localized as L } from "@/components/preferences";
import { ResearchShelf } from "@/components/material-shelf";
export const metadata: Metadata = {
  title: "Research archive",
  description:
    "Thirteen connected studies. Korean full text, English editorial translations and source PDFs.",
};
export default function Archive() {
  return (
    <main id="main" className="section-shell archive-reading-index">
      <header className="page-intro">
        <span className="eyebrow">THE ARCHIVE / 13 CONNECTED STUDIES</span>
        <h1>
          <L
            en={
              <>
                Many studies.
                <br />
                One inquiry.
              </>
            }
            ko={
              <>
                여러 연구가,
                <br />
                하나의 질문으로.
              </>
            }
          />
        </h1>
        <p>
          <L
            en="Read the full studies behind the main argument. Korean originals and English editorial translations sit side by side, with a source PDF at the end of every report."
            ko="메인의 논지를 만든 연구 전문을 읽어보세요. 한국어 전사와 영어 편집 번역을 나란히 읽고, 각 연구의 마지막에서 원문 PDF를 펼칠 수 있습니다."
          />
        </p>
        <Link className="inline-link" href="/#integration">
          <L
            en="See how the studies connect ↗"
            ko="연구가 연결되는 과정 보기 ↗"
          />
        </Link>
      </header>
      <section className="page-content" aria-label="Full research reports">
        <ResearchShelf kind="archive" />
      </section>
    </main>
  );
}
