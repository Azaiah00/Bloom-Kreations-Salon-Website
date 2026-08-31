/**
 * End-to-end test of the things a client actually does. A build that compiles
 * and passes contrast can still have a booker that does not book.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const fails = [];
const pass = [];

async function check(name, fn) {
  try {
    await fn();
    pass.push(name);
  } catch (e) {
    fails.push(`${name} — ${e.message.split("\n")[0]}`);
  }
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
// Uncaught exceptions are kept apart from console noise because they FAIL the
// run. A page that throws while still rendering something passes every other
// gate in this repo, which is exactly how the pinned-navigation bug shipped.
const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));

/* --- Booking, all five steps ------------------------------------------- */

await check("booker: full five-step flow completes", async () => {
  await page.goto(`${BASE}/book`, { waitUntil: "load" });
  await page.waitForTimeout(700);

  // 1. service
  await page.getByRole("button", { name: /^Retwist/ }).first().click();
  await page.waitForTimeout(500);
  if (!(await page.getByText("Pick a day.").isVisible())) throw new Error("did not reach step 2");

  // running total must already be populated
  const total = await page.locator("aside").getByText("$110").first();
  if (!(await total.isVisible())) throw new Error("running total missing after service pick");

  // 2. date — first day that is not full
  await page.locator("li button:not([disabled])").filter({ hasText: /slots/ }).first().click();
  await page.waitForTimeout(500);
  if (!(await page.getByText("Pick a start time.").isVisible())) throw new Error("did not reach step 3");

  // 3. time
  await page.locator("li button").filter({ hasText: /ends/ }).first().click();
  await page.waitForTimeout(500);
  if (!(await page.getByText("Who is the chair for?").isVisible())) throw new Error("did not reach step 4");

  // 4. details — confirm must be disabled until name + phone are present
  const confirm = page.getByRole("button", { name: "Confirm appointment" }).first();
  if (!(await confirm.isDisabled())) throw new Error("confirm was enabled with no details");
  await page.locator('input[autocomplete="name"]').fill("Test Client");
  await page.locator('input[autocomplete="tel"]').fill("7735550000");
  await page.waitForTimeout(300);
  if (await confirm.isDisabled()) throw new Error("confirm still disabled after valid details");

  // 5. confirm
  await confirm.click();
  await page.waitForTimeout(900);
  if (!(await page.getByText(/You are in the book/).isVisible()))
    throw new Error("no confirmation screen");
});

