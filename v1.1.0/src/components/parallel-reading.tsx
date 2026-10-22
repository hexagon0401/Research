"use client";
import { useEffect, useRef, useState } from "react";
import { Localized as L } from "./preferences";

export function ParallelReading({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState("parallel");
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  function change(value: string) {
    const pairs = [...(root.current?.querySelectorAll<HTMLElement>("[data-reading-pair]") ?? [])];
    const selected = pairs.find((e) => e.getBoundingClientRect().bottom > 140);
    const offset = selected?.getBoundingClientRect().top ?? 0;
    setLanguage(value);
    requestAnimationFrame(() => {
      if (selected && document.contains(selected)) window.scrollBy({ top: selected.getBoundingClientRect().top - offset, behavior: "instant" });
    });
  }
  return (
    <div ref={root} className="parallel-reading" data-language={language} data-enhanced={enhanced}>
      <div className="reading-toolbar" role="group" aria-label="Reading language">
        <span><L en="Reading language" ko="본문 언어" /></span>
        <button onClick={() => change("ko")} aria-pressed={language === "ko"}>한국어</button>
        <button onClick={() => change("en")} aria-pressed={language === "en"}>English</button>
        <button className="parallel-option" onClick={() => change("parallel")} aria-pressed={language === "parallel"}><L en="Side by side" ko="나란히 읽기" /></button>
      </div>
      <div className="reading-column-heads" aria-hidden="true"><span>한국어 원문 전사</span><span>English · editorial translation</span></div>
      {children}
    </div>
  );
}
