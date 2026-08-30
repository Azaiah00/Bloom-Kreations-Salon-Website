"use client";

import { useRef } from "react";
import { Star, ExternalLink, Quote } from "lucide-react";
import { useCountUp, useReveal } from "@/components/motion/hooks";
import { Eyebrow, Stars, cn } from "@/components/ui";
import { BUSINESS, REVIEWS, REVIEW_TOPICS } from "@/lib/business";

/**
 * Proof band. Counters run once on first entry, then the review topics Google
 * itself extracted — which is the strongest available evidence that she is read
 * as a loctician rather than a general salon.
 */

export default function Proof() {
  const ref = useRef<HTMLElement>(null);
  useCountUp(ref);
  useReveal(ref);

  const top = REVIEW_TOPICS[0];
  const maxCount = Math.max(...REVIEW_TOPICS.map((t) => t.count));

  return (
    <section
      ref={ref}
      id="proof"
      aria-labelledby="proof-title"
      className="bg-shell py-section"
    >
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow className="reveal">The receipts</Eyebrow>
            <h2
              id="proof-title"
              className="reveal mt-4 font-display text-h2 font-black text-ink"
            >
              Sixty reviews, and {top.count} of them say the same word.
            </h2>
            <p className="reveal measure mt-5 text-ink-soft">
              Google files Bloom Kreations under &ldquo;hairdresser&rdquo;. Her
              clients do not. These are the topics Google&rsquo;s own system pulled
              out of her reviews, with the number of people who mentioned each.
            </p>

            <dl className="reveal mt-10 grid grid-cols-3 gap-6 border-y border-sand py-8">
              <Stat
                to={BUSINESS.rating.value}
                decimals={1}
                label="Google rating"
                icon={<Star className="size-4 fill-honey text-honey" aria-hidden />}
              />
              <Stat to={BUSINESS.rating.count} label="reviews" />
              <Stat to={top.count} label={`mention ${top.topic}`} />
            </dl>

            <a
              href={BUSINESS.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-honey underline decoration-sand underline-offset-4 transition-colors hover:text-ink"
            >
              Read all {BUSINESS.rating.count} reviews on Google
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>

          <div>
            <ul className="flex flex-col gap-3">
              {REVIEW_TOPICS.map((t) => (
                <li key={t.topic} className="reveal flex items-center gap-4">
                  <span className="w-36 shrink-0 text-sm font-semibold text-ink sm:w-44">
                    {t.topic}
                  </span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-pill bg-sand">
                    <span
                      className={cn(
                        "block h-full rounded-pill",
                        t.count === maxCount ? "bg-rose" : "bg-honey"
                      )}
                      style={{ width: `${Math.round((t.count / maxCount) * 100)}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums text-ink-soft">
                    {t.count}
                  </span>
                </li>
              ))}
            </ul>
            <p className="reveal mt-5 text-xs text-ink-soft">
              Source: review topics extracted by Google from her Business Profile,
              read 30 August 2026.
            </p>
          </div>
        </div>

        {/* Real reviews, attributed. */}
        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.slice(0, 6).map((r) => (
            <li
              key={r.author}
              className="reveal flex flex-col rounded-card bg-cream p-7 shadow-[var(--shadow-soft)] ring-1 ring-sand"
            >
              <Quote className="size-6 text-rose" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                {r.quote}
              </blockquote>
              <footer className="mt-6 flex items-center justify-between gap-3 border-t border-sand pt-4">
                <div>
                  <cite className="block text-sm font-bold not-italic text-ink">
                    {r.author}
                  </cite>
                  <span className="text-xs text-ink-soft">
                    Google review &middot; {r.when}
                  </span>
                </div>
                <Stars value={r.rating} />
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({
  to,
  label,
  decimals = 0,
  icon,
}: {
  to: number;
  label: string;
  decimals?: number;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="flex items-center gap-1.5 font-display text-h2 font-black text-ink">
          {icon}
          <span
            data-count-to={to}
            data-count-decimals={decimals}
            className="tabular-nums"
          >
            {decimals ? to.toFixed(decimals) : "0"}
          </span>
        </span>
        <span className="mt-1 block text-xs leading-snug text-ink-soft">{label}</span>
      </dd>
    </div>
  );
}
