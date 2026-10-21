import { projects, revision } from "@/content/repository";
import { reports } from "@/content/report-catalog";
export const dynamic = "force-static";
export function GET() {
  return Response.json({
    revision,
    status: "planning-prototype",
    projects: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      claimId: p.claim,
      paragraphIds: p.paragraphs.map((v) => v.id),
      sourceId: p.source,
      status: p.status,
    })),
    sourcePolicy:
      "Planning excerpts and de-identified source report transcripts are separate. Research claims and translations remain unverified.",
    reportCount: reports.length,
    reportIndex: "/reports",
  });
}
