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
    heading: {
      ko: "기업은 무엇으로 오래 살아남는가",
      en: "What allows a company to endure?",
    },
    steps: [
      {
        ko: "독자 기술",
        en: "Technology",
      },
      {
        ko: "재투자",
        en: "Reinvestment",
      },
      {
        ko: "기업의 존속",
        en: "Resilience",
      },
    ],
    note: {
      ko: "내가 출발점으로 삼은 질문은 기업의 생존이었다. 기술 독점과 ESG·CSR을 비교하면서, 기업이 경쟁력을 유지하는 조건과 그 경쟁력이 사회에 미치는 영향을 함께 묻게 됐다.",
      en: "I began with a question about corporate survival. Comparing technological monopoly with ESG and CSR led me to examine both the conditions that sustain a firm and the social consequences of its advantage.",
    },
  },
  identity: {
    type: "concept",
    heading: {
      ko: "기술의 우위에 목적을 묻다",
      en: "What is technological advantage for?",
    },
    steps: [
      {
        ko: "기술적 역량",
        en: "Capability",
      },
      {
        ko: "기업의 목적",
        en: "Purpose",
      },
      {
        ko: "공적 책임",
        en: "Responsibility",
      },
    ],
    note: {
      ko: "같은 기술도 기업이 추구하는 목적에 따라 다르게 쓰인다. 독점이 혁신을 지속시키는지 묻던 토론은, 기업의 정체성과 행동을 어떤 기준으로 판단할 것인지에 관한 철학적 질문으로 이어졌다.",
      en: "The same technology can serve different ends. A debate about whether monopoly sustains innovation developed into a philosophical question: how should we judge a firm’s identity and actions?",
    },
  },
  capability: {
    type: "globe",
    heading: {
      ko: "기업의 기술은 어떻게 국가의 힘이 되는가",
      en: "How does corporate technology become national power?",
    },
    steps: [
      {
        ko: "데이터",
        en: "Data",
      },
      {
        ko: "산업 기반",
        en: "Industry",
      },
      {
        ko: "전략적 역량",
        en: "Capability",
      },
    ],
    note: {
      ko: "데이터, 통신망, 반도체와 생산시설은 기업의 자산이면서 국가가 전략을 실행하는 기반이기도 하다. 이 연구에서 나는 기업의 역량이 계약과 제도를 거쳐 군사·경제·외교의 선택지로 바뀌는 과정을 묻는다.",
      en: "Data, communications, semiconductors and factories are corporate assets as well as foundations for national strategy. I ask how contracts and institutions turn these capabilities into military, economic and diplomatic options.",
    },
  },
  "us-mission": {
    type: "concept",
    heading: {
      ko: "미국: 기업의 사명과 정부의 수요가 만날 때",
      en: "America: where corporate missions meet public demand",
    },
    steps: [
      {
        ko: "기업의 사명",
        en: "Mission",
      },
      {
        ko: "정부조달",
        en: "Procurement",
      },
      {
        ko: "제품 개발",
        en: "Development",
      },
    ],
    note: {
      ko: "Palantir와 Anduril은 기술기업의 목적이 국가안보와 만나는 사례다. S00은 이들의 사명과 정부 조달을 함께 살피며, 기업이 공적 수요를 제품 개발과 사업의 지속성으로 연결하는 방식을 분석한다.",
      en: "Palantir and Anduril connect corporate purpose with national security. S00 examines their stated missions alongside government procurement, asking how public demand supports product development and business continuity.",
    },
  },
  "us-dome": {
    type: "concept",
    heading: {
      ko: "Golden Dome: 기술을 모아 하나의 체계로",
      en: "Golden Dome: connecting technologies into a system",
    },
    steps: [
      {
        ko: "감지",
        en: "Sensing",
      },
      {
        ko: "데이터·지휘",
        en: "Data & command",
      },
      {
        ko: "요격",
        en: "Interception",
      },
    ],
    note: {
      ko: "센서가 정보를 모으고, 데이터가 통합되며, 판단이 대응으로 이어진다. S03과 S13은 Golden Dome 구상을 통해 서로 다른 기술이 국가 방어라는 목표 아래 어떻게 연결되는지를 살핀다.",
      en: "Sensors collect information, data is integrated, and decisions lead to responses. S03 and S13 examine the Golden Dome concept as a way of connecting distinct technologies around a national defense objective.",
    },
  },
  "us-finance": {
    type: "concept",
    heading: {
      ko: "Tether: 토큰의 준비자산에서 달러의 영향력으로",
      en: "Tether: from token reserves to dollar influence",
    },
    steps: [
      {
        ko: "민간 발행자",
        en: "Private issuer",
      },
      {
        ko: "준비자산",
        en: "Reserves",
      },
      {
        ko: "통화 네트워크",
        en: "Monetary network",
      },
    ],
    note: {
      ko: "USDT의 발행과 상환은 준비자산을 매개로 연결된다. S05의 신뢰 문제를 바탕으로 S00은 Tether의 미국 국채 보유와 달러 기반 금융망의 관계를 분석한다.",
      en: "USDT issuance and redemption depend on reserve assets. Building on S05’s inquiry into trust, S00 considers how Tether’s Treasury holdings relate to dollar-based financial networks.",
    },
  },
  "us-ships": {
    type: "concept",
    heading: {
      ko: "조선업: 법과 발주가 생산 기반을 지탱하는 방식",
      en: "Shipbuilding: how rules and orders support capacity",
    },
    steps: [
      {
        ko: "시장 비용",
        en: "Market costs",
      },
      {
        ko: "생산 기반",
        en: "Capacity",
      },
      {
        ko: "전략적 선택",
        en: "Strategic options",
      },
    ],
    note: {
      ko: "선박은 기술만으로 만들어지지 않는다. 존스법의 시장 조건, 공공 발주, 조선소와 인력이 함께 작동해야 생산 기반이 유지된다. S00은 이 연결을 국가가 산업 역량을 확보하는 방식으로 읽는다.",
      en: "Building ships requires more than technology. Market conditions under the Jones Act, public orders, shipyards and skilled labor all matter. S00 reads these connections as a way for the state to maintain industrial capability.",
    },
  },
  "china-ownership": {
    type: "concept",
    heading: {
      ko: "중국: 지분을 통해 연결되는 기업들",
      en: "China: connections through corporate ownership",
    },
    steps: [
      {
        ko: "투자·지분",
        en: "Investment",
      },
      {
        ko: "실제 권한",
        en: "Authority",
      },
      {
        ko: "의사결정",
        en: "Decisions",
      },
    ],
    note: {
      ko: "기업의 해외 진출은 제품 수출뿐 아니라 투자와 지분 관계를 통해서도 이루어진다. Geely·Mercedes와 Tencent의 사례는 자본, 기술, 시장이 기업의 경계를 넘어 연결되는 방식을 살펴보게 한다.",
      en: "Overseas expansion involves investment and equity as well as exports. The cases of Geely, Mercedes and Tencent offer a way to examine how capital, technology and markets connect across corporate boundaries.",
    },
  },
  "china-governance": {
    type: "concept",
    heading: {
      ko: "소유 구조와 통제 방식은 어떻게 다른가",
      en: "How do ownership and authority interact?",
    },
    steps: [
      {
        ko: "소유 구조",
        en: "Ownership",
      },
      {
        ko: "조직",
        en: "Organization",
      },
      {
        ko: "결정권",
        en: "Decision rights",
      },
    ],
    note: {
      ko: "국유기업과 민간기업은 소유 구조와 의사결정의 조건이 다르다. S00은 이 차이를 바탕으로 기업의 사업 목적이 국가의 전략적 목표와 만나는 제도적 경로를 살핀다.",
      en: "State-owned and private firms operate under different ownership and decision-making conditions. S00 uses that distinction to examine the institutions through which corporate objectives meet national strategy.",
    },
  },
  "china-arctic": {
    type: "arctic",
    heading: {
      ko: "그린란드: 공항과 자원이 전략적 공간이 될 때",
      en: "Greenland: airports, resources and strategic access",
    },
    steps: [
      {
        ko: "기업 투자",
        en: "Investment",
      },
      {
        ko: "지리적 접근",
        en: "Geographic access",
      },
      {
        ko: "지역의 선택",
        en: "Local choices",
      },
    ],
    note: {
      ko: "그린란드에서는 공항망과 자원 개발이 기업의 해외 진출과 국가 전략을 함께 묻게 한다. S08은 CCCC의 공항 사업 제안과 이후의 철회, 광물 분야의 기업 관계를 통해 접근권의 여러 경로를 분석한다.",
      en: "In Greenland, airports and resource projects bring overseas business activity into the same question as national strategy. S08 examines CCCC’s airport proposal, its withdrawal and separate mineral-sector relationships as different forms of access.",
    },
  },
  "china-myanmar": {
    type: "world",
    heading: {
      ko: "미얀마: 무기 공급망이 정권의 버팀목이 될 때",
      en: "Myanmar: when arms supply supports regime resilience",
    },
    steps: [
      {
        ko: "보고된 관계",
        en: "Reported links",
      },
      {
        ko: "출처 확인",
        en: "Source evidence",
      },
      {
        ko: "대안 설명",
        en: "Alternatives",
      },
    ],
    note: {
      ko: "무기 거래를 외교적 지원과 함께 놓으면, 거래 대금보다 큰 질문이 나타난다. S08은 AVIC·NORINCO·China South Industries의 공급 관계를 통해 무기 조달이 군정의 전력과 정권 유지에 어떤 역할을 하는지 분석한다.",
      en: "Reading arms transactions alongside diplomatic support raises a question beyond their price. S08 examines AVIC, NORINCO and China South Industries to ask how military supply relates to the junta’s capabilities and survival.",
    },
  },
  "china-cambodia": {
    type: "world",
    heading: {
      ko: "캄보디아: 리조트 개발과 해군기지가 만나는 해안",
      en: "Cambodia: where development meets a naval base",
    },
    steps: [
      {
        ko: "공간적 위치",
        en: "Location",
      },
      {
        ko: "기업 활동",
        en: "Corporate activity",
      },
      {
        ko: "주장의 근거",
        en: "Evidence",
      },
    ],
    note: {
      ko: "캄보디아 사례의 무대는 Ream 해군기지 주변 해안이다. S08은 Prince Group·Canopy Sands의 개발사업과 기지 확장을 함께 놓고, 상업적 진출이 전략적 접근권과 만나는 지점을 분석한다.",
      en: "Along the coast around Ream naval base, S08 examines Prince Group and Canopy Sands’ development activities alongside military expansion. The case asks how commercial footholds can acquire strategic significance.",
    },
  },
  "korea-chips": {
    type: "world",
    heading: {
      ko: "한국: 기술과 생산이 여러 제도에 걸쳐 있을 때",
      en: "Korea: technology and production across jurisdictions",
    },
    steps: [
      {
        ko: "수출통제",
        en: "Export controls",
      },
      {
        ko: "생산·투자",
        en: "Production",
      },
      {
        ko: "정책 선택",
        en: "Policy choices",
      },
    ],
    note: {
      ko: "삼성전자와 SK하이닉스의 생산·투자 결정에는 기업의 기술뿐 아니라 여러 국가의 제도가 작용한다. 반도체 사례는 수출통제와 공급망을 통해 기업의 경쟁력과 국가의 전략적 선택이 맞물리는 방식을 보여준다.",
      en: "Samsung Electronics and SK hynix make production and investment decisions within several national legal systems. Semiconductors connect corporate competitiveness with strategic choices through export controls and supply chains.",
    },
  },
  "korea-platforms": {
    type: "concept",
    heading: {
      ko: "플랫폼의 기술과 결정권은 누구에게 있는가",
      en: "Who holds a platform’s technology and authority?",
    },
    steps: [
      {
        ko: "기업 소유",
        en: "Ownership",
      },
      {
        ko: "데이터·관할",
        en: "Jurisdiction",
      },
      {
        ko: "국가 전략",
        en: "State strategy",
      },
    ],
    note: {
      ko: "플랫폼을 한 국가의 기업이라는 이름만으로 설명하기는 어렵다. LINE 사례에서는 기술과 운영, 지분과 의결권, 규제 관할을 나누어 볼 때 기업과 국가의 관계가 더 구체적으로 드러난다.",
      en: "A platform’s nationality is only part of its story. LINE makes the state–firm relationship more tangible when technology and operations, ownership and voting rights, and regulatory jurisdiction are examined separately.",
    },
  },
  "korea-regulation": {
    type: "concept",
    heading: {
      ko: "규제는 어떤 기업 전략을 만들어 내는가",
      en: "How do firms respond to regulation?",
    },
    steps: [
      {
        ko: "제도 설계",
        en: "Rules",
      },
      {
        ko: "경쟁 조건",
        en: "Competition",
      },
      {
        ko: "소비자 선택",
        en: "Consumer choice",
      },
    ],
    note: {
      ko: "타다·쿠팡·카카오의 사례에서는 공적 목적을 가진 규제가 기업의 사업 전략과 만난다. S00은 정책이 해결하려는 문제와 기업의 대응을 함께 살피며, 한국의 제도적 조건을 비판적으로 검토한다.",
      en: "The cases of Tada, Coupang and Kakao place public policy alongside corporate strategy. S00 considers the problems regulation seeks to address and how firms respond, offering a critique of Korea’s institutional conditions.",
    },
  },
  "korea-defense": {
    type: "concept",
    heading: {
      ko: "방산기업의 역량을 국가 전략과 잇다",
      en: "Connecting defense firms with national strategy",
    },
    steps: [
      {
        ko: "전략적 역할",
        en: "Strategic role",
      },
      {
        ko: "비교 지표",
        en: "Comparison",
      },
      {
        ko: "분석의 한계",
        en: "Limitations",
      },
    ],
    note: {
      ko: "한화·LIG 등의 방산기업은 기술 개발, 생산, 수출을 통해 국가 전략과 관계를 맺는다. S17의 기업 분석과 S00의 정책 제안을 함께 읽으면, 기업을 지원하는 조건과 기업에 요구할 기여를 구체적으로 물을 수 있다.",
      en: "Firms such as Hanwha and LIG connect with national strategy through development, production and exports. Reading S17 alongside S00 makes it possible to ask what support firms should receive and what contributions should be expected in return.",
    },
  },
  "spatial-method": {
    type: "concept",
    heading: {
      ko: "사건을 시간과 공간 위에 놓아 보기",
      en: "Reading events through time and space",
    },
    steps: [
      {
        ko: "관측",
        en: "Observe",
      },
      {
        ko: "관계 정리",
        en: "Connect",
      },
      {
        ko: "교차 검증",
        en: "Verify",
      },
    ],
    note: {
      ko: "기업, 시설, 거래를 따로 볼 때와 같은 시간·공간에 놓을 때 생기는 질문은 다르다. 공간 분석은 관계를 발견하는 데 쓰이고, 기업 지표 분석은 여러 기업의 특징을 비교하는 데 쓰인다. 자료를 조직하는 방법이 연구의 질문도 바꾼다.",
      en: "Firms, facilities and transactions raise different questions when examined separately or aligned in time and space. Spatial analysis helps identify relationships; financial indicators help compare firms. How evidence is organized shapes the questions we can ask.",
    },
  },
  synthesis: {
    type: "integration",
    heading: {
      ko: "기업의 힘을 어떤 공적 목적에 연결할 것인가",
      en: "What public purposes should corporate power serve?",
    },
    steps: [
      {
        ko: "기술",
        en: "Technology",
      },
      {
        ko: "정체성",
        en: "Identity",
      },
      {
        ko: "책임 있는 협력",
        en: "Accountability",
      },
    ],
    note: {
      ko: "내가 이 연구들을 함께 읽는 이유는 기업의 생존과 국가의 힘을 별개의 문제로 보기 어렵기 때문이다. 기술, 정체성, 제도가 만나는 지점을 따라온 논의는 기업에 제공할 지원과 기업이 감당할 책임을 함께 묻는 S00의 제안으로 모인다.",
      en: "I bring these studies together because corporate survival and national power are difficult to separate. Following technology, identity and institutions leads to S00’s proposal: consider the support given to firms together with the responsibilities expected of them.",
    },
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

/** v2.3 editorial metadata; source documents and their claims are immutable. */
export const emphasisScenes = new Set([
  "capability",
  "china-arctic",
  "synthesis",
]);
export const contributionLabels: Record<string, Label> = {
  S00: l("통합 질문과 정책 제언", "Synthesis & proposals"),
  S01: l("데이터 역량의 작동 방식", "Data capability"),
  S02: l("미국의 제도적 연결", "American institutions"),
  S03: l("국가 프로젝트 · 5쪽", "National project · 5 pp"),
  S05: l("준비자산과 금융 신뢰", "Reserves & trust"),
  S06: l("기업 존속의 출발 질문", "Corporate resilience"),
  S08: l("사례의 공간 분석 근거", "Spatial case analysis"),
  S11: l("안보·동맹의 분석 틀", "Security & alliances"),
  S13: l("국가 프로젝트 · 6쪽", "National project · 6 pp"),
  S14: l("정체성 판단의 기준", "Identity & judgment"),
  S15: l("관측 자료를 통한 점검", "Observational methods"),
  S16: l("수출통제의 생산 경로", "Controls & production"),
  S17: l("방산 비교와 방법의 한계", "Defense & method limits"),
};
export const glossaries: Record<string, { term: Label; definition: Label }[]> =
  {
    "us-mission": [
      {
        term: l("정부조달", "Public procurement"),
        definition: l(
          "정부가 재화·용역을 계약으로 구매하는 절차입니다. 계약 상한은 실제 지급액과 구분합니다.",
          "Government purchasing through contracts. A contract ceiling is distinct from actual expenditure.",
        ),
      },
    ],
    "us-finance": [
      {
        term: l("준비자산", "Reserve assets"),
        definition: l(
          "발행자가 상환 등을 뒷받침하기 위해 보유하는 자산입니다. 자산 구성·평가 시점·상환 조건은 별도로 확인합니다.",
          "Assets held to support redemption and other obligations. Composition, valuation dates and redemption terms require separate checks.",
        ),
      },
    ],
    "china-ownership": [
      {
        term: l("지배구조", "Corporate governance"),
        definition: l(
          "주주·이사회·경영진 사이에 권한과 책임을 배분하는 구조입니다. 지분율만으로 실제 결정권을 확정할 수는 없습니다.",
          "The allocation of authority and accountability among shareholders, boards and management. Equity alone does not settle actual decision rights.",
        ),
      },
    ],
    "korea-chips": [
      {
        term: l("수출통제", "Export controls"),
        definition: l(
          "품목·기술·최종 사용자 등에 따라 이전이나 수출을 제한하는 제도입니다. 특정 연도의 허가 사례를 현재 상태와 구분합니다.",
          "Rules restricting transfers by item, technology or end user. A historical authorization does not establish today's status.",
        ),
      },
    ],
    "spatial-method": [
      {
        term: l("공간적 인접성", "Spatial proximity"),
        definition: l(
          "같은 장소나 가까운 위치에 있다는 관측입니다. 거래·통제·인과관계를 입증하려면 별도 자료가 필요합니다.",
          "An observation that entities occupy nearby locations. Transactions, control and causation require separate evidence.",
        ),
      },
    ],
  };
export const editorialConnectors: Record<string, Label> = {
  capability: {
    ko: "미국과 중국은 기업의 역량을 국가 전략에 연결하는 서로 다른 방식을 보여준다.",
    en: "The United States and China connect corporate capability to national strategy in different ways.",
  },
  "china-arctic": {
    ko: "나는 세 지역을 통해 기업의 사업이 각기 다른 방식으로 국가와 결속하는 과정을 비교한다.",
    en: "Across these places, I compare the different ways corporate activity becomes connected with the state.",
  },
  synthesis: {
    ko: "내가 남기는 질문은 지원의 크기보다 그 조건이다. 기업의 역량이 공적 기여로 이어지도록 어떤 책임과 견제 장치를 설계할 것인가.",
    en: "My remaining question concerns the conditions of support more than its scale. What responsibilities and checks can connect corporate capability with public contribution?",
  },
};
// Geography is retained only where location is part of the argument.
for (const id of [
  "us-mission",
  "us-finance",
  "us-ships",
  "china-ownership",
  "china-governance",
  "korea-defense",
])
  storyVisuals[id].type = "concept";
