/** Editorial storyboards. Source transcripts and translations remain immutable. */
export type Copy = { ko: string; en: string };
export const words = (ko: string, en: string): Copy => ({ ko, en });
export type SourceRef = { report: string; paragraph: string };
export type MotionStep = {
  id: string;
  beat: string;
  title: Copy;
  copy: Copy;
  date?: string;
  precision?: "year" | "month" | "day" | "period";
  kind:
    | "investment"
    | "reported-supply"
    | "information"
    | "finance"
    | "policy"
    | "analysis";
  status: Copy;
  sources: SourceRef[];
};
const ref = (paragraph: string, report = paragraph.slice(0, 3)): SourceRef => ({
  report,
  paragraph,
});
export const chinaSteps: MotionStep[] = [
  {
    id: "greenland-proposal",
    beat: "china-arctic",
    date: "2018",
    precision: "year",
    kind: "investment",
    title: words(
      "공항 제안이 접근권의 질문으로",
      "An airport proposal becomes a question of access",
    ),
    copy: words(
      "CCCC의 공항 사업 제안을 따라 중국에서 그린란드로 관계선을 그립니다. 누크·일루리사트·카코르톡은 제안의 참고 위치이며, 이 선은 화물 운항로가 아닙니다.",
      "Follow CCCC's airport proposal from China to Greenland. Nuuk, Ilulissat and Qaqortoq locate the proposal; this connection is not a freight route.",
    ),
    status: words("사업 제안 · S08 서술", "Proposal · reported in S08"),
    sources: [ref("S08-R001-P010")],
  },
  {
    id: "greenland-withdrawal",
    beat: "china-arctic",
    date: "2019-06",
    precision: "month",
    kind: "investment",
    title: words(
      "입찰 철회와 다른 투자 관계를 분리하다",
      "Separate a withdrawn bid from other investments",
    ),
    copy: words(
      "그린란드로 확대하면 세 공항이 드러납니다. 원문이 서술한 입찰 철회는 공항 제안의 상태 변화입니다. 광물 지분 관계는 별도 가지로 읽으며, 공항 사업이 완성됐다고 표시하지 않습니다.",
      "Zoom in to locate three airports. The reported withdrawal changes the airport proposal's status. Mineral equity belongs to a separate branch; the airports are not presented as completed Chinese projects.",
    ),
    status: words(
      "철회 · 광물 관계는 별도 확인",
      "Withdrawal · mineral relationship requires separate checks",
    ),
    sources: [ref("S08-R001-P010")],
  },
  {
    id: "myanmar-supply",
    beat: "china-myanmar",
    date: "2021–2022",
    precision: "period",
    kind: "reported-supply",
    title: words(
      "기업·장비·수령 주체를 연결하다",
      "Connect suppliers, equipment and recipients",
    ),
    copy: words(
      "AVIC·NORINCO·China South Industries와 미얀마 군정의 공급 관계를 살핍니다. 경로 상세에서는 구이저우 안순→윈난→샨주 남산이라는 원문 서술을 개략 순서도로 확인합니다. 실제 항적은 아닙니다.",
      "Examine the supply relationships attributed to AVIC, NORINCO and China South Industries. Route detail follows the source's Anshun → Yunnan → Namsang sequence as a schematic, not an observed track.",
    ),
    status: words(
      "원문 서술의 공급 관계 · 독립 검증 전",
      "Source-reported supply · not independently verified",
    ),
    sources: [ref("S08-R003-P001")],
  },
  {
    id: "myanmar-diplomacy",
    beat: "china-myanmar",
    date: "2024-08",
    precision: "month",
    kind: "analysis",
    title: words(
      "장비 공급과 외교적 해석은 다르다",
      "Supply and diplomatic interpretation are different",
    ),
    copy: words(
      "물자 공급의 이동점을 멈추고 외교적 접촉과 정권 생존에 관한 분석선을 분리합니다. 무엇이 공급됐다는 서술과 왜 개입했는가에 대한 저자의 해석은 같은 수준의 증거가 아닙니다.",
      "Stop the supply marker and separate diplomatic contact from the author's interpretation of regime survival. A report of supplied equipment and an explanation of state intent are different evidentiary claims.",
    ),
    status: words(
      "저자의 분석 · 인과 확인 아님",
      "Author's analysis · not causal confirmation",
    ),
    sources: [ref("S08-R003-P001")],
  },
  {
    id: "cambodia-relations",
    beat: "china-cambodia",
    date: "2025-04-05",
    precision: "day",
    kind: "investment",
    title: words(
      "기업·사업·시설을 함께 살펴보다",
      "Read the firm, development and facility together",
    ),
    copy: words(
      "캄보디아로 시선을 옮겨 Prince Group·Canopy Sands의 개발과 Ream 시설을 구분합니다. 날짜는 S08이 서술한 개소식입니다. 인접성은 자금·통제·국가 지시의 증명이 아니며, 구체적인 수송 항로를 덧붙이지 않습니다.",
      "Move to Cambodia and distinguish Prince Group / Canopy Sands development from the Ream facility. The date is the opening reported in S08. Proximity does not establish finance, control or state instruction; no shipping route is invented.",
    ),
    status: words(
      "기업·사업 관계 · 시설 경계 원자료 없음",
      "Business relationship · underlying site boundaries not supplied",
    ),
    sources: [ref("S08-R002-P002")],
  },
  {
    id: "china-comparison",
    beat: "china-cambodia",
    date: "2018–2025",
    precision: "period",
    kind: "analysis",
    title: words(
      "세 지역, 같은 네 가지 질문",
      "Three places, four shared questions",
    ),
    copy: words(
      "기업·주체, 사업·공급 관계, 국가 전략에 대한 해석, 확인 가능한 범위를 비교합니다. 공통 질문은 있지만 세 사례가 하나의 운송 작전이거나 서로의 원인이라는 뜻은 아닙니다.",
      "Compare actors, business or supply relationships, interpretations of state strategy and evidence scope. A shared question does not make these cases a single transport operation or prove that one caused another.",
    ),
    status: words(
      "비교 프레임 · 저자의 분석",
      "Comparative framework · author's analysis",
    ),
    sources: [ref("S08-R001-P010"), ref("S08-R003-P001"), ref("S08-R002-P002")],
  },
  {
    id: "china-replay",
    beat: "china-cambodia",
    date: "2018–2025",
    precision: "period",
    kind: "analysis",
    title: words(
      "시간순으로 되짚으며 연결의 의미를 묻다",
      "Revisit the sequence and question the connections",
    ),
    copy: words(
      "아래 사건 목차나 탐색 바로 장면을 되짚어 보세요. 간격과 이동 속도는 설명의 진행을 뜻하며 실제 기간·운송 시간·투자 규모를 나타내지 않습니다. 각 장면에서 원문 문맥까지 이어 읽을 수 있습니다.",
      "Revisit a scene with the event index or scrubber. Spacing and movement represent the explanation, not elapsed years, transport time or investment size. Each scene links to its source in context.",
    ),
    status: words(
      "시간순 사건 탐색 · 실제 시간 축 아님",
      "Chronological event index · not a scaled time axis",
    ),
    sources: [ref("S08-R001-P010"), ref("S08-R003-P001"), ref("S08-R002-P002")],
  },
];
export function sourceHref(step: MotionStep, source: SourceRef) {
  return `/reports/${source.report}?from=${step.beat}#${source.paragraph}`;
}
