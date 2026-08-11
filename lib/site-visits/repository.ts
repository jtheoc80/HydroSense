import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import type {
  SiteVisit,
  SiteVisitEvent,
  SiteVisitMessage,
} from "./types";
import type { z } from "zod";
import type { createSiteVisitSchema } from "./schemas";

export type CreateSiteVisitInput = z.infer<typeof createSiteVisitSchema>;

export async function createSiteVisit(input: CreateSiteVisitInput): Promise<SiteVisit> {
  const token = crypto.randomBytes(32).toString("hex");
  const { data, error } = await supabase
    .from("site_visits")
    .insert({
      lead_id: input.leadId || null,
      customer_first_name: input.customerFirstName,
      customer_last_name: input.customerLastName,
      customer_phone: input.customerPhone || null,
      customer_email: input.customerEmail || null,
      property_address: input.propertyAddress,
      property_city: input.propertyCity || null,
      property_zip: input.propertyZip || null,
      scheduled_start: input.scheduledStart,
      arrival_window_minutes: input.arrivalWindowMinutes,
      estimated_duration_minutes: input.estimatedDurationMinutes,
      timezone: input.timezone,
      assigned_rep_name: input.assignedRepName,
      assigned_rep_phone: input.assignedRepPhone || null,
      internal_notes: input.internalNotes || null,
      source: input.leadId ? "lead" : "admin",
      customer_portal_token: token,
      appointment_status: input.sendConfirmation ? "awaiting_confirmation" : "draft",
      previsit_status: input.sendConfirmation ? "pending" : "not_sent",
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(`Unable to create site visit: ${error?.message || "unknown database error"}`);
  return data as SiteVisit;
}

export async function updateLinkedLeadForBooking(visit: SiteVisit, portalUrl: string): Promise<void> {
  if (!visit.lead_id) return;
  const { error } = await supabase
    .from("leads")
    .update({
      status: "booked",
      booked_at: visit.scheduled_start,
      meeting_url: portalUrl,
    })
    .eq("id", visit.lead_id);
  if (error) throw new Error(`Unable to update linked lead: ${error.message}`);
}

export async function getSiteVisitById(id: string): Promise<SiteVisit | null> {
  const { data, error } = await supabase.from("site_visits").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Unable to load site visit: ${error.message}`);
  return (data as SiteVisit | null) || null;
}

export async function getSiteVisitByToken(token: string): Promise<SiteVisit | null> {
  const { data, error } = await supabase
    .from("site_visits")
    .select("*")
    .eq("customer_portal_token", token)
    .maybeSingle();
  if (error) throw new Error("Unable to load customer site visit");
  return (data as SiteVisit | null) || null;
}

export async function updateSiteVisit(
  id: string,
  patch: Record<string, unknown>
): Promise<SiteVisit> {
  const { data, error } = await supabase
    .from("site_visits")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Unable to update site visit: ${error?.message || "unknown database error"}`);
  return data as SiteVisit;
}

export async function appendSiteVisitEvent(
  siteVisitId: string,
  eventType: string,
  actorType: SiteVisitEvent["actor_type"],
  actorLabel?: string | null,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await supabase.from("site_visit_events").insert({
    site_visit_id: siteVisitId,
    event_type: eventType,
    actor_type: actorType,
    actor_label: actorLabel || null,
    metadata,
  });
  if (error) throw new Error(`Unable to record site visit event: ${error.message}`);
}

export async function listSiteVisitEvents(siteVisitId: string): Promise<SiteVisitEvent[]> {
  const { data, error } = await supabase
    .from("site_visit_events")
    .select("*")
    .eq("site_visit_id", siteVisitId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load event history: ${error.message}`);
  return (data || []) as SiteVisitEvent[];
}

export async function listSiteVisitMessages(siteVisitId: string): Promise<SiteVisitMessage[]> {
  const { data, error } = await supabase
    .from("site_visit_messages")
    .select("*")
    .eq("site_visit_id", siteVisitId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Unable to load communication history: ${error.message}`);
  return (data || []) as SiteVisitMessage[];
}

export async function markAssessmentSaveEvent(siteVisitId: string, actorLabel?: string): Promise<void> {
  const cutoff = new Date(Date.now() - 5 * 60_000).toISOString();
  const { count } = await supabase
    .from("site_visit_events")
    .select("id", { count: "exact", head: true })
    .eq("site_visit_id", siteVisitId)
    .eq("event_type", "assessment_saved")
    .gte("created_at", cutoff);
  if ((count || 0) === 0) {
    await appendSiteVisitEvent(siteVisitId, "assessment_saved", "representative", actorLabel);
  }
}

export async function confirmationChannelsFailed(siteVisitId: string, scheduleVersion: number): Promise<boolean> {
  const key = `confirmation:v${scheduleVersion}`;
  const { data } = await supabase
    .from("site_visit_messages")
    .select("status")
    .eq("site_visit_id", siteVisitId)
    .eq("message_key", key);
  if (!data || data.length === 0) return false;
  return data.every((row) => row.status === "failed" || row.status === "skipped");
}
