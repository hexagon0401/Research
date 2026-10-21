"use client";
import { useRef, useState } from "react";
import { usePreferences } from "./preferences";
type Asset = {
  id: string;
  documentId: string;
  title: string;
  revision: string;
  kind: string;
  mimeType: string;
  byteSize: number;
  sha256: string;
};
export function OriginalFiles({ project }: { project: string }) {
  const { lang } = usePreferences();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [assets, setAssets] = useState<Asset[]>([]);
  const busy = useRef(false);
  async function load() {
    if (busy.current) return;
    busy.current = true;
    setState("loading");
    try {
      const response = await fetch(
        `/api/public/assets?project=${encodeURIComponent(project)}`,
        { cache: "no-store", signal: AbortSignal.timeout(10000) },
      );
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json();
      setAssets(data.assets ?? []);
      setState("ready");
    } catch {
      setState("error");
    } finally {
      busy.current = false;
    }
  }
  return (
    <div className="original-files">
      <button
        className="text-button"
        onClick={() => {
          if (!open) void load();
          setOpen(!open);
        }}
        aria-expanded={open}
        aria-controls={`originals-${project}`}
      >
        {lang === "ko" ? "원본 보기" : "View original files"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <noscript>
        <a className="inline-link" href={`/originals/${project}`}>
          Original files / 원본 파일 목록 ↗
        </a>
      </noscript>
      {open && (
        <section
          id={`originals-${project}`}
          className="original-files-panel"
          aria-label={lang === "ko" ? "원본 파일" : "Original files"}
        >
          <div role="status">
            {state === "loading"
              ? lang === "ko"
                ? "원본 목록을 확인하고 있습니다…"
                : "Checking available originals…"
              : state === "error"
                ? lang === "ko"
                  ? "원본 저장소에 연결하지 못했습니다. 본문은 계속 읽을 수 있습니다."
                  : "Original storage is unavailable. The research text remains readable."
                : assets.length === 0
                  ? lang === "ko"
                    ? "아직 공개 승인된 원본이 연결되지 않았습니다."
                    : "No approved original file has been connected yet."
                  : null}
          </div>
          {state === "error" && (
            <button className="text-button" onClick={() => void load()}>
              {lang === "ko" ? "다시 시도" : "Try again"}
            </button>
          )}
          {assets.map((a) => (
            <a
              key={a.id}
              className="original-file-link"
              href={`/api/public/assets/${encodeURIComponent(a.id)}/open`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>{a.title}</strong>
              <span>
                {a.documentId} · {a.revision} ·{" "}
                {a.kind === "reader_pdf"
                  ? lang === "ko"
                    ? "PDF 열람본"
                    : "PDF reading copy"
                  : lang === "ko"
                    ? "작성 원본"
                    : "Authoring original"}{" "}
                · {(a.byteSize / 1024 / 1024).toFixed(1)} MB
              </span>
              <span>
                {lang === "ko" ? "새 탭에서 열기 ↗" : "Open in a new tab ↗"}
              </span>
            </a>
          ))}
        </section>
      )}
    </div>
  );
}
