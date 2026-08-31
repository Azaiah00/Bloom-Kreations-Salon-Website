/**
 * Proves that utility classes the markup depends on actually produce CSS.
 *
 * This exists because of a real bug. The pinned sections were first gated with
 * Tailwind v4 arbitrary variants:
 *
 *     [@media(min-width:1024px)and(min-height:820px)]:h-screen
 *
 * Tailwind v4 silently dropped those compound queries. `tsc` passed, `eslint`
 * passed, `next build` passed, and the rendered-DOM audit passed — because none
 * of them check whether a class emits a rule. The gate simply did not exist in
 * the CSS. The fix was `@custom-variant`, and this check is what makes the
 * failure loud next time.
 *
 * Run against a production build:
 *   npm run build && node scripts/check-css.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BUILD_DIR = ".next";

function findCss(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) findCss(p, out);
    else if (e.endsWith(".css")) out.push(p);
  }
  return out;
}

const files = findCss(BUILD_DIR);
if (!files.length) {
  console.error(
    `\n  No CSS found under ${BUILD_DIR}. Run \`npm run build\` first.\n`
  );
  process.exit(1);
}

const css = files.map((f) => readFileSync(f, "utf8")).join("\n");

/**
 * Every @custom-variant declared in globals.css must appear as a real media
 * query in the built output. Parsed from source so the two cannot drift.
 */
const source = readFileSync("src/app/globals.css", "utf8");
const variants = [...source.matchAll(/@custom-variant\s+([\w-]+)\s*\(([^;]+)\);/g)].map(
  ([, name, body]) => ({ name, body: body.trim() })
);

/** Things the design depends on that would be invisible if they vanished. */
const REQUIRED = [
  { what: "pin gate height", needle: /min-height:\s*820px/ },
  { what: "rail gate height", needle: /min-height:\s*700px/ },
  { what: "pin gate width", needle: /min-width:\s*1024px/ },
  { what: "rail gate width", needle: /min-width:\s*768px/ },
  { what: "pill radius token", needle: /border-radius:\s*var\(--radius-pill\)|border-radius:\s*999px/ },
  { what: "section rhythm token", needle: /--spacing-section|padding-block:\s*var\(--spacing-section\)/ },
  { what: "rose brand colour", needle: /#c21e52/i },
  { what: "cream page ground", needle: /#fdf6ee/i },
  { what: "studio dark ground", needle: /#120c0d/i },
  { what: "reduced-motion block", needle: /prefers-reduced-motion/ },
];

const fails = [];

console.log(`\n  Built CSS: ${files.length} file(s), ${(css.length / 1024).toFixed(0)} KB\n`);

for (const v of variants) {
  // Pull the numeric conditions out of the variant body and require each one.
  const conditions = [...v.body.matchAll(/(min|max)-(width|height):\s*(\d+)px/g)];
  if (!conditions.length) continue;
  const missing = conditions.filter(
    ([, dir, axis, px]) =>
      !new RegExp(`${dir}-${axis}:\\s*${px}px`).test(css)
  );
  if (missing.length) {
    fails.push(
      `@custom-variant ${v.name} declared but its query is absent from the built CSS ` +
        `(${missing.map(([m]) => m).join(", ")})`
    );
  } else {
    console.log(`  PASS  @custom-variant ${v.name}`);
  }
}

for (const r of REQUIRED) {
  if (r.needle.test(css)) {
    console.log(`  PASS  ${r.what}`);
  } else {
    fails.push(`${r.what} produced no CSS (looked for ${r.needle})`);
  }
}

/**
 * Catch the general shape of the original bug: an arbitrary-variant class in
 * source whose media query never reaches the output.
 */
function scanSource(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) scanSource(p, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(e)) out.push(p);
  }
  return out;
}

const arbitrary = new Set();
for (const f of scanSource("src")) {
  const t = readFileSync(f, "utf8");
  for (const [, q] of t.matchAll(/\[@media\(([^)]*\)[^\]]*)\]:/g)) {
    arbitrary.add(`${f}: [@media(${q}]`);
  }
}
if (arbitrary.size) {
  fails.push(
    `arbitrary [@media(...)] variants found in source — these silently emit nothing ` +
      `for compound queries. Use @custom-variant instead:\n      ` +
      [...arbitrary].join("\n      ")
  );
}

if (fails.length) {
  console.error("\n=== CSS FINDINGS ===");
  fails.forEach((f) => console.error("  ! " + f));
  console.error("");
  process.exit(1);
}

console.log("\n  Every declared variant and design-critical token reaches the built CSS.\n");
