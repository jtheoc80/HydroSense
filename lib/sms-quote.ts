export async function sendQuoteSms(quote: {
  customer_first_name: string;
  customer_phone?: string | null;
  public_token: string;
  expires_at: string;
}): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || (!messagingServiceSid && !from)) {
    console.warn("[sms-quote] Twilio not configured, skipping");
    return;
  }

  if (!quote.customer_phone || quote.customer_phone.trim().length < 10) {
    console.warn("[sms-quote] No valid phone, skipping");
    return;
  }

  const phone = quote.customer_phone.replace(/\D/g, "");
  const to = phone.startsWith("1") ? `+${phone}` : `+1${phone}`;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hydrosensetx.com";
  const quoteUrl = `${siteUrl}/quote/${quote.public_token}`;
  const expiresDate = new Date(quote.expires_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const body = `${quote.customer_first_name}, your HydroSense quote is ready: ${quoteUrl} — valid through ${expiresDate}. Reply STOP to opt out.`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams();
  params.set("To", to);
  if (messagingServiceSid) {
    params.set("MessagingServiceSid", messagingServiceSid);
  } else {
    params.set("From", from!);
  }
  params.set("Body", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio SMS failed (${res.status}): ${text}`);
  }
}
