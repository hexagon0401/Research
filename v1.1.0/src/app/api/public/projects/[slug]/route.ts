import { getProject, projects } from "@/content/repository";
export const dynamic = "force-static";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const project = getProject((await params).slug);
  return project
    ? Response.json({ project })
    : Response.json({ error: "Project not found" }, { status: 404 });
}
