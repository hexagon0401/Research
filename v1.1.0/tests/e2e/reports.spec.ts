import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
test("archive defaults to thirteen full studies with useful search and topic filters", async ({
  page,
}) => {
  await page.goto("/archive");
  await expect(page.locator(".report-list>li")).toHaveCount(13);
  await page.getByRole("searchbox").fill("satellite");
  await expect(page.locator(".report-list>li")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("combobox").selectOption("strategic-capability");
  expect(await page.locator(".report-list>li").count()).toBeGreaterThan(0);
  await page.getByRole("searchbox").fill("nothing-matches");
  await expect(page.getByText("No matching reports.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".report-list>li")).toHaveCount(13);
});
test("Korean punctuation, complete English, locators and highlights survive the reader", async ({
  page,
}) => {
  await page.goto("/reports/S06#S06-R005-P004");
  await expect(page.locator("#S06-R005-P004 .reading-ko")).toContainText(
    "음료수 시장, 비탄력적, 변동이 크게 일어나지 않음",
  );
  await expect(page.locator("#S06-R005-P004 .reading-en")).toHaveText(
    /beverage market is inelastic/,
  );
  await expect(page.locator(".translation-pending")).toHaveCount(0);
  expect(await page.locator(".reading-ko mark").count()).toBeGreaterThan(0);
  expect(await page.locator(".reading-en mark").count()).toBeGreaterThan(0);
  await page.goto("/reports/S06#S06-L005-P001");
  await expect(page.locator("#S06-L005-P001")).toHaveCount(1);
  await expect(page.locator("#S06-R004-P006")).toContainText("스포츠");
});
test("switching reading language preserves the current passage", async ({
  page,
}) => {
  await page.goto("/reports/S06#S06-R005-P004");
  await expect(page.locator(".parallel-reading")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    const e = document.getElementById("S06-R005-P004")!;
    scrollBy({ top: e.getBoundingClientRect().top - 145, behavior: "instant" });
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("#S06-R005-P004 .reading-en")).toBeVisible();
  await expect(page.locator("#S06-R005-P004 .reading-ko")).toBeHidden();
  const rect = await page.locator("#S06-R005-P004").boundingBox();
  expect(rect!.y).toBeLessThan(250);
  expect(rect!.y + rect!.height).toBeGreaterThan(100);
  await page.getByRole("button", { name: "한국어", exact: true }).click();
  await expect(page.locator("#S06-R005-P004 .reading-ko")).toBeVisible();
});
test("PDF is loaded on demand and supports page controls, zoom and download", async ({
  page,
}) => {
  const errors: string[] = [];
  const assets: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (/report-pdfs|vendor\/pdfjs/.test(r.url())) assets.push(r.url());
  });
  await page.goto("/reports/S06");
  expect(assets).toEqual([]);
  await page.getByRole("button", { name: /Read the PDF here/ }).click();
  await expect(page.locator(".pdf-canvas-scroll")).toHaveAttribute(
    "aria-busy",
    "false",
    { timeout: 20000 },
  );
  expect(
    await page
      .locator("canvas")
      .evaluate((c) => (c as HTMLCanvasElement).width),
  ).toBeGreaterThan(200);
  await page.getByRole("button", { name: /Next PDF page/ }).click();
  await expect(page.locator(".pdf-controls input")).toHaveValue("2");
  await page.getByRole("button", { name: /Zoom in/ }).click();
  await expect(page.locator(".pdf-canvas-scroll")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await expect(page.locator(".pdf-controls")).toContainText("120%");
  await expect(
    page.locator(".reading-pdf a[download]").first(),
  ).toHaveAttribute("href", "/report-pdfs/s06/rev-001/reader.pdf");
  await page.getByRole("button", { name: /Close PDF viewer/ }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("failed PDF rendering preserves transcript and download", async ({
  page,
}) => {
  await page.route("**/report-pdfs/s06/**", (r) =>
    r.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.goto("/reports/S06");
  await page.getByRole("button", { name: /Read the PDF here/ }).click();
  await expect(page.locator(".pdf-status")).toContainText(
    "Unable to load PDF",
    { timeout: 20000 },
  );
  await expect(page.locator(".reading-pdf a[download]").first()).toBeVisible();
  await expect(page.locator("#transcript")).toContainText("ESG");
});
test("restored tables are bilingual, bounded and accessible", async ({
  page,
}) => {
  await page.goto("/reports/S14");
  await expect(page.locator(".reading-table-scroll table")).toHaveCount(6);
  await expect(page.locator("#S14-R003-P008 .reading-ko")).toContainText(
    "야간 당직 교사 A",
  );
  await expect(page.locator("#S14-R003-P008 .reading-en")).toContainText(
    "Night-duty teacher A",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
test("full text and download remain available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const p = await context.newPage();
  await p.goto(`${baseURL}/reports/S06`);
  await expect(p.locator("#transcript")).toContainText("Red Bull");
  await expect(p.locator("#transcript")).toContainText("레드불");
  await expect(p.locator(".reading-pdf a[download]").first()).toBeVisible();
  await context.close();
});
test("public reports expose complete editorial editions without losing source identity", async ({
  request,
}) => {
  const catalogue = await (await request.get("/api/public/reports")).json();
  expect(catalogue.reports).toHaveLength(13);
  for (const r of catalogue.reports) {
    const doc = await (await request.get(`/api/public/reports/${r.id}`)).json();
    expect(doc.readingEdition.translationStatus).toBe(
      "editorial-author-review-pending",
    );
    expect(
      doc.readingEdition.paragraphs.every((p: { en: string }) => p.en),
    ).toBe(true);
    expect(doc.sections.length).toBe(r.sectionCount);
  }
  const a = await (await request.get("/api/public/reports/S03")).json(),
    b = await (await request.get("/api/public/reports/S13")).json();
  expect(a.originalSha256).not.toBe(b.originalSha256);
  expect((await request.get("/api/public/reports/S10")).status()).toBe(404);
});

test("large PDF survives rapid controls, fullscreen, reopen and a checksum-verified download", async ({
  page,
  request,
}, info) => {
  test.skip(info.project.name !== "desktop", "Large-file stress runs once");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/reports/S15");
  await page.getByRole("button", { name: /Read the PDF here/ }).click();
  await expect(page.locator(".pdf-canvas-scroll")).toHaveAttribute(
    "aria-busy",
    "false",
    { timeout: 20000 },
  );
  await page.getByRole("button", { name: /Next PDF page/ }).click();
  await page.getByRole("button", { name: /Zoom in/ }).click();
  await page.getByRole("button", { name: /Previous PDF page/ }).click();
  await expect(page.locator(".pdf-canvas-scroll")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  await page.getByRole("button", { name: /Fullscreen/ }).click();
  await expect
    .poll(() => page.evaluate(() => Boolean(document.fullscreenElement)))
    .toBe(true);
  await page.evaluate(() => document.exitFullscreen());
  await page.getByRole("button", { name: /Close PDF viewer/ }).click();
  await page.getByRole("button", { name: /Read the PDF here/ }).click();
  await expect(page.locator(".pdf-canvas-scroll")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  const downloading = page.waitForEvent("download");
  await page.locator(".reading-pdf a[download]").first().click();
  const download = await downloading;
  const bytes = await readFile((await download.path())!);
  expect(bytes.length).toBeGreaterThan(10_000_000);
  const report = await (await request.get("/api/public/reports/S15")).json();
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(
    report.readerSha256,
  );
  expect(errors).toEqual([]);
});
