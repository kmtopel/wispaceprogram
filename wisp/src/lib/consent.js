// Tiny consent layer for cookie/analytics opt-in.
// Stores the visitor's choice in localStorage under a single key.
// "accepted" -> load GA and any other tracking
// "rejected" -> load nothing
// (no value) -> banner is shown, nothing tracked

export const CONSENT_KEY = "wisp:consent:v1";
export const CONSENT_EVENT = "wisp:consent-changed";

export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    // Notify anyone listening (Analytics component, footer link, etc.).
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  } catch {
    /* localStorage disabled — silently ignore */
  }
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  } catch {
    /* no-op */
  }
}
