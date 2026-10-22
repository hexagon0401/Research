import { test, expect } from "@playwright/test";

test("the reading field stays paper, and pointer movement cannot move its geography", async ({
  page,
}) => {
  await page.goto("/?scene=china-myanmar");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "china-myanmar",
  );
  await expect(page.locator(".story-chapter")).toHaveCount(6);
  const map = page.locator("#visual-china-myanmar .terrain-world > g");
  const before = await map.getAttribute("transform");
  await page.mouse.move(200, 300);
  await page.mouse.move(900, 500);
  expect(await map.getAttribute("transform")).toBe(before);
  expect(
    await page
      .locator("#main")
      .evaluate((e) => getComputedStyle(e).backgroundColor),
  ).toBe("rgb(230, 232, 230)");
});

test("the compact contents menu navigates and closes with a keyboard return path", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.locator(".story-menu");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");
  await menu.locator('a[href="#korea-chips"]').last().click();
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "korea-chips",
  );
  await menu.locator("summary").click();
  await page.keyboard.press("Escape");
  await expect(menu.locator("summary")).toBeFocused();
  await expect(menu).not.toHaveAttribute("open", "");
});

test("real report folders support selection, interruption, reading and selection restoration", async ({
  page,
}) => {
  await page.goto("/archive");
  const folders = page.locator(".material-folder");
  await expect(folders).toHaveCount(13);
  await folders.first().focus();
  await page.keyboard.press("End");
  await expect(folders.last()).toBeFocused();
  await expect(page.locator(".shelf-selected h2")).toContainText("Defense");
  await page.keyboard.press("Enter");
  await expect(page.locator(".material-folder.opening")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/archive$/);
  await expect(folders.last()).toBeFocused();
  await expect(page.locator(".material-folder.opening")).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/reports\/S17$/);
  await expect(page.locator("#transcript")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".material-folder.selected")).toHaveAttribute(
    "data-folder-id",
    "S17",
  );
  await page.locator(".shelf-list summary").click();
  await expect(page.locator(".report-list>li")).toHaveCount(13);
});

test("library book spines identify references without inventing available full text", async ({
  page,
}) => {
  await page.goto("/library");
  await expect(page.locator(".material-folder")).toHaveCount(4);
  await page.getByRole("searchbox").fill("Thiel");
  await expect(page.locator(".material-folder")).toHaveCount(1);
  await expect(page.locator(".shelf-availability")).toContainText(
    "not supplied",
  );
  await page.getByRole("link", { name: /REF-01.*Zero to One/ }).click();
  await expect(page).toHaveURL(/\/library\/zero-to-one$/);
  await expect(page.getByText("Not supplied", { exact: true })).toBeVisible();
});

test("collection shelves fit both languages while every folder remains reachable", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "Viewport matrix runs once");
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ["EN", "KO"]) {
      for (const route of ["/archive", "/library"]) {
        await page.goto(route);
        await page
          .getByRole("button", { name: language, exact: true })
          .first()
          .click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${width}px ${language} ${route}`,
        ).toBe(true);
        const folders = page.locator(".material-folder");
        await folders.first().focus();
        await page.keyboard.press("End");
        await expect(folders.last()).toBeFocused();
        const box = await folders.last().boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
    }
  }
});
