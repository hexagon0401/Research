"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePreferences } from "../preferences";
import { usePretext } from "../use-pretext";
import type { SceneMeta } from "../essay-experience";
import { mechanisms, mechanismGraph } from "@/visuals/mechanisms";
import { contributionLabels, studySpines } from "@/visuals/story";
import { researchConnections } from "@/content/research-connections";
import { loadMotion, nearScene } from "./runtime";
import { useSceneScroll } from "./use-scene-scroll";
import { ExpandDiagram } from "./expand-diagram";
import { dedupeFactSteps, type BilingualFact } from "@/utils/dedupe-facts";
import { SceneText } from "./scene-text";
import { MapTerrain } from "./map-terrain";
import { fitCamera, pointsBounds } from "@/visuals/camera";
import cameraRegions from "@/visuals/scene-camera.json";
import {
  bindDiagramFrame,
  bindTraveler,
  bindDrawPath,
  identityCamera,
} from "./frame";
import type { Camera } from "@/visuals/camera";
import { relationshipCurve } from "@/visuals/motion-geometry";
const roleGroups: Record<string, string[]> = {
  technology: ["S01", "S02", "S03", "S13", "S16", "S17"],
  identity: ["S06", "S14"],
  strategy: ["S05", "S08", "S11", "S15"],
};
export function MechanismStory({
  scene,
  detail,
  initialFacts = [],
}: {
  scene: SceneMeta;
  detail?: ReactNode;
  initialFacts?: BilingualFact[];
}) {
  const { lang, reduced } = usePreferences();
  const spec = mechanisms[scene.id],
    graph = useMemo(() => mechanismGraph(scene.id), [scene.id]);
  const paths = useMemo(
    () =>
      graph.edges.map((edge) => {
        const a = graph.nodes.find((n) => n.id === edge.from)!;
        const b = graph.nodes.find((n) => n.id === edge.to)!;
        if (scene.id === "korea-chips")
          return relationshipCurve(
            [a.x, a.y],
            [b.x, b.y],
            edge.from === "us" && edge.to === "kr" ? -1 : 1,
          );
        return {
          d: edge.feedback
            ? `M${a.x} ${a.y}Q360 485 ${b.x} ${b.y}`
            : `M${a.x} ${a.y}C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`,
          points: [
            [a.x, a.y],
            [b.x, b.y],
          ],
        };
      }),
    [graph, scene.id],
  );
  const readingSteps = useMemo(
    () => dedupeFactSteps(spec.steps, initialFacts),
    [spec.steps, initialFacts],
  );
  const root = useRef<HTMLElement>(null),
    diagram = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null),
    timeline = useRef<gsap.core.Timeline | null>(null),
    selectedPanel = useRef<HTMLDivElement>(null),
    lastTrigger = useRef<HTMLElement | null>(null),
    frameRenderer = useRef<((camera: Camera) => void) | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [active, setActive] = useState(0),
    [selected, setSelected] = useState<string | null>(null),
    [direction, setDirection] = useState(false),
    [lensMode, setLensMode] = useState<"auto" | "manual">("auto"),
    [perspective, setPerspective] = useState("all");
  const lensValue = useRef(100),
    lensModeRef = useRef<"auto" | "manual">("auto"),
    lensInput = useRef<HTMLInputElement>(null),
    lensOutput = useRef<HTMLOutputElement>(null),
    lensClip = useRef<SVGRectElement>(null);
  const renderLens = (value: number) => {
    const next = Math.max(0, Math.min(100, value));
    lensValue.current = next;
    const text =
      lang === "ko"
        ? `해석 표시 영역 ${Math.round(next)}%`
        : `Interpretation display area ${Math.round(next)}%`;
    if (lensInput.current) {
      lensInput.current.value = String(next);
      lensInput.current.setAttribute("aria-valuetext", text);
    }
    if (lensOutput.current) lensOutput.current.textContent = text;
    lensClip.current?.setAttribute("width", String((310 * next) / 100));
  };
  const syncLens = (value: number) => {
    if (scene.id !== "spatial-method") return;
    const local = Math.max(0, Math.min(1, value * spec.steps.length - 2));
    renderLens(
      lensModeRef.current === "manual"
        ? lensValue.current
        : reduced
          ? 100
          : ((local - 0.1) / 0.65) * 100,
    );
  };
  const activeRef = useRef(0),
    progress = useRef(0);
  const scroll = useSceneScroll(
    root,
    stage,
    ".mechanism-steps > li",
    spec.steps.length,
    (v) => {
      progress.current = v;
      syncLens(v);
      timeline.current?.progress(reduced ? 1 : v);
      if (root.current) root.current.dataset.progress = v.toFixed(4);
      const i = Math.min(
        spec.steps.length - 1,
        Math.floor(v * spec.steps.length),
      );
      if (activeRef.current !== i) {
        activeRef.current = i;
        setActive(i);
      }
    },
    lang,
    reduced,
  );
  useEffect(() => {
    syncLens(progress.current);
  }, [lang, reduced]);
  useEffect(() => {
    const target = diagram.current;
    if (!target) return;
    let dispose = () => {};
    const stop = nearScene(target, () => {
      const frame = bindDiagramFrame(target);
      frameRenderer.current = frame.draw;
      dispose = frame.dispose;
    });
    return () => {
      stop();
      dispose();
      frameRenderer.current = null;
    };
  }, [scene.id, lang]);
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
              // Interpretation branches have one owner: the comparison clip, never a second timeline.
              if (scene.id === "spatial-method" && edge.to === "interpretation")
                return;
              const path = el.querySelector<SVGPathElement>(
                `[data-mechanism-edge="${i}"]`,
              )!;
              const dot = el.querySelector(`[data-signal="${i}"]`)!;
              const traveler = bindTraveler(path, dot as SVGCircleElement),
                state = { value: 0 };
              traveler(0);
              tl.fromTo(
                state,
                { value: 0 },
                {
                  value: 1,
                  duration: 0.45,
                  ease: "none",
                  onUpdate: () => traveler(state.value),
                },
                edge.step + 0.1,
              );
            });
            if (scene.id === "korea-chips") {
              const overview = fitCamera(
                pointsBounds(
                  paths.flatMap((path) => path.points.map((p) => [...p])),
                  24,
                ),
                52,
                2,
              );
              const regional = fitCamera(
                pointsBounds(
                  [...cameraRegions.regions.kr, ...cameraRegions.regions.cn],
                  6,
                ),
                60,
                6,
              );
              const world = { ...overview };
              const camera =
                el.querySelector<SVGGElement>("[data-chip-camera]")!;
              let cameraKey = "";
              const render = () => {
                const key = [world.x, world.y, world.scale].join("|");
                if (key === cameraKey) return;
                cameraKey = key;
                camera.setAttribute(
                  "transform",
                  `translate(${world.x} ${world.y}) scale(${world.scale})`,
                );
                frameRenderer.current?.(world);
              };
              // Every new relation is drawn with both ends visible, then the local region is examined.
              tl.to(world, { ...regional, duration: 0.3, ease: "none" }, 1.55);
              tl.to(world, { ...overview, duration: 0.1, ease: "none" }, 2);
              tl.eventCallback("onUpdate", render);
              render();
            }
            el.querySelectorAll<SVGPathElement>("[data-pca-edge]").forEach(
              (path, i) => {
                const draw = bindDrawPath(path),
                  state = { value: 0 };
                draw(0);
                tl.fromTo(
                  state,
                  { value: 0 },
                  {
                    value: 1,
                    duration: i < 6 ? 0.22 : 0.2,
                    ease: "none",
                    onUpdate: () => draw(state.value),
                  },
                  i < 6 ? 3.1 + i * 0.035 : 3.5 + (i - 6) * 0.05,
                );
              },
            );
            tl.to({}, { duration: 0.01 }, total - 0.01);
            timeline.current = tl;
            tl.progress(scroll.progress.current);
            el.dataset.motionReady = "true";
            cleanup = () => {
              ctx.revert();
              timeline.current = null;
              frameRenderer.current?.(identityCamera);
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
  }, [scene.id, lang, reduced, graph, spec, direction, paths]);
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
  return (
    <figure
      ref={root}
      className={`case-visual scroll-scene motion-story mechanism-story mechanism-${scene.id} ${["capability", "synthesis"].includes(scene.id) ? "emphasis-visual" : ""}`}
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
        {scene.id === "korea-chips" && (
          <div
            className="relation-line-key"
            aria-label={lang === "ko" ? "관계선 범례" : "Relationship key"}
          >
            <span>
              <i aria-hidden="true" />
              {lang === "ko" ? "미국–한국" : "U.S.–Korea"}
            </span>
            <span>
              <i className="dashed" aria-hidden="true" />
              {lang === "ko" ? "미국–중국" : "U.S.–China"}
            </span>
          </div>
        )}
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
      <div className="mechanism-body scene-body">
        <div className="scene-stage" ref={stage}>
          <div
            className={`mechanism-diagram ${scene.id === "korea-chips" ? "mechanism-geographic" : ""}`}
            ref={diagram}
          >
            <svg
              viewBox="0 0 720 520"
              width="720"
              height="520"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {scene.id === "spatial-method" && (
                <defs>
                  <clipPath
                    id="method-comparison-clip"
                    clipPathUnits="userSpaceOnUse"
                  >
                    <rect
                      ref={lensClip}
                      x="330"
                      y="0"
                      width="310"
                      height="520"
                    />
                  </clipPath>
                </defs>
              )}
              <g
                data-chip-camera
                data-camera-scale="1"
                style={{ transformOrigin: "0 0" }}
              >
                {scene.id === "korea-chips" && (
                  <MapTerrain src="/visuals/world.svg" vector />
                )}
                {graph.edges.map((e, i) => (
                  <g
                    key={i}
                    className={`mechanism-link ${e.feedback ? "feedback" : ""}`}
                    clipPath={
                      scene.id === "spatial-method" && e.to === "interpretation"
                        ? "url(#method-comparison-clip)"
                        : undefined
                    }
                    data-interpretation={
                      scene.id === "spatial-method" && e.to === "interpretation"
                        ? "true"
                        : undefined
                    }
                    data-edge-from={e.from}
                    data-edge-to={e.to}
                    data-dimmed={
                      scene.id === "synthesis" &&
                      perspective !== "all" &&
                      !roleGroups[perspective]?.includes(e.from)
                    }
                  >
                    <defs>
                      <mask
                        id={`draw-${scene.id}-${i}`}
                        maskUnits="userSpaceOnUse"
                        x="-16"
                        y="-16"
                        width="752"
                        height="552"
                      >
                        <path
                          data-draw-mask
                          d={paths[i].d}
                          pathLength="1"
                          style={{
                            fill: "none",
                            stroke: "white",
                            strokeWidth: 12,
                            strokeDasharray: "1",
                            strokeDashoffset: 0,
                          }}
                        />
                      </mask>
                    </defs>
                    <path
                      data-mechanism-edge={i}
                      mask={`url(#draw-${scene.id}-${i})`}
                      d={paths[i].d}
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                    {!(
                      scene.id === "spatial-method" && e.to === "interpretation"
                    ) && <circle data-signal={i} data-radius-px="3" r="3" />}
                  </g>
                ))}
                {graph.nodes.map((node) => (
                  <circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r="4"
                    data-radius-px="4"
                    className="mechanism-point"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            </svg>
            <div
              className={`mechanism-node-layer ${scene.id === "korea-chips" ? "geographic-node-layer" : ""}`}
            >
              {graph.nodes.map((node) => (
                <button
                  key={node.id}
                  disabled={!hydrated}
                  data-graph-node={node.id}
                  data-anchor-x={node.x}
                  data-anchor-y={node.y}
                  data-current={node.step === active}
                  data-dimmed={
                    scene.id === "synthesis" &&
                    perspective !== "all" &&
                    node.id !== "S00" &&
                    !roleGroups[perspective]?.includes(node.id)
                  }
                  style={{
                    left: `${node.x / 7.2}%`,
                    top: `${node.y / 5.2}%`,
                  }}
                  onClick={() => choose(node.id)}
                  aria-label={
                    scene.id === "synthesis"
                      ? `${node.id} · ${studySpines[node.id]?.[lang] ?? node.id}`
                      : node.label[lang]
                  }
                >
                  {scene.id === "korea-chips"
                    ? {
                        us: lang === "ko" ? "미국" : "U.S.",
                        kr: lang === "ko" ? "한국" : "Korea",
                        cn: lang === "ko" ? "중국" : "China",
                      }[node.id]
                    : node.label[lang]}
                </button>
              ))}
            </div>
            {scene.id === "synthesis" && (
              <div className="compact-study-labels" aria-hidden="true">
                {graph.nodes.map((node) => (
                  <span
                    key={node.id}
                    data-anchor-x={node.x}
                    data-anchor-y={node.y}
                    style={{
                      left: `${node.x / 7.2}%`,
                      top: `${node.y / 5.2}%`,
                    }}
                  >
                    {node.id}
                  </span>
                ))}
              </div>
            )}
            {scene.id === "spatial-method" && (
              <>
                <div className="method-pca">
                  <svg
                    viewBox="0 0 720 520"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 8 }, (_, i) => {
                      const d =
                        i < 6
                          ? `M150 ${50 + i * 68}C280 ${50 + i * 68} 260 260 360 260`
                          : `M360 260Q450 260 570 ${i === 6 ? 170 : 350}`;
                      return (
                        <g key={i}>
                          <defs>
                            <mask
                              id={`pca-draw-${i}`}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="720"
                              height="520"
                            >
                              <path
                                data-draw-mask
                                d={d}
                                pathLength="1"
                                style={{
                                  fill: "none",
                                  stroke: "white",
                                  strokeWidth: 12,
                                  strokeDasharray: "1",
                                  strokeDashoffset: 0,
                                }}
                              />
                            </mask>
                          </defs>
                          <path
                            data-pca-edge
                            mask={`url(#pca-draw-${i})`}
                            d={d}
                            fill="none"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  <div className="pca-node-layer">
                    {(lang === "ko"
                      ? [
                          "매출 성장률",
                          "매출총이익률",
                          "영업이익률",
                          "연구개발/매출",
                          "자산회전율",
                          "부채/자본",
                        ]
                      : [
                          "Revenue growth",
                          "Gross margin",
                          "Op. margin",
                          "R&D / revenue",
                          "Asset turnover",
                          "Debt / equity",
                        ]
                    ).map((label, i) => (
                      <span
                        key={label}
                        data-anchor-x="150"
                        data-anchor-y={50 + i * 68}
                        style={{
                          left: `${150 / 7.2}%`,
                          top: `${(50 + i * 68) / 5.2}%`,
                        }}
                      >
                        {label}
                      </span>
                    ))}
                    {[170, 350].map((y, i) => (
                      <span
                        key={y}
                        data-anchor-x="570"
                        data-anchor-y={y}
                        style={{ left: `${570 / 7.2}%`, top: `${y / 5.2}%` }}
                      >
                        {lang === "ko" ? "분석 축" : "Axis"} {i + 1} (PC{i + 1})
                      </span>
                    ))}
                  </div>
                  <small>
                    {lang === "ko"
                      ? "PCA · 여섯 지표, 두 분석 축"
                      : "PCA · six indicators, two axes"}
                  </small>
                </div>
              </>
            )}
          </div>
          <ExpandDiagram
            target={diagram}
            caption={spec.steps[active].title[lang]}
          />
          {scene.id === "spatial-method" && (
            <div
              className="evidence-comparison"
              hidden={active !== 2}
              data-mode={reduced ? "manual" : lensMode}
            >
              <label className="evidence-lens-label">
                <span>
                  {lang === "ko"
                    ? "기록에서 해석으로"
                    : "From records to interpretation"}
                </span>
                <input
                  ref={lensInput}
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
                  disabled={!hydrated}
                  aria-label={
                    lang === "ko"
                      ? "근거와 해석 비교"
                      : "Evidence and interpretation comparison"
                  }
                  onPointerDown={() => {
                    lensModeRef.current = "manual";
                    setLensMode("manual");
                  }}
                  onKeyDown={(e) => {
                    if (
                      [
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Home",
                        "End",
                        "PageUp",
                        "PageDown",
                      ].includes(e.key)
                    ) {
                      lensModeRef.current = "manual";
                      setLensMode("manual");
                    }
                  }}
                  onChange={(e) => {
                    lensModeRef.current = "manual";
                    setLensMode("manual");
                    renderLens(Number(e.target.value));
                  }}
                />
              </label>
              <div className="comparison-status">
                <span>
                  {lang === "ko"
                    ? !reduced && lensMode === "auto"
                      ? "스크롤 연동"
                      : "직접 비교"
                    : !reduced && lensMode === "auto"
                      ? "Scroll-linked"
                      : "Manual comparison"}
                </span>
                <output ref={lensOutput} aria-live="off">
                  {lang === "ko"
                    ? "해석 표시 영역 100%"
                    : "Interpretation display area 100%"}
                </output>
                {!reduced && lensMode === "manual" && (
                  <button
                    onClick={() => {
                      lensModeRef.current = "auto";
                      setLensMode("auto");
                      syncLens(progress.current);
                    }}
                  >
                    {lang === "ko" ? "스크롤에 맞춰 보기" : "Follow scroll"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <ol className="mechanism-steps scene-steps">
          {spec.steps.map((step, i) => (
            <li
              id={`motion-${scene.id}-${i + 1}`}
              key={i}
              className={i === active ? "is-current" : ""}
              data-reading-passage
            >
              <span className="mono">0{i + 1}</span>
              <strong>{step.title[lang]}</strong>
              <SceneText
                text={readingSteps[i]}
                connection={i === spec.steps.length - 1}
              />
              <Link prefetch={false} href={sourceURL(step.source)}>
                {step.source} ·{" "}
                {studySpines[step.source]?.[lang] ??
                  (lang === "ko"
                    ? "원문에서 살펴보기"
                    : "Read in context")}{" "}
                →
              </Link>
              {i === spec.steps.length - 1 && detail}
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
              : spec.steps[Math.min(selectedIndex, spec.steps.length - 1)].lead[
                  lang
                ]}
          </p>
          <Link prefetch={false} href={sourceURL(selectedSource)}>
            {selectedSource} ·{" "}
            {studySpines[selectedSource]?.[lang] ??
              (lang === "ko" ? "원문 문맥과 PDF" : "Full context and PDF")}{" "}
            →
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
            {id} ·{" "}
            {studySpines[id]?.[lang] ??
              (lang === "ko" ? "원문 문맥" : "Source context")}
          </Link>
        ))}
      </nav>
    </figure>
  );
}
