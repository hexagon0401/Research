import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const content = JSON.parse(
  readFileSync(new URL("../src/content/research.json", import.meta.url)),
);
const map = JSON.parse(
  readFileSync(new URL("../src/content/map.json", import.meta.url)),
);
test("every research excerpt resolves to an available source and stable paragraph", () => {
  const sourceIds = new Set(content.sources.map((s) => s.id));
  const ids = new Set();
  const slugs = new Set();
  assert.equal(content.projects.length, 6);
  for (const p of content.projects) {
    assert(sourceIds.has(p.source));
    assert(!slugs.has(p.slug));
    slugs.add(p.slug);
    assert(p.section && p.lines && p.limitation);
    assert(["hypothesis", "interpreted"].includes(p.status));
    for (const paragraph of p.paragraphs) {
      assert(!ids.has(paragraph.id));
      ids.add(paragraph.id);
      assert(paragraph.ko.length > 100);
      assert(paragraph.summaryKo);
    }
  }
});
test("legacy planning excerpts retain their untranslated source status", () => {
  for (const p of content.projects)
    for (const paragraph of p.paragraphs) {
      if (paragraph.translationStatus !== "reviewed")
        assert.equal(paragraph.en, null);
    }
});
test("source and project references have no dangling targets", () => {
  for (const source of content.sources) {
    assert(source.description && source.status && source.provider);
    if (source.project)
      assert(content.projects.some((p) => p.slug === source.project));
  }
  assert.equal(
    new Set(content.sources.map((s) => s.id)).size,
    content.sources.length,
  );
  assert.equal(
    new Set(content.projects.map((p) => p.claim)).size,
    content.projects.length,
  );
});
test("the atlas only marks the declared comparative countries, with provenance", () => {
  assert.deepEqual(
    map.pins.map((p) => p.id),
    ["us", "cn", "kr"],
  );
  assert(map.source.includes("Natural Earth"));
  for (const p of map.pins) {
    assert(p.point.every(Number.isFinite));
    assert(p.point[0] > 0 && p.point[0] < 960);
    assert(p.point[1] > 0 && p.point[1] < 490);
  }
});
test("public content has no private identifiers or claims of completed numerical analysis", () => {
  const data = JSON.stringify(content);
  assert(!/3314|2111|유하민|sk-[A-Za-z0-9]{20}/.test(data));
  assert.equal(content.status, "planning-prototype");
  assert(content.evidenceNeeds.every((e) => e.priority === "P0"));
});
