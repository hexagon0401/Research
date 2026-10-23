"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePreferences } from "../preferences";
import { usePretext } from "../use-pretext";
import type { SceneMeta } from "../essay-experience";
import { mechanisms, mechanismGraph } from "@/visuals/mechanisms";
import { contributionLabels, studySpines } from "@/visuals/story";
import { researchConnections } from "@/content/research-connections";
import { clamp, loadMotion, nearScene, watchViewportFit } from "./runtime";
import { MapTerrain } from "./map-terrain";
const roleGroups: Record<string, string[]> = {
  technology: ["S01", "S02", "S03", "S13", "S16", "S17"],
  identity: ["S06", "S14"],
  strategy: ["S05", "S08", "S11", "S15"],
};
export function MechanismStory({ scene }: { scene: SceneMeta }) {
  const { lang, reduced } = usePreferences();
  const spec = mechanisms[scene.id],
    graph = useMemo(() => mechanismGraph(scene.id), [scene.id]);
  const root = useRef<HTMLElement>(null),
    diagram = useRef<HTMLDivElement>(null),
    selectedPanel = useRef<HTMLDivElement>(null),
    lastTrigger = useRef<HTMLElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [active, setActive] = useState(0),
    [selected, setSelected] = useState<string | null>(null),
    [direction, setDirection] = useState(false),
    [lens, setLens] = useState(50),
    [perspective, setPerspective] = useState("all");
  const activeRef = useRef(0),
    progress = useRef(0);
  const engine = usePretext(root, scene.id === "capability");
  useEffect(() => {
    const el = diagram.current;
    if (!el || !engine) return;

    let alive = true;
    const cache = new Map<string, ReturnType<typeof engine.prepare>>();
    const measure = () => {
      if (!alive) return;
      engine.setLocale(lang);
      el.querySelectorAll<HTMLElement>("[data-graph-node]").forEach((node) => {
        const label =
          graph.nodes.find((n) => n.id === node.dataset.graphNode)?.label[
            lang
          ] ?? "";
        const style = getComputedStyle(node);
        const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const key = `${font}|${label}`;
        let prepared = cache.get(key);
        if (!prepared) {
          prepared = engine.prepare(label, font, {
            wordBreak: lang === "ko" ? "keep-all" : "normal",
          });
          cache.set(key, prepared);
        }
        node.style.setProperty(
          "--measured-word",
          `${Math.min(132, Math.ceil(engine.measureNaturalWidth(prepared)) + 24)}px`,
        );
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      alive = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [engine, graph, lang]);
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    let alive = true,
      cleanup = () => {};
    const stop = nearScene(el, () =>
      loadMotion()
        .then(({ gsap, ScrollTrigger }) => {
          if (!alive) return;
          // Fixed-size diagrams can skip off-screen layout until the engine approaches.
          if (diagram.current)
            diagram.current.style.contentVisibility = "visible";
          const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });
            const total = spec.steps.length;
            graph.edges.forEach((edge, i) => {
              const path = el.querySelector<SVGPathElement>(
                `[data-mechanism-edge="${i}"]`,
              )!;
              const dot = el.querySelector(`[data-signal="${i}"]`)!;
              tl.fromTo(
                path,
                { strokeDashoffset: 1 },
                {
                  strokeDashoffset: 0,
                  autoRound: false,
                  duration: 0.6,
                  ease: "none",
                },
                edge.step + 0.12,
              );
              tl.set(dot, { autoAlpha: 0 }, 0);
              tl.set(dot, { autoAlpha: 1 }, edge.step + 0.12);
              tl.to(
                dot,
                {
                  motionPath: {
                    path,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                    start: direction ? 1 : 0,
                    end: direction ? 0 : 1,
                  },
                  duration: 0.6,
                  ease: "none",
                },
                edge.step + 0.12,
              );
              tl.set(dot, { autoAlpha: 0 }, edge.step + 0.9);
            });
            graph.nodes.forEach((node) => {
              const button = el.querySelector(`[data-graph-node="${node.id}"]`);
              if (!button) return;
              const move = () =>
                scene.id === "korea-platforms"
                  ? (node.step - 1) *
                    Math.min(80, (diagram.current?.clientWidth ?? 720) * 0.1)
                  : 0;
              tl.fromTo(
                button,
                { x: move, y: scene.id === "korea-platforms" ? 0 : 10 },
                { x: 0, y: 0, duration: 0.5, ease: "none" },
                Math.min(node.step, total - 1) + 0.1,
              );
            });
            if (scene.id === "capability")
              tl.fromTo(
                "[data-origin-globe]",
                { scale: 0.62 },
                { scale: 1, duration: 1, ease: "none" },
                2.8,
              );
            if (scene.id === "korea-chips") {
              tl.fromTo(
                "[data-chip-camera]",
                { x: 0, y: 0, scale: 1 },
                { x: -90, y: -25, scale: 1.25, duration: 0.8, ease: "none" },
                0,
              );
              tl.to(
                "[data-chip-camera]",
                { x: -510, y: -130, scale: 2, duration: 0.8, ease: "none" },
                1,
              );
              tl.to(
                "[data-chip-camera]",
                { x: 0, y: 0, scale: 1, duration: 0.8, ease: "none" },
                2,
              );
            }
            el.querySelectorAll<SVGPathElement>("[data-pca-edge]").forEach(
              (path, i) =>
                tl.fromTo(
                  path,
                  { strokeDashoffset: 1 },
                  {
                    strokeDashoffset: 0,
                    autoRound: false,
                    duration: 0.3,
                    ease: "none",
                  },
                  3 + i * 0.06,
                ),
            );
            tl.to({}, { duration: 0.01 }, total - 0.01);
            const update = (v: number) => {
              progress.current = v;
              tl.progress(v);
              el.dataset.progress = v.toFixed(4);
              const i = Math.min(total - 1, Math.floor(v * total));
              el.dataset.activeStep = String(i);
              if (activeRef.current !== i) {
                activeRef.current = i;
                setActive(i);
              }
            };
            const trigger = ScrollTrigger.create({
              trigger: diagram.current,
              start: "top 85%",
              end: "bottom 22%",
              invalidateOnRefresh: true,
              onRefresh: () => tl.invalidate().progress(progress.current),
              onUpdate: (self) => update(self.progress),
            });
            const mm = gsap.matchMedia();
            if (scene.id === "us-dome")
              mm.add("(min-width:1024px) and (min-height:700px)", () => {
                const stage = el.querySelector<HTMLElement>(".mechanism-body")!;
                let pin: ReturnType<typeof ScrollTrigger.create> | null = null;
                return watchViewportFit(stage, 120, (fits) => {
                  if (fits) {
                    el.dataset.domePinned = "true";
                    pin = ScrollTrigger.create({
                      trigger: stage,
                      start: "top 88px",
                      end: () => `+=${innerHeight * 1.5}`,
                      pin: stage,
                      pinSpacing: true,
                      onUpdate: (self) => update(self.progress),
                    });
                    trigger.disable(false);
                  } else {
                    pin?.kill();
                    pin = null;
                    trigger.enable();
                    el.dataset.domePinned = "false";
                  }
                  ScrollTrigger.refresh();
                });
              });
            el.dataset.motionReady = "true";
            update(trigger.progress);
            cleanup = () => {
              mm.revert();
              trigger.kill();
              ctx.revert();
              el.dataset.motionReady = "false";
              diagram.current?.style.removeProperty("content-visibility");
            };
            document.fonts.ready.then(() => {
              if (alive) {
                ScrollTrigger.refresh();
                window.dispatchEvent(new Event("iir:motion-layout"));
              }
            });
          }, el);
        })
        .catch(() => {}),
    );
    return () => {
      alive = false;
      stop();
      cleanup();
    };
  }, [scene.id, lang, reduced, graph, spec, direction]);
  useEffect(() => {
    if (selected) selectedPanel.current?.focus({ preventScroll: true });
  }, [selected]);
  const choose = (id: string) => {
    lastTrigger.current = document.activeElement as HTMLElement;
    setSelected(id);
  };
  const close = () => {
    setSelected(null);
    lastTrigger.current?.focus({ preventScroll: true });
  };
  const sourceURL = (source: string) =>
    scene.targets?.[source] ?? `/reports/${source}?from=${scene.id}`;
  const selectedIndex =
    graph.nodes.find((n) => n.id === selected)?.step ?? active;
  const selectedSource = selected?.startsWith("S")
    ? selected
    : spec.steps[Math.min(selectedIndex, spec.steps.length - 1)].source;
  const pathFor = (from: string, to: string, feedback?: boolean) => {
    const a = graph.nodes.find((n) => n.id === from)!,
      b = graph.nodes.find((n) => n.id === to)!;
    return feedback
      ? `M${a.x} ${a.y}Q360 485 ${b.x} ${b.y}`
      : `M${a.x} ${a.y}C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`;
  };
  return (
    <figure
      ref={root}
      className={`case-visual motion-story mechanism-story mechanism-${scene.id} ${["capability", "synthesis"].includes(scene.id) ? "emphasis-visual" : ""}`}
      id={`visual-${scene.id}`}
      data-motion-group={spec.group}
      data-visual-for={scene.id}
      data-active-step={active}
      onKeyDown={(e) => {
        if (e.key === "Escape" && selected) {
          e.preventDefault();
          close();
        }
      }}
    >
      <figcaption>
        <span className="eyebrow">
          {lang === "ko" ? "스크롤로 읽는 메커니즘" : "FOLLOW THE MECHANISM"}
        </span>
        <h3>{spec.title[lang]}</h3>
      </figcaption>
      {scene.id === "us-finance" && (
        <div
          className="motion-filter"
          aria-label={
            lang === "ko" ? "발행·상환 방향" : "Issuance or redemption"
          }
        >
          {[false, true].map((v) => (
            <button
              key={String(v)}
              disabled={!hydrated}
              aria-pressed={direction === v}
              onClick={() => setDirection(v)}
            >
              {lang === "ko"
                ? v
                  ? "상환"
                  : "발행"
                : v
                  ? "Redemption"
                  : "Issuance"}
            </button>
          ))}
        </div>
      )}
      {scene.id === "synthesis" && (
        <div
          className="motion-filter"
          aria-label={lang === "ko" ? "연구망 관점" : "Research perspective"}
        >
          {["all", "technology", "identity", "strategy"].map((v) => (
            <button
              key={v}
              disabled={!hydrated}
              aria-pressed={perspective === v}
              onClick={() => setPerspective(v)}
            >
              {lang === "ko"
                ? {
                    all: "전체",
                    technology: "기술",
                    identity: "정체성",
                    strategy: "국가 전략",
                  }[v]
                : v}
            </button>
          ))}
        </div>
      )}
      <div className="mechanism-body">
        <div
          className={`mechanism-diagram ${scene.id === "korea-chips" ? "mechanism-geographic" : ""}`}
          ref={diagram}
        >
          <svg
            viewBox="0 0 720 520"
            width="720"
            height="520"
            preserveAspectRatio={
              scene.id === "korea-chips" ? "xMidYMid meet" : "none"
            }
            aria-hidden="true"
          >
            {scene.id === "capability" && (
              <MapTerrain src="/visuals/globe.svg" origin />
            )}
            <g data-chip-camera style={{ transformOrigin: "0 0" }}>
              {scene.id === "korea-chips" && (
                <MapTerrain src="/visuals/world.svg" />
              )}
              {graph.edges.map((e, i) => (
                <g
                  key={i}
                  className={`mechanism-link ${e.feedback ? "feedback" : ""}`}
                  data-edge-from={e.from}
                  data-edge-to={e.to}
                  data-dimmed={
                    scene.id === "synthesis" &&
                    perspective !== "all" &&
                    !roleGroups[perspective]?.includes(e.from)
                  }
                >
                  <path
                    data-mechanism-edge={i}
                    pathLength="1"
                    d={pathFor(e.from, e.to, e.feedback)}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle data-signal={i} r="4" />
                </g>
              ))}
              {graph.nodes.map((node) => (
                <circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r={node.id === "S00" ? 9 : 4}
                  className="mechanism-point"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>
          {scene.id !== "korea-chips" && (
            <div className="mechanism-node-layer">
              {graph.nodes.map((node) => (
                <button
                  key={node.id}
                  disabled={!hydrated}
                  data-graph-node={node.id}
                  data-current={node.step === active}
                  data-dimmed={
                    scene.id === "synthesis" &&
                    perspective !== "all" &&
                    node.id !== "S00" &&
                    !roleGroups[perspective]?.includes(node.id)
                  }
                  style={{ left: `${node.x / 7.2}%`, top: `${node.y / 5.2}%` }}
                  onClick={() => choose(node.id)}
                  aria-label={
                    scene.id === "synthesis"
                      ? `${node.id} · ${studySpines[node.id]?.[lang] ?? node.id}`
                      : node.label[lang]
                  }
                >
                  {node.label[lang]}
                </button>
              ))}
            </div>
          )}
          {scene.id === "spatial-method" && (
            <>
              <div
                className="method-lens"
                style={{ clipPath: `inset(0 ${100 - lens}% 0 0)` }}
              >
                <span>
                  {lang === "ko" ? "저자의 해석" : "AUTHOR’S INTERPRETATION"}
                </span>
                <span className="method-analysis-path" />
              </div>
              <div className="method-pca">
                <svg
                  viewBox="0 0 720 520"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <path
                      key={i}
                      data-pca-edge
                      pathLength="1"
                      d={`M150 ${50 + i * 82}C280 ${50 + i * 82} 260 260 360 260`}
                      fill="none"
                    />
                  ))}
                  {[170, 350].map((y) => (
                    <path
                      key={y}
                      data-pca-edge
                      pathLength="1"
                      d={`M360 260Q450 260 570 ${y}`}
                      fill="none"
                    />
                  ))}
                </svg>
                <div>
                  {[
                    "Rev Growth",
                    "Gross Margin",
                    "Op Margin",
                    "R&D / Revenue",
                    "Asset Turnover",
                    "Debt / Equity",
                  ].map((k) => (
                    <span key={k}>{k}</span>
                  ))}
                </div>
                <span aria-hidden="true">→</span>
                <div>
                  <span>PC1</span>
                  <span>PC2</span>
                </div>
                <small>
                  {lang === "ko"
                    ? "차원 축소의 개념 · 실제 좌표·로딩 아님"
                    : "Dimension-reduction concept · not fitted coordinates or loadings"}
                </small>
              </div>
            </>
          )}
        </div>
        <ol className="mechanism-steps">
          {spec.steps.map((step, i) => (
            <li
              id={`motion-${scene.id}-${i + 1}`}
              key={i}
              className={i === active ? "is-current" : ""}
              data-reading-passage
            >
              <span className="mono">0{i + 1}</span>
              <strong>{step.title[lang]}</strong>
              <p>{step.copy[lang]}</p>
              <Link prefetch={false} href={sourceURL(step.source)}>
                {step.source} ·{" "}
                {lang === "ko" ? "원문에서 살펴보기" : "Read in context"} →
              </Link>
            </li>
          ))}
        </ol>
      </div>
      {scene.id === "korea-chips" && (
        <div className="motion-place-legend">
          {graph.nodes.map((node) => (
            <button key={node.id} onClick={() => choose(node.id)}>
              {node.label[lang]}
            </button>
          ))}
        </div>
      )}
      {scene.id === "spatial-method" && (
        <label className="evidence-lens-label">
          {lang === "ko"
            ? "보고된 내용 ↔ 저자의 해석"
            : "Reported material ↔ author’s interpretation"}
          <input
            type="range"
            min="0"
            max="100"
            value={lens}
            aria-label={
              lang === "ko"
                ? "근거와 해석 비교"
                : "Evidence and interpretation comparison"
            }
            onChange={(e) => setLens(+e.target.value)}
          />
        </label>
      )}
      {selected && (
        <div
          className="mechanism-selection case-selection"
          ref={selectedPanel}
          tabIndex={-1}
          role="region"
          aria-label={
            lang === "ko" ? "선택한 연결 설명" : "Selected connection"
          }
        >
          <button onClick={close}>{lang === "ko" ? "닫기" : "Close"} ×</button>
          <strong>
            {scene.id === "synthesis"
              ? studySpines[selected]?.[lang]
              : graph.nodes.find((n) => n.id === selected)?.label[lang]}
          </strong>
          <p>
            {scene.id === "synthesis"
              ? researchConnections[selected]?.[lang]
              : spec.steps[Math.min(selectedIndex, spec.steps.length - 1)].copy[
                  lang
                ]}
          </p>
          <Link prefetch={false} href={sourceURL(selectedSource)}>
            {selectedSource} ·{" "}
            {lang === "ko" ? "원문 문맥과 PDF" : "Full context and PDF"} →
          </Link>
        </div>
      )}
      {scene.id === "synthesis" && (
        <div className="convergence-branches motion-study-roles">
          {graph.nodes
            .filter((n) => n.id !== "S00")
            .map((node) => (
              <button
                key={node.id}
                disabled={!hydrated}
                data-study-node={node.id}
                data-dimmed={
                  perspective !== "all" &&
                  !roleGroups[perspective]?.includes(node.id)
                }
                onClick={() => choose(node.id)}
              >
                <span className="mono">{node.id}</span>
                <strong>{studySpines[node.id][lang]}</strong>
                <span>{contributionLabels[node.id][lang]}</span>
              </button>
            ))}
        </div>
      )}
      <nav
        className="case-source-links"
        aria-label={lang === "ko" ? "연결된 원문" : "Related sources"}
      >
        {scene.related.map((id) => (
          <Link key={id} prefetch={false} href={sourceURL(id)}>
            {id} · {lang === "ko" ? "원문 문맥" : "Source context"}
          </Link>
        ))}
      </nav>
      <p className="motion-evidence-note">{spec.note[lang]}</p>
    </figure>
  );
}
