/**
 * Demo data layer.
 *
 * Everything the booking portal reads and writes goes through this module and
 * nothing else, so switching to a real backend is a change *here* and nowhere in
 * the UI. State lives in module memory for the session — no localStorage, no
 * network, no payments.
 *
 * Every seam that needs a real service is marked `TODO(backend)`.
 */

import { SERVICES, formatDuration, type Service } from "./business";

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export type Role = "guest" | "client" | "owner";

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Which loc stage they are in — drives the journey timeline. */
  stage: LocStageId;
  since: string;
  loyaltyVisits: number;
  notes: string;
  avatarInitials: string;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  /** ISO date, no time component. */
  date: string;
  /** 24h "HH:MM". */
  time: string;
  status: BookingStatus;
  priceUsd: number;
  minutes: number;
  /** Optional note the client left at booking. */
  note?: string;
  /** Set when the client added a photo to their journey after the visit. */
  journeyShot?: string;
}

export interface JourneyEntry {
  id: string;
  clientId: string;
  date: string;
  title: string;
  body: string;
  /** Slug in /public/gallery, or undefined for a "needs real photo" slot. */
  shot?: string;
  stage: LocStageId;
}

export type LocStageId = "starter" | "budding" | "teen" | "mature";

export interface LocStage {
  id: LocStageId;
  index: number;
  name: string;
  window: string;
  headline: string;
  body: string;
  /** One-sentence version for the pinned home card, which must fit a viewport. */
  teaser: string;
  /** What she does at this stage, and what it costs. */
  serviceIds: string[];
  /** The thing clients get wrong here. */
  watchOut: string;
}

/* ========================================================================== */
/* The loc journey — the education spine of the whole site                     */
/* ========================================================================== */

export const LOC_STAGES: LocStage[] = [
  {
    id: "starter",
    index: 0,
    name: "Starter",
    window: "Month 0 – 6",
    headline: "The parting you get now is the grid you keep for years.",
    body: "Your hair is still hair. Nothing has locked yet, and everything you will live with — the size of each loc, where the parts fall, how the front frames your face — is decided in this one appointment. This is the stage to slow down on and the stage most people rush.",
    teaser:
      "Nothing has locked yet, and every decision you will live with — loc size, where the parts fall, how the front frames your face — is made in this one appointment.",
    serviceIds: ["consultation", "starter-locs", "instant-locs-above-shoulder"],
    watchOut:
      "Washing too rarely because you are scared of unravelling. A clean scalp locks faster than a dirty one.",
  },
  {
    id: "budding",
    index: 1,
    name: "Budding",
    window: "Month 6 – 12",
    headline: "The awkward months. This is the stage people quit in.",
    body: "Little knots start forming down the shaft and your locs get lumpy, fuzzy and shorter-looking before they get better. Nothing has gone wrong — this is the loc actually forming. What matters now is consistency: same hands, same schedule, no over-tightening.",
    teaser:
      "Little knots form down the shaft and your locs get lumpy and shorter-looking before they get better. Nothing has gone wrong; this is the loc forming.",
    serviceIds: ["loc-retwist", "deep-wash-blow-dry", "loc-touch-ups"],
    watchOut:
      "Retwisting too tight or too often to hide the frizz. That is how thinning at the root starts, and it does not grow back quickly.",
  },
  {
    id: "teen",
    index: 2,
    name: "Teen",
    window: "Year 1 – 2",
    headline: "They finally behave — and now they can be styled.",
    body: "Your locs hold a shape, take colour, and stop unravelling at the ends. This is where the fun starts: two-strand sets, barrel rolls, updos, and the first serious colour conversation.",
    teaser:
      "Your locs hold a shape, take colour and stop unravelling at the ends. This is where two-strand sets, barrel rolls and colour become possible.",
    serviceIds: [
      "retwist-tst-shoulder",
      "loc-retwist-barrel",
      "double-process-full",
    ],
    watchOut:
      "Going lighter than your locs can take in one pass. Fashion shades need a double process for a reason.",
  },
  {
    id: "mature",
    index: 3,
    name: "Mature",
    window: "Year 2 +",
    headline: "Length, weight, and a set worth protecting.",
    body: "Fully locked, dense and heavy enough that the root has real work to do. Maintenance shifts from forming locs to protecting them — watching for thinning, combining anything that has gone weak, and adding length properly if you want it.",
    teaser:
      "Fully locked and heavy enough that the root has real work to do. Maintenance shifts from forming locs to protecting them.",
    serviceIds: ["loc-combination", "loc-extensions", "updo-loc-styles"],
    watchOut:
      "Ignoring a loc that has gone thin at the root. Combined early it is a fix; left alone it is a loss.",
  },
];

