"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, TriangleAlert, MoveHorizontal } from "lucide-react";
import { usePinnedTrack, useDrawOnScroll } from "@/components/motion/hooks";
import { LocCoil, Bloom } from "@/components/marks/Marks";
import { Eyebrow, Button, cn } from "@/components/ui";
import { LOC_STAGES } from "@/lib/db";
import { getService, formatDuration } from "@/lib/business";

/**
 * The thesis section.
 *
 * No Chicago loc competitor publishes what actually happens to your hair across
 * a loc journey, and "the budding stage" is where clients quit and go elsewhere.
 * Explaining it is both the education asset and the argument for staying with one
 * loctician — so it gets the biggest motion move on the site: a pinned section
 * whose four stages scrub horizontally as you scroll.
 *
 * Below `lg` it degrades to a normal vertical stack. Pinning a full-height
 * horizontal scroller on a phone is a trap, not a feature.
 */

export default function LocJourney() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onProgress = useCallback((p: number) => setProgress(p), []);
  usePinnedTrack(section, track, onProgress);
  useDrawOnScroll(rail);

  const activeIndex = Math.min(
    LOC_STAGES.length - 1,
    Math.floor(progress * LOC_STAGES.length + 0.15)
  );

  return (
    <section
      ref={section}
      id="loc-journey"
      aria-labelledby="journey-title"
      className="studio grain relative overflow-hidden [@media(min-width:1024px)and(min-height:820px)]:h-screen"
    >
      <div className="flex h-full flex-col justify-center py-section [@media(min-width:1024px)and(min-height:820px)]:py-0 [@media(min-width:1024px)and(min-height:820px)]:pb-8 [@media(min-width:1024px)and(min-height:820px)]:pt-[calc(4.5rem+1.25rem)]">
        {/* Header. Laid out in two columns on desktop rather than stacked —
            a pinned section only has one viewport of height to spend, and the
            cards need most of it. */}
        <div className="container-page shrink-0">
          <div className="flex items-center gap-3">
            <span className="neon-rule w-10" aria-hidden />
            <Eyebrow tone="studio">The loc journey</Eyebrow>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-12">
            <h2
              id="journey-title"
              className="font-display text-h2 font-black text-bone"
            >
              Four stages. Most people quit in the second one.
            </h2>

            <div className="flex items-end justify-between gap-6">
              <p className="max-w-md text-bone-dim">
                Four distinct stages over roughly two years, each asking something
                different of you and of the chair. Here is what actually happens.
              </p>
              <div ref={rail} className="hidden shrink-0 items-center gap-3 xl:flex">
                <Bloom
                  className="size-12 text-rose-lite"
                  draw
                  strokeWidth={1.4}
                  title="Bloom Kreations mark"
                />
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bone-dim">
                  <MoveHorizontal className="size-4" aria-hidden />
                  Keep scrolling
                </p>
              </div>
            </div>
          </div>

          {/* Progress rail */}
          <div className="mt-6 hidden [@media(min-width:1024px)and(min-height:820px)]:block">
            <div className="h-px w-full bg-copper/40">
              <div
                className="h-px bg-rose-lite transition-[width] duration-150 ease-linear"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <ol className="mt-3 flex justify-between">
              {LOC_STAGES.map((s, i) => (
                <li
                  key={s.id}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                    i <= activeIndex ? "text-rose-lite" : "text-bone-dim"
                  )}
                >
                  {s.name}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Track */}
        <div className="mt-10 overflow-hidden [@media(min-width:1024px)and(min-height:820px)]:mt-7">
          <div
            ref={track}
            className="flex flex-col gap-8 px-[var(--spacing-gutter)] [@media(min-width:1024px)and(min-height:820px)]:w-max [@media(min-width:1024px)and(min-height:820px)]:flex-row [@media(min-width:1024px)and(min-height:820px)]:gap-8 [@media(min-width:1024px)and(min-height:820px)]:px-[max(var(--spacing-gutter),calc((100vw-84rem)/2+var(--spacing-gutter)))]"
          >
            {LOC_STAGES.map((s, i) => (
              <StageCard key={s.id} stage={s} index={i} active={i === activeIndex} />
            ))}

            {/* Closing card — the argument the whole section builds to. */}
            <article className="flex w-full shrink-0 flex-col justify-center rounded-sheet border border-rose-lite/40 bg-studio-2 p-8 [@media(min-width:1024px)and(min-height:820px)]:w-[29rem] [@media(min-width:1024px)and(min-height:820px)]:p-6">
              <Eyebrow tone="studio">Why it matters</Eyebrow>
              <p className="mt-4 font-display text-h3 font-black text-bone">
                Locs are the one service where changing chairs costs you.
              </p>
              <p className="mt-4 text-bone-dim">
                Your grid was parted by one pair of hands. The tension your root can
                take, the loc that needs watching, the section that was combined two
                years ago — none of that is written down anywhere except in the
                stylist who did it. Consistency is the whole product.
              </p>
              <Button href="/loc-journey" variant="studio" className="mt-8 self-start">
                Read the full guide
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageCard({
  stage,
  index,
  active,
}: {
  stage: (typeof LOC_STAGES)[number];
  index: number;
  active: boolean;
}) {
  return (
    <article
      id={stage.id}
      className={cn(
        "w-full shrink-0 rounded-sheet border p-7 transition-colors duration-500 [@media(min-width:1024px)and(min-height:820px)]:w-[29rem] [@media(min-width:1024px)and(min-height:820px)]:p-6",
        active
          ? "border-rose-lite/50 bg-studio-2"
          : "border-copper/30 bg-studio-2/50"
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-display text-4xl font-black tabular-nums text-rose-lite/40">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-h3 font-black text-bone">
            {stage.name}
          </h3>
          <p className="text-sm font-semibold uppercase tracking-widest text-honey-lite">
            {stage.window}
          </p>
        </div>
        <LocCoil
          className={cn(
            "h-20 w-7 shrink-0 transition-colors duration-500",
            active ? "text-rose-lite" : "text-copper/50"
          )}
          strokeWidth={2}
        />
      </div>

      <p className="mt-5 font-display text-xl font-bold leading-snug text-bone">
        {stage.headline}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-bone-dim">{stage.teaser}</p>

      <p className="mt-5 flex gap-3 rounded-card border border-honey-lite/25 bg-honey-lite/[0.07] p-4 text-sm text-bone-dim">
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-honey-lite"
          aria-hidden
        />
        <span>
          <span className="font-semibold text-bone">Watch out: </span>
          {stage.watchOut}
        </span>
      </p>

      {/* One representative service rather than the full list — a pinned card
          has to fit one viewport, and /loc-journey carries every service for
          every stage in full. */}
      {(() => {
        const svc = getService(stage.serviceIds[0]);
        if (!svc) return null;
        return (
          <Link
            href={`/book?service=${svc.id}`}
            className="group mt-5 flex items-baseline justify-between gap-4 border-t border-copper/30 pt-4"
          >
            <span className="text-sm font-semibold text-bone transition-colors group-hover:text-rose-lite">
              Start with {svc.shortName}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-honey-lite">
              ${svc.priceUsd} &middot; {formatDuration(svc.minutes)}
            </span>
          </Link>
        );
      })()}
    </article>
  );
}
