import { Resend } from "resend";
import {
  safeQuoteDeliveryError,
  type QuoteDeliveryResult,
} from "./quote-delivery";

const FROM_DEFAULT = "HydroSense Texas <quotes@hydrosensetx.com>";

function from(): string {
  return process.env.LEAD_FROM_EMAIL ?? FROM_DEFAULT;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Quote ready email (to customer) ─────────────────

export async function sendQuoteEmail(quote: {
  customer_first_name: string;
  customer_email: string;
  copy_email?: string | null;
  quote_number: string;
  total: number;
  public_token: string;
  expires_at: string;
}): Promise<QuoteDeliveryResult> {
  const recipient = quote.customer_email.trim();
  const copyRecipient = quote.copy_email?.trim() || null;

  if (!recipient.includes("@")) {
    return {
      channel: "email",
      provider: "resend",
      recipient,
      copyRecipient,
      status: "skipped",
      providerMessageId: null,
      providerStatus: "invalid_recipient",
      error: "No valid customer email address",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email-quote] RESEND_API_KEY missing, skipping");
    return {
      channel: "email",
      provider: "resend",
      recipient,
      copyRecipient,
      status: "skipped",
      providerMessageId: null,
      providerStatus: "not_configured",
      error: "Resend is not configured",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hydrosensetx.com";
  const quoteUrl = `${siteUrl}/quote/${quote.public_token}`;
  const expiresDate = new Date(quote.expires_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const first = escapeHtml(quote.customer_first_name);
  const total = quote.total.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Your HydroSense Quote</title></head>
<body style="margin:0;padding:0;background:#0B1220;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#E6EDF7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0B1220;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#001A4E;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:32px 36px 0 36px;">
        <img src="${siteUrl}/brand/logo-horizontal-light.png" alt="HydroSense — Smart Home Water Defense" height="36" style="height:36px;width:auto;" />
      </td></tr>
      <tr><td style="padding:16px 36px 0 36px;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:400;margin:0;color:#F8FAFC;">${first}, your quote is ready.</h1>
      </td></tr>
      <tr><td style="padding:20px 36px 0 36px;">
        <p style="margin:0;font-size:16px;line-height:1.6;color:#CBD5E1;">
          Quote <span style="font-family:'SF Mono',Consolas,monospace;color:#9AA8BF;">${escapeHtml(quote.quote_number)}</span> for
          <span style="font-family:'SF Mono',Consolas,monospace;color:#C9A84C;font-weight:600;">$${total}</span>
          is ready for your review. Valid through ${expiresDate}.
        </p>
      </td></tr>
      <tr><td style="padding:28px 36px 0 36px;" align="center">
        <a href="${quoteUrl}" style="display:inline-block;background:#38BDF8;color:#001A4E;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:10px;">View your quote</a>
      </td></tr>
      <tr><td style="padding:12px 36px 0 36px;" align="center">
        <p style="margin:0;font-size:13px;color:#9AA8BF;">No commitment required to view.</p>
      </td></tr>
      <tr><td style="padding:24px 36px 0 36px;">
        <div style="border-top:1px solid #1F2C56;padding-top:16px;font-size:13px;color:#CBD5E1;line-height:1.5;">
          Jimmy Theoc, on behalf of Texas Master Plumber <span style="font-family:'SF Mono',Consolas,monospace;font-weight:600;color:#7DD3FC;">MPL 43057</span>
        </div>
      </td></tr>
      <tr><td style="padding:12px 36px 32px 36px;">
        <div style="border-top:1px solid #1F2C56;padding-top:16px;font-size:11px;color:#64748B;line-height:1.6;">
          HydroSense Texas is a service of Lead Ledger Pro LLC. Texas Registered Master Plumber MPL 43057.<br>
          You are receiving this email because you requested a quote at hydrosensetx.com. Reply STOP to opt out.
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = `${quote.customer_first_name}, your quote is ready.

Quote ${quote.quote_number} for $${total} is ready for your review. Valid through ${expiresDate}.

View your quote: ${quoteUrl}

Jimmy Theoc, on behalf of Texas Master Plumber MPL 43057
HydroSense Texas is a service of Lead Ledger Pro LLC.`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: from(),
      to: recipient,
      ...(copyRecipient ? { bcc: copyRecipient } : {}),
      ...(process.env.LEAD_NOTIFICATION_EMAIL
        ? { replyTo: process.env.LEAD_NOTIFICATION_EMAIL }
        : {}),
      subject: `Your HydroSense quote is ready — ${quote.quote_number}`,
      html,
      text,
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@hydrosensetx.com>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (error || !data?.id) {
      return {
        channel: "email",
        provider: "resend",
        recipient,
        copyRecipient,
        status: "failed",
        providerMessageId: null,
        providerStatus: "rejected",
        error: safeQuoteDeliveryError(error?.message || "Resend did not return a message ID"),
      };
    }

    return {
      channel: "email",
      provider: "resend",
      recipient,
      copyRecipient,
      status: "sent",
      providerMessageId: data.id,
      providerStatus: "accepted",
      error: null,
    };
  } catch (error) {
    return {
      channel: "email",
      provider: "resend",
      recipient,
      copyRecipient,
      status: "failed",
      providerMessageId: null,
      providerStatus: "request_failed",
      error: safeQuoteDeliveryError(error),
    };
  }
}

// ── Quote accepted confirmation (to customer) ───────

export async function sendQuoteAcceptedEmail(quote: {
  customer_first_name: string;
  customer_email: string;
  quote_number: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email-quote] RESEND_API_KEY missing, skipping");
    return;
  }

  const first = escapeHtml(quote.customer_first_name);

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Quote Accepted</title></head>
<body style="margin:0;padding:0;background:#0B1220;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#E6EDF7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0B1220;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#001A4E;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:32px 36px 0 36px;">
        <img src="https://hydrosensetx.com/brand/logo-horizontal-light.png" alt="HydroSense — Smart Home Water Defense" height="36" style="height:36px;width:auto;" />
      </td></tr>
      <tr><td style="padding:16px 36px 0 36px;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:400;margin:0;color:#F8FAFC;">Thanks, ${first}.</h1>
      </td></tr>
      <tr><td style="padding:20px 36px 0 36px;">
        <p style="margin:0;font-size:16px;line-height:1.6;color:#CBD5E1;">
          Thanks for accepting your HydroSense quote. We will reach out within one business day to send the service agreement and confirm your install window.
        </p>
      </td></tr>
      <tr><td style="padding:20px 36px 0 36px;">
        <p style="margin:0;font-size:15px;color:#CBD5E1;">Prefer to talk now? Call <a href="tel:+12816945754" style="color:#7DD3FC;text-decoration:none;font-weight:600;">(281) 694-5754</a>.</p>
      </td></tr>
      <tr><td style="padding:32px 36px 32px 36px;">
        <div style="border-top:1px solid #1F2C56;padding-top:20px;font-size:12px;color:#64748B;line-height:1.6;">
          HydroSense Texas is a service of Lead Ledger Pro LLC. Texas Registered Master Plumber MPL 43057.
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = `Thanks, ${quote.customer_first_name}. We will reach out within one business day to send the service agreement and confirm your install window. Call (281) 694-5754 if you want to talk sooner.`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: from(),
    to: quote.customer_email,
    subject: `Quote accepted — we will be in touch shortly`,
    html,
    text,
  });
}
