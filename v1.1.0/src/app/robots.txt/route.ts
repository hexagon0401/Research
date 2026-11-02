import reviewWindow from "@/config/crawler-review.json";
import { crawlerRules } from "@/config/crawler-policy";
// An explicit response preserves browser and CDN no-store directives on Vercel.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export function GET() {
  const rules = crawlerRules(Date.now(), reviewWindow);
  const excluded = Array.isArray(rules.disallow)
    ? rules.disallow
    : [rules.disallow];
  const body = [
    "User-Agent: *",
    ...(rules.allow ? [`Allow: ${rules.allow}`] : []),
    ...excluded.map((path) => `Disallow: ${path}`),
    "",
  ].join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "private, no-cache, no-store, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
