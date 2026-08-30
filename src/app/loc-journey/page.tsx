import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { TriangleAlert, ArrowRight, Clock, Droplets, Moon, Scissors } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/motion/Reveal";
import { LocCoil, Bloom } from "@/components/marks/Marks";
import { Button, Eyebrow, Section } from "@/components/ui";
import { LOC_STAGES } from "@/lib/db";
import { getService, formatDuration, HER_WORDS, BUSINESS } from "@/lib/business";
import { breadcrumbSchema, locJourneySchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The loc journey — four stages, explained",
  description:
    "What actually happens to your hair across a loc journey: the starter, budding, teen and mature stages, how long each lasts, what maintenance it needs, and the mistake people make at each one. From Bloom Kreations in Chicago.",
  alternates: { canonical: "/loc-journey" },
};

/** Answer-first, with the business named next to the claim. Written for AEO. */
const JOURNEY_FAQ = [
  {
    q: "How long does it take for locs to fully lock?",
    a: "Most locs are fully mature at around two years. Bloom Kreations breaks that into four stages: starter (months 0 to 6), budding (months 6 to 12), teen (year 1 to 2) and mature (year 2 and beyond). Hair texture, thickness and how consistently the set is maintained all move that timeline.",
  },
  {
    q: "What is the budding stage and why do my locs look worse?",
    a: "The budding stage runs roughly from month six to month twelve, and locs genuinely do look lumpy, fuzzy and shorter during it. That is the loc actually forming: small knots build along the shaft and pull the hair up. Nothing has gone wrong, and it is the stage most people quit in.",
  },
  {
    q: "How often should I get my locs retwisted?",
    a: "Every four to six weeks suits most people. Retwisting more often than that is the main cause of thinning at the root, because the tension lands on the same spot before the scalp has recovered. A Loc Retwist at Bloom Kreations is $110 and takes 1 hr 45 min.",
  },
  {
    q: "Can I wash my locs while they are new?",
    a: "Yes, and you should. Washing too rarely is a more common mistake than washing too often — a clean scalp locks faster than a dirty one. The fear of unravelling keeps new clients from washing, and it slows the whole journey down.",
  },
  {
    q: "How much do starter locs cost in Chicago?",
    a: "Starter Locs at Bloom Kreations in Bridgeport are $180 and take 3 hr 20 min. Instant locs, where your hair is crocheted so the set looks mature immediately, are $500 to $530 depending on length.",
  },
  {
    q: "What is the difference between starter locs and instant locs?",
    a: "Starter locs are parted and set, then take months to lock naturally — you live through the budding stage. Instant locs are crocheted so they look like a mature set the same day, skipping the awkward months. Bloom Kreations charges $180 for starter locs and $500 to $530 for instant locs with starter locs.",
  },
];

const CARE = [
  {
    icon: <Droplets className="size-5" aria-hidden />,
    title: "Wash on schedule",
    body: "Every one to two weeks, with a residue-free shampoo. Dry completely — a loc that stays damp at the core is where the smell and the mildew start.",
  },
  {
    icon: <Clock className="size-5" aria-hidden />,
    title: "Retwist every four to six weeks",
    body: "Not sooner. The single biggest cause of thinning roots is tension applied again before the scalp has recovered from the last time.",
  },
  {
    icon: <Moon className="size-5" aria-hidden />,
    title: "Cover them at night",
    body: "Satin or silk, every night. Cotton pillowcases pull moisture out and drag lint into the loc, and lint never comes back out.",
  },
  {
    icon: <Scissors className="size-5" aria-hidden />,
    title: "Say something early",
    body: "A loc going thin at the root is a fix if it is caught. Left alone it is a loss. Bring it up in the chair rather than hiding it under a style.",
  },
];

