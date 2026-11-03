import test from "node:test";
import assert from "node:assert/strict";
import { readAnchor } from "../src/utils/read-anchor.ts";
test("ordinary and encoded anchors survive, malformed UTF-8 falls back without an exception", () => {
  for (const hash of [
    "",
    "#survival",
    "#S06-R001-P004",
    "#%ED%95%9C%EA%B5%AD",
    "#%25",
  ])
    assert.equal(
      readAnchor(hash),
      {
        "": "",
        "#survival": "survival",
        "#S06-R001-P004": "S06-R001-P004",
        "#%ED%95%9C%EA%B5%AD": "한국",
        "#%25": "%",
      }[hash],
    );
  for (const hash of ["#%", "#%ZZ", "#%E0%A4%A"])
    assert.equal(readAnchor(hash), "");
});
