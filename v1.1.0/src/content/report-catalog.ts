import catalog from "./reports/catalog.json";

export type ReportSummary = {
  id: string;
  title: string;
  titleType: string;
  year: string;
  description: string;
  projects: string[];
  format: string;
  originalSha256: string;
  originalByteSize: number;
  locator: string;
  sourcePageCount: number | null;
  readerPageCount: number;
  readerByteSize: number;
  readerSha256: string;
  sectionCount: number;
  figurePageCount: number;
  transcriptionMethod: string;
  verificationStatus: string;
  revision: string;
  assetId: string;
  privacyStatus: string;
  downloadState: string;
  readerUrl: string | null;
};
export const reports: ReportSummary[] = catalog;
export function reportsForProject(project: string) {
  return reports.filter((report) => report.projects.includes(project));
}
