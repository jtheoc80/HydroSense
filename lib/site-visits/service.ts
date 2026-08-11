import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { sendSiteVisitAlert } from "./alerts";
import { sendSiteVisitCommunication, type DeliveryResult } from "./communications";
import { customerPortalUrl } from "./format";
import { buildCorrectiveActions, evaluateReadiness, quoteEligibility } from "./readiness";
import {
  appendSiteVisitEvent,
  createSiteVisit,
  getSiteVisitById,
  getSiteVisitByToken,
  listSiteVisitEvents,
  listSiteVisitMessages,
  markAssessmentSaveEvent,
  updateLinkedLeadForBooking,
  updateSiteVisit,
  type CreateSiteVisitInput,
} from "./repository";
import {
  createSiteVisitSchema,
  customerCancellationSchema,
  customerRescheduleSchema,
  enRouteSchema,
  previsitAnswersSchema,
  rescheduleSiteVisitSchema,
  siteAssessmentSchema,
} from "./schemas";
import { buildCustomerSummary } from "./summary";
import type { SiteAssessment, SiteVisit } from "./types";

export class SiteVisitValidationError extends Error {
  constructor(message: string, public readonly details: unknown = undefined) {
    super(message);
    this.name = "SiteVisitValidationError";
  }
}

export async function scheduleSiteVisit(raw: unknown): Promise<{
  visit: SiteVisit;
  deliveries: DeliveryResult[];
}> {
  const parsed = createSiteVisitSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Invalid appointment details", parsed.error.flatten());
  let visit = await createSiteVisit(parsed.data as CreateSiteVisitInput);
  await appendSiteVisitEvent(visit.id, "created", "admin", null, { sendConfirmation: parsed.data.sendConfirmation });

  const portalUrl = customerPortalUrl(visit.customer_portal_token);
  if (parsed.data.sendConfirmation) {
    await updateLinkedLeadForBooking(visit, portalUrl);
    const deliveries = await sendSiteVisitCommunication(visit, "confirmation");
    const sent = deliveries.some((delivery) => delivery.status === "sent");
    if (sent) {
      visit = await updateSiteVisit(visit.id, { confirmation_sent_at: new Date().toISOString() });
    }
    await appendSiteVisitEvent(visit.id, "confirmation_requested", "system", null, {
      channels: deliveries.map(({ channel, status }) => ({ channel, status })),
      scheduleVersion: visit.schedule_version,
    });
    if (!sent) {
      await safeAlert(visit, "Site visit confirmation failed", "No configured customer channel was delivered. Contact the customer directly.", 1);
    }
    return { visit, deliveries };
  }
  return { visit, deliveries: [] };
}

export async function resendConfirmation(id: string, idempotencyKey: string): Promise<DeliveryResult[]> {
  const visit = await requireVisitById(id);
  const deliveries = await sendSiteVisitCommunication(visit, "confirmation", {
    messageKey: `confirmation:manual:${idempotencyKey}`,
  });
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(id, { confirmation_sent_at: new Date().toISOString(), previsit_status: visit.previsit_status === "not_sent" ? "pending" : visit.previsit_status });
  }
  await appendSiteVisitEvent(id, "confirmation_requested", "admin", null, {
    channels: deliveries.map(({ channel, status }) => ({ channel, status })),
    scheduleVersion: visit.schedule_version,
  });
  return deliveries;
}

export async function adminReschedule(id: string, raw: unknown): Promise<{
  visit: SiteVisit;
  deliveries: DeliveryResult[];
}> {
  const parsed = rescheduleSiteVisitSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Invalid reschedule details", parsed.error.flatten());
  const existing = await requireVisitById(id);
  const visit = await updateSiteVisit(id, {
    scheduled_start: parsed.data.scheduledStart,
    ...(parsed.data.arrivalWindowMinutes !== undefined ? { arrival_window_minutes: parsed.data.arrivalWindowMinutes } : {}),
    ...(parsed.data.assignedRepName ? { assigned_rep_name: parsed.data.assignedRepName } : {}),
    schedule_version: existing.schedule_version + 1,
    appointment_status: "awaiting_confirmation",
    confirmed_at: null,
    confirmation_sent_at: null,
    reschedule_request: null,
    reschedule_requested_at: null,
  });
  await appendSiteVisitEvent(id, "rescheduled", "admin", parsed.data.actorLabel, {
    priorScheduledStart: existing.scheduled_start,
    scheduledStart: visit.scheduled_start,
    scheduleVersion: visit.schedule_version,
  });
  if (visit.lead_id) await updateLinkedLeadForBooking(visit, customerPortalUrl(visit.customer_portal_token));
  const deliveries = await sendSiteVisitCommunication(visit, "confirmation");
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(id, { confirmation_sent_at: new Date().toISOString() });
  }
  return { visit, deliveries };
}