export function stage(id: LocStageId): LocStage {
  const s = LOC_STAGES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown loc stage: ${id}`);
  return s;
}

/* ========================================================================== */
/* Seed data — clearly fictional demo clients                                  */
/* ========================================================================== */

/**
 * Demo clients. Every surname is "Sample" so nobody can mistake them for her
 * real clients, and the portal labels the whole surface "Demo" besides. First
 * names differ because the client dashboard greets people by first name, and
 * four people called "Sample" would make the demo unreadable.
 *
 * One client per loc stage, on purpose: the client portal looks like a
 * different product at one month than at three years, and the demo switcher
 * exists to show exactly that.
 */
const seedClients: Client[] = [
  {
    id: "c-demo",
    name: "Ava Sample",
    email: "ava@bloomkreations.example",
    phone: "(773) 555-0142",
    stage: "teen",
    since: "2024-11-02",
    loyaltyVisits: 9,
    notes: "Sensitive at the temples. Prefers a looser retwist at the front.",
    avatarInitials: "AS",
  },
  {
    id: "c-2",
    name: "Nia Sample",
    email: "nia@bloomkreations.example",
    phone: "(773) 555-0119",
    stage: "budding",
    since: "2025-09-14",
    loyaltyVisits: 4,
    notes: "Started locs here. Booked in every five weeks.",
    avatarInitials: "NS",
  },
  {
    id: "c-3",
    name: "Rae Sample",
    email: "rae@bloomkreations.example",
    phone: "(773) 555-0177",
    stage: "mature",
    since: "2023-03-21",
    loyaltyVisits: 21,
    notes: "Two locs combined at the left temple, Jan 2026. Watch that section.",
    avatarInitials: "RS",
  },
  {
    id: "c-4",
    name: "Kim Sample",
    email: "kim@bloomkreations.example",
    phone: "(773) 555-0163",
    stage: "starter",
    since: "2026-07-30",
    loyaltyVisits: 1,
    notes: "New starter set. First retwist due.",
    avatarInitials: "KS",
  },
];

/** Today, fixed for the demo so the dashboard always has a sensible week. */
export const DEMO_TODAY = "2026-08-30";

function d(offsetDays: number): string {
  const base = new Date(`${DEMO_TODAY}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + offsetDays);
  return base.toISOString().slice(0, 10);
}

function priceOf(id: string) {
  const s = SERVICES.find((x) => x.id === id);
  return { priceUsd: s?.priceUsd ?? 0, minutes: s?.minutes ?? 60 };
}

function mk(
  id: string,
  clientId: string,
  serviceId: string,
  date: string,
  time: string,
  status: BookingStatus,
  note?: string
): Booking {
  return { id, clientId, serviceId, date, time, status, note, ...priceOf(serviceId) };
}

const seedBookings: Booking[] = [
  mk("b-1", "c-demo", "retwist-tst-shoulder", d(6), "10:00", "upcoming", "Same twist size as last time please."),
  mk("b-2", "c-2", "loc-retwist", d(1), "08:00", "upcoming"),
  mk("b-3", "c-4", "loc-retwist", d(2), "13:30", "upcoming", "First retwist since my starter set."),
  mk("b-4", "c-3", "updo-loc-styles", d(3), "09:00", "upcoming", "Wedding on the Saturday."),
  mk("b-5", "c-demo", "double-process-full", d(-24), "08:30", "completed"),
  mk("b-6", "c-demo", "loc-retwist", d(-58), "11:00", "completed"),
  mk("b-7", "c-demo", "starter-locs", d(-662), "07:30", "completed"),
  mk("b-8", "c-3", "loc-combination", d(-221), "07:30", "completed"),
  mk("b-9", "c-2", "starter-locs", d(-350), "09:00", "completed"),
  mk("b-10", "c-3", "loc-retwist", d(-12), "16:00", "completed"),
  mk("b-11", "c-2", "loc-touch-ups", d(-40), "17:30", "cancelled"),
  mk("b-12", "c-3", "silk-press", d(9), "14:00", "upcoming"),
];

