import crypto from "crypto";
import { allocateQuoteNumber } from "@/lib/quotes";
import { supabase } from "@/lib/supabase";
import { sendSiteVisitAlert } from "./alerts";
import { retrySiteVisitMessage, sendSiteVisitCommunication, type DeliveryResult } from "./communications";
import { customerPortalUrl } from "./format";
import { buildCorrectiveActions, evaluateReadiness, quoteEligibility } from "./readiness";
import {
  appendSiteVisitEvent,
  createLinkedRecheckVisit,
  createSiteVisit,
  getLatestVisitInCycle,
  getSiteVisitById,
  getSiteVisitByToken,
  listSiteVisitCycle,
  listSiteVisitEvents,
  listSiteVisitMessages,
  markAssessmentSaveEvent,
  setCorrectiveActions,
  updateAssessmentWithRevision,
  updateLinkedLeadForBooking,
  updateSiteVisit,
  type CreateSiteVisitInput,
} from "./repository";
import {
  closeRecheckSchema,
  correctiveActionSchema,
  createSiteVisitSchema,
  customerCancellationSchema,
  customerRescheduleSchema,
  declineRescheduleSchema,
  enRouteSchema,
  previsitAnswersSchema,
  rescheduleSiteVisitSchema,
  scheduleRecheckSchema,
  siteAssessmentSchema,
} from "./schemas";
import { buildCustomerSummary } from "./summary";
import { parseChicagoLocalDateTime, parseDistinctChicagoOptions, LocalTimeValidationError } from "./timezone";
import { InvalidSiteVisitTransitionError, validateTransition } from "./transitions";
import type { CorrectiveAction, SiteAssessment, SiteVisit, SiteVisitEvent } from "./types";

export class SiteVisitValidationError extends Error {
  constructor(message: string, public readonly details: unknown = undefined) {
    super(message);
    this.name = "SiteVisitValidationError";
  }
}

export class SiteVisitConflictError extends Error {
  constructor(message: string, public readonly details: unknown = undefined) {
    super(message);
    this.name = "SiteVisitConflictError";
  }
}

function validation<T>(result: { success: true; data: T } | { success: false; error: { flatten(): unknown } }, message: string): T {
  if (!result.success) throw new SiteVisitValidationError(message, result.error.flatten());
  return result.data;
}

function chicagoUtc(value: string): string {
  try {
    return parseChicagoLocalDateTime(value);
  } catch (error) {
    if (error instanceof LocalTimeValidationError) throw new SiteVisitValidationError(error.message);
    throw error;
  }
}

function assertTransition(visit: SiteVisit, to: SiteVisit["appointment_status"], overrideReason?: string): void {
  try {
    validateTransition(visit.appointment_status, to, { adminOverrideReason: overrideReason });
  } catch (error) {
    if (error instanceof InvalidSiteVisitTransitionError) {
      throw new SiteVisitConflictError(error.message, { from: error.from, to: error.to });
    }
    throw error;
  }
}

export async function scheduleSiteVisit(raw: unknown): Promise<{ visit: SiteVisit; deliveries: DeliveryResult[] }> {
  const parsed = validation(createSiteVisitSchema.safeParse(raw), "Invalid appointment details");
  const scheduledStart = chicagoUtc(parsed.scheduledStart);
  let visit = await createSiteVisit({ ...parsed, scheduledStart } as CreateSiteVisitInput);
  await appendSiteVisitEvent(visit.id, "created", "admin", null, {
    from: null, to: visit.appointment_status, scheduledStart, sendConfirmation: parsed.sendConfirmation,
  });

  const portalUrl = customerPortalUrl(visit.customer_portal_token);
  if (!parsed.sendConfirmation) return { visit, deliveries: [] };
  await updateLinkedLeadForBooking(visit, portalUrl);
  const deliveries = await sendSiteVisitCommunication(visit, "confirmation");
  const accepted = deliveries.some((delivery) => delivery.status === "sent");
  if (accepted) visit = await updateSiteVisit(visit.id, { confirmation_sent_at: new Date().toISOString() });
  await appendSiteVisitEvent(visit.id, "confirmation_requested", "system", null, {
    providerSendStatuses: deliveries.map(({ channel, status }) => ({ channel, status })), scheduleVersion: visit.schedule_version,
  });
  if (!accepted) await safeAlert(visit, "Site visit confirmation failed", "No configured customer channel was accepted by its provider. Contact the customer directly.", 1);
  return { visit, deliveries };
}

