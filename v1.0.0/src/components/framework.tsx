"use client";
import { useState } from "react";
import Link from "next/link";
import { usePreferences } from "./preferences";
const nodes = [
  {
    label: "Technology",
    ko: "기술",
    x: 150,
    y: 100,
    slug: "technology-and-advantage",
    detail:
      "Distinctive capabilities may support market advantage and reinvestment. This pathway remains a hypothesis.",
    detailKo:
      "독자 기술이 시장 경쟁우위와 재투자를 뒷받침할 수 있다는 검증 대상 가설입니다.",
  },
  {
    label: "The firm",
    ko: "기업",
    x: 450,
    y: 100,
    slug: "corporate-resilience",
    detail:
      "Financial resilience is a proposed outcome. ROIC and cash flow are proxies, not a direct probability of survival.",
    detailKo:
      "재무적 복원력은 분석할 결과 변수입니다. ROIC와 현금흐름은 생존 확률 자체가 아닌 대리 지표입니다.",
  },
  {
    label: "Public capability",
    ko: "국가 역량",
    x: 750,
    y: 100,
    slug: "strategic-capability",
    detail:
      "Procurement, standards and partnerships are candidate mechanisms connecting firms and state capabilities.",
    detailKo:
      "조달, 표준, 협력은 기업과 국가 역량을 연결하는 메커니즘 후보입니다.",
  },
  {
    label: "Mission & accountability",
    ko: "사명과 책임",
    x: 450,
    y: 300,
    slug: "mission-and-responsibility",
    detail:
      "Law, human rights, competition and democratic oversight are proposed limits on public–private cooperation.",
    detailKo:
      "법, 인권, 경쟁, 민주적 감독은 민관 협력의 규범적 한계로 제안됩니다.",
  },
];
export function Framework() {
  const [active, setActive] = useState(0);
  const { lang } = usePreferences();
  const node = nodes[active];
  return (
    <div className="framework-panel">
      <span className="eyebrow">
        {lang === "ko"
          ? "개념 모델 / 검증 대상 관계"
          : "CONCEPTUAL MODEL / PROPOSED RELATIONSHIPS"}
      </span>
      <div className="framework-canvas">
        <svg viewBox="0 0 900 390" aria-hidden="true">
          <path d="M240 100H360M540 100H660M450 270V135M375 280 190 135M525 280 710 135" />
          <path d="m350 95 10 5-10 5m300-10 10 5-10 5" />
          <text x="300" y="78">
            HYPOTHESIS
          </text>
          <text x="600" y="78">
            HYPOTHESIS
          </text>
          <text x="310" y="231" transform="rotate(37 310 231)">
            BOUNDARY CONDITIONS
          </text>
        </svg>
        {nodes.map((n, i) => (
          <button
            key={n.slug}
            className={`framework-node node-${i} ${active === i ? "selected" : ""}`}
            style={{ left: `${n.x / 9}%`, top: `${n.y / 3.9}%` }}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            <span className="node-index mono">0{i + 1}</span>
            {lang === "ko" ? n.ko : n.label}
          </button>
        ))}
      </div>
      <div className="framework-detail" aria-live="polite">
        <span className="mono">
          {lang === "ko"
            ? "검증 상태 · 가설 / 해석"
            : "EVIDENCE STATUS · HYPOTHESIS / INTERPRETATION"}
        </span>
        <p>{lang === "ko" ? node.detailKo : node.detail}</p>
        <Link href={`/research/${node.slug}`}>
          {lang === "ko" ? "원문 맥락 확인" : "Trace to the planning excerpt"} ↗
        </Link>
      </div>
    </div>
  );
}
