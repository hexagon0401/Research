"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/content/repository";
import { usePreferences } from "./preferences";
import { Arrow } from "./icons";
export function Shelf({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const { lang } = usePreferences();
  const shelf = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; scroll: number } | null>(null);
  const dragging = useRef(false);
  const p = projects[active];
  function move(index: number, focus = false) {
    const i = (index + projects.length) % projects.length;
    setActive(i);
    const a = shelf.current?.querySelectorAll<HTMLAnchorElement>(".folder")[i];
    a?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
    if (focus) a?.focus({ preventScroll: true });
  }
  return (
    <div className={`shelf ${compact ? "compact" : ""}`}>
      <div className="shelf-heading">
        <div>
          <span className="eyebrow">RESEARCH INDEX / 06</span>
          <h2>{lang === "ko" ? p.titleKo : p.title}</h2>
          <p>{lang === "ko" ? p.descriptionKo : p.description}</p>
        </div>
        <div className="shelf-count">
          <span className="mono">{p.number} / 06</span>
          <span>
            {lang === "ko"
              ? "작업계획 발췌 · 원문 자료 미제공"
              : "Planning excerpt · underlying report pending"}
          </span>
          <Link href={`/archive/${p.slug}`}>
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
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            move(active + (e.key === "ArrowRight" ? 1 : -1), true);
          }
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") {
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
          if (dragging.current) {
            e.currentTarget.scrollLeft = start.current.scroll - dx;
          }
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
            dragging.current = false;
          }
        }}
      >
        {projects.map((project, i) => (
          <Link
            draggable={false}
            className={`folder ${i === active ? "selected" : ""}`}
            key={project.slug}
            href={`/archive/${project.slug}`}
            onMouseEnter={() => {
              if (document.activeElement?.closest(".shelf-track") == null)
                setActive(i);
            }}
            onFocus={() => setActive(i)}
          >
            <span className="folder-tab" />
            <span className="folder-number mono">{project.number}</span>
            <span className="folder-title">
              {lang === "ko" ? project.titleKo : project.short}
            </span>
            <span className="folder-meta mono">IIR / {project.year}</span>
            <span className="folder-arrow">
              <Arrow diagonal />
            </span>
          </Link>
        ))}
      </div>
      <div className="shelf-bottom">
        <span className="mono">
          {lang === "ko"
            ? "드래그 / 스와이프 / 방향키로 탐색"
            : "DRAG / SWIPE / ARROW KEYS TO EXPLORE"}
        </span>
        <div>
          <button
            onClick={() => move(active - 1, true)}
            aria-label="Previous folder"
          >
            ←
          </button>
          <button
            onClick={() => move(active + 1, true)}
            aria-label="Next folder"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