export async function resendConfirmation(id: string, _idempotencyKey?: string): Promise<DeliveryResult[]> {
  let visit = await requireVisitById(id);
  if (!["draft", "awaiting_confirmation", "confirmed"].includes(visit.appointment_status)) {
    throw new SiteVisitConflictError(`A confirmation cannot be retried from ${visit.appointment_status}`);
  }
  if (visit.appointment_status === "draft") {
    assertTransition(visit, "awaiting_confirmation");
    visit = await updateSiteVisit(id, { appointment_status: "awaiting_confirmation", previsit_status: "pending" });
    await appendSiteVisitEvent(id, "confirmation_opened", "admin", null, {
      from: "draft", to: "awaiting_confirmation", scheduleVersion: visit.schedule_version,
    });
  }
  const deliveries = await sendSiteVisitCommunication(visit, "confirmation");
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(id, {
      confirmation_sent_at: new Date().toISOString(),
      previsit_status: visit.previsit_status === "not_sent" ? "pending" : visit.previsit_status,
    });
  }
  await appendSiteVisitEvent(id, "confirmation_retry_requested", "admin", null, {
    providerSendStatuses: deliveries.map(({ channel, status }) => ({ channel, status })),
    scheduleVersion: visit.schedule_version, appointmentStatus: visit.appointment_status,
  });
  return deliveries;
}

export async function retryFailedMessage(id: string, messageId: string, actorLabel?: string): Promise<DeliveryResult[]> {
  const visit = await requireVisitById(id);
  const deliveries = await retrySiteVisitMessage(messageId);
  await appendSiteVisitEvent(visit.id, "message_retry_requested", "admin", actorLabel, {
    messageId, providerSendStatuses: deliveries.map(({ channel, status }) => ({ channel, status })),
  });
  return deliveries;
}

export async function adminReschedule(id: string, raw: unknown): Promise<{ visit: SiteVisit; deliveries: DeliveryResult[] }> {
  const parsed = validation(rescheduleSiteVisitSchema.safeParse(raw), "Invalid reschedule details");
  const existing = await requireVisitById(id);
  const nextStatus = "awaiting_confirmation" as const;
  assertTransition(existing, nextStatus);
  const selectedOption = parsed.selectedOption && parsed.selectedOption !== "custom" ? parsed.selectedOption : null;
  const storedOption = selectedOption ? existing.reschedule_request?.[selectedOption] : null;
  if (selectedOption && !storedOption) throw new SiteVisitValidationError("The selected customer option is unavailable");
  const scheduledStart = storedOption || chicagoUtc(parsed.scheduledStart!);
  const visit = await updateSiteVisit(id, {
    scheduled_start: scheduledStart,
    ...(parsed.arrivalWindowMinutes !== undefined ? { arrival_window_minutes: parsed.arrivalWindowMinutes } : {}),
    ...(parsed.assignedRepName ? { assigned_rep_name: parsed.assignedRepName } : {}),
    schedule_version: existing.schedule_version + 1,
    appointment_status: nextStatus,
    confirmed_at: null,
    confirmation_sent_at: null,
    en_route_at: null,
    started_at: null,
    reschedule_request: null,
    reschedule_requested_at: null,
  });
  await appendSiteVisitEvent(id, "rescheduled", "admin", parsed.actorLabel, {
    from: existing.appointment_status, to: visit.appointment_status,
    priorScheduledStart: existing.scheduled_start, scheduledStart, scheduleVersion: visit.schedule_version,
    selectedOption: selectedOption || "custom", reason: parsed.reason || existing.reschedule_request?.note || "Admin reschedule",
    customerRequestedAt: existing.reschedule_request?.requestedAt || null,
  });
  if (visit.lead_id) await updateLinkedLeadForBooking(visit, customerPortalUrl(visit.customer_portal_token));
  const deliveries = await sendSiteVisitCommunication(visit, "confirmation");
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(id, { confirmation_sent_at: new Date().toISOString() });
  }
  return { visit, deliveries };
}

