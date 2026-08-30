/**
 * Viewport-sized frames at fixed scroll depths.
 *
 * fullPage screenshots are misleading on pages with pinned ScrollTrigger
 * sections — the pin spacer renders as a tall empty block — so anything pinned
 * is audited this way instead.
 *
 *   ROUTE=/ SIZE=desktop STEPS=14 node scripts/frames.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = process.env.OUT ?? "/home/claude/bloom/work/frames";
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
};

const route = process.env.ROUTE ?? "/";
const size = process.env.SIZE ?? "desktop";
const steps = Number(process.env.STEPS ?? 12);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: VIEWPORTS[size], deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(BASE + route, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1800);

const total = await page.evaluate(() => document.body.scrollHeight);
const vh = VIEWPORTS[size].height;
const name = route === "/" ? "home" : route.replace(/[/?=&]/g, "-").replace(/^-/, "");

for (let i = 0; i < steps; i++) {
  const y = Math.round(((total - vh) / (steps - 1)) * i);
  // Lenis owns scrolling, so nudge it rather than the window when it is present.
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await page.waitForTimeout(750);
  await page.screenshot({
    path: `${OUT}/${name}--${size}--${String(i).padStart(2, "0")}.png`,
  });
}

await browser.close();
console.log(`${steps} frames for ${name} @ ${size} (page ${total}px)`);
if (errors.length) console.log("ERRORS:", [...new Set(errors)].join(" | "));
