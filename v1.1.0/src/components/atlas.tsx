"use client";
import { useState } from "react";
import Link from "next/link";
import map from "@/content/map.json";
import { usePreferences } from "./preferences";
import { Arrow } from "./icons";
const regions = [
  {
    id: "us",
    geo: "840",
    name: "United States",
    ko: "미국",
    label: "01 / PROCUREMENT & MISSION",
    labelKo: "01 / 조달과 사명",
    text: "Government procurement, industrial incentives and corporate mission are proposed axes of comparison.",
    textKo: "정부조달, 산업 인센티브, 기업의 사명을 비교 축으로 제안합니다.",
  },
  {
    id: "cn",
    geo: "156",
    name: "China",
    ko: "중국",
    label: "02 / OWNERSHIP & INFLUENCE",
    labelKo: "02 / 지분과 영향력",
    text: "Examine ownership, infrastructure and supply chains. Investment is not automatically evidence of state control.",
    textKo:
      "지분, 인프라, 공급망을 검토합니다. 투자가 곧 국가의 통제를 입증하는 것은 아닙니다.",
  },
  {
    id: "kr",
    geo: "410",
    name: "South Korea",
    ko: "한국",
    label: "03 / THE POLICY QUESTION",
    labelKo: "03 / 정책적 질문",
    text: "Consider conditional public support, technological contribution and safeguards as a policy proposal.",
    textKo:
      "조건부 공적 지원, 기술적 기여, 보호 장치를 정책 제안으로 검토합니다.",
  },
];
export function Atlas() {
  const [active, setActive] = useState("us");
  const { lang } = usePreferences();
  const region = regions.find((r) => r.id === active)!;
  return (
    <div className="atlas">
      <div className="atlas-map">
        <svg
          viewBox="0 0 960 490"
          role="img"
          aria-labelledby="atlas-title atlas-desc"
        >
          <title id="atlas-title">
            {lang === "ko" ? "연구 비교 범위" : "Research comparison scope"}
          </title>
          <desc id="atlas-desc">
            {lang === "ko"
              ? "미국, 중국, 한국을 표시한 개략 세계지도. 거래·동맹·인과 관계를 표시하지 않습니다."
              : "Simplified world map highlighting the United States, China and South Korea. Markers identify scope, not verified events or relationships."}
          </desc>
          <path d={map.graticule} className="map-grid" />
          <path d={map.land} className="map-land" />
          <path d={map.borders} className="map-borders" />
          {map.countries.map((c) => (
            <path
              key={c.id}
              d={c.path}
              className={`map-country ${c.id === region.geo ? "selected" : ""}`}
            />
          ))}
          {map.pins.map((pin) => (
            <g
              key={pin.id}
              className={active === pin.id ? "pin selected" : "pin"}
              transform={`translate(${pin.point[0]} ${pin.point[1]})`}
            >
              <circle r="12" />
              <circle r="3" />
              <path d="M-20 0h8M12 0h8M0-20v8M0 12v8" />
              <text
                x={pin.id === "kr" ? 18 : -18}
                y={pin.id === "kr" ? -16 : 32}
                textAnchor={pin.id === "kr" ? "start" : "middle"}
              >
                {pin.id.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
        <span className="map-coordinate mono">
          SCHEMATIC SCOPE · NATURAL EARTH
        </span>
      </div>
      <div className="atlas-controls">
        <div
          className="region-tabs"
          role="group"
          aria-label={lang === "ko" ? "국가 선택" : "Choose a country"}
        >
          {regions.map((r, i) => (
            <button
              key={r.id}
              aria-pressed={active === r.id}
              onClick={() => setActive(r.id)}
            >
              <span className="mono">0{i + 1}</span>
              {lang === "ko" ? r.ko : r.name}
              <span className="region-dot" />
            </button>
          ))}
        </div>
        <div className="region-detail" aria-live="polite">
          <span className="eyebrow">
            {lang === "ko" ? region.labelKo : region.label}
          </span>
          <p>{lang === "ko" ? region.textKo : region.text}</p>
          <Link href="/research/state-firm-models#P-005">
            {lang === "ko"
              ? "비교 계획 읽기"
              : "Read the comparative framework"}
            <Arrow diagonal />
          </Link>
        </div>
      </div>
    </div>
  );
}
