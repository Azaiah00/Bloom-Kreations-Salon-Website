"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { useReveal, useDrawOnScroll } from "@/components/motion/hooks";
import { Butterfly } from "@/components/marks/Marks";
import { Eyebrow, Button, PriceTag, Badge } from "@/components/ui";
import {
  SERVICE_CATEGORIES,
  servicesByCategory,
  POPULAR_SERVICES,
  formatDuration,
  SERVICE_COUNT,
} from "@/lib/business";

/**
 * Every competitor in this market hides prices behind a booking widget. Putting
 * the whole menu on an indexable page is the single largest SEO and AEO lever
 * available to her, so the homepage previews it rather than teasing it.
 */

export default function ServicesPreview() {
  const ref = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useDrawOnScroll(markRef);

  return (
    <section ref={ref} aria-labelledby="services-title" className="py-section">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="reveal">Services and prices</Eyebrow>
            <h2
              id="services-title"
              className="reveal mt-4 font-display text-h2 font-black text-ink"
            >
              Every price, in the open.
            </h2>
            <p className="reveal measure mt-5 text-ink-soft">
              All {SERVICE_COUNT} services with the real price and the real
              duration, taken straight from her booking calendar. No
              &ldquo;starting from&rdquo;, no calling to ask.
            </p>
          </div>

          <div ref={markRef} className="reveal hidden shrink-0 lg:block">
            <Butterfly px={112} animate="weave" className="w-28 text-rose" />
          </div>
        </div>

        {/* Most booked */}
        <div className="mt-14">
          <h3 className="reveal flex items-center gap-2 text-eyebrow font-bold uppercase text-honey">
            <Flame className="size-4" aria-hidden />
            Most booked
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_SERVICES.map((s) => (
              <li key={s.id} className="reveal">
                <Link
                  href={`/book?service=${s.id}`}
                  className="group flex h-full flex-col rounded-card bg-shell p-6 ring-1 ring-sand transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:bg-cream hover:shadow-[var(--shadow-lift)] hover:ring-rose/40"
                >
                  <h4 className="font-display text-h3 font-bold text-ink">
                    {s.shortName}
                  </h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {s.blurb}
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-sand pt-4">
                    <PriceTag priceUsd={s.priceUsd} status={s.priceStatus} />
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                      <Clock className="size-4" aria-hidden />
                      {formatDuration(s.minutes)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => {
            const items = servicesByCategory(cat.id);
            const from = Math.min(...items.map((s) => s.priceUsd));
            return (
              <Link
                key={cat.id}
                href={`/services#${cat.id}`}
                className="reveal group flex flex-col rounded-card border border-sand p-7 transition-colors duration-300 hover:border-ink hover:bg-shell"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-h3 font-bold text-ink">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-sm text-honey">{cat.kicker}</p>
                  </div>
                  <Badge>{items.length}</Badge>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                  {cat.blurb}
                </p>
                <p className="mt-5 flex items-center justify-between border-t border-sand pt-4 text-sm font-semibold text-ink">
                  From ${from}
                  <ArrowRight
                    className="size-4 text-rose transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </p>
              </Link>
            );
          })}
        </div>

        <div className="reveal mt-12 flex flex-wrap gap-3">
          <Button href="/services" size="lg">
            See the full menu
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button href="/book?service=consultation" variant="ghost" size="lg">
            Not sure? Book a $10 consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
