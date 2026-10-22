import "server-only";
import { readingTables, type ReadingTable } from "./reading-tables";
export type ReadingParagraph = {
  id: string;
  sectionId: string;
  sourceBlockIds: string[];
  sourcePage: number | null;
  kind: string;
  ko: string;
  sourceTextSha256: string;
  table?: ReadingTable;
  suppressedBy?: string;
  aliasIds?: string[];
};
export type Translation = {
  sourceTextSha256: string;
  en: string;
};
export type ReadingEdition = {
  reportId: string;
  revision: string;
  editing: "layout-only";
  translationStatus: string;
  paragraphs: (ReadingParagraph & { en: string | null })[];
};
export async function getReadingEdition(id: string): Promise<ReadingEdition> {
  const edition = (await import(`./readings/${id.toLowerCase()}.json`)).default;
  let translated: Record<string, Translation> = {};
  try {
    translated = (await import(`./translations/${id.toLowerCase()}.json`)).default.paragraphs;
  } catch {
    // Intermediate authoring checkpoints remain readable without inventing English.
  }
  const paragraphs = edition.paragraphs.map((p: ReadingParagraph) => {
    const entry = translated[p.id];
    return { ...p, en: entry?.sourceTextSha256 === p.sourceTextSha256 ? entry.en : null };
  });
  for (const table of readingTables.filter((t) => t.reportId === id)) {
    const first = paragraphs.find((p: ReadingParagraph) => p.id === table.paragraphIds[0]);
    if (!first) throw new Error(`Missing table anchor: ${table.id}`);
    first.table = table;
    first.aliasIds = table.paragraphIds.slice(1);
    for (const pid of table.paragraphIds.slice(1)) {
      const continuation = paragraphs.find((p: ReadingParagraph) => p.id === pid);
      if (!continuation) throw new Error(`Missing table continuation: ${pid}`);
      first.sourceBlockIds = [...new Set([...first.sourceBlockIds, ...continuation.sourceBlockIds])];
      continuation.suppressedBy = first.id;
    }
  }
  return {
    ...edition,
    translationStatus: paragraphs.every((p: { en: string | null }) => p.en) ? "editorial-author-review-pending" : "in-progress",
    paragraphs,
  };
}
