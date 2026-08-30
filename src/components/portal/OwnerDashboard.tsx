"use client";

import { useState } from "react";
import {
  TrendingUp,
  CalendarClock,
  Timer,
  Check,
  CircleAlert,
  Users,
  Phone,
} from "lucide-react";
import { Badge, Button, Eyebrow, cn } from "@/components/ui";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  getService,
  formatDuration,
  BUSINESS,
} from "@/lib/business";
import {
  db,
  stage,
  prettyDate,
  prettyDateShort,
  prettyTime,
  endTime,
  DEMO_TODAY,
} from "@/lib/db";

/**
 * The owner side. This is the half a generic booking widget does not give her:
 * what is booked, what it is worth, which services actually sell, who is coming
 * in, and the ability to confirm her own prices without calling anyone.
 */

export default function OwnerDashboard() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // See the note in ClientDashboard: `tick` drives the re-render, the reads are
  // cheap enough to run during it.
  void tick;
  const revenue = db.revenue();
  const upcoming = db.upcoming();
  const clients = db.clients();
  const mix = db.serviceMix();
  const maxMix = Math.max(1, ...mix.map((m) => m.count));

  return (
    <div className="flex flex-col gap-12">
      <header>
        <Eyebrow tone="studio">Owner dashboard</Eyebrow>
        <h1 className="mt-3 font-display text-h1 font-black text-bone">
          Your book, {BUSINESS.owner.knownAs}.
        </h1>
        <p className="mt-3 text-bone-dim">
          Week of {prettyDate(DEMO_TODAY)} &middot; {clients.length} clients on file
        </p>
      </header>

      {/* Numbers */}
      <section aria-label="This period" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<CalendarClock className="size-5" aria-hidden />}
          label="Booked ahead"
          value={`$${revenue.upcomingUsd}`}
          foot={`${revenue.upcomingCount} appointments`}
          accent
        />
        <Metric
          icon={<TrendingUp className="size-5" aria-hidden />}
          label="Completed"
          value={`$${revenue.completedUsd}`}
          foot={`${revenue.completedCount} appointments`}
        />
        <Metric
          icon={<Timer className="size-5" aria-hidden />}
          label="Chair hours"
          value={String(revenue.chairHours)}
          foot="Across every booking on file"
        />
        <Metric
          icon={<Users className="size-5" aria-hidden />}
          label="Average ticket"
          value={`$${Math.round(
            (revenue.completedUsd + revenue.upcomingUsd) /
              Math.max(1, revenue.completedCount + revenue.upcomingCount)
          )}`}
          foot="Booked and completed"
        />
      </section>

      {/* Schedule */}
      <section aria-labelledby="schedule-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="schedule-h" className="font-display text-h2 font-black text-bone">
            Coming up
          </h2>
          <p className="text-sm text-bone-dim">
            Open 7:30 AM &ndash; 7 PM, seven days
          </p>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-6 rounded-card border border-copper/30 bg-studio-2 p-8 text-bone-dim">
            Nothing booked. The chair is empty.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {upcoming.map((b) => {
              const svc = getService(b.serviceId);
              const client = db.client(b.clientId);
              if (!svc || !client) return null;
              return (
                // Grid rather than flex-wrap: on a phone the time, the service and
                // the actions each get a full row instead of being squeezed into
                // three narrow columns.
                <li
                  key={b.id}
                  className="grid gap-x-6 gap-y-3 rounded-card border border-copper/25 bg-studio-2 p-5 sm:grid-cols-[6rem_1fr_auto] sm:items-center"
                >
                  <p className="flex items-baseline gap-2 sm:block">
                    <span className="font-display text-lg font-bold tabular-nums text-bone">
                      {prettyTime(b.time)}
                    </span>
                    <span className="text-xs text-bone-dim">
                      to {endTime(b.time, b.minutes)}
                    </span>
                  </p>

                  <div className="min-w-0">
                    <p className="font-semibold text-bone">{svc.shortName}</p>
                    <p className="mt-0.5 text-sm text-bone-dim">
                      {client.name} &middot; {prettyDateShort(b.date)} &middot;{" "}
                      {formatDuration(b.minutes)}
                    </p>
                    {b.note ? (
                      <p className="mt-1.5 text-xs italic text-bone-dim">
                        &ldquo;{b.note}&rdquo;
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-copper/25 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                    <span className="font-display text-xl font-black tabular-nums text-honey-lite">
                      ${b.priceUsd}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        // TODO(backend): mark complete and trigger the follow-up.
                        db.completeBooking(b.id);
                        refresh();
                      }}
                      className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-pill border border-copper/50 px-4 text-sm font-semibold text-bone transition-colors hover:border-rose-lite hover:text-rose-lite"
                    >
                      <Check className="size-3.5" aria-hidden />
                      Done
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Service mix */}
      <section aria-labelledby="mix-h">
        <h2 id="mix-h" className="font-display text-h2 font-black text-bone">
          What actually gets booked
        </h2>
        <p className="mt-2 text-sm text-bone-dim">
          The services earning their place on the menu — and the ones that are not.
        </p>

        <ul className="mt-7 flex flex-col gap-3">
          {mix.map((m) => (
            <li key={m.serviceId} className="flex items-center gap-4">
              <span className="w-40 shrink-0 truncate text-sm font-semibold text-bone sm:w-56">
                {m.service.shortName}
              </span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-pill bg-studio-2">
                <span
                  className="block h-full rounded-pill bg-rose-lite"
                  style={{ width: `${Math.round((m.count / maxMix) * 100)}%` }}
                />
              </span>
              <span className="w-24 shrink-0 text-right text-sm tabular-nums text-bone-dim">
                {m.count} &times; ${m.service.priceUsd}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Clients */}
      <section aria-labelledby="clients-h">
        <h2 id="clients-h" className="font-display text-h2 font-black text-bone">
          Clients
        </h2>
        <p className="mt-2 text-sm text-bone-dim">
          The notes that matter — tender spots, combined locs, what they asked for
          last time.
        </p>

        <ul className="mt-7 grid gap-4 md:grid-cols-2">
          {clients.map((c) => {
            const theirs = db.bookingsFor(c.id);
            return (
              <li
                key={c.id}
                className="rounded-card border border-copper/25 bg-studio-2 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-honey-lite/12 font-display text-sm font-black text-honey-lite">
                      {c.avatarInitials}
                    </span>
                    <div>
                      <p className="font-semibold text-bone">{c.name}</p>
                      <p className="text-xs text-bone-dim">
                        Since {prettyDateShort(c.since)}
                      </p>
                    </div>
                  </div>
                  <Badge tone="studio">{stage(c.stage).name}</Badge>
                </div>

                <p className="mt-4 rounded-card bg-studio p-4 text-sm leading-relaxed text-bone-dim">
                  {c.notes}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-copper/25 pt-4 text-sm">
                  <span className="text-bone-dim">
                    {theirs.filter((b) => b.status === "completed").length} visits
                    &middot; {c.loyaltyVisits}/10 loyalty
                  </span>
                  <a
                    href={`tel:${c.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-honey-lite transition-colors hover:text-bone"
                  >
                    <Phone className="size-3.5" aria-hidden />
                    {c.phone}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Menu control */}
      <MenuControl tick={tick} onChange={refresh} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The thing that turns a placeholder into a decision she owns. Two services on
 * her live menu have genuine ambiguities; rather than the website silently
 * picking an answer, she confirms them here.
 */
function MenuControl({ tick, onChange }: { tick: number; onChange: () => void }) {
  const needsAttention = SERVICES.filter((s) => s.note);
  void tick;
  const confirmedCount = db.confirmedPriceCount();

  return (
    <section aria-labelledby="menu-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="menu-h" className="font-display text-h2 font-black text-bone">
            Menu and prices
          </h2>
          <p className="mt-2 text-sm text-bone-dim">
            {SERVICES.length} services live. {needsAttention.length} need a decision
            from you before launch.
          </p>
        </div>
        <Badge tone={confirmedCount ? "rose" : "studio"}>
          {confirmedCount} confirmed this session
        </Badge>
      </div>

      <ul className="mt-7 flex flex-col gap-4">
        {needsAttention.map((s) => {
          const confirmed = db.isPriceConfirmed(s.id);
          return (
            <li
              key={s.id}
              className={cn(
                "rounded-card border p-6 transition-colors",
                confirmed
                  ? "border-honey-lite/40 bg-honey-lite/[0.06]"
                  : "border-rose-lite/40 bg-studio-2"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-h3 font-bold text-bone">
                    {s.shortName}
                  </p>
                  <p className="mt-1 text-xs text-bone-dim">
                    Listed as &ldquo;{s.name}&rdquo; &middot; $
                    {s.priceUsd} &middot; {formatDuration(s.minutes)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // TODO(backend): persist the confirmation and publish it.
                    if (confirmed) db.unconfirmPrice(s.id);
                    else db.confirmPrice(s.id);
                    onChange();
                  }}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill px-5 text-sm font-bold transition-colors",
                    confirmed
                      ? "bg-honey-lite text-studio"
                      : "border border-rose-lite text-rose-lite hover:bg-rose-lite hover:text-studio"
                  )}
                >
                  {confirmed ? (
                    <>
                      <Check className="size-4" aria-hidden />
                      Confirmed
                    </>
                  ) : (
                    "Confirm this"
                  )}
                </button>
              </div>

              <p className="mt-4 flex gap-3 rounded-card bg-studio p-4 text-sm leading-relaxed text-bone-dim">
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose-lite" aria-hidden />
                {s.note}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Category summary */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SERVICE_CATEGORIES.map((cat) => {
          const items = SERVICES.filter((s) => s.category === cat.id);
          const avg = Math.round(
            items.reduce((n, s) => n + s.priceUsd, 0) / items.length
          );
          return (
            <li
              key={cat.id}
              className="rounded-card border border-copper/25 bg-studio-2 p-5"
            >
              <p className="text-eyebrow font-bold uppercase text-honey-lite">
                {cat.name}
              </p>
              <p className="mt-2 font-display text-h3 font-black text-bone">
                {items.length}
              </p>
              <p className="mt-1 text-xs text-bone-dim">avg ${avg}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/services" variant="studio">
          See the public menu
        </Button>
        <Button href={BUSINESS.bookingUrl} external variant="studio-ghost">
          Open Acuity
        </Button>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  foot,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  foot: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-card border p-6",
        accent ? "border-rose-lite/40 bg-studio-2" : "border-copper/25 bg-studio-2"
      )}
    >
      <p className="flex items-center gap-2 text-eyebrow font-bold uppercase text-honey-lite">
        {icon}
        {label}
      </p>
      <p className="mt-3 font-display text-h2 font-black tabular-nums text-bone">
        {value}
      </p>
      <p className="mt-1 text-xs text-bone-dim">{foot}</p>
    </div>
  );
}
