import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import SmoothScroll from "@/components/motion/SmoothScroll";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { BUSINESS } from "@/lib/business";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";

/**
 * Fonts are self-hosted rather than fetched from Google, so the site makes no
 * third-party request for type and keeps working behind any network.
 *
 * Fraunces ships one file per axis combination. We use the SOFT + wght build
 * (62 KB roman, 78 KB italic) rather than the full 121/150 KB build, because
 * SOFT is the axis the design actually sets — see DESIGN.md §3. Dropping the
 * unused opsz and WONK axes saves ~130 KB across the pair.
 */
const fraunces = localFont({
  src: [
    {
      path: "../fonts/fraunces-latin-soft-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/fraunces-latin-soft-italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["ui-serif", "Georgia", "serif"],
  // Tuned so the fallback occupies close to the same space and swap does not
  // shove the hero headline around.
  adjustFontFallback: "Times New Roman",
});

const jakarta = localFont({
  src: [
    {
      path: "../fonts/plus-jakarta-sans-latin-wght-normal.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "../fonts/plus-jakarta-sans-latin-wght-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-jakarta",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bloomkreations.com"),
  title: {
    default: "Bloom Kreations | Loctician in Bridgeport, Chicago",
    template: "%s | Bloom Kreations",
  },
  description:
    "Locs, retwists, starter locs and protective styles in Bridgeport, Chicago. Latesha Reed at Bloom Kreations — 4.8 stars from 60 Google reviews. Every price published. Book online.",
  keywords: [
    "loctician Chicago",
    "locs Chicago",
    "retwist Chicago",
    "starter locs Chicago",
    "traveling loctician Chicago",
    "loc extensions Chicago",
    "invisible locs Chicago",
    "soft locs Chicago",
    "butterfly locs Chicago",
    "Bridgeport hair salon",
    "Black owned hair salon Chicago",
  ],
  authors: [{ name: BUSINESS.owner.name }],
  creator: BUSINESS.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bloom Kreations",
    title: "Bloom Kreations | Loctician in Bridgeport, Chicago",
    description:
      "Locs, retwists, starter locs and protective styles in Bridgeport, Chicago. Every price published. Book online.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bloom Kreations — loctician in Bridgeport, Chicago",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloom Kreations | Loctician in Bridgeport, Chicago",
    description:
      "Locs, retwists, starter locs and protective styles in Bridgeport, Chicago. Every price published.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Hair Salon",
};

export const viewport: Viewport = {
  themeColor: "#fdf6ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} no-js`}
      suppressHydrationWarning
    >
      <body>
        {/* Structured data. Every value comes from src/lib/business.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessSchema(), websiteSchema()]),
          }}
        />

        <a
          href="#main"
          className="sr-only rounded-pill focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-rose focus:px-5 focus:py-3 focus:font-semibold focus:text-cream"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