const seedJourney: JourneyEntry[] = [
  {
    id: "j-1",
    clientId: "c-demo",
    date: d(-662),
    stage: "starter",
    title: "Starter set installed",
    body: "Parted and sectioned. Grid set for the next few years.",
    shot: "starter-locs-hand",
  },
  {
    id: "j-2",
    clientId: "c-demo",
    date: d(-380),
    stage: "budding",
    title: "Through the budding stage",
    body: "Frizzy months. Held the five-week schedule and did not over-tighten.",
    shot: "crisp-parts-retwist",
  },
  {
    id: "j-3",
    clientId: "c-demo",
    date: d(-58),
    stage: "teen",
    title: "First two-strand set",
    body: "Locs finally holding a shape. Wore it twisted then unravelled it Thursday.",
    shot: "two-strand-fresh",
  },
  {
    id: "j-4",
    clientId: "c-demo",
    date: d(-24),
    stage: "teen",
    title: "Double process colour",
    body: "Lifted and toned full head. Copper.",
    shot: "copper-curly-locs",
  },

  /* --- Kim Sample: brand new. What a starter client sees. ---------------- */
  {
    id: "j-5",
    clientId: "c-4",
    date: d(-31),
    stage: "starter",
    title: "Starter set installed",
    body: "Parted, sectioned and coiled. First retwist booked for five weeks out.",
    shot: "starter-locs-hand",
  },

  /* --- Nia Sample: a year in, mid-budding. -------------------------------- */
  {
    id: "j-6",
    clientId: "c-2",
    date: d(-350),
    stage: "starter",
    title: "Starter set installed",
    body: "Grid set. Told to leave them alone between visits and she did.",
    shot: "parts-macro",
  },
  {
    id: "j-7",
    clientId: "c-2",
    date: d(-180),
    stage: "budding",
    title: "Budding, on schedule",
    body: "The frizzy stretch. Every five weeks, no tightening at the root.",
    shot: "crisp-parts-retwist",
  },
  {
    id: "j-8",
    clientId: "c-2",
    date: d(-40),
    stage: "budding",
    title: "Holding a shape",
    body: "Roots settled enough to wear it up for the first time.",
    shot: "loc-bun-parts",
  },

  /* --- Rae Sample: three years, mature, styled. --------------------------- */
  {
    id: "j-9",
    clientId: "c-3",
    date: d(-1258),
    stage: "starter",
    title: "Started here",
    body: "First set. Three years ago this month.",
    shot: "starter-locs-hand",
  },
  {
    id: "j-10",
    clientId: "c-3",
    date: d(-720),
    stage: "teen",
    title: "Through the teen stage",
    body: "Length arrived. Kept the same five-week rhythm the whole way.",
    shot: "filtered-retwist",
  },
  {
    id: "j-11",
    clientId: "c-3",
    date: d(-221),
    stage: "mature",
    title: "Two locs combined",
    body: "Left temple. Combined rather than cut, and it took cleanly.",
    shot: "basketweave-parts",
  },
  {
    id: "j-12",
    clientId: "c-3",
    date: d(-12),
    stage: "mature",
    title: "Updo for the wedding",
    body: "Barrel roll. Held all day and came down without a snag.",
    shot: "barrel-roll-updo",
  },
];

/* ========================================================================== */
/* Store                                                                       */
/* ========================================================================== */

interface Store {
  clients: Client[];
  bookings: Booking[];
  journey: JourneyEntry[];
  /** Prices the owner has confirmed inside the portal this session. */
  confirmedPrices: Set<string>;
}

const store: Store = {
  clients: [...seedClients],
  bookings: [...seedBookings],
  journey: [...seedJourney],
  confirmedPrices: new Set(),
};

let idCounter = 1000;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

/* --- Reads ---------------------------------------------------------------- */

// TODO(backend): every read below becomes a query against the real database.

