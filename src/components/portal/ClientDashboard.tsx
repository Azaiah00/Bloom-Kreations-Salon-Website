"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  RotateCcw,
  Sparkles,
  Camera,
  ImagePlus,
  X,
} from "lucide-react";
import { LocCoil } from "@/components/marks/Marks";
import { Badge, Button, Eyebrow, cn } from "@/components/ui";
import { BUSINESS, getService, formatDuration } from "@/lib/business";
import {
  db,
  stage,
  LOC_STAGES,
  prettyDate,
  prettyDateShort,
  prettyTime,
  endTime,
  type Booking,
} from "@/lib/db";

const CLIENT_ID = "c-demo";
const LOYALTY_TARGET = 10;

export default function ClientDashboard() {
  // Snapshot the in-memory store once per interaction so the demo re-renders
  // after a cancel or a rebook. TODO(backend): swap for a real query hook.
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // `tick` is what re-renders after a mutation; the reads themselves are cheap
  // array filters over a handful of rows, so they run during render rather than
  // being memoised against a counter they do not actually depend on.
  void tick;
  const client = db.client(CLIENT_ID)!;
  const bookings = db.bookingsFor(CLIENT_ID);
  const journey = db.journeyFor(CLIENT_ID);

  const upcoming = bookings
    .filter((b) => b.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = bookings.filter((b) => b.status === "completed");
  const next = upcoming[0];
  const spent = past.reduce((n, b) => n + b.priceUsd, 0);
  const current = stage(client.stage);

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header>
        <Eyebrow tone="studio">Welcome back</Eyebrow>
        <h1 className="mt-3 font-display text-h1 font-black text-bone">
          {client.name.split(" ")[0]}.
        </h1>
        <p className="mt-3 text-bone-dim">
          Client since {prettyDateShort(client.since)} &middot; {past.length} visits
          &middot; {current.name} stage
        </p>
      </header>

      {/* Next appointment */}
      <section aria-labelledby="next-appt">
        <h2 id="next-appt" className="text-eyebrow font-bold uppercase text-honey-lite">
          Your next appointment
        </h2>

        {next ? (
          <NextCard booking={next} onChanged={refresh} />
        ) : (
          <div className="mt-4 rounded-sheet border border-copper/30 bg-studio-2 p-8">
            <p className="font-display text-h3 font-bold text-bone">
              Nothing booked yet.
            </p>
            <p className="mt-2 text-sm text-bone-dim">
              Four to six weeks is the sweet spot between retwists.
            </p>
            <Button href="/book" variant="studio" className="mt-6">
              Book an appointment
            </Button>
          </div>
        )}
      </section>

      {/* Stats */}
      <section aria-label="Your numbers" className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Visits" value={String(past.length)} />
        <StatCard label="Spent with Bloom" value={`$${spent}`} />
        <StatCard
          label="Loyalty"
          value={`${client.loyaltyVisits}/${LOYALTY_TARGET}`}
          foot={
            client.loyaltyVisits >= LOYALTY_TARGET
              ? "Free touch-up unlocked"
              : `${LOYALTY_TARGET - client.loyaltyVisits} to a free touch-up`
          }
          progress={client.loyaltyVisits / LOYALTY_TARGET}
        />
      </section>

      {/* Loc journey */}
      <section aria-labelledby="journey-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="journey-h" className="font-display text-h2 font-black text-bone">
              Your loc journey
            </h2>
            <p className="mt-2 text-sm text-bone-dim">
              Every visit, photographed. This is the record no other salon keeps
              for you.
            </p>
          </div>
          <Button href="/loc-journey" variant="studio-ghost">
            What stage am I in?
          </Button>
        </div>

        <StageRail current={client.stage} />

        <JourneyTimeline entries={journey} onAdd={refresh} />
      </section>

      {/* History */}
      <section aria-labelledby="history-h">
        <h2 id="history-h" className="font-display text-h2 font-black text-bone">
          Everything so far
        </h2>

        <ul className="mt-6 flex flex-col gap-3">
          {bookings.map((b) => {
            const svc = getService(b.serviceId);
            if (!svc) return null;
            return (
              // Grid, not flex-wrap — on a phone the price, status and rebook
              // control get their own row instead of stacking into a column
              // barely wider than the button.
              <li
                key={b.id}
                className="grid gap-3 rounded-card border border-copper/25 bg-studio-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-bone">
                    {svc.shortName}
                  </p>
                  <p className="mt-0.5 text-sm text-bone-dim">
                    {prettyDateShort(b.date)} &middot; {prettyTime(b.time)}
                  </p>
                  {b.note ? (
                    <p className="mt-2 text-xs italic text-bone-dim">
                      &ldquo;{b.note}&rdquo;
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-4 border-t border-copper/25 pt-3 sm:border-0 sm:pt-0">
                  <span className="font-display text-lg font-bold tabular-nums text-honey-lite">
                    ${b.priceUsd}
                  </span>
                  <StatusPill status={b.status} />
                  {b.status === "completed" ? (
                    <Link
                      href={`/book?service=${b.serviceId}`}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-pill border border-copper/50 px-4 text-sm font-semibold text-bone transition-colors hover:border-rose-lite hover:text-rose-lite"
                    >
                      <RotateCcw className="size-3.5" aria-hidden />
                      Rebook
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function NextCard({ booking, onChanged }: { booking: Booking; onChanged: () => void }) {
  const svc = getService(booking.serviceId);
  if (!svc) return null;

  return (
    <article className="mt-4 rounded-sheet border border-rose-lite/40 bg-studio-2 p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <Badge tone="rose">Confirmed</Badge>
          <h3 className="mt-4 font-display text-h2 font-black text-bone">
            {svc.shortName}
          </h3>

          <dl className="mt-6 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3 text-bone-dim">
              <CalendarDays className="size-4 shrink-0 text-honey-lite" aria-hidden />
              <span className="font-semibold text-bone">
                {prettyDate(booking.date)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-bone-dim">
              <Clock className="size-4 shrink-0 text-honey-lite" aria-hidden />
              <span>
                {prettyTime(booking.time)} &ndash;{" "}
                {endTime(booking.time, booking.minutes)} (
                {formatDuration(booking.minutes)})
              </span>
            </div>
            <div className="flex items-center gap-3 text-bone-dim">
              <MapPin className="size-4 shrink-0 text-honey-lite" aria-hidden />
              <span>
                {BUSINESS.address.street}, {BUSINESS.address.locality}
              </span>
            </div>
          </dl>

          {booking.note ? (
            <p className="mt-5 rounded-card bg-studio p-4 text-sm italic text-bone-dim">
              Your note: &ldquo;{booking.note}&rdquo;
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="text-eyebrow font-bold uppercase text-honey-lite">
            Due in studio
          </p>
          <p className="mt-1 font-display text-5xl font-black tabular-nums text-bone">
            ${booking.priceUsd}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-copper/30 pt-6">
        <Button href={BUSINESS.googleMapsUrl} external variant="studio">
          Directions
        </Button>
        <Button href={BUSINESS.phoneHref} variant="studio-ghost">
          Call the studio
        </Button>
        <button
          type="button"
          onClick={() => {
            // TODO(backend): honour the real cancellation window and notify her.
            db.cancelBooking(booking.id);
            onChanged();
          }}
          className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-pill px-4 text-sm font-semibold text-bone-dim transition-colors hover:text-rose-lite"
        >
          <X className="size-4" aria-hidden />
          Cancel
        </button>
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  foot,
  progress,
}: {
  label: string;
  value: string;
  foot?: string;
  progress?: number;
}) {
  return (
    <div className="rounded-card border border-copper/25 bg-studio-2 p-6">
      <p className="text-eyebrow font-bold uppercase text-honey-lite">{label}</p>
      <p className="mt-2 font-display text-h2 font-black tabular-nums text-bone">
        {value}
      </p>
      {progress !== undefined ? (
        <span className="mt-3 block h-1.5 overflow-hidden rounded-pill bg-studio">
          <span
            className="block h-full rounded-pill bg-rose-lite"
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </span>
      ) : null}
      {foot ? <p className="mt-2 text-xs text-bone-dim">{foot}</p> : null}
    </div>
  );
}

function StageRail({ current }: { current: string }) {
  const idx = LOC_STAGES.findIndex((s) => s.id === current);
  return (
    <ol className="mt-8 grid gap-3 sm:grid-cols-4">
      {LOC_STAGES.map((s, i) => {
        const active = i === idx;
        // Stages already passed get the honey rule; the current one gets the
        // neon border. Differentiated by colour rather than by opacity, because
        // fading an already-dim tone drops it below AA.
        const done = i < idx;
        return (
          <li
            key={s.id}
            className={cn(
              "rounded-card border p-5 transition-colors",
              active
                ? "border-rose-lite/50 bg-studio-2"
                : done
                  ? "border-honey-lite/30 bg-studio-2/50"
                  : "border-copper/25 bg-studio-2/50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={cn(
                    "font-display text-h3 font-bold",
                    active ? "text-bone" : "text-bone-dim"
                  )}
                >
                  {s.name}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-widest text-honey-lite">
                  {s.window}
                </p>
              </div>
              <LocCoil
                className={cn(
                  "h-10 w-3 shrink-0",
                  active ? "text-rose-lite" : "text-copper/50"
                )}
                strokeWidth={2.4}
              />
            </div>
            {active ? (
              <p className="mt-3 text-xs leading-relaxed text-bone-dim">
                You are here. {s.watchOut}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function JourneyTimeline({
  entries,
  onAdd,
}: {
  entries: ReturnType<typeof db.journeyFor>;
  onAdd: () => void;
}) {
  return (
    <ol className="mt-10 flex flex-col gap-6">
      {entries.map((e) => (
        <li key={e.id} className="grid gap-5 sm:grid-cols-[8rem_1fr] sm:gap-7">
          <figure className="relative aspect-square overflow-hidden rounded-card bg-studio-2">
            {e.shot ? (
              <Image
                src={`/gallery/${e.shot}.webp`}
                alt={`${e.title} — ${prettyDateShort(e.date)}`}
                fill
                sizes="8rem"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-bone-dim">
                <Camera className="size-6" aria-hidden />
              </span>
            )}
          </figure>

          <div className="border-l border-copper/30 pl-6">
            <p className="text-eyebrow font-bold uppercase text-honey-lite">
              {prettyDateShort(e.date)} &middot; {stage(e.stage).name}
            </p>
            <h3 className="mt-2 font-display text-h3 font-bold text-bone">
              {e.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-bone-dim">{e.body}</p>
          </div>
        </li>
      ))}

      <li>
        <button
          type="button"
          onClick={() => {
            // TODO(backend): open a real uploader and store the photo.
            db.addJourneyEntry({
              clientId: CLIENT_ID,
              date: new Date().toISOString().slice(0, 10),
              stage: "teen",
              title: "New entry",
              body: "In the real product this is where your photo from today would go.",
            });
            onAdd();
          }}
          className="flex w-full items-center justify-center gap-3 rounded-card border-2 border-dashed border-copper/40 p-8 text-sm font-semibold text-bone-dim transition-colors hover:border-rose-lite hover:text-rose-lite"
        >
          <ImagePlus className="size-5" aria-hidden />
          Add today&rsquo;s photo to your journey
        </button>
      </li>
    </ol>
  );
}

function StatusPill({ status }: { status: Booking["status"] }) {
  const map = {
    upcoming: { label: "Upcoming", cls: "bg-rose-lite/15 text-rose-lite" },
    completed: { label: "Done", cls: "bg-honey-lite/12 text-honey-lite" },
    cancelled: { label: "Cancelled", cls: "bg-bone/10 text-bone-dim" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold",
        s.cls
      )}
    >
      {status === "upcoming" ? <Sparkles className="size-3" aria-hidden /> : null}
      {s.label}
    </span>
  );
}
