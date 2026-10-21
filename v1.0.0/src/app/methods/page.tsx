import type { Metadata } from "next";
import Link from "next/link";
import { Localized as L } from "@/components/preferences";
import { evidenceNeeds } from "@/content/repository";
export const metadata: Metadata = { title: "Evidence, methods & limitations" };
export default function Methods() {
  return (
    <main id="main" className="editorial">
      <div className="page-intro">
        <span className="eyebrow">METHODS / AN AUDITABLE INQUIRY</span>
        <h1>
          <L
            en={
              <>
                Show the work.
                <br />
                Name the limits.
              </>
            }
            ko={
              <>
                과정을 공개하고,
                <br />
                한계를 밝힙니다.
              </>
            }
          />
        </h1>
        <p>
          <L
            en="The current site presents a research framework derived from two planning documents. It does not present completed statistical analysis, verified case relationships or a finished integrated report."
            ko="현재 사이트는 두 계획 문서에서 도출한 연구 프레임워크를 보여줍니다. 완료된 통계 분석, 검증된 사례 관계, 완성된 통합 보고서를 제시하지 않습니다."
          />
        </p>
      </div>
      <div className="prose page-content">
        <h2>
          <L en="What has been inspected" ko="직접 확인한 자료" />
        </h2>
        <p>
          <L
            en="The website specification and the Integrated Independent Research handoff were read. The handoff lists thirteen underlying source items (S00–S12), but those files are not attached to this project. Descriptions of them remain secondhand inventory entries."
            ko="사이트 명세와 Integrated Independent Research 작업계획을 읽었습니다. 작업계획에는 원자료 13개(S00–S12)가 기재되어 있지만, 이번 프로젝트에 해당 파일은 첨부되지 않았습니다. 해당 자료에 대한 설명은 작업계획의 간접적 기록입니다."
          />
        </p>
        <h2>
          <L
            en="A status is part of the claim"
            ko="검증 상태도 주장의 일부입니다"
          />
        </h2>
        <div className="status-legend">
          {[
            [
              "Supported",
              "검토할 수 있는 구체적인 근거가 확보된 주장. 현재 초안에서는 이 상태의 실증 결과를 제시하지 않습니다.",
            ],
            [
              "Interpreted",
              "자료에 대한 저자의 해석 또는 규범적 정책 제안. 실증 결과와 구분합니다.",
            ],
            [
              "Hypothesis",
              "앞으로 검증할 관계. 개념도의 화살표가 실제 인과관계를 입증하지 않습니다.",
            ],
            [
              "Unverified",
              "원문·데이터·재현 정보 또는 외부 검증이 아직 확보되지 않은 상태입니다.",
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p lang="ko">{text}</p>
            </div>
          ))}
        </div>
        <h2>
          <L en="Verification work still required" ko="앞으로 필요한 검증" />
        </h2>
        <p>
          <L
            en="The following are requirements from the handoff, not analyses executed by this website. Numerical graphics will be added only when inputs, units, methods and reproducible outputs are available."
            ko="아래는 작업계획에 기재된 요구사항이며, 사이트 제작 중 실행한 분석은 아닙니다. 입력 자료·단위·방법·재현 가능한 결과를 확보한 뒤에만 수치 그래프를 추가합니다."
          />
        </p>
        <div className="method-list">
          {evidenceNeeds.map((e) => (
            <section className="method-item" id={e.id} key={e.id}>
              <span className="eyebrow">
                {e.id} / {e.priority} / NOT SUPPLIED
              </span>
              <h3>{e.title}</h3>
              <p>{e.needed}</p>
            </section>
          ))}
        </div>
        <h2>
          <L en="Translation & editorial policy" ko="번역과 편집 정책" />
        </h2>
        <p>
          <L
            en="The Korean planning excerpts retain stable paragraph IDs. No reviewed English translations were supplied, so the English reader explicitly falls back to Korean. English titles, descriptions and summaries elsewhere are editorial navigation copy, not reviewed translations or research findings."
            ko="한국어 발췌문에는 고정 문단 ID를 부여했습니다. 검수된 영어 번역은 제공되지 않아 영어 리더에서도 번역 대기를 알리고 한국어 원문을 표시합니다. 영어 제목과 설명은 탐색을 위한 편집 문구이며, 검수 번역이나 연구 결과가 아닙니다."
          />
        </p>
        <h2>
          <L en="Map & visual semantics" ko="지도와 도식의 의미" />
        </h2>
        <p>
          <L
            en="The SVG map uses public-domain Natural Earth geometry via world-atlas. Country markers are approximate geographic label positions. They identify comparison scope only; they do not locate firms, military events, transactions or verified relationships. Dashed lines in the conceptual model denote hypotheses or normative boundary conditions."
            ko="SVG 지도는 world-atlas를 통한 퍼블릭 도메인 Natural Earth 지형을 사용합니다. 국가 표시는 개략적인 지리 라벨 위치로서 비교 범위만 나타냅니다. 기업·군사 사건·거래·검증된 관계의 위치가 아닙니다. 개념도의 점선은 가설 또는 규범적 경계조건입니다."
          />
        </p>
        <Link className="inline-link" href="/library/integration-handoff">
          <L en="Inspect the planning source" ko="작업계획의 출처 살펴보기" /> ↗
        </Link>
      </div>
    </main>
  );
}
