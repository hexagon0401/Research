import { words, type Copy } from "./motion-stories";
export type MechanismStep = {
  title: Copy;
  lead: Copy;
  facts: Copy[];
  connection: Copy;
  detail?: Copy;
  source: string;
};
export type Mechanism = {
  group: "origin" | "america" | "korea" | "method" | "synthesis";
  title: Copy;
  note: Copy;
  steps: MechanismStep[];
};
export const mechanisms: Record<string, Mechanism> = {
  capability: {
    group: "origin",
    title: {
      ko: "기업의 역량을 잇는 네 고리",
      en: "Four connections from firm to state",
    },
    note: {
      ko: "미국과 중국은 기업의 역량을 국가 전략에 연결하는 서로 다른 방식을 보여준다.",
      en: "The United States and China connect corporate capability to national strategy in different ways.",
    },
    steps: [
      {
        title: {
          ko: "기술은 기업의 생존 조건이 된다",
          en: "Technology can sustain a firm",
        },
        lead: {
          ko: "기술적 우위는 기업이 경쟁력을 지키고 재투자할 수 있는 기반이다. S06의 기업 생존 연구는 이 조건을 사회적 책임과 함께 묻는다.",
          en: "Technological advantage can support competitiveness and reinvestment. S06 examines that condition alongside the firm’s social responsibilities.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S06",
      },
      {
        title: {
          ko: "목적이 기술의 방향을 바꾼다",
          en: "Purpose gives technology direction",
        },
        lead: {
          ko: "기업이 무엇을 추구하는지에 따라 같은 기술의 쓰임도 달라진다. S14의 정체성 문제는 기업의 선택을 판단할 기준으로 이어진다.",
          en: "The ends a firm pursues shape how its technology is used. S14’s inquiry into identity develops criteria for judging those choices.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S14",
      },
      {
        title: {
          ko: "데이터·계약·생산이 기업 밖을 잇는다",
          en: "Data, contracts and production connect the firm",
        },
        lead: {
          ko: "데이터는 판단에, 계약은 공적 수요에, 생산 기반은 지속적인 공급에 연결된다. 서로 다른 세 경로가 기업의 역량을 더 넓은 체계에 참여시킨다.",
          en: "Data supports decisions, contracts connect public demand, and production enables continuing supply. These three routes connect corporate capabilities to larger systems.",
        },
        facts: [
          {
            ko: "생산 · 전략을 지속시키는 산업 기반",
            en: "Production · the industrial capacity that sustains strategy",
          },
          {
            ko: "데이터 · 정보를 수집하고 판단에 연결하는 능력",
            en: "Data · collecting information and putting it to use",
          },
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S01",
      },
      {
        title: {
          ko: "연결된 역량이 국가의 선택지가 된다",
          en: "Connected capabilities become national options",
        },
        lead: {
          ko: "기업이 가진 기술과 생산 능력은 국가가 전략을 실행하는 데 필요한 기반이 된다. 내가 묻는 것은 이 결속을 가능하게 하는 제도와 그에 따르는 책임이다.",
          en: "Corporate technology and production can form a foundation for national strategy. I ask which institutions make that connection possible and what responsibilities follow.",
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
        ],
        connection: {
          ko: "미국과 중국은 기업의 역량을 국가 전략에 연결하는 서로 다른 방식을 보여준다.",
          en: "The United States and China connect corporate capability to national strategy in different ways.",
        },
        source: "S02",
      },
    ],
  },
  "us-mission": {
    group: "america",
    title: {
      ko: "수요에서 개발로, 사용에서 개선으로",
      en: "Demand, development and feedback",
    },
    note: {
      ko: "개별 기업의 기술을 하나의 체계로 묶으면 국가 프로젝트의 문제가 된다.",
      en: "Connecting separate firms’ technologies brings us to the scale of a national system.",
    },
    steps: [
      {
        title: {
          ko: "정부의 수요가 기술과 만난다",
          en: "Public demand meets technology",
        },
        lead: {
          ko: "Palantir의 데이터 분석과 Anduril의 국방 기술은 정부의 안보 수요와 연결된다. S00은 기업이 내세우는 사명과 실제 조달 관계를 함께 읽는다.",
          en: "Palantir’s data analysis and Anduril’s defense technology meet public security needs. S00 reads their stated missions alongside procurement relationships.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "계약이 제품 개발의 조건이 된다",
          en: "Contracts shape product development",
        },
        lead: {
          ko: "공적 수요와 계약은 기업이 기술을 개발하고 제품을 개선할 수 있는 사업 조건을 만든다. 이 관계에서는 수요의 지속성과 기업의 개발 능력이 함께 중요하다.",
          en: "Public demand and contracts help shape the conditions for development and improvement. Both continuing demand and a firm’s ability to develop products matter.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S02",
      },
      {
        title: {
          ko: "사용 경험이 다음 개발로 돌아온다",
          en: "Operational experience informs development",
        },
        lead: {
          ko: "제품의 사용 경험은 새로운 요구와 개선 과제로 이어진다. 정부와 기업의 관계는 발주와 납품을 넘어 반복적인 개발 과정으로 확장된다.",
          en: "Experience with a product creates new requirements and improvements. The government–firm relationship extends beyond an order and delivery into an ongoing development process.",
        },
        facts: [
          {
            ko: "정부 조달 · 수요, 계약, 사용 경험의 연결",
            en: "Procurement · demand, contracts and operational feedback",
          },
          {
            ko: "Palantir · 데이터 분석과 의사결정",
            en: "Palantir · data analysis and decision-making",
          },
        ],
        connection: {
          ko: "개별 기업의 기술을 하나의 체계로 묶으면 국가 프로젝트의 문제가 된다.",
          en: "Connecting separate firms’ technologies brings us to the scale of a national system.",
        },
        source: "S01",
      },
    ],
  },
  "us-dome": {
    group: "america",
    title: {
      ko: "감지·통합·판단·대응",
      en: "Sense, integrate, decide, respond",
    },
    note: {
      ko: "기업과 국가의 연결은 방어 체계뿐 아니라 금융에서도 나타난다.",
      en: "The state–firm relationship also operates through finance.",
    },
    steps: [
      {
        title: {
          ko: "서로 다른 센서가 정보를 모은다",
          en: "Different sensors collect information",
        },
        lead: {
          ko: "위성과 레이더는 서로 다른 위치와 방식으로 정보를 수집한다. Golden Dome 구상의 출발점은 이 감지 역량을 하나의 방어 목표 아래 연결하는 일이다.",
          en: "Satellites and radar collect information from different locations and through different methods. The Golden Dome concept begins by connecting these capabilities to a shared defense objective.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S13",
      },
      {
        title: {
          ko: "데이터 통합이 공동 판단을 돕는다",
          en: "Data integration supports a shared assessment",
        },
        lead: {
          ko: "감지된 정보가 같은 체계에서 활용되어야 판단에 쓰일 수 있다. S03과 S13은 서로 다른 기술을 묶는 통합의 역할에 주목한다.",
          en: "Collected information needs to be usable within a shared system. S03 and S13 emphasize the role of integration in bringing distinct technologies together.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S03",
      },
      {
        title: {
          ko: "판단과 대응이 체계로 이어진다",
          en: "Decisions connect to responses",
        },
        lead: {
          ko: "통합된 정보는 지휘와 판단, 대응 수단의 연결로 이어진다. 이 구상에서 중요한 것은 개별 기술의 성능과 기술 사이의 연결을 함께 설계하는 일이다.",
          en: "Integrated information connects command, decisions and response capabilities. The system concept concerns both individual technologies and the relationships between them.",
        },
        facts: [
          {
            ko: "판단과 대응 · 체계 구상 속 역할의 연결",
            en: "Decision and response · roles within a proposed system",
          },
          {
            ko: "감지 · 위성과 레이더",
            en: "Sensing · satellites and radar",
          },
        ],
        connection: {
          ko: "기업과 국가의 연결은 방어 체계뿐 아니라 금융에서도 나타난다.",
          en: "The state–firm relationship also operates through finance.",
        },
        source: "S13",
      },
    ],
  },
  "us-finance": {
    group: "america",
    title: {
      ko: "달러·준비자산·토큰의 순환",
      en: "Dollars, reserves and tokens",
    },
    note: {
      ko: "금융망이 자본의 흐름을 지탱한다면, 조선업은 전략을 실행할 물리적 기반을 묻는다.",
      en: "Where finance supports capital flows, shipbuilding raises the question of physical capacity.",
    },
    steps: [
      {
        title: {
          ko: "이용자와 발행자를 잇는 달러",
          en: "Dollars connect holders and the issuer",
        },
        lead: {
          ko: "USDT의 구조는 이용자의 달러와 발행자의 토큰을 연결한다. 토큰에 대한 신뢰는 발행 이후의 상환 능력과 함께 형성된다.",
          en: "USDT connects holders’ dollars with tokens issued by Tether. Confidence in the token depends in part on the ability to redeem it.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S05",
      },
      {
        title: {
          ko: "준비자산이 기업과 국가 금융을 잇는다",
          en: "Reserves connect corporate and public finance",
        },
        lead: {
          ko: "S00은 Tether의 준비자산 중 미국 국채가 차지하는 역할에 주목한다. 기업의 자산 운용이 국채 수요와 달러 금융망의 문제로 확장되는 지점이다.",
          en: "S00 focuses on the role of U.S. Treasuries in Tether’s reserves. Corporate asset management becomes connected with demand for public debt and dollar-based finance.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "상환 가능성이 금융 신뢰를 지탱한다",
          en: "Redemption supports financial trust",
        },
        lead: {
          ko: "이용자의 토큰과 발행자의 준비자산은 상환 관계로 다시 만난다. S05의 신뢰 문제는 S00에서 달러의 국제적 통용이라는 질문으로 이어진다.",
          en: "Tokens and reserve assets meet again through redemption. S05’s question of trust develops into S00’s inquiry into the international use of the dollar.",
        },
        facts: [
          {
            ko: "미국 국채 · 기업의 자산 운용과 국가 금융의 접점",
            en: "U.S. Treasuries · a meeting point of corporate assets and public finance",
          },
          {
            ko: "발행·상환 · 이용자와 발행자의 거래",
            en: "Issuance and redemption · the holder–issuer relationship",
          },
        ],
        connection: {
          ko: "금융망이 자본의 흐름을 지탱한다면, 조선업은 전략을 실행할 물리적 기반을 묻는다.",
          en: "Where finance supports capital flows, shipbuilding raises the question of physical capacity.",
        },
        source: "S05",
      },
    ],
  },
  "us-ships": {
    group: "america",
    title: {
      ko: "제도·발주·생산의 연결",
      en: "Rules, orders and production",
    },
    note: {
      ko: "중국 사례에서는 기업의 소유 관계와 해외 사업을 통해 또 다른 결속 방식을 살핀다.",
      en: "The Chinese cases reveal another form of coordination through ownership and overseas projects.",
    },
    steps: [
      {
        title: {
          ko: "법이 시장의 조건을 정한다",
          en: "Law shapes market conditions",
        },
        lead: {
          ko: "존스법은 미국 연안 운송이 이루어지는 제도적 조건을 규정한다. S00은 이러한 조건을 조선업의 유지와 국가 전략의 관점에서 살핀다.",
          en: "The Jones Act sets conditions for U.S. coastwise trade. S00 examines those conditions in relation to shipbuilding and national strategy.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "발주가 생산 기반과 만난다",
          en: "Orders meet industrial capacity",
        },
        lead: {
          ko: "공공 발주와 투자는 조선소의 설비, 인력, 생산 계획과 연결된다. 산업 역량은 지속적인 수요와 실제 생산 기반이 만나는 곳에서 유지된다.",
          en: "Public orders and investment connect with shipyard facilities, labor and production planning. Industrial capability depends on the relationship between sustained demand and productive capacity.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "생산 능력이 전략의 지속성을 뒷받침한다",
          en: "Production supports strategic continuity",
        },
        lead: {
          ko: "선박을 지속적으로 만들고 유지할 수 있는 능력은 국가의 장기적인 선택지와 연결된다. 조선업은 기업 지원을 산업 기반의 문제로 읽게 하는 사례다.",
          en: "The ability to build and maintain ships supports long-term national options. Shipbuilding brings the discussion of corporate support into the question of industrial capacity.",
        },
        facts: [
          {
            ko: "산업 기반 · 장기적인 전략 수행 능력",
            en: "Industrial capacity · the ability to sustain strategy",
          },
          {
            ko: "존스법 · 미국 연안 운송의 제도적 조건",
            en: "Jones Act · conditions governing U.S. coastwise trade",
          },
        ],
        connection: {
          ko: "중국 사례에서는 기업의 소유 관계와 해외 사업을 통해 또 다른 결속 방식을 살핀다.",
          en: "The Chinese cases reveal another form of coordination through ownership and overseas projects.",
        },
        source: "S02",
      },
    ],
  },
  "korea-chips": {
    group: "korea",
    title: {
      ko: "기술과 생산을 둘러싼 세 국가",
      en: "Three jurisdictions around technology and production",
    },
    note: {
      ko: "플랫폼에서도 기술의 출처, 기업의 소유, 실제 운영 권한을 함께 살펴야 한다.",
      en: "Platforms also require us to consider the origins of technology alongside ownership and operational authority.",
    },
    steps: [
      {
        title: {
          ko: "기술과 장비에는 제도적 조건이 따른다",
          en: "Technology and equipment operate under rules",
        },
        lead: {
          ko: "반도체 생산에는 기술과 장비의 이용 조건이 함께 작용한다. 미국의 수출통제는 한국 기업이 생산과 투자를 결정하는 환경의 일부다.",
          en: "Semiconductor production depends on access to technology and equipment. U.S. export controls form part of the environment in which Korean firms make production and investment decisions.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S16",
      },
      {
        title: {
          ko: "한국 기업은 여러 관할에서 선택한다",
          en: "Korean firms make choices across jurisdictions",
        },
        lead: {
          ko: "삼성전자와 SK하이닉스는 기술 경쟁력과 해외 생산 기반을 함께 관리한다. 기업의 선택은 한국의 산업 정책과 다른 국가의 제도 사이에 놓인다.",
          en: "Samsung Electronics and SK hynix manage technological competition alongside overseas production. Their choices sit between Korean industrial policy and the rules of other jurisdictions.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S16",
      },
      {
        title: {
          ko: "공급망이 기업과 국가의 문제를 묶는다",
          en: "Supply chains connect corporate and national choices",
        },
        lead: {
          ko: "생산시설과 기술의 관계를 함께 보면 기업의 경쟁력과 국가의 협상 조건이 연결된다. S16의 반도체 분석은 S00의 제도 설계 문제로 이어진다.",
          en: "Reading production facilities together with technology connects firm competitiveness with national bargaining conditions. S16’s semiconductor inquiry feeds into S00’s question of institutional design.",
        },
        facts: [
          {
            ko: "생산 · 여러 국가에 걸친 공급망",
            en: "Production · supply chains spanning several jurisdictions",
          },
          {
            ko: "기업 · 삼성전자·SK하이닉스",
            en: "Companies · Samsung Electronics and SK hynix",
          },
        ],
        connection: {
          ko: "플랫폼에서도 기술의 출처, 기업의 소유, 실제 운영 권한을 함께 살펴야 한다.",
          en: "Platforms also require us to consider the origins of technology alongside ownership and operational authority.",
        },
        source: "S16",
      },
    ],
  },
  "korea-platforms": {
    group: "korea",
    title: {
      ko: "기술·소유·관할의 세 층위",
      en: "Technology, ownership and jurisdiction",
    },
    note: {
      ko: "국내 규제를 살필 때도 정책의 목적과 기업이 대응하는 방식을 함께 읽어야 한다.",
      en: "Domestic regulation likewise needs to be read together with the ways firms respond.",
    },
    steps: [
      {
        title: {
          ko: "기술과 운영의 주체를 살핀다",
          en: "Identify technology and operational roles",
        },
        lead: {
          ko: "서비스를 만드는 기술과 실제 운영 능력은 플랫폼의 기반이다. LINE 사례는 이 기반을 기업의 이름이나 국적보다 구체적인 역할로 나누어 살펴보게 한다.",
          en: "Technology and operational capability form the basis of a platform. LINE invites an examination of those roles beyond the company’s name or nationality.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "지분과 의사결정의 구조를 읽는다",
          en: "Read ownership and decision-making together",
        },
        lead: {
          ko: "투자자의 지분과 기업의 실제 의사결정 권한은 함께 살펴야 할 항목이다. 누가 기술을 제공하고 누가 사업 방향을 정하는지를 나누면 관계가 더 선명해진다.",
          en: "Equity and actual decision-making authority need to be examined together. Distinguishing who supplies technology from who sets business direction makes the relationship clearer.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "감독과 책임이 관할의 문제로 이어진다",
          en: "Jurisdiction brings supervision and accountability",
        },
        lead: {
          ko: "플랫폼의 운영과 데이터는 규제 관할의 문제로 이어진다. 이 세 층위를 함께 읽으면 기업과 국가의 관계를 기술·소유·책임의 결합으로 볼 수 있다.",
          en: "Operations and data lead to questions of regulatory jurisdiction. Together, these layers reveal the relationship between technology, ownership and accountability.",
        },
        facts: [
          {
            ko: "규제 관할 · 감독과 책임을 묻는 주체",
            en: "Jurisdiction · supervision and accountability",
          },
          {
            ko: "기술·운영 · 서비스를 실제로 유지하는 역량",
            en: "Technology and operations · keeping a service running",
          },
        ],
        connection: {
          ko: "국내 규제를 살필 때도 정책의 목적과 기업이 대응하는 방식을 함께 읽어야 한다.",
          en: "Domestic regulation likewise needs to be read together with the ways firms respond.",
        },
        source: "S05",
      },
    ],
  },
  "korea-regulation": {
    group: "korea",
    title: {
      ko: "정책의 목적과 기업의 대응",
      en: "Public objectives and corporate responses",
    },
    note: {
      ko: "방산에서는 국가의 목표와 기업의 기술·생산 역량이 더욱 직접적으로 만난다.",
      en: "Defense brings national objectives into a more direct relationship with corporate technology and production.",
    },
    steps: [
      {
        title: {
          ko: "정책이 해결하려는 문제에서 출발한다",
          en: "Begin with the public objective",
        },
        lead: {
          ko: "규제는 공적 문제에 대한 대응으로 등장한다. 타다·쿠팡·카카오 사례에서는 정책의 목적과 제도 변화의 맥락을 먼저 살핀다.",
          en: "Regulation emerges in response to public problems. The cases of Tada, Coupang and Kakao begin with policy objectives and the context of institutional change.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "기업은 사업모델로 대응한다",
          en: "Firms respond through their business models",
        },
        lead: {
          ko: "기업은 규제 환경 안에서 서비스와 투자, 조직의 방향을 조정한다. 정책과 기업 전략을 함께 읽으면 같은 제도에 대한 서로 다른 대응이 드러난다.",
          en: "Firms adjust services, investment and organization within a regulatory environment. Reading policy alongside strategy reveals different responses to the same institutional conditions.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S14",
      },
      {
        title: {
          ko: "제도와 경쟁력의 관계를 다시 묻는다",
          en: "Reconsider institutions and competitiveness",
        },
        lead: {
          ko: "S00은 한국의 규제 환경을 기업의 역량과 국가 전략이라는 관점에서 비판적으로 검토한다. 이 비교는 어떤 지원과 책임을 함께 설계할지의 질문으로 이어진다.",
          en: "S00 critically examines Korea’s regulatory environment through corporate capability and national strategy. The comparison leads to the design of support and responsibility.",
        },
        facts: [
          {
            ko: "기업 · 사업모델과 대응 전략",
            en: "Firms · business models and strategic responses",
          },
          {
            ko: "사례 · 타다·쿠팡·카카오",
            en: "Cases · Tada, Coupang and Kakao",
          },
        ],
        connection: {
          ko: "방산에서는 국가의 목표와 기업의 기술·생산 역량이 더욱 직접적으로 만난다.",
          en: "Defense brings national objectives into a more direct relationship with corporate technology and production.",
        },
        source: "S00",
      },
    ],
  },
  "korea-defense": {
    group: "korea",
    title: {
      ko: "기업 역량에서 공적 기여로",
      en: "From corporate capability to public contribution",
    },
    note: {
      ko: "사례를 연결한 다음에는 그 연결을 어떤 자료와 방법으로 읽었는지 살펴볼 차례다.",
      en: "Having connected the cases, I turn to the evidence and methods used to read them.",
    },
    steps: [
      {
        title: {
          ko: "기술과 생산이 방산의 기반을 이룬다",
          en: "Technology and production underpin defense capability",
        },
        lead: {
          ko: "방산기업의 역량은 연구개발과 생산 기반이 함께 만들고 유지한다. 한화·LIG 등의 사례는 기술과 산업 능력을 연결해 읽는 출발점이다.",
          en: "Defense capability is built through development and production together. Hanwha and LIG provide cases for examining the relationship between technological and industrial capacity.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S11",
      },
      {
        title: {
          ko: "수출이 기업과 국가의 관계를 넓힌다",
          en: "Exports widen the state–firm relationship",
        },
        lead: {
          ko: "방산 수출은 기업의 시장 확대와 국가 간 관계가 만나는 분야다. S17의 기업 지표 분석은 이 관계를 기업의 경영 조건에서 살펴보는 방법을 제공한다.",
          en: "Defense exports connect market expansion with international relationships. S17’s financial indicators offer a way to examine the firms’ operating conditions within that relationship.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S17",
      },
      {
        title: {
          ko: "지원과 기여를 함께 설계한다",
          en: "Design support and contribution together",
        },
        lead: {
          ko: "국가가 기업의 기술과 생산을 지원한다면, 그 역량이 어떤 공적 기여로 이어질지도 물어야 한다. 방산 사례는 S00의 정책 제안을 구체적인 기업 역량과 연결한다.",
          en: "Support for corporate technology and production raises the question of public contribution. Defense connects S00’s policy proposal with concrete corporate capabilities.",
        },
        facts: [
          {
            ko: "정책 질문 · 지원의 조건과 공적 기여",
            en: "Policy question · conditions for support and public contribution",
          },
          {
            ko: "역량 · 기술 개발·생산·수출",
            en: "Capabilities · development, production and exports",
          },
        ],
        connection: {
          ko: "사례를 연결한 다음에는 그 연결을 어떤 자료와 방법으로 읽었는지 살펴볼 차례다.",
          en: "Having connected the cases, I turn to the evidence and methods used to read them.",
        },
        source: "S00",
      },
    ],
  },
  "spatial-method": {
    group: "method",
    title: {
      ko: "기록에서 비교와 해석으로",
      en: "From records to comparison and interpretation",
    },
    note: {
      ko: "방법이 다른 연구들을 다시 모으면, 국가와 기업의 관계를 묻는 하나의 논증이 된다.",
      en: "Bringing these different methods together develops a shared argument about the state and the firm.",
    },
    steps: [
      {
        title: {
          ko: "기록 하나에서 질문을 시작한다",
          en: "Start with an individual record",
        },
        lead: {
          ko: "기업, 시설, 사건은 각각 연구의 출발점이 된다. 기록의 주체와 장소, 시점을 정리하면 비교할 항목이 생긴다.",
          en: "A firm, facility or event can become a starting point for inquiry. Identifying actors, places and dates creates the basis for comparison.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S15",
      },
      {
        title: {
          ko: "시간과 공간을 같은 기준에 놓는다",
          en: "Align records in time and space",
        },
        lead: {
          ko: "서로 다른 기록을 같은 시간과 공간에 놓으면 별개로 보이던 활동 사이의 관계를 살필 수 있다. S08과 S15는 이러한 비교가 만들어 내는 질문을 다룬다.",
          en: "Aligning records in time and space allows relationships between apparently separate activities to be examined. S08 and S15 explore the questions that emerge from that comparison.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S08",
      },
      {
        title: {
          ko: "기록을 해석으로 연결한다",
          en: "Develop an interpretation from records",
        },
        lead: {
          ko: "자료는 어떤 사건이 기록되어 있는지를 보여주고, 해석은 그 관계가 왜 중요한지를 묻는다. 연구의 논증은 이 둘을 연결하면서 발전한다.",
          en: "Evidence describes what has been recorded; interpretation asks why a relationship matters. An argument develops by bringing the two into conversation.",
        },
        facts: [
          {
            ko: "PCA · 여섯 지표의 정보를 적은 수의 축으로 압축",
            en: "PCA · reducing several indicators to fewer analytical axes",
          },
          {
            ko: "공간 분석 · 행위자·장소·시간을 함께 비교",
            en: "Spatial analysis · comparing actors, places and times",
          },
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S15",
      },
      {
        title: {
          ko: "여섯 지표에서 비교의 축을 찾는다",
          en: "Find comparative axes across six indicators",
        },
        lead: {
          ko: "S17은 성장률, 수익성, 연구개발 등 여러 기업 지표를 함께 분석한다. PCA는 서로 연관된 지표의 정보를 적은 수의 축으로 묶어 비교를 돕는 방법이다.",
          en: "S17 examines indicators including growth, profitability and research spending. PCA summarizes information across related variables into fewer axes to support comparison.",
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
        ],
        connection: {
          ko: "방법이 다른 연구들을 다시 모으면, 국가와 기업의 관계를 묻는 하나의 논증이 된다.",
          en: "Bringing these different methods together develops a shared argument about the state and the firm.",
        },
        source: "S17",
      },
    ],
  },
  synthesis: {
    group: "synthesis",
    title: {
      ko: "서로 다른 연구가 하나의 질문으로",
      en: "Different studies, one shared question",
    },
    note: {
      ko: "내가 남기는 질문은 지원의 크기보다 그 조건이다. 기업의 역량이 공적 기여로 이어지도록 어떤 책임과 견제 장치를 설계할 것인가.",
      en: "My remaining question concerns the conditions of support more than its scale. What responsibilities and checks can connect corporate capability with public contribution?",
    },
    steps: [
      {
        title: {
          ko: "각 연구가 다른 질문을 맡는다",
          en: "Each study contributes a different question",
        },
        lead: {
          ko: "기업의 존속, 정체성, 현대전, 금융, 공간과 산업 정책은 서로 다른 자료와 방법에서 출발한다. 각 연구의 역할을 따라가면 하나의 논증이 만들어지는 과정을 읽을 수 있다.",
          en: "Resilience, identity, warfare, finance, space and industrial policy begin with different materials and methods. Their contributions show how a shared argument takes shape.",
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
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S06",
      },
      {
        title: {
          ko: "기술·정체성·전략으로 다시 읽는다",
          en: "Read through technology, identity and strategy",
        },
        lead: {
          ko: "세 관점은 같은 연구를 서로 다르게 연결한다. 기술은 역량의 작동 방식을, 정체성은 목적을, 전략은 기업과 국가의 결속을 묻는다.",
          en: "The three perspectives connect the studies in different ways. Technology concerns how capability works, identity concerns purpose, and strategy concerns the relationship between firm and state.",
        },
        facts: [
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
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S14",
      },
      {
        title: {
          ko: "연구의 질문들이 S00으로 모인다",
          en: "The questions converge in S00",
        },
        lead: {
          ko: "S00은 앞선 연구에서 나온 질문을 국가와 기업의 관계라는 틀에 모은다. 내가 주목하는 것은 기업의 힘을 국가가 어떤 제도로 연결하고 어떤 책임을 요구할 것인가이다.",
          en: "S00 brings the earlier questions into a framework for state–firm relations. I focus on the institutions that connect corporate power with the state and the responsibilities that follow.",
        },
        facts: [
          {
            ko: "제안 · 지원, 기여, 책임을 함께 설계",
            en: "Proposal · designing support, contribution and accountability together",
          },
          {
            ko: "출발 질문 · 기업의 존속과 기술의 목적",
            en: "Starting questions · corporate resilience and technological purpose",
          },
        ],
        connection: {
          ko: "이 연결은 기업의 역량이 국가의 선택에 참여하는 조건을 묻는다.",
          en: "This connection asks how corporate capability participates in national choices.",
        },
        source: "S00",
      },
      {
        title: {
          ko: "공적 기여를 지원의 조건으로 묻는다",
          en: "Ask what public contribution support should require",
        },
        lead: {
          ko: "기업에 제공되는 지원과 기업이 감당할 책임은 함께 설계되어야 한다. 이 제안은 기술적 기여, 공정한 경쟁과 권리 보호를 같은 정책 질문으로 연결한다.",
          en: "Support and corporate responsibility should be designed together. The proposal connects technological contribution, fair competition and the protection of rights within one policy question.",
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
        ],
        connection: {
          ko: "내가 남기는 질문은 지원의 크기보다 그 조건이다. 기업의 역량이 공적 기여로 이어지도록 어떤 책임과 견제 장치를 설계할 것인가.",
          en: "My remaining question concerns the conditions of support more than its scale. What responsibilities and checks can connect corporate capability with public contribution?",
        },
        source: "S00",
      },
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
        n("cn", 543, 172.5, "중국 · 생산", "China · production", 2),
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
