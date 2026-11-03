import Link from "next/link";
import { Localized, MotionControl } from "./preferences";
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link prefetch={false} href="/" className="footer-brand">
          IIR
          <span className="signal-square" />
        </Link>
        <p>
          Integrated Independent Research
          <br />
          <Localized
            en="Technology. Identity. National power."
            ko="기술. 정체성. 국가의 힘."
          />
        </p>
      </div>
      <div className="footer-links">
        <Link prefetch={false} href="/reviewers">
          <Localized en="For reviewers" ko="검토자 요약" />
        </Link>
        <Link prefetch={false} href="/methods">
          <Localized en="Methods & limitations" ko="방법론과 한계" />
        </Link>
        <Link prefetch={false} href="/accessibility">
          <Localized en="Accessibility" ko="접근성" />
        </Link>
        <Link prefetch={false} href="/glossary">
          <Localized en="Glossary" ko="용어 찾아보기" />
        </Link>
        <MotionControl />
      </div>
      <div className="footer-note">
        <Link href="/changelog" className="mono">
          IIR 2.6.0 · RESEARCH IN PROGRESS · 2026
        </Link>
        <p>
          <Localized
            en="A working framework, open to scrutiny."
            ko="검토와 수정을 위한 연구 프레임워크."
          />
        </p>
        <a href="#top">
          <Localized en="Back to top ↑" ko="맨 위로 ↑" />
        </a>
      </div>
      <blockquote className="footer-motto" lang="en">
        <p>
          “(Dante once said that) the hottest places in hell are reserved for
          those who in a period of moral crisis maintain their neutrality.”
        </p>
        <cite>John F. Kennedy</cite>
      </blockquote>
    </footer>
  );
}
