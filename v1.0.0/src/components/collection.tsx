"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { projects, sources } from "@/content/repository";
import { usePreferences } from "./preferences";
import { Arrow } from "./icons";
export function Collection({ kind }: { kind: "archive" | "library" }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("index");
  const { lang } = usePreferences();
  const isArchive = kind === "archive";
  const entries = useMemo(
    () =>
      isArchive
        ? projects.map((p) => ({
            slug: p.slug,
            id: p.number,
            title: lang === "ko" ? p.titleKo : p.title,
            description: lang === "ko" ? p.descriptionKo : p.description,
            category: p.category,
            status: lang === "ko" ? "작업계획 발췌" : "Planning excerpt",
            year: p.year,
            provider: "",
          }))
        : sources.map((s) => ({
            slug: s.slug,
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.kind.includes("Book") ? "Book" : "Planning document",
            status: s.status,
            year: s.year,
            provider: s.provider,
          })),
    [isArchive, lang],
  );
  const filtered = entries
    .filter(
      (p) =>
        (filter === "all" || p.category === filter) &&
        `${p.title} ${p.description} ${p.id} ${p.category} ${p.provider}`
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : sort === "year"
          ? b.year.localeCompare(a.year)
          : 0,
    );
  const categories = [...new Set(entries.map((p) => p.category))];
  return (
    <>
      <div className="filter-bar">
        <label className="filter-field">
          <span>
            {lang === "ko" ? "제목 · 주제 검색" : "SEARCH THE COLLECTION"}
          </span>
          <input
            type="search"
            placeholder={
              lang === "ko" ? "제목, 주제, 식별자…" : "Title, topic, reference…"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="filter-field">
          <span>{lang === "ko" ? "분류" : "CATEGORY"}</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">
              {lang === "ko" ? "모든 분류" : "All categories"}
            </option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>{lang === "ko" ? "정렬" : "SORT BY"}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="index">
              {lang === "ko" ? "목차 순" : "Index order"}
            </option>
            <option value="title">
              {lang === "ko" ? "제목 순" : "Title A–Z"}
            </option>
            <option value="year">
              {lang === "ko" ? "최신 연도" : "Year, newest"}
            </option>
          </select>
        </label>
        <span className="result-count" role="status">
          {filtered.length} {lang === "ko" ? "개 항목" : "ITEMS"}
        </span>
      </div>
      <div className="collection-list">
        {filtered.map((p) => (
          <Link
            className="collection-row"
            key={p.slug}
            href={`/${kind}/${p.slug}`}
          >
            <span className="eyebrow">{p.id}</span>
            <div>
              <span className="eyebrow">
                {p.category} / {p.year}
              </span>
              <h2>{p.title}</h2>
              <p>
                {p.provider && <>{p.provider} · </>}
                {p.description}
              </p>
            </div>
            <span className="row-status">
              <span className="hollow-dot" /> {p.status}
            </span>
            <Arrow diagonal />
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="eyebrow">NO MATCHES / 00</span>
          <h2>
            {lang === "ko"
              ? "일치하는 자료가 없습니다."
              : "Nothing on this shelf, yet."}
          </h2>
          <p>
            {lang === "ko"
              ? "검색어 또는 분류를 변경해보세요."
              : "Try a different search or category."}
          </p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            {lang === "ko" ? "필터 초기화" : "Clear filters"} ↗
          </button>
        </div>
      )}
    </>
  );
}
