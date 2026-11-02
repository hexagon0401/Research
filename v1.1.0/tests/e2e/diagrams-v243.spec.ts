import { test, expect, type Page } from "@playwright/test";
async function seek(page: Page, selector: string, v: number) {
  const root = page.locator(selector);
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  // Cancel the initial deep-link settling before acting like an active reader.
  await page.mouse.wheel(0, 1);
  await root.evaluate((el, v) => {
    const steps = [...el.querySelectorAll<HTMLElement>(".scene-steps>li")],
      line = parseFloat(
        getComputedStyle(el).getPropertyValue("--scene-reading-line"),
      ),
      bounds = steps.map((e) => e.getBoundingClientRect().top + scrollY - line);
    bounds[0] = Number((el as HTMLElement).dataset.sceneStart);
    bounds.push(Number((el as HTMLElement).dataset.sceneEnd));
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length));
    scrollTo(
      0,
      bounds[i] + (v * steps.length - i) * (bounds[i + 1] - bounds[i]),
    );
  }, v);
  await expect
    .poll(async () =>
      Math.abs(Number(await root.getAttribute("data-progress")) - v),
    )
    .toBeLessThan(0.004);
  return root;
}
test("airport labels have no invented leaders and locator remains screen-sized", async ({
  page,
}) => {
  await page.goto("/");
  const root = await seek(page, "#motion-china", 1.5 / 7);
  await expect(root.locator("[data-polar-camera] > g > path")).toHaveCount(0);
  const locator = root.locator(".arctic-locator");
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box!.width).toBe(page.viewportSize()!.width < 768 ? 72 : 96);
  for (const label of await root.locator('[data-space="polar"]').all()) {
    const b = await label.boundingBox();
    expect(b).not.toBeNull();
    expect(
      Math.max(
        0,
        Math.min(b!.x + b!.width, box!.x + box!.width) - Math.max(b!.x, box!.x),
      ) *
        Math.max(
          0,
          Math.min(b!.y + b!.height, box!.y + box!.height) -
            Math.max(b!.y, box!.y),
        ),
    ).toBe(0);
  }
  await expect(
    page.locator("#visual-capability [data-origin-globe]"),
  ).toHaveCount(0);
  await expect(page.locator(".essay-hero-composition svg")).not.toHaveCount(0);
});
test("PCA has visible intermediate and complete connections without an opaque label sheet", async ({
  page,
}) => {
  await page.goto("/");
  const root = await seek(page, "#visual-spatial-method", 3.4 / 4);
  await expect(root.locator(".pca-node-layer")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  const progress = await root
    .locator("[data-pca-edge]")
    .evaluateAll((es) =>
      es.map((e) => Number((e as SVGElement).dataset.drawProgress)),
    );
  expect(progress.some((v) => v > 0 && v < 1)).toBe(true);
  await root
    .locator(".mechanism-diagram")
    .screenshot({
      path: `.local/v243/pca-mid-${page.viewportSize()!.width}.png`,
    });
  await seek(page, "#visual-spatial-method", 0.999);
  for (const path of await root.locator("[data-pca-edge]").all())
    await expect(path).toHaveAttribute("data-draw-progress", "1");
  await root
    .locator(".mechanism-diagram")
    .screenshot({
      path: `.local/v243/pca-complete-${page.viewportSize()!.width}.png`,
    });
});
