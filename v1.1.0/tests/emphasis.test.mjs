import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { emphasisParts } from "../src/utils/emphasis.ts";
import { figureCallouts } from "../src/config/figure-callouts.ts";
const inventory = JSON.parse(readFileSync("src/config/emphasis.json"));
test("emphasis preserves every character and never applies unapproved entries", () => {
  for (const lang of ["en", "ko"]) {
    for (const entry of inventory) {
      const text = `Before ${entry[lang]} after,  42.\n끝`;
      const parts = emphasisParts(text, inventory, entry.target, lang);
      assert.equal(parts.map((part) => part.text).join(""), text);
      assert.equal(
        parts.some((part) => part.entry?.id === entry.id),
        entry.approved,
      );
    }
  }
  assert(inventory.filter((entry) => entry.approved).length <= 40);
  assert.equal(
    new Set(inventory.map((entry) => entry.id)).size,
    inventory.length,
  );
});
test("missing or ambiguous approved phrases fail loudly", () => {
  const entry = inventory[0];
  assert.throws(
    () => emphasisParts("changed text", [entry], entry.target, "en"),
    /exactly once/,
  );
  assert.throws(
    () => emphasisParts(`${entry.en} ${entry.en}`, [entry], entry.target, "en"),
    /exactly once/,
  );
});
test("all approved callout figures, qualifiers, captions and cautions are exact source substrings", () => {
  assert.equal(figureCallouts.length, 3);
  for (const item of figureCallouts) {
    const source = JSON.parse(
      readFileSync(`src/content/readings/${item.report.toLowerCase()}.json`),
    ).paragraphs.find((p) => p.id === item.anchor);
    const translation = JSON.parse(
      readFileSync(
        `src/content/translations/${item.report.toLowerCase()}.json`,
      ),
    ).paragraphs[item.anchor];
    assert.equal(translation.sourceTextSha256, source.sourceTextSha256);
    for (const lang of ["ko", "en"])
      for (const field of ["figure", "caption", "context"])
        assert(
          (lang === "ko" ? source.ko : translation.en).includes(
            item[field][lang],
          ),
          `${item.anchor}/${lang}/${field}`,
        );
  }
  assert.match(figureCallouts[1].figure.en, /^approximately/);
  assert.match(figureCallouts[2].figure.en, /^record/);
  assert.match(figureCallouts[2].context.en, /do not establish/);
});
