import Link from "next/link";
import { notFound } from "next/navigation";
import { getSource, sources, projects } from "@/content/repository";
import { Localized as L } from "@/components/preferences";
export function generateStaticParams() {
  return sources.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getSource((await params).slug);
  return { title: s?.title ?? "Source not found", description: s?.description };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = getSource((await params).slug);
  if (!s) notFound();
  return (
    <main id="main" className="section-shell">
      <div className="page-intro">
        <Link href="/library" className="back-link">
          ← <L en="Reference library" ko="참고문헌 서가" />
        </Link>
        <div className="eyebrow">
          {s.id} / {s.kind.toUpperCase()}
        </div>
        <h1>{s.title}</h1>
        <p>{s.description}</p>
      </div>
      <div className="source-detail">
        <dl>
          <dt>PROVIDER</dt>
          <dd>{s.provider}</dd>
          <dt>YEAR</dt>
          <dd>{s.year}</dd>
          <dt>AVAILABILITY</dt>
          <dd>{s.status}</dd>
          <dt>PUBLIC FILE</dt>
          <dd>Not available</dd>
        </dl>
        <article>
          <h2>
            <L en="Scope of this source" ko="자료의 범위" />
          </h2>
          <p>
            <L
              en={
                s.id === "HANDOFF-01"
                  ? "This user-supplied document describes research questions, a proposed synthesis and verification tasks. It is the source for the six planning excerpts on this site, not primary evidence for the empirical claims it discusses."
                  : s.id === "WEB-SPEC-01"
                    ? "This document defines the visual palette, information architecture, interaction model, provenance requirements and quality targets for the website. It is a design reference."
                    : "This publication is mentioned in the integration plan. The full text, edition details and page-level citations have not been supplied or independently inspected in this project."
              }
              ko={
                s.id === "HANDOFF-01"
                  ? "제공된 문서는 연구 질문, 통합 계획, 검증 과제를 담은 작업 지시서입니다. 사이트의 여섯 발췌문은 이 문서에 기반하며, 문서에 언급된 실증적 주장을 입증하는 1차 자료는 아닙니다."
                  : s.id === "WEB-SPEC-01"
                    ? "사이트의 색상, 정보 구조, 인터랙션, 출처 추적, 품질 목표를 정의하는 디자인 참고 문서입니다."
                    : "통합 작업계획에 언급된 문헌입니다. 이번 프로젝트에서는 전문, 판본, 페이지별 인용을 확보하거나 독립적으로 검토하지 않았습니다."
              }
            />
          </p>
          <div className="callout">
            <L
              en="No original file download is offered. Publication rights and personal information must be reviewed before adding originals to the public archive."
              ko="원본 파일 다운로드는 제공하지 않습니다. 공개 아카이브에 원문을 추가하기 전에는 공개 권한과 개인정보를 검토해야 합니다."
            />
          </div>
          {s.id === "HANDOFF-01" ? (
            <>
              <h2>
                <L
                  en="Available planning excerpts"
                  ko="열람 가능한 작업계획 발췌문"
                />
              </h2>
              {projects.map((p) => (
                <p key={p.slug}>
                  <Link className="inline-link" href={`/archive/${p.slug}`}>
                    {p.number} / {p.title} ↗
                  </Link>
                </p>
              ))}
            </>
          ) : (
            s.project && (
              <Link className="inline-link" href={`/research/${s.project}`}>
                <L en="Related research framework" ko="관련 연구 프레임워크" />{" "}
                ↗
              </Link>
            )
          )}
        </article>
      </div>
    </main>
  );
}
