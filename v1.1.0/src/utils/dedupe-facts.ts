export type BilingualFact = { ko: string; en: string };
const normalize = (s: string) =>
  s.normalize("NFKC").replace(/\s+/g, " ").trim();
/** Exact repeats are suppressed independently per display language, without mutating sources. */
export function dedupeFactSteps<T extends { facts: BilingualFact[] }>(
  steps: T[],
  initial: BilingualFact[] = [],
): T[] {
  const seen = {
    ko: new Set(initial.map((f) => normalize(f.ko))),
    en: new Set(initial.map((f) => normalize(f.en))),
  };
  return steps.map((step) => ({
    ...step,
    facts: step.facts
      .map((f) => {
        const visible = { ...f };
        for (const lang of ["ko", "en"] as const) {
          const key = normalize(f[lang]);
          if (seen[lang].has(key)) visible[lang] = "";
          else seen[lang].add(key);
        }
        return visible;
      })
      .filter((f) => f.ko || f.en),
  }));
}
