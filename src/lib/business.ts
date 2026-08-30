/**
 * The single source of truth for every fact about Bloom Kreations.
 *
 * NAP, hours, attributes and rating: her Google Business Profile, read 2026-08-30.
 * Service names, prices and durations: her live Acuity menu, read 2026-08-30.
 * Reviews: real Google reviews, attributed, never edited beyond trimming.
 *
 * Nothing in this file is invented. If a value is not verified it carries a
 * `status` of "unconfirmed" and the UI renders it with a visible marker.
 */

export const BUSINESS = {
  name: "Bloom Kreations",
  legalName: "Bloom Kreations LLC",
  tagline: "Chicago loctician",
  owner: {
    name: "Latesha Reed",
    knownAs: "Pookie",
    role: "Owner + Loctician",
    pronouns: "she/her",
  },
  address: {
    street: "928 W 38th Pl",
    locality: "Chicago",
    region: "IL",
    postalCode: "60609",
    country: "US",
    neighborhood: "Bridgeport",
  },
  geo: { lat: 41.8245761, lng: -87.6487069 },
  plusCode: "R9F2+RG Chicago, Illinois",
  phone: "(773) 956-2994",
  phoneHref: "tel:+17739562994",
  rating: { value: 4.8, count: 60 },
  /** Live booking. Every CTA on this site falls back to this so the site converts today. */
  bookingUrl: "https://bloomkreationsllc.as.me/schedule/df1d894b",
  googleMapsUrl:
    "https://www.google.com/maps/place/Bloom+Kreations+LLC/@41.8245761,-87.6487069,17z/data=!4m6!3m5!1s0x880e2d3bfb75f5eb:0x91eda6dcf5642182!8m2!3d41.8245761!4d-87.6487069",
  googleReviewsUrl:
    "https://www.google.com/maps/place/Bloom+Kreations+LLC/@41.8245761,-87.6487069,17z/data=!4m8!3m7!1s0x880e2d3bfb75f5eb:0x91eda6dcf5642182!8m2!3d41.8245761!4d-87.6487069!9m1!1b1",
  social: {
    instagram: "https://www.instagram.com/bloomkreations_/",
    instagramHandle: "@bloomkreations_",
    instagramPersonal: "https://www.instagram.com/pookiieology/",
    instagramPersonalHandle: "@pookiieology",
  },
  /** As they appear on her Google Business Profile. */
  attributes: [
    "Black-owned",
    "Women-owned",
    "LGBTQ+ owned",
    "LGBTQ+ friendly",
  ],
} as const;

export type DayHours = { day: string; short: string; open: string; close: string };

/** Google lists the same window seven days a week. */
export const HOURS: DayHours[] = [
  { day: "Monday", short: "Mon", open: "07:30", close: "19:00" },
  { day: "Tuesday", short: "Tue", open: "07:30", close: "19:00" },
  { day: "Wednesday", short: "Wed", open: "07:30", close: "19:00" },
  { day: "Thursday", short: "Thu", open: "07:30", close: "19:00" },
  { day: "Friday", short: "Fri", open: "07:30", close: "19:00" },
  { day: "Saturday", short: "Sat", open: "07:30", close: "19:00" },
  { day: "Sunday", short: "Sun", open: "07:30", close: "19:00" },
];

/* ========================================================================== */
/* Services                                                                    */
/* ========================================================================== */

export type ServiceCategoryId =
  | "locs"
  | "protective"
  | "color"
  | "styling"
  | "special";

export type PriceStatus = "verified" | "unconfirmed";

export interface Service {
  id: string;
  /** Verbatim from her Acuity menu. Do not "tidy" these — clients search for them. */
  name: string;
  /** Shorter label for chips and the booking summary. */
  shortName: string;
  category: ServiceCategoryId;
  priceUsd: number;
  minutes: number;
  priceStatus: PriceStatus;
  /** Our descriptive copy. Describes the service, never claims a credential. */
  blurb: string;
  popular?: boolean;
  /** Surfaced on the service card when the menu itself needs her confirmation. */
  note?: string;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  /** Verbatim category name from Acuity, cleaned only of stray punctuation. */
  name: string;
  kicker: string;
  blurb: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "locs",
    name: "Loc Services",
    kicker: "Start them, keep them, style them",
    blurb:
      "The heart of the chair. Starting a fresh set, keeping an established set crisp, or turning a retwist into a style you did not expect to leave with.",
  },
  {
    id: "protective",
    name: "Protective Styles",
    kicker: "Braids and twists",
    blurb:
      "Installed styles that give your own hair a season off — soft locs, butterfly locs, invisible locs, island twists and natural twist sets.",
  },
  {
    id: "color",
    name: "Colour Services",
    kicker: "Tips, full head, fashion shades",
    blurb:
      "Copper, honey, burgundy and fashion colour, priced by how far down the strand the colour travels.",
  },
  {
    id: "styling",
    name: "Styling + Maintenance",
    kicker: "Between the big appointments",
    blurb:
      "Wash days, silk presses, take-downs and quick touch-ups for the weeks in between.",
  },
  {
    id: "special",
    name: "Consultations + Specialty",
    kicker: "Extensions, combinations, teaching",
    blurb:
      "The bigger conversations: extensions, combining loc methods, senior and children's appointments, and learning to do it yourself.",
  },
];

