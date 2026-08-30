# Bloom Kreations — DESIGN.md

The single source of truth for this build. **Never use a colour, font, radius or spacing value that is
not a token below.** If something needs a value that does not exist here, add it here first.

---

## 1. Direction — "Bloom & Neon"

Warm cream ground for everything you have to *read* (menu, prices, policies, FAQ), near-black **studio**
sections for everything you have to *look at* (gallery, hero, booking). A single neon rose accent carries
the playfulness; honey carries the warmth. Line-art butterfly and bloom marks draw themselves on scroll.

The reference client is a Chicago loctician whose Instagram is neon-pink script on black and whose work
is photographed in a dark salon. Cream makes her prices legible and her site rank; black makes her hair
photography look like the work it is. The site alternates between the two on purpose.

**No emoji anywhere.** Her Instagram voice is emoji-rich; we keep her phrasing and drop the emoji, and
use Lucide icons or the brand SVG marks in their place.

---

## 2. Palette — sampled, not invented

Every warm value below was quantised out of her own photographs (studio backdrop, copper and burgundy
loc work, her portrait). Cool greys and blue-blacks that appeared in the sample were discarded — the
brand is deliberately warm-black, never blue-black.

| Token | Hex | Role |
|---|---|---|
| `--color-cream` | `#FDF6EE` | Page ground (light) |
| `--color-shell` | `#F6EADC` | Alternate section ground, cards on cream |
| `--color-sand` | `#EADAC6` | Hairlines, dividers, inactive chips on cream |
| `--color-studio` | `#120C0D` | Dark section ground ("studio mode") |
| `--color-studio-2` | `#1D1416` | Raised surfaces inside studio sections |
| `--color-ink` | `#191009` | Primary text on cream |
| `--color-ink-soft` | `#5A483A` | Secondary text on cream |
| `--color-honey` | `#9E5715` | Primary accent **on cream and shell** (links, price, eyebrows) |
| `--color-honey-lite` | `#E9A24A` | Primary accent **on studio** |
| `--color-copper` | `#A0694B` | Tertiary warm, borders on studio |
| `--color-espresso` | `#412B1A` | Deep warm, footer text on honey fills |
| `--color-rose` | `#C21E52` | Neon accent **on cream** (CTA fill, active state) |
| `--color-rose-lite` | `#FF4D8D` | Neon accent **on studio** |
| `--color-rose-glow` | `#FF3D7F` | Glow / shadow only — **never text, never a border alone** |
| `--color-bone` | `#F7ECE0` | Primary text on studio |
| `--color-bone-dim` | `#C4AE9C` | Secondary text on studio |

### Measured contrast (WCAG 2.1, computed — see `npm run audit:contrast`)

| Pair | Ratio | Verdict |
|---|---|---|
| ink `#191009` on cream `#FDF6EE` | **16.31:1** | AAA |
| ink on shell `#F6EADC` | **15.21:1** | AAA |
| ink-soft `#5A483A` on cream | **7.62:1** | AAA |
| ink-soft on shell | **7.11:1** | AAA |
| honey `#B8670F` on cream | **4.72:1** | AA (body ok, used ≥16px) |
| honey on shell | **4.40:1** | AA Large only — **never body text on shell** |
| rose `#C21E52` on cream | **6.31:1** | AAA |
| cream on rose `#C21E52` | **6.31:1** | AAA — CTA button |
| bone `#F7ECE0` on studio `#120C0D` | **16.62:1** | AAA |
| bone-dim `#C4AE9C` on studio | **9.51:1** | AAA |
| honey-lite `#E9A24A` on studio | **9.42:1** | AAA |
| rose-lite `#FF4D8D` on studio | **7.19:1** | AAA |
| studio on honey-lite (button) | **9.42:1** | AAA |

**The rule that came out of the audit:** `--color-honey` is AA-Large-only on `--color-shell` (4.40).
Honey is therefore forbidden as body text on shell surfaces — use `--color-ink-soft`, or move the
surface to cream. This is exactly the drift that broke the previous build; it is enforced by
`scripts/check-contrast.mjs`, which fails the build on any regression.

---

## 3. Type

- **Display — Fraunces** (variable, `opsz` + `SOFT` + `WONK` axes). Soft, slightly wonky old-style serif.
  It blooms. Used for h1/h2 and pull quotes only. `wght 600–900`, `SOFT 40`, `WONK 1`.
- **UI / body — Plus Jakarta Sans** (variable). Friendly geometric sans. Everything else.
- No third family. No mono.

