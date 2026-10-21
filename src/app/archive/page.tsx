import type { Metadata } from "next";
import { Localized as L } from "@/components/preferences";
import { Shelf } from "@/components/shelf";
import { Collection } from "@/components/collection";
export const metadata: Metadata = { title: "Research archive" };
export default function Archive() {
  return (
    <main id="main">
      <div className="section-shell page-intro">
        <span className="eyebrow">THE ARCHIVE / RESEARCH IN PROGRESS</span>
        <h1>
          <L
            en={
              <>
                Open a thread.
                <br />
                Follow the inquiry.
              </>
            }
            ko={
              <>
                하나의 질문을 열고,
                <br />
                탐구를 따라가세요.
              </>
            }
          />
        </h1>
        <p>
          <L
            en="Six parts of an evolving research framework. Read excerpts from the integration plan, trace their provenance, and see what still needs to be verified."
            ko="발전 중인 연구 프레임워크의 여섯 단계입니다. 통합 작업계획의 발췌문과 출처, 앞으로 검증할 내용을 살펴보세요."
          />
        </p>
      </div>
      <section
        className="dark-section section-shell"
        style={{ paddingBottom: 35 }}
        aria-label="Spatial research shelf"
      >
        <Shelf />
      </section>
      <section
        className="section-shell collection"
        style={{ paddingTop: 55 }}
        aria-label="Searchable document index"
      >
        <Collection kind="archive" />
      </section>
    </main>
  );
}
