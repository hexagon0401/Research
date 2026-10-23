import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function china(page: Page) {
  await page.goto("/#motion-china");
  await page
    .locator("#motion-china")
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await expect(page.locator("#motion-china")).toHaveAttribute(
    "data-motion-ready",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
}
async function seek(page: Page, value: number) {
  await page
    .getByRole("slider", { name: "China story progress" })
    .evaluate((el: HTMLInputElement, v) => {
      el.value = String(v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
}
test("six mechanism groups and full chronological source records are present", async ({
  page,
}) => {
  await page.goto("/");
  const groups = await page
    .locator("[data-motion-group]")
    .evaluateAll((es) => [
      ...new Set(es.map((e) => (e as HTMLElement).dataset.motionGroup)),
    ]);
  expect(groups).toEqual([
    "origin",
    "america",
    "china",
    "korea",
    "method",
    "synthesis",
  ]);
  await expect(page.locator("[data-essay-beat]")).toHaveCount(18);
  await expect(page.locator(".china-step-list>li")).toHaveCount(7);
  await expect(page.locator(".motion-study-roles button")).toHaveCount(12);
  await expect(page.locator(".china-step-list")).toContainText("2021–2022");
  await expect(page.locator(".china-step-list")).toContainText(
    "not an observed track",
  );
});
test("China has continuous line and traveler progress, correct dates and reversible scrubbing", async ({
  page,
}) => {
  await china(page);
  const root = page.locator("#motion-china"),
    path = root.locator('[data-route="0"]'),
    dot = root.locator('[data-traveler="0"]');
  await seek(page, 4);
  await expect(root).toHaveAttribute("data-phase", "0");
  await expect
    .poll(() =>
      path.evaluate((e) => parseFloat(getComputedStyle(e).strokeDashoffset)),
    )
    .toBeLessThan(1);
  const before = await path.evaluate((e) =>
    parseFloat(getComputedStyle(e).strokeDashoffset),
  );
  const first = await dot.getAttribute("transform");
  await seek(page, 9);
  await expect
    .poll(() =>
      path.evaluate((e) => parseFloat(getComputedStyle(e).strokeDashoffset)),
    )
    .toBeLessThan(before - 0.1);
  expect(await dot.getAttribute("transform")).not.toBe(first);
  await seek(page, 4);
  await expect
    .poll(async () =>
      Math.abs(
        (await path.evaluate((e) =>
          parseFloat(getComputedStyle(e).strokeDashoffset),
        )) - before,
      ),
    )
    .toBeLessThan(0.04);
  await seek(page, 65);
  await expect(root).toHaveAttribute("data-phase", "4");
  await expect(root.locator(".motion-date-row time")).toHaveText("2025-04-05");
  await expect(root.locator(".china-current-copy")).toContainText(
    "Canopy Sands",
  );
  await expect(root.locator(".china-current-copy a")).toHaveAttribute(
    "href",
    /S08-R002-P002/,
  );
});
test("small screens replay locally, range keyboard works and route detail stays schematic", async ({
  page,
}, info) => {
  test.skip(
    !info.project.use.isMobile,
    "Touch adaptation runs on mobile profiles",
  );
  await china(page);
  const root = page.locator("#motion-china");
  await expect(root).toHaveAttribute("data-pinned", "false");
  const y = await page.evaluate(() => scrollY);
  await seek(page, 36);
  await expect(root).toHaveAttribute("data-phase", "2");
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2);
  await root
    .getByRole("button", { name: "Route detail · schematic sequence" })
    .click();
  await expect(root.locator(".motion-route-detail")).toContainText(
    "Anshun → Yunnan → Namsang",
  );
  await expect(root.locator(".motion-route-detail")).toContainText(
    "not an observed track",
  );
  const slider = page.getByRole("slider", { name: "China story progress" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(root).toHaveAttribute("data-phase", "6");
});
test("explicit replay is interruptible and wheel scrolling stays native", async ({
  page,
}) => {
  await china(page);
  await seek(page, 4);
  const root = page.locator("#motion-china");
  await root.getByRole("button", { name: "Replay this step" }).click();
  await page.waitForTimeout(200);
  const a = Number(await root.getAttribute("data-progress"));
  await page.waitForTimeout(200);
  const b = Number(await root.getAttribute("data-progress"));
  expect(b).toBeGreaterThan(a);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(250);
  const c = await root.getAttribute("data-progress");
  await page.waitForTimeout(350);
  expect(await root.getAttribute("data-progress")).toBe(c);
});
test("real wheel scroll changes signal geometry in unpinned mechanisms", async ({
  page,
}) => {
  await page.goto("/");
  for (const id of [
    "capability",
    "korea-chips",
    "spatial-method",
    "synthesis",
  ]) {
    const figure = page.locator("#visual-" + id),
      stage = figure.locator(".mechanism-diagram");
    await stage.evaluate((e) =>
      scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 0.72),
    );
    await expect(figure).toHaveAttribute("data-motion-ready", "true");
    await page.waitForTimeout(200);
    const first = await figure.getAttribute("data-progress");
    await page.mouse.move(10, 300);
    await page.mouse.wheel(0, 130);
    await expect
      .poll(() => figure.getAttribute("data-progress"))
      .not.toBe(first);
    if (id === "synthesis") {
      await page.mouse.wheel(0, 500);
      await expect
        .poll(() => figure.getAttribute("data-active-step"))
        .toBe("2");
    }
    const moving = await figure
      .locator("[data-signal]")
      .evaluateAll((es) => es.some((e) => !!e.getAttribute("transform")));
    expect(moving).toBe(true);
  }
});
test("evidence lens and research perspectives affect the explanation and preserve source access", async ({
  page,
}) => {
  await page.goto("/?scene=spatial-method");
  const lens = page.getByRole("slider", {
    name: "Evidence and interpretation comparison",
  });
  await lens.focus();
  await page.keyboard.press("Home");
  await expect(page.locator(".method-lens")).toHaveCSS(
    "clip-path",
    "inset(0px 100% 0px 0px)",
  );
  await page.keyboard.press("End");
  await expect(page.locator(".method-lens")).toHaveCSS(
    "clip-path",
    "inset(0px 0% 0px 0px)",
  );
  await page.goto("/?scene=synthesis");
  await page.getByRole("button", { name: "identity", exact: true }).click();
  await expect(page.locator('[data-study-node="S08"]')).toHaveAttribute(
    "data-dimmed",
    "true",
  );
  const branch = page.locator('[data-study-node="S14"]');
  await branch.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator("#visual-synthesis .mechanism-selection"),
  ).toContainText("Philosophical");
  await expect(
    page.locator("#visual-synthesis .mechanism-selection a"),
  ).toHaveAttribute("href", /reports\/S14/);
  await page.keyboard.press("Escape");
  await expect(branch).toBeFocused();
});
test("reduced and no-JS modes retain all stages and source links", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await chinaStatic();
  async function chinaStatic() {
    await page.goto("/#motion-china");
    await expect(page.locator("#motion-china")).not.toHaveAttribute(
      "data-pinned",
      "true",
    );
  }
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const p = await context.newPage();
  await p.goto(baseURL + "/");
  await expect(p.locator(".china-step-list>li")).toHaveCount(7);
  await expect(
    p.locator('.china-step-list a[href*="S08-R002-P002"]'),
  ).not.toHaveCount(0);
  await expect(p.locator(".mechanism-steps")).toHaveCount(11);
  await p.locator("#us-mission .essay-citation").first().click();
  await expect(p.locator("#transcript")).toBeVisible();
  await context.close();
});
test("motion controls and complete page pass accessibility rules", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Accessibility pass runs once");
  await china(page);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
