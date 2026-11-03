"use client";
import { useState } from "react";
import { usePreferences } from "./preferences";
/** Uses catalogue publication year; supplies no invented DOI/publisher/access date. */
export function CopyCitation({ text }: { text: string }) {
  const { lang } = usePreferences();
  const [state, setState] = useState<"idle" | "copied" | "fallback">("idle");
  return (
    <div className="citation-control">
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState("copied");
          } catch {
            setState("fallback");
          }
        }}
      >
        {lang === "ko" ? "인용문 복사" : "Copy citation"}
      </button>
      <span role="status">
        {state === "copied"
          ? lang === "ko"
            ? "복사했습니다."
            : "Copied."
          : ""}
      </span>
      {state === "fallback" && (
        <label>
          {lang === "ko" ? "선택해서 복사하세요" : "Select and copy"}
          <textarea
            readOnly
            value={text}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
export function PrintBrief() {
  const { lang } = usePreferences();
  return (
    <button className="print-brief-button" onClick={() => window.print()}>
      {lang === "ko" ? "검토 요약 인쇄" : "Print reviewer brief"}
    </button>
  );
}
