import type { QualifyingFlags } from "./scoring";

export async function sendPushNotification(lead: {
  id: string;
  first_name: string;
  last_name: string;
  zip: string;
  carrier?: string;
  lead_score?: number;
  lead_tier?: string;
  qualifying_flags?: QualifyingFlags;
}): Promise<void> {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;

  if (!userKey || !appToken) {
    console.warn("Pushover credentials not configured, skipping push");
    return;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com";

  const isHot = lead.lead_tier === "hot";
  const flags = lead.qualifying_flags;

  let title = isHot ? "HOT lead" : "New lead";
  if (flags?.fire_sprinkler_concern) {
    title = `[SPRINKLER] ${title}`;
  }

  const parts = [
    `${lead.first_name} ${lead.last_name} | ${lead.zip} | ${lead.carrier || "no carrier"} | score ${lead.lead_score ?? 0}`,
  ];
  if (flags) {
    if (flags.install_ready) parts.push("install ready");
    if (flags.needs_electrician) parts.push("needs 110V install");
    if (flags.wifi_extender_needed) parts.push("wifi extender needed");
  }
  const message = parts.join(" | ");

  const res = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: appToken,
      user: userKey,
      title,
      message,
      url: `${siteUrl}/admin/leads`,
      url_title: "View in Admin",
      priority: isHot ? 1 : 0,
      sound: isHot ? "cashregister" : "pushover",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pushover failed (${res.status}): ${text}`);
  }
}
