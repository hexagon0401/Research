import { test, expect } from "@playwright/test";

test("the essay replaces slides with a connected argument and thirteen real studies", async ({
  page,
}) => {
  const errors: string[] = [];
  const reportsRequested: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (
      /^\/(reports\/|report-pdfs\/|vendor\/pdfjs\/|api\/public\/reports)/.test(
        new URL(r.url()).pathname,
      )
    )
      reportsRequested.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("national power");
  await expect(page.locator(".chapter-label,.scene-progress")).toHaveCount(0);
  await expect(page.locator("[data-research-node]")).toHaveCount(13);
  await expect(page.locator("#us-finance")).toContainText("GENIUS Act");
  await expect(page.locator("#china-myanmar")).toContainText("NORINCO");
  await expect(page.locator("#korea-chips")).toContainText("SK Hynix");
  await expect(page.locator(".essay-reading-meta")).toContainText(
    /\d+ min read/,
  );
  expect(errors).toEqual([]);
  await page.locator("#integration").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(reportsRequested).toEqual([]);
});
test("country navigation and source links work with keyboard and native anchors", async ({
  page,
}) => {
  await page.goto("/");
  const china = page.locator('.essay-outline a[href="#china-ownership"]');
  await expect(page.locator("#main")).toHaveAttribute("data-enhanced", "true");
  await china.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#china-ownership$/);
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "china-ownership",
  );
  const link = page.locator("#china-myanmar .essay-citation").first();
  await link.click();
  await expect(page).toHaveURL(
    /reports\/S08\?from=china-myanmar#S08-R003-P001/,
  );
  await expect(page.locator("#S08-R003-P001 .reading-ko")).toContainText(
    "미얀마",
  );
  await page.locator("[data-return-to-essay]").first().click();
  await expect(page).toHaveURL(/#china-myanmar$/);
});
test("visual modes crossfade through the Arctic scene without covering the essay", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const r = document.getElementById("china-arctic")!.getBoundingClientRect();
    scrollTo({
      top: r.top + scrollY - innerHeight * 0.35 + innerHeight * 0.3,
      behavior: "instant",
    });
  });
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "china-arctic",
  );
  const values = await page
    .locator("#main")
    .evaluate((e) => [
      Number((e as HTMLElement).style.getPropertyValue("--mode-arctic")),
      Number((e as HTMLElement).style.getPropertyValue("--mode-world")),
    ]);
  expect(values[0]).toBeGreaterThan(0);
  expect(values[0]).toBeLessThan(1);
  expect(values[1]).toBeGreaterThan(0);
  const geometry = await page.evaluate(() => {
    const v = document.querySelector<HTMLElement>(".essay-visual")!;
    const b = document.querySelector(".essay-body")!.getBoundingClientRect();
    return {
      hidden: getComputedStyle(v).display === "none",
      left: v.getBoundingClientRect().left,
      bodyRight: b.right,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  if (!geometry.hidden)
    expect(geometry.left).toBeGreaterThan(geometry.bodyRight);
  expect(geometry.overflow).toBe(false);
});
test("motion preferences retain reading position and system reduction wins", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("iir-reduced-motion", "false"),
  );
  await page.goto("/?scene=korea-chips");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "korea-chips",
  );
  await page.evaluate(() => document.fonts.ready);
  const y = await page.evaluate(() => scrollY);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#main")).toHaveAttribute("data-motion", "reduced");
  await expect(
    page.getByRole("button", { name: /Reduce motion/ }),
  ).toBeDisabled();
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(5);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#main")).toHaveAttribute("data-motion", "full");
});
test("stopping the scroll stops animation work and wheel events remain native", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const idle = await page.evaluate(async () => {
    let n = 0;
    const original = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      n++;
      return original(cb);
    };
    await new Promise((r) => setTimeout(r, 180));
    window.requestAnimationFrame = original;
    return n;
  });
  expect(idle).toBe(0);
  await page.mouse.move(10, 250);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 250);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollSnapType,
    ),
  ).toBe("none");
});
test("switching interface language keeps the reader within the same argument", async ({
  page,
}) => {
  await page.goto("/?scene=us-mission");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "us-mission",
  );
  // Change the interface without Playwright first scrolling the non-sticky
  // global header into view; this checks the layout's position restoration.
  await page
    .getByRole("button", { name: "KO", exact: true })
    .first()
    .dispatchEvent("click");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator("#main")).toHaveAttribute(
    "data-scene",
    "us-mission",
  );
  await expect(page.locator("#us-mission h2")).toContainText("미국");
});
