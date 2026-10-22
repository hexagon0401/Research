"use client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
} from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import type { EssayBeat } from "@/content/essay";
import atlas from "@/visuals/atlas.json";
import { chapterFor, storyChapters, storyVisuals } from "@/visuals/story";
import { reports } from "@/content/report-catalog";
import { usePreferences } from "./preferences";
export type SceneMeta = Pick<
  EssayBeat,
  "id" | "title" | "mode" | "country" | "tint" | "related"
> & { targets?: Record<string, string> };
const Context = createContext<{ scene: SceneMeta | null }>({ scene: null });
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
function camera(scene: SceneMeta) {
  const scale =
    scene.id === "china-myanmar" || scene.id === "china-cambodia"
      ? 1.5
      : scene.country
        ? 1.2
        : 1;
  const pin = scene.country ? atlas.world.pins[scene.country] : [360, 250];
  return {
    scale,
    x: 360 - pin[0] * scale,
    y: 250 - pin[1] * scale,
  };
}
export function EssayExperience({
  scenes,
  children,
}: {
  scenes: SceneMeta[];
  children: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { lang, reduced } = usePreferences();
  const lastLang = useRef(lang);
  const read = useRef({ id: scenes[0].id, fraction: 0, started: false });
  useLayoutEffect(() => {
    if (lastLang.current !== lang && read.current.started) {
      const rect = document
        .getElementById(read.current.id)
        ?.getBoundingClientRect();
      if (rect)
        window.scrollTo({
          top:
            rect.top +
            scrollY +
            rect.height * read.current.fraction -
            innerHeight * 0.35,
          behavior: "instant",
        });
    }
    lastLang.current = lang;
  }, [lang]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const beats = Array.from(
      element.querySelectorAll<HTMLElement>("[data-essay-beat]"),
    );
    const progressBar = element.querySelector<HTMLProgressElement>(
      ".story-reading-progress",
    );
    let frame = 0,
      alive = true,
      dirty = true,
      previous = -1;
    let positions: { top: number; height: number }[] = [];
    const integration = element.querySelector<HTMLElement>("#integration");
    let integrationPosition: { top: number; height: number } | null = null;
    let maximum = 1,
      viewport = innerHeight;
    element.dataset.enhanced = "true";
    function paint() {
      frame = 0;
      if (!alive || document.hidden) return;
      const y = scrollY;
      if (dirty) {
        viewport = innerHeight;
        positions = beats.map((beat) => {
          const r = beat.getBoundingClientRect();
          return { top: r.top + y, height: r.height };
        });
        if (integration) {
          const r = integration.getBoundingClientRect();
          integrationPosition = { top: r.top + y, height: r.height };
        }
        maximum = Math.max(
          1,
          element!.offsetTop + element!.offsetHeight - viewport,
        );
        dirty = false;
      }
      const axis = y + viewport * 0.35;
      let index = 0;
      positions.forEach((p, i) => {
        if (p.top <= axis) index = i;
      });
      const pos = positions[index];
      if (!pos) return;
      const fraction = clamp((axis - pos.top) / Math.max(1, pos.height));
      const blend = reduced
        ? 1
        : smooth(
            clamp(
              (axis - pos.top) /
                Math.max(1, Math.min(pos.height, viewport * 0.8)),
            ),
          );
      const current = scenes[index],
        preceding = scenes[Math.max(0, index - 1)];
      const now = camera(current),
        before = camera(preceding);
      const currentType = storyVisuals[current.id].type,
        previousType = storyVisuals[preceding.id].type;
      read.current =
        integrationPosition && axis >= integrationPosition.top
          ? {
              id: "integration",
              fraction: clamp(
                (axis - integrationPosition.top) /
                  Math.max(1, integrationPosition.height),
              ),
              started: true,
            }
          : { id: current.id, fraction, started: axis >= positions[0].top };
      // Native scroll only; all geometry reads happen before writes. No pointer or idle animation loop.
      element!.style.setProperty(
        "--reading-progress",
        String(clamp(y / maximum)),
      );
      element!.style.setProperty(
        "--beat-progress",
        String(reduced ? 1 : fraction),
      );
      element!.style.setProperty(
        "--atlas-scale",
        String(before.scale + (now.scale - before.scale) * blend),
      );
      element!.style.setProperty(
        "--atlas-x",
        `${before.x + (now.x - before.x) * blend}px`,
      );
      element!.style.setProperty(
        "--atlas-y",
        `${before.y + (now.y - before.y) * blend}px`,
      );
      element!.style.setProperty(
        "--hero-travel",
        `${reduced ? 0 : Math.min(y * 0.08, 40)}px`,
      );
      for (const type of [
        "concept",
        "world",
        "globe",
        "arctic",
        "integration",
      ]) {
        const weight =
          currentType === previousType
            ? Number(type === currentType)
            : type === currentType
              ? blend
              : type === previousType
                ? 1 - blend
                : 0;
        element!.style.setProperty(`--mode-${type}`, String(weight));
      }
      element!.dataset.scene = current.id;
      element!.dataset.motion = reduced ? "reduced" : "full";
      if (progressBar) progressBar.value = clamp(y / maximum);
      if (previous !== index) {
        previous = index;
        setActive(index);
      }
    }
    function schedule() {
      if (!frame && alive && !document.hidden)
        frame = requestAnimationFrame(paint);
    }
    function invalidate() {
      dirty = true;
      schedule();
    }
    const observer = new ResizeObserver(invalidate);
    observer.observe(element);
    beats.forEach((beat) => observer.observe(beat));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("pageshow", invalidate);
    document.addEventListener("visibilitychange", schedule);
    document.fonts.ready.then(() => {
      if (alive) invalidate();
    });
    schedule();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("pageshow", invalidate);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [scenes, lang, reduced]);
  useEffect(() => {
    const scene = new URLSearchParams(location.search).get("scene");
    if (scene && !location.hash)
      document.getElementById(scene)?.scrollIntoView({ behavior: "instant" });
  }, []);
  return (
    <Context.Provider value={{ scene: scenes[active] }}>
      <main id="main" className="research-essay" ref={root}>
        {children}
      </main>
    </Context.Provider>
  );
}
export function StoryNavigation() {
  const { scene } = useContext(Context);
  const { lang, setLang } = usePreferences();
  const menu = useRef<HTMLDetailsElement>(null);
  const chapter = chapterFor(scene?.id ?? "survival");
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node))
        menu.current?.removeAttribute("open");
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, []);
  return (
    <nav
      className="story-navigation"
      aria-label={
        lang === "ko" ? "연구 읽기 탐색" : "Research reading navigation"
      }
    >
      <div className="story-navigation-inner section-shell">
        <a href="#question" className="story-nav-mark mono">
          IIR / S00
        </a>
        <span className="story-current od-row">
          <span className="mono">{chapter.number} / 06</span>
          <span>{chapter.short[lang]}</span>
        </span>
        <details
          ref={menu}
          className="story-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              menu.current?.removeAttribute("open");
              menu.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>
            {lang === "ko" ? "목차" : "Contents"}
            <span aria-hidden="true">＋</span>
          </summary>
          <div className="story-menu-panel">
            {storyChapters.map((item) => (
              <a
                key={item.id}
                href={`#${item.anchor}`}
                aria-current={chapter.id === item.id ? "location" : undefined}
                onClick={() => menu.current?.removeAttribute("open")}
              >
                <span className="mono">{item.number}</span>
                <span>{item.title[lang]}</span>
              </a>
            ))}
            <Link href="/archive">
              {lang === "ko" ? "연구 아카이브" : "Research archive"} ↗
            </Link>
            <div
              className="story-menu-language language-switch"
              aria-label="Reading interface language"
            >
              {(["en", "ko"] as const).map((language) => (
                <button
                  key={language}
                  lang={language}
                  aria-pressed={lang === language}
                  onClick={() => {
                    setLang(language);
                    menu.current?.removeAttribute("open");
                    menu.current
                      ?.querySelector("summary")
                      ?.focus({ preventScroll: true });
                  }}
                >
                  {language === "en" ? "English" : "한국어"}
                </button>
              ))}
            </div>
          </div>
        </details>
        <progress
          className="story-reading-progress"
          max="1"
          value="0"
          aria-label={
            lang === "ko" ? "연구 읽기 진행률" : "Research reading progress"
          }
        />
      </div>
    </nav>
  );
}
export function HeroAtlas() {
  return (
    <figure className="hero-atlas" aria-hidden="true">
      <svg viewBox="0 0 720 520" width="720" height="520" fill="none">
        <g className="hero-atlas-globe">
          <circle cx="360" cy="258" r="202" className="geo-sphere" />
          <path d={atlas.globe.grid} className="geo-grid" />
          <path d={atlas.globe.land} className="geo-land" />
        </g>
        <path
          d="M48 258h100M572 258h100M360 24v24M360 468v28"
          className="geo-registration"
        />
        <path
          d="M102 444h146"
          className="hero-connection-line"
          pathLength="1"
        />
        <rect x="94" y="436" width="16" height="16" className="geo-signal" />
        <text x="124" y="476" className="diagram-footnote">
          ONE QUESTION / DIFFERENT SCALES
        </text>
      </svg>
    </figure>
  );
}
function worldPins(scene: SceneMeta) {
  if (scene.id === "china-myanmar") return ["cn", "mm"];
  if (scene.id === "china-cambodia") return ["cn", "kh"];
  if (scene.country) return [scene.country];
  return ["us", "cn", "kr"];
}
const names: Record<string, { ko: string; en: string }> = {
  us: { ko: "미국", en: "UNITED STATES" },
  cn: { ko: "중국", en: "CHINA" },
  kr: { ko: "한국", en: "KOREA" },
  mm: { ko: "미얀마", en: "MYANMAR" },
  kh: { ko: "캄보디아", en: "CAMBODIA" },
};
export function SceneDiagram({
  scene,
  compact = false,
}: {
  scene: SceneMeta;
  compact?: boolean;
}) {
  const { lang } = usePreferences();
  const visual = storyVisuals[scene.id];
  const focusId = useId();
  const highlighted = worldPins(scene);
  const local = compact
    ? ({
        "--mode-world": Number(visual.type === "world"),
        "--mode-globe": Number(visual.type === "globe"),
        "--mode-arctic": Number(visual.type === "arctic"),
        "--mode-concept": Number(visual.type === "concept"),
        "--mode-integration": Number(visual.type === "integration"),
        "--atlas-scale": 1,
        "--atlas-x": "0px",
        "--atlas-y": "0px",
      } as CSSProperties)
    : undefined;
  const visible = (type: string) => !compact || visual.type === type;
  return (
    <svg
      className={`essay-scene-diagram ${compact ? "compact" : ""}`}
      style={local}
      viewBox="0 0 720 520"
      width="720"
      height="520"
      role="img"
      aria-label={visual.heading[lang]}
    >
      <defs>
        <radialGradient id={focusId}>
          <stop stopColor="var(--signal)" stopOpacity=".18" />
          <stop offset="1" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <title>{visual.heading[lang]}</title>
      <desc>{visual.note[lang]}</desc>
      {visible("world") && (
        <g className="geo-layer layer-world">
          <g className="geo-world-camera">
            {!compact && <path d={atlas.world.grid} className="geo-grid" />}
            {scene.country && !compact && (
              <circle
                cx={atlas.world.pins[scene.country][0]}
                cy={atlas.world.pins[scene.country][1]}
                r="88"
                fill={`url(#${focusId})`}
              />
            )}
            <path d={atlas.world.land} className="geo-land" />
            {Object.entries(atlas.world.countries).map(([key, path]) => (
              <path
                key={key}
                d={path}
                className={
                  highlighted.includes(key)
                    ? "geo-country selected"
                    : "geo-country"
                }
              />
            ))}
            {Object.entries(atlas.world.pins)
              .filter(
                ([key]) =>
                  ["us", "cn", "kr"].includes(key) || highlighted.includes(key),
              )
              .map(([key, point]) => (
                <g
                  key={key}
                  transform={`translate(${point[0]} ${point[1]})`}
                  className={
                    highlighted.includes(key) ? "geo-pin selected" : "geo-pin"
                  }
                >
                  <circle r={highlighted.includes(key) ? 7 : 3} />
                  {highlighted.includes(key) && (
                    <>
                      <path d="M-16 0h6m20 0h6M0-16v6m0 20v6" />
                      <text
                        x={key === "us" ? -16 : 16}
                        y={key === "kh" ? 32 : -16}
                        textAnchor={key === "us" ? "end" : "start"}
                      >
                        {names[key][lang]}
                      </text>
                    </>
                  )}
                </g>
              ))}
          </g>
          <text x="32" y="496" className="diagram-footnote">
            {lang === "ko"
              ? "지리적 비교 범위 / NATURAL EARTH"
              : "GEOGRAPHIC SCOPE / NATURAL EARTH"}
          </text>
        </g>
      )}
      {visible("globe") && (
        <g className="geo-layer layer-globe">
          <circle cx="360" cy="258" r="202" className="geo-sphere" />
          <path d={atlas.globe.grid} className="geo-grid" />
          <path d={atlas.globe.land} className="geo-land" />
          <path d="M84 258h72m408 0h72" className="geo-registration" />
          <text
            x="360"
            y="504"
            textAnchor="middle"
            className="diagram-footnote"
          >
            {lang === "ko"
              ? "기업의 역량 / 국가적 스케일"
              : "CORPORATE CAPABILITY / NATIONAL SCALE"}
          </text>
        </g>
      )}
      {visible("arctic") && (
        <g className="geo-layer layer-arctic">
          <path d={atlas.arctic.grid} className="geo-grid" />
          <circle cx="360" cy="250" r="220" className="geo-sphere" />
          <path d={atlas.arctic.land} className="geo-land" />
          {Object.entries(atlas.arctic.pins).map(([key, point], index) => (
            <g
              key={key}
              transform={`translate(${point[0]} ${point[1]})`}
              className="geo-pin selected"
            >
              <circle r="5" />
              <path
                d={`M-8 0H${-28 - index * 32}v${index === 0 ? -32 : index === 1 ? -64 : 24}`}
              />
              <text
                x={-36 - index * 32}
                y={index === 0 ? -28 : index === 1 ? -60 : 28}
                textAnchor="end"
              >
                {key.toUpperCase()}
              </text>
            </g>
          ))}
          <text
            x="360"
            y="244"
            textAnchor="middle"
            className="diagram-footnote"
          >
            90° N
          </text>
          <text
            x="360"
            y="504"
            textAnchor="middle"
            className="diagram-footnote"
          >
            {lang === "ko"
              ? "북극권 참고 위치 / 관측 항적 아님"
              : "ARCTIC REFERENCE LOCATIONS / NOT VESSEL TRACKS"}
          </text>
        </g>
      )}
      {visible("concept") && (
        <g className="geo-layer layer-concept">
          <path d="M144 270H576" className="concept-thread" pathLength="1" />
          {visual.steps.map((step, index) => (
            <g key={index} transform={`translate(${64 + index * 216} 172)`}>
              <rect
                width="160"
                height="160"
                className={
                  index === 1 ? "concept-block focal" : "concept-block"
                }
              />
              <text x="16" y="32" className="diagram-index">
                0{index + 1}
              </text>
              <text x="80" y="98" textAnchor="middle" className="diagram-label">
                {step[lang]}
              </text>
            </g>
          ))}
          <path d="M144 356v40h432v-40" className="concept-boundary" />
          <text
            x="360"
            y="432"
            textAnchor="middle"
            className="diagram-footnote"
          >
            {lang === "ko"
              ? "개념적 연결 / 검증 대상 메커니즘"
              : "CONCEPTUAL CONNECTION / A MECHANISM TO EXAMINE"}
          </text>
        </g>
      )}
      {visible("integration") && (
        <g className="geo-layer layer-integration">
          <path d="M148 260h112M260 60v400" className="concept-thread" />
          <rect
            x="52"
            y="212"
            width="112"
            height="96"
            className="concept-block focal"
          />
          <text x="108" y="269" textAnchor="middle" className="diagram-label">
            S00
          </text>
          {reports
            .filter((report) => report.id !== "S00")
            .map((report, index) => (
              <g key={report.id}>
                <path
                  d={`M260 ${72 + index * 32}H${index % 2 === 0 ? 440 : 520}`}
                  className="concept-boundary"
                />
                <circle
                  cx={index % 2 === 0 ? 440 : 520}
                  cy={72 + index * 32}
                  r="4"
                  className="geo-signal"
                />
                <text
                  x={index % 2 === 0 ? 456 : 536}
                  y={78 + index * 32}
                  className="diagram-index"
                >
                  {report.id}
                </text>
              </g>
            ))}
          <text x="52" y="496" className="diagram-footnote">
            {lang === "ko"
              ? "13개의 연구 / 공유하는 질문과 분석 역할"
              : "13 STUDIES / SHARED QUESTIONS AND ANALYTICAL ROLES"}
          </text>
        </g>
      )}
    </svg>
  );
}
export function InlineVisual({ scene }: { scene: SceneMeta }) {
  const { lang } = usePreferences();
  return (
    <figure className="essay-mobile-diagram">
      <SceneDiagram scene={scene} compact />
      <div className="inline-mechanism">
        {storyVisuals[scene.id].steps.map((step, index) => (
          <span key={index}>{step[lang]}</span>
        ))}
      </div>
      <figcaption>{storyVisuals[scene.id].note[lang]}</figcaption>
    </figure>
  );
}
export function EssayVisual() {
  const { scene } = useContext(Context);
  const { lang } = usePreferences();
  if (!scene) return null;
  const visual = storyVisuals[scene.id],
    chapter = chapterFor(scene.id);
  return (
    <aside
      className="essay-visual"
      aria-label={
        lang === "ko"
          ? "논지를 따라가는 시각 설명"
          : "Visual guide to the argument"
      }
    >
      <div className="visual-folio mono">
        <span>{chapter.number} / 06</span>
        <span>{chapter.title[lang]}</span>
      </div>
      <figure className="essay-visual-geometry">
        <SceneDiagram scene={scene} />
        <figcaption className="visual-heading">
          {visual.heading[lang]}
        </figcaption>
      </figure>
      <div className="visual-mechanism">
        {visual.steps.map((step, i) => (
          <div className="od-field" key={i}>
            <span className="mono">0{i + 1}</span>
            <span>{step[lang]}</span>
          </div>
        ))}
      </div>
      <p className="visual-evidence-note">{visual.note[lang]}</p>
      <div className="visual-source-links">
        <span className="mono">
          {lang === "ko" ? "이 논지의 원문" : "READ IN CONTEXT"}
        </span>
        <div>
          {scene.related.map((id) => (
            <Link
              key={id}
              prefetch={false}
              href={scene.targets?.[id] ?? `/reports/${id}`}
            >
              {id} ↗
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
