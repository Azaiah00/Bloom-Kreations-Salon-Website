"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis drives every scroll on the site and GSAP's ScrollTrigger reads from it,
 * so the two share one clock rather than fighting over rAF.
 *
 * Registered once at the root. Everything that scrubs on scroll depends on this
 * being mounted, so it must stay in the root layout.
 */

let lenis: Lenis | null = null;

/** Let any component scroll the page through Lenis rather than the browser. */
export function scrollToTarget(target: string | HTMLElement, offset = -80) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Respect the OS setting. Reduced motion gets native scrolling and the
    // instant end-state of every animation, never a degraded page.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.remove("no-js");

    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential ease — enough glide to feel considered, not so much
      // that a click on a nav link feels laggy.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch beats an emulated one; leaving this off keeps
      // iOS scrolling correct.
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    // Fonts land after first paint and change every measurement ScrollTrigger
    // took. Without this, pinned sections end up a few hundred pixels off.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // A route change replaces the DOM every trigger was measured against.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
