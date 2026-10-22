"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePreferences } from "./preferences";
const nodes = [
  {
    label: "Technology",
    ko: "기술",
    slug: "technology-and-advantage",
    detail:
      "Distinctive capabilities may support market advantage and reinvestment. This pathway remains a hypothesis.",
    detailKo:
      "독자 기술이 시장 경쟁우위와 재투자를 뒷받침할 수 있다는 검증 대상 가설입니다.",
  },
  {
    label: "The firm",
    ko: "기업",
    slug: "corporate-resilience",
    detail:
      "Financial resilience is a proposed outcome. ROIC and cash flow are proxies, not a direct probability of survival.",
    detailKo:
      "재무적 복원력은 분석할 결과 변수입니다. ROIC와 현금흐름은 생존 확률 자체가 아닌 대리 지표입니다.",
  },
  {
    label: "Public capability",
    ko: "국가 역량",
    slug: "strategic-capability",
    detail:
      "Procurement, standards and partnerships are candidate mechanisms connecting firms and state capabilities.",
    detailKo:
      "조달, 표준, 협력은 기업과 국가 역량을 연결하는 메커니즘 후보입니다.",
  },
  {
    label: "Mission & accountability",
    ko: "사명과 책임",
    slug: "mission-and-responsibility",
    detail:
      "Law, human rights, competition and democratic oversight are proposed limits on public–private cooperation.",
    detailKo:
      "법, 인권, 경쟁, 민주적 감독은 민관 협력의 규범적 한계로 제안됩니다.",
  },
];
export function Framework() {
  const [flow, setFlow] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const active = preview ?? pinned ?? flow;
  useEffect(() => {
    const update = (event: Event) => {
      const step = (event as CustomEvent<number>).detail;
      if (Number.isInteger(step) && step >= 0 && step <= 3) setFlow(step);
    };
    window.addEventListener("iir:flow-step", update);
    return () => window.removeEventListener("iir:flow-step", update);
  }, []);
  const { lang } = usePreferences();
  const node = nodes[active];
  return (
    <div
      className="framework-panel dark-section"
      data-pointer-reactive
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setPinned(null);
          setPreview(null);
        }
      }}
    >
      <span className="eyebrow">
        {lang === "ko"
          ? "개념 모델 / 검증 대상 관계"
          : "CONCEPTUAL MODEL / PROPOSED RELATIONSHIPS"}
      </span>
      <div className="framework-canvas">
        <div className="framework-primary">
          {nodes.slice(0, 3).map((n, i) => (
            <div className="framework-step od-stack" key={n.slug}>
              <button
                className={`framework-node od-cell ${active === i ? "selected" : ""}`}
                onPointerEnter={() => setPreview(i)}
                onPointerLeave={() => setPreview(null)}
                onFocus={() => setPreview(i)}
                onBlur={() => setPreview(null)}
                onClick={() => {
                  setPinned(i);
                  setPreview(null);
                }}
                aria-pressed={pinned === i}
              >
                <span className="node-index mono">0{i + 1}</span>
                <span>{lang === "ko" ? n.ko : n.label}</span>
              </button>
              {i < 2 && (
                <span className="hypothesis-link mono">
                  {lang === "ko" ? "가설 ···→" : "HYPOTHESIS ···→"}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="framework-boundary mono">
          {lang === "ko"
            ? "규범적 경계 조건 · 법 / 인권 / 경쟁 / 감독"
            : "BOUNDARY CONDITIONS · LAW / RIGHTS / COMPETITION / OVERSIGHT"}
        </div>
        <button
          className={`framework-node boundary-node od-cell ${active === 3 ? "selected" : ""}`}
          onPointerEnter={() => setPreview(3)}
          onPointerLeave={() => setPreview(null)}
          onFocus={() => setPreview(3)}
          onBlur={() => setPreview(null)}
          onClick={() => {
            setPinned(3);
            setPreview(null);
          }}
          aria-pressed={pinned === 3}
        >
          <span className="node-index mono">04</span>
          <span>{lang === "ko" ? nodes[3].ko : nodes[3].label}</span>
        </button>
      </div>
      <div className="framework-follow">
        <span className="mono">
          {pinned === null
            ? lang === "ko"
              ? "스크롤에 따라 읽기"
              : "FOLLOWING THE INQUIRY"
            : lang === "ko"
              ? "선택한 관점 유지"
              : "YOUR SELECTION IS PINNED"}
        </span>
        {pinned !== null && (
          <button
            className="text-button"
            onClick={() => {
              setPinned(null);
              setPreview(null);
            }}
          >
            {lang === "ko" ? "읽기 흐름 따라가기" : "Follow the reading flow"} ↗
          </button>
        )}
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
