export async function pingIndexNow(
  urls: string[]
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const key = process.env.INDEXNOW_KEY;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hydrosensetx.com";
  const host = new URL(siteUrl).host;
  const keyLocation = `${siteUrl}/indexnow-key`;

  if (!key) {
    console.warn("[indexnow] INDEXNOW_KEY missing, skipping");
    return { ok: false, error: "no_key" };
  }
  if (!urls || urls.length === 0) {
    return { ok: false, error: "no_urls" };
  }

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[indexnow] failed ${res.status}: ${text}`);
      return { ok: false, status: res.status, error: text };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    console.error("[indexnow] network error", err);
    return { ok: false, error: String(err) };
  }
}
