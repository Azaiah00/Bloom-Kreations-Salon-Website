import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto("http://localhost:3100/",{waitUntil:"load"});
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(1500);

const res = await p.evaluate(async () => {
  const track = document.querySelector(".marquee-track");
  if (!track) return { error: "no .marquee-track" };
  const x = () => {
    const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    return m.m41;
  };
  const samples = [];
  let t0 = performance.now();
  // scroll in steps while sampling every animation frame
  const scrollSteps = 60;
  let i = 0;
  await new Promise((resolve) => {
    const tick = () => {
      samples.push({ t: performance.now() - t0, x: x(),
        dur: getComputedStyle(track).animationDuration,
        dir: getComputedStyle(track).animationDirection });
      if (i < scrollSteps) { window.scrollBy(0, 22); i++; requestAnimationFrame(tick); }
      else if (samples.length < scrollSteps + 30) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
  // frame-to-frame deltas
  const jumps = [];
  for (let k = 1; k < samples.length; k++) {
    const dt = samples[k].t - samples[k-1].t;
    const dx = samples[k].x - samples[k-1].x;
    jumps.push({ dx: +dx.toFixed(1), dt: +dt.toFixed(1), dur: samples[k].dur, dir: samples[k].dir });
  }
  const abs = jumps.map(j=>Math.abs(j.dx)).sort((a,b)=>b-a);
  const durs = [...new Set(samples.map(s=>s.dur))];
  const dirs = [...new Set(samples.map(s=>s.dir))];
  return {
    frames: samples.length,
    maxJumpPx: abs[0], p95: abs[Math.floor(abs.length*0.05)], median: abs[Math.floor(abs.length/2)],
    bigJumps: jumps.filter(j=>Math.abs(j.dx) > 12).length,
    distinctDurations: durs.length, durationsSample: durs.slice(0,6),
    directions: dirs,
  };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
