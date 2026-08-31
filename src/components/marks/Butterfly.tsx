"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BUTTERFLY_VIEWBOX as VB,
  WINGS,
  BODY,
  ANTENNAE,
  SOLID_PATH,
  SILHOUETTE_PATH,
} from "./butterfly-paths";

/**
 * The Bloom Kreations mark: a butterfly whose wings are twisted loc coils.
 *
 * Three variants, one viewBox, all traced from the same artwork:
 *   detail     — 51 rope subpaths. Beautiful, and legible down to about 40px.
 *   solid      — the outline re-traced as one path. Holds to about 22px.
 *   silhouette — every loop filled in. The only thing that reads below that.
 *
 * `variant="auto"` picks by the `px` you declare, so nobody has to remember the
 * thresholds. The rope texture turning to mush at nav size is exactly the bug
 * that killed the first hand-drawn mark, so the component decides, not the
 * call site.
 *
 * Animations are opt-in and all of them respect prefers-reduced-motion by
 * rendering the finished state.
 *
 *   weave  — rope segments grow from the body outward, staggered. The signature
 *            move: it reads as a loc being twisted into existence.
 *   unfurl — the four wings open out from the body. Cheaper, for ornaments.
 *   flap   — a slow continuous wingbeat, independent of scroll.
 */

export type ButterflyAnimation = "weave" | "unfurl" | "flap" | false;

interface Props {
  className?: string;
  /** Rendered size in px. Drives the auto variant choice. */
  px?: number;
  variant?: "auto" | "detail" | "solid" | "silhouette";
  /** Neon treatment for studio (near-black) sections. Scales with `px`. */
  neon?: boolean;
  animate?: ButterflyAnimation;
  /** Accessible name. Omit for decorative use. */
  title?: string;
}

const DETAIL_MIN_PX = 40;
const SOLID_MIN_PX = 22;

export default function Butterfly({
  className,
  px = 64,
  variant = "auto",
  neon = false,
  animate = false,
  title,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[:]/g, "");
  const resolved =
    variant !== "auto"
      ? variant
      : px >= DETAIL_MIN_PX
        ? "detail"
        : px >= SOLID_MIN_PX
          ? "solid"
          : "silhouette";

  useButterflyMotion(ref, animate, resolved);

  const a11y = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className={className}
      style={neon ? { filter: neonGlow(px) } : undefined}
      fill="currentColor"
      fillRule="evenodd"
      {...a11y}
    >
      {resolved !== "detail" ? (
        <path d={resolved === "solid" ? SOLID_PATH : SILHOUETTE_PATH} />
      ) : (
        <>
          {/* Wings first so the body sits over the joins. */}
          {(Object.keys(WINGS) as (keyof typeof WINGS)[]).map((g) => (
            <g key={g} data-wing={g} style={{ transformOrigin: `${VB.w / 2}px ${VB.h * 0.52}px` }}>
              {WINGS[g].map((d, i) => (
                <path key={`${uid}-${g}-${i}`} d={d} data-rope />
              ))}
            </g>
          ))}
          <g data-body>
            {BODY.map((d, i) => (
              <path key={`${uid}-b-${i}`} d={d} />
            ))}
          </g>
          <g data-antenna>
            {ANTENNAE.map((d, i) => (
              <path key={`${uid}-a-${i}`} d={d} />
            ))}
          </g>
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * A fixed glow radius is wrong at both ends — invisible behind a 416px mark,
 * a pink smear behind a 24px one. Two shadows: a tight one that reads as the
 * tube itself, a wide soft one that reads as the light it throws.
 */
function neonGlow(px: number) {
  const tight = Math.max(2, Math.round(px * 0.045));
  const wide = Math.max(6, Math.round(px * 0.14));
  return (
    `drop-shadow(0 0 ${tight}px rgb(255 77 141 / 0.9)) ` +
    `drop-shadow(0 0 ${wide}px rgb(255 77 141 / 0.45))`
  );
}

function useButterflyMotion(
  ref: React.RefObject<SVGSVGElement | null>,
  animate: ButterflyAnimation,
  resolved: "detail" | "solid" | "silhouette"
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion gets the finished mark, never a missing one. The one-path
    // variants have no groups to animate, so they are always already finished.
    if (reduced || resolved !== "detail") {
      gsap.set(el.querySelectorAll("[data-rope],[data-wing],[data-body],[data-antenna]"), {
        clearProps: "all",
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const wings = gsap.utils.toArray<SVGGElement>("[data-wing]", el);
      const ropes = gsap.utils.toArray<SVGPathElement>("[data-rope]", el);
      const body = el.querySelector("[data-body]");
      const antenna = el.querySelector("[data-antenna]");

      if (animate === "flap") {
        // Independent of scroll. Wings beat around the body's centreline, which
        // is why transform-origin is set on the group rather than the svg.
        wings.forEach((w, i) => {
          const lower = i > 1;
          gsap.to(w, {
            scaleX: 0.9,
            scaleY: lower ? 0.97 : 0.95,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: lower ? 0.12 : 0,
          });
        });
        return;
      }

      if (animate === "unfurl") {
        gsap.from(wings, {
          scale: 0.55,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        gsap.from([body, antenna], {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        return;
      }

      // weave — the signature. Rope segments are already ordered body-outward
      // in butterfly-paths.ts, so a plain stagger reads as the coil twisting
      // its way out along the wing.
      gsap.set(ropes, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set([body, antenna], { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      tl.to(body, { opacity: 1, duration: 0.45, ease: "power2.out" })
        .to(
          ropes,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: { each: 0.025, from: "start" },
          },
          "-=0.2"
        )
        .to(antenna, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.35");
    }, el);

    return () => ctx.revert();
  }, [ref, animate, resolved]);
}