export async function confirmCustomerVisit(token: string): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (["canceled", "completed", "no_show"].includes(visit.appointment_status)) {
    throw new SiteVisitValidationError("This appointment can no longer be confirmed");
  }
  if (visit.confirmed_at) return visit;
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, { appointment_status: "confirmed", confirmed_at: now });
  await appendSiteVisitEvent(visit.id, "confirmed", "customer", null, { scheduleVersion: visit.schedule_version });
  await sendSiteVisitCommunication(updated, "confirmation-receipt");
  return updated;
}

export async function submitPrevisit(token: string, raw: unknown): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (["canceled", "completed", "no_show"].includes(visit.appointment_status)) {
    throw new SiteVisitValidationError("This preparation form is closed");
  }
  const parsed = previsitAnswersSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Check the preparation form", parsed.error.flatten());
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, {
    previsit_answers: parsed.data,
    previsit_status: "complete",
    previsit_completed_at: now,
  });
  await appendSiteVisitEvent(visit.id, "previsit_completed", "customer");
  await sendSiteVisitCommunication(updated, "previsit-complete");
  return updated;
}

export async function requestCustomerReschedule(token: string, raw: unknown): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (["canceled", "completed", "no_show"].includes(visit.appointment_status)) {
    throw new SiteVisitValidationError("This appointment cannot be rescheduled from the portal");
  }
  const parsed = customerRescheduleSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Provide at least two valid appointment options", parsed.error.flatten());
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, {
    appointment_status: "reschedule_requested",
    reschedule_requested_at: now,
    reschedule_request: {
      option1: parsed.data.option1,
      option2: parsed.data.option2,
      ...(parsed.data.option3 ? { option3: parsed.data.option3 } : {}),
      ...(parsed.data.note ? { note: parsed.data.note } : {}),
      requestedAt: now,
    },
  });
  await appendSiteVisitEvent(visit.id, "reschedule_requested", "customer", null, {
    optionCount: parsed.data.option3 ? 3 : 2,
  });
  await safeAlert(updated, "Site visit reschedule requested", "The original time remains pending until HydroSense confirms a replacement.", 1);
  return updated;
}

export async function cancelCustomerVisit(token: string, raw: unknown): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (visit.appointment_status === "canceled") return visit;
  if (["completed", "no_show"].includes(visit.appointment_status)) {
    throw new SiteVisitValidationError("This appointment can no longer be canceled");
  }
  const parsed = customerCancellationSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("A cancellation reason is required", parsed.error.flatten());
  const updated = await updateSiteVisit(visit.id, {
    appointment_status: "canceled",
    canceled_at: new Date().toISOString(),
  });
  await appendSiteVisitEvent(visit.id, "canceled", "customer", null, { reason: parsed.data.reason });
  await safeAlert(updated, "Site visit canceled", `Customer reason: ${parsed.data.reason}`, 1);
  return updated;
}

export async function markEnRoute(id: string, raw: unknown): Promise<{
  visit: SiteVisit;
  deliveries: DeliveryResult[];
}> {
  const visit = await requireVisitById(id);
  if (visit.en_route_at) return { visit, deliveries: [] };
  const parsed = enRouteSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Invalid ETA", parsed.error.flatten());
  if (["canceled", "completed", "no_show"].includes(visit.appointment_status)) {
    throw new SiteVisitValidationError("This appointment is not active");
  }
  const updated = await updateSiteVisit(id, { appointment_status: "en_route", en_route_at: new Date().toISOString() });
  await appendSiteVisitEvent(id, "en_route", "representative", updated.assigned_rep_name, {
    ...(parsed.data.etaMinutes !== undefined ? { etaMinutes: parsed.data.etaMinutes } : {}),
  });
  const deliveries = await sendSiteVisitCommunication(updated, "en-route", { etaMinutes: parsed.data.etaMinutes });
  return { visit: updated, deliveries };
}

export async function saveAssessment(id: string, raw: unknown, actorLabel?: string): Promise<SiteVisit> {
  const parsed = siteAssessmentSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Assessment draft contains invalid values", parsed.error.flatten());
  const visit = await requireVisitById(id);
  if (["canceled", "completed", "no_show"].includes(visit.appointment_status)) {
    throw new SiteVisitValidationError("This assessment is closed");
  }
  const updated = await updateSiteVisit(id, {
    assessment: parsed.data,
    appointment_status: "in_progress",
    started_at: visit.started_at || new Date().toISOString(),
  });
  await markAssessmentSaveEvent(id, actorLabel || visit.assigned_rep_name);
  return updated;
}

