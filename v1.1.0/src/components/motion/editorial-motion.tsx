"use client";
import { useEffect } from "react";
import { usePreferences } from "../preferences";
/** Progressive decoration only. Text is always present, visible and copyable. */
export function EditorialMotion() {
  const { reduced, lang } = usePreferences();
  useEffect(() => {
    const groups = [
      ...document.querySelectorAll<HTMLElement>("[data-motion-reveal]"),
    ].filter((group) =>
      group.querySelector(
        "[data-emphasis]:not([data-em-static]), .core-thread, .unequal-mark",
      ),
    );
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (
      reduced ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData ||
      !window.IntersectionObserver
    ) {
      groups.forEach((group) => group.removeAttribute("data-em-armed"));
      return;
    }
    let timer = 0;
    let current: HTMLElement | undefined;
    const queue: HTMLElement[] = [];
    const complete = () => {
      groups.forEach((group) => {
        group.removeAttribute("data-em-armed");
        group.classList.remove("em-enter");
      });
      clearTimeout(timer);
      queue.length = 0;
    };
    const next = () => {
      current?.classList.remove("em-enter");
      current = queue.shift();
      if (!current) return;
      const rect = current.getBoundingClientRect();
      if (document.hidden || rect.bottom <= 0 || rect.top >= innerHeight) {
        current.removeAttribute("data-em-armed");
        next();
        return;
      }
      current.dataset.emSeen = "true";
      current.classList.add("em-enter");
      // Serialize one-shot decorations: only one editorial reveal in view at a time.
      timer = window.setTimeout(() => {
        current?.removeAttribute("data-em-armed");
        next();
      }, 920);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const group = entry.target as HTMLElement;
          observer.unobserve(group);
          if (group.dataset.emSeen) continue;
          queue.push(group);
        }
        if (!current && queue.length) next();
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    groups.forEach((group) => {
      if (!group.dataset.emSeen) {
        group.dataset.emArmed = "true";
        observer.observe(group);
      }
    });
    const hide = () => {
      if (document.hidden) complete();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", hide);
      complete();
    };
  }, [reduced, lang]);
  return null;
}
