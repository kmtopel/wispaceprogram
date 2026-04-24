import { revalidateTag } from "next/cache";
import { SHOWS_CACHE_TAG } from "@/lib/bandsintown";

// POST /api/revalidate-shows?secret=...
// Busts the Bandsintown shows cache so the next pageview refetches.
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  const { searchParams } = new URL(request.url);

  if (secret && searchParams.get("secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SHOWS_CACHE_TAG);

  return Response.json({
    revalidated: true,
    tag: SHOWS_CACHE_TAG,
    now: new Date().toISOString(),
  });
}

// Convenience: allow GET too for easy manual trigger from a browser while developing.
// In production, prefer POST with the secret query param.
export const GET = POST;
