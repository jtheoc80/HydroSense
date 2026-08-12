import { Resend } from "resend";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { sendSms } from "@/lib/twilio";
import { customerPortalUrl, formatVisitDate, formatVisitTime, shortAddress } from "./format";
import { isMessageClaimAvailable, MESSAGE_BINDING, messageKeyFor, type SiteVisitMessageKind } from "./message-policy";
import { mockProviderMessageId, siteVisitProviderMode } from "./provider-mode";
export { messageKeyFor } from "./message-policy";
import type { SiteVisit, SiteVisitMessage } from "./types";

export interface DeliveryResult {
  channel: "sms" | "email";
  status: "sent" | "failed" | "skipped";
  messageId?: string;
  error?: string;
}

interface MessageContent {
  subject: string;
  sms: string;
  text: string;
  html: string;
}


export async function sendSiteVisitCommunication(
  visit: SiteVisit,
  kind: SiteVisitMessageKind,
  options: { etaMinutes?: number; channels?: Array<"sms" | "email">; maxAttempts?: number; messageKey?: string } = {}
): Promise<DeliveryResult[]> {
  const content = buildMessageContent(visit, kind, options.etaMinutes);
  const channels = options.channels || ["sms", "email"];
  const tasks: Array<Promise<DeliveryResult>> = [];
  if (channels.includes("sms") && visit.customer_phone) {

    tasks.push(deliver(visit, kind, "sms", visit.customer_phone, content, options.maxAttempts, options.messageKey));
  }
  if (channels.includes("email") && visit.customer_email) {
    tasks.push(deliver(visit, kind, "email", visit.customer_email, content, options.maxAttempts, options.messageKey));
  }
  return Promise.all(tasks);
}

export async function retrySiteVisitMessage(messageId: string): Promise<DeliveryResult[]> {
  const { data, error } = await supabase.from("site_visit_messages").select("*").eq("id", messageId).maybeSingle();
  if (error || !data) throw new Error("Communication record not found");
  const message = data as SiteVisitMessage;
  if (!(message.template in MESSAGE_BINDING)) throw new Error("Communication type cannot be retried");
  const { data: visit, error: visitError } = await supabase.from("site_visits").select("*").eq("id", message.site_visit_id).maybeSingle();
  if (visitError || !visit) throw new Error("Site visit not found");
  return sendSiteVisitCommunication(visit as SiteVisit, message.template as SiteVisitMessageKind, {
    channels: [message.channel], messageKey: message.message_key,
  });
}

async function deliver(
  visit: SiteVisit,
  kind: SiteVisitMessageKind,
  channel: "sms" | "email",
  recipient: string,
  content: MessageContent,
  maxAttempts = 3,
  messageKeyOverride?: string
): Promise<DeliveryResult> {
  const messageKey = messageKeyOverride || messageKeyFor(kind, visit);
  await supabase.from("site_visit_messages").upsert(
    {
      site_visit_id: visit.id,
      message_key: messageKey,
      channel,
      template: kind,
      recipient,
      status: "pending",
    },
    { onConflict: "site_visit_id,message_key,channel", ignoreDuplicates: true }
  );

  const { data: existing, error: loadError } = await supabase
    .from("site_visit_messages")
    .select("*")
    .eq("site_visit_id", visit.id)
    .eq("message_key", messageKey)
    .eq("channel", channel)
    .single();
  if (loadError || !existing) return { channel, status: "failed", error: "Unable to create delivery record" };
  const message = existing as SiteVisitMessage;
  if (message.status === "sent" || !isMessageClaimAvailable(message)) return { channel, status: "skipped", messageId: message.id };
  if (message.attempt_count >= maxAttempts) return { channel, status: "skipped", messageId: message.id, error: "Retry limit reached" };

  const claimToken = crypto.randomUUID();
  const claimedAt = new Date().toISOString();
  let claimQuery = supabase
    .from("site_visit_messages")
    .update({ status: "sending", attempt_count: message.attempt_count + 1, last_error: null, claimed_at: claimedAt, claim_token: claimToken })
    .eq("id", message.id)
    .eq("attempt_count", message.attempt_count)
    .eq("status", message.status);
  claimQuery = message.claimed_at === null
    ? claimQuery.is("claimed_at", null)
    : claimQuery.eq("claimed_at", message.claimed_at);
  const { data: claimed } = await claimQuery.select("id").maybeSingle();
  if (!claimed) return { channel, status: "skipped", messageId: message.id };

  try {
    const providerMessageId = siteVisitProviderMode() === "mock"
      ? mockProviderMessageId(channel, message.id)
      : channel === "sms"
        ? await sendSms({ to: recipient, body: content.sms })
        : await sendEmail({ to: recipient, subject: content.subject, html: content.html, text: content.text });

    await supabase.from("site_visit_messages").update({
      status: "sent",
      provider_message_id: providerMessageId,
      provider_status: "accepted",
      sent_at: new Date().toISOString(),
      last_error: null,
      claimed_at: null,
      claim_token: null,
    }).eq("id", message.id).eq("claim_token", claimToken);
    return { channel, status: "sent", messageId: message.id };
  } catch (error) {
    const safeError = error instanceof Error ? error.message.slice(0, 500) : "Delivery failed";
    await supabase.from("site_visit_messages").update({ status: "failed", last_error: safeError, claimed_at: null, claim_token: null })
      .eq("id", message.id).eq("claim_token", claimToken);
    return { channel, status: "failed", messageId: message.id, error: safeError };
  }
}

