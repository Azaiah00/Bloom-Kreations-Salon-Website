import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/business";

/**
 * Web app manifest. Not a PWA ambition — it is what gives the site a proper name,
 * icon and theme colour when someone saves it to a phone home screen, which is
 * exactly what a client does after their first appointment.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BUSINESS.name} — Loctician in Bridgeport, Chicago`,
    short_name: BUSINESS.name,
    description:
      "Locs, retwists, starter locs and protective styles in Bridgeport, Chicago. Every price published. Book online.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fdf6ee",
    theme_color: "#fdf6ee",
    orientation: "portrait",
    categories: ["lifestyle", "shopping"],
    lang: "en-US",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book an appointment", url: "/book" },
      { name: "Services and prices", url: "/services" },
      { name: "The loc journey", url: "/loc-journey" },
    ],
  };
}
