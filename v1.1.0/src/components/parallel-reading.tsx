"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Localized as L } from "./preferences";

export function ParallelReading({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState("parallel");
  const [enhanced, setEnhanced] = useState(false);
  const [compact, setCompact] = useState(false);
  const anchor = useRef<{ element: HTMLElement; fraction: number } | null>(
    null,
  );
  useLayoutEffect(() => {
    const saved = anchor.current;
    anchor.current = null;
    if (!saved || !document.contains(saved.element)) return;
    const after = saved.element.getBoundingClientRect();
    window.scrollTo({
      top: scrollY + after.top + after.height * saved.fraction - 140,
      behavior: "instant",
    });
  }, [language]);
  useEffect(() => {
    setEnhanced(true);
    const media = matchMedia("(max-width: 1099px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  function change(value: string) {
    if (value === language) return;
    // Keep native anchoring during initial font loading and fragment navigation;
    // take ownership only when the user changes the reading layout.
    if (root.current) root.current.dataset.positionManaged = "true";
    const pairs = [
      ...(root.current?.querySelectorAll<HTMLElement>("[data-reading-pair]") ??
        []),
    ];
    const selected = pairs.find((e) => e.getBoundingClientRect().bottom > 140);
    const before = selected?.getBoundingClientRect();
    const fraction = before
      ? Math.max(0, Math.min(1, (140 - before.top) / before.height))
      : 0;
    anchor.current =
      selected && before && before.top < 180
        ? { element: selected, fraction }
        : null;
    setLanguage(value);
  }
  return (
    <div
      ref={root}
      className="parallel-reading"
      data-language={language}
      data-enhanced={enhanced}
    >
      <div
        className="reading-toolbar"
        role="group"
        aria-label="Reading language"
      >
        <span>
          <L en="Reading language" ko="본문 언어" />
        </span>
        <button
          onClick={() => change("ko")}
          aria-pressed={
            language === "ko" || (compact && language === "parallel")
          }
        >
          한국어
        </button>
        <button onClick={() => change("en")} aria-pressed={language === "en"}>
          English
        </button>
        <button
          className="parallel-option"
          onClick={() => change("parallel")}
          aria-pressed={language === "parallel"}
        >
          <L en="Side by side" ko="나란히 읽기" />
        </button>
      </div>
      <div className="reading-column-heads" aria-hidden="true">
        <span>한국어 원문 전사</span>
        <span>English · editorial translation</span>
      </div>
      {children}
    </div>
  );
}
