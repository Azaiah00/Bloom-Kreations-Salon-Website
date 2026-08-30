/**
 * Fails the build if any documented colour pair drops below the ratio DESIGN.md
 * promises. The previous salon build shipped a 4.23:1 accent because contrast was
 * eyeballed instead of measured; this file exists so that cannot happen again.
 *
 *   node scripts/check-contrast.mjs
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

/** Pull a token's hex straight out of globals.css so the check cannot drift. */
function token(name) {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`Token --color-${name} not found in globals.css`);
  return m[1];
}

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => srgb(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** [foreground, background, minimum, label] */
const PAIRS = [
  ["ink", "cream", 7, "body text on page ground"],
  ["ink", "shell", 7, "body text on alternate ground"],
  ["ink-soft", "cream", 4.5, "secondary text on page ground"],
  ["ink-soft", "shell", 4.5, "secondary text on alternate ground"],
  ["honey", "cream", 4.5, "honey accent text on page ground"],
  ["honey", "shell", 4.5, "honey accent text on alternate ground"],
  ["rose", "cream", 4.5, "rose accent text on page ground"],
  ["cream", "rose", 4.5, "primary button label"],
  ["bone", "studio", 7, "body text in studio sections"],
  ["bone-dim", "studio", 4.5, "secondary text in studio sections"],
  ["honey-lite", "studio", 4.5, "honey accent in studio sections"],
  ["rose-lite", "studio", 4.5, "neon accent in studio sections"],
  ["studio", "honey-lite", 4.5, "studio button label"],
  ["bone", "studio-2", 7, "body text on raised studio surface"],
  ["espresso", "honey-lite", 4.5, "espresso text on honey fill"],
];

let failed = 0;
console.log("\n  Bloom Kreations — contrast audit\n");
for (const [fg, bg, min, label] of PAIRS) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= min;
  if (!ok) failed++;
  const grade = r >= 7 ? "AAA" : r >= 4.5 ? "AA " : r >= 3 ? "AA-L" : "FAIL";
  console.log(
    `  ${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  ${grade.padEnd(4)}  ` +
      `${fg} on ${bg}`.padEnd(28) + `  ${label}`
  );
}

if (failed) {
  console.error(`\n  ${failed} pair(s) below the ratio DESIGN.md promises. Fix the token or the doc.\n`);
  process.exit(1);
}
console.log("\n  All pairs meet or exceed their documented minimum.\n");
