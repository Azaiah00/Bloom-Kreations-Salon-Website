"use client";

import { useRef } from "react";
import { useVelocityMarquee } from "@/components/motion/hooks";
import { Butterfly } from "@/components/marks/Marks";

/**
 * Scroll-velocity ticker. Speeds up as you scroll and reverses when you scroll
 * back up, so the band reacts to the reader rather than looping obliviously.
 *
 * The list is duplicated once and the track translates -50%, which is what
 * makes the loop seamless. `aria-hidden` on the copy keeps it out of the
 * accessibility tree.
 *
 * The motion is a GSAP tween whose timeScale is eased, NOT a CSS animation
 * whose duration is rewritten. Changing `animation-duration` on a running
 * animation re-maps elapsed time onto the new duration and snaps the element
 * to a different position — measured at up to 40px in a single frame, which is
 * what the band visibly glitching on scroll actually was.
 */

const WORDS = [
  "Starter Locs",
  "Retwists",
  "Loc Extensions",
  "Two-Strand Twists",
  "Soft Locs",
  "Invisible Locs",
  "Butterfly Locs",
  "Colour",
  "Silk Press",
  "Updo Styles",
  "Loc Class",
  "Island Twists",
];

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useVelocityMarquee(ref, trackRef, 46);

  return (
    <div
      ref={ref}
      className="studio relative overflow-hidden border-y border-copper/25 py-5"
      aria-label="Services offered at Bloom Kreations"
    >
      <div ref={trackRef} className="marquee-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {WORDS.map((w) => (
              <li key={w} className="flex items-center gap-8 px-8">
                <span className="whitespace-nowrap font-display text-xl font-bold tracking-tight text-bone sm:text-2xl">
                  {w}
                </span>
                <Butterfly px={20} className="size-5 shrink-0 text-rose-lite" />
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Fade the band into the ground at both edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-studio to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-studio to-transparent"
      />
    </div>
  );
}
