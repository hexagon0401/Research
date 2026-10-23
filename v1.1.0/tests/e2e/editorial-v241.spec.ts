import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
async function seek(page: import("@playwright/test").Page, value: number) {
  const root = page.locator("#motion-china");
  await expect(root).toHaveAttribute("data-scene-start", /.+/);
  await root
    .locator("input[type=range]")
    .first()
    .evaluate((el: HTMLInputElement, v) => {
      el.value = String(v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
  await expect(root).toHaveAttribute(
    "data-phase",
    String(Math.min(6, Math.floor((value / 100) * 7))),
  );
}
test("summaries reveal the original passages and all legacy argument addresses remain unique", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-essay-beat]")).toHaveCount(18);
  await expect(page.locator("[data-visual-for]")).toHaveCount(16);
  await expect(page.locator(".case-detail")).toHaveCount(18);
  await expect(page.locator(".case-detail[open]")).toHaveCount(0);
  const ids = await page
    .locator("[id]")
    .evaluateAll((es) => es.map((e) => e.id));
  expect(new Set(ids).size).toBe(ids.length);
  await page.locator("#detail-survival>summary").click();
  await expect(
    page.locator("#detail-survival .essay-source-passage").first(),
  ).toBeVisible();
  const target = await page
    .locator("#detail-us-mission .essay-source-passage")
    .first()
    .getAttribute("id");
  await page.goto("/#" + target);
  await expect(page.locator("#detail-us-mission")).toHaveAttribute("open", "");
  await expect(page.locator("#" + target)).toBeVisible();
  await expect(page.locator(".footer-motto")).toContainText(
    "those who in a period of moral crisis maintain their neutrality.",
  );
  await expect(page.locator(".footer-motto cite")).toHaveText(
    "John F. Kennedy",
  );
});
test("regional zoom, quiet selection and frozen enlargement preserve geometry", async ({
  page,
}, info) => {
  await page.goto("/#motion-china");
  const root = page.locator("#motion-china");
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await seek(page, 65);
  await expect
    .poll(async () =>
      root.locator("[data-world-camera]").getAttribute("transform"),
    )
    .toMatch(/scale\((3[0-9]|4[0-9])/);
  const trigger = root.getByRole("button", { name: "Enlarge diagram" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.locator(".diagram-snapshot [data-world-camera]"),
  ).toHaveAttribute(
    "transform",
    (await root.locator("[data-world-camera]").getAttribute("transform")) || "",
  );
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 300);
  expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(
    2,
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  if (info.project.name === "desktop") {
    await seek(page, 82);
    await root
      .locator(".motion-place-legend")
      .getByRole("button", { name: "Cambodia", exact: true })
      .click();
    await expect(root).toHaveAttribute("data-phase", "5");
    await expect(root.locator("[data-world-camera]")).toHaveAttribute(
      "transform",
      /scale\((3[0-9]|4[0-9])/,
    );
  }
  await page.goto("/?scene=us-finance");
  const selected = page.locator(
    "#visual-us-finance .motion-filter button[aria-pressed=true]",
  );
  await expect(selected).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(selected).toHaveCSS("border-bottom-width", "2px");
  await page.locator("#visual-us-finance .motion-filter button").nth(1).click();
  await expect(
    page.locator("#visual-us-finance .motion-filter button").nth(1),
  ).toHaveAttribute("aria-pressed", "true");
});
test("reduced motion and failed engine retain regional scenes and readable sources", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Fallback pass runs once");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#motion-china");
  await seek(page, 65);
  await expect(page.locator("#motion-china")).toHaveAttribute(
    "data-camera-ready",
    "true",
  );
  await expect(
    page.locator("#motion-china [data-world-camera]"),
  ).toHaveAttribute("transform", /scale\((3[0-9]|4[0-9])/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const blocked = readdirSync(".next/static/chunks").filter(
    (name) =>
      name.endsWith(".js") &&
      /GSAP 3|ScrollTrigger 3|MotionPathPlugin 3/.test(
        readFileSync(".next/static/chunks/" + name, "utf8"),
      ),
  );
  expect(blocked.length).toBeGreaterThan(0);
  await page.route("**/_next/static/chunks/**", (route) =>
    blocked.some((name) =>
      route
        .request()
        .url()
        .endsWith("/" + name),
    )
      ? route.abort()
      : route.continue(),
  );
  await page.goto("/#motion-china");
  await seek(page, 65);
  await expect(
    page.locator("#motion-china [data-world-camera]"),
  ).toHaveAttribute("transform", /scale\((3[0-9]|4[0-9])/);
  await expect(page.locator("#china-cambodia")).toContainText("Canopy Sands");
  await expect(page.locator("#motion-cambodia-relations>a")).toHaveAttribute(
    "href",
    /S08-R002-P002/,
  );
});
