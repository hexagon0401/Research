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
export const reportTitlesEn: Record<string, string> = {
  S00: "Redefining State–Firm Relations: The Emergence of Corporate Hegemony",
  S01: "The Fifth Battlespace and Data Warfare: Cybersecurity, NCW and MDO",
  S02: "America's True Power: The Economic–Security Complex and Technological Hegemony",
  S03: "Can Force Create Peace? America's Golden Dome — Five-page Planning Document",
  S05: "Technology, Money and Inequality: Economic Trust and Stablecoins",
  S06: "Corporate Sustainability and Technological Monopoly — Reading Seminar Report",
  S08: "Multiscale Regional Inquiry: Firms, States and Spatial Data",
  S11: "Redefining Para Bellum: Liberal Order and Technological Military Alliances",
  S13: "Can Force Create Peace? America's Golden Dome — Six-page Document",
  S14: "Modern Society and Philosophy: Ontology and Moral Coherence",
  S15: "Northeast Asian Geopolitical Anomalies in Satellite and Maritime Data",
  S16: "American Semiconductor Export Controls and Korean Industry",
  S17: "Architecting Defense-Firm Strategy: PCA, VAR and Cluster Analysis",
};
