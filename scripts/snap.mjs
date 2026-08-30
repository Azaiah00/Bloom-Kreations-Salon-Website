import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1500, height: 400 }, deviceScaleFactor: 2 });
await p.goto("file://" + process.argv[2]);
await p.waitForTimeout(400);
await p.screenshot({ path: process.argv[3], fullPage: true });
await b.close();
