# Start here

The site is built, verified and committed. Three things are left, and they all
need your own terminal rather than the sandbox.

---

## 1. Push to GitHub

The repo is complete with three commits and `origin` already pointed at
`https://github.com/Azaiah00/Bloom-Kreations-Salon-Website.git`. The build sandbox
has no GitHub credentials, so this last step is yours. From PowerShell:

```powershell
cd "$env:USERPROFILE\OneDrive\Bloom-Kreations-WEBSITE"
git push -u origin main
```

If `main` already has commits on GitHub and it refuses, either `git pull --rebase`
first, or force it with `git push -u --force-with-lease origin main` — this build is
the whole site, so overwriting an empty or scaffold repo is fine.

## 2. Run it

**Work from a local copy, not from here.** OneDrive syncing a `node_modules` folder
is how npm hangs and git ends up with locks it cannot unlink — that already happened
once during this build and had to be cleared by hand.

```powershell
cd $env:USERPROFILE
git clone https://github.com/Azaiah00/Bloom-Kreations-Salon-Website.git bloom-kreations
cd bloom-kreations
npm install
npm run dev      # http://localhost:3000
```

`npm run verify` runs typecheck, lint, the contrast audit and a production build.
`npm run audit:a11y`, `npm run audit:flow` and `npm run frames` need the built site
running on port 3100 — see `README.md`.

## 3. Deploy to Netlify

`netlify.toml` is committed and complete: Node 20 pinned, `@netlify/plugin-nextjs`
declared, caching and security headers set, and the publish directory deliberately
left to the plugin — hardcoding it breaks App Router routes.

1. Netlify → **Add new site** → **Import from Git** → pick the repo.
2. Accept the detected settings. Everything comes from `netlify.toml`.
3. Once the domain resolves, change `SITE` in `src/lib/schema.ts` and `metadataBase`
   in `src/app/layout.tsx` from `https://bloomkreations.com` to the real domain.
   Those two values drive every canonical URL, the sitemap and all the JSON-LD.
4. Submit `sitemap.xml` in Google Search Console.
5. **Add the website URL to Latesha's Google Business Profile.** That single link is
   what connects her 60 reviews and her map ranking to the site, and it is the
   highest-leverage thing on this list.

---

## Before it goes public

Read **§1 and §2 of `HANDOFF.md`**. Two items there are not optional:

- **The credential question.** A one-star review alleges she has no cosmetology
  licence; her reply says she is certified in natural hair. This site therefore makes
  **no licence or certification claim anywhere**, deliberately. She needs to decide
  what she wants stated, and supply documentation before anything is added.
- **Eight studio policies she has never published** — deposit, cancellation window,
  lateness, no-shows, guests, hair prep, travel terms, redo policy. They are listed on
  `/policies` as open items rather than invented, because a made-up cancellation
  window becomes a rule she has to enforce with a real client.

There are also three ambiguities on her own Acuity menu flagged in `HANDOFF.md` and
surfaced in the owner portal for her to confirm — including "Wic Touch Up", which is
almost certainly meant to be *Wick*.

## What is where

| | |
|---|---|
| `HANDOFF.md` | The credential caution, what she still owes, the positioning strategy, deploy notes, audit results |
| `DESIGN.md` | Tokens, the measured contrast table, type scale, motion spec |
| `CLAUDE.md` | Standing rules for the next person or agent on this |
| `README.md` | Quick start and the audit commands |
| `src/lib/business.ts` | Every fact about her — NAP, hours, all 33 services, real reviews. The JSON-LD reads from this same file |
| `_raw-assets/` | The 40 original Instagram files the site imagery came from |
