import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL || "http://localhost:3000");
  const missing = await page.evaluate(() => [
    ...new Set(
      [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => decodeURIComponent(a.hash.slice(1)))
        .filter((id) => id && !document.getElementById(id)),
    ),
  ]);
  if (missing.length) throw new Error("Missing anchors: " + missing.join(", "));
  console.log("All in-page anchors resolve.");
} finally {
  await browser.close();
}
