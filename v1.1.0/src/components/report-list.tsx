"use client";
import { useState } from "react";
import Link from "next/link";
import { reports, reportTitlesEn } from "@/content/report-catalog";
import { usePreferences } from "./preferences";
import { projects } from "@/content/repository";

export function ReportList() {
  const { lang } = usePreferences();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const term = query.normalize("NFC").trim().toLocaleLowerCase();
  const shown = reports.filter(
    (r) =>
      (!topic || r.projects.includes(topic)) &&
      `${r.id} ${r.title} ${reportTitlesEn[r.id]} ${r.description} ${r.year} ${r.format}`
        .normalize("NFC")
        .toLocaleLowerCase()
        .includes(term),
  );
  return (
    <>
      <div className="report-search">
        <label htmlFor="report-search">
          {lang === "ko"
            ? "자료 ID·제목·설명 검색"
            : "Search report ID, title or description"}
        </label>
        <input
          id="report-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label htmlFor="report-topic">
          {lang === "ko" ? "연구 주제" : "Research thread"}
        </label>
        <select
          id="report-topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        >
          <option value="">
            {lang === "ko" ? "모든 주제" : "All threads"}
          </option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {lang === "ko" ? p.titleKo : p.title}
            </option>
          ))}
        </select>
        {(query || topic) && (
          <button
            className="inline-link report-clear"
            onClick={() => {
              setQuery("");
              setTopic("");
            }}
          >
            {lang === "ko" ? "검색·필터 초기화" : "Clear filters"}
          </button>
        )}
        <p role="status">
          {shown.length} / {reports.length}{" "}
          {lang === "ko" ? "개 자료" : "reports"}
        </p>
      </div>
      {shown.length === 0 && (
        <p>
          {lang === "ko" ? "일치하는 자료가 없습니다." : "No matching reports."}
        </p>
      )}
      <ol className="report-list">
        {shown.map((r) => (
          <li key={r.id}>
            <span className="mono">
              {r.id} / {r.year} / {r.format.toUpperCase()}
            </span>
            <div>
              <h2 lang={lang}>
                <Link href={`/reports/${r.id}`}>
                  {lang === "ko" ? r.title : reportTitlesEn[r.id]} ↗
                </Link>
              </h2>
              <p lang="ko">{r.description}</p>
              <span className="report-caption">
                {lang === "ko"
                  ? "한국어 원문 · 영어 편집 번역 · PDF"
                  : "Korean source · English editorial translation · PDF"}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
