"use client";
import { useEffect } from "react";
// Deliberate keyboard shortcut only. Wheel and touch scrolling remain native.
export function ArchiveGesture() {
  useEffect(() => {
    let returnY: number | null = null;
    const excluded = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(
        target.closest(
          'a,button,input,select,textarea,[contenteditable="true"],.shelf-track,.reader-layout',
        ),
      );
    const keyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing)
        return;
      if (
        event.key.toLowerCase() === "a" &&
        !excluded(event.target) &&
        !window.getSelection()?.toString()
      ) {
        const target = document.getElementById("index");
        if (!target) return;
        event.preventDefault();
        returnY = window.scrollY;
        const reduce =
          document.documentElement.dataset.motion === "reduced" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: reduce ? "instant" : "smooth",
          block: "start",
        });
        target
          .querySelector<HTMLAnchorElement>(".folder")
          ?.focus({ preventScroll: true });
      }
      if (event.key === "Escape" && returnY !== null) {
        const reduce =
          document.documentElement.dataset.motion === "reduced" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({
          top: returnY,
          behavior: reduce ? "instant" : "smooth",
        });
        document
          .getElementById("archive-entry")
          ?.focus({ preventScroll: true });
        returnY = null;
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, []);
  return null;
}
