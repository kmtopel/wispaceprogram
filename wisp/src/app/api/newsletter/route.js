import { NextResponse } from "next/server";
import { subscribeContact } from "@/lib/brevo";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

// Newsletter signup endpoint.
// Expects: POST { email: string, recaptchaToken?: string }
// Returns: 200 { ok: true } or 400/500 { ok: false, error: string }

// Lightweight email format check — server-side validation, the client also
// validates via input[type=email] but we don't trust that.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const email = (body?.email || "").trim().toLowerCase();
  const recaptchaToken = body?.recaptchaToken;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // reCAPTCHA gate. No-op when RECAPTCHA_SECRET_KEY isn't configured.
  const captcha = await verifyRecaptchaToken(recaptchaToken, "newsletter");
  if (!captcha.ok) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 400 },
    );
  }

  const result = await subscribeContact({
    email,
    listId: process.env.BREVO_LIST_ID,
  });

  if (!result.ok) {
    // Don't leak internal error details to the client; log on the server.
    console.error("Brevo subscribe failed:", result);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't sign you up right now. Try again in a moment, or email us directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
