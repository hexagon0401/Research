import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import inventory from "../../src/config/emphasis.json";
async function seek(page: Page, id: string, value: number) {
  const root = page.locator(id);
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await root.evaluate((el, v) => {
    const steps = [...el.querySelectorAll<HTMLElement>(".scene-steps>li")];
    const line = parseFloat(
      getComputedStyle(el).getPropertyValue("--scene-reading-line"),
    );
    const bounds = steps.map(
      (e) => e.getBoundingClientRect().top + scrollY - line,
    );
    bounds[0] = +(el as HTMLElement).dataset.sceneStart!;
    bounds.push(+(el as HTMLElement).dataset.sceneEnd!);
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length));
    scrollTo(
      0,
      bounds[i] + (v * steps.length - i) * (bounds[i + 1] - bounds[i]),
    );
  }, value);
  await expect
    .poll(async () =>
      Math.abs(+(await root.getAttribute("data-progress"))! - value),
    )
    .toBeLessThan(0.004);
  return root;
}
test("exact bilingual emphasis has a bounded inventory and identical rendered text without wrappers", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  for (const lang of ["en", "ko"] as const) {
    await page
      .getByRole("button", { name: lang.toUpperCase(), exact: true })
      .click();
    for (const entry of inventory) {
      const span = page.locator(`[data-emphasis="${entry.id}"]`);
      await expect(span).toHaveCount(entry.approved ? 1 : 0);
      if (entry.approved) await expect(span).toHaveText(entry[lang]);
    }
    expect(
      await page.evaluate(() => {
        const before = document.body.innerText;
        document
          .querySelectorAll("[data-emphasis]")
          .forEach((el) => el.replaceWith(...el.childNodes));
        return before === document.body.innerText;
      }),
    ).toBe(true);
    await page.reload();
  }
  expect(errors).toEqual([]);
});
test("source figures retain qualifiers, causal caution and real destinations", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-figure-source]")).toHaveCount(3);
  const card = page.locator('[data-figure-source="S16-R002-P003"]');
  await expect(card).toContainText("record USD 173.48 billion in 2025");
  await expect(card.locator("blockquote")).toContainText(
    "These figures alone do not establish",
  );
  await expect(
    page.locator('[data-figure-source="S08-R003-P001"]'),
  ).toContainText("approximately USD 260 million");
  for (const href of await page
    .locator("[data-figure-source] a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")!))) {
    const result = await request.get(href);
    expect(result.ok()).toBe(true);
    expect(await result.text()).toContain(href.split("#")[1]);
  }
  await card.scrollIntoViewIfNeeded();
  expect(
    (
      await new AxeBuilder({ page })
        .include("[data-figure-source]")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "KO", exact: true }).click();
  await expect(card).toContainText("1,734.8억 달러");
  await expect(card.locator("blockquote")).toContainText("단정할 수는 없다");
});
test("PCA signals move on real paths, convergence is staggered and both reverse with native scroll", async ({
  page,
}) => {
  await page.goto("/");
  const pca = await seek(page, "#visual-spatial-method", 3.21 / 4);
  const points = async () =>
    pca
      .locator("[data-pca-flow]")
      .evaluateAll((dots) =>
        dots.map((dot) => [dot.getAttribute("cx"), dot.getAttribute("cy")]),
      );
  const before = await points();
  await page.mouse.wheel(0, 12);
  await expect
    .poll(async () => JSON.stringify(await points()))
    .not.toBe(JSON.stringify(before));
  await seek(page, "#visual-spatial-method", 3.21 / 4);
  expect(await points()).toEqual(before);
  await seek(page, "#visual-spatial-method", 0.99);
  expect(
    await pca
      .locator("[data-pca-flow]")
      .evaluateAll((dots) =>
        dots.every((dot) => getComputedStyle(dot).visibility === "hidden"),
      ),
  ).toBe(true);
  const network = await seek(page, "#visual-synthesis", 2.4 / 4);
  const offsets = await network
    .locator("[data-draw-mask]")
    .evaluateAll((paths) =>
      paths.map((p) => getComputedStyle(p).strokeDashoffset),
    );
  expect(new Set(offsets).size).toBeGreaterThan(3);
  await seek(page, "#visual-synthesis", 0.99);
  const settled = await network.locator(".mechanism-diagram").innerHTML();
  await page.waitForTimeout(1100);
  expect(await network.locator(".mechanism-diagram").innerHTML()).toBe(settled);
});
test("reduced motion, no-JS and narrow screens keep the complete reading", async ({
  browser,
  baseURL,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("[data-em-armed]")).toHaveCount(0);
  await expect(page.locator("[data-emphasis]")).toHaveCount(
    inventory.filter((entry) => entry.approved).length,
  );
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 700 },
  });
  const staticPage = await context.newPage();
  await staticPage.goto(baseURL + "/");
  await expect(staticPage.locator(".chapter-reasoning[open]")).toHaveCount(6);
  await expect(staticPage.locator("[data-figure-source]")).toHaveCount(3);
  expect(
    await staticPage.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
