import type { Metadata } from "next";
import { Localized as L } from "@/components/preferences";
import { ResearchShelf } from "@/components/material-shelf";
import Link from "next/link";
import { reports } from "@/content/report-catalog";
export const metadata: Metadata = { title: "Reference library" };
export default function Library() {
  return (
    <main id="main" className="section-shell">
      <div className="page-intro">
        <span className="eyebrow">THE LIBRARY / SOURCES & REFERENCE LEADS</span>
        <h1>
          <L
            en={
              <>
                The ideas behind
                <br />
                the inquiry.
              </>
            }
            ko={
              <>
                탐구를 뒷받침할
                <br />
                자료와 생각들.
              </>
            }
          />
        </h1>
        <p>
          <L
            en="Planning documents are separated from external reference leads. A citation in a plan is not proof that the underlying source has been obtained or verified."
            ko="계획 문서와 외부 참고자료 후보를 구분합니다. 계획에 인용되어 있다는 사실이 원자료의 확보나 검증을 의미하지는 않습니다."
          />
        </p>
        <div className="callout">
          <L
            en={`${reports.length} supplied research reports are available as de-identified Korean transcripts. External publications below remain reference leads; reviewed translations and raw analysis datasets are still unavailable.`}
            ko={`제공된 연구 보고서 ${reports.length}개를 개인정보 제거 한국어 전사본으로 열람할 수 있습니다. 아래 외부 문헌은 참고자료 후보이며 검수 번역과 분석 원시 데이터는 아직 미확보 상태입니다.`}
          />
          <p>
            <Link className="inline-link" href="/reports">
              <L
                en="Read original report transcripts"
                ko="연구 원문 전사본 열기"
              />{" "}
              ↗
            </Link>
          </p>
        </div>
      </div>
      <section className="collection" aria-label="Reference search">
        <ResearchShelf kind="library" />
      </section>
    </main>
  );
}
