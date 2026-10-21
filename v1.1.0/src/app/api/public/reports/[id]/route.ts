import { reports } from "@/content/report-catalog";
import { getReport } from "@/content/report-repository";
export const dynamic = "force-static";
export function generateStaticParams() {
  return reports.map((r) => ({ id: r.id }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const report = await getReport((await params).id);
  return report
    ? Response.json(report)
    : Response.json({ error: "Report not found" }, { status: 404 });
}
