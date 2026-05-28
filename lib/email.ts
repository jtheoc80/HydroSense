import { Resend } from "resend";
import type { LeadInput } from "./validation";
import { estimatedSavingsForCarrier } from "./savings";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.LEAD_FROM_EMAIL || "quotes@hydrosensetx.com";
}

export async function sendLeadNotification(
  lead: LeadInput & { id: string; ip_address: string; lead_score?: number; lead_tier?: string }
) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping notification email");
    return;
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn("LEAD_NOTIFICATION_EMAIL not set, skipping email");
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
    ["Lead Score", `${lead.lead_score ?? "-"} (${lead.lead_tier || "-"})`],
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

  await resend.emails.send({
    from: `HydroSense Texas <${fromAddress()}>`,
    to,
    subject: `${lead.lead_tier === "hot" ? "[HOT] " : ""}New HydroSense lead: ${lead.first_name} ${lead.last_name} (${lead.zip})`,
    html,
  });
}

export async function sendLeadConfirmation(
  lead: LeadInput & { id: string }
) {
  if (!lead.email) return;

  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping confirmation email");
    return;
  }

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const savings = estimatedSavingsForCarrier(lead.carrier || "");

  const bookingBlock = bookingUrl
    ? `
      <div style="margin:24px 0;text-align:center;">
        <a href="${bookingUrl}" style="display:inline-block;background:#38BDF8;color:#00102D;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px;text-decoration:none;">
          Book your 15-minute quote call
        </a>
        <p style="color:#9AA8BF;font-size:12px;margin-top:8px;">Pick a time that works. I will call you exactly then.</p>
      </div>`
    : "";

  const savingsBlock =
    lead.carrier && lead.carrier !== "Not sure" && lead.carrier !== "Other"
      ? `
      <div style="margin:20px 0;padding:16px;background:#002469;border-radius:6px;border-left:3px solid #C9A84C;">
        <p style="color:#9AA8BF;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px 0;">Estimated annual savings with ${lead.carrier}</p>
        <p style="color:#C9A84C;font-size:28px;font-weight:700;margin:0;font-family:monospace;">$${savings.low} to $${savings.high}</p>
        <p style="color:#9AA8BF;font-size:12px;margin:4px 0 0 0;">Based on a typical 10% discount on a $6,600 Houston-area premium.</p>
      </div>`
      : `
      <div style="margin:20px 0;padding:16px;background:#002469;border-radius:6px;border-left:3px solid #C9A84C;">
        <p style="color:#C9A84C;margin:0;font-size:14px;">
          Most homeowners save $300 to $600 per year in insurance credits and earn back the full install cost inside 24 months.
        </p>
      </div>`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#001A4E;color:#E6EDF7;padding:32px;border-radius:8px;">
      <h2 style="color:#38BDF8;margin-top:0;font-size:22px;">Your HydroSense quote is in motion.</h2>
      <p style="color:#CBD5E1;line-height:1.7;margin-bottom:4px;">
        ${lead.first_name}, thank you for requesting a quote. Here is what happens next.
      </p>

      ${bookingBlock}
      ${savingsBlock}

      <table style="width:100%;border-collapse:collapse;margin-top:20px;">
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;width:30px;">1.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">15-minute phone assessment</strong><br/>
            We review your home, plumbing layout, and current insurance carrier to confirm eligibility.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">2.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Service agreement</strong><br/>
            Written scope of work and exact pricing. No surprises.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">3.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Professional install</strong><br/>
            Trained, licensed technicians install the smart shutoff at your main water line under our Texas Master Plumber license. Approximately 2 hours on site.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">4.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">App setup and handoff</strong><br/>
            We configure the device, connect it to your phone, walk you through monitoring.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">5.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Certificate to your insurer</strong><br/>
            After final payment, your certificate is issued in paper and digital form. The digital copy is emailed to you and your insurance agent. The discount applies at your next renewal.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">6.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Annual renewal</strong><br/>
            We reissue the certificate before each policy renewal so the credit stays applied. You never think about it.
          </td>
        </tr>
      </table>

      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #002469;">
        <p style="color:#9AA8BF;font-size:12px;margin:0;">
          HydroSense Texas, a Lead Ledger Pro LLC brand. Licensed Texas Master Plumber.<br/>
          Questions? Call <a href="tel:+12816945754" style="color:#38BDF8;">(281) 694-5754</a>.
        </p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: `HydroSense Texas <${fromAddress()}>`,
    to: lead.email,
    subject:
      "Your HydroSense quote is in motion. Here is what happens next.",
    html,
  });
}
