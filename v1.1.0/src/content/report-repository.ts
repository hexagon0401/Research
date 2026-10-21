import "server-only";
import { reports, type ReportSummary } from "./report-catalog";

type Figure = { src: string; width: number; height: number; alt: string };
export type Report = ReportSummary & {
  sections: {
    id: string;
    number: number;
    hasFigures: boolean;
    preview?: Figure;
    blocks: { id: string; kind: string; text: string }[];
  }[];
  figures: Figure[];
};
export async function getReport(id: string): Promise<Report | null> {
  if (!reports.some((report) => report.id === id)) return null;
  const data = await import(`./reports/${id.toLowerCase()}.json`);
  return data.default as Report;
}
