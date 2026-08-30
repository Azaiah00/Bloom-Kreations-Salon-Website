# Bloom Kreations

Website and booking portal for **Bloom Kreations LLC** — Latesha Reed, loctician,
Bridgeport, Chicago.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP ScrollTrigger · Lenis ·
self-hosted variable fonts · deployed to Netlify.

```bash
npm install
npm run dev        # http://localhost:3000
npm run verify     # typecheck + lint + contrast + build
```

## What is here

**Marketing site** — home, services and prices, gallery, the loc journey, about,
visit, questions, policies.
**Booking** — a five-step booker with a running price and duration total, showing the
finish time before you confirm.
**Portal** — separate client and owner dashboards, running in demo mode on typed mock
data.

Her live Acuity calendar is linked from every booking surface, so the site converts
from day one regardless of the portal.

## Documentation

| File | What it holds |
|---|---|
| `HANDOFF.md` | The credential caution, everything the client still owes, the positioning strategy, deploy steps, and the audit results |
| `DESIGN.md` | Tokens, the measured contrast table, the type scale, and the motion spec |
| `CLAUDE.md` | Standing rules for anyone (or any agent) working on this next |

## Audits

```bash
npm run audit:contrast   # measured WCAG ratios against globals.css
npm run audit:a11y       # rendered-DOM: contrast, alt, headings, targets, overflow,
                         # landmarks, shipped placeholders, emoji
npm run audit:flow       # 13 end-to-end tests incl. reduced motion and no-JS
npm run frames           # viewport frames at scroll depths, for pinned sections
```

The three audit scripts need the built site running on `:3100`
(`npm run build && npx next start -p 3100`).

## Facts

Every fact about the business lives in `src/lib/business.ts` — NAP, hours, the full
service menu with real prices and durations, and real attributed Google reviews.
`src/lib/schema.ts` generates the JSON-LD from that same file, so the structured data
and the page can never disagree. Nothing in this repo invents a fact about her.
