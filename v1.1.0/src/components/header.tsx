"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./icons";
import { usePreferences } from "./preferences";
export function Header() {
  const { lang, setLang } = usePreferences();
  const path = usePathname();
  const more = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    more.current?.removeAttribute("open");
  }, [path]);
  return (
    <header className="site-header">
      <Link prefetch={false} href="/" className="brand">
        <Mark />
        <span>
          IIR
          <span className="brand-full">
            Integrated
            <br />
            Independent Research
          </span>
        </span>
      </Link>
      <nav aria-label={lang === "ko" ? "주 탐색" : "Main navigation"}>
        <Link
          prefetch={false}
          href="/archive"
          aria-current={
            path.startsWith("/archive") || path.startsWith("/reports")
              ? "page"
              : undefined
          }
        >
          {lang === "ko" ? "연구 아카이브" : "Archive"}
        </Link>
        <Link
          prefetch={false}
          href="/library"
          aria-current={path.startsWith("/library") ? "page" : undefined}
        >
          {lang === "ko" ? "참고자료" : "Library"}
        </Link>
        <details
          className="header-more"
          ref={more}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              more.current?.removeAttribute("open");
              more.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>
            {lang === "ko" ? "더 보기" : "More"}
            <span aria-hidden="true">＋</span>
          </summary>
          <div className="header-more-panel">
            <Link prefetch={false} href="/about">
              {lang === "ko" ? "연구 소개" : "About the research"}
            </Link>
            <Link prefetch={false} href="/methods">
              {lang === "ko" ? "방법론과 한계" : "Methods & limitations"}
            </Link>
            <Link prefetch={false} href="/accessibility">
              {lang === "ko" ? "접근성" : "Accessibility"}
            </Link>
          </div>
        </details>
      </nav>
      <div className="language-switch" aria-label="Interface language">
        <button
          lang="en"
          aria-pressed={lang === "en"}
          onClick={() => setLang("en")}
        >
          EN
        </button>
        <button
          lang="ko"
          aria-pressed={lang === "ko"}
          onClick={() => setLang("ko")}
        >
          KO
        </button>
      </div>
    </header>
  );
}
