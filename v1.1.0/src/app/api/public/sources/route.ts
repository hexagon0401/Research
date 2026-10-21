import { sources } from "@/content/repository";
export const dynamic = "force-static";
export function GET() {
  return Response.json({ sources, count: sources.length });
}
