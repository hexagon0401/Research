"use client";
import { useRef, useState, type RefObject } from "react";
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
      snapshot.current.replaceChildren(clone);
      dialog.current.showModal();
    });
  };
  return (
    <>
      <button className="diagram-expand" ref={button} onClick={open}>
        {lang === "ko" ? "그림 크게 보기" : "Enlarge diagram"} ↗
      </button>
      {mounted &&
        createPortal(
          <dialog
            className="diagram-dialog"
            ref={dialog}
            aria-label={caption}
            onClose={() => button.current?.focus({ preventScroll: true })}
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
