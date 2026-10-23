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
    assert(s.lead.ko.length > 30 && s.lead.en.length > 60);
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
  assert.match(chinaSteps[4].lead.en, /development/);
  assert(!/freight|shipping route|cargo/.test(chinaSteps[4].lead.en));
  assert.equal(chinaSteps[2].kind, "reported-supply");
  assert(chinaSteps[2].sources.some((s) => s.paragraph === "S08-R003-P001"));
  assert.equal(chinaSteps[6].kind, "analysis");
  assert.equal(chinaSteps[6].precision, "period");
});

test("editorial scene text is bilingual, structured and free of production instructions", () => {
  for (const step of chinaSteps) {
    assert(step.facts.length >= 2);
    assert(step.connection.ko && step.connection.en);
    const text = JSON.stringify([step.lead, step.facts, step.connection]);
    assert(
      !/표시하지 않습니다|선을 그립니다|수치를 만들어|no shipping route is invented|Stop the supply marker/.test(
        text,
      ),
    );
  }
});
