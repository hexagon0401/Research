import { test, expect } from "@playwright/test";

test("the essay replaces slides with a connected argument and thirteen real studies", async ({
  page,
}) => {
  const errors: string[] = [];
  const reportsRequested: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (
      /^\/(reports\/|report-pdfs\/|vendor\/pdfjs\/|api\/public\/reports)/.test(
        new URL(r.url()).pathname,
      )
    )
      reportsRequested.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("national power");
  await expect(page.locator(".chapter-label,.scene-progress")).toHaveCount(0);
  await expect(page.locator("[data-research-node]")).toHaveCount(13);
  await expect(page.locator("#us-finance")).toContainText("GENIUS Act");
  await expect(page.locator("#china-myanmar")).toContainText("NORINCO");
  await expect(page.locator("#korea-chips")).toContainText("SK Hynix");
  await expect(page.locator(".essay-reading-meta")).toContainText(
    /\d+ min read/,
  );
  expect(errors).toEqual([]);
  await page.locator("#integration").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(reportsRequested).toEqual([]);
});
test("country navigation and source links work with keyboard and native anchors", async ({
  page,
}) => {
  await page.goto("/");
  const china = page.locator('.essay-outline a[href="#china-ownership"]');
  await expect(page.locator("#main")).toHaveAttribute("data-enhanced", "true");
  await china.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#china-ownership$/);
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "china-ownership",
  );
  const link = page.locator("#china-myanmar .essay-citation").first();
  await link.click();
  await expect(page).toHaveURL(
    /reports\/S08\?from=china-myanmar#S08-R003-P001/,
  );
  await expect(page.locator("#S08-R003-P001 .reading-ko")).toContainText(
    "미얀마",
  );
  await page.locator("[data-return-to-essay]").first().click();
  await expect(page).toHaveURL(/#china-myanmar$/);
});
test("case figures retain matching geometry, caption and source at every boundary", async ({
  page,
}) => {
  await page.goto("/");
  const ids = await page
    .locator("[data-essay-beat]")
    .evaluateAll((els) => els.map((e) => e.id));
  for (const id of [...ids, ...ids.toReversed()]) {
    await page.evaluate((id) => {
      const el = document.getElementById(id)!;
      scrollTo({
        top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.25,
        behavior: "instant",
      });
    }, id);
    await expect(page.locator("#main")).toHaveAttribute("data-scene", id);
    const figure = page.locator(`[data-visual-for="${id}"]`);
    await expect(figure.locator("figcaption h3")).not.toBeEmpty();
    await expect(
      figure.locator(".case-source-links a").first(),
    ).toHaveAttribute("href", new RegExp(`from=${id}`));
    await expect(
      figure.locator(
        ".terrain-world .terrain-arctic,.terrain-arctic .terrain-world",
      ),
    ).toHaveCount(0);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});
test("motion preferences retain reading position and system reduction wins", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("iir-reduced-motion", "false"),
  );
  await page.goto("/?scene=korea-chips");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "korea-chips",
  );
  await page.evaluate(() => document.fonts.ready);
  const before = await page
    .locator("#korea-chips")
    .evaluate((el) => el.getBoundingClientRect().top);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#main")).toHaveAttribute("data-motion", "reduced");
  await expect(
    page.getByRole("button", { name: /Reduce motion/ }),
  ).toBeDisabled();
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "korea-chips",
  );
  await expect
    .poll(() =>
      page
        .locator("#korea-chips")
        .evaluate(
          (el, offset) => Math.abs(el.getBoundingClientRect().top - offset),
          before,
        ),
    )
    .toBeLessThan(12);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#main")).toHaveAttribute("data-motion", "full");
});
test("stopping the scroll stops animation work and wheel events remain native", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const idle = await page.evaluate(async () => {
    let n = 0;
    const original = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      n++;
      return original(cb);
    };
    await new Promise((r) => setTimeout(r, 180));
    window.requestAnimationFrame = original;
    return n;
  });
  expect(idle).toBe(0);
  await page.mouse.move(10, 250);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 250);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollSnapType,
    ),
  ).toBe("none");
});
test("switching interface language keeps the reader within the same argument", async ({
  page,
}) => {
  await page.goto("/?scene=us-mission");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "us-mission",
  );
  // Change the interface without Playwright first scrolling the non-sticky
  // global header into view; this checks the layout's position restoration.
  await page
    .getByRole("button", { name: "KO", exact: true })
    .first()
    .dispatchEvent("click");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "us-mission",
  );
  await expect(page.locator("#us-mission h2")).toContainText("미국");
});
