import { test } from "node:test";
import assert from "node:assert/strict";
import { crawlerRules } from "../src/config/crawler-policy.ts";
const activatedAt = "2026-11-02T06:00:00.000Z",
  expiresAt = "2026-11-05T06:00:00.000Z";
const window = { activatedAt, expiresAt },
  start = Date.parse(activatedAt),
  end = Date.parse(expiresAt);
test("crawler permission opens once for 72 hours and closes exactly at its deadline", () => {
  assert.equal(crawlerRules(start - 1, window).disallow, "/");
  for (const now of [start, start + 1, end - 1])
    assert.deepEqual(crawlerRules(now, window), {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/originals/"],
    });
  for (const now of [end, end + 1, end + 86400000])
    assert.equal(crawlerRules(now, window).disallow, "/");
});
test("missing, malformed, inverted or extended configurations fail closed", () => {
  for (const value of [
    {},
    { activatedAt },
    { expiresAt },
    { activatedAt, expiresAt: "bad" },
    { activatedAt: expiresAt, expiresAt: activatedAt },
    { activatedAt, expiresAt: "2026-11-06T06:00:00Z" },
  ])
    assert.equal(crawlerRules(start, value).disallow, "/");
  assert.equal(crawlerRules(NaN, window).disallow, "/");
});
