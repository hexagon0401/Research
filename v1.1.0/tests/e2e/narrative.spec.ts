import { test, expect } from "@playwright/test";

test("continuous scroll updates line geometry and chapter without moving focus", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#main")).toHaveAttribute("data-enhanced", "true");
  const progress = () =>
    page
      .locator("#question")
      .evaluate((e) =>
        Number((e as HTMLElement).style.getPropertyValue("--scene-progress")),
      );
  const before = await progress();
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: "instant" }));
  await expect.poll(progress).toBeGreaterThan(before);
  await page.evaluate(() =>
    document.getElementById("world")!.scrollIntoView({ behavior: "instant" }),
  );
  await expect(page.locator("#main")).toHaveAttribute("data-chapter", "world");
  const geometry = await page.locator("#world").boundingBox();
  expect(Math.abs(geometry!.x)).toBeLessThan(1);
  expect(Math.abs(geometry!.width - page.viewportSize()!.width)).toBeLessThan(
    1,
  );
  await expect(page.locator(".folder").first()).not.toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBeTruthy();
});

test("pinned framework selection survives scrolling and reading flow can resume", async ({
  page,
}) => {
  await page.goto("/?scene=framework");
  const node = page.getByRole("button", { name: "Mission & accountability" });
  await node.click();
  await page.mouse.move(2, 2);
  await page.evaluate(() => window.scrollBy({ top: 250, behavior: "instant" }));
  await expect(node).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".framework-detail p")).toContainText(
    "democratic oversight",
  );
  await page.getByRole("button", { name: "Follow the reading flow" }).click();
  await expect(node).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".framework-follow")).toContainText(
    "FOLLOWING THE INQUIRY",
  );
});

test("motion changes retain the reading position and disable enhanced geometry", async ({
  page,
}) => {
  await page.goto("/?scene=synthesis");
  await page.evaluate(() => window.scrollBy({ top: 160, behavior: "instant" }));
  const y = await page.evaluate(() => scrollY);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#main")).toHaveAttribute("data-enhanced", "false");
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(5);
  expect(
    await page
      .locator(".orbit > svg")
      .evaluate((e) => getComputedStyle(e).transform),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#main")).toHaveAttribute("data-enhanced", "true");
});

test("map exploration previews and pins a country with keyboard equivalence", async ({
  page,
}) => {
  await page.goto("/?scene=world");
  const china = page.getByRole("button", { name: "02 China" });
  await china.focus();
  await expect(page.locator(".region-detail p")).toContainText(
    "Investment is not automatically evidence",
  );
  await page.keyboard.press("Enter");
  await expect(china).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(1, 1);
  await page.getByRole("heading", { level: 2 }).first().click();
  await expect(page.locator(".map-country.selected")).toHaveCount(1);
  await expect(page.locator(".region-detail p")).toContainText(
    "Investment is not automatically evidence",
  );
});

test("system motion preference overrides a stale stored full-motion setting", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("iir-reduced-motion", "false"),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(
    page.getByRole("button", { name: /Reduce motion/ }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: /Reduce motion/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(
    page.getByRole("button", { name: /Reduce motion/ }),
  ).toBeEnabled();
  await expect(page.locator("#main")).toHaveAttribute("data-enhanced", "true");
});
