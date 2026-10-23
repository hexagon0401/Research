import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chinaSteps, sourceHref } from "../src/visuals/motion-stories.ts";
test("chronological scenes retain date precision and real source paragraphs", () => {
  assert.deepEqual(
    chinaSteps.slice(0, 5).map((s) => s.date),
    ["2018", "2019-06", "2021–2022", "2024-08", "2025-04-05"],
  );
  assert.deepEqual(
    chinaSteps.slice(0, 5).map((s) => s.precision),
    ["year", "month", "period", "month", "day"],
  );
  const ids = new Set();
  for (const s of chinaSteps) {
    assert(!ids.has(s.id));
    ids.add(s.id);
    assert(s.copy.ko.length > 30 && s.copy.en.length > 60);
    for (const ref of s.sources) {
      const report = JSON.parse(
        readFileSync(`src/content/readings/${ref.report.toLowerCase()}.json`),
      );
      assert(report.paragraphs.some((p) => p.id === ref.paragraph));
      assert(sourceHref(s, ref).endsWith("#" + ref.paragraph));
    }
  }
});
test("business relationships cannot silently become observed shipment tracks", () => {
  assert.equal(chinaSteps[4].kind, "investment");
  assert.match(chinaSteps[4].copy.en, /no shipping route/);
  assert.equal(chinaSteps[2].kind, "reported-supply");
  assert.match(chinaSteps[2].copy.en, /not an observed track/);
  assert.match(chinaSteps[6].copy.en, /not elapsed years/);
});
