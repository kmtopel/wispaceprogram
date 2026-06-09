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

// Default fetch options — revalidate every 60s in production, no caching in dev.
// Tag all Sanity queries so we can invalidate them via webhook later.
export const sanityFetchOptions = {
  next: isDev
    ? { revalidate: 0 }
    : { revalidate: 60, tags: ["sanity"] },
};
