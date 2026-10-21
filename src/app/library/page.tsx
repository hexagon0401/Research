import type { Metadata } from "next";
import { Localized as L } from "@/components/preferences";
import { Collection } from "@/components/collection";
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
            en="Original reports, licensed PDFs and reviewed translations have not been supplied. Unavailable items are described as reference leads; no full text is reproduced."
            ko="연구 원문, 이용 허가된 PDF, 검수 번역은 아직 제공되지 않았습니다. 미확보 자료는 참고자료 후보로 표시하며 전문을 복제하지 않습니다."
          />
        </div>
      </div>
      <section className="collection" aria-label="Reference search">
        <Collection kind="library" />
      </section>
    </main>
  );
}
