# Mark pipeline

`src/components/marks/butterfly-paths.ts` is **generated from the logo artwork**, not
hand-drawn. Nothing in that file should ever be edited by hand.

## Where the paths come from

1. **`SOLID_PATH` / `WINGS` / `BODY` / `ANTENNAE`** — potrace of the supplied logo PNG at
   `lum < 135`, normalised to a `0 0 128 99.97` viewBox. The 51 detail subpaths were then
   classified into four wing groups, the body and the antennae, and the rope segments
   inside each wing sorted by radial distance from the body centre. That ordering is the
   only reason a flat GSAP stagger reads as a coil twisting outward — keep it.
2. **`SILHOUETTE_PATH`** — `silhouette.py`. Rasterises `SOLID_PATH`, seals the antialias
   gaps in the rope loops with a 3px closing, fills every enclosed region, and re-traces.
   This is what the favicon and the marquee separators use, because a continuous-line
   butterfly turns to smudge below about 22px.

`silhouette.py` writes `silhouette.json` (four candidate parameterisations, so the choice
can be re-reviewed rather than re-guessed). `a-tight` is the one that shipped.

## Regenerating

```bash
python3 logo/silhouette.py     # SILHOUETTE_PATH candidates
npm run icons                  # every favicon / app icon, from the paths above
npm run audit:icons            # fails if any icon is stale
```

`potrace` (pypotrace), `numpy`, `scipy` and `Pillow` are needed for the trace; only Node
and `sharp` for the icons.

**Gotcha:** pypotrace only reports inner contours when handed a `bool` array. Cast the
mask to `uint32` and it silently returns the canvas outline alone — one 4-segment
rectangle, no error.

## Keep the originals

The raster logo files the trace came from are the master. The SVG paths can always be
rebuilt from them; they cannot be rebuilt from the SVG.
