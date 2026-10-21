"use client";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "@/content/repository";
import { usePreferences } from "./preferences";
import { Arrow } from "./icons";
const spineLabels = [
  { en: "Resilience", ko: "기업의 복원력" },
  { en: "Technology", ko: "기술 경쟁우위" },
  { en: "Identity", ko: "사명과 책임" },
  { en: "Capability", ko: "국가의 역량" },
  { en: "Comparison", ko: "미중 비교" },
  { en: "Partnership", ko: "조건부 협력" },
];
export function Shelf({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const [opening, setOpening] = useState<number | null>(null);
  const { lang, reduced } = usePreferences();
  const router = useRouter();
  const shelf = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number; scroll: number } | null>(null);
  const dragging = useRef(false);
  const p = projects[active];
  useEffect(() => {
    try {
      const slug = sessionStorage.getItem("iir-active-folder");
      const index = projects.findIndex((project) => project.slug === slug);
      if (index >= 0) setActive(index);
    } catch {}
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function cancelOpening() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOpening(null);
    shelf.current
      ?.querySelectorAll<HTMLAnchorElement>(".folder")
      [active]?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (opening === null) return;
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        setOpening(null);
        shelf.current
          ?.querySelectorAll<HTMLAnchorElement>(".folder")
          [opening]?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", cancel, true);
    return () => window.removeEventListener("keydown", cancel, true);
  }, [opening]);
  function select(index: number) {
    setActive(index);
    try {
      sessionStorage.setItem("iir-active-folder", projects[index].slug);
    } catch {}
  }
  function move(index: number, focus = false) {
    if (timer.current) clearTimeout(timer.current);
    setOpening(null);
    const i = (index + projects.length) % projects.length;
    select(i);
    const track = shelf.current;
    const link = track?.querySelectorAll<HTMLAnchorElement>(".folder")[i];
    if (track && link) {
      const left = link.offsetLeft - track.offsetLeft;
      track.scrollTo({
        left: Math.max(0, left - (track.clientWidth - link.clientWidth) / 2),
        behavior: reduced ? "instant" : "smooth",
      });
      if (focus) link.focus({ preventScroll: true });
    }
  }
  function open(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    select(index);
    if (
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    setOpening(index);
    router.prefetch(`/archive/${projects[index].slug}`);
    timer.current = setTimeout(() => {
      timer.current = null;
      router.push(`/archive/${projects[index].slug}`);
      setOpening(null);
    }, 360);
  }
  return (
    <div className={`shelf ${compact ? "compact" : ""}`}>
      <div className="shelf-heading">
        <div className="od-stack shelf-description">
          <span className="eyebrow">RESEARCH INDEX / 06</span>
          <h2>{lang === "ko" ? p.titleKo : p.title}</h2>
          <p>{lang === "ko" ? p.descriptionKo : p.description}</p>
        </div>
        <div className="shelf-count od-field">
          <span className="shelf-folio">
            {p.number}
            <span className="mono"> / 06</span>
          </span>
          <span>
            {lang === "ko"
              ? "작업계획 발췌 · 연구 주장 미검증"
              : "Planning excerpt · research claims unverified"}
          </span>
          <Link
            href={`/archive/${p.slug}`}
            onClick={(event) => open(event, active)}
          >
            {lang === "ko" ? "문서 열기" : "Open excerpt"} <Arrow diagonal />
          </Link>
        </div>
      </div>
      <div
        className="shelf-track"
        ref={shelf}
        role="region"
        aria-label={lang === "ko" ? "연구 폴더 서가" : "Research folder shelf"}
        onKeyDown={(e) => {
          if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            move(
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? projects.length - 1
                  : active + (e.key === "ArrowRight" ? 1 : -1),
              true,
            );
          }
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button === 0) {
            start.current = {
              x: e.clientX,
              y: e.clientY,
              scroll: e.currentTarget.scrollLeft,
            };
            dragging.current = false;
          }
        }}
        onPointerMove={(e) => {
          if (!start.current) return;
          const dx = e.clientX - start.current.x,
            dy = e.clientY - start.current.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > 1.35 * Math.abs(dy))
            dragging.current = true;
          if (dragging.current)
            e.currentTarget.scrollLeft = start.current.scroll - dx;
        }}
        onPointerUp={() => {
          start.current = null;
        }}
        onPointerCancel={() => {
          start.current = null;
          dragging.current = false;
        }}
        onPointerLeave={() => {
          start.current = null;
        }}
        onClickCapture={(e) => {
          if (dragging.current) {
            e.preventDefault();
            e.stopPropagation();
            dragging.current = false;
          }
        }}
      >
        {projects.map((project, i) => (
          <Link
            draggable={false}
            className={`folder ${i === active ? "selected" : ""} ${opening === i ? "opening" : ""}`}
            key={project.slug}
            href={`/archive/${project.slug}`}
            onClick={(event) => open(event, i)}
            onMouseEnter={() => {
              if (
                document.activeElement?.closest(".shelf-track") == null &&
                opening === null
              )
                select(i);
            }}
            onFocus={() => select(i)}
          >
            <span className="folder-paper" aria-hidden="true">
              <span />
            </span>
            <span className="folder-cover od-stack">
              <span className="folder-tab" aria-hidden="true" />
              <span className="folder-number mono">{project.number} / IIR</span>
              <span className="folder-title">
                {lang === "ko" ? spineLabels[i].ko : spineLabels[i].en}
              </span>
              <span className="folder-meta mono">
                {project.year} · {lang === "ko" ? "연구 계획" : "RESEARCH PLAN"}
              </span>
              <span className="folder-arrow" aria-hidden="true">
                <Arrow diagonal />
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="shelf-bottom">
        <div className="shelf-hint od-field">
          <span className="mono">
            {lang === "ko"
              ? "드래그 / 스와이프 / 방향키로 탐색"
              : "DRAG / SWIPE / ARROW KEYS TO EXPLORE"}
          </span>
          <span className="shelf-opening" role="status">
            {opening !== null
              ? lang === "ko"
                ? "문서를 여는 중 · Esc로 취소"
                : "Opening excerpt · Esc to cancel"
              : lang === "ko"
                ? "폴더를 선택해 발췌문과 근거를 확인하세요"
                : "Choose a folder to trace its source"}
          </span>
        </div>
        <div className="od-row">
          {opening !== null && (
            <button
              onClick={cancelOpening}
              aria-label={lang === "ko" ? "열기 취소" : "Cancel opening"}
            >
              ×
            </button>
          )}
          <button
            onClick={() => move(active - 1, true)}
            aria-label={lang === "ko" ? "이전 폴더" : "Previous folder"}
          >
            ←
          </button>
          <button
            onClick={() => move(active + 1, true)}
            aria-label={lang === "ko" ? "다음 폴더" : "Next folder"}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
