import { test, expect } from "@playwright/test";

test("Arctic leaders never fill and screen-pixel labels remain bounded and separate", async ({
  page,
}) => {
  await page.goto("/?scene=china-arctic");
  const figure = page.locator("#visual-china-arctic");
  await expect(figure.locator(".map-label:not(:disabled)")).toHaveCount(3);
  const labels = figure.locator(".map-label:not(:disabled)");
  await expect(labels.first()).toHaveAccessibleName("Nuuk");
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        labels.first().evaluate((e) => e.getBoundingClientRect().width),
      )
      .toBeGreaterThan(0);
    const info = await labels.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return {
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
          size: parseFloat(s.fontSize),
        };
      }),
    );
    for (const a of info) {
      expect(a.size).toBeGreaterThanOrEqual(14);
      expect(a.x).toBeGreaterThanOrEqual(0);
      expect(a.x + a.w).toBeLessThanOrEqual(width + 1);
      for (const b of info) {
        if (a === b) continue;
        expect(
          a.x + a.w <= b.x + 1 ||
            b.x + b.w <= a.x + 1 ||
            a.y + a.h <= b.y + 1 ||
            b.y + b.h <= a.y + 1,
        ).toBe(true);
      }
    }
    expect(
      await figure
        .locator(".map-leader")
        .evaluateAll((els) =>
          els.every(
            (el) =>
              el.getAttribute("fill") === "none" &&
              getComputedStyle(el).fill === "none",
          ),
        ),
    ).toBe(true);
  }
  await labels.first().focus();
  await page.keyboard.press("Enter");
  await expect(figure.locator(".case-selection")).toContainText("CCCC");
  await expect(figure.locator(".case-selection a")).toHaveAttribute(
    "href",
    /S08-R001-P010/,
  );
  await page.keyboard.press("Escape");
  await expect(labels.first()).toBeFocused();
});

test("all eighteen figures, three reserved expansions and study roles survive the full reading matrix", async ({
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
      await expect(page.locator("[data-visual-for]")).toHaveCount(18);
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
  const passage = page.locator("#us-mission [data-reading-passage]").first();
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
      passage.evaluate((el) =>
        Math.abs(el.getBoundingClientRect().top - before),
      ),
    )
    .toBeLessThan(12);
  await page.locator(".story-menu summary").click();
  await page.locator(".story-menu-language button[lang=ko]").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      passage.evaluate((el) =>
        Math.abs(el.getBoundingClientRect().top - before),
      ),
    )
    .toBeLessThan(24);
  await passage.locator(".essay-citation").click();
  await page.goBack();
  await expect
    .poll(() =>
      passage.evaluate((el) =>
        Math.abs(el.getBoundingClientRect().top - before),
      ),
    )
    .toBeLessThan(24);
});

test("study branches and connection explanations work by keyboard and touch", async ({
  page,
}) => {
  await page.goto("/?scene=synthesis");
  const figure = page.locator("#visual-synthesis");
  const branch = figure.locator('[data-study-node="S08"]');
  await branch.focus();
  await page.keyboard.press("Enter");
  await expect(figure.locator(".case-selection")).toContainText(
    "Spatial analysis",
  );
  await expect(figure.locator(".case-selection a")).toHaveAttribute(
    "href",
    /reports\/S08/,
  );
  await page.keyboard.press("Escape");
  await expect(branch).toBeFocused();
  await page.goto("/?scene=us-finance");
  await page.locator("#visual-us-finance .relation-edge").first().click();
  await expect(
    page.locator("#visual-us-finance .case-selection"),
  ).toContainText("Treasury holdings");
});

test("three emphasis scenes stay in normal flow during wheel reading", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Visual scroll review runs once");
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const id of ["capability", "china-arctic", "synthesis"]) {
    const figure = page.locator(`#visual-${id}`);
    await figure.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(10, 250);
    await page.mouse.wheel(0, 180);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(before);
    await page.mouse.wheel(0, -180);
    await page.waitForTimeout(200);
    expect(await figure.evaluate((el) => getComputedStyle(el).position)).toBe(
      "static",
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
  await expect(p.locator("[data-visual-for]")).toHaveCount(18);
  await expect(
    p.locator("#visual-synthesis .static-visual-explanation li"),
  ).toHaveCount(13);
  await expect(
    p.locator("#visual-china-arctic .static-visual-explanation"),
  ).toContainText("CCCC");
  await p.locator("#us-mission .essay-citation").first().click();
  await expect(p.locator("#transcript")).toBeVisible();
  await context.close();
});
