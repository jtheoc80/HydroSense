const DEFAULT_TIME_ZONE = "America/Chicago";

export function formatVisitDate(value: string | Date, timeZone = DEFAULT_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatVisitTime(value: string | Date, timeZone = DEFAULT_TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function shortAddress(address: string): string {
  return address.split(",")[0]?.trim() || address;
}

export function siteVisitMessageKey(kind: string, scheduleVersion: number): string {
  return `${kind}:v${scheduleVersion}`;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com").replace(/\/$/, "");
}

export function customerPortalUrl(token: string): string {
  return `${siteUrl()}/site-visit/${token}`;
}
