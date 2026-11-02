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
import { chapterFor, storyChapters, storyVisuals } from "@/visuals/story";
import { usePreferences } from "./preferences";
export { SceneDiagram } from "./scene-diagram";
export type SceneMeta = Pick<
  EssayBeat,
  "id" | "title" | "mode" | "country" | "tint" | "related"
> & { targets?: Record<string, string> };
const Context = createContext<{ scene: SceneMeta | null; scenes: SceneMeta[] }>(
  { scene: null, scenes: [] },
);
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
  const motionScene = useRef<string | null>(null);
  useEffect(() => {
    const sync = (event: Event) => {
      motionScene.current = (event as CustomEvent).detail?.beat ?? null;
      if (motionScene.current) {
        const i = scenes.findIndex((s) => s.id === motionScene.current);
        if (i >= 0) {
          setActive(i);
          if (root.current) root.current.dataset.scene = motionScene.current;
        }
      }
    };
    window.addEventListener("iir:motion-scene", sync);
    return () => window.removeEventListener("iir:motion-scene", sync);
  }, [scenes]);
  const { lang, reduced } = usePreferences();
  const lastLang = useRef(lang);
  const lastReduced = useRef(reduced);
  const read = useRef({ id: scenes[0].id, fraction: 0, started: false });
  const passage = useRef<{ id: string; offset: number } | null>(null);
  const restoredAnchor = useRef<string | null>(null);
  const returnPoint = useRef<{ id: string; offset: number } | null>(null);
  useEffect(() => {
    const capture = () => {
      const candidates = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          "[data-reading-passage], [data-essay-beat]",
        ) ?? [],
      );
      const sceneStep = root.current?.querySelector<HTMLElement>(
        '.scroll-scene[data-scene-active="true"] .scene-steps > li[aria-current="step"]',
      );
      const el =
        (restoredAnchor.current
          ? document.getElementById(restoredAnchor.current)
          : null) ??
        sceneStep ??
        candidates
          .filter(
            (el) =>
              el.getClientRects().length > 0 &&
              el.getBoundingClientRect().top <= innerHeight * 0.35,
          )
          .at(-1);
      if (el)
        passage.current = { id: el.id, offset: el.getBoundingClientRect().top };
    };
    document.addEventListener("iir:before-language", capture);
    return () => document.removeEventListener("iir:before-language", capture);
  }, []);
  useLayoutEffect(() => {
    if (
      (lastLang.current !== lang || lastReduced.current !== reduced) &&
      read.current.started
    ) {
      const point = passage.current;
      const rect = document
        .getElementById(point?.id ?? read.current.id)
        ?.getBoundingClientRect();
      if (rect)
        window.scrollTo({
          top:
            rect.top +
            scrollY +
            (point
              ? -point.offset
              : rect.height * read.current.fraction - innerHeight * 0.35),
          behavior: "instant",
        });
    }
    if (lastLang.current !== lang && passage.current) {
      const point = passage.current;
      let alive = true;
      let interrupted = false;
      const stop = () => {
        interrupted = true;
      };
      for (const type of ["wheel", "pointerdown", "keydown"])
        window.addEventListener(type, stop, { once: true, passive: true });
      const restore = () => {
        if (!alive || interrupted) return;
        const el = document.getElementById(point.id);
        if (el)
          window.scrollBy({
            top: el.getBoundingClientRect().top - point.offset,
            behavior: "instant",
          });
      };
      const settled = () =>
        requestAnimationFrame(() => requestAnimationFrame(restore));
      document.fonts.ready.then(settled);
      document.fonts.addEventListener("loadingdone", settled);
      lastLang.current = lang;
      lastReduced.current = reduced;
      return () => {
        alive = false;
        document.fonts.removeEventListener("loadingdone", settled);
        for (const type of ["wheel", "pointerdown", "keydown"])
          window.removeEventListener(type, stop);
      };
    }
    lastLang.current = lang;
    lastReduced.current = reduced;
  }, [lang, reduced]);
  useEffect(() => {
    let alive = true;
    const save = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!link || !new URL(link.href).pathname.startsWith("/reports/")) return;
      const candidates = Array.from(
        root.current?.querySelectorAll<HTMLElement>(
          "[data-reading-passage], [data-essay-beat]",
        ) ?? [],
      );
      const current =
        link.closest<HTMLElement>("[data-reading-passage]") ??
        candidates
          .filter((el) => el.getBoundingClientRect().top <= innerHeight * 0.35)
          .at(-1) ??
        candidates[0];
      if (current)
        try {
          sessionStorage.setItem(
            "iir-essay-return",
            JSON.stringify({
              anchor: current.id,
              offset: current.getBoundingClientRect().top,
              beat: current.closest("[data-essay-beat]")?.id ?? current.id,
              lang,
              openDetails: Array.from(
                root.current?.querySelectorAll<HTMLDetailsElement>(
                  "details[id][open]",
                ) ?? [],
              ).map((el) => el.id),
            }),
          );
          sessionStorage.setItem("iir-essay-resume", "true");
        } catch {}
    };
    const restore = () => {
      try {
        if (sessionStorage.getItem("iir-essay-resume") !== "true") return;
        const saved = JSON.parse(
          sessionStorage.getItem("iir-essay-return") ?? "null",
        );
        for (const id of saved?.openDetails ?? []) {
          const detail = document.getElementById(id);
          if (detail instanceof HTMLDetailsElement) detail.open = true;
        }
        const motion = JSON.parse(
          sessionStorage.getItem("iir-motion-return") ?? "null",
        );
        if (motion?.id === "motion-china") {
          const figure = document.getElementById(motion.id);
          if (figure) {
            figure.scrollIntoView({ behavior: "instant", block: "start" });
            return;
          }
        }
        if (
          !saved ||
          (location.hash &&
            decodeURIComponent(location.hash.slice(1)) !== saved.beat)
        )
          return;
        const target = document.getElementById(saved.anchor);
        if (target) {
          for (
            let parent = target.parentElement;
            parent;
            parent = parent.parentElement
          )
            if (parent instanceof HTMLDetailsElement) parent.open = true;
          restoredAnchor.current = saved.anchor;
          returnPoint.current = { id: saved.anchor, offset: saved.offset };
          if (root.current) root.current.dataset.positionManaged = "true";
          passage.current = { id: saved.anchor, offset: saved.offset };
          window.scrollBy({
            top: target.getBoundingClientRect().top - saved.offset,
            behavior: "instant",
          });
          sessionStorage.removeItem("iir-essay-resume");
        }
      } catch {}
    };
    const releaseAnchor = () => {
      returnPoint.current = null;
      restoredAnchor.current = null;
    };
    const releaseByKey = (event: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        releaseAnchor();
    };
    window.addEventListener("wheel", releaseAnchor, { passive: true });
    window.addEventListener("touchmove", releaseAnchor, { passive: true });
    window.addEventListener("keydown", releaseByKey);
    const afterFonts = () => {
      if (alive)
        requestAnimationFrame(() => {
          if (alive) restore();
        });
    };
    document.fonts.ready.then(afterFonts);
    const settleMotion = () => {
      const point = returnPoint.current;
      if (!point) return;
      const target = document.getElementById(point.id);
      if (target)
        window.scrollBy({
          top: target.getBoundingClientRect().top - point.offset,
          behavior: "instant",
        });
    };
    window.addEventListener("iir:motion-layout", settleMotion);
    document.fonts.addEventListener("loadingdone", settleMotion);
    window.addEventListener("pageshow", afterFonts);
    root.current?.addEventListener("click", save);
    const el = root.current;
    return () => {
      alive = false;
      window.removeEventListener("wheel", releaseAnchor);
      window.removeEventListener("touchmove", releaseAnchor);
      window.removeEventListener("keydown", releaseByKey);
      el?.removeEventListener("click", save);
      window.removeEventListener("pageshow", afterFonts);
      window.removeEventListener("iir:motion-layout", settleMotion);
      document.fonts.removeEventListener("loadingdone", settleMotion);
    };
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
    let passagePositions: { el: HTMLElement; top: number }[][] = [];
    const hero = element.querySelector<HTMLElement>(".hero-atlas");
    let heroTravel = "";
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
        passagePositions = beats.map((beat) =>
          Array.from(
            beat.querySelectorAll<HTMLElement>("[data-reading-passage]"),
          )
            .filter((el) => el.getClientRects().length > 0)
            .map((el) => ({ el, top: el.getBoundingClientRect().top + y })),
        );
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
      const activeBeat = beats[index];
      const closestRecord = passagePositions[index]
        ?.filter((p) => p.top <= axis)
        .at(-1);
      const closest = closestRecord?.el;
      const anchor =
        (restoredAnchor.current
          ? document.getElementById(restoredAnchor.current)
          : null) ??
        closest ??
        activeBeat;
      passage.current = {
        id: anchor.id,
        offset:
          anchor === activeBeat
            ? pos.top - y
            : closestRecord?.el === anchor
              ? closestRecord.top - y
              : anchor.getBoundingClientRect().top,
      };
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
      // Keep scroll-only state out of inherited main-level CSS variables.
      // The former shared SVG layers no longer exist; only the hero still uses local parallax.
      const travel = `${reduced ? 0 : Math.min(y * 0.08, 40)}px`;
      if (hero && heroTravel !== travel) {
        hero.style.setProperty("--hero-travel", travel);
        heroTravel = travel;
      }
      const displayIndex = motionScene.current
        ? scenes.findIndex((s) => s.id === motionScene.current)
        : index;
      const visibleIndex = displayIndex < 0 ? index : displayIndex;
      if (element!.dataset.scene !== scenes[visibleIndex].id)
        element!.dataset.scene = scenes[visibleIndex].id;
      const motion = reduced ? "reduced" : "full";
      if (element!.dataset.motion !== motion) element!.dataset.motion = motion;
      if (progressBar) progressBar.value = clamp(y / maximum);
      if (previous !== visibleIndex) {
        previous = visibleIndex;
        setActive(visibleIndex);
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
    let requested = location.hash
      ? decodeURIComponent(location.hash.slice(1))
      : (new URLSearchParams(location.search).get("scene") ?? "");
    if (
      !requested ||
      sessionStorage.getItem("iir-essay-resume") === "true" ||
      returnPoint.current
    )
      return;
    let frame = 0,
      live = true;
    const settle = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!live || returnPoint.current) return;
          const target = document.getElementById(requested);
          if (!target) return;
          let parent = target.parentElement;
          while (parent) {
            if (parent instanceof HTMLDetailsElement) parent.open = true;
            parent = parent.parentElement;
          }
          target.scrollIntoView({ behavior: "instant", block: "start" });
        });
      });
    };
    const stop = () => {
      live = false;
      cancelAnimationFrame(frame);
    };
    for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
      window.addEventListener(type, stop, { once: true, passive: true });
    const hashChange = () => {
      requested = decodeURIComponent(location.hash.slice(1));
      live = true;
      settle();
    };
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("iir:scene-layout", settle);
    document.fonts.ready.then(settle);
    document.fonts.addEventListener("loadingdone", settle);
    settle();
    return () => {
      stop();
      window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("iir:scene-layout", settle);
      document.fonts.removeEventListener("loadingdone", settle);
      for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
        window.removeEventListener(type, stop);
    };
  }, []);
  return (
    <Context.Provider value={{ scene: scenes[active], scenes }}>
      <main
        id="main"
        className="research-essay"
        data-motion={reduced ? "reduced" : "full"}
        ref={root}
      >
        {children}
      </main>
    </Context.Provider>
  );
}
export function StoryNavigation() {
  const { scene, scenes } = useContext(Context);
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
          <span>
            {scene ? storyVisuals[scene.id].heading[lang] : chapter.short[lang]}
          </span>
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
            {storyChapters.map((item) => (
              <div key={item.id} className="story-menu-chapter">
                <a
                  href={`#${item.anchor}`}
                  aria-current={chapter.id === item.id ? "location" : undefined}
                  onClick={() => menu.current?.removeAttribute("open")}
                >
                  <span className="mono">{item.number}</span>
                  <span>{item.title[lang]}</span>
                </a>
                {scenes
                  .filter((beat) => item.beats.includes(beat.id))
                  .map((beat) => (
                    <a
                      className="story-menu-case"
                      key={beat.id}
                      href={`#${beat.id}`}
                      aria-current={
                        scene?.id === beat.id ? "location" : undefined
                      }
                      onClick={() => menu.current?.removeAttribute("open")}
                    >
                      {storyVisuals[beat.id].heading[lang]}
                    </a>
                  ))}
              </div>
            ))}
            <Link href="/archive">
              {lang === "ko" ? "연구 아카이브" : "Research archive"} ↗
            </Link>
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
