// Verifies a reCAPTCHA v3 token server-side.
// Returns { ok: true, score } if the token validates and score >= threshold,
// or { ok: false, reason } otherwise.

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_THRESHOLD = 0.5;

export async function verifyRecaptchaToken(token, expectedAction = "newsletter") {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // When no secret is configured, treat as a no-op so dev / captcha-less
  // launches still work. Configure both env vars to enforce.
  if (!secret) return { ok: true, score: 1, skipped: true };
  if (!token) return { ok: false, reason: "Missing reCAPTCHA token." };

  const params = new URLSearchParams({ secret, response: token });
  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    return { ok: false, reason: `Verify request failed: ${res.status}` };
  }

  const data = await res.json();
  if (!data.success) {
    return {
      ok: false,
      reason: `reCAPTCHA rejected: ${(data["error-codes"] || []).join(", ") || "no detail"}`,
    };
  }

  if (data.action && data.action !== expectedAction) {
    return {
      ok: false,
      reason: `action mismatch: expected ${expectedAction}, got ${data.action}`,
    };
  }

  const score = typeof data.score === "number" ? data.score : 1;
  if (score < DEFAULT_THRESHOLD) {
    return { ok: false, reason: `low score: ${score}`, score };
  }

  return { ok: true, score };
}
