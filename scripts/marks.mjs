/**
 * Photographs every instance of the butterfly mark on the rendered site.
 *
 * The mark now appears at sizes from 20px to 416px, in three traced variants,
 * with and without the neon glow, and three of those instances only reach their
 * final state after a ScrollTrigger fires. Reading the JSX tells you none of
 * that. This scrolls each one into view, lets its animation finish, and shoots
 * it against the ground it actually sits on.
 *
 *   node scripts/marks.mjs                 every route
 *   ROUTES=/,/about node scripts/marks.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = process.env.OUT ?? "/home/claude/bloom/work/marks";
mkdirSync(OUT, { recursive: true });

const ROUTES = (
  process.env.ROUTES ??
  "/,/about,/services,/book,/portal,/gallery,/nope"
).split(",");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

const rows = [];

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const marks = page.locator('svg[viewBox="0 0 128 99.97"]');
  const n = await marks.count();

  for (let i = 0; i < n; i++) {
    const el = marks.nth(i);
    const box = await el.boundingBox();
    if (!box || box.width < 4) continue;

    // Not scrollIntoViewIfNeeded: Lenis animates the scroll, so Playwright's
    // stability wait never settles and the call hangs.
    const target = await el.evaluate(
      (n) => n.getBoundingClientRect().top + window.scrollY - 420
    );
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y)), target);
    // ScrollTriggers fire at "top 85-88%", and the weave stagger runs ~1.8s.
    await page.waitForTimeout(2200);

    const meta = await el.evaluate((s) => {
      const r = s.getBoundingClientRect();
      let bg = "transparent";
      let p = s.parentElement;
      while (p) {
        const c = getComputedStyle(p).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)") {
          bg = c;
          break;
        }
        p = p.parentElement;
      }
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        paths: s.querySelectorAll("path").length,
        colour: getComputedStyle(s).color,
        filter: getComputedStyle(s).filter,
        opacity: getComputedStyle(s).opacity,
        bg,
      };
    });

    const variant =
      meta.paths === 1 ? "one-path" : meta.paths > 40 ? "detail" : `${meta.paths}p`;
    const name = `${route.replace(/\//g, "_") || "_home"}-${i}`;
    const file = join(OUT, `${name}.png`);
    // page.screenshot with a clip, not el.screenshot: the footer mark flaps
    // forever, and an element screenshot waits for it to hold still.
    const now = await el.boundingBox();
    if (now && now.width > 3 && now.height > 3) {
      const pad = Math.min(24, Math.max(6, now.width * 0.25));
      await page.screenshot({
        path: file,
        animations: "disabled",
        clip: {
          x: Math.max(0, now.x - pad),
          y: Math.max(0, now.y - pad),
          width: Math.min(1440 - Math.max(0, now.x - pad), now.width + pad * 2),
          height: Math.min(900 - Math.max(0, now.y - pad), now.height + pad * 2),
        },
      }).catch(() => {});
    }

    rows.push({
      route,
      i,
      size: `${meta.w}x${meta.h}`,
      variant,
      neon: meta.filter && meta.filter !== "none" ? "neon" : "-",
      colour: meta.colour,
      bg: meta.bg,
      file,
    });
    console.log(
      `${route.padEnd(11)} #${i}  ${String(meta.w).padStart(3)}px  ${variant.padEnd(8)}  ` +
        `${(meta.filter === "none" ? "-" : "neon").padEnd(5)} on ${meta.bg}`
    );
  }
}

writeFileSync(join(OUT, "index.json"), JSON.stringify(rows, null, 2));
console.log(`\n${rows.length} marks photographed into ${OUT}`);

await browser.close();
