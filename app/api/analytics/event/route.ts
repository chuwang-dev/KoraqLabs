import { NextResponse, type NextRequest } from "next/server";
import { safeQuery } from "@/lib/db";
import { parseBrowser, parseDevice, parseGeoFromHeaders, parseOS, parseTrafficSource } from "@/lib/request-meta";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "whatsapp_click",
  "contact_form_submit",
  "portfolio_click",
  "pricing_view",
  "service_view",
  "project_start",
]);

export async function POST(request: NextRequest) {
  let body: {
    event?: string;
    sessionId?: string;
    page?: string;
    metadata?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { event, sessionId, page, metadata } = body;

  if (!event || !ALLOWED_EVENTS.has(event) || !sessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? null;
  let siteHost = "koraqlabs.com";
  try {
    siteHost = new URL(siteConfig.url).hostname;
  } catch {
    // keep default
  }

  // Coarse geolocation from edge headers only — see lib/request-meta.ts for
  // which hosts provide this and how it degrades on ones that don't. No IP
  // address is ever stored, and no external geolocation call is made.
  const { country, city } = parseGeoFromHeaders(request.headers);

  await safeQuery(
    `insert into analytics_events (event_name, session_id, page, source, device, browser, os, country, city, metadata)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      event,
      sessionId,
      page ?? null,
      parseTrafficSource(referrer, siteHost),
      parseDevice(userAgent),
      parseBrowser(userAgent),
      parseOS(userAgent),
      country,
      city,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );

  return NextResponse.json({ ok: true });
}
