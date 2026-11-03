/** Exact substrings from the locked Korean reading editions and editorial translations.
 * User approved these three cases on 2026-11-03. No derived values or mixed-basis chart. */
export const figureCallouts = [
  {
    scene: "china-arctic",
    report: "S08",
    anchor: "S08-R001-P010",
    figure: { ko: "5억 5천만 달러", en: "USD 550 million" },
    caption: {
      ko: "2018년 중국 국영기업 CCCC가 누크, 일루리사트, 카코르톡 세 곳의 공항망 확장 사업",
      en: "investment in airport expansion in Nuuk, Ilulissat and Qaqortoq",
    },
    context: {
      ko: "2019년 6월 입찰이 최종 철회되었다.",
      en: "the bid was finally withdrawn in June 2019.",
    },
  },
  {
    scene: "china-myanmar",
    report: "S08",
    anchor: "S08-R003-P001",
    figure: { ko: "약 2억 6천만 달러", en: "approximately USD 260 million" },
    caption: { ko: "2021년부터 2022년 사이", en: "Between 2021 and 2022" },
    context: {
      ko: "미얀마 사례는 정권 생존과 무기 의존성이 결합된 구조를 보여준다.",
      en: "The Myanmar case shows a structure combining regime survival and dependence on weapons.",
    },
  },
  {
    scene: "korea-chips",
    report: "S16",
    anchor: "S16-R002-P003",
    figure: { ko: "1,734.8억 달러", en: "record USD 173.48 billion in 2025" },
    caption: {
      ko: "2025년 한국의 반도체 ICT 수출",
      en: "Semiconductor ICT exports",
    },
    context: {
      ko: "다만 이 통계만으로 중국 대상 수출 감소의 원인이 수출통제라고 단정할 수는 없다. AI 산업의 수요 변화, 반도체 가격, 제품 구성과 국가별 경기 등 다른 요인도 영향을 미칠 수 있기 때문이다.",
      en: "These figures alone do not establish that export controls caused the decline to China: changing AI demand, chip prices, product mix and national economic conditions could also have contributed.",
    },
  },
] as const;
