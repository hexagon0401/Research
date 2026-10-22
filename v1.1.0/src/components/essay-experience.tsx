"use client";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { EssayBeat } from "@/content/essay";
import atlas from "@/visuals/atlas.json";
import { chapterFor, storyChapters, storyVisuals } from "@/visuals/story";
import { reports } from "@/content/report-catalog";
import { usePreferences } from "./preferences";
import { SceneDiagram, GeographicLegend } from "./scene-diagram";
export { SceneDiagram } from "./scene-diagram";
export type SceneMeta = Pick<
  EssayBeat,
  "id" | "title" | "mode" | "country" | "tint" | "related"
> & { targets?: Record<string, string> };
const Context = createContext<{ scene: SceneMeta | null }>({ scene: null });
const clamp = (v: number) => Math.max(0, Math.min(1, v));
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
      const current = scenes[index];
      const currentType = storyVisuals[current.id].type;
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
        const weight = Number(type === currentType);
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
export function InlineVisual({ scene }: { scene: SceneMeta }) {
  const { lang } = usePreferences();
  return (
    <figure className="essay-mobile-diagram">
      <SceneDiagram key={scene.id} scene={scene} compact />
      <GeographicLegend scene={scene} />
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
        <SceneDiagram key={scene.id} scene={scene} />
        <GeographicLegend scene={scene} />
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
