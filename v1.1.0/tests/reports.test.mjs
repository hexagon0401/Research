import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const catalog = JSON.parse(
  readFileSync(new URL("../src/content/reports/catalog.json", import.meta.url)),
);
const load = (id) =>
  JSON.parse(
    readFileSync(
      new URL(
        `../src/content/reports/${id.toLowerCase()}.json`,
        import.meta.url,
      ),
    ),
  );
test("source reports retain unique identities, locators and reading-copy fingerprints", () => {
  assert.equal(new Set(catalog.map((r) => r.id)).size, catalog.length);
  assert.equal(
    new Set(catalog.map((r) => r.originalSha256)).size,
    catalog.length,
  );
  const allLocators = new Set();
  for (const summary of catalog) {
    const r = load(summary.id);
    assert.equal(r.id, summary.id);
    assert.equal(r.sections.length, summary.sectionCount);
    assert.match(r.originalSha256, /^[a-f0-9]{64}$/);
    assert.match(r.readerSha256, /^[a-f0-9]{64}$/);
    assert(r.readerByteSize > 0 && r.readerByteSize <= 20 * 1024 * 1024);
    if (r.downloadState === "static") {
      assert.equal(
        r.readerUrl,
        `/report-pdfs/${r.id.toLowerCase()}/${r.revision}/reader.pdf`,
      );
      const bytes = readFileSync(
        new URL(`../public${r.readerUrl}`, import.meta.url),
      );
      assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
      assert.equal(bytes.length, r.readerByteSize);
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        r.readerSha256,
      );
    }
    assert.equal(r.verificationStatus, "SOURCE_TRANSCRIBED_CLAIMS_UNVERIFIED");
    if (r.locator === "page")
      assert.equal(r.sections.length, r.sourcePageCount);
    else assert.equal(r.sourcePageCount, null);
    for (const s of r.sections) {
      for (const item of [s, ...s.blocks]) {
        assert(!allLocators.has(item.id));
        allLocators.add(item.id);
      }
      assert(
        s.blocks.every((b) => typeof b.text === "string" && b.text.length > 0),
      );
      const serialized = JSON.stringify(s);
      assert(!/학번[^\n]{0,20}\b[1-3]\d{3}\b/.test(serialized));
      if (s.preview) {
        assert(
          s.preview.src.startsWith(`/report-media/${r.id.toLowerCase()}/`),
        );
        assert(
          existsSync(new URL(`../public${s.preview.src}`, import.meta.url)),
        );
      }
    }
  }
});
test("different Golden Dome sources and newly supplied subjects never overwrite missing plan entries", () => {
  const a = load("S03"),
    b = load("S13");
  assert.notEqual(a.originalSha256, b.originalSha256);
  assert.notEqual(a.sourcePageCount, b.sourcePageCount);
  for (const id of ["S04", "S07", "S09", "S10", "S12"])
    assert(!catalog.some((r) => r.id === id));
  assert(catalog.some((r) => r.id === "S16" && r.title.includes("반도체")));
});
test("public report manifests contain no private paths, storage paths or service credentials", () => {
  const data = JSON.stringify([catalog, ...catalog.map((r) => load(r.id))]);
  assert(
    !/sourcePath|originalFilename|SUPABASE_SECRET_KEY|research-originals|bucket_id|object_path|\.local\/|\/workspace\//.test(
      data,
    ),
  );
});
