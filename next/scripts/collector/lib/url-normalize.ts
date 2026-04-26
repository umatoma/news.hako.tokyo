const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "mc_cid",
  "mc_eid",
  "yclid",
  "msclkid",
]);

export function normalizeUrlForDedup(rawUrl: string): string {
  const u = new URL(rawUrl);

  if (u.pathname.length > 1 && u.pathname.endsWith("/")) {
    u.pathname = u.pathname.slice(0, -1);
  }

  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(key.toLowerCase())) {
      u.searchParams.delete(key);
    }
  }

  u.searchParams.sort();
  u.hash = "";

  return u.toString();
}
