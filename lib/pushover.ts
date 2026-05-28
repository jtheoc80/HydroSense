export async function sendPushNotification(lead: {
  id: string;
  first_name: string;
  last_name: string;
  zip: string;
  carrier?: string;
}): Promise<void> {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;

  if (!userKey || !appToken) {
    console.warn("Pushover credentials not configured, skipping push");
    return;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com";

  const message =
    `NEW LEAD: ${lead.first_name} ${lead.last_name} | ${lead.zip} | ${lead.carrier || "no carrier"} | tap to view in admin`;

  const res = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: appToken,
      user: userKey,
      title: "HydroSense Lead",
      message,
      url: `${siteUrl}/admin/leads`,
      url_title: "View in Admin",
      priority: 1,
      sound: "cashregister",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pushover failed (${res.status}): ${text}`);
  }
}
