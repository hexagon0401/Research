/** Presentation metadata. Research text, sources and evidence states remain in src/content. */
export type Label = { ko: string; en: string };
export const storyChapters = [
  {
    id: "origin",
    number: "01",
    title: { ko: "질문의 출발", en: "The starting question" },
    short: { ko: "출발", en: "Origins" },
    anchor: "survival",
    beats: ["survival", "identity", "capability"],
  },
  {
    id: "america",
    number: "02",
    title: { ko: "미국의 연결 방식", en: "The American connection" },
    short: { ko: "미국", en: "America" },
    anchor: "us-mission",
    beats: ["us-mission", "us-dome", "us-finance", "us-ships"],
  },
  {
    id: "china",
    number: "03",
    title: { ko: "중국과 다중스케일", en: "China, across scales" },
    short: { ko: "중국", en: "China" },
    anchor: "china-ownership",
    beats: [
      "china-ownership",
      "china-governance",
      "china-arctic",
      "china-myanmar",
      "china-cambodia",
    ],
  },
  {
    id: "korea",
    number: "04",
    title: { ko: "한국의 선택", en: "The Korean question" },
    short: { ko: "한국", en: "Korea" },
    anchor: "korea-chips",
    beats: [
      "korea-chips",
      "korea-platforms",
      "korea-regulation",
      "korea-defense",
    ],
  },
  {
    id: "method",
    number: "05",
    title: { ko: "관측과 해석 사이", en: "Observation & interpretation" },
    short: { ko: "방법", en: "Method" },
    anchor: "spatial-method",
    beats: ["spatial-method"],
  },
  {
    id: "synthesis",
    number: "06",
    title: { ko: "하나의 연구로", en: "One connected inquiry" },
    short: { ko: "종합", en: "Synthesis" },
    anchor: "synthesis",
    beats: ["synthesis"],
  },
];
export function chapterFor(id: string) {
  return (
    storyChapters.find((chapter) => chapter.beats.includes(id)) ??
    storyChapters[0]
  );
}
type Visual = {
  type: "concept" | "globe" | "world" | "arctic" | "integration";
  heading: Label;
  steps: Label[];
  note: Label;
};
const l = (ko: string, en: string): Label => ({ ko, en });
export const storyVisuals: Record<string, Visual> = {
  survival: {
    type: "concept",
    heading: l(
      "기업은 무엇으로 오래 살아남는가",
      "What enables a firm to endure?",
    ),
    steps: [
      l("독자 기술", "Technology"),
      l("재투자", "Reinvestment"),
      l("기업의 존속", "Resilience"),
    ],
    note: l(
      "검증할 메커니즘입니다. 재무적 존속과 사회적 성과는 구분합니다.",
      "A mechanism to test. Financial resilience and social outcomes are distinct.",
    ),
  },
  identity: {
    type: "concept",
    heading: l(
      "기술의 방향을 결정하는 질문",
      "What gives technology direction?",
    ),
    steps: [
      l("기술적 역량", "Capability"),
      l("기업의 목적", "Purpose"),
      l("공적 책임", "Responsibility"),
    ],
    note: l(
      "정체성과 책임을 해석하는 개념 도식입니다. 성장의 인과 증거가 아닙니다.",
      "A conceptual reading of identity and responsibility, not proof of what causes growth.",
    ),
  },
  capability: {
    type: "globe",
    heading: l(
      "기업의 역량에서 국가의 선택지로",
      "From corporate capability to national options",
    ),
    steps: [
      l("데이터", "Data"),
      l("산업 기반", "Industry"),
      l("전략적 역량", "Capability"),
    ],
    note: l(
      "기술의 존재와 특정 안보 결과를 일으켰다는 주장은 다릅니다.",
      "Possessing a technology and causing a security outcome are different claims.",
    ),
  },
  "us-mission": {
    type: "world",
    heading: l("미국 · 사명과 조달", "America · mission & procurement"),
    steps: [
      l("기업의 사명", "Mission"),
      l("정부조달", "Procurement"),
      l("제품 개발", "Development"),
    ],
    note: l(
      "Palantir·Anduril 사례의 분석 축입니다. 계약이 신념의 효과를 입증하지는 않습니다.",
      "Axes for reading Palantir and Anduril. An award does not prove the effect of a mission.",
    ),
  },
  "us-dome": {
    type: "concept",
    heading: l(
      "Golden Dome · 체계로 연결하기",
      "Golden Dome · thinking in systems",
    ),
    steps: [
      l("감지", "Sensing"),
      l("데이터·지휘", "Data & command"),
      l("요격", "Interception"),
    ],
    note: l(
      "S03·S13의 제안된 체계입니다. 확정 계약이나 배치 완료를 뜻하지 않습니다.",
      "The proposed system in S03 and S13; not a claim of awarded contracts or completed deployment.",
    ),
  },
  "us-finance": {
    type: "world",
    heading: l(
      "금융에서도 이어지는 질문",
      "The same question, through finance",
    ),
    steps: [
      l("민간 발행자", "Private issuer"),
      l("준비자산", "Reserves"),
      l("통화 네트워크", "Monetary network"),
    ],
    note: l(
      "Tether·USDT와 준비자산을 함께 읽습니다. 국채 보유가 면책을 뜻하지는 않습니다.",
      "Reading Tether, USDT and reserves together. Treasury holdings do not establish immunity.",
    ),
  },
  "us-ships": {
    type: "world",
    heading: l(
      "시장과 전략 사이의 생산 기반",
      "Industrial capacity between markets and strategy",
    ),
    steps: [
      l("시장 비용", "Market costs"),
      l("생산 기반", "Capacity"),
      l("전략적 선택", "Strategic options"),
    ],
    note: l(
      "Jones Act의 시장 참여 조건과 예산을 통한 조달은 구분합니다.",
      "Coastwise market conditions and budget-funded procurement are distinct mechanisms.",
    ),
  },
  "china-ownership": {
    type: "world",
    heading: l(
      "중국 · 지분에서 영향력으로?",
      "China · from ownership to influence?",
    ),
    steps: [
      l("투자·지분", "Investment"),
      l("실제 권한", "Authority"),
      l("의사결정", "Decisions"),
    ],
    note: l(
      "지분 관계가 곧 통제권이나 기술이전을 입증하는 것은 아닙니다.",
      "Equity stakes do not by themselves establish control or technology transfer.",
    ),
  },
  "china-governance": {
    type: "world",
    heading: l(
      "소유와 결정권을 분리해서 읽기",
      "Distinguishing ownership from decisions",
    ),
    steps: [
      l("소유 구조", "Ownership"),
      l("조직", "Organization"),
      l("결정권", "Decision rights"),
    ],
    note: l(
      "기업과 국가의 관계는 조직·제도·실제 권한을 나누어 확인합니다.",
      "Corporate–state relations require separate evidence about institutions and actual authority.",
    ),
  },
  "china-arctic": {
    type: "arctic",
    heading: l(
      "그린란드 · 하나의 장소, 여러 스케일",
      "Greenland · one place, several scales",
    ),
    steps: [
      l("기업 투자", "Investment"),
      l("지리적 접근", "Geographic access"),
      l("지역의 선택", "Local choices"),
    ],
    note: l(
      "지리적 참고 위치입니다. 관측된 선박 항적이나 확정된 투자 효과를 표시하지 않습니다.",
      "Geographic reference locations, not observed vessel tracks or proven investment effects.",
    ),
  },
  "china-myanmar": {
    type: "world",
    heading: l(
      "미얀마 · 관계의 근거를 확인하기",
      "Myanmar · examining the evidence for a relationship",
    ),
    steps: [
      l("보고된 관계", "Reported links"),
      l("출처 확인", "Source evidence"),
      l("대안 설명", "Alternatives"),
    ],
    note: l(
      "중국·미얀마는 사례의 지리적 범위입니다. 지도에 실제 운송 경로를 추가하지 않습니다.",
      "China and Myanmar locate the case. No observed shipment route is asserted on this map.",
    ),
  },
  "china-cambodia": {
    type: "world",
    heading: l(
      "캄보디아 · 인접성과 의도를 구분하기",
      "Cambodia · proximity is not intent",
    ),
    steps: [
      l("공간적 위치", "Location"),
      l("기업 활동", "Corporate activity"),
      l("주장의 근거", "Evidence"),
    ],
    note: l(
      "공간적 인접성과 기업 활동만으로 지휘 관계나 의도를 단정하지 않습니다.",
      "Spatial proximity and corporate activity do not establish command relationships or intent.",
    ),
  },
  "korea-chips": {
    type: "world",
    heading: l(
      "한국 · 기술과 제도의 교차점",
      "Korea · where technology meets institutions",
    ),
    steps: [
      l("수출통제", "Export controls"),
      l("생산·투자", "Production"),
      l("정책 선택", "Policy choices"),
    ],
    note: l(
      "미국·중국·한국의 비교 범위입니다. 삼성·SK하이닉스의 선택을 S16과 함께 읽습니다.",
      "A comparison of America, China and Korea. Read firms' choices alongside S16.",
    ),
  },
  "korea-platforms": {
    type: "concept",
    heading: l(
      "플랫폼 · 소유와 관할의 문제",
      "Platforms · ownership and jurisdiction",
    ),
    steps: [
      l("기업 소유", "Ownership"),
      l("데이터·관할", "Jurisdiction"),
      l("국가 전략", "State strategy"),
    ],
    note: l(
      "NAVER·LINE 사례에서 기업의 지분과 데이터의 관할을 구분합니다.",
      "The NAVER–LINE case distinguishes equity ownership from data jurisdiction.",
    ),
  },
  "korea-regulation": {
    type: "concept",
    heading: l(
      "규제 · 무엇을 지키고 무엇을 바꾸는가",
      "Regulation · what is protected, what changes?",
    ),
    steps: [
      l("제도 설계", "Rules"),
      l("경쟁 조건", "Competition"),
      l("소비자 선택", "Consumer choice"),
    ],
    note: l(
      "가정에 따른 정책 시나리오와 실제 관측 결과를 구분합니다. 임의 수치 차트는 없습니다.",
      "Model-based policy scenarios and observed outcomes remain distinct. No invented quantitative chart.",
    ),
  },
  "korea-defense": {
    type: "world",
    heading: l(
      "방산 · 국가 전략과 기업 성과",
      "Defense · state strategy and firm performance",
    ),
    steps: [
      l("전략적 역할", "Strategic role"),
      l("비교 지표", "Comparison"),
      l("분석의 한계", "Limitations"),
    ],
    note: l(
      "S11·S17의 논의와 지표를 연결합니다. 분석 방법과 성과의 검증 상태를 함께 읽습니다.",
      "Linking S11 and S17 while retaining their methods and verification limits.",
    ),
  },
  "spatial-method": {
    type: "concept",
    heading: l(
      "관측에서 해석으로 넘어가기 전에",
      "Before moving from observation to interpretation",
    ),
    steps: [
      l("관측", "Observe"),
      l("관계 정리", "Connect"),
      l("교차 검증", "Verify"),
    ],
    note: l(
      "위성·해상 데이터는 관측의 근거입니다. 연결 자체가 의도나 인과를 입증하지는 않습니다.",
      "Satellite and maritime data support observation. Connections alone do not prove intent or causation.",
    ),
  },
  synthesis: {
    type: "integration",
    heading: l(
      "서로 다른 연구, 하나의 질문",
      "Distinct studies, one shared question",
    ),
    steps: [
      l("기술", "Technology"),
      l("정체성", "Identity"),
      l("책임 있는 협력", "Accountability"),
    ],
    note: l(
      "실제 연구 13개의 질문과 분석 역할을 연결합니다. 같은 실험이나 같은 결과라는 뜻은 아닙니다.",
      "Connecting the questions and analytical roles of 13 studies, without treating them as one experiment.",
    ),
  },
};
export const studySpines: Record<string, Label> = {
  S00: l("통합 연구", "Synthesis"),
  S01: l("데이터 전쟁", "Data warfare"),
  S02: l("경제 안보", "Economic power"),
  S03: l("골든돔 I", "Golden Dome I"),
  S05: l("금융 신뢰", "Financial trust"),
  S06: l("기업의 존속", "Resilience"),
  S08: l("다중스케일", "Spatial inquiry"),
  S11: l("안보 질서", "Security order"),
  S13: l("골든돔 II", "Golden Dome II"),
  S14: l("철학과 정체성", "Identity"),
  S15: l("공간 데이터", "Spatial data"),
  S16: l("반도체", "Semiconductors"),
  S17: l("방산 전략", "Defense"),
};