export const db = {
  clients: () => [...store.clients],

  client: (id: string) => store.clients.find((c) => c.id === id),

  bookings: () => [...store.bookings],

  bookingsFor: (clientId: string) =>
    store.bookings
      .filter((b) => b.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date)),

  upcoming: () =>
    store.bookings
      .filter((b) => b.status === "upcoming")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),

  journeyFor: (clientId: string) =>
    store.journey
      .filter((j) => j.clientId === clientId)
      .sort((a, b) => a.date.localeCompare(b.date)),

  /** Revenue booked, by status. Demo figures only. */
  revenue: () => {
    const done = store.bookings.filter((b) => b.status === "completed");
    const booked = store.bookings.filter((b) => b.status === "upcoming");
    return {
      completedUsd: done.reduce((n, b) => n + b.priceUsd, 0),
      upcomingUsd: booked.reduce((n, b) => n + b.priceUsd, 0),
      completedCount: done.length,
      upcomingCount: booked.length,
      chairHours: Math.round(
        store.bookings
          .filter((b) => b.status !== "cancelled")
          .reduce((n, b) => n + b.minutes, 0) / 60
      ),
    };
  },

  /** Which services actually get booked — drives the owner dashboard chart. */
  serviceMix: () => {
    const counts = new Map<string, number>();
    for (const b of store.bookings) {
      if (b.status === "cancelled") continue;
      counts.set(b.serviceId, (counts.get(b.serviceId) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([serviceId, count]) => ({
        serviceId,
        count,
        service: SERVICES.find((s) => s.id === serviceId),
      }))
      .filter((r): r is { serviceId: string; count: number; service: Service } =>
        Boolean(r.service)
      )
      .sort((a, b) => b.count - a.count);
  },

  isPriceConfirmed: (serviceId: string) => store.confirmedPrices.has(serviceId),

  confirmedPriceCount: () => store.confirmedPrices.size,

  /* --- Writes ------------------------------------------------------------ */

  // TODO(backend): wrap these in a transaction and emit a confirmation email/SMS.

  createBooking(input: {
    clientId: string;
    serviceId: string;
    date: string;
    time: string;
    note?: string;
  }): Booking {
    const booking: Booking = {
      id: nextId("b"),
      status: "upcoming",
      ...input,
      ...priceOf(input.serviceId),
    };
    store.bookings = [...store.bookings, booking];
    return booking;
  },

  cancelBooking(id: string) {
    store.bookings = store.bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b
    );
  },

  completeBooking(id: string) {
    store.bookings = store.bookings.map((b) =>
      b.id === id ? { ...b, status: "completed" as const } : b
    );
  },

  addJourneyEntry(input: Omit<JourneyEntry, "id">): JourneyEntry {
    const entry: JourneyEntry = { id: nextId("j"), ...input };
    store.journey = [...store.journey, entry];
    return entry;
  },

  confirmPrice(serviceId: string) {
    store.confirmedPrices.add(serviceId);
  },

  unconfirmPrice(serviceId: string) {
    store.confirmedPrices.delete(serviceId);
  },
};

/* ========================================================================== */
/* Availability                                                                */
/* ========================================================================== */

/**
 * Real hours-aware availability: 07:30–19:00 seven days, on the half hour, and a
 * slot only appears if the whole service fits before closing and does not collide
 * with an existing booking.
 */
const OPEN_MIN = 7 * 60 + 30;
const CLOSE_MIN = 19 * 60;
const STEP = 30;

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const toHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export function slotsFor(dateISO: string, serviceId: string): string[] {
  const svc = SERVICES.find((s) => s.id === serviceId);
  if (!svc) return [];

  const taken = store.bookings
    .filter((b) => b.date === dateISO && b.status === "upcoming")
    .map((b) => ({ start: toMin(b.time), end: toMin(b.time) + b.minutes }));

  const out: string[] = [];
  for (let t = OPEN_MIN; t + svc.minutes <= CLOSE_MIN; t += STEP) {
    const end = t + svc.minutes;
    const clash = taken.some((b) => t < b.end && end > b.start);
    if (!clash) out.push(toHHMM(t));
  }
  return out;
}

/** Fourteen bookable days from the demo "today". */
export function bookableDays(): { iso: string; weekday: string; dayNum: string; month: string }[] {
  const out = [];
  for (let i = 1; i <= 14; i++) {
    const iso = d(i);
    const dt = new Date(`${iso}T12:00:00Z`);
    out.push({
      iso,
      weekday: dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      dayNum: dt.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" }),
      month: dt.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    });
  }
  return out;
}

/* --- Display helpers ------------------------------------------------------ */

export function prettyDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function prettyDateShort(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function prettyTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function endTime(hhmm: string, minutes: number): string {
  return prettyTime(toHHMM(toMin(hhmm) + minutes));
}

export { formatDuration };