export async function declineCustomerReschedule(id: string, raw: unknown): Promise<SiteVisit> {
  const parsed = validation(declineRescheduleSchema.safeParse(raw), "A decline reason and actor are required");
  const visit = await requireVisitById(id);
  if (visit.appointment_status !== "reschedule_requested" || !visit.reschedule_request) {
    throw new SiteVisitConflictError("There is no unresolved reschedule request");
  }
  const nextStatus = visit.confirmed_at ? "confirmed" : "awaiting_confirmation";
  assertTransition(visit, nextStatus);
  const updated = await updateSiteVisit(id, {
    appointment_status: nextStatus, reschedule_request: null, reschedule_requested_at: null,
  });
  await appendSiteVisitEvent(id, "reschedule_declined", "admin", parsed.actorLabel, {
    from: visit.appointment_status, to: nextStatus, reason: parsed.reason,
    retainedScheduledStart: visit.scheduled_start, scheduleVersion: visit.schedule_version,
  });
  return updated;
}

export async function confirmCustomerVisit(token: string): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (visit.confirmed_at && visit.appointment_status === "confirmed") return visit;
  assertTransition(visit, "confirmed");
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, { appointment_status: "confirmed", confirmed_at: now });
  await appendSiteVisitEvent(visit.id, "confirmed", "customer", null, {
    from: visit.appointment_status, to: "confirmed", scheduleVersion: visit.schedule_version,
  });
  await sendSiteVisitCommunication(updated, "confirmation-receipt");
  return updated;
}

export async function submitPrevisit(token: string, raw: unknown): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (["canceled", "completed", "no_show", "recheck_closed"].includes(visit.appointment_status)) {
    throw new SiteVisitConflictError("This preparation form is closed");
  }
  const parsed = validation(previsitAnswersSchema.safeParse(raw), "Check the preparation form");
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, {
    previsit_answers: parsed, previsit_status: "complete", previsit_completed_at: now,
  });
  await appendSiteVisitEvent(visit.id, "previsit_completed", "customer", null, { assessmentVersion: visit.assessment_version });
  await sendSiteVisitCommunication(updated, "previsit-complete");
  return updated;
}

export async function requestCustomerReschedule(token: string, raw: unknown): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  assertTransition(visit, "reschedule_requested");
  const parsed = validation(customerRescheduleSchema.safeParse(raw), "Provide at least two valid appointment options");
  let options: string[];
  try {
    options = parseDistinctChicagoOptions([parsed.option1, parsed.option2, ...(parsed.option3 ? [parsed.option3] : [])]);
  } catch (error) {
    if (error instanceof LocalTimeValidationError) throw new SiteVisitValidationError(error.message);
    throw error;
  }
  const now = new Date().toISOString();
  const updated = await updateSiteVisit(visit.id, {
    appointment_status: "reschedule_requested", reschedule_requested_at: now,
    reschedule_request: {
      option1: options[0], option2: options[1], ...(options[2] ? { option3: options[2] } : {}),
      ...(parsed.note ? { note: parsed.note } : {}), requestedAt: now,
    },
  });
  await appendSiteVisitEvent(visit.id, "reschedule_requested", "customer", null, {
    from: visit.appointment_status, to: "reschedule_requested", options,
  });
  await safeAlert(updated, "Site visit reschedule requested", "The original time remains pending until HydroSense confirms a replacement.", 1);
  return updated;
}

export async function cancelCustomerVisit(token: string, raw: unknown): Promise<SiteVisit> {
  const visit = await requireVisitByToken(token);
  if (visit.appointment_status === "canceled") return visit;
  const parsed = validation(customerCancellationSchema.safeParse(raw), "A cancellation reason is required");
  assertTransition(visit, "canceled");
  const updated = await updateSiteVisit(visit.id, { appointment_status: "canceled", canceled_at: new Date().toISOString() });
  await appendSiteVisitEvent(visit.id, "canceled", "customer", null, {
    from: visit.appointment_status, to: "canceled", reason: parsed.reason,
  });
  await safeAlert(updated, "Site visit canceled", `Customer reason: ${parsed.reason}`, 1);
  return updated;
}

