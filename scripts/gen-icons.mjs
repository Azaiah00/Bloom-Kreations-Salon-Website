/**
 * Regenerates every raster and vector icon from the ONE traced mark in
 * src/components/marks/butterfly-paths.ts, so a favicon can never drift away
 * from the logo on the page.
 *
 * Outputs
 *   src/app/icon.svg            — vector, what most browsers actually use
 *   src/app/favicon.ico         — 16/32/48, for the ones that do not
 *   src/app/apple-icon.png      — 180, opaque, no rounding (iOS masks it)
 *   public/icon-192.png         — manifest, "any"
 *   public/icon-512.png         — manifest, "any"
 *   public/icon-maskable-512.png— manifest, "maskable" (80% safe circle)
 *   public/brand/mark-neon.svg  — transparent neon mark, for OG + share art
 *
 *   node scripts/gen-icons.mjs            write files
 *   node scripts/gen-icons.mjs --check    fail if any file is stale
 *
 * Run it after ANY change to butterfly-paths.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHECK = process.argv.includes("--check");

/* ── palette, read from globals.css so it cannot drift ───────────────────── */

const css = readFileSync(path.join(ROOT, "src/app/globals.css"), "utf8");
function token(name) {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!m) throw new Error(`globals.css has no --color-${name}`);
  return m[1];
}
const CREAM = token("cream");
const ROSE = token("rose");
const ROSE_LITE = token("rose-lite");

/* ── the mark ────────────────────────────────────────────────────────────── */

const src = readFileSync(
  path.join(ROOT, "src/components/marks/butterfly-paths.ts"),
  "utf8"
);
const vb = src.match(
  /BUTTERFLY_VIEWBOX\s*=\s*\{\s*w:\s*([\d.]+),\s*h:\s*([\d.]+)/
);
if (!vb) throw new Error("could not read BUTTERFLY_VIEWBOX");
const VW = Number(vb[1]);
const VH = Number(vb[2]);

function readPath(name) {
  const m = src.match(new RegExp(`${name}\\s*=\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  if (!m) throw new Error(`could not read ${name}`);
  return m[1];
}
const SOLID = readPath("SOLID_PATH");
const SILHOUETTE = readPath("SILHOUETTE_PATH");

/**
 * Places the mark centred in a square tile at a given optical width.
 * `frac` is the mark's width as a fraction of the tile.
 */
function placed(tile, frac) {
  const s = (tile * frac) / VW;
  const tx = (tile - VW * s) / 2;
  const ty = (tile - VH * s) / 2;
  return `translate(${round(tx)} ${round(ty)}) scale(${round(s, 5)})`;
}
const round = (n, d = 3) => Number(n.toFixed(d));

/* ── tiles ───────────────────────────────────────────────────────────────── */

/**
 * The app tile. Rose ground, cream mark — 5.4:1, and never the detail variant,
 * which is a line drawing and dies below 40px.
 *
 * Two shapes, split by where the icon is actually seen:
 *   silhouette — tab favicon (16-48px). Filled, so it survives a 16px tab.
 *   solid      — home-screen and manifest icons (180px+), where the open rope
 *                loops still read and carry the actual brand idea.
 * They are never seen side by side, which is the only reason the split is safe.
 */
function tileSvg({
  tile = 64,
  radius = 0.22,
  frac = 0.7,
  ground = ROSE,
  mark = CREAM,
  shape = SOLID,
} = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile} ${tile}" width="${tile}" height="${tile}">
  <rect width="${tile}" height="${tile}"${radius ? ` rx="${round(tile * radius)}"` : ""} fill="${ground}"/>
  <path transform="${placed(tile, frac)}" fill="${mark}" d="${shape}"/>
</svg>`;
}

/** Transparent neon mark on nothing — for dark share art and the OG card. */
function neonMarkSvg(w = 512) {
  const h = round((w * VH) / VW);
  const s = round(w / VW, 5);
  const blur = round(w * 0.022);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${blur}" result="b"/>
      <feFlood flood-color="${ROSE_LITE}" flood-opacity="0.85" result="c"/>
      <feComposite in="c" in2="b" operator="in" result="g"/>
      <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <path filter="url(#glow)" transform="scale(${s})" fill="${ROSE_LITE}" d="${SOLID}"/>
</svg>`;
}

/* ── ICO writer (PNG-payload ICO — every browser since IE11) ─────────────── */

function ico(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  images.forEach((img, i) => {
    const o = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, o);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(img.data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += img.data.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

/* ── emit ────────────────────────────────────────────────────────────────── */

const stale = [];
function emit(rel, buf) {
  const abs = path.join(ROOT, rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  const next = Buffer.isBuffer(buf) ? buf : Buffer.from(buf, "utf8");
  const same =
    existsSync(abs) &&
    createHash("sha1").update(readFileSync(abs)).digest("hex") ===
      createHash("sha1").update(next).digest("hex");
  if (CHECK) {
    if (!same) stale.push(rel);
    return;
  }
  if (!same) writeFileSync(abs, next);
  console.log(`${same ? "  ok  " : "write "} ${rel}`);
}

const png = (svg, size, opts = {}) =>
  sharp(Buffer.from(svg)).resize(size, size, { fit: "contain", ...opts }).png({ compressionLevel: 9 }).toBuffer();

// Tab icon. Every browser that reads icon.svg draws it at 16-32px, so it gets
// the silhouette, matching the .ico rather than the home-screen icons.
emit("src/app/icon.svg", tileSvg({ tile: 64, radius: 0.2, frac: 0.76, shape: SILHOUETTE }));
emit("public/brand/mark-neon.svg", neonMarkSvg(512));

// Raster sizes render from a large tile so the curves stay clean.
const big = tileSvg({ tile: 512, radius: 0.22, frac: 0.7 });
const square = tileSvg({ tile: 512, radius: 0, frac: 0.68 }); // iOS rounds it itself
const maskable = tileSvg({ tile: 512, radius: 0, frac: 0.52 }); // inside the 80% safe circle

emit("src/app/apple-icon.png", await png(square, 180));
emit("public/icon-192.png", await png(big, 192));
emit("public/icon-512.png", await png(big, 512));
emit("public/icon-maskable-512.png", await png(maskable, 512));

// Favicon: 16 goes square — a 3px radius on a 16px tile just eats pixels off a
// mark already fighting for them — 32 and 48 keep the rounding.
const fav = (radius, frac) =>
  tileSvg({ tile: 64, radius, frac, shape: SILHOUETTE });
emit(
  "src/app/favicon.ico",
  ico([
    { size: 16, data: await png(fav(0, 0.84), 16) },
    { size: 32, data: await png(fav(0.16, 0.8), 32) },
    { size: 48, data: await png(fav(0.2, 0.76), 48) },
  ])
);

if (CHECK && stale.length) {
  console.error(
    `\nicons are stale — run \`node scripts/gen-icons.mjs\`:\n  ${stale.join("\n  ")}\n`
  );
  process.exit(1);
}
if (CHECK) console.log("icons up to date");
