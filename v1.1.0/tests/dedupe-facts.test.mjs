import test from "node:test";
import assert from "node:assert/strict";
import { dedupeFactSteps } from "../src/utils/dedupe-facts.ts";
test("dedupe preserves novel facts, bilingual differences and original data", () => {
  const common = { ko: "감지 · 위성", en: "Sensing · satellites" };
  const input = [
    {
      facts: [
        common,
        { ...common, ko: "감지   · 위성" },
        { ko: "판단", en: "Decision" },
      ],
    },
    { facts: [common, { ko: "판단", en: "A different judgment" }] },
  ];
  const before = JSON.stringify(input);
  const result = dedupeFactSteps(input, [common]);
  assert.deepEqual(
    result.map((s) => s.facts.length),
    [1, 1],
  );
  assert.equal(JSON.stringify(input), before);
  assert.equal(result[1].facts[0].en, "A different judgment");
  assert.equal(result[1].facts[0].ko, "");
  for (const lang of ["ko", "en"]) {
    const visible = [...[common], ...result.flatMap((s) => s.facts)]
      .map((f) => f[lang])
      .filter(Boolean);
    assert.equal(new Set(visible).size, visible.length, lang);
  }
});
