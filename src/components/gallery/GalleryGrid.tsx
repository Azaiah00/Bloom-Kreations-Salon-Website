"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, cn } from "@/components/ui";
import { GALLERY, GALLERY_TAGS, type GalleryTag } from "@/lib/gallery";
import { getService, formatDuration } from "@/lib/business";

/**
 * Filterable masonry of her work. Every tile links to the service that produced
 * it, so browsing the gallery is a path into the booker rather than a dead end.
 */

export default function GalleryGrid() {
  const [tag, setTag] = useState<GalleryTag | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const shots = useMemo(
    () => (tag === "all" ? GALLERY : GALLERY.filter((s) => s.tag === tag)),
    [tag]
  );

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of GALLERY) m.set(s.tag, (m.get(s.tag) ?? 0) + 1);
    m.set("all", GALLERY.length);
    return m;
  }, []);

  const open = openIndex === null ? null : shots[openIndex];

  return (
    <>
      <div className="container-page">
        <div
          role="group"
          aria-label="Filter the gallery"
          className="flex flex-wrap gap-2"
        >
          {GALLERY_TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTag(t.id);
                setOpenIndex(null);
              }}
              aria-pressed={tag === t.id}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold transition-colors",
                tag === t.id
                  ? "bg-ink text-cream"
                  : "border border-sand text-ink-soft hover:border-ink hover:text-ink"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "text-xs tabular-nums",
                  tag === t.id ? "text-cream/70" : "text-honey"
                )}
              >
                {counts.get(t.id) ?? 0}
              </span>
            </button>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {shots.map((shot, i) => {
            const svc = shot.serviceId ? getService(shot.serviceId) : undefined;
            return (
              <li key={shot.slug}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-media bg-shell"
                  aria-label={`Open larger view: ${shot.alt}`}
                >
                  <span
                    className={cn(
                      "relative block",
                      shot.ratio === "square" ? "aspect-square" : "aspect-[3/4]"
                    )}
                  >
                    <Image
                      src={`/gallery/${shot.slug}.webp`}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
                      className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    />
                  </span>

                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-studio/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {svc ? (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="block text-eyebrow font-bold uppercase text-rose-lite">
                        {svc.shortName}
                      </span>
                      <span className="mt-0.5 block font-display text-lg font-bold text-bone">
                        ${svc.priceUsd}
                      </span>
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {open ? (
        <Lightbox
          shot={open}
          index={openIndex!}
          total={shots.length}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i! - 1 + shots.length) % shots.length)}
          onNext={() => setOpenIndex((i) => (i! + 1) % shots.length)}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  shot,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  shot: (typeof GALLERY)[number];
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const svc = shot.serviceId ? getService(shot.serviceId) : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-studio/95 p-4 backdrop-blur-sm"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onPrev();
        if (e.key === "ArrowRight") onNext();
      }}
      tabIndex={-1}
      ref={(el) => el?.focus()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 cursor-default"
      />

      <div className="relative flex max-h-full w-full max-w-5xl flex-col gap-5 lg:flex-row lg:items-center">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md shrink-0 overflow-hidden rounded-sheet bg-studio-2 lg:max-w-lg">
          <Image
            src={`/gallery/${shot.slug}.webp`}
            alt={shot.alt}
            fill
            sizes="(min-width: 1024px) 32rem, 90vw"
            className="object-cover"
          />
        </div>

        <div className="relative min-w-0 flex-1 text-bone">
          <p className="text-eyebrow font-bold uppercase text-rose-lite">
            {index + 1} of {total}
          </p>
          <p className="mt-3 font-display text-h3 font-bold leading-snug">{shot.alt}</p>

          {svc ? (
            <div className="mt-6 rounded-card border border-copper/40 bg-studio-2 p-5">
              <p className="text-eyebrow font-bold uppercase text-honey-lite">
                The service behind it
              </p>
              <p className="mt-2 font-display text-h3 font-bold text-bone">
                {svc.shortName}
              </p>
              <p className="mt-1 text-sm text-bone-dim">
                ${svc.priceUsd} &middot; {formatDuration(svc.minutes)}
              </p>
              <Button href={`/book?service=${svc.id}`} variant="studio" className="mt-5">
                Book this
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          ) : null}

          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous photo"
              className="inline-flex size-11 items-center justify-center rounded-pill border border-copper/50 text-bone transition-colors hover:border-rose-lite hover:text-rose-lite"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next photo"
              className="inline-flex size-11 items-center justify-center rounded-pill border border-copper/50 text-bone transition-colors hover:border-rose-lite hover:text-rose-lite"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-sm font-semibold text-bone-dim transition-colors hover:text-bone"
            >
              <X className="size-4" aria-hidden />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
