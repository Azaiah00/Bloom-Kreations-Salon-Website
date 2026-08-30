# CLAUDE.md — Bloom Kreations

Client website and booking portal for **Bloom Kreations LLC** — Latesha Reed
("Pookie"), loctician, 928 W 38th Pl, Chicago IL 60609.

Read `DESIGN.md` before touching anything visual and `HANDOFF.md` before touching
anything factual. Both are binding, not advisory.

## Non-negotiables

1. **`src/lib/business.ts` is the only source of facts about her.** NAP, hours,
   service names, prices, durations, reviews. `src/lib/schema.ts` reads from the same
   file so the JSON-LD and the visible page cannot drift apart. Never hardcode a
   price, a phone number or an address in a component.
2. **No invented facts.** No placeholder testimonials, no guessed policies, no
   "starting from" pricing. Where something is unconfirmed it renders a visible
   marker — `priceStatus: "unconfirmed"`, a `note` on the service, or the open-items
   list on `/policies`.
3. **No licence or certification claim anywhere.** See §1 of `HANDOFF.md`. This is
   deliberate and it stays that way until she supplies documentation.
4. **No emoji in the site.** Her Instagram captions are emoji-rich; keep her phrasing,
   drop the emoji, use Lucide icons or the marks in `src/components/marks/Marks.tsx`.
   `npm run audit:a11y` fails if one ships.
5. **Demo mode.** Everything the portal reads or writes goes through `src/lib/db.ts`.
   In-memory only — no localStorage, no network, no payments. Backend seams are
   marked `// TODO(backend):`.

## Design system

`DESIGN.md` holds the tokens and the measured contrast table. Two things that have
bitten this codebase already:

- **Tailwind v4 has no arbitrary-property shorthand for theme variables.**
  `rounded-[--radius-pill]` silently does nothing. Because the values are declared in
  `@theme`, the utilities are `rounded-pill`, `rounded-card`, `rounded-media`,
  `rounded-sheet`, `bg-rose`, `text-honey`, `py-section`.
- **Contrast is measured.** `npm run audit:contrast` reads the hex values straight out
  of `globals.css` and fails on any pair below what `DESIGN.md` promises. Change a
  colour, run it.

## Motion

Lenis drives scrolling, GSAP ScrollTrigger drives anything tied to scroll position,
and they share one ticker (`SmoothScroll.tsx`, mounted in the root layout). The
vocabulary lives in `src/components/motion/hooks.ts`; one signature move per section.

**A pinned section is gated on viewport height as well as width.** `PIN_QUERY` and
`RAIL_QUERY` are exported so the markup can gate its `h-screen` on exactly the same
query the motion uses. If those two disagree the section clips — that is how
`1024×768` broke during this build.

Everything honours `prefers-reduced-motion` by jumping to the finished state. Reduced
motion must show the same content, never less; `npm run audit:flow` tests it.

## Before any handoff

```bash
npm run verify         # typecheck + lint + contrast + build
# then, with the built site on :3100
npm run audit:a11y     # rendered-DOM checks across every route at 375 and 1440
npm run audit:flow     # 13 end-to-end tests
npm run frames         # look at the pinned sections at real scroll depths
```

Screenshot before believing anything is done. Every real bug in this build was found
by looking at a rendered page, not by reading the code.

## Environment

- **Never `npm install` inside the OneDrive folder** — npm hangs and git cannot unlink
  its lock files. Clone somewhere local.
- Node 20.9+ (Next 16 minimum). Deploy target is Netlify; `netlify.toml` is committed
  and the publish directory is deliberately left to the Next plugin.
