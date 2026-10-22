export type ReadingTable = {
  id: string;
  reportId: string;
  paragraphIds: string[];
  caption: { ko: string; en: string };
  headers: { ko: string[]; en: string[] };
  rows: { ko: string[]; en: string[] }[];
};
export const readingTables: ReadingTable[] = [
  {
    id: "s14-schema",
    reportId: "S14",
    paragraphIds: ["S14-R003-P008", "S14-R004-P002"],
    caption: {
      ko: "원문의 개념 모사 표 · 실제 운용 시스템의 스키마를 확인한 자료가 아닙니다.",
      en: "Conceptual simulation supplied by the author; not a verified operational system schema.",
    },
    headers: {
      ko: [
        "User_ID",
        "Location_Type",
        "Night_Access_Count",
        "Network_Logins",
        "True_Identity",
        "System_Object_Mapping",
      ],
      en: [
        "User_ID",
        "Location_Type",
        "Night_Access_Count",
        "Network_Logins",
        "True_Identity",
        "System_Object_Mapping",
      ],
    },
    rows: [
      {
        ko: [
          "USR_001",
          "Zone_A (외곽)",
          "5",
          "72",
          "실제 적대 침입자",
          "High_Risk_Object",
        ],
        en: [
          "USR_001",
          "Zone_A (outskirts)",
          "5",
          "72",
          "Actual hostile intruder",
          "High_Risk_Object",
        ],
      },
      {
        ko: [
          "USR_002",
          "Office (행정)",
          "0",
          "12",
          "일반 행정 직원",
          "Standard_User_Object",
        ],
        en: [
          "USR_002",
          "Office (administration)",
          "0",
          "12",
          "Ordinary administrative employee",
          "Standard_User_Object",
        ],
      },
      {
        ko: [
          "USR_003",
          "School_Zone",
          "4",
          "55",
          "야간 당직 교사 A",
          "High_Risk_Object",
        ],
        en: [
          "USR_003",
          "School_Zone",
          "4",
          "55",
          "Night-duty teacher A",
          "High_Risk_Object",
        ],
      },
      {
        ko: [
          "USR_004",
          "School_Zone",
          "3",
          "61",
          "야간 당직 교사 B",
          "High_Risk_Object",
        ],
        en: [
          "USR_004",
          "School_Zone",
          "3",
          "61",
          "Night-duty teacher B",
          "High_Risk_Object",
        ],
      },
      {
        ko: [
          "INF_001",
          "School_Zone (인프라)",
          "—",
          "—",
          "교육 시설 건물",
          "Unclassified_Structure",
        ],
        en: [
          "INF_001",
          "School_Zone (infrastructure)",
          "—",
          "—",
          "Educational-facility building",
          "Unclassified_Structure",
        ],
      },
    ],
  },
  {
    id: "s14-comparison",
    reportId: "S14",
    paragraphIds: ["S14-R005-P002"],
    caption: {
      ko: "원문 비교표 · 시스템별 성능과 운용 주장은 독립 검증 전입니다.",
      en: "Comparison as reported in the source; system performance and operational claims await independent verification.",
    },
    headers: {
      ko: ["비교 항목", "IDF Lavender (2023)", "Palantir Gotham"],
      en: ["Comparison", "IDF Lavender (2023)", "Palantir Gotham"],
    },
    rows: [
      {
        ko: [
          "표적 생성 방식",
          "통계적 특징 기반 37,000명 대량 생성",
          "객체-관계 기반 CEF 임계값 산출",
        ],
        en: [
          "Target generation",
          "Bulk generation of 37,000 people from statistical features",
          "Object–relationship-based CEF thresholds",
        ],
      },
      {
        ko: [
          "오탐 허용률",
          "약 10% 민간인 오탐 기계적 승인",
          "CEF 비례성 규칙 통한 오탐 최소화 지향",
        ],
        en: [
          "False-positive tolerance",
          "Mechanical acceptance of approximately 10% civilian false positives",
          "Aims to minimize false positives through CEF proportionality rules",
        ],
      },
      {
        ko: [
          "구별 원칙 구현",
          "통계적 군집으로 개별성 소멸",
          "CEF 수치화를 통한 조건부 구현 (불완전)",
        ],
        en: [
          "Distinction",
          "Statistical grouping erases individuality",
          "Conditional, incomplete implementation through CEF quantification",
        ],
      },
      {
        ko: [
          "Supreme Emergency 상시화",
          "완전 상시화 — 예외가 일상으로 고착",
          "인간 승인 루프(TPL)로 부분 제동",
        ],
        en: [
          "Normalized supreme emergency",
          "Fully normalized: exceptions become routine",
          "Partly restrained by the human-approval loop, TPL",
        ],
      },
      {
        ko: [
          "도덕적 위치",
          "예외 논리 전면 상시화의 반면교사",
          "필연적 시스템이나 공백 보완 요구",
        ],
        en: [
          "Moral position",
          "Negative example of fully normalized exceptions",
          "A necessary system requiring correction of gaps",
        ],
      },
    ],
  },
  {
    id: "s14-feedback",
    reportId: "S14",
    paragraphIds: [
      "S14-R005-P006",
      "S14-R005-P007",
      "S14-R005-P008",
      "S14-R006-P002",
      "S14-R006-P003",
      "S14-R006-P004",
    ],
    caption: {
      ko: "저자가 제안하는 반성적 평형과 파이프라인 환류 구조",
      en: "The author's proposed reflective-equilibrium and pipeline-feedback structure",
    },
    headers: {
      ko: ["반성적 평형 단계", "파이프라인 환류 구조", "원칙 수정의 내용"],
      en: [
        "Reflective-equilibrium stage",
        "Pipeline-feedback structure",
        "Revision to principles",
      ],
    },
    rows: [
      {
        ko: [
          "1. 도덕 직관의 거부 반응",
          "미납 사건 현장 데이터 식별",
          "구별 원칙 이분법적 적용의 한계 인지",
        ],
        en: [
          "1. Resistance from moral intuition",
          "Identify field data from Minab",
          "Recognize the limits of binary distinction",
        ],
      },
      {
        ko: [
          "2. 상위 원칙 디버깅",
          "파이프라인 역추적 → 컨텍스트 공백 진단",
          "구별 원칙을 실시간 다차원 가중치 기반으로 재해석",
        ],
        en: [
          "2. Debug higher principles",
          "Trace the pipeline backward → diagnose contextual gaps",
          "Reinterpret distinction through real-time multidimensional weights",
        ],
      },
      {
        ko: [
          "3. 온톨로지 재설계",
          "Civilian_Infrastructure 필수 가중치 조건 신설",
          "재해석된 원칙이 공학 설계로 구현됨",
        ],
        en: [
          "3. Redesign ontology",
          "Require Civilian_Infrastructure weighting conditions",
          "Implement reinterpreted principles in engineering design",
        ],
      },
      {
        ko: [
          "4. 새로운 균형 도달",
          "수정 스키마 가동 → 방어력·윤리성 동시 확보",
          "반성적 평형의 능동적 달성",
        ],
        en: [
          "4. Reach a new equilibrium",
          "Operate the revised schema → combine defense and ethics",
          "Actively achieve reflective equilibrium",
        ],
      },
    ],
  },
];