/**
 * Every price and duration below was read from her live Acuity booking page on
 * 2026-08-30 and is marked "verified" on that basis. Where her menu itself is
 * ambiguous, `note` says so rather than the site quietly guessing.
 */
export const SERVICES: Service[] = [
  /* --- Loc Services --------------------------------------------------- */
  {
    id: "starter-locs",
    name: "Starter Locs",
    shortName: "Starter Locs",
    category: "locs",
    priceUsd: 180,
    minutes: 200,
    priceStatus: "verified",
    popular: true,
    blurb:
      "The first appointment of your loc journey. Your hair is washed, sectioned and parted into the grid your locs will grow into for years, so the parting is the part that gets the time.",
  },
  {
    id: "instant-locs-above-shoulder",
    name: "Instant Locs w/ Starter Locs (Above Shoulder Length)",
    shortName: "Instant Locs — above shoulder",
    category: "locs",
    priceUsd: 500,
    minutes: 450,
    priceStatus: "verified",
    blurb:
      "Skip the awkward stage. Your own hair is crocheted into locs that look mature the day they go in, rather than waiting out months of budding.",
  },
  {
    id: "instant-locs-shoulder",
    name: "Instant Locs w/ Starter Locs (Shoulder Length)",
    shortName: "Instant Locs — shoulder",
    category: "locs",
    priceUsd: 530,
    minutes: 450,
    priceStatus: "verified",
    blurb:
      "The same instant-loc method for shoulder-length hair. Longer hair means more locs to crochet, which is the whole reason for the price step.",
  },
  {
    id: "loc-retwist",
    name: "Loc Retwist",
    shortName: "Retwist",
    category: "locs",
    priceUsd: 110,
    minutes: 105,
    priceStatus: "verified",
    popular: true,
    blurb:
      "The appointment her clients come back for. Wash, retwist, clean parts across the whole crown. The reviews call it crispy; one calls it so clean it looks filtered.",
  },
  {
    id: "loc-retwist-barrel",
    name: "Loc Retwist w/ Barrel or Braid Style",
    shortName: "Retwist + barrel or braid",
    category: "locs",
    priceUsd: 135,
    minutes: 125,
    priceStatus: "verified",
    blurb:
      "A retwist finished with barrel rolls or braided sections instead of being left down — the fastest way to leave with a whole style.",
  },
  {
    id: "retwist-tst-above-shoulder",
    name: "Loc Retwist w/ Two Strand Twist (above shoulder length)",
    shortName: "Retwist + two-strand — above shoulder",
    category: "locs",
    priceUsd: 140,
    minutes: 180,
    priceStatus: "verified",
    blurb:
      "Retwist plus a full two-strand twist set. Wear it twisted, then unravel it for a second look later in the week.",
  },
  {
    id: "retwist-tst-shoulder",
    name: "Loc Retwist w/ Two Strand Twist (shoulder length)",
    shortName: "Retwist + two-strand — shoulder",
    category: "locs",
    priceUsd: 150,
    minutes: 180,
    priceStatus: "verified",
    blurb: "Retwist plus a two-strand twist set, priced for shoulder-length locs.",
  },
  {
    id: "retwist-tst-past-shoulder",
    name: "Loc Retwist w/ Two Strand Twist (pass shoulder length)",
    shortName: "Retwist + two-strand — past shoulder",
    category: "locs",
    priceUsd: 155,
    minutes: 180,
    priceStatus: "verified",
    blurb: "Retwist plus a two-strand twist set, priced for locs past the shoulder.",
  },
  {
    id: "retwist-tst-mid-back",
    name: "Loc Retwist w/ Two Strand Twist (mid back length)",
    shortName: "Retwist + two-strand — mid back",
    category: "locs",
    priceUsd: 175,
    minutes: 210,
    priceStatus: "verified",
    blurb: "Retwist plus a two-strand twist set, priced for mid-back-length locs.",
  },
  {
    id: "retwist-tst-past-mid-back",
    name: "Loc Retwist w/ Two Strand Twist (Pass mid back length)",
    shortName: "Retwist + two-strand — past mid back",
    category: "locs",
    priceUsd: 200,
    minutes: 220,
    priceStatus: "verified",
    blurb:
      "The longest two-strand set on the menu. Past mid-back locs take the most time per twist, which is what the extra thirty minutes buys.",
  },
  {
    id: "updo-loc-styles",
    name: "Updo Loc Styles",
    shortName: "Updo Loc Styles",
    category: "locs",
    priceUsd: 140,
    minutes: 150,
    priceStatus: "verified",
    popular: true,
    blurb:
      "Sculpted updos — barrel rolls, pinned crowns, buns with braided detail. Book this when there is an event on the calendar.",
  },
  {
    id: "wick-touch-up",
    name: "Wic Touch Up",
    shortName: "Wick Touch Up",
    category: "locs",
    priceUsd: 150,
    minutes: 130,
    priceStatus: "verified",
    note: "Listed as 'Wic Touch Up' on her booking page. Confirm whether this is a wick-loc touch-up before the menu goes live.",
    blurb:
      "Maintenance on an established wick set — reshaping and tightening the new growth without disturbing the body of the wick.",
  },

  /* --- Protective Styles ---------------------------------------------- */
  {
    id: "soft-locs",
    name: "Soft Locs (Any Length)",
    shortName: "Soft Locs",
    category: "protective",
    priceUsd: 300,
    minutes: 400,
    priceStatus: "verified",
    popular: true,
    blurb:
      "Wrapped, lightweight and deliberately soft to the touch. One price whatever length you go for, which is unusual and worth knowing.",
  },
  {
    id: "invisible-locs",
    name: "Invisible Locs (Hair Included)",
    shortName: "Invisible Locs",
    category: "protective",
    priceUsd: 265,
    minutes: 300,
    priceStatus: "verified",
    popular: true,
    blurb:
      "Faux locs with no visible knot at the root, so the install reads as your own hair. The hair is included in the price.",
  },
  {
    id: "butterfly-locs",
    name: "Butterfly Locs",
    shortName: "Butterfly Locs",
    category: "protective",
    priceUsd: 225,
    minutes: 180,
    priceStatus: "verified",
    blurb:
      "The distressed, looped texture that gives butterfly locs their name. Bohemian without the upkeep.",
  },
  {
    id: "butterfly-locs-bob",
    name: "Butterfly Locs (Bob Length)",
    shortName: "Butterfly Locs — bob",
    category: "protective",
    priceUsd: 225,
    minutes: 180,
    priceStatus: "verified",
    note: "Priced identically to full-length butterfly locs on her booking page. Confirm whether the bob length should sit lower.",
    blurb: "Butterfly locs cut to a bob — the same texture, a sharper silhouette.",
  },
  {
    id: "miracle-knots",
    name: "Miracle Knots",
    shortName: "Miracle Knots",
    category: "protective",
    priceUsd: 275,
    minutes: 220,
    priceStatus: "verified",
    blurb:
      "A knotted protective set with the volume of a braid install and noticeably less tension at the root.",
  },
  {
    id: "island-twist",
    name: "Island Twist (mid back length)",
    shortName: "Island Twist",
    category: "protective",
    priceUsd: 325,
    minutes: 330,
    priceStatus: "verified",
    blurb:
      "Long island twists to mid back. The longest protective install on the menu and the one that needs the most of the day.",
  },
  {
    id: "natural-twist-braids",
    name: "Natural Hair Twist/Braids",
    shortName: "Natural Twist / Braids",
    category: "protective",
    priceUsd: 180,
    minutes: 180,
    priceStatus: "verified",
    blurb:
      "Twists or braids on your own hair with nothing added — a reset week for your scalp with a style you can still wear out.",
  },

  /* --- Colour ---------------------------------------------------------- */
  {
    id: "color-blondes-browns-tips",
    name: "Color Service (Blondes & Browns) Tips",
    shortName: "Colour — tips",
    category: "color",
    priceUsd: 50,
    minutes: 120,
    priceStatus: "verified",
    blurb:
      "Colour on the ends only, in the blonde and brown family. The lowest-commitment way to test a shade.",
  },
  {
    id: "color-blondes-browns-full-above",
    name: "Color Service (Blondes & Browns) Full Head (Shoulder Length and Above)",
    shortName: "Colour — full head, above shoulder",
    category: "color",
    priceUsd: 100,
    minutes: 160,
    priceStatus: "verified",
    blurb: "Full-head blonde or brown on locs at or above shoulder length.",
  },
  {
    id: "color-blondes-browns-full-past",
    name: "Color Service (Blondes & Browns) Full Head (Past Shoulder Length)",
    shortName: "Colour — full head, past shoulder",
    category: "color",
    priceUsd: 130,
    minutes: 180,
    priceStatus: "verified",
    blurb: "Full-head blonde or brown on locs past shoulder length.",
  },
  {
    id: "double-process-tips",
    name: "Double Process Color (Tips) / Fashion Colors",
    shortName: "Double process — tips",
    category: "color",
    priceUsd: 85,
    minutes: 120,
    priceStatus: "verified",
    blurb:
      "Lift then tone on the ends — the two-step needed for reds, coppers and fashion shades that will not take in one pass.",
  },
  {
    id: "double-process-full",
    name: "Double Process Color (Full Head) / Fashion Colors",
    shortName: "Double process — full head",
    category: "color",
    priceUsd: 130,
    minutes: 210,
    priceStatus: "verified",
    popular: true,
    blurb:
      "Full-head lift and tone. This is the appointment behind the burgundy and copper sets in the gallery.",
  },

  /* --- Styling + Maintenance ------------------------------------------- */
  {
    id: "deep-wash-blow-dry",
    name: "Deep Wash & Blow Dry",
    shortName: "Deep Wash + Blow Dry",
    category: "styling",
    priceUsd: 40,
    minutes: 30,
    priceStatus: "verified",
    blurb:
      "A proper wash and full dry with no styling attached. The half-hour appointment that keeps a set from getting heavy.",
  },
  {
    id: "silk-press",
    name: "Silk Press",
    shortName: "Silk Press",
    category: "styling",
    priceUsd: 150,
    minutes: 120,
    priceStatus: "verified",
    blurb:
      "Natural hair pressed straight with movement left in it. Booked most often before a trip or a photo.",
  },
  {
    id: "loc-touch-ups",
    name: "Loc Touch Ups",
    shortName: "Loc Touch Ups",
    category: "styling",
    priceUsd: 65,
    minutes: 45,
    priceStatus: "verified",
    blurb:
      "Forty-five minutes to fix what came loose — a few unravelled locs, a thinning root, a spot that needs re-attaching. Not a full retwist.",
  },
  {
    id: "hair-take-down",
    name: "Hair Take Down",
    shortName: "Take Down",
    category: "styling",
    priceUsd: 100,
    minutes: 100,
    priceStatus: "verified",
    blurb:
      "Removing an install without taking your own hair with it. Book it rather than fighting a four-week-old set at home.",
  },

  /* --- Consultations + Specialty --------------------------------------- */
  {
    id: "consultation",
    name: "Consultation",
    shortName: "Consultation",
    category: "special",
    priceUsd: 10,
    minutes: 15,
    priceStatus: "verified",
    popular: true,
    blurb:
      "Fifteen minutes and ten dollars to work out what your hair actually needs before you commit to a long appointment. Required before loc extensions.",
  },
  {
    id: "loc-extensions",
    name: "Loc Extensions (consultation required)",
    shortName: "Loc Extensions",
    category: "special",
    priceUsd: 850,
    minutes: 500,
    priceStatus: "verified",
    blurb:
      "The largest appointment on the menu — a full day adding length to an existing set. Book the consultation first; this one cannot be booked cold.",
  },
  {
    id: "loc-combination",
    name: "Loc Combination",
    shortName: "Loc Combination",
    category: "special",
    priceUsd: 400,
    minutes: 220,
    priceStatus: "verified",
    blurb:
      "Combining an existing set — merging thin or over-parted locs into a stronger grid, or joining two methods into one head.",
  },
  {
    id: "loc-class",
    name: "Loc Class",
    shortName: "Loc Class",
    category: "special",
    priceUsd: 650,
    minutes: 500,
    priceStatus: "verified",
    blurb:
      "A full day of one-to-one teaching. Learn to part, retwist and maintain properly — whether that is for your own head or for your own chair.",
  },
  {
    id: "senior-kids-service",
    name: "Senior Service (Age 50+) Retwist & Style / Kids under 10",
    shortName: "Senior + Kids Service",
    category: "special",
    priceUsd: 120,
    minutes: 120,
    priceStatus: "verified",
    note: "Her booking page lists seniors 50+ and children under 10 under one appointment type and one price. Worth splitting into two before launch.",
    blurb:
      "A retwist and style for clients aged fifty and over, and for children under ten. Unhurried, and gentle at the root.",
  },
];

