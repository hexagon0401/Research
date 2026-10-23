/** Editorial storyboards. Source transcripts and translations remain immutable. */
export type Copy = { ko: string; en: string };
export const words = (ko: string, en: string): Copy => ({ ko, en });
export type SourceRef = { report: string; paragraph: string };
export type MotionStep = {
  id: string;
  beat: string;
  title: Copy;
  lead: Copy;
  facts: Copy[];
  connection: Copy;
  detail?: Copy;
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
export const chinaSteps: MotionStep[] = [
  {
    id: "greenland-proposal",
    beat: "china-arctic",
    date: "2018",
    precision: "year",
    kind: "investment",
    title: {
      ko: "공항망을 통한 북극 접근",
      en: "Arctic access through airport infrastructure",
    },
    status: {
      ko: "공항 사업 제안",
      en: "Airport proposal",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R001-P010",
      },
    ],
    lead: {
      ko: "2018년 CCCC는 그린란드의 세 공항 사업에 참여하는 제안을 내놓았다. S08은 공항 인프라를 기업의 해외 진출과 전략적 접근권이 만나는 공간으로 읽는다.",
      en: "In 2018, CCCC proposed participating in three Greenland airport projects. S08 reads airport infrastructure as a meeting point of overseas business and strategic access.",
    },
    facts: [
      {
        ko: "기업 · CCCC",
        en: "Company · CCCC",
      },
      {
        ko: "대상 · 누크·일루리사트·카코르톡 공항",
        en: "Places · Nuuk, Ilulissat and Qaqortoq airports",
      },
    ],
    connection: {
      ko: "나는 세 지역을 통해 기업의 사업이 각기 다른 방식으로 국가와 결속하는 과정을 비교한다.",
      en: "Across these places, I compare the different ways corporate activity becomes connected with the state.",
    },
  },
  {
    id: "greenland-withdrawal",
    beat: "china-arctic",
    date: "2019-06",
    precision: "month",
    kind: "investment",
    title: {
      ko: "입찰은 철회되고 다른 사업 관계는 남는다",
      en: "A withdrawn airport bid and other corporate ties",
    },
    status: {
      ko: "공항 입찰 철회",
      en: "Airport bid withdrawn",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R001-P010",
      },
    ],
    lead: {
      ko: "2019년 6월 공항 입찰이 철회됐다. S08은 이 사건 이후의 그린란드를 광물 분야의 기업 관계와 함께 살피며, 접근권을 확보하는 여러 경로를 비교한다.",
      en: "The airport bid was withdrawn in June 2019. S08 considers the event alongside corporate ties in the mineral sector, comparing different routes to strategic access.",
    },
    facts: [
      {
        ko: "2019년 6월 · 공항 입찰 철회",
        en: "June 2019 · airport bid withdrawal",
      },
      {
        ko: "광물 분야 · Shenghe Resources의 별도 기업 관계",
        en: "Minerals · separate corporate ties involving Shenghe Resources",
      },
    ],
    connection: {
      ko: "나는 세 지역을 통해 기업의 사업이 각기 다른 방식으로 국가와 결속하는 과정을 비교한다.",
      en: "Across these places, I compare the different ways corporate activity becomes connected with the state.",
    },
  },
  {
    id: "myanmar-supply",
    beat: "china-myanmar",
    date: "2021–2022",
    precision: "period",
    kind: "reported-supply",
    title: {
      ko: "무기 공급망이 정권의 버팀목이 될 때",
      en: "Arms supply and regime resilience",
    },
    status: {
      ko: "군수품 조달 · S08",
      en: "Military supply · S08",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R003-P001",
      },
    ],
    lead: {
      ko: "무기 거래를 외교적 지원과 함께 놓으면, 거래 대금보다 큰 질문이 나타난다. S08은 중국 군수기업의 공급 관계를 통해 장비 조달이 미얀마 군정의 전력과 정권 유지에 어떤 역할을 하는지 분석한다.",
      en: "Reading arms transactions alongside diplomacy raises a question beyond their price. S08 examines Chinese suppliers to ask how military procurement relates to the Myanmar junta’s capabilities and survival.",
    },
    facts: [
      {
        ko: "공급자 · AVIC·NORINCO·China South Industries",
        en: "Suppliers · AVIC, NORINCO and China South Industries",
      },
      {
        ko: "2021–2022 · S08이 다룬 장비 조달",
        en: "2021–2022 · equipment procurement discussed in S08",
      },
    ],
    connection: {
      ko: "캄보디아에서는 무기 공급에서 해안의 개발사업과 시설로 시선을 넓힌다.",
      en: "Cambodia extends the question from military supply to coastal development and facilities.",
    },
  },
  {
    id: "myanmar-diplomacy",
    beat: "china-myanmar",
    date: "2024-08",
    precision: "month",
    kind: "analysis",
    title: {
      ko: "외교적 지원이 더해지는 공급 관계",
      en: "Supply relationships alongside diplomatic support",
    },
    status: {
      ko: "외교 관계 · 연구의 해석",
      en: "Diplomacy · research interpretation",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R003-P001",
      },
    ],
    lead: {
      ko: "S08은 2024년 8월의 외교적 움직임을 앞선 군수품 공급과 함께 다룬다. 장비를 거래하는 기업의 관계가 국가의 영향력과 정권 유지의 문제로 이어지는 대목이다.",
      en: "S08 reads diplomatic developments in August 2024 alongside earlier military supply. Corporate transactions become part of a wider inquiry into state influence and regime survival.",
    },
    facts: [
      {
        ko: "2024년 8월 · 왕이의 방문을 다룬 분석",
        en: "August 2024 · the study’s account of Wang Yi’s visit",
      },
      {
        ko: "논점 · 군수품 공급과 외교적 지원의 결합",
        en: "Question · military supply alongside diplomatic support",
      },
    ],
    connection: {
      ko: "캄보디아에서는 무기 공급에서 해안의 개발사업과 시설로 시선을 넓힌다.",
      en: "Cambodia extends the question from military supply to coastal development and facilities.",
    },
  },
  {
    id: "cambodia-relations",
    beat: "china-cambodia",
    date: "2025-04-05",
    precision: "day",
    kind: "investment",
    title: {
      ko: "리조트 개발과 해군기지가 만나는 해안",
      en: "Where development meets a naval base",
    },
    status: {
      ko: "상업 개발·시설 관계",
      en: "Development and facilities",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R002-P002",
      },
    ],
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
        ko: "공간 · Ream 해군기지 주변 해안",
        en: "Place · the coast around Ream naval base",
      },
    ],
    connection: {
      ko: "이 비교를 한국으로 가져오면, 어떤 기업 역량을 어떤 조건에서 유지할 것인가라는 질문이 남는다.",
      en: "For Korea, the comparison raises a question: which capabilities should be maintained, and under what conditions?",
    },
  },
  {
    id: "china-comparison",
    beat: "china-cambodia",
    date: "2018–2025",
    precision: "period",
    kind: "analysis",
    title: {
      ko: "세 지역에서 반복되는 국가와 기업의 질문",
      en: "A recurring question across three places",
    },
    status: {
      ko: "세 사례 비교",
      en: "Comparing three cases",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R001-P010",
      },
      {
        report: "S08",
        paragraph: "S08-R003-P001",
      },
      {
        report: "S08",
        paragraph: "S08-R002-P002",
      },
    ],
    lead: {
      ko: "그린란드의 공항, 미얀마의 무기 공급, 캄보디아의 해안 개발은 서로 다른 사업이다. 함께 비교할 때 드러나는 질문은 기업의 활동이 어떤 제도와 공간을 통해 국가의 전략과 만나는가이다.",
      en: "Airports in Greenland, arms supply in Myanmar and coastal development in Cambodia involve different activities. Together they ask which institutions and places connect corporate activity with state strategy.",
    },
    facts: [
      {
        ko: "그린란드 · 인프라와 접근권",
        en: "Greenland · infrastructure and access",
      },
      {
        ko: "미얀마 · 공급망과 군정의 지속 능력",
        en: "Myanmar · supply networks and regime resilience",
      },
      {
        ko: "캄보디아 · 개발사업과 전략적 공간",
        en: "Cambodia · development and strategic space",
      },
    ],
    connection: {
      ko: "이 비교를 한국으로 가져오면, 어떤 기업 역량을 어떤 조건에서 유지할 것인가라는 질문이 남는다.",
      en: "For Korea, the comparison raises a question: which capabilities should be maintained, and under what conditions?",
    },
  },
  {
    id: "china-replay",
    beat: "china-cambodia",
    date: "2018–2025",
    precision: "period",
    kind: "analysis",
    title: {
      ko: "사업의 형태를 넘어 결속의 조건으로",
      en: "From forms of business to conditions of coordination",
    },
    status: {
      ko: "통합 연구로 이어지는 질문",
      en: "Toward the integrated inquiry",
    },
    sources: [
      {
        report: "S08",
        paragraph: "S08-R001-P010",
      },
      {
        report: "S08",
        paragraph: "S08-R003-P001",
      },
      {
        report: "S08",
        paragraph: "S08-R002-P002",
      },
    ],
    lead: {
      ko: "내가 세 지역을 함께 보는 이유는 사업의 형태가 달라도 기업과 국가의 결속을 묻는 질문으로 이어지기 때문이다. 이 비교는 한국에서 어떤 역량을 어떤 조건으로 유지할 것인가라는 다음 질문을 남긴다.",
      en: "I compare these places because different forms of business lead back to a shared question about the firm and the state. That comparison raises the next question for Korea: which capabilities should be maintained, and under what conditions?",
    },
    facts: [
      {
        ko: "비교의 축 · 기업, 제도, 공간",
        en: "Comparative axes · firms, institutions and space",
      },
      {
        ko: "다음 질문 · 한국 기업의 역량과 공적 책임",
        en: "Next question · Korean firms’ capabilities and public responsibilities",
      },
    ],
    connection: {
      ko: "이 비교를 한국으로 가져오면, 어떤 기업 역량을 어떤 조건에서 유지할 것인가라는 질문이 남는다.",
      en: "For Korea, the comparison raises a question: which capabilities should be maintained, and under what conditions?",
    },
  },
];
export function sourceHref(step: MotionStep, source: SourceRef) {
  return `/reports/${source.report}?from=${step.beat}#${source.paragraph}`;
}