export default function LocJourneyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "The loc journey", path: "/loc-journey" }]),
          locJourneySchema(),
          faqSchema(JOURNEY_FAQ),
        ]}
      />

      {/* Header */}
      <section className="py-section pb-14">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <Eyebrow>Education</Eyebrow>
              <h1 className="mt-4 font-display text-h1 font-black text-ink">
                The loc journey, honestly.
              </h1>
              <p className="measure mt-5 text-lead text-ink-soft">
                Locking is not one appointment. It is four distinct stages over
                roughly two years, and each one asks something different of you.
                Nobody explains the second one, which is exactly why people give
                up in it.
              </p>
              <p className="reveal mt-6 font-display text-h3 font-bold italic text-rose">
                {HER_WORDS.journey}
              </p>
            </div>
            <Bloom className="hidden w-32 justify-self-end text-honey lg:block" strokeWidth={1.4} />
          </div>
        </div>
      </section>

      {/* Stages */}
      {LOC_STAGES.map((stage, i) => (
        <Section
          key={stage.id}
          id={stage.id}
          tone={i % 2 === 1 ? "shell" : "cream"}
          className="scroll-mt-24"
        >
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
              <div className="flex items-start gap-6 lg:flex-col lg:items-center">
                <span className="reveal font-display text-6xl font-black tabular-nums text-rose/25 lg:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <LocCoil className="reveal h-28 w-9 text-honey lg:h-44 lg:w-12" strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <p className="reveal text-eyebrow font-bold uppercase tracking-widest text-honey">
                  {stage.window}
                </p>
                <h2 className="reveal mt-3 font-display text-h2 font-black text-ink">
                  {stage.name}
                </h2>
                <p className="reveal measure mt-4 font-display text-h3 font-bold leading-snug text-ink">
                  {stage.headline}
                </p>
                <p className="reveal measure mt-4 text-ink-soft">{stage.body}</p>

                <p className="reveal measure mt-7 flex gap-3 rounded-card border border-rose/30 bg-rose/[0.05] p-5 text-sm leading-relaxed text-ink">
                  <TriangleAlert className="mt-0.5 size-5 shrink-0 text-rose" aria-hidden />
                  <span>
                    <strong>The mistake at this stage: </strong>
                    {stage.watchOut}
                  </span>
                </p>

                <div className="reveal mt-8">
                  <h3 className="text-eyebrow font-bold uppercase text-ink-soft">
                    What she books at this stage
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {stage.serviceIds.map((id) => {
                      const svc = getService(id);
                      if (!svc) return null;
                      return (
                        <li key={id}>
                          <Link
                            href={`/book?service=${svc.id}`}
                            className="group flex h-full flex-col justify-between rounded-card border border-sand bg-cream p-5 transition-colors hover:border-ink"
                          >
                            <span className="font-display text-lg font-bold text-ink">
                              {svc.shortName}
                            </span>
                            <span className="mt-3 flex items-center justify-between gap-3 text-sm">
                              <span className="font-bold text-honey">
                                ${svc.priceUsd}
                              </span>
                              <span className="text-ink-soft">
                                {formatDuration(svc.minutes)}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      ))}

      {/* Care rules */}
      <Section tone="studio">
        <Reveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="neon-rule w-10" aria-hidden />
              <Eyebrow tone="studio">Between appointments</Eyebrow>
            </div>
            <h2 className="reveal mt-4 font-display text-h2 font-black text-bone">
              Four rules that decide how your set ages.
            </h2>
            <p className="reveal measure mt-4 text-bone-dim">
              What happens in the chair is maybe a third of it. The rest is these.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {CARE.map((c) => (
              <li
                key={c.title}
                className="reveal rounded-card border border-copper/30 bg-studio-2 p-7"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-pill bg-honey-lite/10 text-honey-lite">
                  {c.icon}
                </span>
                <h3 className="mt-5 font-display text-h3 font-bold text-bone">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-dim">{c.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* FAQ — the AEO surface */}
      <Section tone="shell">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow className="reveal">Straight answers</Eyebrow>
              <h2 className="reveal mt-4 font-display text-h2 font-black text-ink">
                The questions people actually search.
              </h2>
              <p className="reveal measure mt-4 text-ink-soft">
                Answered first, explained second — including the prices, which
                nobody else publishes.
              </p>
              <Button href="/faq" variant="ghost" className="reveal mt-7">
                All questions
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>

            <dl className="flex flex-col gap-8">
              {JOURNEY_FAQ.map((f) => (
                <div key={f.q} className="reveal border-b border-sand pb-8 last:border-0">
                  <dt className="font-display text-h3 font-bold text-ink">{f.q}</dt>
                  <dd className="measure mt-3 text-ink-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Section>

      {/* Close */}
      <Section>
        <Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sheet bg-shell">
              <Image
                src="/gallery/starter-locs-hand.webp"
                alt="A freshly installed set of starter locs held up to show the sectioning and parting"
                fill
                sizes="(min-width: 1024px) 46vw, 90vw"
                className="object-cover"
              />
            </div>
            <div>
              <Eyebrow className="reveal">Start it properly</Eyebrow>
              <h2 className="reveal mt-4 font-display text-h2 font-black text-ink">
                {HER_WORDS.started}
              </h2>
              <p className="reveal measure mt-5 text-ink-soft">
                A $10 consultation is fifteen minutes and it will tell you whether
                starter locs, instant locs or a protective style is the right first
                move for your hair. Book that before you book anything long.
              </p>
              <div className="reveal mt-8 flex flex-wrap gap-3">
                <Button href="/book?service=consultation" size="lg">
                  Book a $10 consultation
                </Button>
                <Button href={BUSINESS.phoneHref} variant="ghost" size="lg">
                  Call {BUSINESS.phone}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
