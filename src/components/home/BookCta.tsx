"use client";

import { useRef } from "react";
import { CalendarPlus, Phone, ExternalLink, Clock, MapPin } from "lucide-react";
import { useReveal, useDrawOnScroll } from "@/components/motion/hooks";
import { Butterfly } from "@/components/marks/Marks";
import { Eyebrow, Button } from "@/components/ui";
import { BUSINESS, HER_WORDS } from "@/lib/business";

export default function BookCta() {
  const ref = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useDrawOnScroll(markRef);

  return (
    <section
      ref={ref}
      aria-labelledby="book-cta-title"
      className="studio grain relative overflow-hidden py-section"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_120%,rgba(255,61,127,0.22),transparent_70%)]"
      />

      <div className="container-page relative text-center">
        <div ref={markRef} className="reveal mx-auto w-40">
          <Butterfly className="w-full text-rose-lite" draw strokeWidth={1.2} />
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="neon-rule w-12" aria-hidden />
          <Eyebrow tone="studio">Book</Eyebrow>
          <span className="neon-rule w-12" aria-hidden />
        </div>

        <h2
          id="book-cta-title"
          className="reveal mx-auto mt-5 max-w-4xl font-display text-h1 font-black text-bone"
        >
          {HER_WORDS.dreaming}
        </h2>

        <p className="reveal measure mx-auto mt-6 text-lead text-bone-dim">
          Pick the service, pick the day, see the price and the finish time before
          you confirm. Fifteen minutes and ten dollars gets you a consultation if
          you would rather talk it through first.
        </p>

        <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/book" variant="studio" size="lg">
            <CalendarPlus className="size-5" aria-hidden />
            Book an appointment
          </Button>
          <Button href={BUSINESS.phoneHref} variant="studio-ghost" size="lg">
            <Phone className="size-5" aria-hidden />
            {BUSINESS.phone}
          </Button>
        </div>

        <p className="reveal mt-6 text-sm text-bone-dim">
          Prefer her existing calendar?{" "}
          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-honey-lite underline decoration-copper underline-offset-4 transition-colors hover:text-bone"
          >
            Book on Acuity
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </p>

        <dl className="reveal mx-auto mt-14 grid max-w-3xl gap-8 border-t border-copper/30 pt-10 sm:grid-cols-3">
          <CtaFact icon={<Clock className="size-4" aria-hidden />} label="Open">
            7:30 AM &ndash; 7 PM, seven days
          </CtaFact>
          <CtaFact icon={<MapPin className="size-4" aria-hidden />} label="Studio">
            {BUSINESS.address.street}, {BUSINESS.address.neighborhood}
          </CtaFact>
          <CtaFact icon={<Phone className="size-4" aria-hidden />} label="Call or text">
            {BUSINESS.phone}
          </CtaFact>
        </dl>
      </div>
    </section>
  );
}

function CtaFact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center justify-center gap-2 text-eyebrow font-bold uppercase text-honey-lite">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-sm text-bone-dim">{children}</dd>
    </div>
  );
}
