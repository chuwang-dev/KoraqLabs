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
