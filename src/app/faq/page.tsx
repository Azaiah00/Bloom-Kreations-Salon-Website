import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/motion/Reveal";
import { Button, Eyebrow, Section } from "@/components/ui";
import { BUSINESS, SERVICE_COUNT, PRICE_RANGE } from "@/lib/business";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Prices, timings, booking, travel bookings, kids, colour and loc care — the questions clients ask Bloom Kreations in Chicago, answered straight.",
  alternates: { canonical: "/faq" },
};

/**
 * Answer-first, with "Bloom Kreations" adjacent to the claim in the first
 * sentence. That structure is what featured snippets and answer engines lift,
 * and it is the whole reason this page exists as a separate surface.
 */
const GROUPS: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Booking",
    faqs: [
      {
        q: "How do I book an appointment at Bloom Kreations?",
        a: `Book online at bloomkreations.com/book, or on her Acuity calendar directly. You can also call or text ${BUSINESS.phone}. Booking online is fastest because you can see the price, the duration and the finish time before you confirm.`,
      },
      {
        q: "What are Bloom Kreations' hours?",
        a: "Bloom Kreations is open 7:30 AM to 7:00 PM, seven days a week, at 928 W 38th Pl in Bridgeport, Chicago. Actual availability depends on what is already booked — a full-day service needs a clear run, so it will only appear on days that have one.",
      },
      {
        q: "Do I need a consultation first?",
        a: "For most services, no. Loc extensions are the exception — they require a consultation first. If you are unsure what your hair needs, the consultation is $10 for 15 minutes and it is the cheapest way to avoid booking the wrong three-hour appointment.",
      },
      {
        q: "Is a deposit required?",
        a: "This is not confirmed yet. Her booking page does not currently state a deposit, cancellation window or no-show policy. Ask when you book, and check the studio policies page for the current position.",
      },
      {
        q: "Can I book for my child?",
        a: "Yes. Bloom Kreations has an appointment type covering children under ten alongside senior clients aged fifty and over, at $120 for two hours. Several of her Google reviews are from parents who book for themselves and their child on the same day.",
      },
    ],
  },
  {
    title: "Prices and timing",
    faqs: [
      {
        q: "How much does a retwist cost at Bloom Kreations?",
        a: "A Loc Retwist is $110 and takes 1 hr 45 min. Adding a two-strand twist set takes it to $140–$200 depending on your length, and adding barrel rolls or braided styling makes it $135.",
      },
      {
        q: "How much are starter locs?",
        a: "Starter Locs at Bloom Kreations are $180 and take 3 hr 20 min. Instant locs — where your hair is crocheted so the set looks mature the same day — are $500 above shoulder length and $530 at shoulder length.",
      },
      {
        q: "What is the cheapest and most expensive thing on the menu?",
        a: `The consultation is $10 for 15 minutes. Loc extensions are $850 for a full day, and require a consultation first. There are ${SERVICE_COUNT} services in total, ranging $${PRICE_RANGE.min} to $${PRICE_RANGE.max}, and every price is published on the services page.`,
      },
      {
        q: "Why do prices change with hair length?",
        a: "Because time does. A two-strand set on past-mid-back locs is the same technique repeated over far more hair — 3 hr 40 min instead of 3 hr. The price ladder on her menu tracks the extra chair time, not a different service.",
      },
      {
        q: "How should I pay?",
        a: "Payment is taken in the studio. No deposit or card is collected on this website. Ask her directly which payment methods she takes before your first appointment.",
      },
    ],
  },
  {
    title: "Services",
    faqs: [
      {
        q: "Does Bloom Kreations travel?",
        a: "Yes. Latesha describes herself as a traveling loctician and takes bookings on location for weddings, shoots, events and groups. Travel radius, minimum booking and any travel fee are agreed per job, so message her on Instagram or call to get a quote.",
      },
      {
        q: "Can she colour locs?",
        a: "Yes. Bloom Kreations offers blonde and brown colour from $50 for tips up to $130 for a full head, and double-process colour for reds, coppers and fashion shades from $85 for tips to $130 for a full head. Fashion shades need the two-step process because they will not take in one pass.",
      },
      {
        q: "What protective styles does she install?",
        a: "Soft locs ($300, any length), invisible locs with hair included ($265), butterfly locs ($225), miracle knots ($275), island twists to mid back ($325) and natural twists or braids on your own hair ($180).",
      },
      {
        q: "Does she teach?",
        a: "Yes. The Loc Class is a full day of one-to-one teaching at $650 — parting, retwisting and maintenance, whether that is for your own hair or because you want to work on other people's.",
      },
      {
        q: "Can she fix locs that have gone thin or unravelled?",
        a: "Yes. Loc Touch Ups are $65 for 45 minutes and cover a few unravelled locs or a section that needs re-attaching. A Loc Combination at $400 is the larger fix — merging thin or over-parted locs into a stronger grid. Bring it up early; a thinning root is a fix when caught and a loss when it is not.",
      },
    ],
  },
  {
    title: "Care and the journey",
    faqs: [
      {
        q: "How often should I retwist?",
        a: "Every four to six weeks. More often than that is the main cause of thinning at the root, because the tension lands on the same spot before the scalp has recovered.",
      },
      {
        q: "How long until my locs are mature?",
        a: "Around two years, across four stages: starter, budding, teen and mature. The loc journey page walks through what happens in each one and what people get wrong at each stage.",
      },
      {
        q: "Can I wash new locs?",
        a: "Yes, and washing too rarely is the more common mistake. A clean scalp locks faster than a dirty one. Wash every one to two weeks with a residue-free shampoo and dry completely.",
      },
      {
        q: "What should I do the night before an appointment?",
        a: "Come with your hair down and dry unless she has told you otherwise, and wear a satin or silk covering at night in the weeks between visits. If you are unsure what to do before a specific service, message her — it is a faster answer than guessing.",
      },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.faqs);

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Questions", path: "/faq" }]),
          faqSchema(ALL),
        ]}
      />

      <section className="py-section pb-14">
        <div className="container-page">
          <Eyebrow>Questions</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-h1 font-black text-ink">
            Straight answers, with the numbers in them.
          </h1>
          <p className="measure mt-5 text-lead text-ink-soft">
            Everything clients ask before their first appointment. Where something
            has not been confirmed yet, this page says so rather than guessing.
          </p>

          <nav aria-label="Question topics" className="mt-9">
            <ul className="flex flex-wrap gap-2">
              {GROUPS.map((g) => (
                <li key={g.title}>
                  <a
                    href={`#${slug(g.title)}`}
                    className="inline-flex min-h-10 items-center rounded-pill border border-sand px-4 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {GROUPS.map((group, i) => (
        <Section
          key={group.title}
          id={slug(group.title)}
          tone={i % 2 === 1 ? "shell" : "cream"}
          className="scroll-mt-24"
        >
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
              <h2 className="reveal font-display text-h2 font-black text-ink lg:sticky lg:top-24 lg:self-start">
                {group.title}
              </h2>

              <dl className="flex flex-col gap-8">
                {group.faqs.map((f) => (
                  <div
                    key={f.q}
                    className="reveal border-b border-sand pb-8 last:border-0 last:pb-0"
                  >
                    <dt className="font-display text-h3 font-bold text-ink">{f.q}</dt>
                    <dd className="measure mt-3 leading-relaxed text-ink-soft">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Section>
      ))}

      <Section tone="studio">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="neon-rule w-12" aria-hidden />
              <Eyebrow tone="studio">Still stuck</Eyebrow>
              <span className="neon-rule w-12" aria-hidden />
            </div>
            <h2 className="reveal mt-5 font-display text-h2 font-black text-bone">
              Fifteen minutes will sort it.
            </h2>
            <p className="reveal mt-4 text-bone-dim">
              A $10 consultation is the cheapest way to find out what your hair
              actually needs before you book three hours of it.
            </p>
            <div className="reveal mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/book?service=consultation" variant="studio" size="lg">
                Book a consultation
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button href={BUSINESS.phoneHref} variant="studio-ghost" size="lg">
                Call {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
