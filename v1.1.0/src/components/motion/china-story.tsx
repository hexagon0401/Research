"use client";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePreferences } from "../preferences";
import { chinaSteps, sourceHref } from "@/visuals/motion-stories";
import geography from "@/visuals/motion-geography.json";
import polar from "@/visuals/atlas-points.json";
import cameras from "@/visuals/scene-camera.json";
import {
  fitCamera,
  pointsBounds,
  cameraPoint,
  type Camera,
} from "@/visuals/camera";
import { loadMotion, nearScene } from "./runtime";
import { useSceneScroll } from "./use-scene-scroll";
import { ExpandDiagram } from "./expand-diagram";
import { SceneText } from "./scene-text";
import type { ReactNode } from "react";
import type { Copy } from "@/visuals/motion-stories";
import { MapTerrain } from "./map-terrain";
import { relationshipCurve, fitViewport } from "@/visuals/motion-geometry";
import { positionOverlay, bindTraveler } from "./frame";
const p = geography.pins;
const routeShapes = [
  relationshipCurve(p.cn, p.gl),
  relationshipCurve(p.cn, p.gl),
  relationshipCurve(p.cn, p.mm),
  relationshipCurve(p.cn, p.mm, -1),
  relationshipCurve(p.cn, p.kh),
];
const routes = routeShapes.map((shape) => shape.d);
const routeCameras = routeShapes.map((shape) =>
  fitCamera(
    pointsBounds(
      shape.points.map((p) => [...p]),
      12,
    ),
    52,
    12,
  ),
);
const names = {
  cn: ["중국", "China"],
  gl: ["그린란드", "Greenland"],
  mm: ["미얀마", "Myanmar"],
  kh: ["캄보디아", "Cambodia"],
};

const cameraOverview = fitCamera(
  pointsBounds([p.cn, p.gl, p.mm, p.kh], 24),
  52,
  2,
);
const cameraGreenland = fitCamera(cameras.regions.gl, 64);
const cameraMyanmar = fitCamera(
  pointsBounds([p.cn, ...cameras.regions.mm], 8),
  60,
);
const cameraCambodia = fitCamera(cameras.regions.kh, 72, 48);
const comparisonCamera = (selected: string, fallback: Camera) =>
  selected === "gl"
    ? cameraGreenland
    : selected === "mm"
      ? cameraMyanmar
      : selected === "kh"
        ? cameraCambodia
        : fallback;
