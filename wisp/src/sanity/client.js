import { createClient } from "next-sanity";

const isDev = process.env.NODE_ENV !== "production";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  // CDN is on in production for speed. The Live Content API
  // (see sanity/live.js) bypasses CDN concerns because Sanity pushes
  // content changes to subscribed clients directly — we no longer rely
  // on cache invalidation timing to surface fresh content.
  useCdn: !isDev,
});

// Default fetch options — revalidate every 60s in production, 10s in dev.
// Dev used to be revalidate:0 (no caching) which made every page navigation
// re-query Sanity's live API and dominated TTFB. 10s is short enough that
// edits show up promptly after a refresh, long enough that page-to-page nav
// feels snappy. Tag all queries so we can invalidate them via webhook later.
export const sanityFetchOptions = {
  next: isDev
    ? { revalidate: 10, tags: ["sanity"] }
    : { revalidate: 60, tags: ["sanity"] },
};
