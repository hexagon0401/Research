import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("narrative and comparative atlas expose the framework", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The architecture",
  );
  await expect(page.locator("main>section")).toHaveCount(7);
  await page.getByRole("button", { name: "02 China" }).click();
  await expect(page.locator(".region-detail")).toContainText(
    "Investment is not automatically evidence",
  );
  await page.getByRole("button", { name: "Mission & accountability" }).click();
  await expect(page.locator(".framework-detail")).toContainText(
    "democratic oversight",
  );
  expect(errors).toEqual([]);
});
test("archive search, categories, sorting and clear state", async ({
  page,
}) => {
  await page.goto("/archive");
  await expect(page.locator(".collection-row")).toHaveCount(6);
  await page.getByRole("searchbox").fill("nothing-matches");
  await expect(
    page.getByRole("heading", { name: "Nothing on this shelf, yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".collection-row")).toHaveCount(6);
  await page
    .getByRole("combobox", { name: "CATEGORY", exact: true })
    .selectOption("Ethics & governance");
  await expect(page.locator(".collection-row")).toHaveCount(2);
  await page
    .getByRole("combobox", { name: "SORT BY", exact: true })
    .selectOption("title");
  await expect(page.locator(".collection-row").first()).toContainText(
    "An advantage needs a purpose",
  );
});
test("shelf keyboard opens a reader and source rail, Back restores the archive", async ({
  page,
}) => {
  await page.goto("/archive");
  await page.locator(".folder").first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".folder").nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/archive\/technology-and-advantage/);
  await page.getByRole("button", { name: "EN", exact: true }).last().click();
  await expect(page.getByRole("status")).toContainText("Translation pending");
  await expect(page.locator("#P-002>p")).toBeVisible();
  await page.getByText("Show paragraph summary").click();
  await expect(page.locator(".paragraph-summary p")).toBeVisible();
  await page.getByRole("button", { name: /Inspect provenance/ }).click();
  await expect(page.locator("#provenance")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/archive$/);
});
test("deep links, source pages, UI language and reload work", async ({
  page,
}) => {
  await page.goto("/research/state-firm-models#P-005");
  await expect(page.locator("#P-005")).toBeVisible();
  await page.reload();
  await expect(page.locator("#P-005")).toContainText("비교 가설");
  await page.getByRole("button", { name: "KO", exact: true }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "미국·중국",
  );
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "미국·중국",
  );
  await page.goto("/library/integration-handoff");
  await expect(page.getByText("Available planning excerpts")).not.toBeVisible();
  await expect(page.getByText("열람 가능한 작업계획 발췌문")).toBeVisible();
});
test("library searches real metadata and does not invent full text", async ({
  page,
}) => {
  await page.goto("/library");
  await page.getByRole("searchbox").fill("Thiel");
  await expect(page.locator(".collection-row")).toHaveCount(1);
  await page.getByRole("link", { name: /Zero to One/ }).click();
  await expect(page.getByText("Not supplied", { exact: true })).toBeVisible();
  await expect(page.getByText("Not available", { exact: true })).toBeVisible();
});
test("reduced motion preference, accessible markup and no page overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  for (const route of [
    "/",
    "/archive",
    "/library",
    "/archive/corporate-resilience",
    "/methods",
    "/about",
    "/accessibility",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBeTruthy();
  }
});
test("content and document navigation survive JavaScript disabled", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The architecture",
  );
  await page.goto(`${baseURL}/archive`);
  await page.locator(".collection-row").first().click();
  await expect(page.locator("#P-001")).toContainText("대리 지표");
  await context.close();
});
test("unknown documents fail cleanly", async ({ page }) => {
  const response = await page.goto("/archive/not-a-document");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "still unwritten",
  );
});
test("intentional archive shortcut preserves vertical reading and can be escaped", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("body").click({ position: { x: 10, y: 250 } });
  await page.keyboard.press("a");
  await expect(page.locator(".folder").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#archive-entry")).toBeFocused();
});
test("public endpoints preserve source status and never expose unavailable translations", async ({
  request,
}) => {
  const manifest = await request.get("/api/public/manifest");
  expect(manifest.ok()).toBeTruthy();
  const data = await manifest.json();
  expect(data.projects).toHaveLength(6);
  const claim = await request.get("/api/public/claims/CLAIM-01");
  expect((await claim.json()).verificationStatus).toBe("UNVERIFIED");
  const doc = await request.get("/api/public/documents/corporate-resilience");
  const document = await doc.json();
  expect(document.paragraphs[0].en).toBeNull();
  expect(document.originalAsset).toBeNull();
  expect(document.sourceId).toBe("HANDOFF-01");
  expect((await request.get("/api/public/claims/not-real")).status()).toBe(404);
  expect(
    (
      await request.post("/api/public/sources", { data: { title: "test" } })
    ).status(),
  ).toBe(405);
});
test("horizontal wheel opens the inline shelf while a vertical wheel keeps native reading", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.move(10, 250);
  await page.mouse.wheel(0, 120);
  await expect(page.locator(".folder").first()).not.toBeFocused();
  await page.waitForTimeout(150);
  await page.mouse.wheel(80, 0);
  await expect(page.locator(".folder").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#archive-entry")).toBeFocused();
});
