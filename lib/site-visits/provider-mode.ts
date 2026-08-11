export function siteVisitProviderMode(env: Record<string, string | undefined> = process.env): "live" | "mock" {
  if (env.SITE_VISIT_PROVIDER_MODE === "mock") return "mock";
  if (env.SITE_VISIT_PROVIDER_MODE === "live") return "live";
  if (env.VERCEL_ENV) return env.VERCEL_ENV === "production" ? "live" : "mock";
  return env.NODE_ENV === "production" ? "live" : "mock";
}

export function mockProviderMessageId(channel: "sms" | "email" | "push", seed: string): string {
  return `mock-${channel}-${seed}`;
}
