"use client";
import { useEffect, useState, type RefObject } from "react";
type Engine = typeof import("@chenglou/pretext");
/** Load measurement only near a figure. Text and source links already exist in HTML. */
export function usePretext(ref: RefObject<HTMLElement | null>, enabled = true) {
  const [engine, setEngine] = useState<Engine | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let alive = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        import("@chenglou/pretext").then((module) => {
          if (alive) setEngine(module);
        });
      },
      { rootMargin: "800px" },
    );
    observer.observe(el);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [ref, enabled]);
  return engine;
}
