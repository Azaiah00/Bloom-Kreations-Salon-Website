"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { Star, MapPin, ArrowDown, CalendarPlus, Sparkles } from "lucide-react";
import { useHero } from "@/components/motion/hooks";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { Butterfly } from "@/components/marks/Marks";
import { Button } from "@/components/ui";
import { BUSINESS, SERVICE_COUNT, PRICE_RANGE } from "@/lib/business";

/** Each word animates independently, so the headline is split at the source. */
const LINE_1 = ["Healthy", "locs."];
const LINE_2 = ["Happy", "crown."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHero(ref);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-20 pt-10 sm:pt-16 lg:pb-28 lg:pt-20"
      aria-labelledby="hero-title"
    >
      {/* Warm wash behind the fold. Decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(70%_60%_at_20%_0%,rgba(233,162,74,0.22),transparent_70%),radial-gradient(50%_50%_at_85%_10%,rgba(255,61,127,0.14),transparent_70%)]"
    />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <div
            data-hero-meta
            className="inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-pill border border-sand bg-cream/70 px-4 py-2 backdrop-blur"
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
              <Star className="size-4 fill-honey text-honey" aria-hidden />
              {BUSINESS.rating.value}
            </span>
            <span className="text-sm text-ink-soft">
              {BUSINESS.rating.count} Google reviews
            </span>
            <span className="h-4 w-px bg-sand" aria-hidden />
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <MapPin className="size-4 text-rose" aria-hidden />
              Bridgeport, Chicago
            </span>
          </div>

          <h1
            id="hero-title"
            className="mt-7 font-display text-display font-black text-ink"
          >
            {/* Each word is its own element so it can animate independently, but
                the words are separated by a real space rather than padding —
                without it the DOM text reads "Healthylocs." to a crawler and to
                a screen reader. */}
            <span className="block overflow-hidden pb-[0.06em]">
              {LINE_1.map((w, i) => (
                <Fragment key={w}>
                  <span data-hero-word className="inline-block">
                    {w}
                  </span>
                  {i < LINE_1.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              {LINE_2.map((w, i) => (
                <Fragment key={w}>
                  <span
                    data-hero-word
                    className={
                      i === 1 ? "inline-block italic text-rose" : "inline-block"
                    }
                  >
                    {w}
                  </span>
                  {i < LINE_2.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          </h1>

          <p data-hero-meta className="measure mt-7 text-lead text-ink-soft">
            Latesha Reed has been starting, keeping and styling locs on the South
            Side for years — crisp parts, no tension at the root, and a set that
            still looks right three weeks later. Every price is on this site.
          </p>

          <div data-hero-meta className="mt-9 flex flex-wrap gap-3">
            <Button href="/book" size="lg">
              <CalendarPlus className="size-5" aria-hidden />
              Book an appointment
            </Button>
            <Button href="/services" variant="ghost" size="lg">
              See all {SERVICE_COUNT} services
            </Button>
          </div>

          <dl
            data-hero-meta
            className="mt-11 grid max-w-lg grid-cols-3 gap-6 border-t border-sand pt-7"
          >
            <HeroStat value={`${SERVICE_COUNT}`} label="services, all priced" />
            <HeroStat
              value={`$${PRICE_RANGE.min}–$${PRICE_RANGE.max}`}
              label="consultation to full day"
            />
            <HeroStat value="7 days" label="7:30 AM to 7 PM" />
          </dl>
        </div>

        {/* Portrait plate */}
        <div data-hero-plate className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sheet bg-shell shadow-[var(--shadow-lift)]">
            <div data-hero-plate-inner className="absolute inset-[-8%]">
              <Image
                src="/brand/latesha-portrait.webp"
                alt="Latesha Reed, owner and loctician at Bloom Kreations in Chicago"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 90vw"
                className="object-cover object-top"
              />
            </div>

            {/* Warm scrim so the caption stays legible over the photo. */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-studio via-studio/85 to-transparent"
            />

            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <p className="font-display text-h3 font-bold text-bone">
                  {BUSINESS.owner.name}
                </p>
                <p className="text-sm text-bone-dim">
                  {BUSINESS.owner.role} &middot; Traveling loctician
                </p>
              </div>
              <Butterfly px={40} neon className="size-10 shrink-0 text-rose-lite" />
            </figcaption>
          </div>

          {/* Floating credential-free proof chip. */}
          <div className="absolute -left-3 top-8 hidden rounded-card bg-cream px-4 py-3 shadow-[var(--shadow-soft)] ring-1 ring-sand sm:block lg:-left-8">
            <p className="flex items-center gap-2 text-eyebrow font-bold uppercase text-honey">
              <Sparkles className="size-3.5" aria-hidden />
              Most booked
            </p>
            <p className="mt-1 font-display text-lg font-bold text-ink">Loc Retwist</p>
            <p className="text-sm text-ink-soft">$110 &middot; 1 hr 45 min</p>
          </div>
        </div>
      </div>

      <button
        data-hero-cue
        type="button"
        onClick={() => scrollToTarget("#proof")}
        className="container-page mt-16 flex items-center gap-3 text-eyebrow font-bold uppercase text-ink-soft transition-colors hover:text-rose lg:mt-20"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-pill border border-sand">
          <ArrowDown className="size-4" aria-hidden />
        </span>
        Scroll
      </button>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-h3 font-black text-ink">{value}</span>
        <span className="mt-1 block text-xs leading-snug text-ink-soft">{label}</span>
      </dd>
    </div>
  );
}