export async function completeAssessment(id: string, raw: unknown): Promise<{
  visit: SiteVisit;
  deliveries: DeliveryResult[];
}> {
  const parsed = siteAssessmentSchema.safeParse(raw);
  if (!parsed.success) throw new SiteVisitValidationError("Assessment contains invalid values", parsed.error.flatten());
  const visit = await requireVisitById(id);
  if (visit.completed_at) return { visit, deliveries: [] };
  const assessment = parsed.data as SiteAssessment;
  const readiness = evaluateReadiness(assessment, visit.previsit_answers);
  if (readiness.status === "unassessed") {
    throw new SiteVisitValidationError("Complete all required assessment fields", {
      missingRequiredFields: readiness.missingRequiredFields,
      blockers: readiness.blockers,
    });
  }
  const now = new Date().toISOString();
  const correctiveActions = buildCorrectiveActions(readiness.blockers);
  const summary = buildCustomerSummary(assessment, readiness, visit.follow_up_at || undefined);
  const acknowledged = Boolean(assessment.customerAcknowledgment?.acknowledged && assessment.customerAcknowledgment?.typedName?.trim());
  const updated = await updateSiteVisit(id, {
    assessment,
    readiness_status: readiness.status,
    blockers: readiness.blockers,
    corrective_actions: correctiveActions,
    customer_summary: summary,
    appointment_status: "completed",
    completed_at: now,
    ...(acknowledged ? { customer_acknowledged_at: now } : {}),
  });
  if (visit.lead_id) {
    await supabase.from("leads").update({ status: "showed" }).eq("id", visit.lead_id);
  }
  await appendSiteVisitEvent(id, "completed", "representative", visit.assigned_rep_name, {
    readinessStatus: readiness.status,
    blockerCodes: readiness.blockers.map((item) => item.code),
    customerAcknowledged: acknowledged,
  });
  const deliveries = await sendSiteVisitCommunication(updated, "completion");
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(id, { summary_sent_at: now });
    await appendSiteVisitEvent(id, "summary_sent", "system", null, {
      channels: deliveries.filter((delivery) => delivery.status === "sent").map((delivery) => delivery.channel),
    });
  }
  if (["leak_repair_required", "plumber_review_required"].includes(readiness.status)) {
    await safeAlert(updated, "Site visit completed with a major blocker", `${readiness.blockers.length} blocker(s) require follow-up.`, 1);
  }
  return { visit: updated, deliveries };
}

export async function requestRecheck(token: string): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (!visit.completed_at || visit.readiness_status === "ready_for_proposal") {
    throw new SiteVisitValidationError("This visit is not eligible for a recheck request");
  }
  if (visit.recheck_requested_at) return visit;
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, {
    appointment_status: "recheck_requested",
    recheck_requested_at: now,
  });
  await appendSiteVisitEvent(visit.id, "recheck_requested", "customer");
  await safeAlert(updated, "Site visit recheck requested", "The customer reports the required work is complete. Readiness was not changed automatically.", 1);
  await sendSiteVisitCommunication(updated, "recheck-receipt");
  return updated;
}

