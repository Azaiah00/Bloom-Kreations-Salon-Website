/**
 * Her real work, pulled from @bloomkreations_ on 2026-08-30 and resized to
 * 1400px WebP. Alt text describes what is actually in each frame — it is the
 * only description a screen-reader user and an image-search crawler will get.
 */

export type GalleryTag =
  | "retwist"
  | "starter"
  | "styles"
  | "twists"
  | "color"
  | "protective"
  | "kids";

export interface Shot {
  slug: string;
  tag: GalleryTag;
  alt: string;
  /** Rough aspect for layout; every source was a 3:4 or square Instagram frame. */
  ratio: "portrait" | "square";
  /** Which service on the menu this shot sells. */
  serviceId?: string;
}

export const GALLERY_TAGS: { id: GalleryTag | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "retwist", label: "Retwists" },
  { id: "starter", label: "Starter Locs" },
  { id: "styles", label: "Loc Styles" },
  { id: "twists", label: "Two-Strand" },
  { id: "color", label: "Colour" },
  { id: "protective", label: "Protective" },
  { id: "kids", label: "Kids" },
];

export const GALLERY: Shot[] = [
  {
    slug: "filtered-retwist",
    tag: "retwist",
    ratio: "portrait",
    serviceId: "loc-retwist",
    alt: "A fresh loc retwist photographed from behind, every part sitting in a clean even grid across the back of the head",
  },
  {
    slug: "ginger-loc-updo",
    tag: "color",
    ratio: "portrait",
    serviceId: "double-process-full",
    alt: "Copper-ginger coloured locs pinned into a sculpted updo and finished with gold loc cuffs",
  },
  {
    slug: "honey-ombre-twists",
    tag: "twists",
    ratio: "portrait",
    serviceId: "retwist-tst-shoulder",
    alt: "Honey-blonde ombre two-strand twists falling to the shoulder on freshly retwisted locs",
  },
  {
    slug: "starter-locs-hand",
    tag: "starter",
    ratio: "portrait",
    serviceId: "starter-locs",
    alt: "A freshly installed set of starter locs held up to show the sectioning and parting across the scalp",
  },
  {
    slug: "mens-retwist-lineup",
    tag: "retwist",
    ratio: "portrait",
    serviceId: "loc-retwist",
    alt: "A men's loc retwist finished with a crisp lineup, photographed in profile",
  },
  {
    slug: "barrel-roll-updo",
    tag: "styles",
    ratio: "portrait",
    serviceId: "updo-loc-styles",
    alt: "Locs styled into a barrel-roll updo with braided sections and gold cuffs through the front",
  },
  {
    slug: "burgundy-curls",
    tag: "color",
    ratio: "portrait",
    serviceId: "double-process-full",
    alt: "Burgundy-red locs set into a full curl and photographed against a green hedge wall",
  },
  {
    slug: "invisible-locs",
    tag: "protective",
    ratio: "portrait",
    serviceId: "invisible-locs",
    alt: "A finished set of invisible locs with no visible knot at the root, hair included in the install",
  },
  {
    slug: "crisp-parts-retwist",
    tag: "retwist",
    ratio: "portrait",
    serviceId: "loc-retwist",
    alt: "A loc retwist seen from above showing clean, evenly spaced parts across the crown",
  },
  {
    slug: "copper-curly-locs",
    tag: "color",
    ratio: "portrait",
    serviceId: "color-blondes-browns-full-past",
    alt: "Copper coloured locs set into soft curls, worn down past the shoulder",
  },
  {
    slug: "two-strand-fresh",
    tag: "twists",
    ratio: "portrait",
    serviceId: "retwist-tst-above-shoulder",
    alt: "A two-strand twist set on freshly retwisted locs, photographed in the salon chair",
  },
  {
    slug: "loc-bun-parts",
    tag: "styles",
    ratio: "portrait",
    serviceId: "updo-loc-styles",
    alt: "Locs gathered into a high bun over crisply parted, freshly retwisted roots",
  },
  {
    slug: "kids-loc-buns",
    tag: "kids",
    ratio: "portrait",
    serviceId: "senior-kids-service",
    alt: "A child's locs styled into two buns with braided sections through the front",
  },
  {
    slug: "basketweave-parts",
    tag: "retwist",
    ratio: "portrait",
    serviceId: "loc-retwist",
    alt: "A basketweave parting pattern worked across the crown on a fresh loc retwist",
  },
  {
    slug: "red-loc-unit",
    tag: "color",
    ratio: "portrait",
    serviceId: "double-process-full",
    alt: "Long red locs shown full length, the colour carried from root to tip",
  },
  {
    slug: "style-alert",
    tag: "styles",
    ratio: "portrait",
    serviceId: "loc-retwist-barrel",
    alt: "Locs sculpted into a raised style with braided detail through the side",
  },
  {
    slug: "short-loc-style",
    tag: "styles",
    ratio: "portrait",
    serviceId: "loc-retwist",
    alt: "A short set of locs freshly retwisted and styled, photographed smiling in the salon",
  },
  {
    slug: "parts-macro",
    tag: "retwist",
    ratio: "square",
    serviceId: "loc-retwist",
    alt: "Close detail of clean loc partings and tightly retwisted roots after an appointment",
  },
];

/** Client photos taken out in the world rather than in the chair. */
export const LIFESTYLE: { slug: string; alt: string }[] = [
  {
    slug: "client-suit",
    alt: "A Bloom Kreations client in a pinstripe suit with a blonde loc ponytail",
  },
  {
    slug: "client-boymama",
    alt: "A smiling Bloom Kreations client wearing a finished set of invisible locs",
  },
  {
    slug: "client-street",
    alt: "A Bloom Kreations client photographed on a Chicago street with her locs styled up",
  },
  {
    slug: "client-pink",
    alt: "A Bloom Kreations client out in the city wearing her freshly retwisted locs",
  },
  {
    slug: "client-curb",
    alt: "A Bloom Kreations client outdoors with a fresh retwist",
  },
];

export function shotsFor(tag: GalleryTag | "all"): Shot[] {
  return tag === "all" ? GALLERY : GALLERY.filter((s) => s.tag === tag);
}
