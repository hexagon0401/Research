import Link from "next/link";
import { Localized as L } from "@/components/preferences";
export default function NotFound() {
  return (
    <main id="main" className="editorial page-intro">
      <span className="eyebrow">IIR / 404</span>
      <h1>
        <L ko="페이지를 찾을 수 없습니다." en="Page not found." />
      </h1>
      <p>
        <L
          ko="이 주소에 해당하는 페이지를 찾지 못했습니다. 연구 자료실에서 자료를 찾아보거나 메인 연구로 돌아갈 수 있습니다."
          en="This address does not match an available page. Browse the research archive or return to the main essay."
        />
      </p>
      <nav className="not-found-actions" aria-label="Continue reading">
        <Link className="inline-link" href="/archive">
          <L ko="연구 자료실" en="Research archive" />
        </Link>
        <Link className="inline-link" href="/">
          <L ko="메인 연구로 돌아가기" en="Return to the main essay" />
        </Link>
      </nav>
    </main>
  );
}
