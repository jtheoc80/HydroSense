import { Resend } from "resend";
import type { LeadInput } from "./validation";

const FROM_DEFAULT = "HydroSense Texas <quotes@hydrosensetx.com>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function from(): string {
  return process.env.LEAD_FROM_EMAIL ?? FROM_DEFAULT;
}

// ── Lead confirmation email (to the homeowner) ──────────────

export async function sendLeadConfirmation(
  lead: LeadInput & { id: string }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const bookingUrl =
    process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hydrosensetx.com/book";
  const replyTo = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing, skipping lead confirmation");
    return;
  }

  if (!lead.email || !/.+@.+\..+/.test(lead.email)) {
    console.warn("[email] invalid lead email, skipping send");
    return;
  }

  const resend = new Resend(apiKey);
  const subject =
    "Your HydroSense quote is in motion. Here is what happens next.";

  try {
    await resend.emails.send({
      from: from(),
      to: lead.email,
      subject,
      html: buildConfirmationHtml(lead, bookingUrl),
      text: buildConfirmationText(lead, bookingUrl),
      ...(replyTo ? { replyTo } : {}),
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@hydrosensetx.com>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (err) {
    console.error("[email] resend confirmation send failed", err);
  }
}

function buildConfirmationHtml(
  lead: LeadInput,
  bookingUrl: string
): string {
  const first = escapeHtml(lead.first_name || "there");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Your HydroSense quote is in motion</title></head>
<body style="margin:0;padding:0;background:#0B1220;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#E6EDF7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0B1220;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#001A4E;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:32px 36px 0 36px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#9AA8BF;">HydroSense Texas</div>
      </td></tr>
      <tr><td style="padding:8px 36px 0 36px;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:400;margin:0;color:#F8FAFC;">Your quote is in motion, ${first}.</h1>
      </td></tr>
      <tr><td style="padding:20px 36px 0 36px;">
        <p style="margin:0;font-size:16px;line-height:1.6;color:#CBD5E1;">Thanks for the request. Most homeowners in our service area save <span style="color:#C9A84C;font-weight:600;">$300 to $600 a year</span> in homeowners insurance credits with a certified smart water shutoff. Here is the path from this email to that credit hitting your policy.</p>
      </td></tr>
      <tr><td style="padding:28px 36px 0 36px;" align="center">
        <a href="${bookingUrl}" style="display:inline-block;background:#38BDF8;color:#001A4E;text-decoration:none;font-weight:600;font-size:16px;padding:14px 28px;border-radius:10px;">Book your 15-minute call</a>
      </td></tr>
      <tr><td style="padding:12px 36px 0 36px;" align="center">
        <p style="margin:0;font-size:13px;color:#9AA8BF;">No commitment. No credit card.</p>
      </td></tr>
      <tr><td style="padding:32px 36px 0 36px;">
        <div style="border-top:1px solid #1F2C56;padding-top:24px;">
          <div style="font-family:Georgia,serif;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#9AA8BF;margin-bottom:14px;">What happens next</div>
          ${step("1", "15-minute quote call", "We confirm your carrier's discount tier, your plumbing layout, and a real install price.")}
          ${step("2", "Service agreement", "Plain-language one-page agreement. Install price locked, scheduled window confirmed.")}
          ${step("3", "Professional install", "Trained, licensed technicians install on your domestic water line. Fire-suppression piping is excluded; any irrigation scope must be specifically requested and quoted. About two hours on site. No drywall cuts.")}
          ${step("4", "App handoff", "Real-time flow data on your phone. Anomaly alerts. Freeze-mode auto-engagement.")}
          ${step("5", "Certificate to insurance", "After final payment, you receive your certificate in paper and digital form, ready for your agent.")}
        </div>
      </td></tr>
      <tr><td style="padding:28px 36px 0 36px;">
        <p style="margin:0;font-size:15px;color:#CBD5E1;">Prefer to talk now? Call <a href="tel:+12816945754" style="color:#7DD3FC;text-decoration:none;font-weight:600;">(281) 694-5754</a>.</p>
      </td></tr>
      <tr><td style="padding:32px 36px 32px 36px;">
        <div style="border-top:1px solid #1F2C56;padding-top:20px;font-size:12px;color:#64748B;line-height:1.6;">
          HydroSense Texas is a service of Lead Ledger Pro LLC. Texas Registered Master Plumber.<br>
          You are receiving this email because you submitted a quote request at hydrosensetx.com. Reply STOP to opt out.
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function step(n: string, title: string, body: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;"><tr>
    <td width="36" valign="top" style="font-family:'SF Mono',Consolas,monospace;font-size:14px;color:#C9A84C;font-weight:600;padding-top:2px;">${n}</td>
    <td valign="top">
      <div style="font-size:15px;font-weight:600;color:#F8FAFC;margin-bottom:4px;">${title}</div>
      <div style="font-size:14px;color:#9AA8BF;line-height:1.5;">${body}</div>
    </td></tr></table>`;
}

function buildConfirmationText(
  lead: LeadInput,
  bookingUrl: string
): string {
  const first = lead.first_name || "there";
  return `Your quote is in motion, ${first}.

Thanks for the request. Most homeowners in our service area save $300 to $600 a year in homeowners insurance credits with a certified smart water shutoff.

Book your 15-minute call: ${bookingUrl}

What happens next:
1. 15-minute quote call. We confirm your carrier's discount tier, plumbing layout, and a real install price.
2. Service agreement. Plain-language one-page agreement. Install price locked.
3. Professional install. Trained, licensed technicians install at your main. About two hours on site.
4. App handoff. Real-time flow data on your phone. Anomaly alerts.
5. Certificate to insurance. After final payment, you receive your certificate in paper and digital form.

Prefer to talk now? Call (281) 694-5754.

HydroSense Texas is a service of Lead Ledger Pro LLC. Texas Registered Master Plumber. You are receiving this email because you submitted a quote request at hydrosensetx.com. Reply STOP to opt out.`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Internal notification email (to the founder) ────────────

export async function sendLeadNotification(
  lead: LeadInput & {
    id: string;
    ip_address: string;
    lead_score?: number;
    lead_tier?: string;
  }
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not configured, skipping notification email"
    );
    return;
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("[email] LEAD_NOTIFICATION_EMAIL not set, skipping");
    return;
  }

  const rows = [
    ["Name", `${lead.first_name} ${lead.last_name}`],
    ["Email", lead.email],
    ["Phone", lead.phone || "-"],
    ["ZIP", lead.zip],
    ["Address", lead.address || "-"],
    ["Carrier", lead.carrier || "-"],
    ["City", lead.city || "-"],
    ["Campaign", lead.campaign || "-"],
    [
      "Lead Score",
      `${lead.lead_score ?? "-"} (${lead.lead_tier || "-"})`,
    ],
    ["Message", lead.message || "-"],
    ["Source", lead.source],
    ["Page", lead.page_path || "-"],
    ["UTM Source", lead.utm_source || "-"],
    ["UTM Medium", lead.utm_medium || "-"],
    ["UTM Campaign", lead.utm_campaign || "-"],
    ["UTM Content", lead.utm_content || "-"],
    ["UTM Term", lead.utm_term || "-"],
    ["Referrer", lead.referrer || "-"],
    ["IP", lead.ip_address || "-"],
    ["User Agent", lead.user_agent || "-"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 14px;font-weight:600;color:#9AA8BF;white-space:nowrap;vertical-align:top;border-bottom:1px solid #002469;">${label}</td><td style="padding:8px 14px;color:#E6EDF7;border-bottom:1px solid #002469;">${value}</td></tr>`
    )
    .join("");

  const tierBadge =
    lead.lead_tier === "hot"
      ? '<span style="background:#C9A84C;color:#00102D;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">HOT</span> '
      : "";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#001A4E;color:#E6EDF7;padding:32px;border-radius:8px;">
      <h2 style="color:#38BDF8;margin-top:0;font-size:20px;">${tierBadge}New HydroSense Lead</h2>
      <table style="width:100%;border-collapse:collapse;background:#002469;border-radius:6px;overflow:hidden;">
        ${tableRows}
      </table>
      <p style="color:#9AA8BF;font-size:12px;margin-top:16px;">Lead ID: ${lead.id}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: from(),
      to,
      subject: `${lead.lead_tier === "hot" ? "[HOT] " : ""}New HydroSense lead: ${lead.first_name} ${lead.last_name} (${lead.zip})`,
      html,
    });
  } catch (err) {
    console.error("[email] resend notification send failed", err);
  }
}
