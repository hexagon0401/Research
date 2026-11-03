import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("quick path preserves anchors, disclosure navigation and browser history", async ({
  page,
}) => {
  await page.goto("/?mode=quick");
  await expect(page.locator("main")).toHaveAttribute(
    "data-reading-mode",
    "quick",
  );
  await expect(page.locator(".chapter-quick")).toHaveCount(6);
  await expect(page.locator("[data-essay-beat]")).toHaveCount(18);
  await expect(page.locator(".chapter-reasoning[open]")).toHaveCount(0);
  const words = await page
    .locator("main")
    .evaluate(
      (el) =>
        [
          ...new Intl.Segmenter("en", { granularity: "word" }).segment(
            (el as HTMLElement).innerText,
          ),
        ].filter((s) => s.isWordLike).length,
    );
  expect(words).toBeLessThan(3000);
  await page.locator('.chapter-quick a[href="#us-finance"]').click();
  await expect(page.locator("#us-finance")).toBeVisible();
  await expect(
    page
      .locator("#us-finance")
      .locator(
        "xpath=ancestor::details[contains(@class,'chapter-reasoning')] ",
      ),
  ).toHaveAttribute("open", "");
  await page
    .locator(".reading-controls")
    .getByRole("button", { name: "Full read", exact: true })
    .click();
  await expect(page.locator("main")).toHaveAttribute(
    "data-reading-mode",
    "full",
  );
  await expect(page.locator(".chapter-reasoning[open]")).toHaveCount(6);
  await page.goBack();
  await expect(page.locator("main")).toHaveAttribute(
    "data-reading-mode",
    "quick",
  );
  await page
    .locator(".reading-controls")
    .getByRole("button", { name: "Keyboard help" })
    .click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  await expect(page.locator("dialog[open]")).toHaveAccessibleName(
    "Reading shortcuts",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .include("dialog[open]")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(
    page
      .locator(".reading-controls")
      .getByRole("button", { name: "Keyboard help" }),
  ).toBeFocused();
});
test("source guide, reviewer sources, sharing and citation have real destinations", async ({
  page,
  request,
  context,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-guide-source]")).toHaveCount(3);
  await page.locator("#detail-us-finance > summary").click();
  await expect(
    page.locator('#detail-us-finance .essay-citation[href*="S00-R005-P017"]'),
  ).toHaveCount(1);
  await expect(
    page.locator("#detail-us-finance .essay-source-excerpts"),
  ).toContainText("Tether");
  await page.goto("/reviewers");
  await expect(page.locator(".reviewer-pdfs li")).toHaveCount(13);
  await expect(page.locator(".methods-at-glance tbody tr")).toHaveCount(4);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "KO", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("질문과 근거를 먼저.");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const image = await request.get("/opengraph-image");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const html = await (await request.get("/")).text();
  expect(html).toContain('name="robots" content="noindex, follow"');
  expect(html).toContain('property="og:image"');
  expect(html).toContain('name="twitter:card"');
  await page.goto("/reports/S17");
  await page.getByRole("button", { name: "KO", exact: true }).click();
  // Denied clipboard remains useful through a selectable citation, rather than a false success.
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
    }),
  );
  await page.locator(".citation-control button").click();
  await expect(page.locator(".citation-control textarea")).toContainText(
    "/reports/S17",
  );
});
test("no JavaScript retains all full arguments even with a quick query", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/?mode=quick`);
  await expect(page.locator(".chapter-reasoning[open]")).toHaveCount(6);
  await expect(page.locator("#us-finance")).toBeVisible();
  await expect(page.locator("[data-guide-source]")).toHaveCount(3);
  await context.close();
});
test("quick source returns keep each entry and its reading mode", async ({
  page,
}) => {
  for (const [anchor, report, scene] of [
    ["S06-R006-P002", "S06", "survival"],
    ["S16-R002-P003", "S16", "korea-chips"],
    ["S17-R003-P001", "S17", "spatial-method"],
  ]) {
    await page.goto("/?mode=quick");
    await expect(page.locator("main")).toHaveAttribute(
      "data-reading-mode",
      "quick",
    );
    const entry = page.locator(`[data-guide-source="${anchor}"]`);
    await entry.locator('a[href^="/reports/"]').click();
    await page.waitForURL(new RegExp(`reports/${report}`));
    await expect(
      page.locator("[data-return-to-essay]").first(),
    ).toHaveAttribute("href", `/?mode=quick#${scene}`);
    await page.locator("[data-return-to-essay]").first().click();
    await page.waitForURL(new RegExp(`mode=quick#${scene}`));
    await expect(page.locator("main")).toHaveAttribute(
      "data-reading-mode",
      "quick",
    );
    await expect(entry).toBeVisible();
    await expect
      .poll(() =>
        entry.evaluate((el) =>
          Math.abs(
            el.getBoundingClientRect().top -
              JSON.parse(sessionStorage.getItem("iir-essay-return")!).offset,
          ),
        ),
      )
      .toBeLessThan(24);
  }
});

test("a shared quick anchor opens its context and keeps the path in Korean", async ({
  page,
}) => {
  await page.goto("/?mode=quick#korea-chips");
  await expect(page.locator("main")).toHaveAttribute(
    "data-reading-mode",
    "quick",
  );
  await expect(page.locator("#korea-chips")).toBeVisible();
  await expect(
    page.locator('.chapter-opening-label[role="heading"]'),
  ).toHaveCount(6);
  await page
    .getByRole("button", { name: "KO", exact: true })
    .evaluate((el) => (el as HTMLButtonElement).click());
  await expect(page.locator("main")).toHaveAttribute(
    "data-reading-mode",
    "quick",
  );
  await expect(page.locator("#korea-chips")).toBeVisible();
  expect(page.url()).toContain("?mode=quick#korea-chips");
});
test("visible facts do not repeat within an argument in either language", async ({
  page,
}) => {
  await page.goto("/");
  for (const lang of ["EN", "KO"]) {
    await page.getByRole("button", { name: lang, exact: true }).click();
    const duplicates = await page
      .locator("[data-essay-beat]")
      .evaluateAll((beats) =>
        beats.flatMap((beat) => {
          const texts = [
            ...beat.querySelectorAll(".case-facts > li, .scene-facts > li"),
          ]
            .filter((el) => el.closest("[data-essay-beat]") === beat)
            .map((el) =>
              el.textContent!.normalize("NFKC").replace(/\s+/g, " ").trim(),
            );
          const seen = new Set<string>();
          return texts.flatMap((text) => {
            if (seen.has(text)) return [{ beat: beat.id, text }];
            seen.add(text);
            return [];
          });
        }),
      );
    expect(duplicates, lang).toEqual([]);
  }
});
