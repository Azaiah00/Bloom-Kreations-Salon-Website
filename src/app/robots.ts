import type { MetadataRoute } from "next";
import { SITE } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The portal is a demo on sample data — nothing there should be indexed.
        disallow: ["/portal", "/portal/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
