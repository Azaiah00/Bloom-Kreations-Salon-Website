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

- **Tailwind v4 fails silently, twice over.** It has no arbitrary-property shorthand for
  theme variables — `rounded-[--radius-pill]` does nothing; the utilities are
  `rounded-pill`, `rounded-card`, `rounded-media`, `rounded-sheet`, `bg-rose`,
  `text-honey`, `py-section`. And it drops **compound arbitrary media queries**:
  `[@media(min-width:1024px)and(min-height:820px)]:h-screen` compiles clean and emits
  no rule at all. Both pinned sections shipped ungated because of that. Compound
  queries go through `@custom-variant` at the top of `globals.css` — `pin:`, `rail:`,
  `rail-xl:` — and nothing else.
- **`npm run audit:css` is what makes those failures loud.** It reads the built CSS and
  fails if any declared `@custom-variant`, brand colour or radius token never reached
  the output, and rejects arbitrary `[@media(...)]` variants on sight. `tsc`, `eslint`,
  `next build` and the rendered-DOM audit all passed while the gate did not exist —
  none of them check whether a class produces a rule.
- **Contrast is measured.** `npm run audit:contrast` reads the hex values straight out
  of `globals.css` and fails on any pair below what `DESIGN.md` promises. Change a
  colour, run it.

## The mark

`src/components/marks/butterfly-paths.ts` is **generated** — traced from the logo artwork. Do not
hand-edit the path data. `<Butterfly px={n} />` picks one of three variants from the size you
declare (detail ≥40px, solid ≥22px, silhouette below); the call site does not choose, because a
line drawing at nav size is the bug that killed the first mark.

Every icon — `favicon.ico`, `icon.svg`, `apple-icon.png`, `public/icon-{192,512,maskable-512}.png`
and `public/brand/mark-neon.svg` — is produced from those paths by `npm run icons`, with the palette
read out of `globals.css`. `npm run audit:icons` (inside `verify`) fails if any is stale. **Change
`butterfly-paths.ts` or a brand colour and you must re-run `npm run icons`.**

Tailwind is scoped with `@import "tailwindcss" source(none)` + `@source "../../src"`. That is
deliberate: `CLAUDE.md`, `DESIGN.md` and `scripts/check-css.mjs` all quote the broken compound
arbitrary variant as evidence, and left to scan the whole project Tailwind compiles those quotations
into real, broken rules. Any new directory that contains classes must be added to `@source`.

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

## The marquee is a tween, not a CSS animation

Speed used to be expressed by writing `--marquee-duration` on every scroll frame. The
browser re-maps elapsed time onto the new duration, so the track **snaps** — measured at
40.6px in a single frame, 8 jumps over 12px across 90 frames. That was the band visibly
glitching on scroll, on both mobile and desktop. It is now one infinite GSAP tween whose
`timeScale` is eased toward a velocity-derived target; timeScale changes the rate without
moving anything, and going negative reverses smoothly instead of mirroring the position.

Never express motion speed by mutating `animation-duration` or `animation-direction` on a
running animation. `npm run audit:flow` fails if `.marquee-track` reports more than one
`animation-duration`, or if any frame moves it more than 12px. Proven in both directions.

## The demo switcher

`src/components/site/DemoSwitcher.tsx`, mounted in the root layout, is the bottom-left
button that reaches every portal sign-in: the owner dashboard, each demo client at a
different loc stage, the role picker and the signed-out booking flow. It exists because
there is no authentication yet, and hunting for URLs in front of a client is worse than
either option. `devIndicators: false` in `next.config.ts` frees that corner.

Client entries are built from `db.clients()`, so a client added to `db.ts` appears
without anyone remembering to add it here. `/portal/client?as=<id>` picks which one —
read on the server, validated against the store, falling back to the default. **That is
not auth and is not a step toward it.** When real accounts land, delete this component,
its import in `layout.tsx`, and the `as` parameter in `src/app/portal/client/page.tsx`.

**Two DOM traps, both live in this file's comments, both cost real time:**

- The panel is always mounted and toggled with `hidden`. Unmounting it on the click that
  navigates makes React and the App Router race for the same nodes.
- It closes in the link's `onClick`, never by watching `pathname`. A render-phase close
  during a route transition throws.

## GSAP cleanup runs in a layout effect

`useGsapEffect` in `src/components/motion/hooks.ts` is `useLayoutEffect` on the client.
This is not a preference. `pin: true` makes ScrollTrigger wrap the pinned element in a
`pin-spacer` div of its own; with a passive `useEffect`, React tore the subtree down
before the context could put it back, and **every client-side navigation away from the
home page threw `Failed to execute 'removeChild' on 'Node'`**, sometimes rendering the
error boundary instead of the page. Any new GSAP hook uses `useGsapEffect`.

`npm run audit:flow` now fails on any uncaught page error and has an explicit test for
leaving each pinned page by link. Proven in both directions: reverting to `useEffect`
fails two tests and reports the exception.

## Before any handoff

```bash
npm run verify         # typecheck + lint + contrast + icons + build + CSS emission
# then, with the built site on :3100
npm run audit:a11y     # rendered-DOM checks across every route at 375 and 1440
npm run audit:flow     # 18 end-to-end tests; fails on any uncaught page error
npm run frames         # look at the pinned sections at real scroll depths
node scripts/marks.mjs # photograph every butterfly at its real size, ground and scroll depth
```

Screenshot before believing anything is done. Every real bug in this build was found
by looking at a rendered page, not by reading the code.

## Environment

- **Never `npm install` inside the OneDrive folder** — npm hangs and git cannot unlink
  its lock files. Clone somewhere local.
- Node 20.9+ (Next 16 minimum). Deploy target is Netlify; `netlify.toml` is committed
  and the publish directory is deliberately left to the Next plugin.
