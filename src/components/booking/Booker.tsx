"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Clock,
  Search,
  CalendarDays,
  ExternalLink,
  Info,
  PartyPopper,
  User,
} from "lucide-react";
import { Butterfly } from "@/components/marks/Marks";
import { Badge, Button, Eyebrow, PriceTag, cn } from "@/components/ui";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  BUSINESS,
  formatDuration,
  type Service,
} from "@/lib/business";
import {
  db,
  slotsFor,
  bookableDays,
  prettyDate,
  prettyTime,
  endTime,
} from "@/lib/db";

/**
 * Five steps, and the running total is visible on every one of them.
 *
 * The whole point of beating a generic booking widget is that nobody should ever
 * have to guess what an appointment will cost or how long it will take. The
 * summary rail is pinned on desktop and a sticky bar on mobile, and it is
 * populated from the first tap.
 *
 * Demo mode: the confirmation writes to the in-memory store in `lib/db.ts`. The
 * live Acuity link is offered at every step so a real client is never stuck.
 */

const STEPS = ["Service", "Date", "Time", "Details", "Confirm"] as const;
type StepIndex = 0 | 1 | 2 | 3 | 4;

interface Details {
  name: string;
  email: string;
  phone: string;
  note: string;
  firstTime: boolean;
}

const EMPTY: Details = {
  name: "",
  email: "",
  phone: "",
  note: "",
  firstTime: false,
};

export default function Booker() {
  const params = useSearchParams();
  const raw = params.get("service");
  // A deep link from a service card, a gallery tile or the loc-journey page
  // lands the user on step two with their choice already made. An unknown id is
  // ignored rather than trusted.
  const preselect =
    raw && SERVICES.some((s) => s.id === raw) ? raw : null;

  const [step, setStep] = useState<StepIndex>(preselect ? 1 : 0);
  const [serviceId, setServiceId] = useState<string | null>(preselect);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  // Clicking a different service link while already on /book does not remount,
  // so the param change is reconciled during render rather than in an effect.
  const [lastPreselect, setLastPreselect] = useState(preselect);
  if (preselect !== lastPreselect) {
    setLastPreselect(preselect);
    if (preselect) {
      setServiceId(preselect);
      setDate(null);
      setTime(null);
      setConfirmedId(null);
      setStep(1);
    }
  }

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? null,
    [serviceId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => {
      const inCat = category === "all" || s.category === category;
      const inQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.blurb.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [query, category]);

  const slots = useMemo(
    () => (date && serviceId ? slotsFor(date, serviceId) : []),
    [date, serviceId]
  );

  const days = useMemo(() => bookableDays(), []);

  const canAdvance =
    (step === 0 && !!serviceId) ||
    (step === 1 && !!date) ||
    (step === 2 && !!time) ||
    (step === 3 && details.name.trim().length > 1 && details.phone.trim().length > 6);

  function go(next: StepIndex) {
    setStep(next);
    // Bring the reader back to the top of the flow, not the top of the document.
    document.getElementById("booker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function confirm() {
    if (!serviceId || !date || !time) return;
    // TODO(backend): POST to the real booking API, take a deposit, send a
    // confirmation SMS. In demo mode this writes to the in-memory store.
    const booking = db.createBooking({
      clientId: "c-demo",
      serviceId,
      date,
      time,
      note: details.note || undefined,
    });
    setConfirmedId(booking.id);
    go(4);
  }

  /* --------------------------------------------------------------------- */

  if (step === 4 && confirmedId && service && date && time) {
    return (
      <Confirmed
        service={service}
        date={date}
        time={time}
        details={details}
        onRestart={() => {
          setStep(0);
          setServiceId(null);
          setDate(null);
          setTime(null);
          setDetails(EMPTY);
          setConfirmedId(null);
        }}
      />
    );
  }

  return (
    <div id="booker" className="container-page grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
      <div className="min-w-0">
        <Stepper step={step} onJump={(i) => i < step && go(i as StepIndex)} />

        <div className="mt-10">
          {step === 0 ? (
            <StepService
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
              services={filtered}
              selected={serviceId}
              onSelect={(id) => {
                setServiceId(id);
                setTime(null);
                go(1);
              }}
            />
          ) : null}

          {step === 1 && service ? (
            <StepDate
              days={days}
              service={service}
              selected={date}
              onSelect={(iso) => {
                setDate(iso);
                setTime(null);
                go(2);
              }}
            />
          ) : null}

          {step === 2 && service && date ? (
            <StepTime
              slots={slots}
              service={service}
              date={date}
              selected={time}
              onSelect={(t) => {
                setTime(t);
                go(3);
              }}
            />
          ) : null}

          {step === 3 && service ? (
            <StepDetails details={details} setDetails={setDetails} service={service} />
          ) : null}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-sand pt-8">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => go((step - 1) as StepIndex)}>
              <ChevronLeft className="size-4" aria-hidden />
              Back
            </Button>
          ) : null}

          {step === 3 ? (
            <Button onClick={confirm} disabled={!canAdvance} size="lg">
              Confirm appointment
            </Button>
          ) : null}

          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-honey underline decoration-sand underline-offset-4 transition-colors hover:text-ink"
          >
            Book on Acuity instead
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>

      <Summary
        service={service}
        date={date}
        time={time}
        step={step}
        canAdvance={canAdvance}
        onConfirm={confirm}
      />
    </div>
  );
}

