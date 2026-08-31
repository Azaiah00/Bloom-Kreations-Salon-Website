import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const [label, vp] of [["desktop",{width:1440,height:900}],["mobile",{width:375,height:812}]]) {
  const p = await (await b.newContext({viewport:vp})).newPage();
  await p.goto("http://localhost:3100/",{waitUntil:"load"});
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(1500);
  const res = await p.evaluate(async () => {
    const track = document.querySelector(".marquee-track");
    const x = () => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const s = [];
    // down fast, up fast, down again — the reversal was the worst case
    const plan = [...Array(40).fill(30), ...Array(40).fill(-40), ...Array(30).fill(25)];
    let i = 0;
    await new Promise((done) => {
      const tick = () => {
        s.push(x());
        if (i < plan.length) { window.scrollBy(0, plan[i]); i++; requestAnimationFrame(tick); }
        else if (s.length < plan.length + 40) requestAnimationFrame(tick);
        else done();
      };
      requestAnimationFrame(tick);
    });
    const d = [];
    for (let k = 1; k < s.length; k++) d.push(Math.abs(s[k] - s[k-1]));
    d.sort((a,b)=>b-a);
    return { frames: s.length, maxJump: +d[0].toFixed(1), second: +d[1].toFixed(1),
             over12: d.filter(v=>v>12).length, median: +d[Math.floor(d.length/2)].toFixed(1) };
  });
  console.log(label, JSON.stringify(res));
}
await b.close();
