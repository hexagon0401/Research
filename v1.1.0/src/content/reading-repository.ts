import "server-only";
export type ReadingParagraph = {
  id: string;
  sectionId: string;
  sourceBlockIds: string[];
  sourcePage: number | null;
  kind: string;
  ko: string;
  sourceTextSha256: string;
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
  return {
    ...edition,
    translationStatus: paragraphs.every((p: { en: string | null }) => p.en) ? "editorial-author-review-pending" : "in-progress",
    paragraphs,
  };
}
