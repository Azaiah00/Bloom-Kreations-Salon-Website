"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The motion vocabulary from DESIGN.md, section 5. One signature move per
 * section, never two.
 *
 * Every hook here:
 *   - registers ScrollTrigger client-side,
 *   - runs inside a gsap.context so cleanup is total on unmount,
 *   - and no-ops under prefers-reduced-motion, leaving the element in its
 *     finished state so the content is identical either way.
 */

/**
 * Viewport conditions under which a section may pin. Both are exported so the
 * markup can gate its `h-screen` on exactly the same query the motion uses — if
 * those two ever disagree, the section clips.
 */
export const PIN_QUERY = "(min-width: 1024px) and (min-height: 820px)";
export const RAIL_QUERY = "(min-width: 768px) and (min-height: 700px)";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Shared guard: sets up GSAP, or resolves reveals instantly and bails. */
function guard(scope: HTMLElement | null): boolean {
  if (!scope) return false;
  if (prefersReduced()) {
    scope.querySelectorAll(".reveal").forEach((el) => el.classList.add("reveal-in"));
    return false;
  }
  gsap.registerPlugin(ScrollTrigger);
  return true;
}

/* -------------------------------------------------------------------------- */
/* Reveal — every `.reveal` inside the scope rises and fades in, staggered.    */
/* -------------------------------------------------------------------------- */

export function useReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { stagger = 0.06, start = "top 85%" } = {}
) {
  useEffect(() => {
    const scope = ref.current;
    if (!guard(scope)) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(".reveal", scope!);
      if (!targets.length) return;

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: scope!, start },
      });
    }, scope!);

    return () => ctx.revert();
  }, [ref, stagger, start]);
}

/* -------------------------------------------------------------------------- */
/* Hero — words rise and un-blur, plate parallaxes, cue fades out.            */
/* -------------------------------------------------------------------------- */

export function useHero<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const scope = ref.current;
    if (!guard(scope)) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]", scope!);

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(words, {
          yPercent: 118,
          filter: "blur(14px)",
          opacity: 0,
          duration: 1.15,
          stagger: 0.075,
        })
        .from(
          "[data-hero-meta]",
          { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 },
          "-=0.7"
        )
        .from("[data-hero-plate]", { scale: 1.08, opacity: 0, duration: 1.3 }, 0.15);

      // Portrait plate drifts up as you scroll past the fold.
      gsap.to("[data-hero-plate-inner]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: scope!, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to("[data-hero-cue]", {
        opacity: 0,
        y: 16,
        ease: "none",
        scrollTrigger: { trigger: scope!, start: "top top", end: "+=400", scrub: true },
      });
    }, scope!);

    return () => ctx.revert();
  }, [ref]);
}

/* -------------------------------------------------------------------------- */
/* Draw-on-scroll — brand line art draws itself as its section enters.        */
/* -------------------------------------------------------------------------- */

export function useDrawOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { start = "top 80%", end = "bottom 55%" } = {}
) {
  useEffect(() => {
    const scope = ref.current;
    if (!guard(scope)) return;

    const ctx = gsap.context(() => {
      // Marks inside a `hidden lg:block` wrapper are display:none at small
      // breakpoints, and getTotalLength() throws on a non-rendered element.
      // Filter to geometry the browser has actually laid out.
      const paths = gsap.utils
        .toArray<SVGGeometryElement>(".draw-path", scope!)
        .filter((p) => p.getClientRects().length > 0);
      if (!paths.length) return;

      // Measure each path so the dash array matches its true length; a guessed
      // length leaves a visible gap or a premature finish.
      for (const p of paths) {
        let len = 0;
        try {
          len = p.getTotalLength();
        } catch {
          continue;
        }
        if (!len) continue;
        p.style.setProperty("--draw-length", String(Math.ceil(len)));
        p.style.setProperty("--draw", "1");
      }

      gsap.to(paths, {
        "--draw": 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: scope!, start, end, scrub: 0.8 },
      });
    }, scope!);

    return () => ctx.revert();
  }, [ref, start, end]);
}

/* -------------------------------------------------------------------------- */
/* Pinned horizontal scrub — the loc journey.                                 */
/* -------------------------------------------------------------------------- */

