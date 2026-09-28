import "server-only";

export function parseDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

export function parseBrowser(userAgent: string): string {
  const ua = userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/OPR|Edg/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  if (/OPR\//.test(ua)) return "Opera";
  return "Other";
}

export function parseOS(userAgent: string): string {
  const ua = userAgent;
  if (/Windows/.test(ua)) return "Windows";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Macintosh|Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

const SOURCE_HOST_MAP: { pattern: RegExp; label: string }[] = [
  { pattern: /google\./i, label: "Google" },
  { pattern: /instagram\.com/i, label: "Instagram" },
  { pattern: /facebook\.com|fb\.com/i, label: "Facebook" },
  { pattern: /linkedin\.com/i, label: "LinkedIn" },
  { pattern: /tiktok\.com/i, label: "TikTok" },
  { pattern: /bing\./i, label: "Referral" },
  { pattern: /whatsapp\.com|wa\.me/i, label: "Referral" },
];

/** Categorize a referrer URL into one of the site's traffic-source buckets. */
export function parseTrafficSource(referrer: string | null, siteHost: string): string {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    if (url.hostname.includes(siteHost)) return "Direct";
    const match = SOURCE_HOST_MAP.find((s) => s.pattern.test(url.hostname));
    return match ? match.label : "Referral";
  } catch {
    return "Other";
  }
}

export type GeoInfo = { country: string | null; city: string | null };

/**
 * Coarse geolocation from edge/CDN-provided headers — never from an
 * external lookup call, so every event insert stays fast and free
 * regardless of traffic volume.
 *
 * Different hosts expose this differently, so we try each in turn and
 * degrade to null/null (not an error) when none apply. That's the honest
 * behavior for a plain VPS or a host that doesn't inject geo headers:
 * location analytics simply won't populate there, rather than silently
 * reading a header that will never exist.
 *
 *   Vercel:    x-vercel-ip-country, x-vercel-ip-city
 *   Cloudflare: cf-ipcountry (country only — city isn't in the plain proxy headers)
 *   Netlify:   x-nf-geo (base64-encoded JSON: { country: { code }, city, ... })
 */
export function parseGeoFromHeaders(headers: Headers): GeoInfo {
  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return {
      country: decodeHeader(vercelCountry),
      city: decodeHeader(headers.get("x-vercel-ip-city")),
    };
  }

  const netlifyGeo = headers.get("x-nf-geo");
  if (netlifyGeo) {
    try {
      const decoded = JSON.parse(Buffer.from(netlifyGeo, "base64").toString("utf-8"));
      return {
        country: decoded?.country?.code ?? null,
        city: decoded?.city ?? null,
      };
    } catch {
      // fall through
    }
  }

  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX") {
    return { country: cfCountry, city: null };
  }

  return { country: null, city: null };
}

function decodeHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
