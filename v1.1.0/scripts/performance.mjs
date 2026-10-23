import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync(".local/audits", { recursive: true });
const summaries = [];
for (let run = 1; run <= 3; run++) {
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
    if (!result) throw new Error("No Lighthouse result");
    writeFileSync(`.local/audits/lighthouse-mobile-${run}.json`, result.report);
    const lhr = result.lhr;
    summaries.push({
      run,
      date: lhr.fetchTime,
      version: lhr.lighthouseVersion,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([k, v]) => [
          k,
          Math.round(v.score * 100),
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
        ].map((k) => [k, lhr.audits[k].numericValue]),
      ),
      failures: Object.values(lhr.audits)
        .filter(
          (a) => a.score !== null && a.score < 1 && a.details?.type === "table",
        )
        .map((a) => ({ id: a.id, title: a.title, details: a.details })),
    });
  } finally {
    await chrome.kill();
  }
}
const median = (values) => values.toSorted((a, b) => a - b)[1];
const scores = Object.fromEntries(
  ["performance", "accessibility", "best-practices"].map((k) => [
    k,
    median(summaries.map((s) => s.scores[k])),
  ]),
);
const summary = {
  profile: "Lighthouse mobile / simulated throttling / production build",
  scores,
  runs: summaries,
};
writeFileSync(".local/audits/summary.json", JSON.stringify(summary, null, 2));
console.log(
  JSON.stringify(
    { scores, runs: summaries.map(({ failures, ...run }) => run) },
    null,
    2,
  ),
);
if (scores.performance < 95 || scores.accessibility < 100)
  throw new Error(
    "Release targets not met: performance >=95, accessibility 100",
  );
