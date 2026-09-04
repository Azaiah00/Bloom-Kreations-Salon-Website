import type { MetadataRoute } from "next";
import { SITE } from "@/lib/schema";

/**
 * Public pages only. The portal is demo data behind a role picker and carries
 * `robots: noindex`, so it is deliberately absent here too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/services", priority: 0.95, freq: "weekly" },
    { path: "/book", priority: 0.9, freq: "weekly" },
    { path: "/loc-journey", priority: 0.85, freq: "monthly" },
    { path: "/gallery", priority: 0.8, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/faq", priority: 0.7, freq: "monthly" },
    { path: "/visit", priority: 0.65, freq: "monthly" },
    { path: "/policies", priority: 0.4, freq: "monthly" },
  ];

  return pages.map((p) => ({
    url: `${SITE}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