await check("booker: the new booking reaches the client portal", async () => {
  await page.goto(`${BASE}/portal/client`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  // The demo store is per-server-process, so the booking made above is visible.
  const body = await page.locator("body").innerText();
  if (!body.includes("Retwist")) throw new Error("no retwist in the portal history");
});

await check("booker: a deep link preselects the service and skips to step 2", async () => {
  await page.goto(`${BASE}/book?service=soft-locs`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  if (!(await page.getByText("Pick a day.").isVisible()))
    throw new Error("deep link did not skip to step 2");
  if (!(await page.locator("aside").getByText("$300").first().isVisible()))
    throw new Error("deep-linked price not in the summary");
});

await check("booker: an unknown service id falls back to step 1", async () => {
  await page.goto(`${BASE}/book?service=not-a-real-service`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  if (!(await page.getByText("What are you booking?").isVisible()))
    throw new Error("bad service id did not fall back safely");
});

await check("booker: search filters the menu", async () => {
  await page.goto(`${BASE}/book`, { waitUntil: "load" });
  await page.waitForTimeout(600);
  await page.getByPlaceholder(/Search/).fill("butterfly");
  await page.waitForTimeout(400);
  const n = await page.locator("ul li button[aria-pressed]").count();
  if (n !== 2) throw new Error(`expected 2 butterfly services, got ${n}`);
});

/* --- Gallery ------------------------------------------------------------ */

await check("gallery: filters narrow the grid", async () => {
  await page.goto(`${BASE}/gallery`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  const before = await page.locator("ul li button[aria-label^='Open larger view']").count();
  await page.getByRole("button", { name: /^Starter Locs/ }).click();
  await page.waitForTimeout(500);
  const after = await page.locator("ul li button[aria-label^='Open larger view']").count();
  if (after >= before || after === 0) throw new Error(`filter did nothing (${before} -> ${after})`);
});

await check("gallery: the lightbox opens and links to the service", async () => {
  await page.goto(`${BASE}/gallery`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  await page.locator("button[aria-label^='Open larger view']").first().click();
  await page.waitForTimeout(500);
  const dialog = page.getByRole("dialog");
  if (!(await dialog.isVisible())) throw new Error("lightbox did not open");
  if (!(await dialog.getByRole("link", { name: /Book this/ }).isVisible()))
    throw new Error("no book link in the lightbox");
});

/* --- Owner portal ------------------------------------------------------- */

await check("owner: marking an appointment done moves the money", async () => {
  await page.goto(`${BASE}/portal/owner`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  const before = await page.locator("text=/Booked ahead/").locator("..").innerText();
  await page.getByRole("button", { name: "Done" }).first().click();
  await page.waitForTimeout(500);
  const after = await page.locator("text=/Booked ahead/").locator("..").innerText();
  if (before === after) throw new Error("booked-ahead figure did not change");
});

await check("owner: price confirmation toggles", async () => {
  await page.goto(`${BASE}/portal/owner`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  const btn = page.getByRole("button", { name: "Confirm this" }).first();
  await btn.click();
  await page.waitForTimeout(400);
  if (!(await page.getByRole("button", { name: "Confirmed" }).first().isVisible()))
    throw new Error("confirm did not stick");
});

/* --- Header / navigation ------------------------------------------------ */

await check("mobile nav opens, navigates and closes", async () => {
  const m = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mp = await m.newPage();
  await mp.goto(`${BASE}/`, { waitUntil: "load" });
  await mp.waitForTimeout(900);
  await mp.getByRole("button", { name: "Open menu" }).click();
  await mp.waitForTimeout(400);
  const drawer = mp.locator("#mobile-nav");
  if (!(await drawer.isVisible())) throw new Error("drawer did not open");
  await drawer.getByRole("link", { name: "Services" }).click();
  await mp.waitForTimeout(1200);
  if (!mp.url().includes("/services")) throw new Error("drawer link did not navigate");
  if (await drawer.isVisible()) throw new Error("drawer stayed open after navigating");
  await m.close();
});

/* --- Structured data ---------------------------------------------------- */

await check("every page emits valid JSON-LD", async () => {
  for (const r of ["/", "/services", "/loc-journey", "/faq", "/gallery", "/about"]) {
    await page.goto(BASE + r, { waitUntil: "load" });
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    if (!blocks.length) throw new Error(`${r} has no JSON-LD`);
    for (const b of blocks) {
      const parsed = JSON.parse(b);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const o of arr) {
        if (!o["@context"] || !o["@type"]) throw new Error(`${r} JSON-LD missing @context/@type`);
        if (JSON.stringify(o).includes("undefined"))
          throw new Error(`${r} JSON-LD contains "undefined"`);
      }
    }
  }
});

/* --- Reduced motion ----------------------------------------------------- */

await check("reduced motion still shows every section", async () => {
  const rm = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rp = await rm.newPage();
  await rp.goto(`${BASE}/`, { waitUntil: "load" });
  await rp.waitForTimeout(1500);
  const hidden = await rp.evaluate(
    () =>
      [...document.querySelectorAll(".reveal")].filter(
        (el) => getComputedStyle(el).opacity === "0"
      ).length
  );
  if (hidden > 0) throw new Error(`${hidden} .reveal elements still hidden under reduced motion`);
  const text = await rp.locator("body").innerText();
  for (const must of ["Healthy locs", "Starter", "Every price, in the open", "928 W 38th Pl"]) {
    if (!text.includes(must)) throw new Error(`"${must}" missing under reduced motion`);
  }
  await rm.close();
});

/* --- Client-side navigation off the pinned pages ------------------------ */

/**
 * Regression guard. `pin: true` makes ScrollTrigger wrap the pinned element in
 * a spacer div of its own; with a passive effect, React tore the subtree down
 * before GSAP could put it back, and EVERY client-side navigation away from the
 * home page died with "Failed to execute 'removeChild' on 'Node'" — sometimes
 * rendering the error boundary instead of the page. Typecheck, lint, build,
 * contrast, CSS emission and the rendered-DOM audit all passed while that was
 * live, because none of them click a link.
 */
await check("leaving a pinned page by link throws nothing", async () => {
  for (const [from, linkName] of [
    ["/", "Services"],
    ["/", "Gallery"],
    ["/loc-journey", "Services"],
    ["/gallery", "About"],
  ]) {
    await page.goto(BASE + from, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const before = pageErrors.length;
    await page.getByRole("navigation").getByRole("link", { name: linkName }).first().click();
    await page.waitForTimeout(1500);
    if (pageErrors.length > before) {
      throw new Error(`${from} -> ${linkName} threw: ${pageErrors[before]}`);
    }
    const h1 = await page.locator("h1").first().innerText();
    if (/couldn|error/i.test(h1)) throw new Error(`${from} -> ${linkName} hit the error boundary`);
  }
});

/* --- Demo switcher ------------------------------------------------------ */

await check("demo switcher reaches every portal sign-in", async () => {
  const want = [
    [/Owner dashboard/, "/portal/owner", /Your book/],
    [/Ava Sample/, "/portal/client?as=c-demo", /Ava/],
    [/Nia Sample/, "/portal/client?as=c-2", /Nia/],
    [/Rae Sample/, "/portal/client?as=c-3", /Rae/],
    [/Kim Sample/, "/portal/client?as=c-4", /Kim/],
    [/Role picker/, "/portal", /Two sides/],
    [/Booking flow/, "/book", /Five steps/],
  ];

  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(1200);

  for (const [name, url, heading] of want) {
    const before = pageErrors.length;
    await page.getByRole("button", { name: "Demo" }).click();
    await page.waitForTimeout(400);
    await page.getByRole("link", { name }).click();
    await page.waitForTimeout(1500);

    if (!page.url().endsWith(url)) throw new Error(`${name} went to ${page.url()}, wanted ${url}`);
    const h1 = await page.locator("h1").first().innerText();
    if (!heading.test(h1)) throw new Error(`${name} landed on "${h1.replace(/\n/g, " ")}"`);
    if (pageErrors.length > before) throw new Error(`${name} threw: ${pageErrors[before]}`);
  }
});

await check("each demo client shows its own loc journey", async () => {
  // The whole point of four sign-ins is that the portal looks different at one
  // month than at three years. If they all render the same timeline, the demo
  // is showing one screen four times.
  const counts = {};
  for (const id of ["c-demo", "c-2", "c-3", "c-4"]) {
    await page.goto(`${BASE}/portal/client?as=${id}`, { waitUntil: "load" });
    await page.waitForTimeout(1000);
    counts[id] = await page.locator("ol li h3").count();
    if (counts[id] === 0) throw new Error(`${id} has an empty journey`);
  }
  if (new Set(Object.values(counts)).size === 1) {
    throw new Error(`every client shows the same journey length (${JSON.stringify(counts)})`);
  }
});

await check("an unknown ?as= falls back rather than throwing", async () => {
  const before = pageErrors.length;
  await page.goto(`${BASE}/portal/client?as=not-a-real-client`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  if (pageErrors.length > before) throw new Error("threw on an unknown client id");
  const h1 = await page.locator("h1").first().innerText();
  if (!/Ava/.test(h1)) throw new Error(`fell back to "${h1}" instead of the default client`);
});

/* --- No-JS -------------------------------------------------------------- */

await check("content is present with JavaScript disabled", async () => {
  const nj = await browser.newContext({ javaScriptEnabled: false });
  const np = await nj.newPage();
  await np.goto(`${BASE}/services`, { waitUntil: "load" });
  const text = await np.locator("body").innerText();
  for (const must of ["Loc Services", "$110", "Starter Locs", "928 W 38th Pl"]) {
    if (!text.includes(must)) throw new Error(`"${must}" missing without JS`);
  }
  await nj.close();
});

await browser.close();

console.log("\n=== FLOW TESTS ===");
pass.forEach((p) => console.log("  PASS  " + p));
fails.forEach((f) => console.log("  FAIL  " + f));
const uniquePageErrors = [...new Set(pageErrors)];
if (uniquePageErrors.length) {
  console.log("\n  UNCAUGHT PAGE ERRORS (these fail the run):");
  uniquePageErrors.forEach((e) => console.log("   ! " + e.slice(0, 200)));
}
if (consoleErrors.length) {
  console.log("\n  Console errors seen:");
  [...new Set(consoleErrors)].forEach((e) => console.log("   - " + e.slice(0, 160)));
}
console.log(
  `\n  ${pass.length} passed, ${fails.length} failed` +
    `${uniquePageErrors.length ? `, ${uniquePageErrors.length} uncaught page error(s)` : ""}\n`
);
if (fails.length || uniquePageErrors.length) process.exitCode = 1;
