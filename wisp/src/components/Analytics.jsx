"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Renders Google Analytics ONLY when:
//   1) NEXT_PUBLIC_GA_ID is configured
//   2) The visitor has explicitly accepted cookies
//
// Subscribes to the custom CONSENT_EVENT so the banner can flip
// consent state at runtime without a page reload.
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
