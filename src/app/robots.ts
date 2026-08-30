import type { MetadataRoute } from "next";

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
    sitemap: "https://bloomkreations.com/sitemap.xml",
    host: "https://bloomkreations.com",
  };
}
