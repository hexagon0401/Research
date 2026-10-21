import { listAssets } from "@/lib/assets-server";
import { PROJECT_SLUGS } from "@/lib/assets-policy";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;
const headers = { "Cache-Control": "private, no-store" };
export async function GET(request: Request) {
  const project = new URL(request.url).searchParams.get("project") ?? "";
  if (!PROJECT_SLUGS.includes(project))
    return Response.json(
      { error: "Unknown research project" },
      { status: 400, headers },
    );
  try {
    return Response.json(await listAssets(project), { headers });
  } catch {
    return Response.json(
      { error: "Original files are temporarily unavailable", assets: [] },
      { status: 503, headers },
    );
  }
}
