export type ResearchConnection = {
  scene: string;
  ko: string;
  en: string;
  termsKo: string[];
  termsEn: string[];
};
export const researchConnections: Record<string, ResearchConnection> = {
  S00: {
    scene: "synthesis",
    ko: "기업의 생존과 기술의 목적을 국가–기업 관계라는 질문에 모은다. 지원의 조건과 공적 기여를 함께 묻는 통합 연구다.",
    en: "The synthesis brings corporate resilience and technological purpose into a shared inquiry into state–firm relations, support and public contribution.",
    termsKo: ["대의", "국가와 기업의 관계"],
    termsEn: ["cause", "state", "identity"],
  },
  S01: {
    scene: "capability",
    ko: "기업의 데이터 기술이 현대전의 전략적 역량으로 바뀌는 경로를 살핀다.",
    en: "Data technologies connect the firm's capability to the changing structure of warfare.",
    termsKo: ["사이버", "데이터"],
    termsEn: ["cyber", "data"],
  },
  S02: {
    scene: "us-mission",
    ko: "미국의 경제–안보 복합체가 기업을 국가의 힘으로 연결하는 방식을 분석한다.",
    en: "The economic–security complex connects American companies to national power.",
    termsKo: ["기업", "기술패권"],
    termsEn: ["companies", "corporate", "technology"],
  },
  S03: {
    scene: "us-dome",
    ko: "Golden Dome을 기업·기술·국가 목표를 모으는 프로젝트라는 관점에서 분석한다.",
    en: "Golden Dome connects firms and technologies through a national mission.",
    termsKo: ["골든돔", "골든 돔"],
    termsEn: ["Golden Dome", "Golden dome"],
  },
  S05: {
    scene: "us-finance",
    ko: "스테이블코인과 금융 신뢰의 문제를 국가–기업 결속의 금융적 경로로 확장한다.",
    en: "Stablecoins extend the question of state–firm relations into monetary trust and financial power.",
    termsKo: ["스테이블", "신뢰"],
    termsEn: ["stablecoin", "trust"],
  },
  S06: {
    scene: "survival",
    ko: "기업의 지속가능성에 대한 질문이 기술 독점과 정체성의 탐구로 발전한다.",
    en: "The inquiry into corporate sustainability develops into questions of technological monopoly and identity.",
    termsKo: ["기술 독점", "기술적 우위"],
    termsEn: ["technological monopoly", "technological advantage"],
  },
  S08: {
    scene: "china-arctic",
    ko: "공항·무기 공급·해안 개발을 시간과 공간 위에서 비교한다. 기업의 해외 활동이 국가 전략과 만나는 경로를 S00에 더한다.",
    en: "Airports, military supply and coastal development are compared across time and space, contributing an account of overseas business and strategic access to S00.",
    termsKo: ["그린란드", "기업"],
    termsEn: ["Greenland", "corporate"],
  },
  S11: {
    scene: "korea-defense",
    ko: "현대전과 기술군사동맹의 변화가 방산기업의 전략적 역할을 이해하는 틀이 된다.",
    en: "Changing warfare and technological alliances frame the strategic role of defense companies.",
    termsKo: ["기술", "동맹"],
    termsEn: ["technology", "technological", "alliance"],
  },
  S13: {
    scene: "us-dome",
    ko: "Golden Dome의 감지·통합·판단 체계를 다룬다. 개별 기술을 하나의 방어 목표로 연결하는 문제를 S03과 함께 발전시킨다.",
    en: "The sensing, integration and decision structure of Golden Dome develops S03’s question of connecting distinct technologies to a shared defense objective.",
    termsKo: ["골든돔", "골든 돔"],
    termsEn: ["Golden Dome", "Golden dome"],
  },
  S14: {
    scene: "identity",
    ko: "정체성과 도덕적 판단을 검토해 기업–국가 관계를 해석하는 철학적 기준을 묻는다.",
    en: "Philosophical questions about identity and moral judgment test how state–firm relations are interpreted.",
    termsKo: ["온톨로지", "도덕", "정체성"],
    termsEn: ["ontology", "moral", "identity"],
  },
  S15: {
    scene: "spatial-method",
    ko: "위성·해상 데이터 분석은 국가–기업 관계에 관한 해석을 관측 가능한 자료로 점검하는 방법론이다.",
    en: "Satellite and maritime data provide a method for testing interpretations against observable evidence.",
    termsKo: ["위성", "공간"],
    termsEn: ["satellite", "spatial"],
  },
  S16: {
    scene: "korea-chips",
    ko: "반도체 수출통제가 한국 기업의 생산·투자·정책 선택에 미치는 경로를 살핀다.",
    en: "Semiconductor export controls connect Korean firms' production and investment to policy choices.",
    termsKo: ["수출통제", "반도체"],
    termsEn: ["export controls", "semiconductor"],
  },
  S17: {
    scene: "korea-defense",
    ko: "방산기업을 재무·전략 지표로 비교하며 국가 전략과 기업 성과의 연결을 검토한다.",
    en: "Financial and strategic comparisons examine the connection between national strategy and defense-firm performance.",
    termsKo: ["PCA", "방산"],
    termsEn: ["PCA", "defense"],
  },
};
