"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { clamp, loadMotion, nearScene } from "./runtime";

type Driver = { seek: (value: number) => void; replay: () => void };
/** CSS owns the stage. Only measured reading boundaries advance the animation. */
export function useSceneScroll(
  root: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  stepsSelector: string,
  count: number,
  update: (value: number) => void,
  lang: string,
  reduced: boolean,
) {
  const callback = useRef(update);
  callback.current = update;
  const progress = useRef(0);
  const driver = useRef<Driver | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = root.current,
      visual = stage.current;
    if (!el || !visual) return;
    const body = visual.parentElement!;
    const steps = Array.from(el.querySelectorAll<HTMLElement>(stepsSelector));
    let bounds: number[] = [],
      alive = true,
      frame = 0;
    let destroyTrigger = () => {},
      stopReplay = () => {};
    const y = () => window.scrollY;
    let lastPaint = -1,
      lastActive = false;
    const paint = (v: number) => {
      const next = clamp(v);
      const inView = !!(
        bounds.length &&
        y() >= bounds[0] - 1 &&
        y() <= bounds[count] + 1
      );
      if (Math.abs(next - lastPaint) < 0.000001 && inView === lastActive)
        return;
      lastPaint = next;
      lastActive = inView;
      progress.current = next;
      callback.current(progress.current);
      const active = Math.min(count - 1, Math.floor(progress.current * count));
      steps.forEach((step, i) => {
        step.classList.toggle("is-current", i === active);
        if (i === active) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
      });
      const inScene =
        bounds.length && y() >= bounds[0] - 1 && y() <= bounds[count] + 1;
      el.dataset.sceneActive = String(!!inScene);
      if (el.id === "motion-china")
        window.dispatchEvent(
          new CustomEvent("iir:motion-scene", {
            detail: { beat: inScene ? steps[active]?.dataset.beat : null },
          }),
        );
    };
    const read = () => {
      if (!bounds.length) return;
      let i = 0;
      while (i < count - 1 && y() >= bounds[i + 1]) i++;
      paint(
        (i +
          clamp((y() - bounds[i]) / Math.max(1, bounds[i + 1] - bounds[i]))) /
          count,
      );
    };
    const target = (v: number) => {
      const value = clamp(v),
        i = Math.min(count - 1, Math.floor(value * count));
      return bounds[i] + (value * count - i) * (bounds[i + 1] - bounds[i]);
    };
    const seek = (v: number) => {
      stopReplay();
      if (!bounds.length) return;
      window.scrollTo({ top: target(v), behavior: "instant" });
      paint(v);
    };
    const layout = (keep = false) => {
      if (!alive) return;
      const wasActive =
        bounds.length && y() >= bounds[0] && y() <= bounds[count];
      const saved = progress.current;
      const nav = document.querySelector<HTMLElement>(".story-navigation");
      // CSS zoom changes rendered dimensions while inline style values stay in layout pixels.
      const zoom =
        parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const top = (nav?.getBoundingClientRect().height ?? 56) + 12;
      const available = Math.max(
        180,
        (window.visualViewport?.height ?? innerHeight) - top - 16,
      );
      const wide = el.clientWidth >= 880 && available >= 440;
      const height = wide
        ? Math.min(available, 780)
        : Math.min(300, available * 0.34);
      el.dataset.sceneLayout = wide ? "wide" : "compact";
      el.style.setProperty("--scene-top", `${top / zoom}px`);
      el.style.setProperty("--scene-stage-height", `${height / zoom}px`);
      el.style.setProperty(
        "--scene-step-min",
        `${(wide ? Math.max(300, available * 0.55) : 0) / zoom}px`,
      );
      el.style.setProperty(
        "--scene-last-min",
        `${(wide ? height + 160 : 160) / zoom}px`,
      );
      const line = wide ? top + available * 0.35 : top + height + 16;
      el.style.setProperty("--scene-reading-line", `${line}px`);
      bounds = steps.map(
        (step) => step.getBoundingClientRect().top + y() - line,
      );
      const start = body.getBoundingClientRect().top + y() - top;
      bounds[0] = start;
      for (let i = 1; i < count; i++)
        bounds[i] = Math.max(bounds[i], bounds[i - 1] + 80);
      const release = body.getBoundingClientRect().bottom + y() - height - top;
      bounds.push(Math.max(bounds[count - 1] + 80, release));
      el.dataset.sceneStart = String(bounds[0]);
      el.dataset.sceneEnd = String(bounds[count]);
      if (keep && wasActive)
        window.scrollTo({ top: target(saved), behavior: "instant" });
      read();
      window.dispatchEvent(new Event("iir:scene-layout"));
    };
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          layout();
        });
    };
    const resize = () => layout(true);
    layout();
    const observer = new ResizeObserver(schedule);
    observer.observe(body);
    if (document.querySelector(".story-navigation"))
      observer.observe(document.querySelector(".story-navigation")!);
    window.addEventListener("resize", resize);
    window.addEventListener("iir:motion-layout", schedule);
    el.addEventListener("toggle", schedule, true);
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    // Native reading works before the engine loads and in reduced-motion mode.
    const nativeScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          read();
        });
    };
    window.addEventListener("scroll", nativeScroll, { passive: true });
    const stopWatching = reduced
      ? () => {}
      : nearScene(el, () => {
          loadMotion()
            .then(({ ScrollTrigger }) => {
              if (!alive) return;
              const trigger = ScrollTrigger.create({
                trigger: body,
                start: () => bounds[0],
                end: () => bounds[count],
                onUpdate: read,
                onRefresh: () => layout(),
              });
              destroyTrigger = () => trigger.kill();
            })
            .catch(() => {});
        });
    driver.current = {
      seek,
      replay: () => {
        stopReplay();
        if (reduced || !bounds.length) return;
        const i = Math.min(count - 1, Math.floor(progress.current * count));
        const from = (i + 0.03) / count,
          to = (i + 0.98) / count;
        seek(from);
        loadMotion().then(({ gsap }) => {
          if (!alive) return;
          const state = { value: from };
          const tween = gsap.to(state, {
            value: to,
            duration: 2.4,
            ease: "none",
            onUpdate: () => {
              window.scrollTo({
                top: target(state.value),
                behavior: "instant",
              });
              paint(state.value);
            },
          });
          stopReplay = () => tween.kill();
        });
      },
    };
    const interrupt = () => stopReplay();
    for (const type of [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
      "iir:scene-interrupt",
    ])
      window.addEventListener(type, interrupt, { passive: true });
    const save = (e: MouseEvent) => {
      if (
        el.id !== "motion-china" ||
        !(e.target as Element).closest('a[href*="/reports/"]')
      )
        return;
      try {
        sessionStorage.setItem(
          "iir-motion-return",
          JSON.stringify({
            id: el.id,
            progress: progress.current,
            stageOffset: visual.getBoundingClientRect().top,
            beat: steps[
              Math.min(count - 1, Math.floor(progress.current * count))
            ]?.dataset.beat,
          }),
        );
      } catch {}
    };
    el.addEventListener("click", save);
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("iir-motion-return") ?? "null",
      );
      if (
        saved?.id === el.id &&
        sessionStorage.getItem("iir-essay-resume") === "true"
      ) {
        document.fonts.ready.then(() =>
          requestAnimationFrame(() => {
            if (alive) {
              layout();
              seek(saved.progress);
              sessionStorage.removeItem("iir-motion-return");
              sessionStorage.removeItem("iir-essay-resume");
            }
          }),
        );
      }
    } catch {}
    setReady(true);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      stopReplay();
      stopWatching();
      destroyTrigger();
      observer.disconnect();
      window.removeEventListener("scroll", nativeScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("iir:motion-layout", schedule);
      el.removeEventListener("toggle", schedule, true);
      document.fonts.removeEventListener("loadingdone", schedule);
      el.removeEventListener("click", save);
      for (const type of [
        "wheel",
        "touchstart",
        "pointerdown",
        "keydown",
        "iir:scene-interrupt",
      ])
        window.removeEventListener(type, interrupt);
      if (el.id === "motion-china")
        window.dispatchEvent(
          new CustomEvent("iir:motion-scene", { detail: { beat: null } }),
        );
      driver.current = null;
    };
  }, [root, stage, stepsSelector, count, lang, reduced]);
  return {
    progress,
    ready,
    seek: (v: number) => driver.current?.seek(v),
    replay: () => driver.current?.replay(),
  };
}
