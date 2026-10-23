import { words, type Copy } from "./motion-stories";
export type MechanismStep = { title: Copy; copy: Copy; source: string };
export type Mechanism = {
  group: "origin" | "america" | "korea" | "method" | "synthesis";
  title: Copy;
  note: Copy;
  steps: MechanismStep[];
};
const step = (
  ko: string,
  en: string,
  k: string,
  e: string,
  source: string,
): MechanismStep => ({ title: words(ko, en), copy: words(k, e), source });
export const mechanisms: Record<string, Mechanism> = {
  capability: {
    group: "origin",
    title: words(
      "기업에서 국가로, 질문이 이동하다",
      "Watch a question move from firm to state",
    ),
    note: words(
      "편집 연결 · 기술 보유와 전략적 결과의 인과를 구분합니다.",
      "Editorial connection · capability is distinct from proof of strategic effects.",
    ),
    steps: [
      step(
        "기업 → 기술",
        "Firm → technology",
        "기업이 오래 살아남는 조건을 묻는 S06에서 출발합니다. 선은 기술적 우위라는 첫 질문에 도착합니다.",
        "Begin with S06: what lets a firm endure? The line reaches the first question of technological advantage.",
        "S06",
      ),
      step(
        "기술 → 정체성",
        "Technology → identity",
        "같은 기술도 무엇을 위해 사용하는가에 따라 방향이 달라집니다. 정체성의 가지는 S14의 질문입니다.",
        "Purpose changes the direction of the same capability. The identity branch opens S14’s question.",
        "S14",
      ),
      step(
        "데이터 · 계약 · 생산",
        "Data · contracts · production",
        "기업의 역량은 데이터, 계약, 생산 기반을 통해 더 큰 구조와 연결됩니다. 세 신호를 따로 따라가 보세요.",
        "Follow three separate signals: data, contracts and productive capacity connect corporate capability to a larger structure.",
        "S01",
      ),
      step(
        "국가의 전략적 역량",
        "National strategic capability",
        "이 연결이 국가의 선택지로 확장됩니다. 이것은 분석의 틀이며, 특정 군사·외교 결과의 인과 증명은 아닙니다.",
        "The connections expand into national options: an analytical framework, not proof of a particular military or diplomatic outcome.",
        "S02",
      ),
    ],
  },
  "us-mission": {
    group: "america",
    title: words(
      "요구에서 제품으로, 조달의 연결",
      "From demand to product: procurement",
    ),
    note: words(
      "분석 구조 · 계약 한도·발주액·매출은 서로 다릅니다.",
      "Analytical structure · ceilings, orders and revenue are different.",
    ),
    steps: [
      step(
        "공적 요구",
        "Public demand",
        "정부의 요구가 기업의 기술과 만납니다. Palantir·Anduril의 사명과 조달 관계를 함께 읽습니다.",
        "Public demand meets corporate technology. Read Palantir and Anduril’s stated missions alongside procurement.",
        "S00",
      ),
      step(
        "제품 개발",
        "Product development",
        "조달은 반복 수요와 개발 기회를 제공할 수 있습니다. 계약의 존재만으로 철학적 충성심의 효과를 입증하지는 않습니다.",
        "Procurement can offer recurring demand and development opportunities. A contract alone does not prove the effect of philosophical loyalty.",
        "S02",
      ),
      step(
        "사용 경험과 환류",
        "Use and feedback",
        "운영 경험이 다음 개발 질문으로 돌아오는 개념적 연결입니다. 실제 성과 수치를 만들어 넣지 않습니다.",
        "Operational experience returns as a conceptual feedback path to development, without invented performance figures.",
        "S01",
      ),
    ],
  },
  "us-dome": {
    group: "america",
    title: words("감지 → 통합 → 판단", "Sense → integrate → decide"),
    note: words(
      "S03·S13의 체계 구상 · 실제 배치나 기업 수주 확정이 아닙니다.",
      "A system concept in S03 / S13, not confirmed deployment or awards.",
    ),
    steps: [
      step(
        "서로 다른 감지",
        "Separate observations",
        "위성과 레이더의 신호는 서로 다른 곳에서 시작합니다. 센서가 존재한다는 것만으로 하나의 체계가 되지는 않습니다.",
        "Satellite and radar signals start separately. Possessing sensors does not by itself create one system.",
        "S13",
      ),
      step(
        "공통 의미 계층",
        "A shared meaning layer",
        "신호가 데이터 통합 지점으로 모입니다. 서로 다른 기술을 같은 판단에 사용할 수 있도록 연결하는 단계입니다.",
        "Signals meet at data integration: connecting distinct technologies so they can inform a common decision.",
        "S03",
      ),
      step(
        "판단과 대응의 연결",
        "Connect decision and response",
        "통합된 정보를 지휘·판단·대응으로 잇습니다. 노드를 선택해 원문의 제안된 역할을 확인하세요.",
        "Connect integrated information to command, decision and response. Select a node to read the proposed roles in context.",
        "S13",
      ),
    ],
  },
  "us-finance": {
    group: "america",
    title: words(
      "발행과 상환, 서로 다른 방향",
      "Issuance and redemption run in different directions",
    ),
    note: words(
      "작동 원리 개략도 · 실제 준비자산 비율·독점 보장 아님",
      "Mechanism schematic · not reserve proportions or a monopoly guarantee",
    ),
    steps: [
      step(
        "법정화폐와 발행자",
        "Fiat and issuer",
        "달러 연동 토큰은 발행자의 준비와 상환 구조를 함께 살펴야 합니다.",
        "Read a dollar-linked token together with its issuer’s reserve and redemption structure.",
        "S05",
      ),
      step(
        "준비자산",
        "Reserve assets",
        "원문은 Tether의 준비자산과 미 국채를 금융 영향력의 질문으로 연결합니다.",
        "The source connects Tether’s reserves and Treasuries to a question of monetary influence.",
        "S00",
      ),
      step(
        "토큰과 상환",
        "Token and redemption",
        "발행·상환 선택으로 반대 방향의 연결을 살펴봅니다. 국채 보유가 면책이나 독점권을 뜻하지는 않습니다.",
        "Switch between issuance and redemption to follow opposite directions. Treasury holdings do not establish immunity or monopoly rights.",
        "S05",
      ),
    ],
  },
  "us-ships": {
    group: "america",
    title: words(
      "법령·발주·시설에서 산업 기반으로",
      "From law, orders and facilities to capacity",
    ),
    note: words(
      "제도적 연결 · 예산 배정과 생산 결과는 구분합니다.",
      "Institutional connections · appropriations and output are distinct.",
    ),
    steps: [
      step(
        "제도",
        "Institution",
        "존스법과 관련 정책을 시장이 작동하는 조건으로 읽습니다.",
        "Read the Jones Act and related policy as conditions under which a market operates.",
        "S00",
      ),
      step(
        "발주와 시설",
        "Orders and facilities",
        "발주·투자와 조선소의 생산 기반이 만나는 연결을 그립니다.",
        "Follow the connection between orders, investment and shipyard capacity.",
        "S00",
      ),
      step(
        "국가의 선택지",
        "National options",
        "산업 기반은 전략적 선택과 연결됩니다. 예산만으로 실제 생산 능력 향상을 단정하지 않습니다.",
        "Industrial capacity connects to strategic options. Funding alone does not establish increased output.",
        "S02",
      ),
    ],
  },
  "korea-chips": {
    group: "korea",
    title: words(
      "하나의 기업, 여러 관할의 조건",
      "One firm, conditions across jurisdictions",
    ),
    note: words(
      "관련 위치와 제도 조건 · 실제 수송량·차단 결과 아님",
      "Reference geography and institutional conditions, not shipment volumes or observed blocks",
    ),
    steps: [
      step(
        "기술과 장비",
        "Technology and equipment",
        "미국의 기술·장비와 수출통제 조건을 살핍니다.",
        "Examine U.S. technology, equipment and export-control conditions.",
        "S16",
      ),
      step(
        "한국 기업",
        "Korean firms",
        "삼성·SK하이닉스는 기업의 기술과 여러 국가의 제도 사이에서 생산·투자 선택을 합니다.",
        "Samsung and SK hynix face production and investment choices spanning technology and several legal systems.",
        "S16",
      ),
      step(
        "생산 거점과 허가",
        "Production and permissions",
        "중국의 생산 거점을 함께 놓으면 허가와 공급망 조건이 기업 내부의 선택과 만납니다.",
        "Including production sites in China reveals how permissions and supply-chain conditions meet corporate choices.",
        "S16",
      ),
    ],
  },
  "korea-platforms": {
    group: "korea",
    title: words(
      "기술·소유·관할을 분해해 보기",
      "Separate technology, ownership and jurisdiction",
    ),
    note: words(
      "구조 설명 · 외국인 지분만으로 데이터 유출·국가 통제를 입증하지 않습니다.",
      "Structural explanation · foreign equity alone does not establish data leakage or state control.",
    ),
    steps: [
      step(
        "기술과 운영",
        "Technology and operation",
        "서비스를 만든 기술과 실제 운영 주체를 먼저 구분합니다.",
        "First distinguish the technology behind a service from the entity operating it.",
        "S00",
      ),
      step(
        "소유와 권한",
        "Ownership and authority",
        "주주 지분·의결권·운영 계약은 다른 종류의 권리입니다.",
        "Equity, voting rights and operating agreements are distinct rights.",
        "S00",
      ),
      step(
        "규제 관할",
        "Regulatory jurisdiction",
        "LINE 사례를 어떤 국가의 어떤 제도가 적용되는가라는 질문으로 다시 봅니다.",
        "Revisit LINE through the question of which jurisdiction and rules apply.",
        "S05",
      ),
    ],
  },
  "korea-regulation": {
    group: "korea",
    title: words(
      "정책 목적과 결과를 나란히",
      "Place policy aims beside outcomes",
    ),
    note: words(
      "S00의 정책 비판 · 개별 인과의 실증 완료가 아닙니다.",
      "S00’s policy critique, not completed causal identification.",
    ),
    steps: [
      step(
        "목적과 법적 사건",
        "Aims and legal events",
        "타다·쿠팡·카카오를 같은 사건으로 묶지 않고 제도와 시점을 구분합니다.",
        "Distinguish institutions and timing instead of merging Tada, Coupang and Kakao into one event.",
        "S00",
      ),
      step(
        "기업의 판단",
        "Corporate decisions",
        "법적 조건과 기업의 별도 전략 판단을 나누어 연결합니다.",
        "Separate legal conditions from a firm’s own strategic decisions.",
        "S14",
      ),
      step(
        "분석된 결과",
        "Interpreted outcomes",
        "규제의 존재가 모든 시장 변화의 원인인 것은 아닙니다. 선은 저자가 제기한 질문을 보여줍니다.",
        "Regulation’s existence does not explain every market change. The line shows the author’s question.",
        "S00",
      ),
    ],
  },
  "korea-defense": {
    group: "korea",
    title: words(
      "생산·기술·수출을 전략으로 연결",
      "Connect production, technology and exports to strategy",
    ),
    note: words(
      "방산기업의 역할 비교 · 성과·예측치를 새로 추정하지 않습니다.",
      "Comparing firms’ roles, without newly estimated performance or forecasts.",
    ),
    steps: [
      step(
        "기업의 역량",
        "Corporate capability",
        "한화·LIG 등의 기술과 생산 기반에서 출발합니다.",
        "Start with technology and productive capacity, including Hanwha and LIG.",
        "S11",
      ),
      step(
        "사업과 수출",
        "Business and exports",
        "기업의 사업 구조와 수출 관계가 국가 목적과 어떻게 만나는지 묻습니다.",
        "Ask how business structure and export relationships meet national aims.",
        "S17",
      ),
      step(
        "지원과 요구",
        "Support and expectations",
        "기업에 무엇을 허용하고 무엇을 요구할지의 질문으로 이어집니다. 정책이 성과의 원인이라는 증명과 구분합니다.",
        "Move toward what firms should be allowed and expected to do, separately from proving policy caused performance.",
        "S00",
      ),
    ],
  },
  "spatial-method": {
    group: "method",
    title: words(
      "같은 자료, 달라지는 분석 단위",
      "Same material, different units of analysis",
    ),
    note: words(
      "방법 설명 · 제공되지 않은 시설 경계·항적·주성분 좌표는 생성하지 않습니다.",
      "Method schematic · no invented site boundaries, tracks or principal-component coordinates.",
    ),
    steps: [
      step(
        "개별 기록",
        "Individual records",
        "기업·시설·사건을 개별 기록으로 살펴봅니다.",
        "Begin with firms, facilities and events as individual records.",
        "S15",
      ),
      step(
        "시간과 공간",
        "Time and space",
        "시간·공간을 함께 놓으면 개별 사건 사이의 새로운 질문이 생깁니다.",
        "Aligning time and space raises new questions between individual events.",
        "S08",
      ),
      step(
        "보고와 해석",
        "Reporting and interpretation",
        "비교 슬라이더로 보고된 내용과 저자의 해석을 구분합니다. 자료가 추가되었다는 이유만으로 통제나 의도가 증명되지는 않습니다.",
        "Use the comparison slider to separate reported material from interpretation. More connections do not by themselves prove control or intent.",
        "S15",
      ),
      step(
        "여섯 지표, 두 분석 축",
        "Six indicators, two analytical axes",
        "S17의 PCA가 여러 지표를 압축하는 방법을 개념적으로 보여줍니다. 실제 로딩·좌표·순위를 표시하는 그래프가 아닙니다.",
        "A conceptual view of S17’s PCA compression, not a chart of estimated loadings, coordinates or rankings.",
        "S17",
      ),
    ],
  },
  synthesis: {
    group: "synthesis",
    title: words(
      "서로 다른 연구가 논증으로 모이다",
      "Distinct studies converge into an argument",
    ),
    note: words(
      "연구의 기여 관계 · 모든 사례의 인과가 입증됐다는 뜻은 아닙니다.",
      "Contributions to an argument, not proof of every causal claim.",
    ),
    steps: [
      step(
        "다른 역할",
        "Distinct roles",
        "각 연구는 출발 질문·안보·금융·공간·산업 정책에서 서로 다른 역할을 맡습니다.",
        "Each study contributes a different role: origins, security, finance, space or industrial policy.",
        "S06",
      ),
      step(
        "관점을 선택하기",
        "Choose a perspective",
        "기술·정체성·국가 전략을 선택하면 관련 연구와 연결 이유가 강조됩니다.",
        "Choose technology, identity or state strategy to highlight relevant studies and their contributions.",
        "S14",
      ),
      step(
        "S00으로 합류",
        "Converge on S00",
        "가지의 선이 S00으로 모이지만 연구 각각의 제목과 반론은 그대로 남습니다.",
        "Branches meet at S00, while the studies retain their identities and counterarguments.",
        "S00",
      ),
      step(
        "제안과 남은 질문",
        "Proposal and open questions",
        "국가–기업 관계에 대한 제안과 검증 과제를 함께 읽습니다. 원문에서 앞뒤 문맥까지 확인하세요.",
        "Read the proposed state–firm relationship alongside open questions, then follow the full source context.",
        "S00",
      ),
    ],
  },
};
export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  label: Copy;
  step: number;
};
export type DiagramEdge = {
  from: string;
  to: string;
  step: number;
  feedback?: boolean;
};
const n = (
  id: string,
  x: number,
  y: number,
  ko: string,
  en: string,
  step = 0,
): DiagramNode => ({ id, x, y, label: words(ko, en), step });
export function mechanismGraph(id: string): {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
} {
  let nodes: DiagramNode[], pairs: [string, string, number][];
  switch (id) {
    case "capability":
      nodes = [
        n("firm", 75, 250, "기업", "Firm"),
        n("tech", 235, 160, "기술", "Technology"),
        n("identity", 235, 360, "정체성", "Identity", 1),
        n("data", 440, 85, "데이터", "Data", 2),
        n("contract", 440, 250, "계약", "Contracts", 2),
        n("plant", 440, 425, "생산", "Production", 2),
        n("state", 640, 250, "국가 역량", "State capability", 3),
      ];
      pairs = [
        ["firm", "tech", 0],
        ["tech", "identity", 1],
        ["tech", "data", 2],
        ["tech", "contract", 2],
        ["tech", "plant", 2],
        ["data", "state", 3],
        ["contract", "state", 3],
        ["plant", "state", 3],
      ];
      break;
    case "us-dome":
      nodes = [
        n("satellite", 85, 105, "위성", "Satellite"),
        n("radar", 85, 395, "레이더", "Radar"),
        n("fusion", 300, 250, "데이터 통합", "Data integration", 1),
        n("decision", 500, 170, "판단", "Decision", 2),
        n("response", 640, 350, "대응", "Response", 2),
      ];
      pairs = [
        ["satellite", "fusion", 0],
        ["radar", "fusion", 0],
        ["fusion", "decision", 1],
        ["decision", "response", 2],
      ];
      break;
    case "us-finance":
      nodes = [
        n("holder", 85, 250, "보유자", "Holder"),
        n("issuer", 300, 250, "Tether", "Tether"),
        n("reserve", 555, 100, "준비자산", "Reserves", 1),
        n("token", 555, 395, "USDT", "USDT", 2),
      ];
      pairs = [
        ["holder", "issuer", 0],
        ["issuer", "reserve", 1],
        ["issuer", "token", 2],
        ["token", "holder", 2],
      ];
      break;
    case "us-ships":
      nodes = [
        n("law", 85, 115, "법령", "Law"),
        n("orders", 270, 250, "발주", "Orders", 1),
        n("yard", 460, 370, "조선소", "Shipyard", 1),
        n("capacity", 640, 180, "산업 기반", "Capacity", 2),
      ];
      pairs = [
        ["law", "orders", 0],
        ["orders", "yard", 1],
        ["yard", "capacity", 2],
      ];
      break;
    case "korea-chips":
      nodes = [
        n("us", 186, 166, "미국 · 제도", "U.S. · rules"),
        n("kr", 587, 170, "한국 · 기업", "Korea · firms", 1),
        n("cn", 543, 205, "중국 · 생산", "China · production", 2),
      ];
      pairs = [
        ["us", "kr", 0],
        ["kr", "cn", 1],
        ["us", "cn", 2],
      ];
      break;
    case "korea-platforms":
      nodes = [
        n("operation", 200, 110, "기술 · 운영", "Technology / operation"),
        n("equity", 360, 260, "지분 · 권한", "Equity / authority", 1),
        n("jurisdiction", 520, 410, "규제 관할", "Jurisdiction", 2),
      ];
      pairs = [
        ["operation", "equity", 1],
        ["equity", "jurisdiction", 2],
      ];
      break;
    case "korea-regulation":
      nodes = [
        n("aim", 90, 120, "정책 목적", "Policy aim"),
        n("legal", 350, 120, "법적 사건", "Legal event"),
        n("strategy", 350, 390, "기업 전략", "Firm strategy", 1),
        n("outcome", 630, 390, "해석된 결과", "Interpreted outcome", 2),
      ];
      pairs = [
        ["aim", "legal", 0],
        ["legal", "strategy", 1],
        ["strategy", "outcome", 2],
      ];
      break;
    case "korea-defense":
      nodes = [
        n("tech", 85, 85, "기술", "Technology"),
        n("plant", 85, 260, "생산", "Production"),
        n("export", 85, 435, "수출", "Exports", 1),
        n("firm", 360, 250, "한화 · LIG", "Hanwha / LIG", 1),
        n("state", 630, 250, "국가 목적", "National aims", 2),
      ];
      pairs = [
        ["tech", "firm", 0],
        ["plant", "firm", 0],
        ["export", "firm", 1],
        ["firm", "state", 2],
      ];
      break;
    case "spatial-method":
      nodes = [
        n("firm", 85, 90, "기업", "Firm"),
        n("facility", 85, 260, "시설", "Facility"),
        n("event", 85, 430, "사건", "Event"),
        n("time", 340, 140, "시간", "Time", 1),
        n("space", 340, 380, "공간", "Space", 1),
        n("interpretation", 630, 260, "해석", "Interpretation", 2),
      ];
      pairs = [
        ["firm", "time", 0],
        ["facility", "space", 0],
        ["event", "time", 1],
        ["time", "interpretation", 2],
        ["space", "interpretation", 2],
      ];
      break;
    case "synthesis": {
      const ids = [
        "S01",
        "S02",
        "S03",
        "S05",
        "S06",
        "S08",
        "S11",
        "S13",
        "S14",
        "S15",
        "S16",
        "S17",
      ];
      nodes = [
        n("S00", 360, 260, "S00", "S00"),
        ...ids.map((id, i) =>
          n(
            id,
            i < 6 ? 85 : 635,
            55 + (i % 6) * 80,
            id,
            id,
            i < 4 ? 0 : i < 8 ? 1 : 2,
          ),
        ),
      ];
      pairs = ids.map((id) => [id, "S00", 2]);
      break;
    }
    default:
      nodes = [
        n("request", 85, 250, "공적 요구", "Public demand"),
        n("palantir", 310, 105, "Palantir", "Palantir"),
        n("anduril", 310, 395, "Anduril", "Anduril"),
        n("product", 625, 250, "제품 · 경험", "Product / experience", 1),
      ];
      pairs = [
        ["request", "palantir", 0],
        ["request", "anduril", 0],
        ["palantir", "product", 1],
        ["anduril", "product", 1],
        ["product", "request", 2],
      ];
  }
  return {
    nodes,
    edges: pairs.map(([from, to, step]) => ({
      from,
      to,
      step,
      feedback: step === 2 && id === "us-mission",
    })),
  };
}
