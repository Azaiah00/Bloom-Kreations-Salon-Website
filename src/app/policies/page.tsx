import type { Metadata } from "next";
import { CircleAlert, Check, Clock, Info } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/motion/Reveal";
import { Button, Eyebrow, Section } from "@/components/ui";
import { BUSINESS } from "@/lib/business";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Studio policies",
  description:
    "Arrival, lateness, cancellations, deposits, children and what to bring — the studio policies for Bloom Kreations in Bridgeport, Chicago.",
  alternates: { canonical: "/policies" },
  robots: { index: true, follow: true },
};

/**
 * Policies she has not published anywhere are rendered as visible
 * "needs confirming" blocks rather than invented. A cancellation window quietly
 * made up here becomes a rule she has to honour with a real client.
 */

const CONFIRMED = [
  {
    icon: <Clock className="size-5" aria-hidden />,
    title: "Hours",
    body: "The studio is open 7:30 AM to 7:00 PM, seven days a week. Long installs start early so they can finish in daylight — if you are offered a 7:30 AM slot for a full-day service, take it.",
  },
  {
    icon: <Check className="size-5" aria-hidden />,
    title: "Consultation before extensions",
    body: "Loc extensions cannot be booked cold. Book the $10 consultation first; she will confirm the extension appointment from there.",
  },
  {
    icon: <Check className="size-5" aria-hidden />,
    title: "Payment is taken in the studio",
    body: "No deposit or card is collected on this website, and nothing on this site charges you. Confirm which payment methods she accepts before your first visit.",
  },
];

const NEEDS_CONFIRMING = [
  {
    title: "Deposits",
    body: "Whether a deposit is required to hold an appointment, how much it is, and whether it comes off the final price.",
  },
  {
    title: "Cancellation window",
    body: "How far ahead an appointment can be cancelled or moved without a charge — 24 hours and 48 hours are both common for services this long.",
  },
  {
    title: "Lateness",
    body: "How late is too late, and whether a shortened service or a reschedule applies past that point. Full-day installs cannot absorb much lateness.",
  },
  {
    title: "No-shows",
    body: "What happens after a missed appointment, and whether future bookings need a deposit.",
  },
  {
    title: "Guests and children in the studio",
    body: "Whether clients can bring someone with them, and the position on children who are not being serviced.",
  },
  {
    title: "Hair prep before an appointment",
    body: "Whether you should arrive washed, dried, taken down, or as-is — and whether take-down is charged separately when you have not done it.",
  },
  {
    title: "Travel bookings",
    body: "Travel radius, minimum booking value, travel fee and how far ahead a travel booking has to be made.",
  },
  {
    title: "Redo policy",
    body: "The window and the terms for coming back if something is not right.",
  },
];

export default function PoliciesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Policies", path: "/policies" }])} />

      <section className="py-section pb-14">
        <div className="container-page">
          <Eyebrow>Studio policies</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-h1 font-black text-ink">
            What is settled, and what is not.
          </h1>
          <p className="measure mt-5 text-lead text-ink-soft">
            This page only states policies that are actually published. Everything
            else is listed openly as outstanding rather than invented — a
            cancellation window made up on a website becomes a rule Latesha has to
            enforce with a real client.
          </p>
        </div>
      </section>

      <Section className="pt-0">
        <Reveal>
          <h2 className="reveal font-display text-h2 font-black text-ink">
            Confirmed
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {CONFIRMED.map((p) => (
              <li
                key={p.title}
                className="reveal rounded-card border border-sand bg-shell p-7"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-pill bg-cream text-honey ring-1 ring-sand">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-display text-h3 font-bold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section tone="shell">
        <Reveal>
          <div className="max-w-2xl">
            <div className="reveal inline-flex items-center gap-2 rounded-pill bg-rose/10 px-4 py-2">
              <CircleAlert className="size-4 text-rose" aria-hidden />
              <span className="text-eyebrow font-bold uppercase text-rose">
                Needs confirming before launch
              </span>
            </div>
            <h2 className="reveal mt-5 font-display text-h2 font-black text-ink">
              Eight policies Latesha still needs to set.
            </h2>
            <p className="reveal measure mt-4 text-ink-soft">
              None of these are published on her booking page today. Each one is a
              real decision with money attached, so they are hers to make — this
              page will state them plainly the moment she does.
            </p>
          </div>

          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {NEEDS_CONFIRMING.map((p, i) => (
              <li
                key={p.title}
                className="reveal flex gap-5 rounded-card border-2 border-dashed border-rose/40 bg-cream p-6"
              >
                <span className="font-display text-2xl font-black tabular-nums text-rose/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-h3 font-bold text-ink">
                    {p.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                    {p.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section tone="studio">
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="neon-rule w-10" aria-hidden />
              <Eyebrow tone="studio">In the meantime</Eyebrow>
            </div>
            <h2 className="reveal mt-4 font-display text-h2 font-black text-bone">
              Ask her directly.
            </h2>
            <p className="reveal measure mt-4 text-bone-dim">
              Until these are set, the honest answer to any of them is a phone
              call. She answers, and her reviews say she is quick about it.
            </p>

            <p className="reveal mt-8 flex gap-3 rounded-card border border-honey-lite/25 bg-honey-lite/[0.07] p-5 text-sm leading-relaxed text-bone-dim">
              <Info className="mt-0.5 size-4 shrink-0 text-honey-lite" aria-hidden />
              <span>
                Nothing on this website takes payment, holds a card, or charges a
                cancellation fee. Any deposit or fee would be arranged with
                Latesha directly.
              </span>
            </p>

            <div className="reveal mt-9 flex flex-wrap gap-3">
              <Button href={BUSINESS.phoneHref} variant="studio" size="lg">
                Call {BUSINESS.phone}
              </Button>
              <Button href="/faq" variant="studio-ghost" size="lg">
                Read the questions page
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
