"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePreferences } from "./preferences";

export const chapters = [
  "question",
  "world",
  "corporations",
  "evidence",
  "framework",
  "synthesis",
  "index",
];
const Context = createContext({ current: 0 });
export const useNarrative = () => useContext(Context);
const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** One passive, on-demand animation frame for scroll, resize and pointer input. */
export function ScrollNarrative({ children }: { children: React.ReactNode }) {
  const main = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const positioned = useRef(false);
  const { reduced, lang } = usePreferences();
  useEffect(() => {
    const root = main.current;
    if (!root) return;
    const sections = chapters
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => Boolean(e));
    const steps = [...root.querySelectorAll<HTMLElement>("[data-scroll-step]")];
    let frame = 0,
      alive = true,
      lastChapter = -1,
      lastStep = -1;
    let dirty = true;
    let viewport = innerHeight,
      maximum = 0;
    let positions: { element: HTMLElement; top: number; height: number }[] = [];
    let stepPositions: { element: HTMLElement; top: number; height: number }[] =
      [];
    let pointer: { element: HTMLElement; x: number; y: number } | null = null;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduced || motion.matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    root.dataset.enhanced = reduce ? "false" : "true";
    const paint = () => {
      frame = 0;
      if (!alive || document.hidden) return;
      const y = scrollY;
      if (dirty) {
        viewport = innerHeight;
        maximum = document.documentElement.scrollHeight - viewport;
        const measure = (element: HTMLElement) => {
          const rect = element.getBoundingClientRect();
          return { element, top: rect.top + y, height: rect.height };
        };
        positions = sections.map(measure);
        stepPositions = steps.map(measure);
        dirty = false;
      }
      const total = maximum > 0 ? clamp(y / maximum) : 0;
      // Static document geometry is invalidated by resize/fonts/language, not by scrolling.
      const geometry = positions.map(({ element, top, height }) => ({
        element,
        rect: { top: top - y, height },
      }));
      const stepGeometry = stepPositions.map(({ element, top, height }) => ({
        element,
        rect: { top: top - y, height },
      }));
      const axis = viewport * 0.35;
      let chapter = 0;
      geometry.forEach(({ rect }, i) => {
        if (rect.top <= axis) chapter = i;
      });
      if (maximum > 0 && scrollY >= maximum - 2) chapter = sections.length - 1;
      const pointerRect = pointer?.element.getBoundingClientRect();
      // Geometry reads are complete; only custom properties/state change below.
      root.style.setProperty("--reading-progress", String(total));
      root.dataset.chapter = chapters[chapter];
      stepGeometry.forEach(({ element, rect }) => {
        element.style.setProperty(
          "--step-progress",
          clamp(
            (viewport * 0.9 - rect.top) /
              Math.max(1, rect.height + viewport * 0.2),
          ).toFixed(4),
        );
      });
      geometry.forEach(({ element, rect }) => {
        const progress = clamp(
          (viewport - rect.top) / Math.max(1, rect.height + viewport),
        );
        element.style.setProperty("--scene-progress", progress.toFixed(4));
        element.style.setProperty(
          "--scene-fill",
          `${(progress * 100).toFixed(2)}%`,
        );
        if (element.id === "framework") {
          const step = Math.min(
            3,
            Math.floor(
              clamp(
                (viewport * 0.75 - rect.top) / Math.max(1, rect.height * 0.8),
              ) * 4,
            ),
          );
          if (step !== lastStep) {
            lastStep = step;
            root.dispatchEvent(
              new CustomEvent("iir:flow-step", { detail: step, bubbles: true }),
            );
          }
        }
      });
      if (chapter !== lastChapter) {
        lastChapter = chapter;
        setCurrent(chapter);
      }
      if (pointer && pointerRect && !reduce && fine.matches) {
        const x = clamp(
          (pointer.x - pointerRect.left) / Math.max(1, pointerRect.width),
        );
        const y = clamp(
          (pointer.y - pointerRect.top) / Math.max(1, pointerRect.height),
        );
        pointer.element.style.setProperty(
          "--pointer-x",
          `${((x - 0.5) * 12).toFixed(2)}px`,
        );
        pointer.element.style.setProperty(
          "--pointer-y",
          `${((y - 0.5) * 12).toFixed(2)}px`,
        );
        pointer.element.style.setProperty(
          "--pointer-left",
          `${(x * 100).toFixed(2)}%`,
        );
        pointer.element.style.setProperty(
          "--pointer-top",
          `${(y * 100).toFixed(2)}%`,
        );
      }
    };
    const schedule = () => {
      if (!frame && alive && !document.hidden)
        frame = requestAnimationFrame(paint);
    };
    const invalidate = () => {
      dirty = true;
      schedule();
    };
    const resetPointer = () => {
      if (pointer) {
        pointer.element.style.setProperty("--pointer-x", "0px");
        pointer.element.style.setProperty("--pointer-y", "0px");
        delete pointer.element.dataset.pointing;
      }
      pointer = null;
    };
    const move = (event: PointerEvent) => {
      if (reduce || !fine.matches || event.pointerType === "touch") return;
      const element =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-pointer-reactive]")
          : null;
      if (pointer?.element !== element) resetPointer();
      if (element) {
        pointer = { element, x: event.clientX, y: event.clientY };
        element.dataset.pointing = "true";
        schedule();
      }
    };
    const visible = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        resetPointer();
      } else schedule();
    };
    const changeMotion = () => {
      reduce = reduced || motion.matches;
      root.dataset.enhanced = reduce ? "false" : "true";
      resetPointer();
      schedule();
    };
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(invalidate);
    observer?.observe(root);
    sections.forEach((section) => observer?.observe(section));
    steps.forEach((step) => observer?.observe(step));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    window.addEventListener("pageshow", invalidate);
    document.addEventListener("visibilitychange", visible);
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", resetPointer);
    motion.addEventListener("change", changeMotion);
    document.fonts?.ready.then(() => {
      if (alive) invalidate();
    });
    const query = new URLSearchParams(location.search).get("scene");
    if (!positioned.current && query && chapters.includes(query))
      document.getElementById(query)?.scrollIntoView({ behavior: "instant" });
    positioned.current = true;
    schedule();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resetPointer();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("pageshow", invalidate);
      document.removeEventListener("visibilitychange", visible);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", resetPointer);
      motion.removeEventListener("change", changeMotion);
      root.dataset.enhanced = "false";
    };
  }, [reduced, lang]);
  return (
    <Context.Provider value={{ current }}>
      <main id="main" className="continuous-narrative" ref={main}>
        <div className="reading-progress-line" aria-hidden="true" />
        {children}
      </main>
    </Context.Provider>
  );
}