export const SERVICE_COUNT = SERVICES.length;

export const PRICE_RANGE = {
  min: Math.min(...SERVICES.map((s) => s.priceUsd)),
  max: Math.max(...SERVICES.map((s) => s.priceUsd)),
};

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function servicesByCategory(id: ServiceCategoryId): Service[] {
  return SERVICES.filter((s) => s.category === id);
}

export const POPULAR_SERVICES = SERVICES.filter((s) => s.popular);

/** "3 hr 20 min" — used everywhere a duration is shown. */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

export function formatPrice(usd: number): string {
  return `$${usd}`;
}

/* ========================================================================== */
/* Reviews — real, from her Google Business Profile                            */
/* ========================================================================== */

export interface Review {
  author: string;
  rating: 5;
  /** As Google displays it, relative to 2026-08-30. */
  when: string;
  quote: string;
  /** True when Google's own text was longer than the excerpt shown here. */
  excerpt?: boolean;
}

export const REVIEWS: Review[] = [
  {
    author: "MsQuilla31",
    rating: 5,
    when: "8 months ago",
    quote:
      "I just moved to Chicago and needed a loctician. I am so happy I found Bloom Kreations! She is very knowledgeable about locs and did an amazing job with the retwist and style.",
    excerpt: true,
  },
  {
    author: "Aleeah T",
    rating: 5,
    when: "8 months ago",
    quote:
      "I've been going to Bloom Kreations for a few years now and she is GREAT at what she does. No wait for overlapping apts, no tenderness from hair pulling or tightening, and a bubbly personality that is welcoming.",
    excerpt: true,
  },
  {
    author: "Danielle Matthews",
    rating: 5,
    when: "8 months ago",
    quote:
      "If you want crispy lines, long lasting styles and a great detox for locs, BloomKreations is where you need to book. I can't tell you how many times she has changed my life by giving me the freshest re-twist.",
    excerpt: true,
  },
  {
    author: "Marcus Mills",
    rating: 5,
    when: "8 months ago",
    quote:
      "Been going to her for a year now and my locs are thriving!! Reasonably priced, she'll get your head right, with crispy parts and great convo.",
    excerpt: true,
  },
  {
    author: "Josh Dillingham",
    rating: 5,
    when: "8 months ago",
    quote:
      "I've been going to her for the past two years and she's been amazing every time. Always professional, great energy, and consistently great work. She's helped maintain my locs and reattached a few when needed.",
    excerpt: true,
  },
  {
    author: "Nite Shade",
    rating: 5,
    when: "8 months ago",
    quote:
      "Literally never going to another loctician other than Bloom Kreations. It's never been a time where she missed on a hairstyle I ask her to try. Always communicative, and overall cares.",
    excerpt: true,
  },
  {
    author: "michelle williams",
    rating: 5,
    when: "8 months ago",
    quote:
      "Service is always top-tier! She's very kind, super professional, and truly talented. Both my son and I get our hair done by her, and we always leave happy and completely satisfied.",
  },
];

