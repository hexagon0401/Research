import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const base = process.env.BASE_URL || "http://127.0.0.1:3038",
  out = process.env.OUT_DIR || "docs/design-improve/screenshots/before";
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
try {
  for (const [width, height] of [
    [375, 812],
    [768, 1024],
    [1280, 800],
    [1536, 864],
  ])
    for (const lang of ["en", "ko"])
      for (const reducedMotion of ["no-preference", "reduce"]) {
        const c = await b.newContext({
          viewport: { width, height },
          reducedMotion,
        });
        await c.addInitScript(
          (l) => localStorage.setItem("iir-language", l),
          lang,
        );
        const p = await c.newPage();
        await p.goto(base);
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(150);
        await p.screenshot({
          path: `${out}/${width}-${lang}-${reducedMotion}.png`,
        });
        const data = await p.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          missing: [...document.querySelectorAll('a[href^="#"]')]
            .map((a) => decodeURIComponent(a.hash.slice(1)))
            .filter((id) => id && !document.getElementById(id)),
          empty: [...document.querySelectorAll("summary")]
            .filter((e) => /0 passages|0개 문단/.test(e.textContent))
            .map((e) => e.parentElement.id),
          tokens: Object.fromEntries(
            [
              "--paper",
              "--ink",
              "--signal",
              "--font-body",
              "--text-body",
              "--gutter",
            ].map((k) => [
              k,
              getComputedStyle(document.documentElement).getPropertyValue(k),
            ]),
          ),
        }));
        if (
          width === 1280 &&
          lang === "en" &&
          reducedMotion === "no-preference"
        ) {
          data.axe = (
            await new AxeBuilder({ page: p })
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze()
          ).violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
          }));
          for (const id of [
            "china-governance",
            "korea-platforms",
            "china-cambodia",
          ]) {
            await p.locator("#detail-" + id).scrollIntoViewIfNeeded();
            await p
              .locator("#detail-" + id)
              .screenshot({ path: `${out}/${id}.png` });
          }
        }
        results.push({ width, height, lang, reducedMotion, ...data });
        await c.close();
      }
  const responses = [];
  for (const id of [
    "S00",
    "S01",
    "S02",
    "S03",
    "S05",
    "S06",
    "S08",
    "S11",
    "S13",
    "S14",
    "S15",
    "S16",
    "S17",
  ])
    responses.push({
      id,
      status: (await fetch(base + "/reports/" + id)).status,
    });
  fs.writeFileSync(
    out + "/audit.json",
    JSON.stringify({ views: results, reports: responses }, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      views: results.length,
      overflow: results.filter((r) => r.overflow).length,
      missing: results.flatMap((r) => r.missing),
      reports: responses,
    }),
  );
} finally {
  await b.close();
}
