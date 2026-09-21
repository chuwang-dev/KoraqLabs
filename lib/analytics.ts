"use client";

// Thin wrapper around gtag so tracking calls are safe no-ops when analytics
// is not configured (no NEXT_PUBLIC_GA_ID set).

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export type AnalyticsEvent =
  | "cta_click"
  | "whatsapp_click"
  | "contact_form_submit"
  | "portfolio_click"
  | "page_view";

export function trackEvent(event: AnalyticsEvent, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag !== "function") return;
  w.gtag("event", event, params);
}
