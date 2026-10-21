import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { reports } from "@/content/report-catalog";
import { getReport } from "@/content/report-repository";
import { Localized as L } from "@/components/preferences";
export function generateStaticParams() {
  return reports.map((r) => ({ id: r.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const report = reports.find((item) => item.id === id);
  return {
    title: report?.title ?? "Report not found",
    description: report?.description,
  };
}
export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const r = await getReport((await params).id);
  if (!r) notFound();
  return (
    <main id="main" className="section-shell report-page">
      <header className="page-intro">
        <Link href="/reports" className="back-link">
          ← <L en="All source reports" ko="모든 원문 자료" />
        </Link>
        <span className="eyebrow">
          {r.id} / {r.format.toUpperCase()} / {r.year} / {r.revision}
        </span>
        <h1 lang="ko">{r.title}</h1>
        <p lang="ko">{r.description}</p>
        <div className="report-actions">
          {r.downloadState === "static" && r.readerUrl ? (
            <a
              className="inline-link"
              href={r.readerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <L en="Open de-identified PDF" ko="개인정보 제거 PDF 열기" /> ↗{" "}
              <span className="mono">
                {(r.readerByteSize / 1024 / 1024).toFixed(1)} MB
              </span>
            </a>
          ) : (
            <span className="report-caption">
              <L
                en="PDF connection pending; the full transcript is readable below."
                ko="PDF 저장소 연결 대기 · 아래 전사 본문은 바로 읽을 수 있습니다."
              />
            </span>
          )}
          <a className="inline-link" href="#transcript">
            <L en="Read transcript" ko="전사 본문 읽기" /> ↓
          </a>
        </div>
        <div className="callout report-disclosure">
          <strong>
            <L
              en="Source transcribed · research claims unverified"
              ko="원문 전사 완료 · 연구 주장 미검증"
            />
          </strong>
          <p>
            <L
              en="Personal identifiers have been removed. The source's numbers, quotations and draft notes are preserved. Statistical analysis has not been reproduced and no reviewed English translation is supplied."
              ko="개인 식별정보를 제거하고 원문의 수치·인용·초안 메모를 보존했습니다. 통계 분석의 재현과 영어 검수 번역은 완료되지 않았습니다."
            />
          </p>
          {r.titleType === "catalogue" && (
            <p>
              <L
                en="The title is an editorial catalogue label derived from the supplied document; it is not asserted to be the original printed title."
                ko="이 제목은 제공 문서의 내용을 바탕으로 붙인 목록용 제목이며 원본에 인쇄된 제목과 동일하다고 단정하지 않습니다."
              />
            </p>
          )}
          {r.locator === "paragraph" && (
            <p>
              <L
                en="Paragraph groups below are reading sections, not original page numbers. Tables are flattened; memo and footnote text are labelled."
                ko="아래 구간은 읽기용 문단 묶음이며 원래 쪽수가 아닙니다. 표는 문단으로 풀어 쓰고 메모·각주를 구분했습니다."
              />
            </p>
          )}
        </div>
      </header>
      <div className="report-layout page-content">
        <aside className="report-navigation" aria-label="Report contents">
          <details open>
            <summary>
              <L en="Contents" ko="본문 위치" />
            </summary>
            <ol>
              {r.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {r.locator === "page" ? (
                      <L en={`Page ${s.number}`} ko={`${s.number}쪽`} />
                    ) : (
                      <L
                        en={`Group ${s.number}`}
                        ko={`문단 묶음 ${s.number}`}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </details>
          <details>
            <summary>
              <L en="Source fingerprints" ko="출처 해시·처리 방식" />
            </summary>
            <dl className="report-fingerprints">
              <dt>Original SHA-256</dt>
              <dd>{r.originalSha256}</dd>
              <dt>Reading PDF SHA-256</dt>
              <dd>{r.readerSha256}</dd>
              <dt>TRANSCRIPTION</dt>
              <dd>{r.transcriptionMethod}</dd>
            </dl>
          </details>
          <Link className="inline-link" href="/methods">
            <L en="Methods & limitations" ko="방법론과 한계" /> ↗
          </Link>
        </aside>
        <article
          id="transcript"
          className="report-transcript"
          lang="ko"
          aria-label="한국어 원문 전사"
        >
          {r.sections.map((s) => (
            <section key={s.id} id={s.id} className="transcript-section">
              <h2>
                <a href={`#${s.id}`}>
                  {r.id} /{" "}
                  {r.locator === "page"
                    ? `${s.number}쪽`
                    : `문단 묶음 ${s.number}`}
                </a>
              </h2>
              {s.blocks.map((b) => (
                <div
                  key={b.id}
                  id={b.id}
                  className={`transcript-block transcript-${b.kind}`}
                >
                  {b.kind !== "body" && (
                    <span className="mono">
                      {b.kind === "memo" ? "원문 메모" : "원문 각주"}
                    </span>
                  )}
                  <p className="transcript-text">
                    {b.text || "[추출 가능한 텍스트 없음 — PDF·쪽 이미지 확인]"}
                  </p>
                </div>
              ))}
              {s.preview && (
                <details className="report-preview">
                  <summary>이 쪽의 도표·이미지 보기</summary>
                  <figure>
                    <a
                      href={s.preview.src}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        unoptimized
                        loading="lazy"
                        src={s.preview.src}
                        width={s.preview.width}
                        height={s.preview.height}
                        sizes="(max-width: 768px) 100vw, 850px"
                        alt={s.preview.alt}
                      />
                    </a>
                    <figcaption>
                      개인정보 제거 사본의 {s.number}쪽입니다. 도표는 원문에
                      보고된 자료이며 수치의 독립 검증을 뜻하지 않습니다.
                      이미지를 누르면 확대할 수 있습니다.
                    </figcaption>
                  </figure>
                </details>
              )}
            </section>
          ))}
          {r.figures.length > 0 && (
            <section className="transcript-section">
              <h2>작성 문서에 포함된 도판</h2>
              <p>서식을 재배치한 도판입니다. 학교 로고는 제외했습니다.</p>
              {r.figures.map((figure) => (
                <figure className="report-figure" key={figure.src}>
                  <a
                    href={figure.src}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      unoptimized
                      loading="lazy"
                      src={figure.src}
                      width={figure.width}
                      height={figure.height}
                      sizes="(max-width: 768px) 100vw, 850px"
                      alt={figure.alt}
                    />
                  </a>
                  <figcaption>{figure.alt}</figcaption>
                </figure>
              ))}
            </section>
          )}
          <Link className="inline-link" href="/reports">
            ← 모든 원문 자료
          </Link>
        </article>
      </div>
    </main>
  );
}
