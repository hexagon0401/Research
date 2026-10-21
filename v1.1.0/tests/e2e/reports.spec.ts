import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("report catalogue opens a complete transcript, page figures and the reading PDF", async ({
  page,
  request,
}) => {
  await page.goto("/reports");
  await expect(page.locator(".report-list > li")).toHaveCount(13);
  await page.getByRole("searchbox").fill("S17");
  await expect(page.locator(".report-list > li")).toHaveCount(1);
  await page.locator(".report-list h2 a").click();
  await expect(page).toHaveURL(/\/reports\/S17$/);
  await expect(page.locator("#transcript .transcript-section")).toHaveCount(7);
  await page.locator("a[href='#S17-L003']").first().click();
  await page.locator("#S17-L003 .report-preview summary").click();
  await expect(page.locator("#S17-L003 img")).toBeVisible();
  const pdf = page.getByRole("link", { name: /Open de-identified PDF/ });
  await expect(pdf).toHaveAttribute(
    "href",
    "/report-pdfs/s17/rev-001/reader.pdf",
  );
  const response = await request.get((await pdf.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(response.headers()["cache-control"]).toContain("immutable");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibility.violations.map((v) => v.id)).toEqual([]);
});

test("report reading survives no JavaScript and preserves distinct original identities", async ({
  browser,
  baseURL,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/reports`);
  await page.locator(".report-list h2 a").first().click();
  await expect(page.locator("#transcript")).toContainText("기업패권");
  await expect(page.locator(".transcript-memo").first()).toContainText(
    "원문 메모",
  );
  await expect(
    page.locator("a[href='/report-pdfs/s00/rev-001/reader.pdf']"),
  ).toBeVisible();
  const a = await (await request.get("/api/public/reports/S03")).json();
  const b = await (await request.get("/api/public/reports/S13")).json();
  expect(a.sourcePageCount).toBe(5);
  expect(b.sourcePageCount).toBe(6);
  expect(a.originalSha256).not.toBe(b.originalSha256);
  expect((await request.get("/api/public/reports/S10")).status()).toBe(404);
  await context.close();
});

test("home does not fetch report files and original-file links resolve to reviewed static copies", async ({
  page,
  request,
}) => {
  const files: string[] = [];
  page.on("request", (r) => {
    if (/report-pdfs|report-media/.test(r.url())) files.push(r.url());
  });
  await page.goto("/");
  expect(files).toEqual([]);
  await page.goto("/archive/conditional-partnership");
  await expect(
    page.locator(".report-related a[href='/reports/S00']"),
  ).toBeVisible();
  await page.getByRole("button", { name: "View original files" }).click();
  const original = page.locator(
    ".original-files-panel a[href='/api/public/assets/s00-reader-rev-001/open']",
  );
  await expect(original).toBeVisible();
  const redirect = await request.get(
    "/api/public/assets/s00-reader-rev-001/open",
    { maxRedirects: 0 },
  );
  expect(redirect.status()).toBe(302);
  expect(redirect.headers().location).toBe(
    "/report-pdfs/s00/rev-001/reader.pdf",
  );
  expect(redirect.headers()["cache-control"]).toContain("no-store");
});
