"use client";
import { readAnchor } from "@/utils/read-anchor";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePreferences } from "./preferences";
import { storyChapters } from "@/visuals/story";
export function ReadingControls() {
  const { lang } = usePreferences();
  const [mode, setMode] = useState<"full" | "quick">("full");
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const control = useRef<HTMLElement>(null),
    help = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const main = control.current?.closest("main");
    if (!main) return;
    function revealHash() {
      const id = readAnchor(location.hash);
      const el = id ? document.getElementById(id) : null;
      for (let p = el?.parentElement; p; p = p.parentElement)
        if (p instanceof HTMLDetailsElement) p.open = true;
    }
    function sync() {
      const next =
        new URLSearchParams(location.search).get("mode") === "quick"
          ? "quick"
          : "full";
      main!.dataset.readingMode = next;
      main!
        .querySelectorAll<HTMLDetailsElement>(".chapter-reasoning")
        .forEach((d) => {
          d.open = next === "full";
        });
      main!
        .querySelectorAll<HTMLElement>(".chapter-opening-label")
        .forEach((label) => {
          if (next === "quick") {
            label.setAttribute("role", "heading");
            label.setAttribute("aria-level", "2");
          } else {
            label.removeAttribute("role");
            label.removeAttribute("aria-level");
          }
        });
      setMode(next);
      revealHash();
      window.dispatchEvent(new Event("resize"));
    }
    const opened = () => {
      revealHash();
      window.dispatchEvent(new Event("resize"));
    };
    const keys = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        (event.target as HTMLElement).closest(
          'input, textarea, select, [contenteditable="true"], [role="slider"], dialog',
        )
      )
        return;
      if (event.key === "?") {
        event.preventDefault();
        trigger.current = document.activeElement as HTMLElement;
        help.current?.showModal();
        return;
      }
      if (!["j", "k"].includes(event.key)) return;
      const chapters = [
        ...main!.querySelectorAll<HTMLElement>(".story-chapter"),
      ];
      const current = chapters.reduce(
        (n, el, i) => (el.getBoundingClientRect().top <= 140 ? i : n),
        -1,
      );
      const next =
        event.key === "j"
          ? Math.min(chapters.length - 1, current + 1)
          : Math.max(0, current - 1);
      if (!chapters[next]) return;
      event.preventDefault();
      const title =
        chapters[next].querySelector<HTMLElement>(".chapter-opening");
      title?.setAttribute("tabindex", "-1");
      title?.focus({ preventScroll: true });
      chapters[next].scrollIntoView({ block: "start", behavior: "instant" });
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", opened);
    window.addEventListener("iir:reading-mode", sync);
    window.addEventListener("keydown", keys);
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const u = new URL(a.href);
      if (
        u.origin !== location.origin ||
        u.pathname !== location.pathname ||
        !u.hash
      )
        return;
      const el = document.getElementById(readAnchor(u.hash));
      for (let p = el?.parentElement; p; p = p.parentElement)
        if (p instanceof HTMLDetailsElement) p.open = true;
    };
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", opened);
      window.removeEventListener("iir:reading-mode", sync);
      window.removeEventListener("keydown", keys);
      document.removeEventListener("click", click);
    };
  }, []);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (mode !== "quick") return;
    const main = control.current?.closest("main");
    if (!main) return;
    // Only count visible editorial overview content, never hidden full arguments.
    const text = [
      ...main.querySelectorAll<HTMLElement>(".chapter-quick, .source-guide"),
    ]
      .filter((e) => e.getClientRects().length)
      .map((e) => e.innerText)
      .join(" ");
    const segmenter = new Intl.Segmenter(lang, { granularity: "word" });
    setCount([...segmenter.segment(text)].filter((s) => s.isWordLike).length);
  }, [mode, lang]);
  const choose = (value: "quick" | "full") => {
    const url = new URL(location.href);
    url.searchParams.delete("mode");
    if (value === "quick") url.searchParams.set("mode", value);
    history.pushState(null, "", url);
    window.dispatchEvent(new Event("iir:reading-mode"));
  };
  return (
    <nav
      ref={control}
      className="reading-controls"
      aria-label={lang === "ko" ? "읽기 방식" : "Reading mode"}
    >
      <div>
        <button
          disabled={!ready}
          aria-pressed={mode === "full"}
          onClick={() => choose("full")}
        >
          {lang === "ko" ? "전체 읽기" : "Full read"}
        </button>
        <button
          disabled={!ready}
          aria-pressed={mode === "quick"}
          onClick={() => choose("quick")}
        >
          {lang === "ko" ? "빠른 읽기" : "Quick read"}
        </button>
      </div>
      <p>
        {lang === "ko"
          ? "여섯 장으로 개요를 읽고, 논증과 그림을 펼쳐 자세히 살펴본다."
          : "Read the six-chapter overview, then open the reasoning and diagrams."}
        {mode === "quick" && (
          <span className="quick-word-count">
            {" "}
            · {count.toLocaleString()}{" "}
            {lang === "ko"
              ? "어절 · 개요와 원문 안내"
              : "words · overview and source guide"}
          </span>
        )}
      </p>
      <button
        disabled={!ready}
        onClick={(e) => {
          trigger.current = e.currentTarget;
          help.current?.showModal();
        }}
      >
        {lang === "ko" ? "키보드 안내" : "Keyboard help"} <kbd>?</kbd>
      </button>
      <dialog
        ref={help}
        aria-labelledby="reading-help-title"
        className="reading-help"
        onClose={() => trigger.current?.focus()}
      >
        <h2 id="reading-help-title">
          {lang === "ko" ? "읽기 단축키" : "Reading shortcuts"}
        </h2>
        <p>
          <kbd>j</kbd> {lang === "ko" ? "다음 장" : "Next chapter"} ·{" "}
          <kbd>k</kbd> {lang === "ko" ? "이전 장" : "Previous chapter"} ·{" "}
          <kbd>Esc</kbd> {lang === "ko" ? "닫기" : "Close"}
        </p>
        <p>
          {lang === "ko"
            ? "입력창과 비교 도구에서는 단축키가 작동하지 않습니다."
            : "Shortcuts leave text fields and comparison controls alone."}
        </p>
        <button onClick={() => help.current?.close()}>
          {lang === "ko" ? "닫기" : "Close"}
        </button>
      </dialog>
    </nav>
  );
}