export async function markEnRoute(id: string, raw: unknown): Promise<{ visit: SiteVisit; deliveries: DeliveryResult[] }> {
  const parsed = validation(enRouteSchema.safeParse(raw), "Invalid ETA");
  const visit = await requireVisitById(id);
  let updated = visit;
  if (visit.appointment_status !== "en_route") {
    assertTransition(visit, "en_route");
    updated = await updateSiteVisit(id, { appointment_status: "en_route", en_route_at: new Date().toISOString() });
    await appendSiteVisitEvent(id, "en_route", "representative", updated.assigned_rep_name, {
      from: visit.appointment_status, to: "en_route", ...(parsed.etaMinutes !== undefined ? { etaMinutes: parsed.etaMinutes } : {}),
    });
  }
  const deliveries = await sendSiteVisitCommunication(updated, "en-route", { etaMinutes: parsed.etaMinutes });
  if (visit.appointment_status === "en_route") {
    await appendSiteVisitEvent(id, "en_route_notification_retry", "admin", updated.assigned_rep_name, {
      providerSendStatuses: deliveries.map(({ channel, status }) => ({ channel, status })),
    });
  }
  return { visit: updated, deliveries };
}

export async function saveAssessment(
  id: string,
  raw: unknown,
  expectedRevision: number,
  actorLabel?: string
): Promise<SiteVisit> {
  const parsed = validation(siteAssessmentSchema.safeParse(raw), "Assessment draft contains invalid values");
  if (!Number.isInteger(expectedRevision) || expectedRevision < 0) throw new SiteVisitValidationError("Assessment revision is required");
  const visit = await requireVisitById(id);
  if (visit.appointment_status !== "in_progress") assertTransition(visit, "in_progress");
  const updated = await updateAssessmentWithRevision(id, expectedRevision, {
    assessment: parsed,
    appointment_status: "in_progress",
    started_at: visit.started_at || new Date().toISOString(),
  });
  if (!updated) throw new SiteVisitConflictError("Assessment changed in another session", { currentRevision: visit.assessment_revision });
  if (visit.appointment_status !== "in_progress") {
    await appendSiteVisitEvent(id, "assessment_started", "representative", actorLabel || visit.assigned_rep_name, {
      from: visit.appointment_status, to: "in_progress", assessmentVersion: visit.assessment_version,
    });
  }
  await markAssessmentSaveEvent(id, actorLabel || visit.assigned_rep_name);
  return updated;
}

