import type { Metadata } from "next";
import { MapPin, Phone, Clock, Navigation, Train, Car, ExternalLink } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/motion/Reveal";
import { InstagramGlyph } from "@/components/marks/Marks";
import { Button, Eyebrow, Section } from "@/components/ui";
import { BUSINESS, HOURS } from "@/lib/business";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Visit the studio",
  description: `Bloom Kreations is at ${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}, in Bridgeport on the South Side. Open 7:30 AM to 7 PM, seven days a week. Call ${BUSINESS.phone}.`,
  alternates: { canonical: "/visit" },
};

const GETTING_HERE = [
  {
    icon: <Car className="size-5" aria-hidden />,
    title: "Driving",
    body: "West 38th Place sits just off South Halsted, a few blocks from the Dan Ryan and Pershing Road. It is residential street parking — give yourself a few extra minutes at busy times.",
  },
  {
    icon: <Train className="size-5" aria-hidden />,
    title: "Transit",
    body: "The CTA Red Line and the 8 Halsted bus both serve this stretch of Bridgeport. Check current CTA times before you set out — long appointments mean you may be leaving after dark.",
  },
  {
    icon: <Navigation className="size-5" aria-hidden />,
    title: "Finding the door",
    body: "The Plus Code is R9F2+RG Chicago, which drops a pin more precisely than the street number if your map app is being unhelpful.",
  },
];

export default function VisitPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Visit", path: "/visit" }])} />

      <section className="py-section pb-14">
        <div className="container-page">
          <Eyebrow>Visit</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-h1 font-black text-ink">
            Bridgeport, seven days a week.
          </h1>
          <p className="measure mt-5 text-lead text-ink-soft">
            The studio is on West 38th Place on the South Side, a short way off
            Halsted. Doors open at half past seven in the morning — early enough
            for a full-day install to still finish in daylight.
          </p>
        </div>
      </section>

      <Section className="pt-0">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
            {/* Details */}
            <div className="flex flex-col gap-5">
              <div className="reveal rounded-sheet border border-sand bg-shell p-8">
                <p className="flex items-center gap-2 text-eyebrow font-bold uppercase text-honey">
                  <MapPin className="size-4" aria-hidden />
                  The studio
                </p>
                <address className="mt-4 font-display text-h3 font-bold not-italic leading-snug text-ink">
                  {BUSINESS.address.street}
                  <br />
                  {BUSINESS.address.locality}, {BUSINESS.address.region}{" "}
                  {BUSINESS.address.postalCode}
                </address>
                <p className="mt-3 text-sm text-ink-soft">
                  {BUSINESS.address.neighborhood} &middot; {BUSINESS.plusCode}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={BUSINESS.googleMapsUrl} external>
                    <Navigation className="size-4" aria-hidden />
                    Directions
                  </Button>
                  <Button href={BUSINESS.phoneHref} variant="ghost">
                    <Phone className="size-4" aria-hidden />
                    {BUSINESS.phone}
                  </Button>
                </div>
              </div>

              <div className="reveal rounded-sheet border border-sand bg-shell p-8">
                <p className="flex items-center gap-2 text-eyebrow font-bold uppercase text-honey">
                  <Clock className="size-4" aria-hidden />
                  Hours
                </p>
                <table className="mt-4 w-full text-sm">
                  <caption className="sr-only">Opening hours</caption>
                  <tbody>
                    {HOURS.map((h) => (
                      <tr key={h.day} className="border-b border-sand last:border-0">
                        <th
                          scope="row"
                          className="py-2.5 text-left font-semibold text-ink"
                        >
                          {h.day}
                        </th>
                        <td className="py-2.5 text-right tabular-nums text-ink-soft">
                          7:30 AM &ndash; 7:00 PM
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                  These are the hours on her Google Business Profile. Actual
                  availability depends on what is already in the book — the
                  booking page only offers times where the whole appointment fits.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="reveal overflow-hidden rounded-sheet border border-sand bg-shell">
              <iframe
                title={`Map showing ${BUSINESS.legalName} at ${BUSINESS.address.street}, ${BUSINESS.address.locality}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`
                )}&z=16&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[26rem] w-full border-0 lg:h-full lg:min-h-[34rem]"
              />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Getting here */}
      <Section tone="shell">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow className="reveal">Getting here</Eyebrow>
            <h2 className="reveal mt-4 font-display text-h2 font-black text-ink">
              Three things that help.
            </h2>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {GETTING_HERE.map((g) => (
              <li
                key={g.title}
                className="reveal rounded-card border border-sand bg-cream p-7"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-pill bg-shell text-honey ring-1 ring-sand">
                  {g.icon}
                </span>
                <h3 className="mt-5 font-display text-h3 font-bold text-ink">
                  {g.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{g.body}</p>
              </li>
            ))}
          </ul>

          <p className="reveal mt-8 text-xs text-ink-soft">
            Parking and transit notes are general guidance for this block, not
            promises. Check live transit times before you travel.
          </p>
        </Reveal>
      </Section>

      {/* Contact */}
      <Section tone="studio">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="neon-rule w-10" aria-hidden />
                <Eyebrow tone="studio">Get in touch</Eyebrow>
              </div>
              <h2 className="reveal mt-4 font-display text-h2 font-black text-bone">
                Call, text, or send her a message.
              </h2>
              <p className="reveal measure mt-4 text-bone-dim">
                Booking is fastest online. For travel bookings, groups, the loc
                class, or anything that needs a conversation first, reach her
                directly.
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              <li className="reveal">
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center justify-between gap-4 rounded-card border border-copper/30 bg-studio-2 p-6 transition-colors hover:border-rose-lite"
                >
                  <span>
                    <span className="block text-eyebrow font-bold uppercase text-honey-lite">
                      Call or text
                    </span>
                    <span className="mt-1 block font-display text-h3 font-bold text-bone">
                      {BUSINESS.phone}
                    </span>
                  </span>
                  <Phone className="size-5 shrink-0 text-rose-lite" aria-hidden />
                </a>
              </li>
              <li className="reveal">
                <a
                  href={BUSINESS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-card border border-copper/30 bg-studio-2 p-6 transition-colors hover:border-rose-lite"
                >
                  <span>
                    <span className="block text-eyebrow font-bold uppercase text-honey-lite">
                      Instagram
                    </span>
                    <span className="mt-1 block font-display text-h3 font-bold text-bone">
                      {BUSINESS.social.instagramHandle}
                    </span>
                  </span>
                  <InstagramGlyph className="size-5 shrink-0 text-rose-lite" />
                </a>
              </li>
              <li className="reveal">
                <a
                  href={BUSINESS.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-card border border-copper/30 bg-studio-2 p-6 transition-colors hover:border-rose-lite"
                >
                  <span>
                    <span className="block text-eyebrow font-bold uppercase text-honey-lite">
                      Her live calendar
                    </span>
                    <span className="mt-1 block font-display text-h3 font-bold text-bone">
                      Book on Acuity
                    </span>
                  </span>
                  <ExternalLink className="size-5 shrink-0 text-rose-lite" aria-hidden />
                </a>
              </li>
            </ul>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
