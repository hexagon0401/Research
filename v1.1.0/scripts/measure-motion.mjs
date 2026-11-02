/** Repeatable geometry/scroll baseline; production server required. */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const output = process.env.MEASURE_OUTPUT ?? ".local/v242/baseline";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = {
  date: new Date().toISOString(),
  url: process.env.MEASURE_URL || "http://127.0.0.1:3022",
  geometry: [],
  scroll: [],
};
async function seek(page, selector, value) {
  const root = page.locator(selector);
  await root.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    (sel) => document.querySelector(sel)?.dataset.motionReady === "true",
    selector,
  );
  await root.evaluate((el, v) => {
    const steps = [...el.querySelectorAll(".scene-steps>li")],
      line = parseFloat(
        getComputedStyle(el).getPropertyValue("--scene-reading-line"),
      ),
      bounds = steps.map((e) => e.getBoundingClientRect().top + scrollY - line);
    bounds[0] = +el.dataset.sceneStart;
    bounds.push(+el.dataset.sceneEnd);
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length));
    scrollTo(
      0,
      bounds[i] + (v * steps.length - i) * (bounds[i + 1] - bounds[i]),
    );
  }, value);
  await page.waitForTimeout(80);
  return root;
}
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 1440, height: 600 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(results.url);
    await page.evaluate(() => document.fonts.ready);
    for (const id of ["capability", "korea-chips"])
      for (const progress of [0, 0.25, 0.5, 0.75, 0.999]) {
        const root = await seek(page, "#visual-" + id, progress);
        results.geometry.push(
          await root.evaluate(
            (el, context) => {
              const svg = el.querySelector(".mechanism-diagram>svg"),
                m = svg.getScreenCTM(),
                r = svg.getBoundingClientRect();
              return {
                ...context,
                kind: el.id,
                ratio: Math.hypot(m.a, m.b) / Math.hypot(m.c, m.d),
                frame: { width: r.width, height: r.height },
                progress: el.dataset.progress,
              };
            },
            { viewport, progress },
          ),
        );
      }
    for (const step of [0, 2, 4])
      for (const local of [0.15, 0.3, 0.54, 0.56, 0.85]) {
        const root = await seek(page, "#motion-china", (step + local) / 7);
        results.geometry.push(
          await root.evaluate(
            (el, context) => {
              const path = el.querySelector(`[data-route="${context.step}"]`),
                length = path.getTotalLength(),
                matrix = path.getScreenCTM(),
                start = path.getPointAtLength(0),
                end = path.getPointAtLength(length),
                d = { x: end.x - start.x, y: end.y - start.y },
                den = d.x * d.x + d.y * d.y;
              let backtracks = 0,
                previous = 0;
              for (let i = 1; i <= 100; i++) {
                const p = path.getPointAtLength((length * i) / 100),
                  s = ((p.x - start.x) * d.x + (p.y - start.y) * d.y) / den;
                if (s < previous - 1e-5) backtracks++;
                previous = s;
              }
              const rect = el
                  .querySelector(".china-map")
                  .getBoundingClientRect(),
                points = Array.from({ length: 101 }, (_, i) => {
                  const p = path.getPointAtLength((length * i) / 100);
                  return new DOMPoint(p.x, p.y).matrixTransform(matrix);
                });
              return {
                ...context,
                kind: "china",
                backtracks,
                curveInside: points.every(
                  (p) =>
                    p.x >= rect.left + 1 &&
                    p.x <= rect.right - 1 &&
                    p.y >= rect.top + 1 &&
                    p.y <= rect.bottom - 1,
                ),
                progress: el.dataset.progress,
              };
            },
            { viewport, step, local },
          ),
        );
      }
    await page.screenshot({
      path: `${output}/china-${viewport.width}-${viewport.height}.png`,
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Performance.enable");
    for (let run = 1; run <= 3; run++) {
      await seek(page, "#motion-china", 0.03);
      await page.waitForTimeout(250);
      await page.evaluate(() => {
        window.__motionSample = {
          frames: [],
          longTasks: [],
          previous: performance.now(),
          active: true,
        };
        const s = window.__motionSample;
        new PerformanceObserver((list) => {
          if (s.active)
            s.longTasks.push(...list.getEntries().map((e) => e.duration));
        }).observe({ type: "longtask" });
        function tick(t) {
          if (!s.active) return;
          s.frames.push(t - s.previous);
          s.previous = t;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      const before = await cdp.send("Performance.getMetrics");
      await page.mouse.move(
        viewport.width - 25,
        Math.min(600, viewport.height - 60),
      );
      for (let i = 0; i < 50; i++) {
        await page.mouse.wheel(0, 32);
        await page.waitForTimeout(16);
      }
      const after = await cdp.send("Performance.getMetrics");
      const sample = await page.evaluate(() => {
        const s = window.__motionSample;
        s.active = false;
        const frames = s.frames.slice(2).sort((a, b) => a - b);
        return {
          frames: frames.length,
          median: frames[Math.floor(frames.length * 0.5)],
          p95: frames[Math.floor(frames.length * 0.95)],
          longTasks: s.longTasks,
        };
      });
      const a = Object.fromEntries(
          before.metrics.map((m) => [m.name, m.value]),
        ),
        b = Object.fromEntries(after.metrics.map((m) => [m.name, m.value]));
      results.scroll.push({
        viewport,
        run,
        ...sample,
        scriptMs: (b.ScriptDuration - a.ScriptDuration) * 1000,
        layoutMs: (b.LayoutDuration - a.LayoutDuration) * 1000,
        recalcMs: (b.RecalcStyleDuration - a.RecalcStyleDuration) * 1000,
      });
    }
    await page.waitForTimeout(750);
    const idle = await page
      .locator("#motion-china .china-map")
      .evaluate(async (el) => {
        let count = 0;
        const observer = new MutationObserver((es) => (count += es.length));
        observer.observe(el, { attributes: true, subtree: true });
        const before = el.innerHTML;
        await new Promise((r) => setTimeout(r, 500));
        observer.disconnect();
        return { mutations: count, visualChanged: before !== el.innerHTML };
      });
    results.scroll.push({ viewport, idle });
    await page.close();
  }
} finally {
  await browser.close();
  writeFileSync(
    `${output}/summary.json`,
    JSON.stringify(results, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      output,
      geometrySamples: results.geometry.length,
      scrollRuns: results.scroll.length,
    }),
  );
}
