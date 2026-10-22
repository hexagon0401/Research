"use client";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { reports, reportTitlesEn } from "@/content/report-catalog";
import { projects, sources } from "@/content/repository";
import { researchConnections } from "@/content/research-connections";
import { studySpines } from "@/visuals/story";
import { usePreferences } from "./preferences";
import { Arrow } from "./icons";
type Entry = {
  id: string;
  title: string;
  description: string;
  spine: string;
  href: string;
  year: string;
  category: string;
  topics: string[];
  status: string;
  search: string;
  book: boolean;
};
export function ResearchShelf({
  kind,
  compact = false,
  from,
}: {
  kind: "archive" | "library";
  compact?: boolean;
  from?: string;
}) {
  const { lang, reduced } = usePreferences();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState("");
  const [opening, setOpening] = useState<string | null>(null);
  const [sort, setSort] = useState("index");
  const key = `iir-shelf-v2-${kind}`;
  const entries: Entry[] =
    kind === "archive"
      ? reports.map((r) => ({
          id: r.id,
          title: lang === "ko" ? r.title : reportTitlesEn[r.id],
          description:
            lang === "ko" ? r.description : researchConnections[r.id].en,
          spine: studySpines[r.id][lang],
          href: `/reports/${r.id}${from ? `?from=${from}` : ""}`,
          year: r.year,
          category: "Research",
          topics: r.projects,
          status:
            lang === "ko"
              ? "한국어 · 영어 편집 번역 · PDF"
              : "Korean · Editorial English · PDF",
          search: `${r.id} ${r.title} ${reportTitlesEn[r.id]} ${r.description} ${r.year} ${r.format}`,
          book: false,
        }))
      : sources.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          spine:
            s.slug === "integration-handoff"
              ? lang === "ko"
                ? "연구 작업계획"
                : "Research plan"
              : s.slug === "website-specification"
                ? lang === "ko"
                  ? "사이트 기획"
                  : "Site design"
                : s.title,
          href: `/library/${s.slug}`,
          year: s.year,
          category: s.kind.includes("Book") ? "Book" : "Planning document",
          topics: [],
          status: s.status,
          search: `${s.id} ${s.title} ${s.description} ${s.provider} ${s.kind}`,
          book: s.kind.includes("Book"),
        }));
  const term = query.normalize("NFC").trim().toLocaleLowerCase();
  const shown = entries
    .filter(
      (e) =>
        (filter === "all" ||
          (kind === "archive"
            ? e.topics.includes(filter)
            : e.category === filter)) &&
        e.search.normalize("NFC").toLocaleLowerCase().includes(term),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : sort === "year"
          ? b.year.localeCompare(a.year)
          : 0,
    );
  const selected = shown.find((e) => e.id === active) ?? shown[0];
  const shelves = Array.from({ length: Math.ceil(shown.length / 7) }, (_, i) =>
    shown.slice(i * 7, i * 7 + 7),
  );
  useEffect(() => {
    try {
      setActive(sessionStorage.getItem(key) ?? "");
    } catch {}
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [key]);
  useEffect(() => {
    if (!opening) return;
    const cancel = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (timer.current) clearTimeout(timer.current);
      setOpening(null);
      root.current
        ?.querySelector<HTMLAnchorElement>(`[data-folder-id="${opening}"]`)
        ?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", cancel, true);
    return () => window.removeEventListener("keydown", cancel, true);
  }, [opening]);
  useEffect(() => {
    let wasOpen = false;
    const before = () => {
      const list =
        root.current?.querySelector<HTMLDetailsElement>(".shelf-list");
      if (list) {
        wasOpen = list.open;
        list.open = true;
      }
    };
    const after = () => {
      const list =
        root.current?.querySelector<HTMLDetailsElement>(".shelf-list");
      if (list) list.open = wasOpen;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  function choose(id: string) {
    setActive(id);
    try {
      sessionStorage.setItem(key, id);
    } catch {}
  }
  function cancel() {
    if (timer.current) clearTimeout(timer.current);
    setOpening(null);
  }
  function navigate(event: MouseEvent<HTMLAnchorElement>, entry: Entry) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    choose(entry.id);
    if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    setOpening(entry.id);
    timer.current = setTimeout(() => {
      timer.current = null;
      router.push(entry.href);
      setOpening(null);
    }, 280);
  }
  function move(index: number) {
    if (!shown.length) return;
    cancel();
    const entry = shown[(index + shown.length) % shown.length];
    choose(entry.id);
    const link = root.current?.querySelector<HTMLAnchorElement>(
      `[data-folder-id="${entry.id}"]`,
    );
    link?.focus({ preventScroll: true });
    link?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "instant",
    });
  }
  const categories =
    kind === "archive"
      ? projects.map((p) => ({
          value: p.slug,
          label: lang === "ko" ? p.titleKo : p.title,
        }))
      : [
          {
            value: "Planning document",
            label: lang === "ko" ? "계획·디자인 문서" : "Planning documents",
          },
          { value: "Book", label: lang === "ko" ? "도서 참고자료" : "Books" },
        ];
  return (
    <div
      ref={root}
      className={`material-shelf ${compact ? "is-compact" : ""}`}
      data-kind={kind}
    >
      {!compact && (
        <div className="shelf-tools">
          <label className="od-field shelf-search">
            <span className="mono">
              {lang === "ko"
                ? "제목 · 주제 · 자료 ID"
                : "TITLE / TOPIC / REFERENCE"}
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                cancel();
                setQuery(event.target.value);
              }}
              placeholder={
                lang === "ko"
                  ? "찾고 싶은 연구를 입력하세요"
                  : "Find a line of inquiry"
              }
            />
          </label>
          <label className="od-field">
            <span className="mono">{lang === "ko" ? "분류" : "CATEGORY"}</span>
            <select
              value={filter}
              onChange={(event) => {
                cancel();
                setFilter(event.target.value);
              }}
            >
              <option value="all">
                {lang === "ko" ? "모든 자료" : "All materials"}
              </option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="od-field">
            <span className="mono">{lang === "ko" ? "정렬" : "SORT BY"}</span>
            <select
              value={sort}
              onChange={(event) => {
                cancel();
                setSort(event.target.value);
              }}
            >
              <option value="index">
                {lang === "ko" ? "목차 순" : "Index order"}
              </option>
              <option value="title">
                {lang === "ko" ? "제목 순" : "Title A–Z"}
              </option>
              <option value="year">
                {lang === "ko" ? "연도 순" : "Year, newest"}
              </option>
            </select>
          </label>
          {(query || filter !== "all") && (
            <button
              className="shelf-clear"
              onClick={() => {
                cancel();
                setQuery("");
                setFilter("all");
              }}
            >
              {lang === "ko" ? "검색·필터 초기화" : "Clear filters"}
            </button>
          )}
        </div>
      )}
      <div className="shelf-result-line mono">
        <span>
          {kind === "archive" ? "RESEARCH ARCHIVE" : "REFERENCE LIBRARY"}
        </span>
        <span role="status">
          {shown.length} / {entries.length}{" "}
          {lang === "ko" ? "개 자료" : "ITEMS"}
        </span>
      </div>
      {selected ? (
        <>
          <div className="shelf-selected">
            <div className="shelf-selected-copy od-stack">
              <span className="mono">
                {selected.id} / {selected.year}
              </span>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
            <div className="shelf-selected-action od-field">
              <span>{selected.status}</span>
              {kind === "library" && (
                <span className="shelf-availability">
                  {selected.book
                    ? lang === "ko"
                      ? "참고문헌 정보 · 원문 미확보"
                      : "Reference record · full text not supplied"
                    : lang === "ko"
                      ? "계획·디자인 참고 문서"
                      : "Planning / design reference"}
                </span>
              )}
              <Link
                href={selected.href}
                prefetch={false}
                onClick={(event) => navigate(event, selected)}
              >
                {lang === "ko"
                  ? kind === "archive"
                    ? "연구 펼치기"
                    : "자료 정보 열기"
                  : kind === "archive"
                    ? "Open the study"
                    : "Open source record"}
                <Arrow diagonal />
              </Link>
              <div className="shelf-opening-state" role="status">
                {opening && (
                  <>
                    <span>
                      {lang === "ko"
                        ? "여는 중 · Esc로 취소"
                        : "Opening · Esc to cancel"}
                    </span>
                    <button onClick={cancel}>
                      {lang === "ko" ? "취소" : "Cancel"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            className="shelf-rows"
            onKeyDown={(event) => {
              const index = shown.findIndex(
                (entry) => entry.id === selected.id,
              );
              if (
                ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                move(
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? shown.length - 1
                      : index + (event.key === "ArrowRight" ? 1 : -1),
                );
              }
            }}
          >
            {shelves.map((row, rowIndex) => (
              <section
                key={rowIndex}
                className="bookshelf-row"
                aria-label={`${lang === "ko" ? "서가" : "Shelf"} ${rowIndex + 1}`}
              >
                <div className="shelf-row-label mono">
                  <span>
                    0{rowIndex + 1} /{" "}
                    {kind === "archive" ? "STUDIES" : "REFERENCES"}
                  </span>
                  <span>
                    {row[0].id} — {row.at(-1)?.id}
                  </span>
                </div>
                <ol className="material-shelf-track od-rail">
                  {row.map((entry) => (
                    <li
                      key={entry.id}
                      data-research-node={
                        from === "integration" ? entry.id : undefined
                      }
                    >
                      <Link
                        className={`material-folder ${selected.id === entry.id ? "selected" : ""} ${opening === entry.id ? "opening" : ""} ${entry.book ? "is-book" : ""}`}
                        data-folder-id={entry.id}
                        href={entry.href}
                        prefetch={false}
                        aria-label={`${entry.id} ${entry.spine} ${entry.year} · ${entry.title}`}
                        onFocus={() => choose(entry.id)}
                        onPointerEnter={(event) => {
                          if (
                            event.pointerType === "mouse" &&
                            !opening &&
                            !root.current?.querySelector(
                              ".material-folder:focus",
                            )
                          )
                            choose(entry.id);
                        }}
                        onClick={(event) => navigate(event, entry)}
                      >
                        <span className="material-paper" aria-hidden="true" />
                        <span className="material-cover od-stack">
                          <span className="material-tab" aria-hidden="true" />
                          <span className="material-id mono">{entry.id}</span>
                          <span className="material-title">{entry.spine}</span>
                          <span className="material-year mono">
                            {entry.year}
                          </span>
                          <span className="material-glyph" aria-hidden="true">
                            <Arrow diagonal />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
          <div className="shelf-controls">
            <span className="mono">
              {lang === "ko"
                ? "커서로 선택 · 클릭해 펼치기 · 방향키로 이동"
                : "HOVER TO SELECT / CLICK TO OPEN / ARROW KEYS TO MOVE"}
            </span>
            <div className="od-row">
              <button
                onClick={() =>
                  move(shown.findIndex((entry) => entry.id === selected.id) - 1)
                }
                aria-label={lang === "ko" ? "이전 자료" : "Previous material"}
              >
                ←
              </button>
              <button
                onClick={() =>
                  move(shown.findIndex((entry) => entry.id === selected.id) + 1)
                }
                aria-label={lang === "ko" ? "다음 자료" : "Next material"}
              >
                →
              </button>
            </div>
          </div>
          {!compact && (
            <details className="shelf-list">
              <summary>
                {lang === "ko" ? "전체 목록으로 보기" : "View the text index"}
                <span className="mono">{shown.length}</span>
              </summary>
              <ol
                className={
                  kind === "archive" ? "report-list" : "collection-list"
                }
              >
                {shown.map((entry) => (
                  <li
                    key={entry.id}
                    className={
                      kind === "library" ? "collection-row" : undefined
                    }
                  >
                    <span className="mono">
                      {entry.id} / {entry.year}
                    </span>
                    <div>
                      <h2>
                        <Link href={entry.href} prefetch={false}>
                          {entry.title} ↗
                        </Link>
                      </h2>
                      <p>{entry.description}</p>
                      <span className="report-caption">{entry.status}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </>
      ) : (
        <div className="shelf-empty">
          <h2>
            {lang === "ko"
              ? "일치하는 자료가 없습니다."
              : "No matching reports."}
          </h2>
          <p>
            {lang === "ko"
              ? "검색어나 분류를 바꾸어보세요."
              : "Try another title, topic or reference."}
          </p>
        </div>
      )}
      <noscript>
        <p className="shelf-noscript">
          {lang === "ko"
            ? "각 폴더의 링크 또는 전체 목록에서 자료를 열 수 있습니다."
            : "Open any folder link, or expand the text index to browse all materials."}
        </p>
      </noscript>
    </div>
  );
}
