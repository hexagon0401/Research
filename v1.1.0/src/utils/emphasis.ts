export type EmphasisEntry = {
  id: string;
  target: string;
  en: string;
  ko: string;
  device: string;
  approved: boolean;
  static?: boolean;
};
/** Pure render-time splitting. No post-hydration text edits or letter splitting. */
export function emphasisParts(
  text: string,
  entries: EmphasisEntry[],
  target: string,
  lang: "en" | "ko",
) {
  const candidates = entries.filter((e) => e.approved && e.target === target);
  const parts: { text: string; entry?: EmphasisEntry }[] = [];
  let offset = 0;
  for (const entry of candidates) {
    const phrase = entry[lang];
    const at = text.indexOf(phrase, offset);
    if (!phrase || at < 0 || text.indexOf(phrase, at + phrase.length) >= 0)
      throw new Error(
        `Emphasis ${entry.id}/${lang} must match exactly once in ${target}`,
      );
    if (at > offset) parts.push({ text: text.slice(offset, at) });
    parts.push({ text: phrase, entry });
    offset = at + phrase.length;
  }
  parts.push({ text: text.slice(offset) });
  return parts;
}
