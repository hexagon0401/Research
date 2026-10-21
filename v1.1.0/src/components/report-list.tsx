"use client";
import { useState } from "react";
import Link from "next/link";
import { reports } from "@/content/report-catalog";
import { usePreferences } from "./preferences";

export function ReportList() {
  const { lang } = usePreferences();
  const [query, setQuery] = useState("");
  const term = query.normalize("NFC").trim().toLocaleLowerCase();
  const shown = reports.filter((r) =>
    `${r.id} ${r.title} ${r.description} ${r.year} ${r.format}`
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
              <h2 lang="ko">
                <Link href={`/reports/${r.id}`}>{r.title} ↗</Link>
              </h2>
              <p lang="ko">{r.description}</p>
              <span className="report-caption">
                {lang === "ko"
                  ? "원문 전사 · 연구 주장 미검증"
                  : "Source transcript · claims unverified"}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
