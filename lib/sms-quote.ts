import {
  safeQuoteDeliveryError,
  type QuoteDeliveryResult,
} from "./quote-delivery";

export async function sendQuoteSms(quote: {
  customer_first_name: string;
  customer_phone?: string | null;
  public_token: string;
  expires_at: string;
  quote_number?: string;
  total?: number;
  line_items?: { sku: string; name: string; unit_price: number }[];
  notes_internal?: string | null;
}): Promise<QuoteDeliveryResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const from = process.env.TWILIO_FROM_NUMBER;
  const suppliedRecipient = quote.customer_phone?.trim() || "";

  if (!sid || !token || (!messagingServiceSid && !from)) {
    console.warn("[sms-quote] Twilio not configured, skipping");
    return {
      channel: "sms",
      provider: "twilio",
      recipient: suppliedRecipient,
      copyRecipient: null,
      status: "skipped",
      providerMessageId: null,
      providerStatus: "not_configured",
      error: "Twilio is not configured",
    };
  }

  if (!quote.customer_phone || quote.customer_phone.trim().length < 10) {
    console.warn("[sms-quote] No valid phone, skipping");
    return {
      channel: "sms",
      provider: "twilio",
      recipient: suppliedRecipient,
      copyRecipient: null,
      status: "skipped",
      providerMessageId: null,
      providerStatus: "invalid_recipient",
      error: "No valid customer phone number",
    };
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

  let body: string;
  if (quote.total != null && quote.line_items?.length) {
    const installItem = quote.line_items.find(
      (lineItem) => lineItem.sku !== "SUB-PRO-MO" && lineItem.unit_price > 0
    );
    const subscriptionItem = quote.line_items.find(
      (lineItem) => lineItem.sku === "SUB-PRO-MO"
    );
    const installPrice = installItem ? `$${installItem.unit_price}` : `$${quote.total}`;

    const parts = [
      `${quote.customer_first_name}, your HydroSense quote is ready: ${quoteUrl}`,
    ];

    if (subscriptionItem) {
      parts.push(
        `— ${installItem?.name || "Install"} ${installPrice}, drops to $${quote.total} with our Pro monitoring at $${subscriptionItem.unit_price}/mo.`
      );
    } else {
      parts.push(`— ${installItem?.name || "Install"} ${installPrice}.`);
    }

    parts.push(`Valid through ${expiresDate}.`);
    parts.push("— Jimmy, Texas Master Plumber MPL 43057. Reply STOP to opt out.");
    body = parts.join(" ");
  } else {
    body = `${quote.customer_first_name}, your HydroSense quote is ready: ${quoteUrl} — valid through ${expiresDate}. — Jimmy, Texas Master Plumber MPL 43057. Reply STOP to opt out.`;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const params = new URLSearchParams();
  params.set("To", to);
  if (messagingServiceSid) {
    params.set("MessagingServiceSid", messagingServiceSid);
  } else {
    params.set("From", from!);
  }
  params.set("Body", body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const responseText = await response.text();
      let providerError = responseText;
      try {
        const parsed = JSON.parse(responseText) as { message?: string };
        providerError = parsed.message || responseText;
      } catch {
        // Keep the text response when Twilio did not return JSON.
      }

      return {
        channel: "sms",
        provider: "twilio",
        recipient: to,
        copyRecipient: null,
        status: "failed",
        providerMessageId: null,
        providerStatus: String(response.status),
        error: safeQuoteDeliveryError(
          new Error(`Twilio SMS failed (${response.status}): ${providerError}`)
        ),
      };
    }

    const payload = (await response.json()) as { sid?: string; status?: string };
    if (!payload.sid) {
      return {
        channel: "sms",
        provider: "twilio",
        recipient: to,
        copyRecipient: null,
        status: "failed",
        providerMessageId: null,
        providerStatus: payload.status || "invalid_response",
        error: "Twilio accepted the request without returning a message ID",
      };
    }

    return {
      channel: "sms",
      provider: "twilio",
      recipient: to,
      copyRecipient: null,
      status: "sent",
      providerMessageId: payload.sid,
      providerStatus: payload.status || "accepted",
      error: null,
    };
  } catch (error) {
    return {
      channel: "sms",
      provider: "twilio",
      recipient: to,
      copyRecipient: null,
      status: "failed",
      providerMessageId: null,
      providerStatus: "request_failed",
      error: safeQuoteDeliveryError(error),
    };
  }
}
