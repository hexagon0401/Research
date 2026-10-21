"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/content/repository";
import { projects, revision } from "@/content/repository";
import { usePreferences } from "./preferences";
import { Arrow } from "./icons";
export function Reader({ project: p }: { project: Project }) {
  const { lang } = usePreferences();
  const [readerLang, setReaderLang] = useState<"en" | "ko">("ko");
  const rail = useRef<HTMLElement>(null);
  const index = projects.findIndex((project) => project.slug === p.slug);
  const next = projects[(index + 1) % projects.length];
  return (
    <>
      <header className="reader-header section-shell">
        <Link href="/archive" className="back-link">
          ← {lang === "ko" ? "서가로 돌아가기" : "Back to the archive"}
        </Link>
        <div className="eyebrow">
          PLANNING EXCERPT {p.number} / {p.category.toUpperCase()}
        </div>
        <h1>{lang === "ko" ? p.titleKo : p.title}</h1>
        <div className="metadata-row">
          <span>HANDOFF-01 / {p.section}</span>
          <span>{lang === "ko" ? "계획 기준일" : "Plan dated"} 2026-10-21</span>
          <span>
            {lang === "ko" ? "수정본" : "Revision"} {revision}
          </span>
        </div>
        <div className="reader-tools">
          <span className="status-badge">
            {p.status === "hypothesis"
              ? lang === "ko"
                ? "가설 · 미검증"
                : "Hypothesis · unverified"
              : lang === "ko"
                ? "해석 / 정책 제안"
                : "Interpretation / proposal"}
          </span>
          <div className="language-switch" aria-label="Document language">
            <button
              aria-pressed={readerLang === "ko"}
              onClick={() => setReaderLang("ko")}
              lang="ko"
            >
              KO
            </button>
            <span>/</span>
            <button
              aria-pressed={readerLang === "en"}
              onClick={() => setReaderLang("en")}
              lang="en"
            >
              EN
            </button>
          </div>
          <span className="mono">
            {lang === "ko" ? "원본 PDF 미제공" : "ORIGINAL PDF NOT SUPPLIED"}
          </span>
        </div>
      </header>
      <div className="section-shell reader-layout">
        <article className="reader-body">
          <span className="eyebrow">
            {lang === "ko"
              ? "작업계획 원문 · 최종 연구 보고서 아님"
              : "PLANNING SOURCE · NOT A FINAL RESEARCH REPORT"}
          </span>
          <h2 lang="ko" style={{ marginTop: 20 }}>
            {p.titleKo}
          </h2>
          {readerLang === "en" && (
            <div className="callout" role="status" lang="en">
              <strong>Translation pending</strong>
              <p>
                No reviewed English translation is available. The Korean
                planning excerpt is preserved below; the English interface
                labels are editorial navigation text.
              </p>
            </div>
          )}
          {p.paragraphs.map((paragraph) => (
            <section
              key={paragraph.id}
              className="reader-paragraph"
              id={paragraph.id}
            >
              <a className="paragraph-anchor" href={`#${paragraph.id}`}>
                {paragraph.id} / KO ORIGINAL
              </a>
              <p lang="ko">{paragraph.ko}</p>
              <details className="paragraph-summary">
                <summary>
                  {lang === "ko" ? "문단 요약 보기" : "Show paragraph summary"}{" "}
                  <span className="mono">KO · EDITORIAL SUMMARY</span>
                </summary>
                <p lang="ko">{paragraph.summaryKo}</p>
              </details>
              <button
                className="reader-citation"
                onClick={() => {
                  rail.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  rail.current?.focus({ preventScroll: true });
                }}
              >
                <span className="mono">[{p.claim}]</span>
                {lang === "ko"
                  ? "출처와 검증 상태 보기"
                  : "Inspect provenance & evidence status"}
                <Arrow diagonal />
              </button>
            </section>
          ))}
          <div className="callout">
            <span className="eyebrow">
              {lang === "ko" ? "검증 한계" : "LIMITATION"}
            </span>
            <p lang="en">{p.limitation}</p>
          </div>
          <div className="reader-next">
            <Link href="/archive">
              ← {lang === "ko" ? "전체 목차" : "Full index"}
            </Link>
            <Link href={`/archive/${next.slug}`}>
              {lang === "ko" ? "다음 발췌문" : "Next excerpt"} / {next.number}
              <Arrow />
            </Link>
          </div>
        </article>
        <aside
          ref={rail}
          className="evidence-rail"
          id="provenance"
          tabIndex={-1}
          aria-label={
            lang === "ko"
              ? "출처와 검증 상태"
              : "Provenance and evidence status"
          }
        >
          <span className="eyebrow">EVIDENCE RAIL / {p.claim}</span>
          <h2>{lang === "ko" ? "근거를 따라가기" : "Follow the evidence."}</h2>
          <dl>
            <dt>SOURCE</dt>
            <dd>
              <Link href="/library/integration-handoff">
                {p.source} · Integration handoff ↗
              </Link>
            </dd>
            <dt>LOCATION</dt>
            <dd>
              {p.section}
              <br />
              Original lines {p.lines}
              <br />
              Paragraph {p.paragraphs[0].id}
            </dd>
            <dt>EVIDENCE TYPE</dt>
            <dd>
              {p.status === "hypothesis"
                ? "Research hypothesis"
                : "Theoretical interpretation / policy recommendation"}
            </dd>
            <dt>VERIFICATION STATUS</dt>
            <dd>
              {p.status === "hypothesis" ? "UNVERIFIED" : "INTERPRETATION_ONLY"}
              <br />
              Planning text inspected; research claim not independently
              verified.
            </dd>
            <dt>UNDERLYING MATERIAL</dt>
            <dd>
              {p.relatedSources.join(" · ")}
              <br />
              Listed in the plan; original reports not supplied.
            </dd>
            <dt>TRANSLATION</dt>
            <dd>untranslated · reviewed_at: —</dd>
          </dl>
          <p className="rail-note">
            {lang === "ko"
              ? "계획의 발췌문이 확보된 상태와 연구 결과가 입증된 상태는 다릅니다."
              : "An available planning excerpt is not a verified research result."}
          </p>
          <Link className="inline-link" href="/methods">
            {lang === "ko" ? "검증 계획 보기" : "View the verification plan"} ↗
          </Link>
        </aside>
      </div>
    </>
  );
}
