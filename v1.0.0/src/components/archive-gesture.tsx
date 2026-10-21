"use client";
import { useEffect } from "react";
// Deliberate horizontal input opens the inline archive. Vertical scroll stays native.
export function ArchiveGesture() {
  useEffect(() => {
    let x = 0,
      y = 0,
      time = 0,
      returnY: number | null = null;
    const excluded = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(
        target.closest(
          'a,button,input,select,textarea,[contenteditable="true"],.shelf-track,.reader-layout',
        ),
      );
    const open = () => {
      const target = document.getElementById("index");
      if (!target) return;
      returnY = window.scrollY;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target
        .querySelector<HTMLAnchorElement>(".folder")
        ?.focus({ preventScroll: true });
    };
    const wheel = (event: WheelEvent) => {
      if (excluded(event.target) || window.getSelection()?.toString()) return;
      if (event.timeStamp - time > 100) {
        x = 0;
        y = 0;
      }
      time = event.timeStamp;
      const scale =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      x += event.deltaX * scale;
      y += event.deltaY * scale;
      if (
        Math.abs(x) > 36 &&
        Math.abs(x) > 1.35 * Math.abs(y) &&
        !document.getElementById("index")?.contains(event.target as Node)
      ) {
        if (event.cancelable) event.preventDefault();
        open();
        x = 0;
        y = 0;
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key.toLowerCase() === "a" && !excluded(event.target)) {
        event.preventDefault();
        open();
      }
      if (event.key === "Escape" && returnY !== null) {
        window.scrollTo({ top: returnY, behavior: "smooth" });
        document
          .getElementById("archive-entry")
          ?.focus({ preventScroll: true });
        returnY = null;
      }
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keyboard);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keyboard);
    };
  }, []);
  return null;
}
