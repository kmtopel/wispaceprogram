import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "node:crypto";

// Sanity webhook receiver. Sanity calls this endpoint whenever content
// changes (configured per-dataset in sanity.io/manage). We verify the
// signature with the shared secret, then bust our Sanity fetch cache so
// the next pageview re-fetches fresh content within ~1s.
//
// Setup (one-time, in sanity.io/manage → GROQ-powered Webhooks):
//   URL:       https://wispaceprogram.com/api/sanity-webhook
//   Dataset:   production
//   Trigger:   On all (create, update, delete)
//   Filter:    (blank — fire on every mutation)
//   Projection:(blank — we don't read the body, only verify the secret)
//   HTTP method: POST
//   API version: v2024-01-01
//   Secret:    <a long random string, also set as SANITY_WEBHOOK_SECRET
//              in Vercel env vars>

const SANITY_TAG = "sanity";

export async function POST(request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    // No secret configured — refuse rather than accepting unauthenticated
    // cache busts that could be used to grief us.
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured." },
      { status: 500 },
    );
  }

  const signatureHeader = request.headers.get("sanity-webhook-signature");
  if (!signatureHeader) {
    return NextResponse.json(
      { ok: false, error: "Missing signature header." },
      { status: 401 },
    );
  }

  // Sanity sends `t=<unix_ts>,v1=<hmac_sha256_hex>`.
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k.trim(), (v || "").trim()];
    }),
  );
  const timestamp = parts.t;
  const provided = parts.v1;
  if (!timestamp || !provided) {
    return NextResponse.json(
      { ok: false, error: "Malformed signature header." },
      { status: 401 },
    );
  }

  const rawBody = await request.text();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  // Constant-time comparison to defeat timing attacks.
  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(provided, "hex");
  if (
    expectedBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, providedBuf)
  ) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature." },
      { status: 401 },
    );
  }

  // Signature valid → bust the Sanity cache. Every Sanity fetch in this app
  // is tagged "sanity" (see sanityFetchOptions), so this single call
  // invalidates everything.
  revalidateTag(SANITY_TAG);

  return NextResponse.json({ ok: true, revalidated: SANITY_TAG });
}

// Reject anything that's not a POST.
export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Use POST." },
    { status: 405 },
  );
}
