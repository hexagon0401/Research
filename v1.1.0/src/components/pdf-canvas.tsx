"use client";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export default function PdfCanvas({ url, title }: { url: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(600);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    let alive = true;
    let destroy: (() => void) | undefined;
    import("pdfjs-dist").then((pdfjs) => {
      if (!alive) return;
      pdfjs.GlobalWorkerOptions.workerSrc = `/vendor/pdfjs/${pdfjs.version}/pdf.worker.min.mjs`;
      const assetRoot = `/vendor/pdfjs/${pdfjs.version}/`;
      const loading = pdfjs.getDocument({ url, isEvalSupported: false, enableXfa: false, cMapUrl: `${assetRoot}cmaps/`, cMapPacked: true, standardFontDataUrl: `${assetRoot}standard_fonts/`, wasmUrl: `${assetRoot}wasm/` });
      destroy = () => { void loading.destroy(); };
      loading.promise.then((pdf) => {
        if (alive) setDocument(pdf);
      }).catch(() => { if (alive) { setError("PDF를 불러오지 못했습니다. 아래 링크로 다운로드할 수 있습니다. / Unable to load PDF. Use the download link below."); setBusy(false); } });
    }).catch(() => { if (alive) { setError("PDF viewer unavailable. PDF 다운로드를 이용해 주세요."); setBusy(false); } });
    return () => { alive = false; destroy?.(); };
  }, [url]);
  useEffect(() => {
    if (!box.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200, entry.contentRect.width - 24)));
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!document || !canvas.current) return;
    let alive = true;
    let task: RenderTask | undefined;
    setBusy(true);
    document.getPage(page).then(async (pdfPage) => {
      if (!alive || !canvas.current) return;
      const original = pdfPage.getViewport({ scale: 1 });
      const scale = Math.min(1.6, width / original.width) * zoom;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const viewport = pdfPage.getViewport({ scale: scale * ratio });
      const target = canvas.current;
      target.width = Math.ceil(viewport.width);
      target.height = Math.ceil(viewport.height);
      target.style.width = `${viewport.width / ratio}px`;
      target.style.height = `${viewport.height / ratio}px`;
      task = pdfPage.render({ canvas: target, viewport });
      await task.promise;
      if (alive) { setBusy(false); setError(""); }
    }).catch((cause) => {
      if (alive && cause?.name !== "RenderingCancelledException") { setError("페이지를 표시하지 못했습니다. PDF 다운로드를 이용해 주세요. / Unable to display this page."); setBusy(false); }
    });
    return () => { alive = false; task?.cancel(); };
  }, [document, page, zoom, width]);
  return (
    <div className="pdf-viewer" ref={box}>
      <div className="pdf-controls">
        <button disabled={!document || page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous PDF page / 이전 쪽">←</button>
        <label>Page / 쪽 <input type="number" min="1" max={document?.numPages ?? 1} value={page} disabled={!document} onChange={(event) => setPage(Math.max(1, Math.min(document?.numPages ?? 1, Number(event.target.value) || 1)))} /></label>
        <span>/ {document?.numPages ?? "…"}</span>
        <button disabled={!document || page >= document.numPages} onClick={() => setPage(page + 1)} aria-label="Next PDF page / 다음 쪽">→</button>
        <button disabled={zoom <= .6} onClick={() => setZoom(Math.max(.6, zoom - .2))} aria-label="Zoom out / 축소">−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button disabled={zoom >= 2.2} onClick={() => setZoom(Math.min(2.2, zoom + .2))} aria-label="Zoom in / 확대">+</button>
        <button onClick={() => { if (globalThis.document.fullscreenElement) void globalThis.document.exitFullscreen(); else void box.current?.requestFullscreen?.().catch(() => setError("이 브라우저는 전체화면을 지원하지 않습니다. / Fullscreen unavailable.")); }}>⛶ <span>Fullscreen / 전체화면</span></button>
      </div>
      <p className="pdf-status" role="status" aria-live="polite">{error || (busy ? "Rendering page… / 쪽을 표시합니다." : `${page} / ${document?.numPages} · ${title}`)}</p>
      <div className="pdf-canvas-scroll" aria-busy={busy}><canvas ref={canvas} role="img" aria-label={`${title} · PDF page ${page}. The accessible full transcript is above.`} /></div>
      <a className="inline-link" href={url} download>PDF 다운로드 / Download PDF ↓</a>
    </div>
  );
}
