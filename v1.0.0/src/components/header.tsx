"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark, Arrow } from "./icons";
import { usePreferences } from "./preferences";
export function Header() {
  const { lang, setLang } = usePreferences();
  const path = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="brand">
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
        <Link href="/#index">{lang === "ko" ? "목차" : "Index"}</Link>
        <Link
          href="/archive"
          aria-current={path.startsWith("/archive") ? "page" : undefined}
        >
          {lang === "ko" ? "아카이브" : "Archive"}
        </Link>
        <Link
          href="/library"
          aria-current={path.startsWith("/library") ? "page" : undefined}
        >
          {lang === "ko" ? "참고문헌" : "Library"}
        </Link>
        <Link
          href="/about"
          aria-current={path === "/about" ? "page" : undefined}
        >
          {lang === "ko" ? "소개" : "About"}
        </Link>
        <div className="language-switch" aria-label="Interface language">
          <button
            lang="en"
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <span>/</span>
          <button
            lang="ko"
            aria-pressed={lang === "ko"}
            onClick={() => setLang("ko")}
          >
            KO
          </button>
        </div>
      </nav>
      <Link
        href="/archive"
        className="header-archive"
        aria-label="Open archive"
      >
        <Arrow diagonal />
      </Link>
    </header>
  );
}