export async function completeAssessment(
  id: string,
  raw: unknown,
  expectedRevision: number
): Promise<{ visit: SiteVisit; deliveries: DeliveryResult[] }> {
  const parsed = validation(siteAssessmentSchema.safeParse(raw), "Assessment contains invalid values");
  if (!Number.isInteger(expectedRevision) || expectedRevision < 0) throw new SiteVisitValidationError("Assessment revision is required");
  const visit = await requireVisitById(id);
  if (visit.appointment_status === "completed") return { visit, deliveries: [] };
  assertTransition(visit, "completed");
  const assessment = parsed as SiteAssessment;
  const readiness = evaluateReadiness(assessment, visit.previsit_answers);
  if (readiness.status === "unassessed") {
    throw new SiteVisitValidationError("Complete all required assessment fields", {
      missingRequiredFields: readiness.missingRequiredFields, blockers: readiness.blockers,
    });
  }
  const now = new Date().toISOString();
  const correctiveActions = buildCorrectiveActions(readiness.blockers);
  const summary = buildCustomerSummary(assessment, readiness, visit.follow_up_at || undefined);
  const acknowledged = Boolean(assessment.customerAcknowledgment?.acknowledged && assessment.customerAcknowledgment?.typedName?.trim());
  const updated = await updateAssessmentWithRevision(id, expectedRevision, {
    assessment, readiness_status: readiness.status, blockers: readiness.blockers,
    corrective_actions: correctiveActions, customer_summary: summary,
    appointment_status: "completed", completed_at: now,
    ...(acknowledged ? { customer_acknowledged_at: now } : {}),
  });
  if (!updated) throw new SiteVisitConflictError("Assessment changed before completion", { currentRevision: visit.assessment_revision });
  if (visit.lead_id) await supabase.from("leads").update({ status: "showed" }).eq("id", visit.lead_id);
  await appendSiteVisitEvent(id, "completed", "representative", visit.assigned_rep_name, {
    from: visit.appointment_status, to: "completed", assessmentVersion: visit.assessment_version,
    readinessStatus: readiness.status, blockerCodes: readiness.blockers.map((item) => item.code), customerAcknowledged: acknowledged,
  });
  const deliveries = await sendSiteVisitCommunication(updated, "completion");
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(id, { summary_sent_at: now });
    await appendSiteVisitEvent(id, "summary_provider_accepted", "system", null, {
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
  if (visit.appointment_status === "recheck_requested") return visit;
  if (!visit.completed_at || visit.readiness_status === "ready_for_proposal") {
    throw new SiteVisitConflictError("This visit is not eligible for a recheck request");
  }
  assertTransition(visit, "recheck_requested");
  const now = new Date().toISOString();
  const correctiveActions = visit.corrective_actions.map((action) => action.status === "open"
    ? { ...action, status: "customer_reported_complete" as const, customerCompletedAt: now }
    : action);
  const updated = await updateSiteVisit(visit.id, {
    appointment_status: "recheck_requested", recheck_requested_at: now, corrective_actions: correctiveActions,
  });
  await appendSiteVisitEvent(visit.id, "recheck_requested", "customer", null, {
    from: visit.appointment_status, to: "recheck_requested", readinessStatusPreserved: visit.readiness_status,
    reportedActionIds: correctiveActions.filter((action) => action.status === "customer_reported_complete").map((action) => action.id),
  });
  await safeAlert(updated, "Site visit recheck requested", "The customer reports the required work is complete. Readiness was not changed automatically.", 1);
  await sendSiteVisitCommunication(updated, "recheck-receipt");
  return updated;
}

export async function scheduleLinkedRecheck(id: string, raw: unknown): Promise<{ original: SiteVisit; visit: SiteVisit; deliveries: DeliveryResult[] }> {
  const parsed = validation(scheduleRecheckSchema.safeParse(raw), "Invalid recheck schedule");
  const original = await requireVisitById(id);
  assertTransition(original, "recheck_scheduled");
  const scheduledStart = chicagoUtc(parsed.scheduledStart);
  const visit = await createLinkedRecheckVisit(original, {
    scheduledStart, arrivalWindowMinutes: parsed.arrivalWindowMinutes,
    assignedRepName: parsed.assignedRepName, assignedRepPhone: parsed.assignedRepPhone,
  });
  const updatedOriginal = await updateSiteVisit(original.id, { appointment_status: "recheck_scheduled" });
  await appendSiteVisitEvent(original.id, "recheck_scheduled", "admin", parsed.actorLabel, {
    from: original.appointment_status, to: "recheck_scheduled", linkedVisitId: visit.id,
    assessmentVersion: visit.assessment_version, scheduledStart,
  });
  await appendSiteVisitEvent(visit.id, "linked_recheck_created", "admin", parsed.actorLabel, {
    fromVisitId: original.id, rootVisitId: visit.parent_site_visit_id,
    assessmentVersion: visit.assessment_version, priorReadiness: original.readiness_status,
  });
  const deliveries = await sendSiteVisitCommunication(visit, "confirmation");
  if (deliveries.some((delivery) => delivery.status === "sent")) {
    await updateSiteVisit(visit.id, { confirmation_sent_at: new Date().toISOString() });
  }
  return { original: updatedOriginal, visit, deliveries };
}

export async function closeRecheckRequest(id: string, raw: unknown): Promise<SiteVisit> {
  const parsed = validation(closeRecheckSchema.safeParse(raw), "A close reason and actor are required");
  const visit = await requireVisitById(id);
  assertTransition(visit, "recheck_closed");
  const updated = await updateSiteVisit(id, { appointment_status: "recheck_closed", recheck_closed_at: new Date().toISOString() });
  await appendSiteVisitEvent(id, "recheck_closed", "admin", parsed.actorLabel, {
    from: visit.appointment_status, to: "recheck_closed", reason: parsed.reason,
  });
  return updated;
}

export async function markNoShow(id: string, raw: unknown): Promise<SiteVisit> {
  const parsed = validation(closeRecheckSchema.safeParse(raw), "A no-show reason and actor are required");
  const visit = await requireVisitById(id);
  assertTransition(visit, "no_show");
  const updated = await updateSiteVisit(id, { appointment_status: "no_show" });
  await appendSiteVisitEvent(id, "no_show", "admin", parsed.actorLabel, {
    from: visit.appointment_status, to: "no_show", reason: parsed.reason,
    scheduledStart: visit.scheduled_start, arrivalWindowMinutes: visit.arrival_window_minutes,
  });
  return updated;
}

export async function resolveCorrectiveAction(id: string, raw: unknown): Promise<SiteVisit> {
  const parsed = validation(correctiveActionSchema.safeParse(raw), "Invalid corrective-action update");
  const visit = await requireVisitById(id);
  const index = visit.corrective_actions.findIndex((action) => action.id === parsed.actionId);
  if (index < 0) throw new SiteVisitValidationError("Corrective action not found");
  const now = new Date().toISOString();
  const next: CorrectiveAction = {
    ...visit.corrective_actions[index], status: parsed.status,
    ...(parsed.targetDate ? { targetDate: parsed.targetDate } : {}),
    verifiedAt: now, verifiedBy: parsed.actorLabel, verificationNote: parsed.note,
  };
  const correctiveActions = [...visit.corrective_actions];
  correctiveActions[index] = next;
  const updated = await setCorrectiveActions(id, correctiveActions);
  await appendSiteVisitEvent(id, "corrective_action_resolved", "admin", parsed.actorLabel, {
    actionId: parsed.actionId, priorStatus: visit.corrective_actions[index].status,
    status: parsed.status, note: parsed.note, targetDate: parsed.targetDate || null,
  });
  return updated;
}

export async function createDraftQuoteForVisit(id: string): Promise<{ quoteId: string; created: boolean }> {
  const requested = await requireVisitById(id);
  const visit = await getLatestVisitInCycle(requested);
  const cycle = await listSiteVisitCycle(visit);
  const { data: existing } = await supabase.from("quotes").select("id").in("site_visit_id", cycle.map((item) => item.id)).maybeSingle();
  if (existing?.id) return { quoteId: existing.id, created: false };
  const eligibility = quoteEligibility(visit.readiness_status);
  if (!eligibility.allowed || visit.appointment_status !== "completed") {
    throw new SiteVisitConflictError(eligibility.reason || "The latest assessment is not eligible for a quote");
  }

  const { data: lead } = visit.lead_id
    ? await supabase.from("leads").select("carrier").eq("id", visit.lead_id).maybeSingle()
    : { data: null };
  const quoteNumber = await allocateQuoteNumber();
  const addonMap: Record<string, { sku: string; name: string; description: string; price: number }> = {
    "power-not-verified": { sku: "INST-ELEC", name: "Electrical outlet install", description: "Standard outlet near the monitoring location", price: 275 },
    "sprinkler-bypass-required": { sku: "INST-SPRINK", name: "Sprinkler bypass install", description: "Verified bypass configuration", price: 350 },
    "wifi-not-verified": { sku: "ADD-WIFI", name: "Wi-Fi extender", description: "Wi-Fi coverage for the monitoring location", price: 89 },
  };
  const lineItems = visit.blockers.map((item) => addonMap[item.code])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item, index, all) => all.findIndex((candidate) => candidate.sku === item.sku) === index)
    .map((item) => ({ ...item, quantity: 1, unit_price: item.price, line_total: item.price }))
    .map(({ price: _price, ...item }) => item);
  const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
  const { data: quote, error } = await supabase.from("quotes").insert({
    quote_number: quoteNumber, public_token: crypto.randomBytes(16).toString("hex"), site_visit_id: visit.id,
    lead_id: visit.lead_id, customer_first_name: visit.customer_first_name, customer_last_name: visit.customer_last_name,
    customer_email: visit.customer_email || "", customer_phone: visit.customer_phone,
    property_address: visit.property_address, property_city: visit.property_city, property_zip: visit.property_zip,
    carrier: lead?.carrier || null, line_items: lineItems, subtotal, total: subtotal,
    notes_internal: [`Source site visit: ${visit.id}`, `Assessment version: ${visit.assessment_version}`,
      `Readiness: ${visit.readiness_status}`, ...visit.blockers.map((item) => `${item.title}: ${item.detail}`)].join("\n"),
    notes_customer: eligibility.conditional
      ? "This conditional draft includes documented site-preparation items. HydroSense will confirm readiness before installation."
      : "Site assessment complete. Select the appropriate monitoring device to finish this proposal.",
    status: "draft",
  }).select("id").single();
  if (error || !quote) {
    const { data: raced } = await supabase.from("quotes").select("id").eq("site_visit_id", visit.id).maybeSingle();
    if (raced?.id) return { quoteId: raced.id, created: false };
    throw new Error(`Unable to create draft quote: ${error?.message || "unknown database error"}`);
  }
  if (visit.lead_id) await supabase.from("leads").update({ status: "quoted" }).eq("id", visit.lead_id);
  await appendSiteVisitEvent(visit.id, "quote_created", "admin", null, {
    quoteId: quote.id, conditional: eligibility.conditional, assessmentVersion: visit.assessment_version,
  });
  return { quoteId: quote.id, created: true };
}

