import { projects } from "@/content/repository";
export const dynamic = "force-static";
export function generateStaticParams() {
  return projects.map((p) => ({ id: p.claim }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = projects.find((p) => p.claim === id);
  if (!project)
    return Response.json({ error: "Claim not found" }, { status: 404 });
  return Response.json({
    id: project.claim,
    question: project.question,
    status: project.status,
    verificationStatus:
      project.status === "hypothesis" ? "UNVERIFIED" : "INTERPRETATION_ONLY",
    sourceId: project.source,
    paragraphIds: project.paragraphs.map((v) => v.id),
    sourceLocation: project.section,
    limitation: project.limitation,
  });
}