/**
 * Google's own extracted review topics, with the number of reviews mentioning
 * each. This is the clearest evidence that she is read as a loctician, not a
 * general salon, and it is why the whole site is positioned that way.
 */
export const REVIEW_TOPICS: { topic: string; count: number }[] = [
  { topic: "locs", count: 18 },
  { topic: "neatness", count: 10 },
  { topic: "loctician", count: 4 },
  { topic: "retwist", count: 4 },
  { topic: "responsive staff", count: 4 },
  { topic: "loc maintenance", count: 3 },
  { topic: "wait time", count: 3 },
  { topic: "clean space", count: 2 },
  { topic: "passion for work", count: 2 },
  { topic: "consistent quality", count: 2 },
];

/* ========================================================================== */
/* Voice — her own words, from her Instagram captions. Emoji stripped.         */
/* ========================================================================== */

export const HER_WORDS = {
  chair:
    "My chair is more than a seat. It's a space where you leave feeling beautiful, confident, and cared for. I take pride in making sure every client loves their hair before walking out.",
  crown: "Healthy locs. Happy crown.",
  confidence: "Confidence starts at the crown.",
  filtered: "Retwist so clean it look filtered.",
  dreaming: "One appointment away from the locs you've been dreaming about.",
  started: "Every set of beautiful locs started here.",
  talking: "Book your next appointment and let your locs do the talking.",
  journey: "Your loc journey deserves consistency and care.",
} as const;