export async function getAdminVisitDetail(id: string) {
  const requested = await requireVisitById(id);
  const visit = await getLatestVisitInCycle(requested);
  const cycle = await listSiteVisitCycle(visit);
  const [events, messages, quoteResult] = await Promise.all([
    Promise.all(cycle.map((item) => listSiteVisitEvents(item.id))).then((items) => items.flat().sort(newestFirst)),
    Promise.all(cycle.map((item) => listSiteVisitMessages(item.id))).then((items) => items.flat().sort(newestFirst)),
    supabase.from("quotes").select("id, quote_number, status, public_token").in("site_visit_id", cycle.map((item) => item.id)).maybeSingle(),
  ]);
  return { visit, cycle, events, messages, quote: quoteResult.data || null };
}

export async function getCustomerPortalData(token: string) {
  const initial = await requireRawVisitByToken(token);
  const cycle = await listSiteVisitCycle(initial);
  const visit = cycle.at(-1) || initial;
  const { data: quote } = await supabase.from("quotes").select("public_token, status").eq("site_visit_id", visit.id).maybeSingle();
  return {
    id: visit.id, customerFirstName: visit.customer_first_name,
    propertyAddress: visit.property_address, propertyCity: visit.property_city, propertyZip: visit.property_zip,
    scheduledStart: visit.scheduled_start, arrivalWindowMinutes: visit.arrival_window_minutes,
    estimatedDurationMinutes: visit.estimated_duration_minutes, timezone: visit.timezone,
    assignedRepName: visit.assigned_rep_name, assignedRepPhone: visit.assigned_rep_phone,
    appointmentStatus: visit.appointment_status, previsitStatus: visit.previsit_status,
    readinessStatus: visit.readiness_status, confirmedAt: visit.confirmed_at,
    previsitAnswers: visit.previsit_answers, customerSummary: visit.customer_summary,
    completedAt: visit.completed_at, canceledAt: visit.canceled_at,
    recheckRequestedAt: visit.recheck_requested_at, assessmentVersion: visit.assessment_version,
    correctiveActions: visit.corrective_actions,
    priorResults: cycle.slice(0, -1).map((item) => ({
      assessmentVersion: item.assessment_version, readinessStatus: item.readiness_status,
      completedAt: item.completed_at, blockers: item.blockers,
    })),
    quoteUrl: quote && quote.status !== "draft" ? `/quote/${quote.public_token}` : null,
  };
}

async function requireVisitById(id: string): Promise<SiteVisit> {
  const visit = await getSiteVisitById(id);
  if (!visit) throw new SiteVisitValidationError("Site visit not found");
  return visit;
}

async function requireRawVisitByToken(token: string): Promise<SiteVisit> {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new SiteVisitValidationError("Appointment link is invalid or unavailable");
  const visit = await getSiteVisitByToken(token);
  if (!visit) throw new SiteVisitValidationError("Appointment link is invalid or unavailable");
  return visit;
}

async function requireVisitByToken(token: string): Promise<SiteVisit> {
  return getLatestVisitInCycle(await requireRawVisitByToken(token));
}

function newestFirst(a: SiteVisitEvent | { created_at: string }, b: SiteVisitEvent | { created_at: string }) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

async function safeAlert(visit: SiteVisit, title: string, detail: string, priority: number): Promise<void> {
  try {
    await sendSiteVisitAlert(visit, title, detail, priority);
  } catch (error) {
    await appendSiteVisitEvent(visit.id, "internal_alert_failed", "system", null, {
      alertType: title, error: error instanceof Error ? error.message.slice(0, 200) : "Alert failed",
    });
  }
}
