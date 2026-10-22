import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { essay } from "../src/content/essay.ts";
import { readingTables } from "../src/content/reading-tables.ts";
const load = (path) =>
  JSON.parse(
    readFileSync(new URL(`../src/content/${path}`, import.meta.url), "utf8"),
  );
const edition = (id) => load(`readings/${id.toLowerCase()}.json`);
const english = (id, pid) =>
  load(`translations/${id.toLowerCase()}.json`).paragraphs[`${id}-${pid}`].en;
test("all thirteen editions preserve source characters and have complete current English", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/audit-reading-editions.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" },
  );
  assert.match(output, /13 reports · 973 bilingual passages/);
  const manifest = load("readings/manifest.json");
  assert.equal(manifest.totalParagraphs, 973);
  assert.equal(manifest.reports.length, 13);
});
test("reported numerical values and conflicting source amounts survive translation", () => {
  const stats = english("S06", "R002-P003").replaceAll("−", "-");
  for (const value of ["-0.17", "0.10", "0.02", "-0.52", "0.05"])
    assert(stats.includes(value), value);
  assert.match(english("S03", "R001-P005"), /175 billion/);
  assert.match(english("S03", "R001-P007"), /17\.5 billion/);
  assert.match(english("S17", "R002-P005"), /forty independent quarters/);
  assert.match(english("S17", "R006-P001"), /not statistical proof/);
  assert.match(english("S15", "R004-P003"), /1959/);
  assert.match(english("S15", "R005-P002"), /1951/);
});
test("Golden Dome versions align to their own passage boundaries", () => {
  assert(!english("S13", "R002-P009").includes("David's Sling"));
  assert(english("S13", "R002-P010").includes("David's Sling"));
  assert(english("S13", "R002-P010").includes("THAAD"));
  assert.match(english("S13", "R005-P002"), /^Combining Palantir,/);
  assert.equal(
    english("S13", "R005-P004"),
    "(2) Significance and implications",
  );
});
test("every main-essay citation and research connection has a real source", () => {
  const ids = new Set(load("reports/catalog.json").map((r) => r.id));
  const beats = new Set();
  for (const beat of essay) {
    assert(!beats.has(beat.id));
    beats.add(beat.id);
    assert(beat.intro.ko && beat.intro.en && beat.bridge.ko && beat.bridge.en);
    for (const id of beat.related) assert(ids.has(id));
    for (const spec of beat.passages) {
      const p = edition(spec.report).paragraphs;
      for (const id of spec.blocks)
        assert(
          p.some((x) => x.sourceBlockIds.includes(id)),
          id,
        );
      for (const id of spec.readingIds ?? [])
        assert(
          p.some((x) => x.id === id),
          id,
        );
      assert(
        p.some(
          (x) =>
            x.ko.length > 85 &&
            (x.sourceBlockIds.some((id) => spec.blocks.includes(id)) ||
              spec.readingIds?.includes(x.id)),
        ),
        beat.id,
      );
    }
  }
  assert.deepEqual(
    [...new Set(essay.filter((b) => b.country).map((b) => b.country))],
    ["us", "cn", "kr"],
  );
});
test("restored tables map complete bilingual rows to real source passages", () => {
  const covered = new Set();
  for (const table of readingTables) {
    const p = edition(table.reportId).paragraphs;
    for (const id of table.paragraphIds) {
      assert(!covered.has(id));
      covered.add(id);
      assert(p.some((x) => x.id === id));
    }
    assert.equal(table.headers.ko.length, table.headers.en.length);
    for (const row of table.rows) {
      assert.equal(row.ko.length, table.headers.ko.length);
      assert.equal(row.en.length, table.headers.en.length);
    }
  }
  const schema = readingTables.find((t) => t.id === "s14-schema");
  assert.equal(schema.rows.length, 5);
  assert.equal(schema.rows[2].ko[2], "4");
  assert.equal(schema.rows[2].en[3], "55");
});
test("S06 punctuation and S15 worksheet labels retain readable source order", () => {
  const s06 = edition("S06").paragraphs.find(
    (p) => p.id === "S06-R005-P004",
  ).ko;
  assert.match(s06, /음료수 시장, 비탄력적, 변동이 크게 일어나지 않음/);
  const s15 = edition("S15").paragraphs;
  assert.equal(s15.find((p) => p.id === "S15-R003-P002").kind, "field-label");
  assert(!s15.find((p) => p.id === "S15-R003-P005").ko.includes("탐구 내용"));
  assert(s15.some((p) => p.ko.includes("NV α")));
  assert.equal(edition("S15").glyphCorrections[0].to, "α");
});
