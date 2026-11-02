import { test, expect, type Page } from "@playwright/test";
async function seek(page: Page, selector: string, v: number) {
  const root = page.locator(selector);
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await root.evaluate((el, v) => {
    const steps = Array.from(
        el.querySelectorAll<HTMLElement>(".scene-steps>li"),
      ),
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
    .toBeLessThan(0.003);
  return root;
}
test("globe and diagram coordinates remain isotropic throughout scroll", async ({
  page,
}) => {
  await page.goto("/");
  for (const v of [0, 0.25, 0.5, 0.75, 0.999]) {
    const root = await seek(page, "#visual-capability", v);
    const ratio = await root
      .locator(".mechanism-diagram>svg")
      .evaluate((svg) => {
        const m = (svg as SVGSVGElement).getScreenCTM()!;
        return Math.hypot(m.a, m.b) / Math.hypot(m.c, m.d);
      });
    expect(Math.abs(ratio - 1)).toBeLessThan(0.01);
  }
});
test("geographic relationship curves never fold back toward their origin", async ({
  page,
}) => {
  await page.goto("/#motion-china");
  for (const step of [0, 2, 3, 4]) {
    const root = await seek(page, "#motion-china", (step + 0.3) / 7);
    const minimum = await root
      .locator(`[data-route="${step}"]`)
      .evaluate((el: SVGPathElement) => {
        const L = el.getTotalLength(),
          a = el.getPointAtLength(0),
          b = el.getPointAtLength(L),
          dx = b.x - a.x,
          dy = b.y - a.y,
          den = dx * dx + dy * dy;
        let min = 1,
          prev = 0;
        for (let i = 1; i <= 100; i++) {
          const p = el.getPointAtLength((L * i) / 100),
            s = ((p.x - a.x) * dx + (p.y - a.y) * dy) / den;
          min = Math.min(min, s - prev);
          prev = s;
        }
        return min;
      });
    expect(minimum).toBeGreaterThanOrEqual(-0.0001);
  }
});
test("unfinished Chinese routes stay inside the map and traveler stays on the curve", async ({
  page,
}) => {
  await page.goto("/#motion-china");
  for (const step of [0, 2, 4])
    for (const local of [0.15, 0.3, 0.54]) {
      const root = await seek(page, "#motion-china", (step + local) / 7);
      const result = await root.evaluate(
        (el, { step }) => {
          const path = el.querySelector<SVGPathElement>(
              `[data-route="${step}"]`,
            )!,
            dot = el.querySelector<SVGCircleElement>(
              `[data-traveler="${step}"]`,
            )!,
            L = path.getTotalLength(),
            rect = el.querySelector(".china-map")!.getBoundingClientRect(),
            m = path.getScreenCTM()!,
            center = new DOMPoint(
              dot.cx.baseVal.value,
              dot.cy.baseVal.value,
            ).matrixTransform(dot.getScreenCTM()!);
          let distance = Infinity,
            inside = true;
          for (let i = 0; i <= 500; i++) {
            const p = path.getPointAtLength((L * i) / 500),
              q = new DOMPoint(p.x, p.y).matrixTransform(m);
            distance = Math.min(
              distance,
              Math.hypot(q.x - center.x, q.y - center.y),
            );
            if (
              q.x < rect.left + 1 ||
              q.x > rect.right - 1 ||
              q.y < rect.top + 1 ||
              q.y > rect.bottom - 1
            )
              inside = false;
          }
          return { inside, distance };
        },
        { step },
      );
      expect(result.inside, `${step} ${local}`).toBe(true);
      expect(result.distance).toBeLessThanOrEqual(2);
    }
});
