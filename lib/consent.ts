// Client-side analytics consent. Stored in localStorage as a per-browser
// preference (not personal data, and never sent anywhere). Until a visitor
// explicitly accepts, NO analytics fires — neither our own event beacon nor
// Google Analytics. "Decline" is remembered too, so they aren't re-asked
// on every page.

export type ConsentValue = "granted" | "denied";

const KEY = "koraq_analytics_consent";
export const CONSENT_EVENT = "koraq:consent-changed";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked — treat as no consent stored; analytics stays off.
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }
}
