"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Loads the reCAPTCHA v3 script once, on demand. Subsequent calls return
// the already-loaded promise. Loaded lazily (on first form interaction)
// so we don't pay the cost on every page.
let recaptchaPromise = null;
function loadRecaptcha() {
  if (!RECAPTCHA_SITE_KEY) return Promise.resolve(null);
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.grecaptcha) return Promise.resolve(window.grecaptcha);
  if (recaptchaPromise) return recaptchaPromise;

  recaptchaPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.grecaptcha?.ready(() => resolve(window.grecaptcha));
    script.onerror = () =>
      reject(new Error("Failed to load reCAPTCHA script"));
    document.head.appendChild(script);
  });
  return recaptchaPromise;
}

// Reusable newsletter signup form. Used by both the page block and the
// site footer — visual styling lives here, the surrounding container's
// className handles layout/positioning.
export default function NewsletterForm({
  buttonLabel = "Subscribe",
  successMessage = "Thanks — you're on the list.",
  placeholder = "you@example.com",
  // Compact mode flattens to a single row (input + button side by side).
  compact = false,
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const inputId = useId();

  // Kick off the reCAPTCHA load as soon as the user focuses the field, so
  // by the time they submit the script is usually ready.
  const ensureLoaded = useRef(false);
  const handleFocus = useCallback(() => {
    if (ensureLoaded.current) return;
    ensureLoaded.current = true;
    loadRecaptcha().catch(() => {
      /* swallow — submit will surface a clearer error */
    });
  }, []);

  // Hide reCAPTCHA's floating badge globally; we'll show the required
  // attribution text in the form's helper line instead.
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    const style = document.createElement("style");
    style.textContent = ".grecaptcha-badge { visibility: hidden; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    let recaptchaToken = null;
    try {
      const grecaptcha = await loadRecaptcha();
      if (grecaptcha && RECAPTCHA_SITE_KEY) {
        recaptchaToken = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action: "newsletter",
        });
      }
    } catch {
      // If reCAPTCHA fails to load, we still try — the server will reject
      // in production but accept in dev (with no secret configured).
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-foreground/80" role="status">
        {successMessage}
      </p>
    );
  }

  const wrap = compact
    ? "flex flex-col sm:flex-row gap-2"
    : "flex flex-col gap-3 max-w-md mx-auto";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className={wrap}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="email"
          disabled={status === "submitting"}
          className="flex-1 px-4 py-2.5 rounded-full bg-foreground/5 border border-foreground/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {status === "submitting" ? "…" : buttonLabel}
        </button>
      </div>

      {status === "error" && (
        <p
          className="mt-2 text-sm text-red-400"
          role="alert"
          aria-live="polite"
        >
          {errorMsg}
        </p>
      )}

      {RECAPTCHA_SITE_KEY && (
        <p className="mt-2 text-xs text-foreground/40 leading-snug">
          Protected by reCAPTCHA —{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Privacy
          </a>{" "}
          &amp;{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Terms
          </a>
          .
        </p>
      )}
    </form>
  );
}
