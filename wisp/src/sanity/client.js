import { createClient } from "next-sanity";

const isDev = process.env.NODE_ENV !== "production";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  // CDN is off in both dev and prod. Reason: we already cache at the
  // Next.js fetch layer (10s/60s revalidate + the webhook-driven manual
  // revalidate). Stacking Sanity's CDN cache on top means rapid edits
  // can still hit stale data because the CDN has its own ~60s window
  // that the webhook doesn't invalidate.
  useCdn: false,
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