const cameraArctic = fitCamera(
  pointsBounds(Object.values(polar.arctic.pins), 8),
  68,
);
function bindMapFrame(el: HTMLElement, target: HTMLElement) {
  let frame = fitViewport(target.clientWidth, target.clientHeight),
    world = { ...cameraOverview },
    arctic = { ...cameraArctic },
    previous = "";
  const worldGroup = el.querySelector<SVGGElement>("[data-world-camera]")!,
    polarGroup = el.querySelector<SVGGElement>("[data-polar-camera]")!;
  const labels = Array.from(
    el.querySelectorAll<HTMLElement>("[data-place]"),
  ).map((label) => ({
    label,
    polar: label.dataset.space === "polar",
    point:
      label.dataset.space === "polar"
        ? polar.arctic.pins[
            label.dataset.place as keyof typeof polar.arctic.pins
          ]
        : p[label.dataset.place as keyof typeof p],
  }));
  const markers = Array.from(
    el.querySelectorAll<SVGCircleElement>("[data-radius-px]"),
  ).map((circle) => ({
    circle,
    polar: !!circle.closest("[data-polar-camera]"),
    radius: Number(circle.dataset.radiusPx),
  }));
  const draw = (nextWorld: Camera, nextArctic: Camera = arctic) => {
    world = { ...nextWorld };
    arctic = { ...nextArctic };
    const key = [
      world.x,
      world.y,
      world.scale,
      arctic.x,
      arctic.y,
      arctic.scale,
      frame.scale,
      frame.x,
      frame.y,
    ].join("|");
    if (previous === key) return;
    previous = key;
    worldGroup.setAttribute(
      "transform",
      `translate(${world.x} ${world.y}) scale(${world.scale})`,
    );
    worldGroup.dataset.cameraScale = String(world.scale);
    polarGroup.setAttribute(
      "transform",
      `translate(${arctic.x} ${arctic.y}) scale(${arctic.scale})`,
    );
    polarGroup.dataset.cameraScale = String(arctic.scale);
    labels.forEach(({ label, point, polar }) =>
      positionOverlay(label, cameraPoint(point, polar ? arctic : world), frame),
    );
    markers.forEach(({ circle, polar, radius }) =>
      circle.setAttribute(
        "r",
        String(
          radius /
            Math.max(0.0001, frame.scale * (polar ? arctic : world).scale),
        ),
      ),
    );
    if (el.dataset.cameraReady !== "true") el.dataset.cameraReady = "true";
  };
  const measure = () => {
    frame = fitViewport(target.clientWidth, target.clientHeight);
    previous = "";
    draw(world, arctic);
  };
  const observer = new ResizeObserver(measure);
  observer.observe(target);
  measure();
  return { draw, dispose: () => observer.disconnect() };
}
export function ChinaStory({
  cases,
  arcticDetail,
}: {
  cases?: Record<string, { title: Copy; detail: ReactNode }>;
  arcticDetail?: ReactNode;
}) {
  const { lang, reduced } = usePreferences();
  const root = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    range = useRef<HTMLInputElement>(null),
    mobileRange = useRef<HTMLInputElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null),
    map = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0),
    [ready, setReady] = useState(false),
    [layer, setLayer] = useState("all"),
    [comparison, setComparison] = useState("all");
  const activeRef = useRef(0),
    progress = useRef(0),
    comparisonRef = useRef("all"),
    drawCameraRef = useRef<(() => void) | null>(null),
    frameRenderer = useRef<((world: Camera, arctic?: Camera) => void) | null>(
      null,
    );
  const s = chinaSteps[active];
  const scroll = useSceneScroll(
    root,
    stage,
    ".china-step-list > li",
    chinaSteps.length,
    (v) => {
      timeline.current?.progress(reduced ? 1 : v);
      paint(v);
    },
    lang,
    reduced,
  );
  const select = (value: number) => scroll.seek(value);
  useEffect(() => {
    const el = root.current,
      target = map.current;
    if (!el || !target) return;
    let dispose = () => {};
    const stop = nearScene(target, () => {
      const frame = bindMapFrame(el, target);
      frameRenderer.current = frame.draw;
      dispose = frame.dispose;
      const i = activeRef.current;
      frame.draw(
        i >= 5
          ? comparisonCamera(comparisonRef.current, cameraOverview)
          : i === 4
            ? cameraCambodia
            : i === 2 || i === 3
              ? cameraMyanmar
              : i === 1
                ? cameraGreenland
                : routeCameras[0],
        cameraArctic,
      );
    });
    return () => {
      stop();
      dispose();
      frameRenderer.current = null;
    };
  }, [lang]);
  function paint(v: number) {
    const i = Math.min(
      chinaSteps.length - 1,
      Math.floor(v * chinaSteps.length),
    );
    progress.current = v;
    if (root.current) {
      root.current.dataset.progress = v.toFixed(4);
      if (root.current.dataset.phase !== String(i))
        root.current.dataset.phase = String(i);
    }
    const percent = String(Math.round(v * 100));
    if (range.current && range.current.value !== percent)
      range.current.value = percent;
    if (mobileRange.current && mobileRange.current.value !== percent)
      mobileRange.current.value = percent;
    if (activeRef.current !== i) {
      activeRef.current = i;
      setActive(i);
    }
  }
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let alive = true,
      cleanup = () => {};
    if (reduced) {
      setReady(false);
      el.dataset.motionReady = "false";
      return;
    }
    const stopWatching = nearScene(el, () => {
      loadMotion()
        .then(({ gsap }) => {
          if (!alive) return;
          map.current?.style.setProperty("content-visibility", "visible");
          const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });
            timeline.current = tl;
            const paths = el.querySelectorAll<SVGPathElement>("[data-route]");
            paths.forEach((path, i) => {
              const dot = el.querySelector<SVGCircleElement>(
                `[data-traveler="${i}"]`,
              )!;
              const traveler = bindTraveler(path, dot),
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
                i + 0.1,
              );
            });
            const world = { ...routeCameras[0] };
            const renderCamera = () =>
              frameRenderer.current?.(
                tl.time() >= 5
                  ? comparisonCamera(comparisonRef.current, world)
                  : world,
                cameraArctic,
              );
            drawCameraRef.current = renderCamera;
            // A route is complete before its camera leaves the overview.
            tl.to(
              world,
              { ...cameraGreenland, duration: 0.3, ease: "none" },
              0.55,
            );
            tl.to(
              world,
              { ...routeCameras[2], duration: 0.1, ease: "none" },
              2,
            );
            tl.to(
              world,
              { ...cameraMyanmar, duration: 0.3, ease: "none" },
              2.55,
            );
            tl.to(
              world,
              { ...routeCameras[3], duration: 0.1, ease: "none" },
              3,
            );
            tl.to(
              world,
              { ...cameraMyanmar, duration: 0.3, ease: "none" },
              3.55,
            );
            tl.to(
              world,
              { ...routeCameras[4], duration: 0.1, ease: "none" },
              4,
            );
            tl.to(
              world,
              { ...cameraCambodia, duration: 0.3, ease: "none" },
              4.55,
            );
            tl.to(world, { ...cameraOverview, duration: 0.1, ease: "none" }, 5);
            tl.eventCallback("onUpdate", renderCamera);
            renderCamera();
            tl.to({}, { duration: 0.01 }, 6.99);
            tl.progress(scroll.progress.current);
            paint(scroll.progress.current);
            el.dataset.motionReady = "true";
            setReady(true);
            cleanup = () => {
              ctx.revert();
              timeline.current = null;
              drawCameraRef.current = null;
              map.current?.style.removeProperty("content-visibility");
            };
          }, el);
        })
        .catch(() => {
          el.dataset.motionReady = "false";
        });
    });
    return () => {
      alive = false;
      stopWatching();
      cleanup();
      setReady(false);
    };
  }, [lang, reduced]);
  useEffect(() => {
    if (timeline.current) drawCameraRef.current?.();
    else
      frameRenderer.current?.(
        active >= 5
          ? comparisonCamera(comparisonRef.current, cameraOverview)
          : active === 4
            ? cameraCambodia
            : active === 2 || active === 3
              ? cameraMyanmar
              : active === 1
                ? cameraGreenland
                : routeCameras[0],
        cameraArctic,
      );
  }, [active, lang, reduced, comparison]);
  const replayStep = () => scroll.replay();
  return (
    <figure
      ref={root}
      id="motion-china"
      className="case-visual scroll-scene motion-story motion-china emphasis-visual"
      data-motion-group="china"
      data-phase={active}
      data-pinned="false"
      data-visual-for="china-arctic"
      data-reading-passage
    >
      <span id="visual-china-arctic" className="essay-legacy-anchor" />
      <figcaption>
        <span className="eyebrow">
          2018—2025 /{" "}
          {lang === "ko"
            ? "시간순으로 읽는 세 지역"
            : "THREE PLACES THROUGH TIME"}
        </span>
        <h3>
          {lang === "ko"
            ? "공항·공급망·해안 개발로 이어지는 세 사례"
            : "Three cases: airports, supply networks and coastal development"}
        </h3>
        <p>
          {lang === "ko"
            ? "기업의 해외 활동은 각 지역의 제도와 공간 속에서 국가 전략과 만난다."
            : "Overseas business meets national strategy through local institutions and places."}
        </p>
      </figcaption>
      <nav className="case-source-links">
        <Link
          prefetch={false}
          href="/reports/S08?from=china-arctic#S08-R001-P010"
        >
          S08 · {lang === "ko" ? "원문 문맥" : "Source context"}
        </Link>
      </nav>
      <div className="china-scroll-body scene-body">
        <div className="china-motion-stage scene-stage" ref={stage}>
          <div className="motion-date-row">
            <span>{s.status[lang]}</span>
            <time>{s.date}</time>
            <select
              className="compact-scene-select"
              aria-label={lang === "ko" ? "사건 선택" : "Choose an event"}
              value={active}
              onChange={(e) => select((+e.target.value + 0.2) / 7)}
            >
              {chinaSteps.map((step, i) => (
                <option value={i} key={step.id}>
                  {step.date} ·{" "}
                  {i < 2
                    ? lang === "ko"
                      ? "그린란드"
                      : "Greenland"
                    : i < 4
                      ? lang === "ko"
                        ? "미얀마"
                        : "Myanmar"
                      : i === 4
                        ? lang === "ko"
                          ? "캄보디아"
                          : "Cambodia"
                        : lang === "ko"
                          ? "비교·종합"
                          : "Comparison"}
                </option>
              ))}
            </select>
          </div>
          <div ref={map} className="china-map" data-compare={comparison}>
            <div className="map-label-layer" aria-hidden="true">
              {Object.entries(names).map(([id, n]) => (
                <span data-place={id} data-space="world" key={id}>
                  {n[lang === "ko" ? 0 : 1]}
                </span>
              ))}
              {Object.entries({
                nuuk: "Nuuk",
                ilulissat: "Ilulissat",
                qaqortoq: "Qaqortoq",
              }).map(([id, n], i) => (
                <span
                  data-place={id}
                  data-space="polar"
                  key={id}
                  style={{
                    translate: `${i === 1 ? "0" : "-50%"} ${i === 2 ? "0" : "-100%"}`,
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
            <svg
              viewBox="0 0 720 520"
              width="720"
              height="520"
              aria-label={
                lang === "ko"
                  ? "지역 간 개략 관계 지도"
                  : "Schematic geographic relationships"
              }
              role="img"
            >
              <title>{s.title[lang]}</title>
              <g className="china-world">
                <g
                  data-world-camera
                  data-camera-scale="1"
                  style={{ transformOrigin: "0 0" }}
                >
                  <MapTerrain src="/visuals/world.svg" vector />
                  {Object.entries(cameras.outlines)
                    .filter(([id]) => ["cn", "gl", "mm", "kh"].includes(id))
                    .map(([id, d]) => (
                      <path
                        key={id}
                        className={`map-region region-${id}`}
                        d={d!}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  {routes.map((d, i) => (
                    <g key={i} className={`china-route china-route-${i}`}>
                      <defs>
                        <mask
                          id={`draw-china-${i}`}
                          maskUnits="userSpaceOnUse"
                          x="-16"
                          y="-16"
                          width="752"
                          height="552"
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
                        data-route={i}
                        mask={`url(#draw-china-${i})`}
                        d={d}
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle data-traveler={i} data-radius-px="3" r="3" />
                      <circle
                        cx={(i < 2 ? p.gl : i === 4 ? p.kh : p.mm)[0]}
                        cy={(i < 2 ? p.gl : i === 4 ? p.kh : p.mm)[1]}
                        r="4"
                        data-radius-px="4"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  ))}
                  <circle
                    cx={p.cn[0]}
                    cy={p.cn[1]}
                    r="4"
                    data-radius-px="4"
                    vectorEffect="non-scaling-stroke"
                    className="china-origin"
                  />
                </g>
              </g>
              <g className="china-polar">
                <g
                  data-polar-camera
                  data-camera-scale="1"
                  style={{ transformOrigin: "0 0" }}
                >
                  <MapTerrain src="/visuals/arctic.svg" vector />
                  {Object.entries(polar.arctic.pins).map(([key, pt], i) => (
                    <g key={key}>
                      <circle
                        cx={pt[0]}
                        cy={pt[1]}
                        r="4"
                        data-radius-px="4"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={`M${pt[0]} ${pt[1]}h${8 + i * 5}`}
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  ))}
                </g>
                <svg
                  x="500"
                  y="20"
                  width="180"
                  height="150"
                  viewBox="0 0 720 520"
                >
                  <rect width="720" height="520" className="motion-paper" />
                  <MapTerrain src="/visuals/arctic.svg" vector />
                </svg>
              </g>
            </svg>
          </div>
          {active === 4 && (
            <div className="map-business-link">
              <span data-layer="business" data-muted={layer === "facility"}>
                Prince Group / Canopy Sands
              </span>
              <span aria-hidden="true">↔</span>
              <span data-layer="facility" data-muted={layer === "business"}>
                Ream
              </span>
            </div>
          )}
          <ExpandDiagram
            target={map}
            caption={`${s.date} · ${s.title[lang]}`}
          />
          <div className="motion-place-legend">
            {Object.entries(names).map(([id, n]) => (
              <button
                key={id}
                onClick={() => {
                  comparisonRef.current = id;
                  setComparison(id);
                  if (activeRef.current >= 5) return;
                  if (id === "gl") select(0.1);
                  if (id === "mm") select(2.5 / 7);
                  if (id === "kh") select(4.5 / 7);
                }}
              >
                {n[lang === "ko" ? 0 : 1]}
              </button>
            ))}
          </div>
          {active === 4 && (
            <div className="motion-filter">
              {["all", "business", "facility"].map((v) => (
                <button
                  key={v}
                  aria-pressed={layer === v}
                  onClick={() => setLayer(v)}
                >
                  {lang === "ko"
                    ? { all: "전체", business: "기업·사업", facility: "시설" }[
                        v
                      ]
                    : v}
                </button>
              ))}
            </div>
          )}
          <div className="motion-controls" hidden={!ready && !reduced}>
            <label>
              {lang === "ko" ? "사건 다시 보기" : "Revisit events"}
              <input
                ref={range}
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                aria-label={
                  lang === "ko" ? "중국 사례 탐색" : "China story progress"
                }
                aria-valuetext={`${s.date} · ${s.title[lang]}`}
                onInput={(e) => select(+e.currentTarget.value / 100)}
              />
            </label>
            <div>
              <button
                onClick={() => select(Math.max(0, active - 1) / 7 + 0.01)}
                disabled={active === 0}
              >
                {lang === "ko" ? "이전" : "Previous"}
              </button>
              <button onClick={replayStep} disabled={reduced || !ready}>
                {lang === "ko" ? "현재 단계 다시 보기" : "Replay this step"}
              </button>
              <button
                onClick={() => select(Math.min(6, active + 1) / 7 + 0.01)}
                disabled={active === 6}
              >
                {lang === "ko" ? "다음" : "Next"}
              </button>
            </div>
          </div>
          <nav
            className="china-event-index"
            aria-label={
              lang === "ko" ? "시간순 사건 목차" : "Chronological event index"
            }
          >
            {chinaSteps.map((step, i) => (
              <a
                key={step.id}
                href={`#motion-${step.id}`}
                aria-current={i === active ? "step" : undefined}
                onClick={(e) => {
                  if (ready || reduced) {
                    e.preventDefault();
                    select((i + 0.2) / 7);
                  }
                }}
              >
                {i < 5
                  ? step.date
                  : lang === "ko"
                    ? i === 5
                      ? "비교"
                      : "다시 보기"
                    : i === 5
                      ? "Compare"
                      : "Revisit"}
              </a>
            ))}
          </nav>
        </div>
        <ol className="china-step-list scene-steps">
          {chinaSteps.map((step, i) => (
            <li
              id={`motion-${step.id}`}
              data-motion-step={step.id}
              data-beat={step.beat}
              data-step-index={i}
              data-reading-passage
              key={step.id}
              className={active === i ? "is-current" : ""}
            >
              <span className="mono">
                0{i + 1} / {step.date}
              </span>
              {(i === 2 && cases?.["china-myanmar"]) ||
              (i === 4 && cases?.["china-cambodia"]) ? (
                <section
                  id={i === 2 ? "china-myanmar" : "china-cambodia"}
                  className="china-case-anchor"
                  data-essay-beat
                  aria-label={step.title.en}
                >
                  <span
                    id={
                      i === 2 ? "visual-china-myanmar" : "visual-china-cambodia"
                    }
                    className="essay-legacy-anchor"
                  />
                  <h2>
                    {
                      cases![i === 2 ? "china-myanmar" : "china-cambodia"]
                        .title[lang]
                    }
                  </h2>
                  <SceneText text={step} />
                  {cases![i === 2 ? "china-myanmar" : "china-cambodia"].detail}
                </section>
              ) : (
                <>
                  <h3>{step.title[lang]}</h3>
                  <SceneText
                    text={step}
                    connection={i === 1 || i === 3 || i === 6}
                  />
                </>
              )}
              {i === 1 && arcticDetail}
              {i === 2 && (
                <details className="scene-detail">
                  <summary>
                    {lang === "ko" ? "공급 순서도" : "Supply sequence"}
                  </summary>
                  <p>
                    {lang === "ko"
                      ? "구이저우 안순 → 윈난 → 샨주 남산"
                      : "Anshun → Yunnan → Namsang"}
                  </p>
                  <small>
                    {lang === "ko"
                      ? "S08의 경로 서술을 정리한 순서도"
                      : "Sequence based on the route described in S08"}
                  </small>
                </details>
              )}
              {i === 4 && (
                <div
                  className="compact-case-filter motion-filter"
                  aria-label={
                    lang === "ko"
                      ? "기업과 시설의 연결"
                      : "Business and facility connections"
                  }
                >
                  {["all", "business", "facility"].map((v) => (
                    <button
                      key={v}
                      aria-pressed={layer === v}
                      onClick={() => setLayer(v)}
                    >
                      {lang === "ko"
                        ? {
                            all: "전체",
                            business: "기업·사업",
                            facility: "시설",
                          }[v]
                        : v}
                    </button>
                  ))}
                </div>
              )}
              {i === 4 && (
                <div className="cambodia-relation">
                  <strong>Prince Group / Canopy Sands</strong>
                  <span aria-hidden="true">↔</span>
                  <strong>Ream</strong>
                </div>
              )}
              {i === 5 && (
                <dl className="china-comparison">
                  <dt>{lang === "ko" ? "주체" : "Actors"}</dt>
                  <dd>CCCC · AVIC / NORINCO · Prince Group / Canopy Sands</dd>
                  <dt>{lang === "ko" ? "관계" : "Relationships"}</dt>
                  <dd>
                    {lang === "ko"
                      ? "공항 제안 / 공급 서술 / 사업·시설"
                      : "Airport proposal / reported supply / business and facility"}
                  </dd>
                  <dt>{lang === "ko" ? "해석" : "Interpretation"}</dt>
                  <dd>
                    {lang === "ko"
                      ? "접근권·정권 생존·국가 전략에 대한 저자의 분석"
                      : "The author’s analysis of access, regime survival and state strategy"}
                  </dd>
                  <dt>{lang === "ko" ? "공통 질문" : "Shared question"}</dt>
                  <dd>
                    {lang === "ko"
                      ? "기업의 해외 활동은 어떤 조건에서 국가 전략과 만나는가"
                      : "Under what conditions does overseas business meet national strategy?"}
                  </dd>
                </dl>
              )}
              <span className="motion-status">{step.status[lang]}</span>
              {step.sources.map((ref) => (
                <Link
                  key={ref.paragraph}
                  prefetch={false}
                  href={sourceHref(step, ref)}
                >
                  {ref.report} · {lang === "ko" ? "원문 읽기" : "Read source"} →
                </Link>
              ))}
            </li>
          ))}
        </ol>
      </div>
      <div className="compact-replay motion-controls">
        <label>
          {lang === "ko"
            ? "중국 사례 다시 살펴보기"
            : "Revisit the China cases"}
          <input
            ref={mobileRange}
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            aria-label={
              lang === "ko" ? "중국 사례 탐색" : "China story progress"
            }
            aria-valuetext={`${s.date} · ${s.title[lang]}`}
            onInput={(e) => select(+e.currentTarget.value / 100)}
          />
        </label>
        <button onClick={replayStep} disabled={reduced || !ready}>
          {lang === "ko" ? "현재 단계 다시 보기" : "Replay this step"}
        </button>
      </div>
    </figure>
  );
}
