import { test, expect } from "@playwright/test";
test("folio identifiers describe real research and stay separate from hero text", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".atlas-folio-number")).toHaveText("S00");
  await expect(page.locator(".atlas-folio-caption")).toContainText(
    "13 studies",
  );
  const title = await page.locator(".essay-hero h1").boundingBox(),
    plate = await page.locator(".folio-atlas").boundingBox(),
    author = await page.locator(".hero-author").boundingBox();
  expect(
    Math.max(
      0,
      Math.min(title!.x + title!.width, plate!.x + plate!.width) -
        Math.max(title!.x, plate!.x),
    ) *
      Math.max(
        0,
        Math.min(title!.y + title!.height, plate!.y + plate!.height) -
          Math.max(title!.y, plate!.y),
      ),
  ).toBe(0);
  expect(author!.y).toBeGreaterThanOrEqual(title!.y + title!.height);
  expect(
    await page
      .locator("html")
      .evaluate((e) => getComputedStyle(e).getPropertyValue("--paper").trim()),
  ).toBe("#f0f0ea");
  await page.getByRole("button", { name: "KO", exact: true }).click();
  await expect(page.locator(".atlas-folio-caption")).toContainText(
    "하나의 질문",
  );
  await page.goto("/archive");
  await expect(page.locator(".folio-archive-count")).toHaveText("13");
  const folder = page
    .locator(".material-folder.selected .material-cover")
    .first();
  await expect(folder).not.toHaveCSS("background-color", "rgb(14, 251, 46)");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
