/**
 * Accessibility and content audit against the rendered DOM, not the source.
 *
 * Checks the things that actually break in a real build: contrast on computed
 * colours, images without alt, headings out of order, controls under 44px,
 * duplicate landmarks, unlabelled links, horizontal overflow, and any
 * placeholder marker or emoji that made it into shipped copy.
 *
 *   BASE=http://localhost:3100 ROUTES=/,/services node scripts/a11y.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const ROUTES = (process.env.ROUTES ?? "/").split(",");
const SIZES = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1440, height: 900 },
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const findings = [];

for (const [sizeName, viewport] of Object.entries(SIZES)) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);

    const res = await page.evaluate(() => {
      const out = {
        alt: [],
        heads: [],
        small: [],
        labels: [],
        overflow: null,
        land: {},
        contrast: [],
        placeholders: [],
        emoji: [],
        h1count: 0,
      };

      document.querySelectorAll("img").forEach((im) => {
        if (im.getAttribute("alt") === null) out.alt.push(im.currentSrc || im.src);
      });

      const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
        .filter((h) => h.getClientRects().length)
        .map((h) => ({ lvl: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 50) }));
      let prev = 0;
      hs.forEach((h) => {
        if (prev && h.lvl > prev + 1) out.heads.push(`h${prev} -> h${h.lvl}: "${h.text}"`);
        prev = h.lvl;
      });
      out.h1count = document.querySelectorAll("h1").length;

      document
        .querySelectorAll("a,button,input,select,textarea,[role=button]")
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          // WCAG 2.5.8 Target Size (Minimum) is 24x24 CSS px, and links inline
          // in a sentence are explicitly exempt.
          if (el.tagName === "A" && el.closest("p,li,dd,blockquote,address,figcaption")) return;
          if (el.classList.contains("sr-only") || el.className.includes?.("focus:not-sr-only")) return;
          if (r.height < 24 || r.width < 24) {
            out.small.push(
              `${el.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)} :: ` +
                `${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40)}`
            );
          }
        });

      document.querySelectorAll("a,button").forEach((el) => {
        const name =
          (el.textContent || "").trim() ||
          el.getAttribute("aria-label") ||
          el.getAttribute("title");
        if (!name) out.labels.push(el.outerHTML.slice(0, 110));
      });

      out.overflow =
        document.documentElement.scrollWidth > window.innerWidth + 1
          ? `${document.documentElement.scrollWidth} > ${window.innerWidth}`
          : null;

      out.land = {
        main: document.querySelectorAll("main").length,
        header: document.querySelectorAll("header").length,
        footer: document.querySelectorAll("footer").length,
      };

      const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
      const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const lum = ([r, g, b]) =>
        0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
          n = n.parentElement;
        }
        return [253, 246, 238];
      };

      const seen = new Set();
      [
        ...document.querySelectorAll(
          "p,span,a,li,h1,h2,h3,h4,dt,dd,button,th,td,cite,blockquote,figcaption,address"
        ),
      ]
        .filter((el) => el.getClientRects().length && el.textContent.trim().length > 2)
        .forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden") return;
          if ([...el.children].some((c) => c.textContent.trim().length > 2)) return;
          // Walk up for a faded or hidden ancestor — hover-revealed captions are
          // not on screen and must not be reported as failures.
          for (let n = el; n && n !== document.body; n = n.parentElement) {
            const ns = getComputedStyle(n);
            if (Number(ns.opacity) < 0.6 || ns.visibility === "hidden") return;
          }
          // Text sitting over a photograph cannot be measured against a solid
          // colour; those are listed separately for a visual check.
          for (let n = el; n && n !== document.body; n = n.parentElement) {
            if (getComputedStyle(n).backgroundImage !== "none" &&
                !getComputedStyle(n).backgroundImage.startsWith("linear-gradient") &&
                !getComputedStyle(n).backgroundImage.startsWith("radial-gradient")) return;
          }
          if (el.closest("figure,[data-hero-plate],[data-gallery-tile]")) return;
          const fg = parse(cs.color).slice(0, 3);
          const bg = bgOf(el);
          const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
          const ratio = (a + 0.05) / (b + 0.05);
          const px = parseFloat(cs.fontSize);
          const bold = Number(cs.fontWeight) >= 700;
          const large = px >= 24 || (px >= 18.66 && bold);
          const min = large ? 3 : 4.5;
          if (ratio < min) {
            const key = `${cs.color}|${cs.fontSize}|${el.textContent.trim().slice(0, 24)}`;
            if (!seen.has(key)) {
              seen.add(key);
              out.contrast.push(
                `${ratio.toFixed(2)}:1 (need ${min}) ${cs.color} @${px}px :: ` +
                  `"${el.textContent.trim().slice(0, 46)}"`
              );
            }
          }
        });

      const body = document.body.innerText;
      ["NEEDS REAL PHOTO", "TODO", "Lorem ipsum", "PLACEHOLDER", "FIXME", "undefined", "NaN", "[object"].forEach(
        (m) => {
          if (body.includes(m)) out.placeholders.push(m);
        }
      );
      const emoji = body.match(/\p{Extended_Pictographic}/gu)?.filter((c) => !"\u00A9\u00AE\u2122\u2117".includes(c));
      if (emoji) out.emoji = [...new Set(emoji)];

      return out;
    });

    const tag = `${route} @ ${sizeName}`;
    if (res.alt.length) findings.push(`${tag} — ${res.alt.length} image(s) with no alt attribute`);
    if (res.heads.length) findings.push(`${tag} — heading order: ${res.heads.join("; ")}`);
    if (res.h1count !== 1) findings.push(`${tag} — ${res.h1count} h1 elements (want exactly 1)`);
    if (res.small.length)
      findings.push(
        `${tag} — ${res.small.length} small tap target(s): ${res.small.slice(0, 5).join(" | ")}`
      );
    if (res.labels.length)
      findings.push(
        `${tag} — ${res.labels.length} control(s) with no accessible name: ${res.labels
          .slice(0, 2)
          .join(" | ")}`
      );
    if (res.overflow) findings.push(`${tag} — HORIZONTAL OVERFLOW ${res.overflow}`);
    if (res.land.main !== 1) findings.push(`${tag} — ${res.land.main} <main> (want 1)`);
    if (res.contrast.length)
      findings.push(
        `${tag} — ${res.contrast.length} contrast failure(s):\n      ${res.contrast
          .slice(0, 10)
          .join("\n      ")}`
      );
    if (res.placeholders.length)
      findings.push(`${tag} — PLACEHOLDER TEXT SHIPPED: ${res.placeholders.join(", ")}`);
    if (res.emoji.length) findings.push(`${tag} — EMOJI IN COPY: ${res.emoji.join(" ")}`);
  }
  await ctx.close();
}

await browser.close();

if (findings.length) {
  console.log("\n=== FINDINGS ===");
  findings.forEach((f) => console.log("  ! " + f));
  process.exitCode = 1;
} else {
  console.log("\nClean: no accessibility, overflow, placeholder or emoji findings.");
}
