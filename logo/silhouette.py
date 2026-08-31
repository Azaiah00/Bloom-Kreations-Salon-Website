"""
Derives a FILLED silhouette from the traced mark.

Why: the Bloom Kreations butterfly is a continuous-line mark — the wings are
open rope loops. Below ~24px the counters inside those loops close up and the
whole thing turns into a smudge. The silhouette is the same geometry with each
loop filled, so a 16px favicon reads as a butterfly instead of a blob. It is
derived from the real trace, not redrawn, so it cannot drift from the logo.
"""

import json
import re
import subprocess
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import binary_fill_holes, binary_closing
import potrace

import os
SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = SITE + "/src/components/marks/butterfly-paths.ts"

src = open(SRC).read()
m = re.search(r"BUTTERFLY_VIEWBOX\s*=\s*\{\s*w:\s*([\d.]+),\s*h:\s*([\d.]+)", src)
VW, VH = float(m.group(1)), float(m.group(2))
SOLID = re.search(r'SOLID_PATH\s*=\s*\n?\s*"((?:[^"\\]|\\.)*)"', src).group(1)

S = 8  # supersample
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VW} {VH}" '
    f'width="{int(VW*S)}" height="{int(VH*S)}">'
    f'<rect width="100%" height="100%" fill="#fff"/>'
    f'<path fill="#000" d="{SOLID}"/></svg>'
)
open("/tmp/solid.svg", "w").write(svg)
subprocess.run(
    ["node", "-e",
     "const s=require('sharp');s('/tmp/solid.svg').png().toFile('/tmp/solid.png').then(()=>0)"],
    cwd=SITE, check=True,
)

base = np.array(Image.open("/tmp/solid.png").convert("L")) < 128


def build(seal, smooth):
    """seal — px of closing, just enough to bridge antialias gaps in a loop.
    smooth — gaussian radius used to round the trace's lumpy edges."""
    a = binary_closing(base, structure=np.ones((seal, seal))) if seal else base
    a = binary_fill_holes(a)
    if smooth:
        im = Image.fromarray(np.where(a, 255, 0).astype(np.uint8))
        im = im.filter(ImageFilter.GaussianBlur(smooth))
        a = np.array(im) > 128
    return a


def trace(mask):
    # NOTE: pypotrace only reports inner contours when handed a bool array;
    # cast to uint32 and it returns the canvas contour alone.
    bmp = potrace.Bitmap(np.ascontiguousarray(mask, dtype=bool))
    path = bmp.trace(turdsize=int((S * 1.5) ** 2), alphamax=1.0,
                     opticurve=True, opttolerance=0.2)

    def f(v):
        return f"{v:.2f}".rstrip("0").rstrip(".")

    subs = []
    for curve in path:
        st = curve.start_point
        xs = [st.x]
        ys = [st.y]
        d = [f"M{f(st.x/S)} {f(st.y/S)}"]
        nseg = 0
        for seg in curve:
            nseg += 1
            if seg.is_corner:
                d.append(f"L{f(seg.c.x/S)} {f(seg.c.y/S)}")
                d.append(f"L{f(seg.end_point.x/S)} {f(seg.end_point.y/S)}")
            else:
                d.append(
                    f"C{f(seg.c1.x/S)} {f(seg.c1.y/S)} "
                    f"{f(seg.c2.x/S)} {f(seg.c2.y/S)} "
                    f"{f(seg.end_point.x/S)} {f(seg.end_point.y/S)}"
                )
            xs.append(seg.end_point.x)
            ys.append(seg.end_point.y)
        d.append("Z")
        # potrace emits a plain rectangle around the whole canvas; drop only
        # that — the silhouette itself legitimately spans the full viewBox.
        spans_all = (max(xs) - min(xs)) > VW * S * 0.995 and (max(ys) - min(ys)) > VH * S * 0.995
        if spans_all and nseg <= 6:
            continue
        subs.append("".join(d))
    return subs


variants = {}
for name, seal, smooth in [
    ("a-tight", 3, 0),
    ("b-tight-smooth", 3, S * 0.9),
    ("c-mid", int(S * 0.8), S * 1.1),
    ("d-loose", int(S * 1.4), S * 1.4),
]:
    mask = build(seal, smooth)
    subs = trace(mask)
    variants[name] = subs
    Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).save(f"/tmp/sil-{name}.png")
    print(f"{name:16} ink {mask.sum():>8}  subpaths {len(subs):>2}  chars {sum(map(len, subs)):>6}")

json.dump(variants, open(os.path.join(SITE, "logo", "silhouette.json"), "w"), indent=1)
