# Logo prompts — Bloom Kreations

For generating a real logo to replace the SVG marks I drew for the build
(`src/components/marks/Marks.tsx`). Those marks are good and working, but they are
placeholders in the sense that they were drawn to fit a website, not to be a brand.

---

## Read this before you generate

**A logo has to be vector.** Her salon signage, embroidery on a cape or a t-shirt, a
business card, a vinyl decal on a window and the 22px favicon are all the same file at
different sizes. A PNG cannot do that. Per the model-selection skill:

> **Logos, icons, true vector / SVG → `recraft_v4_1`, `model_type='vector'`, with a
> `colors` hex array — the only real vector output in the catalogue.**

So: **Recraft is the logo. Nano Banana Pro is the pitch.** Use Prompt A to make the
actual mark, Prompt B to show it to her on a board that looks like a real brand
presentation.

**Cost note.** `nano_banana_pro` and `gpt_image_2` are unlim-eligible — free on your
allowance. `recraft_v4_1` is **not**, so the vector runs cost credits. It is the one
asset worth spending on; everything else in this project was free.

**Do not ask any model to render the words "Bloom Kreations".** AI text is unreliable
and you do not need it — the site already self-hosts Fraunces, which is what the
wordmark is set in. Generate the **mark only**, and I will set the wordmark in the real
typeface and build the lockup properly.

---

## The concept

Do not ask for "a butterfly". Every salon in Chicago has a butterfly. The idea that is
actually hers is the one nobody else can use:

> **A butterfly whose wings are formed from locs.**

Her two Instagram accounts already carry the butterfly, the bloom and the crown. Her
entire review corpus is about locs, crisp parts and clean grids. Fusing those — wings
built from coiled loc strands, or from the parted grid of a freshly retwisted scalp —
gives a mark that is simultaneously a butterfly, a bloom opening, and her actual craft.
That is a real logo idea rather than clip art.

## Brand constants to keep in every prompt

| | |
|---|---|
| Rose (primary) | `#C21E52` |
| Cream (ground) | `#FDF6EE` |
| Honey (secondary) | `#9E5715` |
| Warm near-black | `#120C0D` |
| Must read at | 22px |
| Must work on | cream **and** near-black |
| Must survive | one colour, flat, no gradient |

---

## PROMPT A — the actual logo (Recraft V4.1, vector)

Model `recraft_v4_1` · `model_type: vector` · `colors: ["#C21E52", "#FDF6EE"]` ·
`background_color: "#FDF6EE"` · 2k

```
Minimal flat vector logo mark for a Black-owned loc studio. A single symmetrical
butterfly seen head-on, where the four wings are constructed entirely from coiled,
twisted loc strands — each wing built from three or four thick rope-like spiral coils
radiating outward from the centre, so the silhouette reads as a butterfly and the
texture reads as locs. Slim tapered body down the centre, two fine antennae with small
round tips. The negative space between the wings forms a subtle petal shape.

Absolutely flat. Solid single colour on solid background. Bold, thick, confident shapes
with generous spacing between every element. Geometric and balanced, not sketchy or
hand-drawn. Clean closed forms. Modern boutique salon branding, elegant and feminine
without being delicate.

No text. No letters. No words. No gradient. No shadow. No 3D. No outline stroke effects.
No photorealism. No background scenery. No circle badge or frame around it. No fine
hairline detail that would disappear when scaled down.
```

**Run it four times.** Vary one thing per run so you can compare:
1. as written
2. swap `three or four thick rope-like spiral coils` → `five slender loc coils`
3. add `the lower two wings are noticeably smaller than the upper two`
4. add `the coils spiral clockwise on the right wings and counter-clockwise on the left`

## PROMPT B — the presentation board (Nano Banana Pro, raster)

Model `nano_banana_pro` · 4:5 · 2k · unlim-eligible, so this one is free

```
A clean brand identity presentation board on a warm cream #FDF6EE background. Four
panels arranged in a 2x2 grid with generous white space between them.

Top left: a minimal flat deep-rose #C21E52 butterfly logo mark whose wings are made of
coiled loc strands, centred on cream, small, lots of breathing room.
Top right: the same mark reversed — cream on a warm near-black #120C0D square.
Bottom left: the same mark embroidered in rose thread on a folded cream cotton salon
cape, photographed from above in soft daylight, visible thread texture.
Bottom right: the same mark foil-stamped on a small matte cream business card resting on
a warm dark surface, soft shadow, shallow depth of field.

Editorial, premium, minimal. Warm natural lighting. Studio photography quality for the
two physical mockups, perfectly flat vector rendering for the two digital panels.

No text anywhere. No lettering. No words on the card or the cape. No people. No hands.
No clutter. No extra logos.
```

The mockups are what sell it to Latesha — she will understand it on a cape faster than
she will on a white square.

---

## Judging the output

Reject any candidate that fails these. This is the part people skip.

1. **Shrink it to 22px.** If it becomes a blob, it is not a logo. This killed my first
   butterfly draft during the build.
2. **Fill it solid black on white.** If the silhouette stops reading as a butterfly, the
   shape is doing no work and only the detail was carrying it.
3. **Does the loc texture actually read**, or is it just a butterfly with lines on it?
   If it is the latter it is generic and any salon could use it.
4. **Count the pieces.** More than about seven distinct shapes will not embroider.
5. **Check the gaps.** Anything thinner than roughly 1/40th of the width closes up in
   thread and disappears in a favicon.

## What to do with the winner

Send me the SVG. I will:

- clean the path data, balance the symmetry and set it on the exact palette;
- build the lockup with the real Fraunces wordmark the site already self-hosts;
- replace `Butterfly` in `src/components/marks/Marks.tsx` so it flows to the nav, the
  footer, the loading marks and the draw-on-scroll animation automatically;
- regenerate the favicon, the 180px Apple touch icon, the 192/512 PWA icons and the
  Open Graph card from it;
- and export a one-colour version plus a reversed version for signage and merch.

Everything downstream is wired to that one component, so swapping the mark updates the
whole site in one move.