export function usePinnedTrack<T extends HTMLElement>(
  sectionRef: RefObject<T | null>,
  trackRef: RefObject<HTMLElement | null>,
  onProgress?: (p: number) => void
) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!guard(section) || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      // Pinning needs both width and height: a 1024x768 viewport cannot hold a
      // stage card, so short screens get the vertical stack instead. Below `lg`
      // it is a normal stack anyway — pinning a full-height horizontal scroller
      // on a phone is a trap, not a feature.
      const mm = gsap.matchMedia();

      mm.add(PIN_QUERY, () => {
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section!,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.6}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => onProgress?.(self.progress),
          },
        });
        return () => tween.scrollTrigger?.kill();
      });

      mm.add(`not all and ${PIN_QUERY}`, () => {
        gsap.set(track, { x: 0 });
        const st = ScrollTrigger.create({
          trigger: section!,
          start: "top 70%",
          end: "bottom 40%",
          onUpdate: (self) => onProgress?.(self.progress),
        });
        return () => st.kill();
      });

      return () => mm.revert();
    }, section!);

    return () => ctx.revert();
  }, [sectionRef, trackRef, onProgress]);
}

/* -------------------------------------------------------------------------- */
/* Horizontal gallery — vertical scroll drives a sideways track.              */
/* -------------------------------------------------------------------------- */

export function useHorizontalGallery<T extends HTMLElement>(
  sectionRef: RefObject<T | null>,
  trackRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!guard(section) || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(RAIL_QUERY, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section!,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Each tile swells slightly as it crosses the middle of the viewport.
        const tiles = gsap.utils.toArray<HTMLElement>("[data-gallery-tile]", track);
        const scalers = tiles.map((tile) =>
          gsap.fromTo(
            tile,
            { scale: 0.94 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: tile,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
                // 0 → 1 → 0 across the pass, so centre is the peak.
                onUpdate: (self) => {
                  const p = 1 - Math.abs(self.progress - 0.5) * 2;
                  gsap.set(tile, { scale: 0.94 + p * 0.06 });
                },
              },
            }
          )
        );

        return () => {
          tween.scrollTrigger?.kill();
          scalers.forEach((s) => s.scrollTrigger?.kill());
        };
      });

      return () => mm.revert();
    }, section!);

    return () => ctx.revert();
  }, [sectionRef, trackRef]);
}

/* -------------------------------------------------------------------------- */
/* Counters — count up once, on first entry.                                  */
/* -------------------------------------------------------------------------- */

export function useCountUp<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    const nodes = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-count-to]")
    );

    if (prefersReduced()) {
      nodes.forEach((n) => {
        n.textContent = formatCount(n);
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const to = Number(node.dataset.countTo ?? 0);
        const decimals = Number(node.dataset.countDecimals ?? 0);
        const prefix = node.dataset.countPrefix ?? "";
        const suffix = node.dataset.countSuffix ?? "";
        const obj = { v: 0 };

        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
          onUpdate: () => {
            node.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`;
          },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [ref]);
}

function formatCount(node: HTMLElement) {
  const to = Number(node.dataset.countTo ?? 0);
  const decimals = Number(node.dataset.countDecimals ?? 0);
  return `${node.dataset.countPrefix ?? ""}${to.toFixed(decimals)}${node.dataset.countSuffix ?? ""}`;
}

/* -------------------------------------------------------------------------- */
/* Marquee — scroll velocity drives speed and direction.                      */
/* -------------------------------------------------------------------------- */

export function useVelocityMarquee<T extends HTMLElement>(
  ref: RefObject<T | null>,
  baseSeconds = 44
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        // Faster scroll tightens the loop; scrolling up flips it.
        const speedUp = gsap.utils.clamp(0.25, 1, 1 - Math.abs(v) / 6000);
        el.style.setProperty("--marquee-duration", `${baseSeconds * speedUp}s`);
        if (Math.abs(v) > 40) {
          el.style.setProperty("--marquee-direction", v < 0 ? "reverse" : "normal");
        }
      },
    });

    return () => st.kill();
  }, [ref, baseSeconds]);
}

/* -------------------------------------------------------------------------- */
/* Studio cross-fade — page ground shifts cream → studio behind a section.    */
/* -------------------------------------------------------------------------- */

export function useGroundShift<T extends HTMLElement>(
  ref: RefObject<T | null>,
  color = "#120c0d"
) {
  useEffect(() => {
    const scope = ref.current;
    if (!guard(scope)) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: scope!,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => gsap.to(document.body, { backgroundColor: color, duration: 0.6 }),
        onEnterBack: () => gsap.to(document.body, { backgroundColor: color, duration: 0.6 }),
        onLeave: () => gsap.to(document.body, { backgroundColor: "#fdf6ee", duration: 0.6 }),
        onLeaveBack: () => gsap.to(document.body, { backgroundColor: "#fdf6ee", duration: 0.6 }),
      });
      return () => st.kill();
    }, scope!);

    return () => {
      ctx.revert();
      gsap.set(document.body, { backgroundColor: "#fdf6ee" });
    };
  }, [ref, color]);
}

/* -------------------------------------------------------------------------- */
/* Small helper for components that just need a scoped ref.                    */
/* -------------------------------------------------------------------------- */

export function useSectionRef<T extends HTMLElement>() {
  return useRef<T>(null);
}
