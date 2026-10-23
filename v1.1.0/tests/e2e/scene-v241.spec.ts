import { test, expect, type Page } from "@playwright/test";
const scenes = [
  "capability",
  "us-mission",
  "us-dome",
  "us-finance",
  "us-ships",
  "korea-chips",
  "korea-platforms",
  "korea-regulation",
  "korea-defense",
  "spatial-method",
  "synthesis",
];
async function position(page: Page, id: string, value: number) {
  const root = page.locator(id);
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await root.evaluate((el, v) => {
    const steps = Array.from(
      el.querySelectorAll<HTMLElement>(".scene-steps>li"),
    );
    const style = getComputedStyle(el),
      top = parseFloat(style.getPropertyValue("--scene-top"));
    const stage = el.querySelector<HTMLElement>(".scene-stage")!;
    const line = parseFloat(style.getPropertyValue("--scene-reading-line"));
    const bounds = steps.map(
      (e) => e.getBoundingClientRect().top + scrollY - line,
    );
    bounds[0] = Number((el as HTMLElement).dataset.sceneStart);
    bounds.push(Number((el as HTMLElement).dataset.sceneEnd));
    const i = Math.min(steps.length - 1, Math.floor(v * steps.length));
    scrollTo(
      0,
      bounds[i] + (v * steps.length - i) * (bounds[i + 1] - bounds[i]),
    );
  }, value);
  await expect
    .poll(async () =>
      Math.abs(Number(await root.getAttribute("data-progress")) - value),
    )
    .toBeLessThan(0.025);
  return root;
}
test("every animated diagram stays on screen through all five measured progress positions", async ({
  page,
}, info) => {
  test.skip(
    !["desktop", "mobile"].includes(info.project.name),
    "Full persistence matrix runs at wide and narrow widths",
  );
  test.setTimeout(120000);
  await page.goto("/");
  for (const id of [...scenes.map((s) => "#visual-" + s), "#motion-china"]) {
    for (const v of [0, 0.25, 0.5, 0.75, 0.999]) {
      const root = await position(page, id, v);
      const stage = root.locator(".scene-stage");
      const rect = await stage.boundingBox();
      const nav = await page.locator(".story-navigation").boundingBox();
      expect(rect!.y, `${id} ${v} top`).toBeGreaterThanOrEqual(nav!.height - 2);
      expect(rect!.y + rect!.height, `${id} ${v} bottom`).toBeLessThanOrEqual(
        page.viewportSize()!.height - 8,
      );
    }
  }
});
test("current China explanation, date and stage agree at unequal step boundaries", async ({
  page,
}) => {
  await page.goto("/");
  for (let i = 0; i < 7; i++) {
    const root = await position(page, "#motion-china", (i + 0.35) / 7);
    await expect(root).toHaveAttribute("data-phase", String(i));
    const current = root.locator(".china-step-list>li").nth(i);
    await expect(current).toHaveAttribute("aria-current", "step");
    const date = await root.locator(".motion-date-row time").innerText();
    await expect(current).toContainText(date);
  }
});
test("enlarged diagram is a frozen accessible view and Escape restores focus and reading position", async ({
  page,
}) => {
  await page.goto("/");
  const root = await position(page, "#visual-capability", 0.4);
  const trigger = root.getByRole("button", { name: "Enlarge diagram" });
  await trigger.click();
  const y = await page.evaluate(() => scrollY);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".diagram-snapshot svg")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(2);
});
