import { test, expect, type Page } from "@playwright/test";
import { createRequire } from "node:module";
const sharp = createRequire(process.cwd() + "/package.json")("sharp");
async function seek(page: Page, selector: string, v: number) {
  const root = page.locator(selector);
  await root.scrollIntoViewIfNeeded();
  if ((await page.locator("html").getAttribute("data-motion")) === "reduced")
    await expect(root).toHaveAttribute("data-scene-start", /.+/);
  else await expect(root).toHaveAttribute("data-motion-ready", "true");
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
  await root.locator(".mechanism-diagram").screenshot({
    path: `.local/v243/pca-mid-${page.viewportSize()!.width}.png`,
  });
  await seek(page, "#visual-spatial-method", 0.999);
  for (const path of await root.locator("[data-pca-edge]").all())
    await expect(path).toHaveAttribute("data-draw-progress", "1");
  await root.locator(".mechanism-diagram").screenshot({
    path: `.local/v243/pca-complete-${page.viewportSize()!.width}.png`,
  });
  // Inspect actual rendered pixels at an interior curve point, away from text.
  const point = await root
    .locator("[data-pca-edge]")
    .first()
    .evaluate((el: SVGPathElement) => {
      const p = el.getPointAtLength(el.getTotalLength() * 0.65),
        q = new DOMPoint(p.x, p.y).matrixTransform(el.getScreenCTM()!),
        box = el.closest(".mechanism-diagram")!.getBoundingClientRect();
      return { x: q.x - box.x, y: q.y - box.y };
    });
  const png = await root.locator(".mechanism-diagram").screenshot();
  const { data, info } = await sharp(png)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let ink = 0;
  for (let y = Math.floor(point.y) - 3; y <= Math.ceil(point.y) + 3; y++)
    for (let x = Math.floor(point.x) - 3; x <= Math.ceil(point.x) + 3; x++) {
      const i = (y * info.width + x) * info.channels;
      if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) ink++;
    }
  expect(
    ink,
    "the rendered connection must contain Ink pixels, not merely a completed mask",
  ).toBeGreaterThan(2);
});

test("comparison follows scroll both ways, allows persistent manual values, resumes and hides during PCA", async ({
  page,
}) => {
  await page.goto("/");
  const root = await seek(page, "#visual-spatial-method", 2.12 / 4),
    bar = root.getByRole("slider", {
      name: "Evidence and interpretation comparison",
    }),
    clip = root.locator("#method-comparison-clip rect");
  await expect(bar).toBeVisible();
  const first = Number(await bar.inputValue());
  await seek(page, "#visual-spatial-method", 2.7 / 4);
  expect(Number(await bar.inputValue())).toBeGreaterThan(first + 70);
  await seek(page, "#visual-spatial-method", 2.2 / 4);
  expect(Number(await bar.inputValue())).toBeLessThan(20);
  await bar.focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await expect(bar).toHaveValue("1");
  await expect(root.locator(".evidence-comparison")).toHaveAttribute(
    "data-mode",
    "manual",
  );
  await seek(page, "#visual-spatial-method", 2.8 / 4);
  await expect(bar).toHaveValue("1");
  await expect(bar).toHaveCSS("box-shadow", "none");
  const boxes = await root
    .locator("[data-graph-node]")
    .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().toJSON()));
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i],
        b = boxes[j];
      expect(
        Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
          Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)),
        "method labels must remain separate with manual controls open",
      ).toBeLessThan(1);
    }
  await page.setViewportSize({
    width: page.viewportSize()!.width,
    height: page.viewportSize()!.height - 20,
  });
  await expect(bar).toHaveValue("1");
  await page
    .getByRole("button", { name: "KO", exact: true })
    .evaluate((e: HTMLButtonElement) => e.click());
  await expect(
    root.getByRole("slider", { name: "근거와 해석 비교" }),
  ).toHaveValue("1");
  await page
    .getByRole("button", { name: "EN", exact: true })
    .evaluate((e: HTMLButtonElement) => e.click());
  await expect(bar).toHaveValue("1");
  await root
    .getByRole("button", { name: "Follow scroll", exact: true })
    .click();
  await expect(root.locator(".evidence-comparison")).toHaveAttribute(
    "data-mode",
    "auto",
  );
  await expect
    .poll(async () => Number(await clip.getAttribute("width")))
    .toBeGreaterThan(300);
  await seek(page, "#visual-spatial-method", 3.5 / 4);
  await expect(bar).toBeHidden();
});

test("reduced motion and no-JS readers retain a complete static PCA", async ({
  page,
  browser,
  baseURL,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const root = await seek(page, "#visual-spatial-method", 2.5 / 4);
  const bar = root.getByRole("slider", {
    name: "Evidence and interpretation comparison",
  });
  await expect(bar).toHaveValue("100");
  await bar.focus();
  await page.keyboard.press("Home");
  await expect(bar).toHaveValue("0");
  await expect(
    root.getByRole("button", { name: "Follow scroll", exact: true }),
  ).toHaveCount(0);
  await seek(page, "#visual-spatial-method", 0.999);
  await expect(root.locator(".method-pca")).toBeVisible();
  const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    }),
    p = await context.newPage();
  await p.goto(baseURL + "/");
  await p.locator(".method-pca").scrollIntoViewIfNeeded();
  await expect(p.locator(".method-pca")).toBeVisible();
  for (const mask of await p.locator(".method-pca [data-draw-mask]").all())
    await expect(mask).toHaveCSS("stroke-dashoffset", "0px");
  await context.close();
});

test("robots is evaluated per request without caching while public pages keep noindex", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["cdn-cache-control"]).toBe("no-store");
  const body = await response.text();
  expect(body).toContain("User-Agent: *");
  if (body.includes("Allow: /")) {
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Disallow: /originals/");
  } else expect(body).toContain("Disallow: /");
  for (const path of ["/", "/archive", "/reports/S08"]) {
    const page = await request.get(path);
    expect(page.status()).toBe(200);
    expect(await page.text()).toMatch(
      /name="robots" content="noindex, follow"/,
    );
  }
});

test("language changes preserve the interpretation step on low and narrow screens", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Special viewport regression runs once",
  );
  for (const viewport of [
    { width: 1440, height: 500 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const root = await seek(page, "#visual-spatial-method", 2.55 / 4),
      bar = root.locator("input[type=range]");
    await bar.focus();
    await page.keyboard.press("Home");
    for (const language of ["KO", "EN"]) {
      await page
        .getByRole("button", { name: language, exact: true })
        .evaluate((el: HTMLButtonElement) => el.click());
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      await expect(root).toHaveAttribute("data-active-step", "2");
      await expect(bar).toHaveValue("0");
    }
  }
});
