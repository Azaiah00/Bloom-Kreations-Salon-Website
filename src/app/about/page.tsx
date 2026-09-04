import type { Metadata } from "next";
import Image from "next/image";
import { Quote, Plane, Users, GraduationCap, Heart } from "lucide-react";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/motion/Reveal";
import { Butterfly, InstagramGlyph } from "@/components/marks/Marks";
import { Badge, Button, Eyebrow, Section, Stars } from "@/components/ui";
import { BUSINESS, HER_WORDS, REVIEWS } from "@/lib/business";
import { breadcrumbSchema, BUSINESS_SCHEMA_ID } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Latesha Reed",
  description:
    "Latesha Reed — known as Pookie — is the owner and loctician behind Bloom Kreations in Bridgeport, Chicago. Locs, protective styles, colour and teaching, rated 4.8 from 60 Google reviews.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    icon: <Users className="size-5" aria-hidden />,
    title: "Everybody's hair",
    body: "Men, women and children sit in that chair. Her reviews come from mothers booking alongside their sons, from clients in their fifties, and from people who found her the week they moved to Chicago.",
  },
  {
    icon: <Plane className="size-5" aria-hidden />,
    title: "She travels",
    body: "Traveling loctician is in her own bio, not ours. Weddings, shoots, events and groups — she will come to you, and almost nobody else in this city offers it.",
  },
  {
    icon: <GraduationCap className="size-5" aria-hidden />,
    title: "She teaches",
    body: "The Loc Class is a full day, one to one, $650. Parting, retwisting, maintenance — whether that is for your own head or because you want your own chair one day.",
  },
  {
    icon: <Heart className="size-5" aria-hidden />,
    title: "No tension at the root",
    body: "It comes up over and over in her reviews: no tenderness from pulling or tightening. A retwist that hurts is a retwist that costs you hair, and she works accordingly.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "About", path: "/about" }]),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: BUSINESS.owner.name,
              alternateName: BUSINESS.owner.knownAs,
              jobTitle: BUSINESS.owner.role,
              worksFor: { "@id": BUSINESS_SCHEMA_ID },
              sameAs: [
                BUSINESS.social.instagram,
                BUSINESS.social.instagramPersonal,
              ],
            },
          },
        ]}
      />

      {/* Hero */}
      <section className="py-section pb-14">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div>
              <Eyebrow>Meet your loctician</Eyebrow>
              <h1 className="mt-4 font-display text-h1 font-black text-ink">
                Latesha Reed.
                <span className="block italic text-rose">Everybody calls her Pookie.</span>
              </h1>

              <p className="measure mt-7 text-lead text-ink-soft">
                She runs Bloom Kreations out of a studio on West 38th Place in
                Bridgeport, seven days a week, from half past seven in the
                morning. Starter sets, retwists, colour, protective styles,
                extensions, and a full-day class for anyone who wants to learn to
                do it themselves.
              </p>

              <p className="measure mt-5 text-ink-soft">
                What her clients keep writing about is not the styles — it is the
                consistency. People who have been in her chair for two, three,
                four years. People who moved cities and made finding her the first
                thing they sorted out.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Badge>{BUSINESS.rating.value} on Google</Badge>
                <Badge>{BUSINESS.rating.count} reviews</Badge>
                {BUSINESS.attributes.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/book" size="lg">
                  Book with Latesha
                </Button>
                <Button
                  href={BUSINESS.social.instagramPersonal}
                  external
                  variant="ghost"
                  size="lg"
                >
                  <InstagramGlyph className="size-4" />
                  {BUSINESS.social.instagramPersonalHandle}
                </Button>
              </div>
            </div>

            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sheet bg-shell shadow-[var(--shadow-lift)]">
                <Image
                  src="/brand/latesha-portrait.webp"
                  alt="Portrait of Latesha Reed, owner and loctician at Bloom Kreations in Chicago"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
              </div>
              <Butterfly
                px={96}
                animate="weave"
                className="absolute -bottom-6 -left-6 w-24 text-rose"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Her words */}
      <Section tone="studio">
        <Reveal>
          <figure className="mx-auto max-w-4xl text-center">
            <Quote className="reveal mx-auto size-10 text-rose-lite" aria-hidden />
            <blockquote className="reveal mt-7 font-display text-h2 font-black leading-tight text-bone">
              &ldquo;{HER_WORDS.chair}&rdquo;
            </blockquote>
            <figcaption className="reveal mt-8 text-sm text-bone-dim">
              <span className="font-semibold text-bone">{BUSINESS.owner.name}</span>
              {" — "}
              in her own words, on{" "}
              <a
                href={BUSINESS.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-copper underline-offset-4 transition-colors hover:text-bone"
              >
                {BUSINESS.social.instagramHandle}
              </a>
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* Pillars */}
      <Section>
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow className="reveal">What that means in the chair</Eyebrow>
            <h2 className="reveal mt-4 font-display text-h2 font-black text-ink">
              Four things worth knowing before you book.
            </h2>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {PILLARS.map((p) => (
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
                <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Reviews */}
      <Section tone="shell">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow className="reveal">In their words</Eyebrow>
            <h2 className="reveal mt-4 font-display text-h2 font-black text-ink">
              Seven of the sixty.
            </h2>
            <p className="reveal measure mt-4 text-ink-soft">
              Real Google reviews, quoted and attributed. Nothing on this site was
              written by us and put in a client&rsquo;s mouth.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <li
                key={r.author}
                className="reveal flex flex-col rounded-card bg-cream p-7 ring-1 ring-sand"
              >
                <Stars value={r.rating} />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink">
                  {r.quote}
                </blockquote>
                <footer className="mt-6 border-t border-sand pt-4">
                  <cite className="block text-sm font-bold not-italic text-ink">
                    {r.author}
                  </cite>
                  <span className="text-xs text-ink-soft">
                    Google review &middot; {r.when}
                    {r.excerpt ? " · excerpt" : ""}
                  </span>
                </footer>
              </li>
            ))}
          </ul>

          <div className="reveal mt-12">
            <Button href={BUSINESS.googleReviewsUrl} external variant="ghost" size="lg">
              Read all {BUSINESS.rating.count} on Google
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
