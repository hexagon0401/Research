import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdirSync, writeFileSync } from "node:fs";
const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const result = await lighthouse(
    process.env.AUDIT_URL || "http://127.0.0.1:3000",
    {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices"],
    },
  );
  if (!result) throw new Error("Lighthouse did not return a report");
  mkdirSync(".local/audits", { recursive: true });
  writeFileSync(".local/audits/lighthouse-mobile.json", result.report);
  const lhr = result.lhr;
  const summary = {
    date: lhr.fetchTime,
    profile: "Lighthouse mobile / simulated throttling",
    version: lhr.lighthouseVersion,
    scores: Object.fromEntries(
      Object.entries(lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
    metrics: Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index",
        "total-byte-weight",
      ].map((key) => [
        key,
        {
          value: lhr.audits[key].numericValue,
          display: lhr.audits[key].displayValue,
        },
      ]),
    ),
  };
  writeFileSync(".local/audits/summary.json", JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await chrome.kill();
}
