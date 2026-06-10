"use client";

import { clearConsent } from "@/lib/consent";

// Footer link that resets the visitor's stored consent choice, which
// triggers the ConsentBanner to reopen. Server-rendered as a button so
// non-JS visitors still see it (they just can't click it usefully).
export default function CookiePreferencesLink() {
  return (
    <button
      type="button"
      onClick={() => clearConsent()}
      className="underline underline-offset-2 hover:opacity-70 transition-opacity"
    >
      Cookie preferences
    </button>
  );
}
