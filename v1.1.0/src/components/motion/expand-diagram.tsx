"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { usePreferences } from "../preferences";
export function ExpandDiagram({
  target,
  caption,
}: {
  target: RefObject<HTMLElement | null>;
  caption: string;
}) {
  const { lang } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null),
    snapshot = useRef<HTMLDivElement>(null),
    button = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const observer = useRef<ResizeObserver | null>(null);
  const saved = useRef<{ overflow: string; y: number } | null>(null);
  const restore = () => {
    observer.current?.disconnect();
    if (saved.current) {
      document.documentElement.style.overflow = saved.current.overflow;
      window.scrollTo({ top: saved.current.y, behavior: "instant" });
      saved.current = null;
    }
    button.current?.focus({ preventScroll: true });
  };
  useEffect(
    () => () => {
      observer.current?.disconnect();
      if (saved.current) {
        document.documentElement.style.overflow = saved.current.overflow;
        saved.current = null;
      }
    },
    [],
  );
  const open = () => {
    window.dispatchEvent(new Event("iir:scene-interrupt"));
    setMounted(true);
    requestAnimationFrame(() => {
      if (!dialog.current || !snapshot.current || !target.current) return;
      const clone = target.current.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone.style.removeProperty("content-visibility");
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      clone.querySelectorAll("button,input,a").forEach((el) => {
        el.setAttribute("tabindex", "-1");
        el.setAttribute("inert", "");
      });
      const context = target.current.closest<HTMLElement>(".motion-story");
      if (context) {
        snapshot.current.className =
          "diagram-snapshot " +
          context.className
            .split(" ")
            .filter(
              (c) =>
                !["scroll-scene", "case-visual", "emphasis-visual"].includes(c),
            )
            .join(" ");
        Object.entries(context.dataset).forEach(
          ([k, v]) => (snapshot.current!.dataset[k] = v),
        );
      }
      snapshot.current.replaceChildren(clone);
      saved.current = {
        overflow: document.documentElement.style.overflow,
        y: scrollY,
      };
      document.documentElement.style.overflow = "hidden";
      dialog.current.showModal();
      const align = () => {
        const scale = Math.min(
          clone.clientWidth / 720,
          clone.clientHeight / 520,
        );
        clone
          .querySelectorAll<HTMLElement>("[data-canvas-x]")
          .forEach((label) => {
            label.style.left = `${(clone.clientWidth - 720 * scale) / 2 + Number(label.dataset.canvasX) * scale}px`;
            label.style.top = `${(clone.clientHeight - 520 * scale) / 2 + Number(label.dataset.canvasY) * scale}px`;
          });
      };
      observer.current?.disconnect();
      observer.current = new ResizeObserver(align);
      observer.current.observe(clone);
      align();
    });
  };
  return (
    <>
      <button className="diagram-expand" ref={button} onClick={open}>
        {lang === "ko" ? "그림 크게 보기" : "Enlarge diagram"}
        <span aria-hidden="true"> ＋</span>
      </button>
      {mounted &&
        createPortal(
          <dialog
            className="diagram-dialog"
            ref={dialog}
            aria-label={caption}
            onClose={restore}
          >
            <header>
              <h2>{caption}</h2>
              <button autoFocus onClick={() => dialog.current?.close()}>
                {lang === "ko" ? "닫기" : "Close"} ×
              </button>
            </header>
            <div
              ref={snapshot}
              className="diagram-snapshot"
              role="img"
              aria-label={caption}
            />
          </dialog>,
          document.body,
        )}
    </>
  );
}
