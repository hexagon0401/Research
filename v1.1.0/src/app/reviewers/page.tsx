import type { Metadata } from "next";
import Link from "next/link";
import { Localized as L } from "@/components/preferences";
import { SourceGuide } from "@/components/source-guide";
import { PrintBrief } from "@/components/copy-citation";
import { researchAuthor } from "@/config/research-author";
import { methodSources } from "@/config/reading-guide";
import { getReadingEdition } from "@/content/reading-repository";
import { reports, reportTitlesEn } from "@/content/report-catalog";
import { essay } from "@/content/essay";
export const metadata: Metadata = {
  title: "For reviewers",
  description:
    "Question, source passages, methods and original PDFs for reviewing IIR.",
};
export default async function Reviewers() {
  const methods = await Promise.all(
    methodSources.map(async (m) => {
      const p = (await getReadingEdition(m.report)).paragraphs.find(
        (p) => p.id === m.anchor,
      );
      if (!p?.en) throw new Error(`Missing method source ${m.anchor}`);
      return { ...m, paragraph: p };
    }),
  );
  const question = essay.find((b) => b.id === "capability")!;
  return (
    <main id="main" className="section-shell reviewer-page">
      <header className="page-intro">
        <span className="eyebrow">IIR / REVIEWER BRIEF</span>
        <h1>
          <L ko="질문과 근거를 먼저." en="The question. Then the evidence." />
        </h1>
        <p>
          <L ko={question.lead.ko} en={question.lead.en} />
        </p>
        <p className="reviewer-author">
          {researchAuthor.name.ko} / {researchAuthor.name.en} ·{" "}
          {researchAuthor.affiliation}
          <br />
          <L
            ko={researchAuthor.period.ko}
            en={researchAuthor.period.en}
          /> · <a href={researchAuthor.contact}>LinkedIn</a>
        </p>
        <nav className="reviewer-actions" aria-label="Review options">
          <Link prefetch={false} href="/?mode=quick">
            <L ko="빠른 읽기로 시작" en="Start with the overview" />
          </Link>
          <Link prefetch={false} href="/">
            <L ko="전체 논증 읽기" en="Read the full essay" />
          </Link>
          <PrintBrief />
        </nav>
      </header>
      <SourceGuide />
      <section className="methods-at-glance">
        <h2>
          <L ko="방법을 원문에서 확인하기" en="Methods at a glance" />
        </h2>
        <p>
          <L
            ko="아래 방법은 보고서에 서술된 분석이다. 자료와 계산의 재현 여부는 방법론 페이지에서 구분해 설명한다."
            en="These are methods described in the reports. The methods page distinguishes the supplied material from independently reproduced analysis."
          />
        </p>
        <table>
          <caption>
            <L ko="방법과 원문 위치" en="Methods and source locations" />
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <L ko="방법" en="Method" />
              </th>
              <th scope="col">
                <L ko="원문" en="Source" />
              </th>
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m.anchor}>
                <th scope="row">
                  <L ko={m.label.ko} en={m.label.en} />
                </th>
                <td>
                  <Link
                    prefetch={false}
                    href={`/reports/${m.report}#${m.anchor}`}
                  >
                    {m.report} · {m.anchor}
                  </Link>
                  <details>
                    <summary>
                      <L ko="분석 절차 발췌" en="Read the method passage" />
                    </summary>
                    <p>
                      <L ko={m.paragraph.ko} en={m.paragraph.en} />
                    </p>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <Link prefetch={false} href="/methods">
            <L
              ko="자료 범위·한계·검증 상태 읽기"
              en="Read scope, limitations and verification status"
            />
          </Link>
        </p>
      </section>
      <section className="reviewer-faq">
        <h2>
          <L ko="처음 읽는 분께" en="Before you begin" />
        </h2>
        <dl>
          <dt>
            <L ko="어떤 사이트인가요?" en="What is this?" />
          </dt>
          <dd>
            <L
              ko="S00 통합 논지와 그 바탕이 된 13개 연구를 함께 읽는 연구 포트폴리오다."
              en="A research portfolio connecting the S00 synthesis with thirteen full studies."
            />
          </dd>
          <dt>
            <L ko="짧게 읽으려면?" en="Where should I start?" />
          </dt>
          <dd>
            <Link prefetch={false} href="/?mode=quick">
              <L ko="여섯 장의 개요" en="The six-chapter overview" />
            </Link>
            <L
              ko="에서 시작해 필요한 논증과 그림을 펼친다. 전문은 자료실에서 한국어·영어로 나란히 읽을 수 있다."
              en=" lets you open the reasoning and diagrams as needed. The archive supplies parallel Korean/English full texts."
            />
          </dd>
          <dt>
            <L ko="연구 번호는 무엇인가요?" en="What do the S-numbers mean?" />
          </dt>
          <dd>
            <L
              ko="자료를 구별하는 식별자이며 현재 목록의 순서를 뜻하지 않는다."
              en="They identify archive records, rather than positions in the current list."
            />
          </dd>
          <dt>
            <L ko="내용은 어떻게 검증하나요?" en="How can I check a claim?" />
          </dt>
          <dd>
            <L
              ko="각 발췌문의 문맥 링크로 원문 위치를 확인하고, 보고서 하단의 PDF와 함께 읽는다."
              en="Follow a passage's context link to its exact location, then compare it with the PDF at the end of the report."
            />{" "}
            <Link prefetch={false} href="/methods">
              <L ko="방법론과 한계" en="Methods & limitations" />
            </Link>
          </dd>
        </dl>
      </section>
      <section className="reviewer-pdfs">
        <h2>
          <L ko="원문 PDF와 전문" en="Source PDFs and full studies" />
        </h2>
        <ol>
          {reports.map((r) => (
            <li key={r.id}>
              <Link prefetch={false} href={`/reports/${r.id}`}>
                {r.id} · <L ko={r.title} en={reportTitlesEn[r.id]} />
              </Link>
              {r.readerUrl && (
                <a href={r.readerUrl} download>
                  <L ko="PDF 다운로드" en="Download PDF" />
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>
      <p className="print-only">research-hxgn.vercel.app/reviewers</p>
    </main>
  );
}
