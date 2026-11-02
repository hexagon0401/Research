import type { MetadataRoute } from "next";
import reviewWindow from "@/config/crawler-review.json";
import { crawlerRules } from "@/config/crawler-policy";
// Metadata routes are otherwise cached. Reevaluate the fixed deadline on every request.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function robots(): MetadataRoute.Robots {
  return { rules: crawlerRules(Date.now(), reviewWindow) };
}
