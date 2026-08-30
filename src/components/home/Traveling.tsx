"use client";

import { useRef } from "react";
import Image from "next/image";
import { Plane, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { useReveal, useDrawOnScroll } from "@/components/motion/hooks";
import { Crown } from "@/components/marks/Marks";
import { Eyebrow, Button } from "@/components/ui";
import { BUSINESS, HER_WORDS } from "@/lib/business";

/**
 * "Traveling loctician" is in her own Instagram bio and returns essentially no
 * local competitor in search. It is the most ownable phrase she has, so it gets
 * a section of its own rather than a line in the footer.
 *
 * The copy stays deliberately non-committal on terms because we do not yet know
 * her travel radius or fee — the CTA is a conversation, not a booking.
 */

export default function Traveling() {
  const ref = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useDrawOnScroll(markRef);

  return (
    <section ref={ref} aria-labelledby="traveling-title" className="py-section">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sheet bg-shell shadow-[var(--shadow-lift)]">
              <Image
                src="/gallery/client-suit.webp"
                alt="A Bloom Kreations client in a pinstripe suit with a blonde loc ponytail, photographed in Chicago"
                fill
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="object-cover"
              />
            </div>

            <blockquote className="absolute -bottom-6 -right-2 max-w-[19rem] rounded-card bg-rose p-6 text-cream shadow-[var(--shadow-lift)] sm:-right-6">
              <div ref={markRef}>
                <Crown className="w-10 text-cream/70" draw strokeWidth={2} />
              </div>
              <p className="mt-3 font-display text-xl font-bold leading-snug">
                {HER_WORDS.confidence}
              </p>
            </blockquote>
          </div>

          <div className="order-1 lg:order-2">
            <Eyebrow className="reveal">
              <span className="inline-flex items-center gap-2">
                <Plane className="size-4" aria-hidden />
                Traveling loctician
              </span>
            </Eyebrow>

            <h2
              id="traveling-title"
              className="reveal mt-4 font-display text-h2 font-black text-ink"
            >
              She does not only work from the chair.
            </h2>

            <p className="reveal measure mt-5 text-lead text-ink-soft">
              Latesha travels. Weddings, shoots, events, groups who would rather
              not spend a Saturday driving to Bridgeport one at a time — it is
              part of what Bloom Kreations does, and almost nobody else in Chicago
              advertises it.
            </p>

            <ul className="reveal mt-8 flex flex-col gap-4">
              <Point icon={<MapPin className="size-4" aria-hidden />}>
                Based at {BUSINESS.address.street} in {BUSINESS.address.neighborhood},
                and on the road for the right booking.
              </Point>
              <Point icon={<Plane className="size-4" aria-hidden />}>
                Out-of-city and out-of-state travel is possible for events and
                groups.
              </Point>
              <Point icon={<MessageCircle className="size-4" aria-hidden />}>
                Travel radius, minimum booking and fee are set per job — start with
                a message and she will quote it.
              </Point>
            </ul>

            <div className="reveal mt-9 flex flex-wrap gap-3">
              <Button href={`${BUSINESS.social.instagram}`} external size="lg">
                Message about travel
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button href={BUSINESS.phoneHref} variant="ghost" size="lg">
                Call {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Point({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-pill bg-shell text-honey ring-1 ring-sand">
        {icon}
      </span>
      <span className="text-ink-soft">{children}</span>
    </li>
  );
}
