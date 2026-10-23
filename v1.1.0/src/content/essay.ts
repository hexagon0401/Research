export type Bilingual = { ko: string; en: string };
export type EssayBeat = {
  id: string;
  title: Bilingual;
  intro: Bilingual;
  lead: Bilingual;
  facts: Bilingual[];
  connection: Bilingual;
  detail?: Bilingual;
  bridge: Bilingual;
  mode: "concept" | "world" | "arctic" | "integration";
  country?: "us" | "cn" | "kr";
  tint: [number, number, number];
  passages: {
    report: string;
    blocks: string[];
    readingIds?: string[];
    take?: number;
  }[];
  related: string[];
  note?: Bilingual;
  references?: { title: string; url: string }[];
};
export const essay: EssayBeat[] = [
  {
    id: "survival",
    mode: "concept",
    tint: [230, 232, 230],
    title: {
      ko: "기업은 무엇으로 오래 살아남는가",
      en: "What allows a company to endure?",
    },
    intro: {
      ko: "내가 출발점으로 삼은 질문은 기업의 생존이었다. 기술 독점과 ESG·CSR을 비교하면서, 기업이 경쟁력을 유지하는 조건과 그 경쟁력이 사회에 미치는 영향을 함께 묻게 됐다.",
      en: "I began with a question about corporate survival. Comparing technological monopoly with ESG and CSR led me to examine both the conditions that sustain a firm and the social consequences of its advantage.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L002-P003"],
      },
    ],
    related: ["S06"],
    bridge: {
      ko: "기술이 기업을 지탱한다면, 그 기술의 방향은 무엇이 결정할까.",
      en: "If technology sustains a firm, what determines the direction it takes?",
    },
    lead: {
      ko: "내가 출발점으로 삼은 질문은 기업의 생존이었다. 기술 독점과 ESG·CSR을 비교하면서, 기업이 경쟁력을 유지하는 조건과 그 경쟁력이 사회에 미치는 영향을 함께 묻게 됐다.",
      en: "I began with a question about corporate survival. Comparing technological monopoly with ESG and CSR led me to examine both the conditions that sustain a firm and the social consequences of its advantage.",
    },
    facts: [
      {
        ko: "기술 독점 · 경쟁 우위를 지키는 방식",
        en: "Technological monopoly · protecting competitive advantage",
      },
      {
        ko: "ESG·CSR · 기업의 사회적 역할",
        en: "ESG and CSR · the firm’s social role",
      },
      {
        ko: "S06 · 기업의 존속을 둘러싼 분석과 반론",
        en: "S06 · analysis and counterarguments on corporate resilience",
      },
    ],
    connection: {
      ko: "기술이 기업을 지탱한다면, 그 기술의 방향은 무엇이 결정할까.",
      en: "If technology sustains a firm, what determines the direction it takes?",
    },
  },
  {
    id: "identity",
    mode: "concept",
    tint: [220, 229, 219],
    title: {
      ko: "기술의 우위에 목적을 묻다",
      en: "What is technological advantage for?",
    },
    intro: {
      ko: "같은 기술도 기업이 추구하는 목적에 따라 다르게 쓰인다. 독점이 혁신을 지속시키는지 묻던 토론은, 기업의 정체성과 행동을 어떤 기준으로 판단할 것인지에 관한 철학적 질문으로 이어졌다.",
      en: "The same technology can serve different ends. A debate about whether monopoly sustains innovation developed into a philosophical question: how should we judge a firm’s identity and actions?",
    },
    passages: [
      {
        report: "S06",
        blocks: ["S06-L004-P001"],
        take: 2,
      },
      {
        report: "S00",
        blocks: ["S00-L003-P007"],
      },
    ],
    related: ["S06", "S14"],
    bridge: {
      ko: "기업의 목적을 국가의 관점에서 보면, 기술과 정체성은 전략의 문제가 된다.",
      en: "Seen from the state, corporate technology and identity become questions of strategy.",
    },
    lead: {
      ko: "같은 기술도 기업이 추구하는 목적에 따라 다르게 쓰인다. 독점이 혁신을 지속시키는지 묻던 토론은, 기업의 정체성과 행동을 어떤 기준으로 판단할 것인지에 관한 철학적 질문으로 이어졌다.",
      en: "The same technology can serve different ends. A debate about whether monopoly sustains innovation developed into a philosophical question: how should we judge a firm’s identity and actions?",
    },
    facts: [
      {
        ko: "S06 · 독점, 혁신, 기업의 존속",
        en: "S06 · monopoly, innovation and survival",
      },
      {
        ko: "S14 · 정체성과 판단의 기준",
        en: "S14 · identity and the criteria for judgment",
      },
    ],
    connection: {
      ko: "기업의 목적을 국가의 관점에서 보면, 기술과 정체성은 전략의 문제가 된다.",
      en: "Seen from the state, corporate technology and identity become questions of strategy.",
    },
  },
  {
    id: "capability",
    mode: "world",
    tint: [216, 226, 230],
    title: {
      ko: "기업의 기술은 어떻게 국가의 힘이 되는가",
      en: "How does corporate technology become national power?",
    },
    intro: {
      ko: "데이터, 통신망, 반도체와 생산시설은 기업의 자산이면서 국가가 전략을 실행하는 기반이기도 하다. 이 연구에서 나는 기업의 역량이 계약과 제도를 거쳐 군사·경제·외교의 선택지로 바뀌는 과정을 묻는다.",
      en: "Data, communications, semiconductors and factories are corporate assets as well as foundations for national strategy. I ask how contracts and institutions turn these capabilities into military, economic and diplomatic options.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L002-P011"],
        take: 1,
      },
    ],
    related: ["S01", "S02"],
    bridge: {
      ko: "미국과 중국은 기업의 역량을 국가 전략에 연결하는 서로 다른 방식을 보여준다.",
      en: "The United States and China connect corporate capability to national strategy in different ways.",
    },
    lead: {
      ko: "데이터, 통신망, 반도체와 생산시설은 기업의 자산이면서 국가가 전략을 실행하는 기반이기도 하다. 이 연구에서 나는 기업의 역량이 계약과 제도를 거쳐 군사·경제·외교의 선택지로 바뀌는 과정을 묻는다.",
      en: "Data, communications, semiconductors and factories are corporate assets as well as foundations for national strategy. I ask how contracts and institutions turn these capabilities into military, economic and diplomatic options.",
    },
    facts: [
      {
        ko: "데이터 · 정보를 수집하고 판단에 연결하는 능력",
        en: "Data · collecting information and putting it to use",
      },
      {
        ko: "계약 · 공적 수요와 기업의 기술을 잇는 제도",
        en: "Contracts · institutions connecting public demand and technology",
      },
      {
        ko: "생산 · 전략을 지속시키는 산업 기반",
        en: "Production · the industrial capacity that sustains strategy",
      },
    ],
    connection: {
      ko: "미국과 중국은 기업의 역량을 국가 전략에 연결하는 서로 다른 방식을 보여준다.",
      en: "The United States and China connect corporate capability to national strategy in different ways.",
    },
  },
  {
    id: "us-mission",
    mode: "world",
    country: "us",
    tint: [220, 228, 221],
    title: {
      ko: "미국: 기업의 사명과 정부의 수요가 만날 때",
      en: "America: where corporate missions meet public demand",
    },
    intro: {
      ko: "Palantir와 Anduril은 기술기업의 목적이 국가안보와 만나는 사례다. S00은 이들의 사명과 정부 조달을 함께 살피며, 기업이 공적 수요를 제품 개발과 사업의 지속성으로 연결하는 방식을 분석한다.",
      en: "Palantir and Anduril connect corporate purpose with national security. S00 examines their stated missions alongside government procurement, asking how public demand supports product development and business continuity.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L005-P009", "S00-L005-P010"],
      },
      {
        report: "S01",
        blocks: [],
        readingIds: ["S01-R002-P006"],
      },
    ],
    related: ["S02", "S01", "S00"],
    bridge: {
      ko: "개별 기업의 기술을 하나의 체계로 묶으면 국가 프로젝트의 문제가 된다.",
      en: "Connecting separate firms’ technologies brings us to the scale of a national system.",
    },
    lead: {
      ko: "Palantir와 Anduril은 기술기업의 목적이 국가안보와 만나는 사례다. S00은 이들의 사명과 정부 조달을 함께 살피며, 기업이 공적 수요를 제품 개발과 사업의 지속성으로 연결하는 방식을 분석한다.",
      en: "Palantir and Anduril connect corporate purpose with national security. S00 examines their stated missions alongside government procurement, asking how public demand supports product development and business continuity.",
    },
    facts: [
      {
        ko: "Palantir · 데이터 분석과 의사결정",
        en: "Palantir · data analysis and decision-making",
      },
      {
        ko: "Anduril · 국방 기술과 제품 개발",
        en: "Anduril · defense technology and product development",
      },
      {
        ko: "정부 조달 · 수요, 계약, 사용 경험의 연결",
        en: "Procurement · demand, contracts and operational feedback",
      },
    ],
    connection: {
      ko: "개별 기업의 기술을 하나의 체계로 묶으면 국가 프로젝트의 문제가 된다.",
      en: "Connecting separate firms’ technologies brings us to the scale of a national system.",
    },
  },
  {
    id: "us-dome",
    mode: "world",
    country: "us",
    tint: [215, 225, 224],
    title: {
      ko: "Golden Dome: 기술을 모아 하나의 체계로",
      en: "Golden Dome: connecting technologies into a system",
    },
    intro: {
      ko: "센서가 정보를 모으고, 데이터가 통합되며, 판단이 대응으로 이어진다. S03과 S13은 Golden Dome 구상을 통해 서로 다른 기술이 국가 방어라는 목표 아래 어떻게 연결되는지를 살핀다.",
      en: "Sensors collect information, data is integrated, and decisions lead to responses. S03 and S13 examine the Golden Dome concept as a way of connecting distinct technologies around a national defense objective.",
    },
    passages: [
      {
        report: "S13",
        blocks: [],
        readingIds: ["S13-R001-P007"],
      },
    ],
    related: ["S03", "S13", "S11"],
    bridge: {
      ko: "기업과 국가의 연결은 방어 체계뿐 아니라 금융에서도 나타난다.",
      en: "The state–firm relationship also operates through finance.",
    },
    lead: {
      ko: "센서가 정보를 모으고, 데이터가 통합되며, 판단이 대응으로 이어진다. S03과 S13은 Golden Dome 구상을 통해 서로 다른 기술이 국가 방어라는 목표 아래 어떻게 연결되는지를 살핀다.",
      en: "Sensors collect information, data is integrated, and decisions lead to responses. S03 and S13 examine the Golden Dome concept as a way of connecting distinct technologies around a national defense objective.",
    },
    facts: [
      {
        ko: "감지 · 위성과 레이더",
        en: "Sensing · satellites and radar",
      },
      {
        ko: "통합 · 서로 다른 정보를 같은 판단에 활용",
        en: "Integration · making different information usable together",
      },
      {
        ko: "판단과 대응 · 체계 구상 속 역할의 연결",
        en: "Decision and response · roles within a proposed system",
      },
    ],
    connection: {
      ko: "기업과 국가의 연결은 방어 체계뿐 아니라 금융에서도 나타난다.",
      en: "The state–firm relationship also operates through finance.",
    },
  },
  {
    id: "us-finance",
    mode: "world",
    country: "us",
    tint: [227, 229, 216],
    title: {
      ko: "Tether: 토큰의 준비자산에서 달러의 영향력으로",
      en: "Tether: from token reserves to dollar influence",
    },
    intro: {
      ko: "USDT의 발행과 상환은 준비자산을 매개로 연결된다. S05의 신뢰 문제를 바탕으로 S00은 Tether의 미국 국채 보유와 달러 기반 금융망의 관계를 분석한다.",
      en: "USDT issuance and redemption depend on reserve assets. Building on S05’s inquiry into trust, S00 considers how Tether’s Treasury holdings relate to dollar-based financial networks.",
    },
    passages: [
      {
        report: "S05",
        blocks: ["S05-L004-P010"],
        take: 1,
      },
    ],
    related: ["S05", "S00"],
    references: [
      {
        title: "GENIUS Act — Public Law 119–27",
        url: "https://www.govinfo.gov/content/pkg/PLAW-119publ27/html/PLAW-119publ27.htm",
      },
    ],
    bridge: {
      ko: "금융망이 자본의 흐름을 지탱한다면, 조선업은 전략을 실행할 물리적 기반을 묻는다.",
      en: "Where finance supports capital flows, shipbuilding raises the question of physical capacity.",
    },
    lead: {
      ko: "USDT의 발행과 상환은 준비자산을 매개로 연결된다. S05의 신뢰 문제를 바탕으로 S00은 Tether의 미국 국채 보유와 달러 기반 금융망의 관계를 분석한다.",
      en: "USDT issuance and redemption depend on reserve assets. Building on S05’s inquiry into trust, S00 considers how Tether’s Treasury holdings relate to dollar-based financial networks.",
    },
    facts: [
      {
        ko: "발행·상환 · 이용자와 발행자의 거래",
        en: "Issuance and redemption · the holder–issuer relationship",
      },
      {
        ko: "준비자산 · 상환 능력을 뒷받침하는 자산",
        en: "Reserves · assets supporting redemption",
      },
      {
        ko: "미국 국채 · 기업의 자산 운용과 국가 금융의 접점",
        en: "U.S. Treasuries · a meeting point of corporate assets and public finance",
      },
    ],
    connection: {
      ko: "금융망이 자본의 흐름을 지탱한다면, 조선업은 전략을 실행할 물리적 기반을 묻는다.",
      en: "Where finance supports capital flows, shipbuilding raises the question of physical capacity.",
    },
  },
  {
    id: "us-ships",
    mode: "world",
    country: "us",
    tint: [221, 228, 217],
    title: {
      ko: "조선업: 법과 발주가 생산 기반을 지탱하는 방식",
      en: "Shipbuilding: how rules and orders support capacity",
    },
    intro: {
      ko: "선박은 기술만으로 만들어지지 않는다. 존스법의 시장 조건, 공공 발주, 조선소와 인력이 함께 작동해야 생산 기반이 유지된다. S00은 이 연결을 국가가 산업 역량을 확보하는 방식으로 읽는다.",
      en: "Building ships requires more than technology. Market conditions under the Jones Act, public orders, shipyards and skilled labor all matter. S00 reads these connections as a way for the state to maintain industrial capability.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L005-P019"],
      },
    ],
    related: ["S00", "S11"],
    references: [
      {
        title: "46 U.S.C. §55102 — Transportation of merchandise",
        url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title46-section55102&num=0&edition=prelim",
      },
      {
        title: "Public Law 119–21",
        url: "https://www.govinfo.gov/content/pkg/PLAW-119publ21/html/PLAW-119publ21.htm",
      },
    ],
    bridge: {
      ko: "중국 사례에서는 기업의 소유 관계와 해외 사업을 통해 또 다른 결속 방식을 살핀다.",
      en: "The Chinese cases reveal another form of coordination through ownership and overseas projects.",
    },
    lead: {
      ko: "선박은 기술만으로 만들어지지 않는다. 존스법의 시장 조건, 공공 발주, 조선소와 인력이 함께 작동해야 생산 기반이 유지된다. S00은 이 연결을 국가가 산업 역량을 확보하는 방식으로 읽는다.",
      en: "Building ships requires more than technology. Market conditions under the Jones Act, public orders, shipyards and skilled labor all matter. S00 reads these connections as a way for the state to maintain industrial capability.",
    },
    facts: [
      {
        ko: "존스법 · 미국 연안 운송의 제도적 조건",
        en: "Jones Act · conditions governing U.S. coastwise trade",
      },
      {
        ko: "발주·시설 · 수요와 조선소의 연결",
        en: "Orders and facilities · connecting demand to shipyards",
      },
      {
        ko: "산업 기반 · 장기적인 전략 수행 능력",
        en: "Industrial capacity · the ability to sustain strategy",
      },
    ],
    connection: {
      ko: "중국 사례에서는 기업의 소유 관계와 해외 사업을 통해 또 다른 결속 방식을 살핀다.",
      en: "The Chinese cases reveal another form of coordination through ownership and overseas projects.",
    },
  },
  {
    id: "china-ownership",
    mode: "world",
    country: "cn",
    tint: [229, 224, 215],
    title: {
      ko: "중국: 지분을 통해 연결되는 기업들",
      en: "China: connections through corporate ownership",
    },
    intro: {
      ko: "기업의 해외 진출은 제품 수출뿐 아니라 투자와 지분 관계를 통해서도 이루어진다. Geely·Mercedes와 Tencent의 사례는 자본, 기술, 시장이 기업의 경계를 넘어 연결되는 방식을 살펴보게 한다.",
      en: "Overseas expansion involves investment and equity as well as exports. The cases of Geely, Mercedes and Tencent offer a way to examine how capital, technology and markets connect across corporate boundaries.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L004-P013", "S00-L004-P014"],
      },
    ],
    related: ["S00", "S08"],
    bridge: {
      ko: "이 관계를 이해하려면 지분과 함께 실제 권한의 구조도 살펴야 한다.",
      en: "Ownership needs to be read alongside the distribution of actual authority.",
    },
    lead: {
      ko: "기업의 해외 진출은 제품 수출뿐 아니라 투자와 지분 관계를 통해서도 이루어진다. Geely·Mercedes와 Tencent의 사례는 자본, 기술, 시장이 기업의 경계를 넘어 연결되는 방식을 살펴보게 한다.",
      en: "Overseas expansion involves investment and equity as well as exports. The cases of Geely, Mercedes and Tencent offer a way to examine how capital, technology and markets connect across corporate boundaries.",
    },
    facts: [
      {
        ko: "Geely·Mercedes · 투자와 기업 간 관계",
        en: "Geely and Mercedes · investment and corporate ties",
      },
      {
        ko: "Tencent · 플랫폼과 사업의 확장",
        en: "Tencent · platforms and business expansion",
      },
      {
        ko: "분석의 초점 · 소유, 기술, 시장의 연결",
        en: "Analytical focus · ownership, technology and markets",
      },
    ],
    connection: {
      ko: "이 관계를 이해하려면 지분과 함께 실제 권한의 구조도 살펴야 한다.",
      en: "Ownership needs to be read alongside the distribution of actual authority.",
    },
  },
  {
    id: "china-governance",
    mode: "world",
    country: "cn",
    tint: [225, 222, 212],
    title: {
      ko: "소유 구조와 통제 방식은 어떻게 다른가",
      en: "How do ownership and authority interact?",
    },
    intro: {
      ko: "국유기업과 민간기업은 소유 구조와 의사결정의 조건이 다르다. S00은 이 차이를 바탕으로 기업의 사업 목적이 국가의 전략적 목표와 만나는 제도적 경로를 살핀다.",
      en: "State-owned and private firms operate under different ownership and decision-making conditions. S00 uses that distinction to examine the institutions through which corporate objectives meet national strategy.",
    },
    passages: [],
    related: ["S00", "S08"],
    bridge: {
      ko: "그 결속이 해외 공간에서 어떻게 드러나는지 그린란드와 동남아시아를 따라가 보자.",
      en: "Greenland and Southeast Asia show how these relationships take shape abroad.",
    },
    lead: {
      ko: "국유기업과 민간기업은 소유 구조와 의사결정의 조건이 다르다. S00은 이 차이를 바탕으로 기업의 사업 목적이 국가의 전략적 목표와 만나는 제도적 경로를 살핀다.",
      en: "State-owned and private firms operate under different ownership and decision-making conditions. S00 uses that distinction to examine the institutions through which corporate objectives meet national strategy.",
    },
    facts: [
      {
        ko: "국유기업 · 소유와 국가 권한의 관계",
        en: "State-owned firms · ownership and public authority",
      },
      {
        ko: "민간기업 · 사업 전략과 제도적 환경",
        en: "Private firms · business strategy and institutional conditions",
      },
      {
        ko: "해외 사업 · 기업 활동과 전략적 접근권",
        en: "Overseas projects · business activity and strategic access",
      },
    ],
    connection: {
      ko: "그 결속이 해외 공간에서 어떻게 드러나는지 그린란드와 동남아시아를 따라가 보자.",
      en: "Greenland and Southeast Asia show how these relationships take shape abroad.",
    },
  },
  {
    id: "china-arctic",
    mode: "arctic",
    country: "cn",
    tint: [210, 225, 229],
    title: {
      ko: "그린란드: 공항과 자원이 전략적 공간이 될 때",
      en: "Greenland: airports, resources and strategic access",
    },
    intro: {
      ko: "그린란드에서는 공항망과 자원 개발이 기업의 해외 진출과 국가 전략을 함께 묻게 한다. S08은 CCCC의 공항 사업 제안과 이후의 철회, 광물 분야의 기업 관계를 통해 접근권의 여러 경로를 분석한다.",
      en: "In Greenland, airports and resource projects bring overseas business activity into the same question as national strategy. S08 examines CCCC’s airport proposal, its withdrawal and separate mineral-sector relationships as different forms of access.",
    },
    passages: [
      {
        report: "S08",
        blocks: [],
        readingIds: ["S08-R001-P010"],
      },
    ],
    related: ["S08", "S00"],
    references: [
      {
        title: "China's Arctic Policy (2018 white paper)",
        url: "https://english.www.gov.cn/archive/white_paper/2018/01/26/content_281476026660336.htm",
      },
    ],
    bridge: {
      ko: "나는 세 지역을 통해 기업의 사업이 각기 다른 방식으로 국가와 결속하는 과정을 비교한다.",
      en: "Across these places, I compare the different ways corporate activity becomes connected with the state.",
    },
    lead: {
      ko: "그린란드에서는 공항망과 자원 개발이 기업의 해외 진출과 국가 전략을 함께 묻게 한다. S08은 CCCC의 공항 사업 제안과 이후의 철회, 광물 분야의 기업 관계를 통해 접근권의 여러 경로를 분석한다.",
      en: "In Greenland, airports and resource projects bring overseas business activity into the same question as national strategy. S08 examines CCCC’s airport proposal, its withdrawal and separate mineral-sector relationships as different forms of access.",
    },
    facts: [
      {
        ko: "2018 · CCCC의 세 공항 사업 제안",
        en: "2018 · CCCC’s proposal involving three airports",
      },
      {
        ko: "2019년 6월 · 공항 입찰 철회",
        en: "June 2019 · withdrawal from the airport bid",
      },
      {
        ko: "광물 분야 · Shenghe Resources 등의 기업 관계",
        en: "Minerals · corporate relationships involving Shenghe Resources",
      },
    ],
    connection: {
      ko: "나는 세 지역을 통해 기업의 사업이 각기 다른 방식으로 국가와 결속하는 과정을 비교한다.",
      en: "Across these places, I compare the different ways corporate activity becomes connected with the state.",
    },
  },
  {
    id: "china-myanmar",
    mode: "world",
    country: "cn",
    tint: [224, 228, 211],
    title: {
      ko: "미얀마: 무기 공급망이 정권의 버팀목이 될 때",
      en: "Myanmar: when arms supply supports regime resilience",
    },
    intro: {
      ko: "무기 거래를 외교적 지원과 함께 놓으면, 거래 대금보다 큰 질문이 나타난다. S08은 AVIC·NORINCO·China South Industries의 공급 관계를 통해 무기 조달이 군정의 전력과 정권 유지에 어떤 역할을 하는지 분석한다.",
      en: "Reading arms transactions alongside diplomatic support raises a question beyond their price. S08 examines AVIC, NORINCO and China South Industries to ask how military supply relates to the junta’s capabilities and survival.",
    },
    passages: [
      {
        report: "S08",
        blocks: ["S08-L003-P001"],
        take: 1,
      },
    ],
    related: ["S08", "S11"],
    references: [
      {
        title: "UN Special Rapporteur on Myanmar — source collection",
        url: "https://www.ohchr.org/en/special-procedures/sr-myanmar",
      },
    ],
    bridge: {
      ko: "캄보디아에서는 무기 공급에서 해안의 개발사업과 시설로 시선을 넓힌다.",
      en: "Cambodia extends the question from military supply to coastal development and facilities.",
    },
    lead: {
      ko: "무기 거래를 외교적 지원과 함께 놓으면, 거래 대금보다 큰 질문이 나타난다. S08은 AVIC·NORINCO·China South Industries의 공급 관계를 통해 무기 조달이 군정의 전력과 정권 유지에 어떤 역할을 하는지 분석한다.",
      en: "Reading arms transactions alongside diplomatic support raises a question beyond their price. S08 examines AVIC, NORINCO and China South Industries to ask how military supply relates to the junta’s capabilities and survival.",
    },
    facts: [
      {
        ko: "공급 기업 · AVIC·NORINCO·China South Industries",
        en: "Suppliers · AVIC, NORINCO and China South Industries",
      },
      {
        ko: "장비 조달 · 군정의 전력을 유지하는 연결",
        en: "Military procurement · supporting the junta’s capabilities",
      },
      {
        ko: "외교적 지원 · 2024년의 관계 변화에 관한 분석",
        en: "Diplomatic support · the study’s analysis of changes in 2024",
      },
    ],
    connection: {
      ko: "캄보디아에서는 무기 공급에서 해안의 개발사업과 시설로 시선을 넓힌다.",
      en: "Cambodia extends the question from military supply to coastal development and facilities.",
    },
  },
  {
    id: "china-cambodia",
    mode: "world",
    country: "cn",
    tint: [227, 227, 211],
    title: {
      ko: "캄보디아: 리조트 개발과 해군기지가 만나는 해안",
      en: "Cambodia: where development meets a naval base",
    },
    intro: {
      ko: "캄보디아 사례의 무대는 Ream 해군기지 주변 해안이다. S08은 Prince Group·Canopy Sands의 개발사업과 기지 확장을 함께 놓고, 상업적 진출이 전략적 접근권과 만나는 지점을 분석한다.",
      en: "Along the coast around Ream naval base, S08 examines Prince Group and Canopy Sands’ development activities alongside military expansion. The case asks how commercial footholds can acquire strategic significance.",
    },
    passages: [],
    related: ["S08", "S15"],
    bridge: {
      ko: "이 비교를 한국으로 가져오면, 어떤 기업 역량을 어떤 조건에서 유지할 것인가라는 질문이 남는다.",
      en: "For Korea, the comparison raises a question: which capabilities should be maintained, and under what conditions?",
    },
    lead: {
      ko: "캄보디아 사례의 무대는 Ream 해군기지 주변 해안이다. S08은 Prince Group·Canopy Sands의 개발사업과 기지 확장을 함께 놓고, 상업적 진출이 전략적 접근권과 만나는 지점을 분석한다.",
      en: "Along the coast around Ream naval base, S08 examines Prince Group and Canopy Sands’ development activities alongside military expansion. The case asks how commercial footholds can acquire strategic significance.",
    },
    facts: [
      {
        ko: "기업 · Prince Group·Canopy Sands",
        en: "Companies · Prince Group and Canopy Sands",
      },
      {
        ko: "공간 · Ream 해군기지 주변의 개발",
        en: "Place · development around Ream naval base",
      },
      {
        ko: "2025년 4월 5일 · S08이 다룬 훈련센터 개소",
        en: "5 April 2025 · the training-center opening discussed in S08",
      },
    ],
    connection: {
      ko: "이 비교를 한국으로 가져오면, 어떤 기업 역량을 어떤 조건에서 유지할 것인가라는 질문이 남는다.",
      en: "For Korea, the comparison raises a question: which capabilities should be maintained, and under what conditions?",
    },
  },
  {
    id: "korea-chips",
    mode: "world",
    country: "kr",
    tint: [215, 230, 218],
    title: {
      ko: "한국: 기술과 생산이 여러 제도에 걸쳐 있을 때",
      en: "Korea: technology and production across jurisdictions",
    },
    intro: {
      ko: "삼성전자와 SK하이닉스의 생산·투자 결정에는 기업의 기술뿐 아니라 여러 국가의 제도가 작용한다. 반도체 사례는 수출통제와 공급망을 통해 기업의 경쟁력과 국가의 전략적 선택이 맞물리는 방식을 보여준다.",
      en: "Samsung Electronics and SK hynix make production and investment decisions within several national legal systems. Semiconductors connect corporate competitiveness with strategic choices through export controls and supply chains.",
    },
    passages: [
      {
        report: "S16",
        blocks: ["S16-L002-P001"],
        take: 5,
      },
    ],
    related: ["S16", "S00"],
    bridge: {
      ko: "플랫폼에서도 기술의 출처, 기업의 소유, 실제 운영 권한을 함께 살펴야 한다.",
      en: "Platforms also require us to consider the origins of technology alongside ownership and operational authority.",
    },
    lead: {
      ko: "삼성전자와 SK하이닉스의 생산·투자 결정에는 기업의 기술뿐 아니라 여러 국가의 제도가 작용한다. 반도체 사례는 수출통제와 공급망을 통해 기업의 경쟁력과 국가의 전략적 선택이 맞물리는 방식을 보여준다.",
      en: "Samsung Electronics and SK hynix make production and investment decisions within several national legal systems. Semiconductors connect corporate competitiveness with strategic choices through export controls and supply chains.",
    },
    facts: [
      {
        ko: "기업 · 삼성전자·SK하이닉스",
        en: "Companies · Samsung Electronics and SK hynix",
      },
      {
        ko: "제도 · 기술·장비의 이전과 수출통제",
        en: "Institutions · transfers of technology and equipment",
      },
      {
        ko: "생산 · 여러 국가에 걸친 공급망",
        en: "Production · supply chains spanning several jurisdictions",
      },
    ],
    connection: {
      ko: "플랫폼에서도 기술의 출처, 기업의 소유, 실제 운영 권한을 함께 살펴야 한다.",
      en: "Platforms also require us to consider the origins of technology alongside ownership and operational authority.",
    },
  },
  {
    id: "korea-platforms",
    mode: "world",
    country: "kr",
    tint: [219, 228, 222],
    title: {
      ko: "플랫폼의 기술과 결정권은 누구에게 있는가",
      en: "Who holds a platform’s technology and authority?",
    },
    intro: {
      ko: "플랫폼을 한 국가의 기업이라는 이름만으로 설명하기는 어렵다. LINE 사례에서는 기술과 운영, 지분과 의결권, 규제 관할을 나누어 볼 때 기업과 국가의 관계가 더 구체적으로 드러난다.",
      en: "A platform’s nationality is only part of its story. LINE makes the state–firm relationship more tangible when technology and operations, ownership and voting rights, and regulatory jurisdiction are examined separately.",
    },
    passages: [],
    related: ["S00", "S05"],
    bridge: {
      ko: "국내 규제를 살필 때도 정책의 목적과 기업이 대응하는 방식을 함께 읽어야 한다.",
      en: "Domestic regulation likewise needs to be read together with the ways firms respond.",
    },
    lead: {
      ko: "플랫폼을 한 국가의 기업이라는 이름만으로 설명하기는 어렵다. LINE 사례에서는 기술과 운영, 지분과 의결권, 규제 관할을 나누어 볼 때 기업과 국가의 관계가 더 구체적으로 드러난다.",
      en: "A platform’s nationality is only part of its story. LINE makes the state–firm relationship more tangible when technology and operations, ownership and voting rights, and regulatory jurisdiction are examined separately.",
    },
    facts: [
      {
        ko: "기술·운영 · 서비스를 실제로 유지하는 역량",
        en: "Technology and operations · keeping a service running",
      },
      {
        ko: "지분·권한 · 투자와 의사결정의 구조",
        en: "Ownership and authority · investment and decision-making",
      },
      {
        ko: "규제 관할 · 감독과 책임을 묻는 주체",
        en: "Jurisdiction · supervision and accountability",
      },
    ],
    connection: {
      ko: "국내 규제를 살필 때도 정책의 목적과 기업이 대응하는 방식을 함께 읽어야 한다.",
      en: "Domestic regulation likewise needs to be read together with the ways firms respond.",
    },
  },
  {
    id: "korea-regulation",
    mode: "world",
    country: "kr",
    tint: [228, 227, 218],
    title: {
      ko: "규제는 어떤 기업 전략을 만들어 내는가",
      en: "How do firms respond to regulation?",
    },
    intro: {
      ko: "타다·쿠팡·카카오의 사례에서는 공적 목적을 가진 규제가 기업의 사업 전략과 만난다. S00은 정책이 해결하려는 문제와 기업의 대응을 함께 살피며, 한국의 제도적 조건을 비판적으로 검토한다.",
      en: "The cases of Tada, Coupang and Kakao place public policy alongside corporate strategy. S00 considers the problems regulation seeks to address and how firms respond, offering a critique of Korea’s institutional conditions.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L003-P016"],
      },
    ],
    related: ["S00", "S14"],
    bridge: {
      ko: "방산에서는 국가의 목표와 기업의 기술·생산 역량이 더욱 직접적으로 만난다.",
      en: "Defense brings national objectives into a more direct relationship with corporate technology and production.",
    },
    lead: {
      ko: "타다·쿠팡·카카오의 사례에서는 공적 목적을 가진 규제가 기업의 사업 전략과 만난다. S00은 정책이 해결하려는 문제와 기업의 대응을 함께 살피며, 한국의 제도적 조건을 비판적으로 검토한다.",
      en: "The cases of Tada, Coupang and Kakao place public policy alongside corporate strategy. S00 considers the problems regulation seeks to address and how firms respond, offering a critique of Korea’s institutional conditions.",
    },
    facts: [
      {
        ko: "사례 · 타다·쿠팡·카카오",
        en: "Cases · Tada, Coupang and Kakao",
      },
      {
        ko: "정책 · 공적 목적과 제도 변화",
        en: "Policy · public objectives and institutional change",
      },
      {
        ko: "기업 · 사업모델과 대응 전략",
        en: "Firms · business models and strategic responses",
      },
    ],
    connection: {
      ko: "방산에서는 국가의 목표와 기업의 기술·생산 역량이 더욱 직접적으로 만난다.",
      en: "Defense brings national objectives into a more direct relationship with corporate technology and production.",
    },
  },
  {
    id: "korea-defense",
    mode: "world",
    country: "kr",
    tint: [216, 229, 217],
    title: {
      ko: "방산기업의 역량을 국가 전략과 잇다",
      en: "Connecting defense firms with national strategy",
    },
    intro: {
      ko: "한화·LIG 등의 방산기업은 기술 개발, 생산, 수출을 통해 국가 전략과 관계를 맺는다. S17의 기업 분석과 S00의 정책 제안을 함께 읽으면, 기업을 지원하는 조건과 기업에 요구할 기여를 구체적으로 물을 수 있다.",
      en: "Firms such as Hanwha and LIG connect with national strategy through development, production and exports. Reading S17 alongside S00 makes it possible to ask what support firms should receive and what contributions should be expected in return.",
    },
    passages: [
      {
        report: "S17",
        blocks: ["S17-L003-P001"],
        take: 2,
      },
    ],
    related: ["S11", "S17", "S00"],
    bridge: {
      ko: "사례를 연결한 다음에는 그 연결을 어떤 자료와 방법으로 읽었는지 살펴볼 차례다.",
      en: "Having connected the cases, I turn to the evidence and methods used to read them.",
    },
    lead: {
      ko: "한화·LIG 등의 방산기업은 기술 개발, 생산, 수출을 통해 국가 전략과 관계를 맺는다. S17의 기업 분석과 S00의 정책 제안을 함께 읽으면, 기업을 지원하는 조건과 기업에 요구할 기여를 구체적으로 물을 수 있다.",
      en: "Firms such as Hanwha and LIG connect with national strategy through development, production and exports. Reading S17 alongside S00 makes it possible to ask what support firms should receive and what contributions should be expected in return.",
    },
    facts: [
      {
        ko: "역량 · 기술 개발·생산·수출",
        en: "Capabilities · development, production and exports",
      },
      {
        ko: "기업 분석 · S17의 재무 지표와 분석 방법",
        en: "Firm analysis · S17’s financial indicators and methods",
      },
      {
        ko: "정책 질문 · 지원의 조건과 공적 기여",
        en: "Policy question · conditions for support and public contribution",
      },
    ],
    connection: {
      ko: "사례를 연결한 다음에는 그 연결을 어떤 자료와 방법으로 읽었는지 살펴볼 차례다.",
      en: "Having connected the cases, I turn to the evidence and methods used to read them.",
    },
  },
  {
    id: "spatial-method",
    mode: "world",
    tint: [211, 226, 230],
    title: {
      ko: "사건을 시간과 공간 위에 놓아 보기",
      en: "Reading events through time and space",
    },
    intro: {
      ko: "기업, 시설, 거래를 따로 볼 때와 같은 시간·공간에 놓을 때 생기는 질문은 다르다. 공간 분석은 관계를 발견하는 데 쓰이고, 기업 지표 분석은 여러 기업의 특징을 비교하는 데 쓰인다. 자료를 조직하는 방법이 연구의 질문도 바꾼다.",
      en: "Firms, facilities and transactions raise different questions when examined separately or aligned in time and space. Spatial analysis helps identify relationships; financial indicators help compare firms. How evidence is organized shapes the questions we can ask.",
    },
    passages: [
      {
        report: "S15",
        blocks: ["S15-L003-P001"],
        take: 2,
      },
    ],
    related: ["S15", "S08", "S17"],
    bridge: {
      ko: "방법이 다른 연구들을 다시 모으면, 국가와 기업의 관계를 묻는 하나의 논증이 된다.",
      en: "Bringing these different methods together develops a shared argument about the state and the firm.",
    },
    lead: {
      ko: "기업, 시설, 거래를 따로 볼 때와 같은 시간·공간에 놓을 때 생기는 질문은 다르다. 공간 분석은 관계를 발견하는 데 쓰이고, 기업 지표 분석은 여러 기업의 특징을 비교하는 데 쓰인다. 자료를 조직하는 방법이 연구의 질문도 바꾼다.",
      en: "Firms, facilities and transactions raise different questions when examined separately or aligned in time and space. Spatial analysis helps identify relationships; financial indicators help compare firms. How evidence is organized shapes the questions we can ask.",
    },
    facts: [
      {
        ko: "공간 분석 · 행위자·장소·시간을 함께 비교",
        en: "Spatial analysis · comparing actors, places and times",
      },
      {
        ko: "자료와 해석 · 기록에서 논증으로",
        en: "Evidence and interpretation · from records to an argument",
      },
      {
        ko: "PCA · 여섯 지표의 정보를 적은 수의 축으로 압축",
        en: "PCA · reducing several indicators to fewer analytical axes",
      },
    ],
    connection: {
      ko: "방법이 다른 연구들을 다시 모으면, 국가와 기업의 관계를 묻는 하나의 논증이 된다.",
      en: "Bringing these different methods together develops a shared argument about the state and the firm.",
    },
  },
  {
    id: "synthesis",
    mode: "integration",
    tint: [230, 232, 230],
    title: {
      ko: "기업의 힘을 어떤 공적 목적에 연결할 것인가",
      en: "What public purposes should corporate power serve?",
    },
    intro: {
      ko: "내가 이 연구들을 함께 읽는 이유는 기업의 생존과 국가의 힘을 별개의 문제로 보기 어렵기 때문이다. 기술, 정체성, 제도가 만나는 지점을 따라온 논의는 기업에 제공할 지원과 기업이 감당할 책임을 함께 묻는 S00의 제안으로 모인다.",
      en: "I bring these studies together because corporate survival and national power are difficult to separate. Following technology, identity and institutions leads to S00’s proposal: consider the support given to firms together with the responsibilities expected of them.",
    },
    passages: [
      {
        report: "S00",
        blocks: ["S00-L006-P018", "S00-L006-P019", "S00-L006-P020"],
      },
    ],
    related: ["S00", "S06", "S14", "S16"],
    bridge: {
      ko: "내가 남기는 질문은 지원의 크기보다 그 조건이다. 기업의 역량이 공적 기여로 이어지도록 어떤 책임과 견제 장치를 설계할 것인가.",
      en: "My remaining question concerns the conditions of support more than its scale. What responsibilities and checks can connect corporate capability with public contribution?",
    },
    lead: {
      ko: "내가 이 연구들을 함께 읽는 이유는 기업의 생존과 국가의 힘을 별개의 문제로 보기 어렵기 때문이다. 기술, 정체성, 제도가 만나는 지점을 따라온 논의는 기업에 제공할 지원과 기업이 감당할 책임을 함께 묻는 S00의 제안으로 모인다.",
      en: "I bring these studies together because corporate survival and national power are difficult to separate. Following technology, identity and institutions leads to S00’s proposal: consider the support given to firms together with the responsibilities expected of them.",
    },
    facts: [
      {
        ko: "출발 질문 · 기업의 존속과 기술의 목적",
        en: "Starting questions · corporate resilience and technological purpose",
      },
      {
        ko: "비교 · 미국·중국·한국의 서로 다른 결속 방식",
        en: "Comparison · different forms of state–firm coordination",
      },
      {
        ko: "제안 · 지원, 기여, 책임을 함께 설계",
        en: "Proposal · designing support, contribution and accountability together",
      },
    ],
    connection: {
      ko: "내가 남기는 질문은 지원의 크기보다 그 조건이다. 기업의 역량이 공적 기여로 이어지도록 어떤 책임과 견제 장치를 설계할 것인가.",
      en: "My remaining question concerns the conditions of support more than its scale. What responsibilities and checks can connect corporate capability with public contribution?",
    },
  },
];
