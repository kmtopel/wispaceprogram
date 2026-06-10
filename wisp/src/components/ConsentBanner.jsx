"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  readConsent,
  setConsent,
} from "@/lib/consent";

// Visible only when consent hasn't been recorded yet (or after the user
// clicks the footer "Cookie preferences" link to reopen it). Sticky bar
// at the bottom of the viewport with Accept / Reject actions.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render after mount — SSR doesn't know the visitor's choice,
  // and we don't want to flash the banner for returning visitors.
  useEffect(() => {
    setMounted(true);
    setOpen(readConsent() === null);
    // Listen for clearConsent() being called from elsewhere (e.g., the
    // footer "Cookie preferences" link), so the banner can reopen.
    const onChange = (e) => setOpen(e.detail === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!mounted || !open) return null;

  const handleAccept = () => {
    setConsent("accepted");
    setOpen(false);
  };
  const handleReject = () => {
    setConsent("rejected");
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-3xl mx-auto bg-background border border-foreground/15 rounded-lg shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 text-sm">
          <p id="consent-title" className="font-semibold mb-1">
            Cookies
          </p>
          <p className="text-foreground/70 leading-relaxed">
            We use Google Analytics to understand how visitors find and use
            the site. Nothing about you personally — just anonymized
            patterns. You can decline; the site works the same either way.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="px-4 py-2 rounded-full text-sm font-medium border border-foreground/20 hover:bg-foreground/5 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
