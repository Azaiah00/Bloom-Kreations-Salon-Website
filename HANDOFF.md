# Bloom Kreations — handoff

Built for **Latesha Reed** ("Pookie"), owner and loctician at Bloom Kreations LLC,
928 W 38th Pl, Chicago IL 60609. Built 30 August 2026.

---

## 1. Read this first — the credential question

A one-star Google review from a former client alleges that Latesha does not hold an
IDFPR cosmetology licence. Her public reply says she is *"certified in natural hair
including loc and protective styling services."*

**This site therefore makes no licence or certification claim anywhere** — not in the
copy, not in the About page, and deliberately not in the `hasCredential` field of the
`HairSalon` schema. The site sells her craft, her sixty reviews and her published
prices instead, which is a stronger argument anyway.

**Before launch, Latesha needs to decide** what she wants stated. Illinois regulates
hair braiding and natural hair care separately from cosmetology, so there may well be
a correct and provable claim to make. If she supplies documentation, add it to the
About page and to `hasCredential` in `src/lib/schema.ts`. **Do not add anything on the
strength of a conversation.** A credential claim on a public website is the kind of
thing a competitor screenshots.

---

## 2. What she still owes before launch

### Decisions with money attached — none of these are published anywhere today

Every one of these is rendered on `/policies` as an open item rather than invented,
because a cancellation window made up on a website becomes a rule she has to enforce
with a real client.

| # | Needs | Why it matters |
|---|---|---|
| 1 | Deposit — required? how much? does it come off the total? | Full-day installs are $500–$850 of chair time |
| 2 | Cancellation window (24h / 48h?) | Currently unstated, so unenforceable |
| 3 | Lateness — how late is too late | A 8 hr install cannot absorb a 40 min late arrival |
| 4 | No-show policy | Whether future bookings need a deposit |
| 5 | Guests and children in the studio | |
| 6 | Hair prep before arrival — washed? taken down? charged separately? | Take-down is a $100 service |
| 7 | Travel bookings — radius, minimum, fee, notice | The site sells travel; the terms are blank |
| 8 | Redo policy — window and terms | |

### Menu ambiguities found on her live Acuity page

These are flagged on the site itself (a "needs confirming" note on the service card)
**and** are the two items surfaced in the owner portal for her to confirm herself:

- **"Wic Touch Up" — $150 / 2 hr 10 min.** Almost certainly meant to be *Wick* Touch
  Up. Confirm the spelling before it goes live; the current spelling will not match
  what anyone searches for.
- **"Senior Service ( Age 50+) Retwist & Style Kids under 10)"** — $120 / 2 hr. One
  appointment type, one price, covering both seniors 50+ and children under 10, with
  an unbalanced bracket. These are two different services with two different
  durations. Worth splitting.
- **Butterfly Locs bob is priced identically to full-length** ($225 / 3 hr for both).
  If the bob really is less work, it should be cheaper; if not, the two entries could
  be merged.

### Assets

- **Photography.** All 23 images on the site are her own work, pulled from
  `@bloomkreations_` on 30 August 2026 and resized to 1400px WebP. They are phone
  photographs in a dark salon and they hold up — but a half-day shoot of the studio
  interior, her at work, and three or four hero-quality finished sets would lift the
  whole site.
- **Owner portrait.** Currently her Instagram profile photo, upscaled from 747px. It
  is a real studio portrait and it works at the sizes used, but a native
  high-resolution file would be better. *Note:* the best studio image on her personal
  account (red dress, roses) was deliberately not used — it is a fashion image and
  would undercut the professional positioning.
- **Logo.** The butterfly is traced from the generated logo artwork she supplied, at
  `src/components/marks/butterfly-paths.ts` — vector, so it scales to signage, embroidery
  or a vinyl decal without redrawing. Three variants (full rope detail, outline, filled
  silhouette) are picked automatically by rendered size. The favicon, tab icon, Apple
  touch icon and both manifest icons are **generated from those same paths** by
  `npm run icons`; `npm run audit:icons` fails the build if any is stale. Change the
  artwork and every icon follows. The bloom, crown, loc-coil and wordmark are still
  drawn line art from her Instagram vocabulary.
- **Source artwork.** Keep the original logo PNGs. The trace can be regenerated
  (`logo/silhouette.py` and the tracing notes in `logo/`), but only from the raster
  originals — they are the master, not the SVG.
- **Portal accounts.** There are none, and nothing on the site pretends otherwise. The
  bottom-left **Demo** button opens every portal screen directly — the owner dashboard
  and four demo clients, one per loc stage, so the difference between a one-month client
  and a three-year client is visible rather than described. Demo clients all carry the
  surname "Sample" and every portal screen is banded "Demo". If real accounts are agreed,
  the switcher is deleted, not adapted.
- **Domain.** The build assumes `bloomkreations.com`. Change `SITE` in
  `src/lib/schema.ts` and `metadataBase` in `src/app/layout.tsx` if it differs.

---

## 3. The strategy, in one page

**The problem.** She has no website. Google files her as a generic "Hairdresser". Her
only web presence is an Acuity booking page with zero indexable content, so she is
invisible for every term that should be hers.

**What the evidence says.** Google's own extracted review topics: *locs* 18,
*neatness* 10, *loctician* 4, *retwist* 4, *loc maintenance* 3. Her clients do not
describe a salon. They describe a loctician.

**The positioning.** Everything on this site treats her as a **Chicago loctician**,
not a hair salon. Three wedges nobody local is holding:

1. **"Traveling loctician Chicago."** It is in her own Instagram bio and search
   returns essentially no local competitor for it. It has its own section on the
   homepage and its own answers in the FAQ.
