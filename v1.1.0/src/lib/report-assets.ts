import { reports } from "@/content/report-catalog";

export function staticReportAssets(project: string) {
  return reports
    .filter((r) => r.projects.includes(project) && staticReportPath(r.assetId))
    .map((r) => ({
      id: r.assetId,
      documentId: r.id,
      title: `${r.title} — 개인정보 제거 열람본`,
      revision: r.revision,
      kind: "reader_pdf" as const,
      mimeType: "application/pdf",
      byteSize: r.readerByteSize,
      sha256: r.readerSha256,
    }));
}
export function staticReportPath(id: string) {
  const r = reports.find(
    (r) => r.assetId === id && r.downloadState === "static",
  );
  const expected = r
    ? `/report-pdfs/${r.id.toLowerCase()}/${r.revision}/reader.pdf`
    : null;
  return expected && r?.readerUrl === expected ? expected : null;
}
