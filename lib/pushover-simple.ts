// Simplified Pushover helper for non-lead notifications (payments, installs, etc.)

export async function sendPushover(opts: {
  title: string;
  message: string;
  priority?: number;
  url?: string;
  url_title?: string;
}): Promise<void> {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;
  if (!userKey || !appToken) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com";

  await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: appToken,
      user: userKey,
      title: opts.title,
      message: opts.message,
      url: opts.url || `${siteUrl}/admin/quotes`,
      url_title: opts.url_title || "View in Admin",
      priority: opts.priority ?? 1,
      sound: "cashregister",
    }),
  });
}
