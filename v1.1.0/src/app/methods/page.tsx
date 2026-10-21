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
            en="Two planning documents and thirteen distinct report files were inspected. S00, S01, S02, S03, S05, S06, S08 and S11 match the plan's subjects. Additional or different documents use S13–S17. S04, S07, S09, S10 and S12 have not been supplied; similarly named files are not assumed identical. The report archive preserves page or paragraph locators, source checksums and de-identification notices. Raw datasets and execution logs remain unverified."
            ko="계획 문서 2개와 서로 다른 보고서 파일 13개를 확인했습니다. S00·S01·S02·S03·S05·S06·S08·S11은 계획의 해당 주제와 연결되며, 추가 자료와 다른 내용의 문서는 S13–S17로 구분했습니다. S04·S07·S09·S10·S12는 아직 미제공이며 비슷한 파일명을 동일한 원문으로 간주하지 않습니다. 원문 자료실에는 쪽·문단 위치, 출처 해시, 개인정보 처리 설명을 남겼습니다. 원시 데이터와 실행 기록의 재현 검증은 완료되지 않았습니다."
          />
        </p>
        <p>
          <Link className="inline-link" href="/reports">
            <L en="Read the source transcripts" ko="원문 전사본 읽기" /> ↗
          </Link>
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
