import Link from "next/link";
import { Phone, MapPin, Clock, Star, ExternalLink } from "lucide-react";
import { Butterfly, Wordmark, InstagramGlyph } from "@/components/marks/Marks";
import { Button } from "@/components/ui";
import { BUSINESS, HER_WORDS } from "@/lib/business";

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Book",
    links: [
      { href: "/book", label: "Book an appointment" },
      { href: "/services", label: "Services and prices" },
      { href: "/portal", label: "Client portal" },
      { href: BUSINESS.bookingUrl, label: "Book on Acuity", external: true },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/gallery", label: "Gallery" },
      { href: "/loc-journey", label: "The loc journey" },
      { href: "/about", label: "About Latesha" },
      { href: "/faq", label: "Questions" },
    ],
  },
  {
    title: "Visit",
    links: [
      { href: "/visit", label: "Find the studio" },
      { href: "/policies", label: "Studio policies" },
      { href: BUSINESS.googleMapsUrl, label: "Open in Google Maps", external: true },
      { href: BUSINESS.social.instagram, label: "Instagram", external: true },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="studio grain relative overflow-hidden">
      {/* Oversized drifting mark. Decorative only. */}
      <Butterfly
        className="drift pointer-events-none absolute -right-16 -top-10 w-[26rem] text-rose-lite/[0.07] sm:-right-8"
        strokeWidth={0.8}
      />

      <div className="container-page relative py-section">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center gap-3">
              <Butterfly className="size-8 text-rose-lite" strokeWidth={2.2} />
              <Wordmark className="text-2xl text-bone" />
            </Link>

            <p className="measure mt-6 text-lead text-bone-dim">{HER_WORDS.chair}</p>

            <p className="mt-4 text-sm font-semibold tracking-tight text-bone-dim">
              — {BUSINESS.owner.name}, {BUSINESS.owner.role}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/book" variant="studio" size="lg">
                Book an appointment
              </Button>
              <Button
                href={BUSINESS.social.instagram}
                external
                variant="studio-ghost"
                size="lg"
              >
                <InstagramGlyph className="size-4" />
                {BUSINESS.social.instagramHandle}
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-eyebrow font-sans font-bold uppercase text-rose-lite">
                  {col.title}
                </h2>
                <ul className="mt-3 flex flex-col">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-bone-dim transition-colors hover:text-bone"
                        >
                          {l.label}
                          <ExternalLink className="size-3" aria-hidden />
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="inline-flex min-h-11 items-center text-sm text-bone-dim transition-colors hover:text-bone"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Contact block, doubling as the visible NAP that matches the schema. */}
        <div className="mt-16 grid gap-8 border-t border-copper/30 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterFact icon={<MapPin className="size-4" aria-hidden />} label="Studio">
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="not-italic transition-colors hover:text-bone"
            >
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.locality}, {BUSINESS.address.region}{" "}
              {BUSINESS.address.postalCode}
            </a>
          </FooterFact>

          <FooterFact icon={<Phone className="size-4" aria-hidden />} label="Call or text">
            <a href={BUSINESS.phoneHref} className="transition-colors hover:text-bone">
              {BUSINESS.phone}
            </a>
          </FooterFact>

          <FooterFact icon={<Clock className="size-4" aria-hidden />} label="Hours">
            7:30 AM – 7:00 PM
            <br />
            Seven days a week
          </FooterFact>

          <FooterFact icon={<Star className="size-4" aria-hidden />} label="Rated">
            <a
              href={BUSINESS.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bone"
            >
              {BUSINESS.rating.value} out of 5
              <br />
              {BUSINESS.rating.count} Google reviews
            </a>
          </FooterFact>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-copper/30 pt-8 text-xs text-bone-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {BUSINESS.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {BUSINESS.attributes.map((a) => (
              <li key={a} className="whitespace-nowrap">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterFact({
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
      <p className="flex items-center gap-2 text-eyebrow font-bold uppercase text-honey-lite">
        {icon}
        {label}
      </p>
      <address className="mt-3 text-sm not-italic leading-relaxed text-bone-dim">
        {children}
      </address>
    </div>
  );
}
