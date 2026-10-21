import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/content/repository";
import { listAssets } from "@/lib/assets-server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Original research files" };
export default async function OriginalIndex({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const item = getProject(project);
  if (!item) notFound();
  let result: Awaited<ReturnType<typeof listAssets>> | null = null;
  try {
    result = await listAssets(project);
  } catch {}
  return (
    <main id="main" className="editorial page-intro page-content">
      <Link href={`/archive/${project}`} className="back-link">
        ← Back to the reader / 리더로 돌아가기
      </Link>
      <span className="eyebrow">ORIGINAL FILES</span>
      <h1>{item.title}</h1>
      <p>Published source files / 공개 승인된 원본 파일</p>
      {!result ? (
        <div className="callout">
          Original storage is unavailable. The research text remains readable. /
          원본 저장소에 연결하지 못했습니다. 본문은 계속 읽을 수 있습니다.
        </div>
      ) : result.assets.length === 0 ? (
        <div className="callout">
          No approved original file has been connected yet. / 아직 공개 승인된
          원본이 연결되지 않았습니다.
        </div>
      ) : (
        result.assets.map((a) => (
          <a
            className="original-file-link"
            key={a.id}
            href={`/api/public/assets/${a.id}/open`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{a.title}</strong>
            <span>
              {a.documentId} · {a.revision} ·{" "}
              {(a.byteSize / 1024 / 1024).toFixed(1)} MB ·{" "}
              {a.kind === "reader_pdf"
                ? "PDF reading copy"
                : "Authoring original"}{" "}
              ↗
            </span>
          </a>
        ))
      )}
    </main>
  );
}
