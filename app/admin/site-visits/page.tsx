import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { confirmationChannelsFailed } from "@/lib/site-visits/repository";
import { evaluateVisitRisk } from "@/lib/site-visits/risk";
import type { SiteVisit } from "@/lib/site-visits/types";
import SiteVisitsDashboard from "./SiteVisitsDashboard";

export const metadata: Metadata = { title: "Admin | Site Visits", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SiteVisitsPage() {
  const { data, error } = await supabase
    .from("site_visits")
    .select("*")
    .order("scheduled_start", { ascending: true })
    .limit(1000);
  if (error) {
    return <div className="min-h-screen bg-ink-950 p-8 text-alert-500">Unable to load site visits. Apply migration 0005 first.</div>;
  }
  const visits = (data || []) as SiteVisit[];
  const { data: failedMessages } = await supabase
    .from("site_visit_messages")
    .select("site_visit_id")
    .eq("status", "failed");
  const { data: quotes } = await supabase.from("quotes").select("site_visit_id").not("site_visit_id", "is", null);
  const failedIds = new Set((failedMessages || []).map((row) => row.site_visit_id));
  const quotedIds = new Set((quotes || []).map((row) => row.site_visit_id));
  const rows = await Promise.all(visits.map(async (visit) => {
    const allFailed = await confirmationChannelsFailed(visit.id, visit.schedule_version);
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
      }),
    };
  }));
  return <SiteVisitsDashboard visits={rows} />;
}
