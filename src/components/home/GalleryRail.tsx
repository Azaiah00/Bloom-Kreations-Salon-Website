"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveHorizontal } from "lucide-react";
import { useHorizontalGallery } from "@/components/motion/hooks";
import { Eyebrow, Button } from "@/components/ui";
import { GALLERY } from "@/lib/gallery";
import { getService } from "@/lib/business";

/**
 * Vertical scroll drives a sideways track of her work, and each tile swells as
 * it crosses the middle of the viewport. Below `md` it is a native horizontal
 * swipe with scroll-snap — the right interaction on a phone, and no pinning.
 */

const RAIL = GALLERY.slice(0, 12);

export default function GalleryRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useHorizontalGallery(section, track);

  return (
    <section
      ref={section}
      aria-labelledby="gallery-rail-title"
      className="studio grain relative overflow-hidden rail:h-screen"
    >
      <div className="flex h-full flex-col justify-center py-section rail:py-0 rail:pb-8 rail:pt-[calc(4.5rem+1.5rem)]">
        <div className="container-page shrink-0">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="neon-rule w-10" aria-hidden />
                <Eyebrow tone="studio">The work</Eyebrow>
              </div>
              <h2
                id="gallery-rail-title"
                className="mt-4 font-display text-h2 font-black text-bone"
              >
                Retwist so clean it look{" "}
                <span className="italic text-rose-lite text-glow">filtered</span>.
              </h2>
              <p className="measure mt-4 text-bone-dim">
                Her words, and her clients&rsquo;. Every photograph below is her own
                work on a real head of hair, straight from her studio.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <p className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bone-dim md:flex">
                <MoveHorizontal className="size-4" aria-hidden />
                Scroll to move
              </p>
              <Button href="/gallery" variant="studio-ghost">
                Full gallery
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 rail:mt-8">
          <div
            ref={track}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--spacing-gutter)] pb-4 rail:w-max rail:snap-none rail:gap-6 rail:overflow-visible rail:pb-0"
          >
            {RAIL.map((shot, i) => {
              const svc = shot.serviceId ? getService(shot.serviceId) : undefined;
              return (
                <figure
                  key={shot.slug}
                  data-gallery-tile
                  className="group relative w-[72vw] shrink-0 snap-center sm:w-[48vw] rail:w-[21rem] rail-xl:w-[23rem]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sheet bg-studio-2">
                    <Image
                      src={`/gallery/${shot.slug}.webp`}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1280px) 23rem, (min-width: 768px) 21rem, (min-width: 640px) 48vw, 72vw"
                      loading={i < 3 ? "eager" : "lazy"}
                      className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-studio via-studio/60 to-transparent"
                    />
                  </div>

                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
                    {svc ? (
                      <>
                        <p className="text-eyebrow font-bold uppercase text-rose-lite">
                          {svc.shortName}
                        </p>
                        <p className="mt-1 font-display text-lg font-bold text-bone">
                          ${svc.priceUsd}
                        </p>
                      </>
                    ) : null}
                  </figcaption>

                  {svc ? (
                    <Link
                      href={`/book?service=${svc.id}`}
                      className="absolute inset-0 rounded-sheet"
                    >
                      <span className="sr-only">Book {svc.name}</span>
                    </Link>
                  ) : null}
                </figure>
              );
            })}

            <div className="flex w-[72vw] shrink-0 snap-center items-center sm:w-[48vw] rail:w-[21rem]">
              <div className="w-full rounded-sheet border border-rose-lite/40 bg-studio-2 p-8">
                <p className="font-display text-h3 font-black text-bone">
                  Eighteen more sets in the gallery.
                </p>
                <p className="mt-3 text-sm text-bone-dim">
                  Filter by retwists, starter locs, colour, protective styles or
                  kids — every shot links to the service that made it.
                </p>
                <Button href="/gallery" variant="studio" className="mt-6">
                  Open the gallery
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