/* ========================================================================== */
/* Stepper                                                                     */
/* ========================================================================== */

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors",
                active && "bg-rose text-cream",
                done && "text-honey hover:bg-shell",
                !active && !done && "text-ink-soft/60"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-pill text-[11px] font-bold tabular-nums",
                  active && "bg-cream/25",
                  done && "bg-honey text-cream",
                  !active && !done && "bg-sand text-ink-soft"
                )}
              >
                {done ? <Check className="size-3" aria-hidden /> : i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 ? (
              <span className="hidden h-px w-5 bg-sand sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ========================================================================== */
/* Step 1 — service                                                            */
/* ========================================================================== */

function StepService({
  query,
  setQuery,
  category,
  setCategory,
  services,
  selected,
  onSelect,
}: {
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  services: Service[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section aria-labelledby="step-service">
      <Eyebrow>Step one</Eyebrow>
      <h2 id="step-service" className="mt-3 font-display text-h2 font-black text-ink">
        What are you booking?
      </h2>

      <div className="mt-7 flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search services</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — retwist, starter locs, colour…"
            className="min-h-12 w-full rounded-pill border border-sand bg-cream pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/70 focus:border-ink focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            All {SERVICES.length}
          </FilterChip>
          {SERVICE_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {services.length === 0 ? (
        <p className="mt-10 rounded-card border border-sand bg-shell p-6 text-sm text-ink-soft">
          Nothing matches &ldquo;{query}&rdquo;. Try &ldquo;retwist&rdquo;,
          &ldquo;locs&rdquo; or &ldquo;colour&rdquo; — or book the $10
          consultation and talk it through.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={selected === s.id}
                className={cn(
                  "flex h-full w-full flex-col rounded-card border p-5 text-left transition-all duration-200",
                  selected === s.id
                    ? "border-rose bg-shell ring-2 ring-rose"
                    : "border-sand hover:border-ink hover:bg-shell"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold leading-snug text-ink">
                    {s.shortName}
                  </h3>
                  {s.popular ? <Badge tone="rose">Popular</Badge> : null}
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {s.blurb}
                </p>
                {s.note ? (
                  <p className="mt-3 flex gap-2 rounded-card bg-cream p-3 text-xs text-ink-soft ring-1 ring-sand">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-rose" aria-hidden />
                    {s.note}
                  </p>
                ) : null}
                <div className="mt-4 flex items-end justify-between gap-3 border-t border-sand pt-3">
                  <PriceTag priceUsd={s.priceUsd} status={s.priceStatus} />
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                    <Clock className="size-4" aria-hidden />
                    {formatDuration(s.minutes)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-10 rounded-pill px-4 text-sm font-semibold transition-colors",
        active
          ? "bg-ink text-cream"
          : "border border-sand text-ink-soft hover:border-ink hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

/* ========================================================================== */
/* Step 2 — date                                                               */
/* ========================================================================== */

function StepDate({
  days,
  service,
  selected,
  onSelect,
}: {
  days: ReturnType<typeof bookableDays>;
  service: Service;
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  return (
    <section aria-labelledby="step-date">
      <Eyebrow>Step two</Eyebrow>
      <h2 id="step-date" className="mt-3 font-display text-h2 font-black text-ink">
        Pick a day.
      </h2>
      <p className="measure mt-3 text-ink-soft">
        {service.shortName} needs {formatDuration(service.minutes)} in the chair,
        so only days with a clear run that long are offered.
      </p>

      <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {days.map((d) => {
          const open = slotsFor(d.iso, service.id).length;
          const disabled = open === 0;
          return (
            <li key={d.iso}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(d.iso)}
                aria-pressed={selected === d.iso}
                className={cn(
                  "flex min-h-24 w-full flex-col items-center justify-center rounded-card border p-3 transition-all",
                  selected === d.iso
                    ? "border-rose bg-shell ring-2 ring-rose"
                    : "border-sand hover:border-ink hover:bg-shell",
                  disabled && "cursor-not-allowed opacity-40 hover:border-sand hover:bg-transparent"
                )}
              >
                <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                  {d.weekday}
                </span>
                <span className="font-display text-2xl font-black tabular-nums text-ink">
                  {d.dayNum}
                </span>
                <span className="text-[11px] text-ink-soft">
                  {disabled ? "Full" : `${open} slots`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ========================================================================== */
/* Step 3 — time                                                               */
/* ========================================================================== */

function StepTime({
  slots,
  service,
  date,
  selected,
  onSelect,
}: {
  slots: string[];
  service: Service;
  date: string;
  selected: string | null;
  onSelect: (t: string) => void;
}) {
  return (
    <section aria-labelledby="step-time">
      <Eyebrow>Step three</Eyebrow>
      <h2 id="step-time" className="mt-3 font-display text-h2 font-black text-ink">
        Pick a start time.
      </h2>
      <p className="measure mt-3 text-ink-soft">
        {prettyDate(date)}. Each option shows when you would be finished, because
        a {formatDuration(service.minutes)} appointment is most of a day and you
        should know that before you commit.
      </p>

      {slots.length === 0 ? (
        <p className="mt-8 rounded-card border border-sand bg-shell p-6 text-sm text-ink-soft">
          Nothing left on this day. Go back and pick another.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map((t) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => onSelect(t)}
                aria-pressed={selected === t}
                className={cn(
                  "flex min-h-16 w-full flex-col items-center justify-center rounded-card border transition-all",
                  selected === t
                    ? "border-rose bg-shell ring-2 ring-rose"
                    : "border-sand hover:border-ink hover:bg-shell"
                )}
              >
                <span className="font-display text-lg font-bold tabular-nums text-ink">
                  {prettyTime(t)}
                </span>
                <span className="text-[11px] text-ink-soft">
                  ends {endTime(t, service.minutes)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ========================================================================== */
/* Step 4 — details                                                            */
/* ========================================================================== */

function StepDetails({
  details,
  setDetails,
  service,
}: {
  details: Details;
  setDetails: (d: Details) => void;
  service: Service;
}) {
  const set = <K extends keyof Details>(k: K, v: Details[K]) =>
    setDetails({ ...details, [k]: v });

  return (
    <section aria-labelledby="step-details">
      <Eyebrow>Step four</Eyebrow>
      <h2 id="step-details" className="mt-3 font-display text-h2 font-black text-ink">
        Who is the chair for?
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          required
          value={details.name}
          onChange={(v) => set("name", v)}
          autoComplete="name"
        />
        <Field
          label="Mobile"
          required
          type="tel"
          value={details.phone}
          onChange={(v) => set("phone", v)}
          autoComplete="tel"
          hint="So she can reach you if the day shifts."
        />
        <Field
          label="Email"
          type="email"
          value={details.email}
          onChange={(v) => set("email", v)}
          autoComplete="email"
          className="sm:col-span-2"
        />

        <label className="sm:col-span-2">
          <span className="text-sm font-semibold text-ink">
            Anything she should know
          </span>
          <textarea
            rows={4}
            value={details.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="Tender at the temples, growing out a colour, bringing a photo…"
            className="mt-2 w-full rounded-card border border-sand bg-cream p-4 text-sm text-ink placeholder:text-ink-soft/70 focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={details.firstTime}
            onChange={(e) => set("firstTime", e.target.checked)}
            className="mt-1 size-4 accent-[var(--color-rose)]"
          />
          <span className="text-sm text-ink-soft">
            This is my first time at Bloom Kreations.
          </span>
        </label>
      </div>

      {service.id === "loc-extensions" ? (
        <p className="mt-6 flex gap-3 rounded-card border border-rose/40 bg-rose/[0.06] p-5 text-sm text-ink">
          <Info className="mt-0.5 size-4 shrink-0 text-rose" aria-hidden />
          <span>
            Loc extensions need a consultation first. Book the $10 consultation
            and she will confirm this appointment from there.
          </span>
        </p>
      ) : null}

      <p className="mt-6 flex gap-3 rounded-card bg-shell p-5 text-sm text-ink-soft ring-1 ring-sand">
        <Info className="mt-0.5 size-4 shrink-0 text-honey" aria-hidden />
        <span>
          <strong className="text-ink">Demo mode.</strong> Nothing is charged and
          no card is taken. This booking is stored for the length of your visit so
          you can see how the portal works.
        </span>
      </p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
  autoComplete,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-rose"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-12 w-full rounded-card border border-sand bg-cream px-4 text-sm text-ink focus:border-ink focus:outline-none"
      />
      {hint ? <span className="mt-1.5 block text-xs text-ink-soft">{hint}</span> : null}
    </label>
  );
}

/* ========================================================================== */
/* Summary rail — visible from the first tap                                   */
/* ========================================================================== */

function Summary({
  service,
  date,
  time,
  step,
  canAdvance,
  onConfirm,
}: {
  service: Service | null;
  date: string | null;
  time: string | null;
  step: number;
  canAdvance: boolean;
  onConfirm: () => void;
}) {
  return (
    <aside
      aria-label="Your appointment so far"
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <div className="rounded-sheet border border-sand bg-shell p-7">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow>Your appointment</Eyebrow>
          <Butterfly px={24} className="size-6 text-rose" />
        </div>

        <dl className="mt-6 flex flex-col gap-4 text-sm">
          <Row label="Service">
            {service ? (
              <span className="font-semibold text-ink">{service.shortName}</span>
            ) : (
              <span className="text-ink-soft/70">Not picked yet</span>
            )}
          </Row>
          <Row label="Day">
            {date ? (
              <span className="font-semibold text-ink">{prettyDate(date)}</span>
            ) : (
              <span className="text-ink-soft/70">Not picked yet</span>
            )}
          </Row>
          <Row label="Time">
            {time && service ? (
              <span className="font-semibold text-ink">
                {prettyTime(time)} – {endTime(time, service.minutes)}
              </span>
            ) : (
              <span className="text-ink-soft/70">Not picked yet</span>
            )}
          </Row>
        </dl>

        <div className="mt-7 border-t border-sand pt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow font-bold uppercase text-ink-soft">Total</p>
              <p className="mt-1 font-display text-4xl font-black tabular-nums text-ink">
                {service ? `$${service.priceUsd}` : "$0"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-eyebrow font-bold uppercase text-ink-soft">
                In the chair
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-ink">
                <Clock className="size-4" aria-hidden />
                {service ? formatDuration(service.minutes) : "—"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-soft">
            Paid in the studio. No deposit is taken on this site.
          </p>
        </div>

        {step === 3 ? (
          <Button
            onClick={onConfirm}
            disabled={!canAdvance}
            size="lg"
            className="mt-6 w-full"
          >
            Confirm appointment
          </Button>
        ) : null}
      </div>

      <p className="mt-5 flex gap-3 px-2 text-xs leading-relaxed text-ink-soft">
        <User className="mt-0.5 size-4 shrink-0 text-honey" aria-hidden />
        <span>
          Already a client?{" "}
          <a
            href="/portal"
            className="font-semibold text-honey underline decoration-sand underline-offset-2"
          >
            Open your portal
          </a>{" "}
          to rebook in two taps.
        </span>
      </p>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

/* ========================================================================== */
/* Confirmation                                                                */
/* ========================================================================== */

function Confirmed({
  service,
  date,
  time,
  details,
  onRestart,
}: {
  service: Service;
  date: string;
  time: string;
  details: Details;
  onRestart: () => void;
}) {
  return (
    <div className="container-page">
      <div className="mx-auto max-w-2xl rounded-sheet border border-sand bg-shell p-8 text-center sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-pill bg-rose text-cream">
          <PartyPopper className="size-7" aria-hidden />
        </div>

        <h2 className="mt-7 font-display text-h2 font-black text-ink">
          You are in the book{details.name ? `, ${details.name.split(" ")[0]}` : ""}.
        </h2>
        <p className="measure mx-auto mt-4 text-ink-soft">
          Here is what you booked. In demo mode nothing was charged and no
          confirmation was sent — but the appointment now shows in the client
          portal so you can see the whole loop.
        </p>

        <dl className="mt-9 flex flex-col gap-4 rounded-card bg-cream p-6 text-left text-sm ring-1 ring-sand">
          <Row label="Service">
            <span className="font-semibold text-ink">{service.name}</span>
          </Row>
          <Row label="When">
            <span className="font-semibold text-ink">
              {prettyDate(date)}
              <br />
              {prettyTime(time)} – {endTime(time, service.minutes)}
            </span>
          </Row>
          <Row label="Where">
            <span className="font-semibold text-ink">
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.locality}, {BUSINESS.address.region}{" "}
              {BUSINESS.address.postalCode}
            </span>
          </Row>
          <div className="flex items-baseline justify-between gap-4 border-t border-sand pt-4">
            <dt className="text-ink-soft">Total, paid in studio</dt>
            <dd className="font-display text-2xl font-black tabular-nums text-ink">
              ${service.priceUsd}
            </dd>
          </div>
        </dl>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/portal/client" size="lg">
            <CalendarDays className="size-5" aria-hidden />
            See it in your portal
          </Button>
          <Button variant="ghost" size="lg" onClick={onRestart}>
            Book something else
          </Button>
        </div>

        <p className="mt-8 text-xs text-ink-soft">
          To book for real right now,{" "}
          <a
            href={BUSINESS.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-honey underline decoration-sand underline-offset-2"
          >
            use her Acuity calendar
          </a>{" "}
          or call {BUSINESS.phone}.
        </p>
      </div>
    </div>
  );
}
