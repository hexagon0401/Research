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
        <Link prefetch={false} href="/methods">
          <Localized en="Methods & limitations" ko="방법론과 한계" />
        </Link>
        <Link prefetch={false} href="/accessibility">
          <Localized en="Accessibility" ko="접근성" />
        </Link>
        <MotionControl />
      </div>
      <div className="footer-note">
        <span className="mono">IIR 2.4.1 · RESEARCH IN PROGRESS · 2026</span>
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
