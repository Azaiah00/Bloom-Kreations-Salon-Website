import { Suspense } from "react";
import type { Metadata } from "next";
import { Phone, ExternalLink } from "lucide-react";
import Booker from "@/components/booking/Booker";
import JsonLd from "@/components/site/JsonLd";
import { Eyebrow } from "@/components/ui";
import { BUSINESS, SERVICE_COUNT } from "@/lib/business";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Book locs, a retwist, colour or a protective style with Latesha Reed at Bloom Kreations in Bridgeport, Chicago. Real prices, real durations, and the finish time before you confirm.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Book", path: "/book" }])} />

      <section className="py-section pb-12">
        <div className="container-page">
          <Eyebrow>Book</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-h1 font-black text-ink">
            Five steps, and you always know the price.
          </h1>
          <p className="measure mt-5 text-lead text-ink-soft">
            All {SERVICE_COUNT} services, the real duration for each one, and the
            time you would walk back out — visible before you commit to anything.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink transition-colors hover:text-rose"
            >
              <Phone className="size-4" aria-hidden />
              {BUSINESS.phone}
            </a>
            <a
              href={BUSINESS.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-honey underline decoration-sand underline-offset-4 transition-colors hover:text-ink"
            >
              Or use her Acuity calendar
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <div className="pb-section">
        <Suspense fallback={<BookerFallback />}>
          <Booker />
        </Suspense>
      </div>
    </>
  );
}

function BookerFallback() {
  return (
    <div className="container-page">
      <div className="h-64 animate-pulse rounded-sheet bg-shell" />
    </div>
  );
}