async function sendEmail(input: { to: string; subject: string; html: string; text: string }): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Resend is not configured");
  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: process.env.SITE_VISIT_FROM_EMAIL || process.env.LEAD_FROM_EMAIL || "HydroSense Texas <quotes@hydrosensetx.com>",
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    ...(process.env.LEAD_NOTIFICATION_EMAIL ? { replyTo: process.env.LEAD_NOTIFICATION_EMAIL } : {}),
  });
  if (error || !data?.id) throw new Error(error?.message || "Resend did not return a message ID");
  return data.id;
}

export function buildMessageContent(
  visit: SiteVisit,
  kind: SiteVisitMessageKind,
  etaMinutes?: number
): MessageContent {
  const portalUrl = customerPortalUrl(visit.customer_portal_token);
  const date = formatVisitDate(visit.scheduled_start, visit.timezone);
  const time = formatVisitTime(visit.scheduled_start, visit.timezone);
  const first = visit.customer_first_name;
  const phone = process.env.NEXT_PUBLIC_HYDROSENSE_PHONE || "(281) 694-5754";
  const common = `${date} at ${time}`;
  const copy: Record<SiteVisitMessageKind, { subject: string; sms: string; lead: string }> = {
    confirmation: {
      subject: "Confirm your HydroSense home water assessment",
      sms: `HydroSense: Hi ${first}, your home water assessment is reserved for ${common} at ${shortAddress(visit.property_address)}. Please confirm and complete the 2-minute preparation form: ${portalUrl}. Need another time? Use the same link. Reply STOP to opt out.`,
      lead: `Your HydroSense home water assessment is reserved for ${common}. Confirm the appointment and complete the short preparation form.`,
    },
    "confirmation-receipt": {
      subject: "Your HydroSense appointment is confirmed",
      sms: `HydroSense: Thanks, ${first}. Your assessment is confirmed for ${common}. Complete the 2-minute preparation form here: ${portalUrl}. Reply STOP to opt out.`,
      lead: `Your appointment is confirmed for ${common}. The preparation form remains available at the button below.`,
    },
    "previsit-complete": {
      subject: "HydroSense preparation form received",
      sms: `HydroSense: Thanks, ${first}. We received your preparation details for ${common}. Review or update your appointment here: ${portalUrl}. Reply STOP to opt out.`,
      lead: `We received your preparation details for the appointment on ${common}.`,
    },
    "reminder-24h": {
      subject: "Your HydroSense assessment is coming up",
      sms: `HydroSense reminder: Your home water assessment is scheduled for ${common}. ${visit.confirmed_at ? "You are confirmed." : "Please confirm now."} Review preparation or request another time: ${portalUrl}. Reply STOP to opt out.`,
      lead: `Your assessment is approaching. ${visit.confirmed_at ? "The appointment is confirmed." : "Please use the button below to confirm in one tap."}`,
    },
    "reminder-3h": {
      subject: "HydroSense arrives in about three hours",
      sms: `HydroSense reminder: We are scheduled for ${time}. Please have an adult available and provide access to the exterior water entry, kitchen, bathrooms, laundry/utility, and other water-connected areas. Details: ${portalUrl}. Reply STOP to opt out.`,
      lead: "Please have an adult available and make the exterior water entry, kitchen, every bathroom, laundry/utility area, and other water-connected areas accessible.",
    },
    "en-route": {
      subject: "HydroSense is en route",
      sms: `HydroSense: ${visit.assigned_rep_name} is en route${etaMinutes !== undefined ? ` and expects to arrive in about ${etaMinutes} minutes` : ""}. Appointment details: ${portalUrl}. Reply STOP to opt out.`,
      lead: `${visit.assigned_rep_name} is en route${etaMinutes !== undefined ? ` with an estimated arrival in about ${etaMinutes} minutes` : ""}.`,
    },
    completion: {
      subject: "Your HydroSense site-visit summary is ready",
      sms: `HydroSense: Your home water assessment summary is ready. Review the result and next steps securely here: ${portalUrl}. Reply STOP to opt out.`,
      lead: "Your site-visit result and next steps are ready in the secure HydroSense portal.",
    },
    "recheck-receipt": {
      subject: "HydroSense received your recheck request",
      sms: `HydroSense: Thanks, ${first}. We received your report that the required work is complete. We will review it and contact you about a recheck. ${portalUrl}. Reply STOP to opt out.`,
      lead: "We received your completion report. HydroSense will review it before changing installation readiness.",
    },
  };
  const selected = copy[kind];
  const escapedLead = escapeHtml(selected.lead);
  const escapedAddress = escapeHtml(visit.property_address);
  const escapedRep = escapeHtml(visit.assigned_rep_name);
  const escapedUrl = escapeHtml(portalUrl);
  const text = `${selected.lead}\n\n${visit.property_address}\nAssigned representative: ${visit.assigned_rep_name}\n\nOpen your secure appointment page: ${portalUrl}\nAdd to calendar: ${portalUrl}/calendar\n\nQuestions? Call ${phone}. HydroSense will never ask you to submit a Wi-Fi password.`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(selected.subject)}</title></head><body style="margin:0;background:#00102D;color:#E6EDF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;background:#00102D"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#001A4E;border:1px solid #1E3A8A;border-radius:16px"><tr><td style="padding:28px 32px 8px"><div style="font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#7DD3FC;font-weight:700">HydroSense Texas</div><h1 style="margin:10px 0 0;color:#F8FAFC;font-size:28px;line-height:1.2">${escapeHtml(selected.subject)}</h1></td></tr><tr><td style="padding:16px 32px;color:#CBD5E1;font-size:16px;line-height:1.6"><p>${escapedLead}</p><div style="background:#002469;border-radius:12px;padding:16px;margin:20px 0"><strong style="color:#F8FAFC">${escapeHtml(common)}</strong><br>${escapedAddress}<br>Representative: ${escapedRep}<br>Arrival window: ${visit.arrival_window_minutes} minutes</div><p>The assessment is normally visual and non-destructive. Please make the exterior water entry, kitchen, every bathroom, laundry/utility area, and other water-connected areas accessible.</p><p>Wi-Fi coverage is needed near the expected monitoring location. We will never ask you to submit your Wi-Fi password; credentials are handled only during authorized device setup.</p><p style="text-align:center;margin:28px 0"><a href="${escapedUrl}" style="display:inline-block;background:#38BDF8;color:#00102D;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px">Open secure appointment page</a></p><p style="font-size:13px;color:#9AA8BF">Need a different time? Use the appointment page to request options before canceling. Questions? Call ${escapeHtml(phone)}.</p></td></tr></table></td></tr></table></body></html>`;
  return { subject: selected.subject, sms: selected.sms, text, html };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
