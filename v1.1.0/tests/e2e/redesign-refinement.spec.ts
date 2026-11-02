import { test, expect } from "@playwright/test";
test("glossary index supports keyboard navigation and preserves source destinations", async ({
  page,
}) => {
  await page.goto("/glossary");
  const link = page.locator(".glossary-jump-list a").first();
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("box-shadow", "none");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#term-us-mission-0$/);
  await expect(page.locator("#term-us-mission-0")).toBeInViewport();
  await page.locator(".glossary-jump-list a").last().click();
  await expect(page).toHaveURL(/#term-rule-of-40$/);
  await expect(page.locator("#term-rule-of-40")).toBeInViewport();
  await page
    .getByRole("button", { name: "KO", exact: true })
    .evaluate((el: HTMLButtonElement) => el.click());
  await expect(page.locator("h1")).toHaveText("용어 찾아보기");
});
test("404 explains the error in both languages and offers working recovery", async ({
  page,
}) => {
  const response = await page.goto("/not-an-iir-page");
  expect(response!.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found.",
  );
  await page.getByRole("button", { name: "KO", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "페이지를 찾을 수 없습니다.",
  );
  await page
    .getByRole("link", { name: "연구 자료실", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL(/\/archive$/);
});
test("refined reading controls retain visible focus and motion-reduced states", async ({
  page,
}) => {
  await page.goto("/");
  const s = page.locator("#detail-survival > summary");
  await s.focus();
  await expect(s).toHaveCSS("box-shadow", "none");
  await page.keyboard.press("Enter");
  await expect(page.locator("#detail-survival")).toHaveAttribute("open", "");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(s).toHaveCSS("transition-duration", "0s");
  if (page.viewportSize()!.width < 768) {
    const font = await page
      .locator(".essay-hero h1")
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(font).toBeLessThan(44);
  }
});

test("author and globe preserve editorial order across tablet and desktop", async ({
  page,
}) => {
  await page.goto("/");
  const title = await page.locator(".essay-hero h1").boundingBox(),
    author = await page.locator(".hero-author").boundingBox();
  expect(author!.y).toBeGreaterThanOrEqual(title!.y + title!.height);
  if (page.viewportSize()!.width >= 768) {
    const globe = await page.locator(".hero-atlas").boundingBox();
    expect(Math.abs(author!.x - title!.x)).toBeLessThan(2);
    expect(globe!.x).toBeGreaterThanOrEqual(title!.x + title!.width);
  }
});
