import { createClient } from "next-sanity";

const isDev = process.env.NODE_ENV !== "production";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  // CDN is fast but has ~1min lag. Off in dev so edits show immediately;
  // in production we use the CDN for speed and revalidate on a short TTL.
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
