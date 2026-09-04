/**
 * JSON-LD. Every value is read from `business.ts`, so the structured data and
 * the visible page can never disagree — which is the thing Google actually
 * penalises.
 *
 * Deliberately absent: any `hasCredential`, licence or certification property.
 * See the credential note in HANDOFF.md.
 */

import {
  BUSINESS,
  HOURS,
  SERVICES,
  SERVICE_CATEGORIES,
  REVIEWS,
  PRICE_RANGE,
} from "./business";
import { LOC_STAGES } from "./db";

/** Live deployment URL — drives metadataBase, JSON-LD, sitemap and robots. */
export const SITE = "https://bloomkreations-preview.netlify.app";
const ID = `${SITE}/#business`;
export const BUSINESS_SCHEMA_ID = ID;

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": ID,
    name: BUSINESS.legalName,
    alternateName: BUSINESS.name,
    url: SITE,
    telephone: BUSINESS.phone,
    priceRange: `$${PRICE_RANGE.min}–$${PRICE_RANGE.max}`,
    currenciesAccepted: "USD",
    image: `${SITE}/opengraph-image`,
    description:
      "Loc studio in Bridgeport, Chicago. Starter locs, retwists, loc extensions, protective styles and colour, with every price published.",
    slogan: "Healthy locs. Happy crown.",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    hasMap: BUSINESS.googleMapsUrl,
    openingHoursSpecification: HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.open,
      closes: h.close,
    })),
    sameAs: [BUSINESS.social.instagram, BUSINESS.social.instagramPersonal],
    founder: {
      "@type": "Person",
      name: BUSINESS.owner.name,
      jobTitle: BUSINESS.owner.role,
    },
    employee: {
      "@type": "Person",
      name: BUSINESS.owner.name,
      jobTitle: BUSINESS.owner.role,
    },
    areaServed: [
      { "@type": "City", name: "Chicago" },
      { "@type": "Place", name: "Bridgeport, Chicago" },
      { "@type": "Place", name: "Canaryville, Chicago" },
      { "@type": "Place", name: "Bronzeville, Chicago" },
      { "@type": "Place", name: "Pilsen, Chicago" },
      { "@type": "Place", name: "Hyde Park, Chicago" },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: BUSINESS.rating.value,
      reviewCount: BUSINESS.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: REVIEWS.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.quote,
    })),
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      name: s.name,
      price: s.priceUsd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.blurb,
        serviceType:
          SERVICE_CATEGORIES.find((c) => c.id === s.category)?.name ?? "Hair Salon",
        provider: { "@id": ID },
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bloom Kreations service menu",
      itemListElement: SERVICE_CATEGORIES.map((cat) => ({
        "@type": "OfferCatalog",
        name: cat.name,
        itemListElement: SERVICES.filter((s) => s.category === cat.id).map((s) => ({
          "@type": "Offer",
          name: s.name,
          price: s.priceUsd,
          priceCurrency: "USD",
        })),
      })),
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/book`,
        inLanguage: "en-US",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "Reservation", name: "Appointment at Bloom Kreations" },
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Bloom Kreations",
    publisher: { "@id": ID },
    inLanguage: "en-US",
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

/**
 * FAQPage. These answers are written answer-first with the business name next to
 * the claim, which is what both featured snippets and answer engines lift.
 */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** The loc journey as a HowTo — the education page's ranking asset. */
export function locJourneySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "The four stages of a loc journey",
    description:
      "What happens to your hair at each stage of locking, how long each stage lasts, and what maintenance it needs.",
    totalTime: "P730D",
    step: LOC_STAGES.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `${s.name} stage (${s.window})`,
      text: `${s.headline} ${s.body} Watch out for: ${s.watchOut}`,
      url: `${SITE}/loc-journey#${s.id}`,
    })),
  };
}

export function serviceListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bloom Kreations service menu and prices",
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.blurb,
        provider: { "@id": ID },
        offers: {
          "@type": "Offer",
          price: s.priceUsd,
          priceCurrency: "USD",
        },
      },
    })),
  };
}
