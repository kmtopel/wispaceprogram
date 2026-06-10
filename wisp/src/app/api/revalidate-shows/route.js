import { revalidateTag } from "next/cache";
import { SHOWS_CACHE_TAG } from "@/lib/bandsintown";

// Manual cache buster for Bandsintown shows.
//
// Auth: secret can be passed via either:
//   - Query string: ?secret=YOUR_SECRET
//   - Header:       Authorization: Bearer YOUR_SECRET
//
// In production, REVALIDATE_SECRET MUST be set or all requests are rejected.
// In dev, leaving it unset means the endpoint is open (handy for testing).
//
// Usage examples:
//   Browser:  https://yoursite.com/api/revalidate-shows?secret=...
//   Curl:     curl -X POST https://yoursite.com/api/revalidate-shows \
//                  -H "Authorization: Bearer ..."

function isAuthorized(request) {
  const expected = process.env.REVALIDATE_SECRET;
  // In production, require a configured secret. In dev, allow if unset.
  if (!expected) return process.env.NODE_ENV !== "production";

  const url = new URL(request.url);
  const query = url.searchParams.get("secret");
  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  return query === expected || bearer === expected;
}

async function handle(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(SHOWS_CACHE_TAG);
  return Response.json({
    revalidated: true,
    tag: SHOWS_CACHE_TAG,
    now: new Date().toISOString(),
  });
}

export const POST = handle;
// GET is also supported so editors can trigger by pasting a URL into a
// browser tab. Less secure than POST since the secret ends up in browser
// history — use POST when possible.
export const GET = handle;
