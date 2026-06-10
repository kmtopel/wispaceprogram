// Live Content API integration via next-sanity's defineLive helper.
//
// This replaces the manual webhook + revalidateTag plumbing for Sanity
// content. Instead:
//   1. `sanityFetch` is used in server components — Sanity tags the
//      response so it can be invalidated remotely.
//   2. `<SanityLive />` (mounted once in the root layout) opens an SSE
//      connection from the visitor's browser to Sanity. When content
//      changes, Sanity pushes a notification and the component triggers
//      a re-fetch of the affected RSCs. Updates appear without a reload.
//
// No webhook secret to manage, no cache layers to coordinate. Content
// changes appear within ~1 second for every visitor on the page.

import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  // Pin to a specific Sanity API version. The Live Content API requires
  // a recent version — bump this when adopting new features.
  client: client.withConfig({ apiVersion: "2024-08-15" }),
  // A server-only token isn't required for published content, but adding
  // one lets the live preview surface drafts when draftMode is enabled.
  // Leave both unset to start; we can add later.
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});
