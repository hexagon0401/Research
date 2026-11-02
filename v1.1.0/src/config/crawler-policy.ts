/** A committed absolute window: rebuilds and redeployments cannot renew it. */
export function crawlerRules(
  now: number,
  window: { activatedAt?: unknown; expiresAt?: unknown },
) {
  const start =
    typeof window.activatedAt === "string"
      ? Date.parse(window.activatedAt)
      : NaN;
  const end =
    typeof window.expiresAt === "string" ? Date.parse(window.expiresAt) : NaN;
  const open =
    Number.isFinite(now) &&
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    end - start === 72 * 60 * 60 * 1000 &&
    now >= start &&
    now < end;
  return open
    ? { userAgent: "*", allow: "/", disallow: ["/api/", "/originals/"] }
    : { userAgent: "*", disallow: "/" };
}
