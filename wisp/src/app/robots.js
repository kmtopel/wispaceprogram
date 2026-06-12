import { SITE_URL } from "@/lib/site";

// Next.js auto-serves this at /robots.txt. Allow everything public,
// block Studio + API routes (which aren't useful to index and could
// expose internals).
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
