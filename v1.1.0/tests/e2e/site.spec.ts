import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("synthesis decoration stays within its column and never covers the proposal", async ({
  page,
}) => {
  await page.goto("/?scene=synthesis");
  await expect(page.locator(".synthesis-layout h2")).toBeVisible();
  const geometry = await page.evaluate(() => {
    const mark = document.querySelector<SVGElement>(".synthesis-mark")!;
    const copy = document.querySelector<HTMLElement>(
      ".synthesis-layout > div",
    )!;
    const icon = mark.getBoundingClientRect();
    const text = copy.getBoundingClientRect();
    return {
      hidden: getComputedStyle(mark).display === "none",
      width: icon.width,
      height: icon.height,
      right: icon.right,
      textLeft: text.left,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  if (!geometry.hidden) {
    expect(geometry.width).toBeGreaterThan(0);
    expect(geometry.width).toBeLessThanOrEqual(144);
    expect(Math.abs(geometry.width - geometry.height)).toBeLessThan(1);
    expect(geometry.right).toBeLessThan(geometry.textLeft);
  }
  expect(geometry.overflow).toBe(false);
  const link = page.locator("#synthesis .inline-link");
  await link.click();
  await expect(page).toHaveURL(/\/research\/conditional-partnership$/);
  await expect(page.locator("#P-006")).toBeVisible();
});
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

test("folder opening can be canceled and a selected folder survives a reader round trip", async ({
  page,
}) => {
  await page.goto("/archive");
  await page.locator(".folder").first().focus();
  await page.keyboard.press("End");
  await expect(page.locator(".folder").last()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("status").filter({ hasText: "Opening excerpt" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/archive$/);
  await expect(page.locator(".folder").last()).toBeFocused();
  await expect(page.locator(".folder.opening")).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/archive\/conditional-partnership$/);
  await page.goBack();
  await expect(page.locator(".folder.selected")).toHaveAccessibleName(/06/);
  await page.locator(".folder").last().focus();
  await page.keyboard.press("Home");
  await expect(page.locator(".folder").first()).toBeFocused();
});

test("both interface languages fit the release viewport matrix", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "The viewport matrix runs once in desktop Chromium",
  );
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ["EN", "KO"]) {
      await page.goto("/");
      await page
        .getByRole("button", { name: language, exact: true })
        .first()
        .click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${width}px ${language}`,
      ).toBeTruthy();
      const title = await page.locator(".hero h1").boundingBox();
      const figure = await page.locator(".hero-visual").boundingBox();
      expect(title).not.toBeNull();
      expect(figure).not.toBeNull();
      if (title && figure)
        expect(
          title.x + title.width <= figure.x + 1 ||
            title.y + title.height <= figure.y + 1,
        ).toBeTruthy();
    }
  }
});
test("original files load on demand and unavailable storage preserves reading", async ({
  page,
  request,
}) => {
  await page.route(
    "**/api/public/assets?project=corporate-resilience",
    (route) => route.fulfill({ json: { status: "available", assets: [] } }),
  );
  let assetRequests = 0;
  page.on("request", (r) => {
    if (r.url().includes("/api/public/assets")) assetRequests++;
  });
  await page.goto("/archive/corporate-resilience");
  expect(assetRequests).toBe(0);
  await page.getByRole("button", { name: "View original files" }).click();
  await expect(
    page.getByRole("region", { name: "Original files" }),
  ).toContainText(/No approved original|storage is unavailable/i);
  await expect(page.locator("#P-001")).toContainText("대리 지표");
  const response = await request.get(
    "/api/public/assets?project=corporate-resilience",
  );
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(
    (await request.get("/api/public/assets?project=unknown")).status(),
  ).toBe(400);
  const original = await request.get(
    `/api/public/assets/test-missing-${Date.now()}/open`,
    {
      maxRedirects: 0,
    },
  );
  expect([404, 503]).toContain(original.status());
  expect(original.headers()["cache-control"]).toContain("no-store");
});
test("plain original file index works without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/archive/corporate-resilience`);
  await page.getByRole("link", { name: /Original files \/ 원본/ }).click();
  await expect(page).toHaveURL(/originals\/corporate-resilience/);
  await expect(
    page.getByText("Published source files / 공개 승인된 원본 파일"),
  ).toBeVisible();
  await context.close();
});
