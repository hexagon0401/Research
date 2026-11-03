import { test, expect, type Page } from "@playwright/test";
async function seek(page: Page, id: string, value: number) {
  const root = page.locator(id);
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await root.evaluate((el, v) => {
    const steps = [...el.querySelectorAll<HTMLElement>(".scene-steps>li")],
      line = parseFloat(
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
test("shared-origin semiconductor connections are visibly curved, separated and patterned", async ({
  page,
}) => {
  await page.goto("/");
  const root = await seek(page, "#visual-korea-chips", 2.5 / 3);
  const samples = await root.evaluate((el) =>
    [0, 2].map((i) => {
      const p = el.querySelector<SVGPathElement>(
        `[data-mechanism-edge="${i}"]`,
      )!;
      const L = p.getTotalLength(),
        m = p.getScreenCTM()!;
      const points = Array.from({ length: 301 }, (_, j) => {
        const q = p.getPointAtLength((L * j) / 300);
        return new DOMPoint(q.x, q.y).matrixTransform(m);
      });
      return {
        points: points.map((p) => ({ x: p.x, y: p.y })),
        dash: getComputedStyle(p).strokeDasharray,
        d: p.getAttribute("d"),
      };
    }),
  );
  expect(samples.every((s) => s.d!.includes("Q"))).toBe(true);
  const right = Math.min(...samples.map((s) => s.points.at(-1)!.x)),
    left = Math.max(...samples.map((s) => s.points[0].x)),
    x = (left + right) / 2;
  const mid = samples.map((s) =>
    s.points.reduce((a, b) => (Math.abs(a.x - x) < Math.abs(b.x - x) ? a : b)),
  );
  expect(Math.abs(mid[0].y - mid[1].y)).toBeGreaterThan(10);
  expect(samples[0].dash).toBe("none");
  expect(samples[1].dash).not.toBe("none");
  await expect(root.locator(".relation-line-key")).toContainText("U.S.–Korea");
  const old = +(await root.getAttribute("data-progress"))!;
  await page.mouse.wheel(0, 20);
  await expect
    .poll(async () => +(await root.getAttribute("data-progress"))!)
    .toBeGreaterThan(old);
  await seek(page, "#visual-korea-chips", 0.15);
  await seek(page, "#visual-korea-chips", 2.5 / 3);
});
test("offscreen terrain waits until its figure and malformed hashes preserve the reader", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const requested: string[] = [];
  page.on("request", (r) => {
    if (/\/visuals\/(world|arctic)\.svg/.test(r.url())) requested.push(r.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(requested).toEqual([]);
  for (const hash of ["%", "%E0%A4%A", "%ZZ"]) {
    await page.goto("/#" + hash);
    await expect(page.locator("main")).toHaveAttribute(
      "data-reading-mode",
      "full",
    );
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
  await page.goto("/#korea-chips");
  await page.locator("#visual-korea-chips").scrollIntoViewIfNeeded();
  await expect(
    page.locator("#visual-korea-chips [data-terrain=vector] use"),
  ).toHaveAttribute("href", "/visuals/world.svg#terrain");
  await expect
    .poll(() => requested.some((url) => url.includes("world.svg")))
    .toBe(true);
});
test("no-JavaScript maps retain native-lazy terrain and complete curved relationships", async ({
  browser,
  baseURL,
}) => {
  const c = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const p = await c.newPage();
  await p.goto(baseURL + "/#korea-chips");
  const img = p.locator('#visual-korea-chips img[src="/visuals/world.svg"]');
  await img.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0),
    )
    .toBe(true);
  await expect(p.locator(".chapter-reasoning[open]")).toHaveCount(6);
  expect(
    await p
      .locator('#visual-korea-chips [data-mechanism-edge="0"]')
      .getAttribute("d"),
  ).toContain("Q");
  await c.close();
});
