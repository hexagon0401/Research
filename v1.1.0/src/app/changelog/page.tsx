import type { Metadata } from "next";
import { Localized as L } from "@/components/preferences";
export const metadata: Metadata = { title: "Site editions" };
const releases = [
  [
    "2.7.0",
    "원문 보존 강조·출처 수치·연구 연결 모션",
    "Text-preserving emphasis, source figures and connected research motion",
  ],
  [
    "2.6.1",
    "국가 관계의 곡선 분리·지도 지연 로딩·주소 오류 복구",
    "Separated geographic arcs, lazy terrain and anchor recovery",
  ],
  [
    "2.6.0",
    "원문 안내·빠른 읽기·검토자 요약과 인용",
    "Source guide, quick reading, reviewer brief and citations",
  ],
  [
    "2.5.0",
    "S00 표지·자료실·장 번호의 스위스 편집 체계",
    "Swiss folio cover, archive and chapter hierarchy",
  ],
  [
    "2.4.4",
    "저자 소개·용어집·출처 안내와 읽기 개선",
    "Author context, glossary, source guidance and reading refinements",
  ],
  [
    "2.4.3",
    "PCA·공항 표시·기록과 해석 비교 도구 수정",
    "PCA, airport markers and evidence-comparison fixes",
  ],
  [
    "2.4.2",
    "지구본 비율·지도 경로와 스크롤 최적화",
    "Globe proportions, map paths and scroll optimization",
  ],
  [
    "2.4.1",
    "그림 고정·지역 확대·한영 편집",
    "Persistent diagrams, regional cameras and bilingual editing",
  ],
];
export default function Changelog() {
  return (
    <main id="main" className="editorial">
      <header className="page-intro">
        <span className="eyebrow">IIR / EDITIONS</span>
        <h1>
          <L ko="사이트 변경 기록" en="Site editions" />
        </h1>
        <p>
          <L
            ko="연구 원문과 사이트의 편집·열람 기능 변경을 구분해 기록한다."
            en="Site reading and presentation changes are recorded separately from the preserved research originals."
          />
        </p>
      </header>
      <ol className="edition-list">
        {releases.map(([v, ko, en]) => (
          <li key={v}>
            <h2>v{v}</h2>
            <p>
              <L ko={ko} en={en} />
            </p>
            <a href={`https://github.com/hexagon0401/Research/tree/v${v}`}>
              <L ko="이 버전의 코드" en="Code for this edition" />
            </a>
          </li>
        ))}
      </ol>
      <p>
        <a href="https://github.com/hexagon0401/Research/blob/main/CHANGELOG.md">
          <L ko="전체 Git 변경 기록" en="Full change history" />
        </a>
      </p>
    </main>
  );
}