| Token | Clamp | Use |
|---|---|---|
| `--text-display` | `clamp(3rem, 9vw, 8.5rem)` | Hero only |
| `--text-h1` | `clamp(2.5rem, 6vw, 5rem)` | Page titles |
| `--text-h2` | `clamp(2rem, 4.2vw, 3.5rem)` | Section titles |
| `--text-h3` | `clamp(1.35rem, 2.2vw, 1.85rem)` | Card titles |
| `--text-lead` | `clamp(1.075rem, 1.5vw, 1.3rem)` | Intro paragraphs |
| `--text-eyebrow` | `0.75rem` | Uppercase, `0.18em` tracking, honey |

Body copy is `1rem/1.7`. Measure caps at `68ch`. Display type sets tight: `-0.03em`, `line-height 0.95`.

---

## 4. Space, radius, elevation

Spacing is the Tailwind 4pt scale. Section rhythm is `--space-section: clamp(5rem, 10vw, 9rem)` top and
bottom, never anything else.

| Token | Value | Use |
|---|---|---|
| `--radius-pill` | `999px` | Buttons, chips, badges |
| `--radius-card` | `1.5rem` | Cards, panels, inputs |
| `--radius-media` | `1.75rem` | Images, video, map |
| `--radius-sheet` | `2.5rem` | Full-bleed rounded sections |

> **Tailwind v4 note (this cost the last build every button on the site):** v4 has no arbitrary-property
> shorthand for theme variables. `rounded-[--radius-pill]` silently does nothing. Because these are
> declared in `@theme`, the correct utilities are `rounded-pill`, `rounded-card`, `rounded-media`,
> `rounded-sheet`. Same for colours: `bg-rose`, not `bg-[--color-rose]`.

Elevation is warm, never grey: `--shadow-soft: 0 1px 2px rgb(65 43 26 / .06), 0 12px 32px -12px rgb(65 43 26 / .18)`.
On studio surfaces, elevation is a rose glow instead: `--shadow-glow: 0 0 0 1px rgb(255 61 127 / .22), 0 18px 60px -22px rgb(255 61 127 / .45)`.

---

## 5. Motion — the spine of this build

The client asked for scroll motion explicitly and it is not decoration here; it is how the loc journey is
told. **Lenis** drives smooth scroll, **GSAP ScrollTrigger** drives everything tied to scroll position.
One signature move per section, never two.

| Section | Move |
|---|---|
| Hero | Headline words rise and un-blur on load; portrait plate parallaxes at `y: -12%`; scroll cue fades out over the first 400px |
| Marquee | Continuous ticker whose direction and speed are driven by scroll velocity |
| Signature marks | Butterfly + bloom SVG line art **draws itself** (`stroke-dashoffset` scrubbed) as its section enters |
| Loc Journey | **Pinned** section; four stages scrub horizontally, progress rail fills |
| Services | Cards stagger up 24px with a 60ms offset as the grid crosses 85% viewport |
| Gallery | Horizontal scroll track driven by vertical scroll; each tile scales `0.94 → 1` at centre |
| Numbers | Counters count up once, on first entry only |
| Studio sections | Ground colour cross-fades cream → studio as the section pins to the top |
| Footer | Butterfly mark drifts on a slow `y` loop, independent of scroll |

**Rules.** Every ScrollTrigger is registered client-side and killed on unmount. Everything above is
wrapped in a single `prefers-reduced-motion` guard that swaps scrubbing for an instant final state —
reduced motion must show the *same content*, never less. No motion library beyond GSAP + Lenis;
framer-motion was removed from the previous build for buying ~38 KB to do one fade.

---

## 6. Component contracts

- **Button** — `primary` (rose fill, cream text), `honey` (honey fill, ink text), `ghost` (ink text,
  sand hairline), `studio` (honey-lite fill, studio text). Always `rounded-pill`, always `min-h-12`.
- **PhotoSlot** — renders a real image, or a branded `NEEDS REAL PHOTO` marker. A missing asset must be
  impossible to ship silently.
- **PriceTag** — renders the price plus a `priceStatus` badge. `verified` prices came from her live
  Acuity menu on 2026-08-30. Anything else renders "price to confirm" and links to consultation.
- **SectionHeading** — eyebrow + h2 + optional lead, one component, so rhythm cannot drift.

## 7. Standing constraints

1. Real facts only. NAP, hours, prices and service names come from `src/lib/business.ts`, which mirrors
   her Google profile and live Acuity menu. Nothing in this repo invents a fact about her.
2. **No licence or certification claim appears anywhere on this site** until she supplies documentation.
   See the credential note in `HANDOFF.md`.
3. Testimonials are real Google reviews, attributed, with the reviewer's name and a link to her profile.
   No invented reviews, ever.
4. Mobile-first. QA at 375 / 768 / 1024 / 1440 before any handoff.
5. Demo mode: every mutation runs through `src/lib/db.ts` in memory. No localStorage. No real payments.
   Every seam that will need a backend is marked `// TODO(backend):`.
