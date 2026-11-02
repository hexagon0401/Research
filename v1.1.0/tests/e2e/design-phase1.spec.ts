import { test, expect } from "@playwright/test";
test("public author details, useful source panels and glossary preserve the reading path", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-author")).toContainText("Daniel Yu");
  await expect(page.locator(".hero-author a")).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/daniel-yu-790485390/",
  );
  const b = await page.locator(".hero-author").boundingBox();
  expect(b!.y + b!.height).toBeLessThan(page.viewportSize()!.height);
  await expect(page.locator("[data-essay-beat]")).toHaveCount(18);
  for (const summary of await page.locator(".case-detail>summary").all())
    await expect(summary).not.toContainText("0 passages");
  await page.locator("#detail-china-governance>summary").click();
  await expect(
    page.locator("#detail-china-governance .essay-related a").first(),
  ).toBeVisible();
  await page.goto("/glossary");
  await expect(page.locator("h1")).toHaveText("Glossary");
  await page.getByRole("link", { name: "Read the source definition" }).click();
  await expect(page).toHaveURL(/reports\/S06.*S06-R001-P004/);
  await expect(page.locator("#S06-R001-P004")).toBeVisible();
  await page.goto("/");
  await page.getByRole("button", { name: "KO", exact: true }).click();
  await expect(page.locator(".hero-author")).toContainText("유하민");
  await expect(page.locator(".hero-author")).toContainText("2025년 6월");
  await page
    .locator(".site-header nav")
    .getByRole("link", { name: "소개", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
});
