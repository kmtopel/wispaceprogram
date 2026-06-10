"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  readConsent,
  setConsent,
} from "@/lib/consent";

// Subtle bottom-right notice that appears on the visitor's first visit
// and stays until they make a choice. EU/GDPR-compliant opt-in: no
// tracking loads until the visitor explicitly clicks Accept. Decline
// has equal visual prominence to satisfy "no dark patterns" guidance.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show on first visit (no localStorage entry) or after the visitor
    // resets via the footer "Cookie preferences" link.
    setOpen(readConsent() === null);
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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-xs sm:max-w-sm bg-background/95 backdrop-blur-sm border border-foreground/15 rounded-lg shadow-lg p-4 text-sm animate-[fadeIn_0.4s_ease-out]"
    >
      <p id="consent-title" className="text-foreground/80 leading-snug">
        We use cookies for anonymous analytics. Pick a choice to continue.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleReject}
          className="flex-1 text-xs font-medium px-3 py-1.5 rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="flex-1 text-xs font-medium px-3 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
