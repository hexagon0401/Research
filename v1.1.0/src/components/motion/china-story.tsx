"use client";
import { useEffect, useRef, useState } from "react";
import type { ScrollTrigger as Trigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { usePreferences } from "../preferences";
import { chinaSteps, sourceHref } from "@/visuals/motion-stories";
import geography from "@/visuals/motion-geography.json";
import polar from "@/visuals/atlas-points.json";
import { clamp, loadMotion, nearScene } from "./runtime";
const p = geography.pins;
const curve = (a: number[], b: number[], lift = 70) =>
  `M${a[0]} ${a[1]}Q${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - lift} ${b[0]} ${b[1]}`;
const routes = [
  curve(p.cn, p.gl, 85),
  curve(p.cn, p.gl, 110),
  curve(p.cn, p.mm, 32),
  curve(p.cn, p.mm, 65),
  curve(p.cn, p.kh, 36),
];
const names = {
  cn: ["중국", "China"],
  gl: ["그린란드", "Greenland"],
  mm: ["미얀마", "Myanmar"],
  kh: ["캄보디아", "Cambodia"],
};
export function ChinaStory() {
  const { lang, reduced } = usePreferences();
  const root = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    range = useRef<HTMLInputElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null),
    driver = useRef<Trigger | null>(null),
    replay = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0),
    [ready, setReady] = useState(false),
    [detail, setDetail] = useState(false),
    [layer, setLayer] = useState("all"),
    [comparison, setComparison] = useState("all");
  const activeRef = useRef(0),
    progress = useRef(0),
    manual = useRef(false);
  const s = chinaSteps[active];
  const select = (value: number, source = "control") => {
    replay.current?.kill();
    const v = clamp(value);
    progress.current = v;
    if (driver.current && root.current?.dataset.pinned === "true") {
      window.scrollTo({
        top:
          driver.current.start +
          v * (driver.current.end - driver.current.start),
        behavior: "instant",
      });
    } else {
      manual.current = source !== "scroll";
      timeline.current?.progress(v);
      paint(v);
    }
  };
  function paint(v: number) {
    const i = Math.min(
      chinaSteps.length - 1,
      Math.floor(v * chinaSteps.length),
    );
    progress.current = v;
    if (root.current) {
      root.current.dataset.progress = v.toFixed(4);
      root.current.style.setProperty(
        "--local-route-progress",
        String(clamp((v * 7 - 2 - 0.12) / 0.55)),
      );
      root.current.dataset.phase = String(i);
      if (driver.current?.isActive)
        window.dispatchEvent(
          new CustomEvent("iir:motion-scene", {
            detail: { beat: chinaSteps[i].beat },
          }),
        );
    }
    if (range.current) range.current.value = String(Math.round(v * 100));
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
        .then(({ gsap, ScrollTrigger }) => {
          if (!alive) return;
          const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true });
            timeline.current = tl;
            const paths = el.querySelectorAll<SVGPathElement>("[data-route]");
            paths.forEach((path, i) => {
              const dot = el.querySelector(`[data-traveler="${i}"]`);
              tl.fromTo(
                path,
                { strokeDashoffset: 1 },
                {
                  strokeDashoffset: 0,
                  autoRound: false,
                  duration: 0.55,
                  ease: "none",
                },
                i + 0.12,
              );
              if (dot) {
                tl.set(dot, { autoAlpha: 0 }, 0);
                tl.set(dot, { autoAlpha: 1 }, i + 0.12);
                tl.to(
                  dot,
                  {
                    duration: 0.55,
                    motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
                    ease: "none",
                  },
                  i + 0.12,
                );
                tl.set(dot, { autoAlpha: 0 }, i + 0.9);
              }
            });
            tl.fromTo(
              "[data-world-camera]",
              { x: 0, y: 0, scale: 1 },
              { x: -820, y: -190, scale: 2.5, duration: 0.5, ease: "none" },
              2,
            );
            tl.to(
              "[data-world-camera]",
              { x: -620, y: -150, scale: 2.2, duration: 0.5, ease: "none" },
              4,
            );
            tl.to(
              "[data-world-camera]",
              { x: 0, y: 0, scale: 1, duration: 0.65, ease: "none" },
              5,
            );
            tl.fromTo(
              "[data-polar-camera]",
              { x: 0, y: 0, scale: 1 },
              { x: -850, y: -1030, scale: 4.4, duration: 0.65, ease: "none" },
              1.1,
            );
            tl.fromTo(
              "[data-cambodia-inset]",
              { y: 28 },
              { y: 0, duration: 0.3, ease: "none" },
              4.65,
            );
            tl.to({}, { duration: 0.01 }, 6.99);
            const update = (v: number) => {
              tl.progress(v);
              paint(v);
              const scale =
                Number(
                  gsap.getProperty(
                    el.querySelector("[data-world-camera]"),
                    "scaleX",
                  ),
                ) || 1;
              el.querySelectorAll<SVGCircleElement>(
                ".china-world circle",
              ).forEach((c) =>
                c.setAttribute(
                  "r",
                  String((c.hasAttribute("data-traveler") ? 3 : 4) / scale),
                ),
              );
            };
            const triggers: Trigger[] = [];
            const media = gsap.matchMedia();
            media.add("(min-width:1024px) and (min-height:700px)", () => {
              const visual = stage.current!;
              if (visual.offsetHeight > innerHeight - 90) return;
              el.dataset.pinned = "true";
              const trig = ScrollTrigger.create({
                trigger: el.querySelector(".china-scroll-body"),
                start: "top 80px",
                end: () =>
                  `+=${Math.max(innerHeight, el.querySelector<HTMLElement>(".china-step-list")!.offsetHeight - visual.offsetHeight)}`,
                pin: visual,
                pinSpacing: false,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                  if (!self.isActive)
                    window.dispatchEvent(
                      new CustomEvent("iir:motion-scene", {
                        detail: { beat: null },
                      }),
                    );
                },
                onUpdate: (self) => {
                  manual.current = false;
                  update(self.progress);
                },
              });
              driver.current = trig;
              return () => {
                trig.kill();
                driver.current = null;
                el.dataset.pinned = "false";
              };
            });
            triggers.push(
              ScrollTrigger.create({
                trigger: el.querySelector(".china-scroll-body"),
                start: "top 75%",
                end: "bottom 65%",
                onUpdate: (self) => {
                  if (!driver.current && !manual.current) update(self.progress);
                },
              }),
            );
            media.add("(max-width:1023px), (max-height:699px)", () => {
              const local: Trigger[] = [];
              el.querySelectorAll<HTMLElement>(".china-inline-map").forEach(
                (map) => {
                  const tween = gsap.timeline({ paused: true });
                  map
                    .querySelectorAll<SVGPathElement>("[data-inline-route]")
                    .forEach((path) => {
                      tween.fromTo(
                        path,
                        { strokeDashoffset: 1 },
                        {
                          strokeDashoffset: 0,
                          duration: 1,
                          autoRound: false,
                          ease: "none",
                        },
                        0,
                      );
                      const dot = path.nextElementSibling;
                      if (dot)
                        tween.to(
                          dot,
                          {
                            motionPath: {
                              path,
                              align: path,
                              alignOrigin: [0.5, 0.5],
                            },
                            duration: 1,
                            ease: "none",
                          },
                          0,
                        );
                    });
                  local.push(
                    ScrollTrigger.create({
                      trigger: map,
                      start: "top 85%",
                      end: "bottom 35%",
                      onUpdate: (self) => tween.progress(self.progress),
                    }),
                  );
                },
              );
              return () => local.forEach((t) => t.kill());
            });
            el.dataset.motionReady = "true";
            setReady(true);
            const cancel = () => replay.current?.kill();
            const save = (e: MouseEvent) => {
              if (!(e.target as Element).closest('a[href*="/reports/"]'))
                return;
              try {
                sessionStorage.setItem(
                  "iir-motion-return",
                  JSON.stringify({
                    id: "motion-china",
                    progress: progress.current,
                    beat: chinaSteps[activeRef.current].beat,
                  }),
                );
              } catch {}
            };
            el.addEventListener("click", save);
            window.addEventListener("wheel", cancel, { passive: true });
            window.addEventListener("touchstart", cancel, { passive: true });
            window.addEventListener("keydown", cancel);
            window.addEventListener("pointerdown", cancel);
            document.fonts.ready.then(() => {
              if (alive) ScrollTrigger.refresh();
            });
            const saved = (() => {
              try {
                return JSON.parse(
                  sessionStorage.getItem("iir-motion-return") ?? "null",
                );
              } catch {
                return null;
              }
            })();
            if (
              saved?.id === "motion-china" &&
              sessionStorage.getItem("iir-essay-resume") === "true"
            ) {
              requestAnimationFrame(() => {
                if (alive) select(saved.progress);
              });
              sessionStorage.removeItem("iir-motion-return");
              sessionStorage.removeItem("iir-essay-resume");
            }
            cleanup = () => {
              replay.current?.kill();
              media.revert();
              triggers.forEach((t) => t.kill());
              el.removeEventListener("click", save);
              window.removeEventListener("wheel", cancel);
              window.removeEventListener("touchstart", cancel);
              window.removeEventListener("keydown", cancel);
              window.removeEventListener("pointerdown", cancel);
              window.dispatchEvent(
                new CustomEvent("iir:motion-scene", { detail: { beat: null } }),
              );
              ctx.revert();
              timeline.current = null;
              driver.current = null;
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
  const replayStep = async () => {
    if (reduced || !timeline.current) return;
    const { gsap } = await loadMotion();
    const i = activeRef.current,
      from = (i + 0.05) / 7,
      to = (i + 0.95) / 7;
    select(from);
    const position = { value: from };
    replay.current = gsap.to(position, {
      value: to,
      duration: 2.4,
      ease: "none",
      onUpdate: () => {
        if (driver.current && root.current?.dataset.pinned === "true")
          window.scrollTo({
            top:
              driver.current.start +
              position.value * (driver.current.end - driver.current.start),
            behavior: "instant",
          });
        else {
          timeline.current?.progress(position.value);
          paint(position.value);
        }
      },
    });
  };
  return (
    <figure
      ref={root}
      id="motion-china"
      className="case-visual motion-story motion-china emphasis-visual"
      data-motion-group="china"
      data-phase={active}
      data-pinned="false"
      data-visual-for="china-arctic"
      data-reading-passage
    >
      <figcaption>
        <span className="eyebrow">
          2018—2025 /{" "}
          {lang === "ko"
            ? "시간순으로 읽는 세 지역"
            : "THREE PLACES THROUGH TIME"}
        </span>
        <h3>
          {lang === "ko"
            ? "선이 향하는 곳보다, 무엇을 연결하는가."
            : "What does the line connect?"}
        </h3>
        <p>
          {lang === "ko"
            ? "스크롤로 관계를 따라가고, 사건 목차에서 되짚어 보세요."
            : "Scroll through the relationships. Revisit an event below."}
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
      <div className="china-scroll-body">
        <div className="china-motion-stage" ref={stage}>
          <div className="motion-date-row">
            <span>{s.status[lang]}</span>
            <time>{s.date}</time>
          </div>
          <div className="china-map" data-compare={comparison}>
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
                <g data-world-camera style={{ transformOrigin: "0 0" }}>
                  <image href="/visuals/world.svg" width="720" height="520" />
                  {routes.map((d, i) => (
                    <g key={i} className={`china-route china-route-${i}`}>
                      <path
                        data-route={i}
                        d={d}
                        fill="none"
                        pathLength="1"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle data-traveler={i} r="3" />
                      <circle
                        cx={(i < 2 ? p.gl : i === 4 ? p.kh : p.mm)[0]}
                        cy={(i < 2 ? p.gl : i === 4 ? p.kh : p.mm)[1]}
                        r="4"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  ))}
                  <circle
                    cx={p.cn[0]}
                    cy={p.cn[1]}
                    r="4"
                    className="china-origin"
                  />
                </g>
              </g>
              <g className="china-polar">
                <g data-polar-camera style={{ transformOrigin: "0 0" }}>
                  <image href="/visuals/arctic.svg" width="720" height="520" />
                  {Object.entries(polar.arctic.pins).map(([key, pt], i) => (
                    <g key={key}>
                      <circle cx={pt[0]} cy={pt[1]} r="2" />
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
                  <image href="/visuals/arctic.svg" width="720" height="520" />
                </svg>
              </g>
            </svg>
            <div className="cambodia-inset" data-cambodia-inset>
              <span hidden={layer === "facility"}>
                Prince Group / Canopy Sands
              </span>
              <span>↔</span>
              <span hidden={layer === "business"}>Ream</span>
              <small>
                {lang === "ko"
                  ? "사업·시설 관계도 · 경계 원자료 없음"
                  : "Business / facility schematic · boundaries not supplied"}
              </small>
            </div>
          </div>
          <div className="motion-place-legend">
            {Object.entries(names).map(([id, n]) => (
              <button
                key={id}
                onClick={() => {
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
          {active === 1 && (
            <p className="motion-inline-note">
              Nuuk · Ilulissat · Qaqortoq /{" "}
              {lang === "ko"
                ? "광물 지분은 공항 제안과 별개"
                : "Mineral equity is separate from the airport proposal"}
            </p>
          )}
          {active === 2 && (
            <>
              <button
                className="motion-detail-toggle"
                aria-expanded={detail}
                onClick={() => setDetail(!detail)}
              >
                {lang === "ko"
                  ? "경로 상세 · 개략 순서도"
                  : "Route detail · schematic sequence"}
              </button>
              {detail && (
                <p className="motion-route-detail">
                  {lang === "ko"
                    ? "구이저우 안순 → 윈난 → 샨주 남산 · S08의 서술, 실제 항적 아님"
                    : "Anshun → Yunnan → Namsang · S08 account, not an observed track"}
                </p>
              )}
            </>
          )}
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
          <div className="china-current-copy">
            <strong>{s.title[lang]}</strong>
            <p>{s.copy[lang]}</p>
            <div className="motion-source-links">
              {s.sources.map((ref) => (
                <Link
                  key={ref.paragraph}
                  prefetch={false}
                  href={sourceHref(s, ref)}
                >
                  {ref.report} ·{" "}
                  {lang === "ko" ? "원문 문맥" : "Source context"} →
                </Link>
              ))}
            </div>
          </div>
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
        <ol className="china-step-list">
          {chinaSteps.map((step, i) => (
            <li
              id={`motion-${step.id}`}
              data-motion-step={step.id}
              data-step-index={i}
              data-reading-passage
              key={step.id}
              className={active === i ? "is-current" : ""}
            >
              <span className="mono">
                0{i + 1} / {step.date}
              </span>
              <h4>{step.title[lang]}</h4>
              <p>{step.copy[lang]}</p>
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
                  <dt>{lang === "ko" ? "확인 범위" : "Evidence scope"}</dt>
                  <dd>
                    {lang === "ko"
                      ? "원문 문맥 대조 · 항적·시설 경계 원자료 미제공"
                      : "Source context · underlying tracks and site boundaries not supplied"}
                  </dd>
                </dl>
              )}
              <div
                className="china-inline-map"
                aria-label={
                  lang === "ko" ? "단계별 개략 지도" : "Step reference map"
                }
              >
                <svg
                  viewBox="0 0 720 520"
                  width="720"
                  height="520"
                  role="img"
                  aria-label={step.title[lang]}
                >
                  <image
                    href={
                      i === 1 ? "/visuals/arctic.svg" : "/visuals/world.svg"
                    }
                    width="720"
                    height="520"
                  />
                  {i !== 1 &&
                    routes
                      .filter(
                        (_, r) =>
                          i >= 5 ||
                          r === (i === 0 ? 0 : i === 2 ? 2 : i === 3 ? 3 : 4),
                      )
                      .map((d, j) => (
                        <g key={j}>
                          <path
                            data-inline-route
                            d={d}
                            pathLength="1"
                            fill="none"
                          />
                          <circle data-inline-signal r="4" />
                        </g>
                      ))}
                </svg>
              </div>
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
    </figure>
  );
}
