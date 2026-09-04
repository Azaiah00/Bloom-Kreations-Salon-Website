import type { Metadata } from "next";
import Image from "next/image";
import { Camera } from "lucide-react";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import JsonLd from "@/components/site/JsonLd";
import Reveal from "@/components/motion/Reveal";
import { InstagramGlyph } from "@/components/marks/Marks";
import { Button, Eyebrow, Section } from "@/components/ui";
import { BUSINESS, HER_WORDS } from "@/lib/business";
import { GALLERY, LIFESTYLE } from "@/lib/gallery";
import { breadcrumbSchema, SITE } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Real loc work by Latesha Reed at Bloom Kreations in Chicago — retwists, starter locs, two-strand twists, colour, invisible and butterfly locs. Filter by service and book the look.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Gallery", path: "/gallery" }]),
          {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Bloom Kreations — loc work",
            about: "Loc styling, retwists and protective styles in Chicago",
            image: GALLERY.map((s) => ({
              "@type": "ImageObject",
              contentUrl: `${SITE}/gallery/${s.slug}.webp`,
              caption: s.alt,
            })),
          },
        ]}
      />

      <section className="py-section pb-14">
        <div className="container-page">
          <Eyebrow>The work</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-h1 font-black text-ink">
            {HER_WORDS.filtered}
          </h1>
          <p className="measure mt-5 text-lead text-ink-soft">
            Her words. Every photograph on this page is her own work on a real
            client — no stock, no reference boards. Filter by what you want, then
            book the service that made it.
          </p>

          <p className="mt-7 inline-flex items-center gap-2 rounded-pill border border-sand px-4 py-2 text-sm text-ink-soft">
            <Camera className="size-4 text-honey" aria-hidden />
            {GALLERY.length} sets &middot; pulled from{" "}
            <a
              href={BUSINESS.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-honey underline decoration-sand underline-offset-2"
            >
              <InstagramGlyph className="size-3.5" />
              {BUSINESS.social.instagramHandle}
            </a>
          </p>
        </div>
      </section>

      <div className="pb-section">
        <GalleryGrid />
      </div>

      {/* Out in the world */}
      <Section tone="studio">
        <Reveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="neon-rule w-10" aria-hidden />
              <Eyebrow tone="studio">Out in the world</Eyebrow>
            </div>
            <h2 className="reveal mt-4 font-display text-h2 font-black text-bone">
              What it looks like a week later.
            </h2>
            <p className="reveal measure mt-4 text-bone-dim">
              Salon lighting flatters everything. These are her clients on their
              own time, in their own photographs — which is the harder test and
              the one that matters.
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {LIFESTYLE.map((s) => (
              <li key={s.slug} className="reveal">
                <figure className="relative aspect-[3/4] overflow-hidden rounded-media bg-studio-2">
                  <Image
                    src={`/gallery/${s.slug}.webp`}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 19vw, 48vw"
                    className="object-cover"
                  />
                </figure>
              </li>
            ))}
          </ul>

          <div className="reveal mt-12 flex flex-wrap gap-3">
            <Button href="/book" variant="studio" size="lg">
              Book the look
            </Button>
            <Button
              href={BUSINESS.social.instagram}
              external
              variant="studio-ghost"
              size="lg"
            >
              <InstagramGlyph className="size-4" />
              See more on Instagram
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
