"use client";

// Two independent, safe-no-op tracking paths:
//  1. gtag — only fires if NEXT_PUBLIC_GA_ID is set and the script loaded.
//  2. our own /api/analytics/event beacon — only persists if DATABASE_URL is
//     set server-side; the fetch itself is always attempted (cheap, fire and
//     forget) but failures are swallowed so a slow/blocked request never
//     affects the page.

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export type AnalyticsEvent =
  | "cta_click"
  | "whatsapp_click"
  | "contact_form_submit"
  | "portfolio_click"
  | "pricing_view"
  | "service_view"
  | "project_start"
  | "page_view";

const SESSION_KEY = "koraq_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage unavailable (privacy mode, etc.) — fall back to a
    // per-call id rather than throwing.
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function trackEvent(event: AnalyticsEvent, params?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }

  try {
    const payload = JSON.stringify({
      event,
      sessionId: getSessionId(),
      page: window.location.pathname,
      metadata: params ?? null,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
    } else {
      fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Never let analytics break the page.
  }
}
