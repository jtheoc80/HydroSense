import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { evaluateVisitRisk } from "@/lib/site-visits/risk";
import { isCurrentMessageKey } from "@/lib/site-visits/message-policy";
import type { SiteVisit } from "@/lib/site-visits/types";
import SiteVisitsDashboard from "./SiteVisitsDashboard";

export const metadata: Metadata = { title: "Admin | Site Visits", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SiteVisitsPage() {
  const now = new Date();
  const horizon = new Date(now.getTime() + 90 * 86_400_000).toISOString();
  const activeStatuses = ["draft", "awaiting_confirmation", "confirmed", "reschedule_requested", "en_route", "in_progress", "recheck_requested"];
  const [unresolvedPast, operational, history] = await Promise.all([
    supabase.from("site_visits").select("*").in("appointment_status", activeStatuses)
      .lt("scheduled_start", now.toISOString()).order("scheduled_start", { ascending: false }).limit(500),
    supabase.from("site_visits").select("*").gte("scheduled_start", now.toISOString())
      .lte("scheduled_start", horizon).order("scheduled_start", { ascending: true }).limit(1000),
    supabase.from("site_visits").select("*").in("appointment_status", ["completed", "canceled", "no_show", "recheck_closed", "recheck_scheduled"])
      .lt("scheduled_start", now.toISOString()).order("scheduled_start", { ascending: false }).limit(100),
  ]);
  if (unresolvedPast.error || operational.error || history.error) {
    return <div className="min-h-screen bg-ink-950 p-8 text-alert-500">Unable to load site visits. Apply migrations 0005 and 0006 first.</div>;
  }
  const byId = new Map<string, SiteVisit>();
  for (const row of [...(unresolvedPast.data || []), ...(operational.data || []), ...(history.data || [])] as SiteVisit[]) byId.set(row.id, row);
  const visits = Array.from(byId.values()).sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());
  const visitIds = visits.map((visit) => visit.id);
  const { data: messages } = visitIds.length ? await supabase
    .from("site_visit_messages")
    .select("site_visit_id, message_key, status, claimed_at")
    .in("site_visit_id", visitIds) : { data: [] };
  const { data: quotes } = await supabase.from("quotes").select("site_visit_id").not("site_visit_id", "is", null);
  const failedIds = new Set((messages || []).filter((row) => {
    const visit = byId.get(row.site_visit_id);
    return visit && isCurrentMessageKey(row.message_key, visit) && (row.status === "failed" || (row.status === "sending" && (!row.claimed_at || new Date(row.claimed_at).getTime() < now.getTime() - 5 * 60_000)));
  }).map((row) => row.site_visit_id));
  const quotedIds = new Set((quotes || []).map((row) => row.site_visit_id));
  const rows = visits.map((visit) => {
    const confirmationRows = (messages || []).filter((row) => row.site_visit_id === visit.id && row.message_key === `confirmation:v${visit.schedule_version}`);
    const allFailed = confirmationRows.length > 0 && confirmationRows.every((row) => ["failed", "skipped"].includes(row.status));
    return {
      ...visit,
      hasCommunicationFailure: failedIds.has(visit.id),
      hasQuote: quotedIds.has(visit.id),
      risk: evaluateVisitRisk({
        scheduledStart: visit.scheduled_start,
        appointmentStatus: visit.appointment_status,
        previsitStatus: visit.previsit_status,
        confirmedAt: visit.confirmed_at,
        allConfirmationChannelsFailed: allFailed,
        arrivalWindowMinutes: visit.arrival_window_minutes,
        now,
      }),
    };
  });
  return <SiteVisitsDashboard visits={rows} />;
}
