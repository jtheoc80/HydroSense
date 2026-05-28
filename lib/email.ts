import { Resend } from "resend";
import type { LeadInput } from "./validation";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendLeadNotification(
  lead: LeadInput & { id: string; ip_address: string }
) {
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

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#001A4E;color:#E6EDF7;padding:32px;border-radius:8px;">
      <h2 style="color:#38BDF8;margin-top:0;font-size:20px;">New HydroSense Lead</h2>
      <table style="width:100%;border-collapse:collapse;background:#002469;border-radius:6px;overflow:hidden;">
        ${tableRows}
      </table>
      <p style="color:#9AA8BF;font-size:12px;margin-top:16px;">Lead ID: ${lead.id}</p>
    </div>
  `;

  await getResend().emails.send({
    from: "HydroSense Texas <leads@hydrosensetx.com>",
    to,
    subject: `New HydroSense lead: ${lead.first_name} ${lead.last_name} (${lead.zip})`,
    html,
  });
}

export async function sendLeadConfirmation(
  lead: LeadInput & { id: string }
) {
  if (!lead.email) return;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#001A4E;color:#E6EDF7;padding:32px;border-radius:8px;">
      <h2 style="color:#38BDF8;margin-top:0;font-size:22px;">Your HydroSense Texas Quote Request</h2>
      <p style="color:#CBD5E1;line-height:1.7;margin-bottom:24px;">
        ${lead.first_name}, thank you for requesting a quote. Here is what happens next.
      </p>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;width:30px;">1.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">15-minute phone assessment</strong><br/>
            We will call you within one business day to review your home, plumbing layout, and current insurance carrier.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">2.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Service agreement</strong><br/>
            You will receive a written scope of work and pricing. No surprises.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">3.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Professional install</strong><br/>
            A Texas Master Plumber (License MPL 43057) installs the smart shutoff at your main water line. Approximately 2 hours on site.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">4.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">App setup and handoff</strong><br/>
            We configure the device, connect it to your phone, and walk you through monitoring.
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#38BDF8;font-weight:700;vertical-align:top;">5.</td>
          <td style="padding:12px 0;color:#CBD5E1;">
            <strong style="color:#F8FAFC;">Certificate to your insurer</strong><br/>
            Same-day certificate emailed to you and your insurance agent. The discount applies at your next renewal.
          </td>
        </tr>
      </table>

      <div style="margin-top:24px;padding:16px;background:#002469;border-radius:6px;border-left:3px solid #C9A84C;">
        <p style="color:#C9A84C;margin:0;font-size:14px;">
          Most homeowners save $300 to $600 per year in insurance credits and earn back the full install cost inside 24 months.
        </p>
      </div>

      <p style="color:#9AA8BF;font-size:12px;margin-top:24px;">
        HydroSense Texas, a Lead Ledger Pro LLC brand. Texas Master Plumber License MPL 43057.<br/>
        Questions? Call (281) 694-5754.
      </p>
    </div>
  `;

  await getResend().emails.send({
    from: "HydroSense Texas <hello@hydrosensetx.com>",
    to: lead.email,
    subject:
      "Your HydroSense Texas quote request: what happens next",
    html,
  });
}
