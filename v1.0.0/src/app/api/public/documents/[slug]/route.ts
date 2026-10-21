import { getProject, projects, revision } from "@/content/repository";
export const dynamic = "force-static";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const p = getProject((await params).slug);
  if (!p)
    return Response.json({ error: "Document not found" }, { status: 404 });
  return Response.json({
    slug: p.slug,
    revision,
    kind: "planning-excerpt",
    sourceId: p.source,
    section: p.section,
    lines: p.lines,
    paragraphs: p.paragraphs.map((paragraph) => ({
      ...paragraph,
      en: paragraph.translationStatus === "reviewed" ? paragraph.en : null,
    })),
    originalAsset: null,
  });
}
