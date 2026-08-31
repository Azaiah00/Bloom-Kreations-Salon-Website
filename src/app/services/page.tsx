import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Info, ArrowRight, Flame, Printer } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import { Butterfly } from "@/components/marks/Marks";
import { Badge, Button, Eyebrow, PriceTag, Section } from "@/components/ui";
import Reveal from "@/components/motion/Reveal";
import {
  SERVICE_CATEGORIES,
  SERVICES,
  servicesByCategory,
  formatDuration,
  PRICE_RANGE,
  SERVICE_COUNT,
  BUSINESS,
} from "@/lib/business";
import { breadcrumbSchema, serviceListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services and prices",
  description: `All ${SERVICE_COUNT} services at Bloom Kreations in Bridgeport, Chicago, with the real price and duration for each — retwists from $110, starter locs $180, soft locs $300, loc extensions $850. Published in full.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Services", path: "/services" }]),
          serviceListSchema(),
        ]}
      />

      {/* Header */}
      <section className="py-section pb-14">
        <div className="container-page">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Eyebrow>Services and prices</Eyebrow>
              <h1 className="mt-4 font-display text-h1 font-black text-ink">
                The whole menu, with the numbers on it.
              </h1>
              <p className="measure mt-5 text-lead text-ink-soft">
                Every service Latesha offers, the price she actually charges, and
                how long it takes in the chair. Nothing is hidden behind a
                &ldquo;call for pricing&rdquo;.
              </p>
            </div>
            <Butterfly px={96} animate="unfurl" className="hidden w-24 shrink-0 text-rose lg:block" />
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-sand py-8 sm:grid-cols-4">
            <HeadStat value={String(SERVICE_COUNT)} label="services" />
            <HeadStat value={`$${PRICE_RANGE.min}`} label="cheapest — consultation" />
            <HeadStat value={`$${PRICE_RANGE.max}`} label="dearest — loc extensions" />
            <HeadStat value="7 days" label="7:30 AM to 7 PM" />
          </dl>

          {/* Category jump nav */}
          <nav aria-label="Service categories" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-sand px-4 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {c.name}
                    <span className="text-xs tabular-nums text-honey">
                      {servicesByCategory(c.id).length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Categories */}
      {SERVICE_CATEGORIES.map((cat, catIndex) => {
        const items = servicesByCategory(cat.id);
        return (
          <Section
            key={cat.id}
            id={cat.id}
            tone={catIndex % 2 === 1 ? "shell" : "cream"}
            className="scroll-mt-24"
          >
            <Reveal>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <Eyebrow className="reveal">{cat.kicker}</Eyebrow>
                  <h2 className="reveal mt-3 font-display text-h2 font-black text-ink">
                    {cat.name}
                  </h2>
                  <p className="reveal measure mt-4 text-ink-soft">{cat.blurb}</p>
                </div>
                <p className="reveal shrink-0 text-sm text-ink-soft">
                  {items.length} services &middot; from $
                  {Math.min(...items.map((s) => s.priceUsd))}
                </p>
              </div>

              <ul className="mt-10 flex flex-col gap-3">
                {items.map((s) => (
                  <li key={s.id} className="reveal">
                    <article className="group grid gap-5 rounded-card border border-sand bg-cream p-6 transition-colors duration-300 hover:border-ink sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-display text-h3 font-bold text-ink">
                            {s.shortName}
                          </h3>
                          {s.popular ? (
                            <Badge tone="rose" icon={<Flame className="size-3" aria-hidden />}>
                              Popular
                            </Badge>
                          ) : null}
                        </div>

                        {/* Her exact booking-page wording, kept so search matches it. */}
                        {s.name !== s.shortName ? (
                          <p className="mt-1 text-xs text-ink-soft">
                            On her booking page: &ldquo;{s.name}&rdquo;
                          </p>
                        ) : null}

                        <p className="measure mt-3 text-sm leading-relaxed text-ink-soft">
                          {s.blurb}
                        </p>

                        {s.note ? (
                          <p className="mt-4 flex gap-2.5 rounded-card bg-shell p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-sand">
                            <Info className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden />
                            <span>
                              <strong className="text-ink">Needs confirming: </strong>
                              {s.note}
                            </span>
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-row items-center justify-between gap-6 border-t border-sand pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                        <div className="sm:text-right">
                          <PriceTag priceUsd={s.priceUsd} status={s.priceStatus} />
                          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-soft">
                            <Clock className="size-4" aria-hidden />
                            {formatDuration(s.minutes)}
                          </p>
                        </div>
                        <Link
                          href={`/book?service=${s.id}`}
                          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill bg-ink px-5 text-sm font-semibold text-cream transition-colors group-hover:bg-rose"
                        >
                          Book
                          <ArrowRight className="size-4" aria-hidden />
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Section>
        );
      })}

      {/* Print-friendly full price list — the thing she can put on the wall. */}
      <Section tone="studio">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="neon-rule w-10" aria-hidden />
                <Eyebrow tone="studio">Everything on one page</Eyebrow>
              </div>
              <h2 className="reveal mt-4 font-display text-h2 font-black text-bone">
                The full price list.
              </h2>
              <p className="reveal measure mt-4 text-bone-dim">
                All {SERVICE_COUNT} services in one table. It prints cleanly if she
                wants it on the studio wall.
              </p>
            </div>
            <p className="reveal no-print inline-flex items-center gap-2 text-sm text-bone-dim">
              <Printer className="size-4" aria-hidden />
              Print this page for a clean copy
            </p>
          </div>

          <div className="reveal mt-10 overflow-x-auto rounded-sheet border border-copper/30">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Bloom Kreations full service menu with prices and durations
              </caption>
              <thead>
                <tr className="border-b border-copper/40">
                  <th scope="col" className="p-4 font-sans text-eyebrow font-bold uppercase text-honey-lite">
                    Service
                  </th>
                  <th scope="col" className="p-4 font-sans text-eyebrow font-bold uppercase text-honey-lite">
                    Category
                  </th>
                  <th scope="col" className="p-4 text-right font-sans text-eyebrow font-bold uppercase text-honey-lite">
                    Time
                  </th>
                  <th scope="col" className="p-4 text-right font-sans text-eyebrow font-bold uppercase text-honey-lite">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.id} className="border-b border-copper/20 last:border-0">
                    <th scope="row" className="p-4 font-sans font-semibold text-bone">
                      {s.name}
                    </th>
                    <td className="p-4 text-bone-dim">
                      {SERVICE_CATEGORIES.find((c) => c.id === s.category)?.name}
                    </td>
                    <td className="p-4 text-right tabular-nums text-bone-dim">
                      {formatDuration(s.minutes)}
                    </td>
                    <td className="p-4 text-right font-bold tabular-nums text-honey-lite">
                      ${s.priceUsd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="reveal mt-5 text-xs text-bone-dim">
            Prices and durations read from her live booking calendar on 30 August
            2026. Confirm with her before printing.
          </p>

          <div className="reveal no-print mt-10 flex flex-wrap gap-3">
            <Button href="/book" variant="studio" size="lg">
              Book an appointment
            </Button>
            <Button href={BUSINESS.phoneHref} variant="studio-ghost" size="lg">
              Call {BUSINESS.phone}
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function HeadStat({ value, label }: { value: string; label: string }) {
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
