import { projects, revision } from "@/content/repository";
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
      "Planning excerpts only. Underlying reports and reviewed translations are not available.",
  });
}
