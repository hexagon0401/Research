import type { Metadata } from "next";
import Link from "next/link";
import { Localized as L } from "@/components/preferences";
export const metadata: Metadata = { title: "About the inquiry" };
export default function About() {
  return (
    <main id="main" className="editorial">
      <div className="page-intro">
        <span className="eyebrow">ABOUT / INTEGRATED INDEPENDENT RESEARCH</span>
        <h1>
          <L
            en={
              <>
                A question that
                <br />
                kept evolving.
              </>
            }
            ko={
              <>
                계속해서
                <br />
                진화하는 질문.
              </>
            }
          />
        </h1>
        <p>
          <L
            en="What allows a company to endure—and what happens when its capabilities become part of a nation's security?"
            ko="기업은 어떻게 오래 살아남는가? 그리고 기업의 역량이 국가 안보의 일부가 될 때, 무엇이 달라지는가?"
          />
        </p>
      </div>
      <article className="prose page-content">
        <h2>
          <L en="The inquiry" ko="탐구의 방향" />
        </h2>
        <p>
          <L
            en="IIR connects questions of technology management, corporate resilience, philosophy and economic security. S00 develops the central argument through topic-specific studies, with source texts and evidence limitations available alongside it."
            ko="IIR은 기술경영, 기업의 복원력, 철학, 경제안보에 관한 질문을 연결합니다. S00이 개별 교과 탐구를 종합하는 논지를 전개하며, 각 원문과 검증의 한계를 함께 읽을 수 있습니다."
          />
        </p>
        <h2>
          <L en="An honest account of the work" ko="실제 수행 범위의 기록" />
        </h2>
        <p>
          <L
            en="The earlier school projects are the proposed research's starting materials. They are not reclassified as a single independent experiment. Independent contributions, dates and collaboration credits require their own records; this prototype does not invent activity hours, interviews or completed analyses."
            ko="기존 교과 탐구는 통합 연구의 출발 자료입니다. 이를 처음부터 하나의 독립 실험으로 수행한 것으로 재분류하지 않습니다. 개인 기여, 날짜, 협업 귀속은 별도의 기록이 필요하며, 이 초안은 활동 시간·인터뷰·완료된 분석을 만들어내지 않습니다."
          />
        </p>
        <h2>
          <L en="2025 → 2026" ko="2025 → 2026" />
        </h2>
        <p>
          <L
            en="The supplied school reports address data-driven warfare, the security–economic complex, financial networks, multiscale analysis, philosophy and corporate strategy. Thirteen distinct files are preserved and transcribed separately from the proposed integrated framework. Their presence does not establish the reported statistical or causal claims."
            ko="제공된 교과 보고서는 전쟁의 정보화, 경제–안보 복합체, 금융 네트워크, 다중스케일 분석, 철학, 기업 전략을 다룹니다. 서로 다른 원본 파일 13개를 보존하고 통합 연구 프레임워크와 구분해 전사했습니다. 원문 확보가 보고된 통계·인과 주장의 입증을 뜻하지는 않습니다."
          />
        </p>
        <h2>
          <L en="This edition" ko="현재 버전" />
        </h2>
        <p>
          <L
            en="Edition 2.4.1, prepared on 23 October 2026: persistent scroll-driven diagrams, edited bilingual case summaries, a continuous S00 essay, thirteen bilingual reading editions, and inline source PDFs. The site uses a file-based public content adapter; no database credentials or private research files are exposed. Visual tokens and component contracts are documented for a later Open Design handoff."
            ko="2026년 10월 23일의 v2.4.1입니다. 설명과 함께 고정되는 그림, 다듬은 한영 사례 설명, S00 중심 연속형 에세이, 13개 한영 병렬 전문, 본문 안의 PDF 열람을 제공합니다. 파일 기반 공개 콘텐츠 어댑터를 사용하며 데이터베이스 인증정보나 비공개 연구 원문을 노출하지 않습니다. 이후 Open Design 이관을 위해 시각 토큰과 컴포넌트 계약을 문서화했습니다."
          />
        </p>
        <Link className="inline-link" href="/methods">
          <L en="Read the methods & limitations" ko="방법론과 한계 읽기" /> ↗
        </Link>
      </article>
    </main>
  );
}
