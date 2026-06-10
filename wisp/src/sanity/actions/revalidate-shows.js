"use server";

import { revalidateTag } from "next/cache";
import { SHOWS_CACHE_TAG } from "@/lib/bandsintown";

// Server Action invoked from the Sanity Studio's custom "Refresh Shows" tool.
//
// Security model: Next.js Server Actions have built-in CSRF protection — they
// can only be invoked from same-origin pages with a valid CSRF token. Random
// external sites can't trigger this; the calling page has to be served by
// this Next.js app. The Studio is served from /studio on this same app, so
// it can call this. End users who somehow find the action route can't invoke
// it without first loading a page on this domain that imported the action.
//
// Combined with the fact that the Studio button is only visible after a
// successful Sanity login, this is "good enough" for a non-destructive
// cache-bust endpoint.
export async function revalidateShowsAction() {
  revalidateTag(SHOWS_CACHE_TAG);
  return { ok: true, revalidatedAt: new Date().toISOString() };
}
