import { sanityFetch } from "@/sanity/live";
import { allPagesQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/site";

// Next.js auto-serves this at /sitemap.xml. Listed pages get indexed by
// search engines; anything not here (or blocked by robots.txt) won't.
export default async function sitemap() {
  const { data: pages } = await sanityFetch({ query: allPagesQuery });

  const entries = (pages || []).map((p) => {
    const url =
      p.slug === "home" ? SITE_URL : `${SITE_URL}/${p.slug}`;
    return {
      url,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      // Homepage gets bumped priority; other pages share a default
      priority: p.slug === "home" ? 1.0 : 0.7,
      changeFrequency: p.slug === "home" ? "weekly" : "monthly",
    };
  });

  return entries;
}