2. **Published prices.** All 33 services with real prices and real durations, on an
   indexable page, in a table, in `Offer` schema, and repeated as concrete numbers in
   FAQ answers. Almost every competitor hides pricing behind a booking widget. This
   is the single biggest AEO and GEO lever available to her — an answer engine asked
   "how much is a retwist in Chicago" now has a number and a name to give.
3. **She teaches.** The $650 Loc Class and the loc-journey education hub are E-E-A-T
   no competitor page has.

**The content asset.** `/loc-journey` explains the four stages of locking — including
the budding stage, which is where clients quit and go elsewhere. It is published as
`HowTo` schema with a `FAQPage` block underneath, it is the argument for staying with
one loctician, and it is the biggest motion moment on the site.

---

## 4. What was built

**Marketing site** — home, services, gallery, loc journey, about, visit, questions,
policies. **Booking** — a five-step booker with a running price and duration total
visible from the first tap, that shows you the finish time before you confirm.
**Portal** — a client side (next appointment, history, photo loc-journey timeline,
loyalty) and an owner side (schedule, revenue, service mix, client notes, and price
confirmation), role-separated by route.

**Everything except the marketing site runs in demo mode** on typed mock data in
`src/lib/db.ts`. No payments, no card, no localStorage, no accounts. Every seam that
needs a backend is marked `// TODO(backend):`. Going live is a change behind that
module, not to the UI.

**Her real Acuity link is on every booking surface** — the header, the footer, the
book page, every step of the booker and the confirmation screen. The site converts
today, whatever happens to the portal.

---

## 5. Running it

```bash
npm install
npm run dev            # http://localhost:3000
npm run verify         # typecheck + lint + contrast + build — run before any handoff
```

Audits (need the site running on :3100 — `npm run build && npx next start -p 3100`):

```bash
npm run audit:contrast # measured WCAG ratios against the tokens in globals.css
npm run audit:a11y     # contrast, alt text, heading order, tap targets, overflow,
                       # landmarks, shipped placeholders and emoji — on the real DOM
npm run audit:flow     # 13 end-to-end tests: booking, gallery, portal, nav,
                       # JSON-LD, reduced motion, and no-JS
npm run frames         # ROUTE=/ SIZE=desktop STEPS=14 — viewport frames at scroll
                       # depths, the only honest way to audit a pinned section
```

**Do not run `npm install` inside the OneDrive folder.** npm hangs and git cannot
unlink its lock files. Clone the repo somewhere local to work on it.

---

## 6. Deploying

Netlify, with `netlify.toml` already in the repo. Node 20 pinned, the Next plugin
declared, and the publish directory deliberately **not** set — the plugin decides it,
and hardcoding it breaks App Router routes.

1. Connect the GitHub repo in Netlify. Build command and plugin are read from
   `netlify.toml`; nothing to configure by hand.
2. Point the domain, then update `SITE` in `src/lib/schema.ts` and `metadataBase` in
   `src/app/layout.tsx` to match.
3. After the domain resolves, submit `sitemap.xml` in Google Search Console and add
   the website URL to her Google Business Profile — that link is what connects the
   sixty reviews to the site.

---

## 7. Standing rules for whoever works on this next

1. **`src/lib/business.ts` is the only place a fact about her lives.** NAP, hours,
   prices, service names, reviews. The JSON-LD reads from the same file, so the
   structured data and the visible page cannot disagree.
2. **No invented facts, ever.** No made-up reviews, no placeholder testimonials, no
   guessed policies, no credential claims.
3. **No emoji anywhere in the site.** Her Instagram voice is emoji-rich; the site
   keeps her phrasing and drops the emoji, using Lucide icons and the brand marks
   instead. `npm run audit:a11y` fails the build if one appears.
4. **`DESIGN.md` is binding.** No colour, radius or type size outside its tokens.
   Tailwind v4 has no arbitrary-property shorthand for theme variables —
   `rounded-[--radius-pill]` silently does nothing; the utility is `rounded-pill`.
5. **Contrast is measured, not eyeballed.** `npm run audit:contrast` fails on any
   regression against the ratios `DESIGN.md` promises.
6. **A pinned section is gated on viewport height as well as width.** `PIN_QUERY` and
   `RAIL_QUERY` in `src/components/motion/hooks.ts` are exported precisely so the
   markup can gate its `h-screen` on the same query the motion uses. If those ever
   disagree, the section clips.
7. **Screenshot before believing anything is done.** Every issue that mattered in
   this build was found by looking at a rendered page, not by reading the code.

---

## 8. Audit results at handoff

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `eslint` (flat config, ESLint 9) | clean — 0 errors, 0 warnings |
| Production build | clean, all 18 routes prerendered static |
| Contrast — 15 documented token pairs | all pass, AA or better |
| Rendered-DOM audit — 12 routes × 375px and 1440px | clean: no contrast failures, no missing alt, no heading-order breaks, no sub-24px targets, no unlabelled controls, no horizontal overflow, no shipped placeholders, no emoji |
| End-to-end flow tests | 13 / 13 pass |
| Reduced motion | every section present, nothing hidden |
| JavaScript disabled | full menu, prices and NAP still render |
| Responsive QA | 375 / 768 / 1024 / 1440, plus scroll-depth frames for the pinned sections |

Three real bugs were found and fixed by these audits and are worth knowing about:
the draw-on-scroll hook threw on marks hidden at mobile breakpoints; the hero
headline had no space between its animated words, so the DOM text read
"Healthylocs." to crawlers and screen readers; and both pinned sections clipped
their content on viewports under 820px tall.
