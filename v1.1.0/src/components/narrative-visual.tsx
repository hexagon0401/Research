"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePretext } from "./use-pretext";
import { usePreferences } from "./preferences";
import { SceneDiagram, GeographicLegend } from "./scene-diagram";
import type { SceneMeta } from "./essay-experience";
import {
  contributionLabels,
  editorialConnectors,
  emphasisScenes,
  storyVisuals,
  studySpines,
} from "@/visuals/story";
import { reports, reportTitlesEn } from "@/content/report-catalog";
import { researchConnections } from "@/content/research-connections";
const actors: Record<string, { ko: string; en: string }[]> = {
  "us-mission": [
    { ko: "Palantir · Anduril", en: "Palantir · Anduril" },
    { ko: "정부 · 조달 계약", en: "Government · contracts" },
    { ko: "개발 · 공적 목표", en: "Development · public aims" },
  ],
  "us-finance": [
    { ko: "Tether · USDT", en: "Tether · USDT" },
    { ko: "준비자산 · 국채", en: "Reserves · Treasuries" },
    { ko: "상환 · 통화 신뢰", en: "Redemption · trust" },
  ],
  "china-ownership": [
    { ko: "기업 · 투자 주체", en: "Firms · investors" },
    { ko: "지분 · 의결권", en: "Equity · voting rights" },
    { ko: "실제 결정권", en: "Actual authority" },
  ],
  "china-governance": [
    { ko: "국유 · 민간 소유", en: "State · private equity" },
    { ko: "조직 · 이사회", en: "Organizations · boards" },
    { ko: "개별 사업의 결정", en: "Project-level decisions" },
  ],
  capability: [
    { ko: "기업 · 기술 · 데이터", en: "Firms · technology · data" },
    { ko: "계약 · 산업 기반", en: "Contracts · industry" },
    { ko: "국가의 전략적 역량", en: "National capability" },
  ],
};
function RelationDiagram({
  scene,
  onSelect,
}: {
  scene: SceneMeta;
  onSelect: (id: string) => void;
}) {
  const { lang } = usePreferences();
  const v = storyVisuals[scene.id];
  const variant =
    scene.id === "us-finance"
      ? "reserves"
      : scene.id.includes("ownership") || scene.id.includes("governance")
        ? "ownership"
        : scene.id === "us-mission"
          ? "procurement"
          : "mechanism";
  return (
    <div
      className={`relation-diagram relation-${variant}`}
      data-diagram-kind={variant}
    >
      <span className="relation-kind mono">
        {lang === "ko"
          ? {
              reserves: "준비와 상환",
              ownership: "소유 ≠ 권한",
              procurement: "계약과 개발",
              mechanism: "분석의 연결",
            }[variant]
          : {
              reserves: "BACKING & REDEMPTION",
              ownership: "OWNERSHIP ≠ AUTHORITY",
              procurement: "CONTRACTS & DEVELOPMENT",
              mechanism: "ANALYTICAL CONNECTION",
            }[variant]}
      </span>
      <ol>
        {v.steps.map((step, i) => (
          <li key={i}>
            <button
              onClick={() => onSelect(`step-${i}`)}
              className="relation-node"
            >
              <span className="mono">0{i + 1}</span>
              <strong>{(actors[scene.id]?.[i] ?? step)[lang]}</strong>
              <span>{step[lang]}</span>
            </button>
            {i < 2 && (
              <button
                className="relation-edge"
                onClick={() => onSelect(`edge-${i}`)}
                aria-label={
                  lang === "ko"
                    ? `연결을 살피기 · ${step.ko}`
                    : `Examine connection · ${step.en}`
                }
              >
                <span aria-hidden="true">↓</span>
                <span>
                  {lang === "ko" ? "연결을 살피기" : "Examine connection"}
                </span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
function Connector({ scene }: { scene: SceneMeta }) {
  const { lang } = usePreferences();
  const root = useRef<HTMLDivElement>(null);
  const copy = editorialConnectors[scene.id];
  const engine = usePretext(root);
  useEffect(() => {
    const el = root.current;
    if (!el || !copy || !engine) return;
    const { prepare, layout } = engine;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const p = el.querySelector("p");
      if (!p) return;
      const s = getComputedStyle(p);
      const around = p.clientWidth - 168 >= 300;
      const available = Math.max(
        1,
        around ? p.clientWidth - 168 : p.clientWidth,
      );
      const prepared = prepare(
        copy[lang],
        `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`,
        { wordBreak: lang === "ko" ? "keep-all" : "normal" },
      );
      el.dataset.flow = around ? "around" : "stack";
      el.style.setProperty(
        "--connector-height",
        `${Math.ceil(layout(prepared, Math.max(300, available), parseFloat(s.lineHeight)).height)}px`,
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      alive = false;
      ro.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [copy, lang, engine]);
  if (!copy) return null;
  return (
    <div className="editorial-connector" ref={root}>
      <span className="connector-orbit" aria-hidden="true">
        <span>FIRM</span>
        <span>STATE</span>
      </span>
      <span className="eyebrow">
        {lang === "ko" ? "편집 연결문" : "EDITORIAL CONNECTION"}
      </span>
      <p>{copy[lang]}</p>
    </div>
  );
}
export function NarrativeVisual({ scene }: { scene: SceneMeta }) {
  const { lang } = usePreferences();
  const visual = storyVisuals[scene.id];
  const emphasis = emphasisScenes.has(scene.id);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState(true);
  const controls = useRef<HTMLDivElement>(null),
    panel = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement | null>(null);
  const select = (id: string) => {
    trigger.current =
      document.activeElement instanceof HTMLButtonElement
        ? document.activeElement
        : null;
    setSelected(id);
  };
  const close = () => {
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (selected) panel.current?.focus({ preventScroll: true });
  }, [selected]);
  const study = selected?.startsWith("S")
    ? reports.find((r) => r.id === selected)
    : undefined;
  const source =
    study?.id ?? (scene.id === "china-arctic" ? "S08" : scene.related[0]);
  const href = study
    ? `/reports/${study.id}?from=${scene.id}`
    : scene.id === "china-arctic"
      ? "/reports/S08?from=china-arctic#S08-R001-P010"
      : (scene.targets?.[source] ?? `/reports/${source}?from=${scene.id}`);
  const pointNames: Record<string, string> = {
    nuuk: lang === "ko" ? "누크" : "Nuuk",
    ilulissat: lang === "ko" ? "일루리사트" : "Ilulissat",
    qaqortoq: lang === "ko" ? "카코르톡" : "Qaqortoq",
    cn: lang === "ko" ? "중국" : "China",
    mm: lang === "ko" ? "미얀마" : "Myanmar",
    kh: lang === "ko" ? "캄보디아" : "Cambodia",
    kr: lang === "ko" ? "한국" : "Korea",
    us: lang === "ko" ? "미국" : "United States",
  };
  const selectedStep = selected?.match(/(?:step|edge)-(\d)/)?.[1];
  return (
    <figure
      id={`visual-${scene.id}`}
      tabIndex={-1}
      className={`case-visual ${emphasis ? "emphasis-visual" : ""}`}
      data-visual-for={scene.id}
      aria-label={visual.heading[lang]}
      onKeyDown={(e) => {
        if (e.key === "Escape" && selected) {
          e.preventDefault();
          close();
        }
      }}
    >
      <figcaption>
        <span className="eyebrow">
          {lang === "ko" ? "논지의 시각 설명" : "VISUAL READING"}
        </span>
        <h3>{visual.heading[lang]}</h3>
      </figcaption>
      {emphasis && <Connector scene={scene} />}
      <div ref={controls}>
        {scene.id === "synthesis" ? (
          <div className="study-convergence" data-diagram-kind="integration">
            <button className="convergence-root" onClick={() => select("S00")}>
              <span className="mono">S00</span>
              <strong>
                {lang === "ko"
                  ? "기업은 어떻게 국가의 힘이 되는가"
                  : "When does a firm become national power?"}
              </strong>
              <span>{contributionLabels.S00[lang]}</span>
            </button>
            <div className="convergence-branches">
              {reports
                .filter((r) => r.id !== "S00")
                .map((r) => (
                  <button
                    key={r.id}
                    data-study-node={r.id}
                    onClick={() => select(r.id)}
                  >
                    <span className="mono">{r.id}</span>
                    <strong>{studySpines[r.id][lang]}</strong>
                    <span>{contributionLabels[r.id][lang]}</span>
                  </button>
                ))}
            </div>
          </div>
        ) : scene.id === "capability" ? (
          <div className="capability-expansion">
            <SceneDiagram scene={scene} />
            <RelationDiagram scene={scene} onSelect={select} />
          </div>
        ) : visual.type === "arctic" ? (
          <>
            <div
              className="map-scale-controls"
              aria-label={lang === "ko" ? "지도 범위" : "Map extent"}
            >
              <button aria-pressed={!detail} onClick={() => setDetail(false)}>
                {lang === "ko" ? "북극권 전체" : "Arctic context"}
              </button>
              <button aria-pressed={detail} onClick={() => setDetail(true)}>
                {lang === "ko" ? "그린란드 세부" : "Greenland detail"}
              </button>
            </div>
            <div className="arctic-expansion">
              <div className="arctic-context">
                <SceneDiagram scene={scene} />
                <p>
                  {lang === "ko"
                    ? "북극권 · 공간적 배경"
                    : "Arctic · geographic context"}
                </p>
              </div>
              <SceneDiagram scene={scene} detail={detail} onSelect={select} />
            </div>
            <GeographicLegend scene={scene} />
          </>
        ) : visual.type === "world" ? (
          <>
            <SceneDiagram scene={scene} onSelect={select} />
            <GeographicLegend scene={scene} />
          </>
        ) : (
          <RelationDiagram scene={scene} onSelect={select} />
        )}
      </div>
      <div
        className="case-selection"
        role="region"
        ref={panel}
        tabIndex={-1}
        aria-label={
          lang === "ko" ? "선택 항목 설명" : "Selected element explanation"
        }
      >
        {selected ? (
          <>
            <div className="od-row">
              <strong className="od-fill">
                {study
                  ? lang === "ko"
                    ? study.title
                    : reportTitlesEn[study.id]
                  : selectedStep !== undefined
                    ? visual.steps[Number(selectedStep)][lang]
                    : (pointNames[selected] ?? selected)}
              </strong>
              <button className="selection-close" onClick={close}>
                {lang === "ko" ? "닫기" : "Close"} ×
              </button>
            </div>
            <p>
              {study
                ? researchConnections[study.id][lang]
                : scene.id === "china-arctic"
                  ? lang === "ko"
                    ? "CCCC의 세 공항 확장 사업 제안 중 한 곳의 참고 위치입니다. S08은 2018년 제안과 2019년 입찰 철회를 서술합니다. 완공·운영 또는 현재 투자 상태를 표시하지 않습니다."
                    : "A reference location for one of CCCC's three proposed airport expansions. S08 describes the 2018 proposal and 2019 bid withdrawal. This is not a claim of completion, operation or current investment status."
                  : visual.note[lang]}
            </p>
            <Link href={href} prefetch={false} className="inline-link">
              {source} ·{" "}
              {lang === "ko"
                ? "해당 원문과 맥락 읽기"
                : "Read the source in context"}{" "}
              ↗
            </Link>
          </>
        ) : (
          <p>
            {lang === "ko"
              ? "지점·도형·연결선을 선택하면 설명과 원문 위치가 여기에 표시됩니다."
              : "Select a point, node or connection to read its explanation and source here."}
          </p>
        )}
      </div>
      <details className="case-evidence">
        <summary>
          {lang === "ko"
            ? "확인 범위 · 편집 도식 / 독립 검증과 구분"
            : "Evidence scope · editorial diagram / not independent verification"}
        </summary>
        <p>{visual.note[lang]}</p>
      </details>
      <noscript>
        <style>{`.relation-diagram,.study-convergence,.map-scale-controls,.case-selection{display:none!important}.capability-expansion,.arctic-expansion{display:block!important}.scene-terrain{animation:none!important}`}</style>
        <div className="static-visual-explanation">
          <p>{visual.note[lang]}</p>
          <ol>
            {visual.steps.map((step, i) => (
              <li key={i}>
                {(actors[scene.id]?.[i] ?? step)[lang]} · {step[lang]}
              </li>
            ))}
          </ol>
          {scene.id === "china-arctic" && (
            <p>
              {lang === "ko"
                ? "누크·일루리사트·카코르톡: CCCC의 공항 사업 제안 위치. S08은 2018년 제안·2019년 입찰 철회를 서술합니다. 현재 사업 상태는 별도 확인 대상입니다."
                : "Nuuk, Ilulissat and Qaqortoq: reference locations for CCCC's airport proposal. S08 describes the 2018 proposal and 2019 bid withdrawal; current project status requires separate verification."}
            </p>
          )}
          {scene.id === "synthesis" && (
            <ul>
              {reports.map((r) => (
                <li key={r.id}>
                  <a href={`/reports/${r.id}?from=synthesis`}>
                    {r.id} · {lang === "ko" ? r.title : reportTitlesEn[r.id]}
                  </a>
                  <p>{researchConnections[r.id][lang]}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </noscript>
      <div className="case-source-links">
        {scene.related.map((id) => (
          <Link
            prefetch={false}
            key={id}
            href={scene.targets?.[id] ?? `/reports/${id}?from=${scene.id}`}
          >
            <span className="mono">{id}</span>
            <span>
              <strong>{studySpines[id][lang]}</strong>
              <span>{contributionLabels[id][lang]}</span>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </figure>
  );
}
