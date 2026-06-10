"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Loads Google Analytics ONLY after the visitor explicitly accepts the
// cookie banner. GDPR-compliant: no tracking before opt-in, no
// pre-checked boxes, easy to revoke via the footer link.
//
// Subscribes to CONSENT_EVENT so a freshly-clicked Accept/Decline takes
// effect immediately without a page reload.
export default function Analytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(readConsent() === "accepted");
    const onChange = (e) => setAccepted(e.detail === "accepted");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!GA_ID || !accepted) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
