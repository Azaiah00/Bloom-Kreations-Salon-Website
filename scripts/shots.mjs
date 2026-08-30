import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = process.env.OUT ?? "/home/claude/bloom/work/shots";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
};

const routes = (process.env.ROUTES ?? "/").split(",");
const sizes = (process.env.SIZES ?? "desktop").split(",");
const full = process.env.FULL !== "0";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const errors = [];

for (const size of sizes) {
  const ctx = await browser.newContext({
    viewport: VIEWPORTS[size],
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${size}] ${page.url()} :: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${size}] ${page.url()} :: ${e.message}`));

  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "load" });
    // Let entrance timelines settle, then walk the page so every ScrollTrigger fires.
    await page.waitForTimeout(1800);
    await page.evaluate(() => document.fonts.ready);
    if (full) {
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.7;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 220));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 500));
      });
    }
    const name = route === "/" ? "home" : route.replace(/[/?=&]/g, "-").replace(/^-/, "");
    await page.screenshot({
      path: `${OUT}/${name}--${size}.png`,
      fullPage: full,
    });
    console.log(`shot ${name} @ ${size}`);
  }
  await ctx.close();
}

await browser.close();
if (errors.length) {
  console.log("\n=== CONSOLE / PAGE ERRORS ===");
  [...new Set(errors)].forEach((e) => console.log(" ! " + e));
  process.exitCode = 2;
} else {
  console.log("\nNo console or page errors.");
}
