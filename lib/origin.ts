// Edge-safe same-origin check shared by middleware.ts and any /api route
// that performs a state-changing action. A cross-site page can't forge an
// Origin/Referer header matching this host, which blocks classic CSRF.
export function hasValidOrigin(method: string, headers: Headers): boolean {
  const m = method.toUpperCase();
  if (m === "GET" || m === "HEAD" || m === "OPTIONS") return true;

  const host = headers.get("host");
  const candidate = headers.get("origin") ?? headers.get("referer");
  if (!host || !candidate) return false;

  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}