export async function createDraftQuoteForVisit(id: string): Promise<{ quoteId: string; created: boolean }> {
  const visit = await requireVisitById(id);
  const { data: existing } = await supabase.from("quotes").select("id").eq("site_visit_id", id).maybeSingle();
  if (existing?.id) return { quoteId: existing.id, created: false };
  const eligibility = quoteEligibility(visit.readiness_status);
  if (!eligibility.allowed) throw new SiteVisitValidationError(eligibility.reason || "This site visit is not eligible for a quote");

  const { data: lead } = visit.lead_id
    ? await supabase.from("leads").select("carrier").eq("id", visit.lead_id).maybeSingle()
    : { data: null };
  const year = new Date().getFullYear();
  const { count } = await supabase.from("quotes").select("id", { count: "exact", head: true }).like("quote_number", `Q-${year}-%`);
  const quoteNumber = `Q-${year}-${String((count || 0) + 1).padStart(4, "0")}`;
  const addonMap: Record<string, { sku: string; name: string; description: string; price: number }> = {
    "power-not-verified": { sku: "INST-ELEC", name: "Electrical outlet install", description: "Standard outlet near the monitoring location", price: 275 },
    "sprinkler-branch-concern": { sku: "INST-SPRINK", name: "Sprinkler bypass install", description: "Licensed review and approved bypass configuration", price: 350 },
    "wifi-not-verified": { sku: "ADD-WIFI", name: "Wi-Fi extender", description: "Wi-Fi coverage for the monitoring location", price: 89 },
  };
  const lineItems = visit.blockers
    .map((item) => addonMap[item.code])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item, index, all) => all.findIndex((candidate) => candidate.sku === item.sku) === index)
    .map((item) => ({
      sku: item.sku, name: item.name, description: item.description,
      quantity: 1, unit_price: item.price, line_total: item.price,
    }));
  const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
  const internalSummary = [
    `Source site visit: ${visit.id}`,
    `Readiness: ${visit.readiness_status}`,
    ...visit.blockers.map((item) => `${item.title}: ${item.detail}`),
  ].join("\n");
  const customerNotes = eligibility.conditional
    ? "This conditional draft includes the documented site-preparation items. HydroSense will confirm readiness before installation."
    : "Site assessment complete. Select the appropriate monitoring device to finish this proposal.";

  const { data: quote, error } = await supabase.from("quotes").insert({
    quote_number: quoteNumber,
    public_token: crypto.randomBytes(16).toString("hex"),
    site_visit_id: id,
    lead_id: visit.lead_id,
    customer_first_name: visit.customer_first_name,
    customer_last_name: visit.customer_last_name,
    customer_email: visit.customer_email || "",
    customer_phone: visit.customer_phone,
    property_address: visit.property_address,
    property_city: visit.property_city,
    property_zip: visit.property_zip,
    carrier: lead?.carrier || null,
    line_items: lineItems,
    subtotal,
    total: subtotal,
    notes_internal: internalSummary,
    notes_customer: customerNotes,
    status: "draft",
  }).select("id").single();
  if (error || !quote) {
    const { data: raced } = await supabase.from("quotes").select("id").eq("site_visit_id", id).maybeSingle();
    if (raced?.id) return { quoteId: raced.id, created: false };
    throw new Error(`Unable to create draft quote: ${error?.message || "unknown database error"}`);
  }
  if (visit.lead_id) await supabase.from("leads").update({ status: "quoted" }).eq("id", visit.lead_id);
  await appendSiteVisitEvent(id, "quote_created", "admin", null, { quoteId: quote.id, conditional: eligibility.conditional });
  return { quoteId: quote.id, created: true };
}

export async function getAdminVisitDetail(id: string) {
  const visit = await requireVisitById(id);
  const [events, messages, quoteResult] = await Promise.all([
    listSiteVisitEvents(id),
    listSiteVisitMessages(id),
    supabase.from("quotes").select("id, quote_number, status, public_token").eq("site_visit_id", id).maybeSingle(),
  ]);
  return { visit, events, messages, quote: quoteResult.data || null };
}

export async function getCustomerPortalData(token: string) {
  const visit = await requireVisitByToken(token);
  const { data: quote } = await supabase
    .from("quotes")
    .select("public_token, status")
    .eq("site_visit_id", visit.id)
    .maybeSingle();
  return {
    id: visit.id,
    customerFirstName: visit.customer_first_name,
    propertyAddress: visit.property_address,
    propertyCity: visit.property_city,
    propertyZip: visit.property_zip,
    scheduledStart: visit.scheduled_start,
    arrivalWindowMinutes: visit.arrival_window_minutes,
    estimatedDurationMinutes: visit.estimated_duration_minutes,
    timezone: visit.timezone,
    assignedRepName: visit.assigned_rep_name,
    assignedRepPhone: visit.assigned_rep_phone,
    appointmentStatus: visit.appointment_status,
    previsitStatus: visit.previsit_status,
    readinessStatus: visit.readiness_status,
    confirmedAt: visit.confirmed_at,
    previsitAnswers: visit.previsit_answers,
    customerSummary: visit.customer_summary,
    completedAt: visit.completed_at,
    canceledAt: visit.canceled_at,
    recheckRequestedAt: visit.recheck_requested_at,
    quoteUrl: quote && quote.status !== "draft" ? `/quote/${quote.public_token}` : null,
  };
}

async function requireVisitById(id: string): Promise<SiteVisit> {
  const visit = await getSiteVisitById(id);
  if (!visit) throw new SiteVisitValidationError("Site visit not found");
  return visit;
}

async function requireVisitByToken(token: string): Promise<SiteVisit> {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new SiteVisitValidationError("Appointment link is invalid or unavailable");
  const visit = await getSiteVisitByToken(token);
  if (!visit) throw new SiteVisitValidationError("Appointment link is invalid or unavailable");
  return visit;
}

async function safeAlert(visit: SiteVisit, title: string, detail: string, priority: number): Promise<void> {
  try {
    await sendSiteVisitAlert(visit, title, detail, priority);
  } catch (error) {
    await appendSiteVisitEvent(visit.id, "internal_alert_failed", "system", null, {
      alertType: title,
      error: error instanceof Error ? error.message.slice(0, 200) : "Alert failed",
    });
  }
}
