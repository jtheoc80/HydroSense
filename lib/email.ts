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
        `<tr><td style="padding:6px 12px;font-weight:600;color:#9AA8BF;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:6px 12px;color:#E6EDF7;">${value}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0B1220;color:#E6EDF7;padding:24px;border-radius:8px;">
      <h2 style="color:#22D3EE;margin-top:0;">New HydroSense Lead</h2>
      <table style="width:100%;border-collapse:collapse;background:#0F1830;border-radius:6px;overflow:hidden;">
        ${tableRows}
      </table>
      <p style="color:#9AA8BF;font-size:12px;margin-top:16px;">Lead ID: ${lead.id}</p>
    </div>
  `;

  await getResend().emails.send({
    from: "HydroSense <leads@hydrosensetx.com>",
    to,
    subject: `New HydroSense lead: ${lead.first_name} ${lead.last_name} (${lead.zip})`,
    html,
  });
}
