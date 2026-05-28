export async function postWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.LEAD_AUTOMATION_WEBHOOK;

  if (!url) {
    console.warn("LEAD_AUTOMATION_WEBHOOK not configured, skipping webhook");
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Webhook failed (${res.status}): ${text}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
