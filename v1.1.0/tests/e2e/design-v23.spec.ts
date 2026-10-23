import { test, expect } from "@playwright/test";

test("Chinese relationship leaders never fill and the reference legend stays readable", async ({
  page,
}) => {
  await page.goto("/#motion-china");
  const figure = page.locator("#motion-china");
  await expect(figure.locator(".china-step-list")).toContainText("Nuuk");
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await figure
        .locator(".china-map path:not(.map-region)")
        .evaluateAll((es) =>
          es.every(
            (e) =>
              e.getAttribute("fill") === "none" &&
              getComputedStyle(e).fill === "none",
          ),
        ),
    ).toBe(true);
    for (const label of await figure
      .locator(".motion-place-legend button")
      .all())
      expect(
        await label.evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
      ).toBeGreaterThanOrEqual(14);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
});

test("all eighteen arguments and sixteen figures, three reserved expansions and study roles survive the full reading matrix", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Matrix runs once");
  test.setTimeout(180000);
  for (const width of [320, 390, 768, 1024, 1440, 1920])
    for (const language of ["en", "ko"]) {
      await page.setViewportSize({ width, height: width === 1024 ? 600 : 900 });
      await page.goto("/");
      await page.evaluate((lang) => {
        localStorage.setItem("iir-language", lang);
      }, language);
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("lang", language);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("[data-visual-for]")).toHaveCount(16);
      await expect(page.locator(".emphasis-visual")).toHaveCount(3);
      await expect(page.locator(".convergence-branches button")).toHaveCount(
        12,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${width} ${language}`,
      ).toBe(true);
      if (width >= 1024) {
        await page.evaluate(() => (document.documentElement.style.zoom = "2"));
        await page.waitForTimeout(150);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `200% ${width} ${language}`,
        ).toBe(true);
        await page.evaluate(() => (document.documentElement.style.zoom = ""));
      }
    }
});

test("source round trips and language changes keep the exact passage", async ({
  page,
}) => {
  await page.goto("/?scene=us-mission");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#detail-us-mission > summary").click();
  const passage = page.locator("#us-mission .essay-source-passage").first();
  await passage.evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 130,
      behavior: "instant",
    }),
  );
  await passage.locator(".essay-citation").scrollIntoViewIfNeeded();
  const before = await passage.evaluate((el) => el.getBoundingClientRect().top);
  await passage.locator(".essay-citation").click();
  await expect(page).toHaveURL(/\/reports\//);
  await page.locator("[data-return-to-essay]").first().click();
  await expect
    .poll(() =>
      passage.evaluate(
        (el, offset) => Math.abs(el.getBoundingClientRect().top - offset),
        before,
      ),
    )
    .toBeLessThan(12);
  // Playwright locator.click() scrolls sticky controls into view, shifting the document
  // before the locale change. Use the actual keyboard path without that automation scroll.
  await page
    .locator(".story-menu summary")
    .evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
  await page.keyboard.press("Enter");
  await page
    .locator(".story-menu-language button[lang=ko]")
    .evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      passage.evaluate(
        (el, offset) => Math.abs(el.getBoundingClientRect().top - offset),
        before,
      ),
    )
    .toBeLessThan(24);
  await passage.locator(".essay-citation").scrollIntoViewIfNeeded();
  const beforeBack = await passage.evaluate(
    (el) => el.getBoundingClientRect().top,
  );
  await passage.locator(".essay-citation").click();
  await expect(page).toHaveURL(/\/reports\//);
  await page.goBack();
  await expect(page.locator(".research-essay")).toBeVisible();
  await expect
    .poll(() =>
      passage.evaluate(
        (el, offset) => Math.abs(el.getBoundingClientRect().top - offset),
        beforeBack,
      ),
    )
    .toBeLessThan(24);
});

test("study branches and connection explanations work by keyboard and touch", async ({
  page,
}, info) => {
  await page.goto("/?scene=synthesis");
  const figure = page.locator("#visual-synthesis");
  const branch = figure.locator('[data-study-node="S08"]');
  await expect(branch).toBeEnabled();
  await branch.focus();
  await page.keyboard.press("Enter");
  await expect(figure.locator(".case-selection")).toContainText(
    "Spatial inquiry",
  );
  await expect(figure.locator(".case-selection a")).toHaveAttribute(
    "href",
    /reports\/S08/,
  );
  await page.keyboard.press("Escape");
  await expect(branch).toBeFocused();
  await page.goto("/?scene=us-finance");
  const edge = page
    .locator('#visual-us-finance [data-graph-node="token"]')
    .first();
  if (info.project.use.hasTouch) await edge.tap();
  else await edge.click();
  await expect(
    page.locator("#visual-us-finance .case-selection"),
  ).toContainText("reserve assets");
});

test("three emphasis scenes stay in normal flow during wheel reading", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Visual scroll review runs once");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const id of ["capability", "china-arctic", "synthesis"]) {
    const figure = page.locator(
      id === "china-arctic" ? "#motion-china" : `#visual-${id}`,
    );
    await figure.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(10, 250);
    await page.mouse.wheel(0, 180);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(before);
    await page.mouse.wheel(0, -180);
    await page.waitForTimeout(200);
    expect(["static", "relative"]).toContain(
      await figure.evaluate((el) => getComputedStyle(el).position),
    );
    await figure.screenshot({ path: `.local/validation/${id}-desktop.png` });
  }
});

test("static modes retain every case, explanation and source without animation", async ({
  browser,
  baseURL,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".scene-terrain")
      .evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).animationName === "none"),
      ),
  ).toBe(true);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const p = await context.newPage();
  await p.goto(`${baseURL}/`);
  await expect(p.locator("[data-visual-for]")).toHaveCount(16);
  await expect(
    p.locator("#visual-synthesis .motion-study-roles > button"),
  ).toHaveCount(12);
  await expect(p.locator("#motion-china .china-step-list")).toContainText(
    "CCCC",
  );
  await p.locator("#detail-us-mission > summary").click();
  await p.locator("#us-mission .essay-citation").first().click();
  await expect(p.locator("#transcript")).toBeVisible();
  await context.close();
});

test("the first-fold globe reuses visible local vector geometry", async ({
  page,
}, info) => {
  await page.goto("/");
  const globe = page.locator(".hero-atlas use");
  await expect(globe).toHaveAttribute("href", "/visuals/globe.svg#terrain");
  await expect
    .poll(() =>
      globe.evaluate((el) => (el as SVGGraphicsElement).getBBox().width),
    )
    .toBeGreaterThan(300);
  if (info.project.name === "desktop")
    await page
      .locator(".essay-hero")
      .screenshot({ path: ".local/validation/hero-desktop.png" });
});
