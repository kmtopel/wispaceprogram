"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Loads Google Analytics by default (opt-out model). Only suppresses
// tracking when the visitor has explicitly opted out — pre-decision or
// active accept both load GA.
//
// Subscribes to CONSENT_EVENT so flipping the choice via the banner /
// footer link takes effect immediately, no page reload required.
export default function Analytics() {
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    setOptedOut(readConsent() === "rejected");
    const onChange = (e) => setOptedOut(e.detail === "rejected");
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!GA_ID || optedOut) return null;
  return <GoogleAnalytics gaId={GA_ID} />;
}
