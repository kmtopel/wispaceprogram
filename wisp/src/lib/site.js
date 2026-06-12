// Canonical site URL. Override via NEXT_PUBLIC_SITE_URL when needed
// (e.g. staging environments). Used to build absolute URLs for the
// sitemap, robots.txt, canonical links, and Open Graph metadata.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://wispaceprogram.com"
).replace(/\/$/, "");
