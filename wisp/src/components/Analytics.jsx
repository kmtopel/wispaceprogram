"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Routes we never want to track. Studio editing sessions would otherwise
// pollute the real-visitor stats — every block edit triggers a route
// change inside /studio/*.
const IGNORED_PATH_PREFIXES = ["/studio"];

function isIgnored(pathname) {
  if (!pathname) return false;
  return IGNORED_PATH_PREFIXES.some((p) => pathname.startsWith(p));
}

// Loads Google Analytics ONLY after the visitor explicitly accepts the
// cookie banner. GDPR-compliant: no tracking before opt-in, no
// pre-checked boxes, easy to revoke via the footer link.
//
// Also skips tracking entirely on internal routes (Studio editing) so
// editor activity doesn't show up as visitor traffic.
//
// Subscribes to CONSENT_EVENT so a freshly-clicked Accept/Decline takes
// effect immediately without a page reload.
export default function Analytics() {
  const pathname = usePathname();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(readConsent() === "accepted");
    const onChange = (e) => setAccepted(e.detail === "accepted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!GA_ID || !accepted || isIgnored(pathname)) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
