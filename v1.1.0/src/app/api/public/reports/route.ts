import { reports } from "@/content/report-catalog";
export const dynamic = "force-static";
export function GET() {
  return Response.json({
    status: "source-transcripts",
    reports,
    claimVerification: "UNVERIFIED",
  });
}
