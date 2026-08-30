import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Everything is a local WebP already sized for the layout; these widths
    // match the `sizes` attributes actually used on the site.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [128, 256, 384, 512],
  },
  poweredByHeader: false,
  // Trailing slashes off keeps the canonical URLs in the sitemap and the
  // metadata `alternates` identical to what the router actually serves.
  trailingSlash: false,
};

export default nextConfig;
