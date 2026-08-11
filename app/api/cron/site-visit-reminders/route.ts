import { supabase } from "@/lib/supabase";
import { sendSiteVisitAlert } from "@/lib/site-visits/alerts";
import { sendSiteVisitCommunication } from "@/lib/site-visits/communications";
import { noStoreJson } from "@/lib/site-visits/http";
import { appendSiteVisitEvent } from "@/lib/site-visits/repository";
import type { SiteVisit } from "@/lib/site-visits/types";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return noStoreJson({ ok: false, error: "Cron is not configured" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return noStoreJson({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const horizon = new Date(now.getTime() + 26 * 3_600_000).toISOString();
  const { data, error } = await supabase
    .from("site_visits")
    .select("*")
    .in("appointment_status", ["awaiting_confirmation", "confirmed"])
    .gte("scheduled_start", now.toISOString())
    .lte("scheduled_start", horizon)
    .order("scheduled_start", { ascending: true });
  if (error) return noStoreJson({ ok: false, error: "Unable to select reminders" }, { status: 500 });

  const counts = { selected: data?.length || 0, sent: 0, skipped: 0, failed: 0, riskAlerts: 0 };
  for (const row of data || []) {
    const visit = row as SiteVisit;
    const hoursUntil = (new Date(visit.scheduled_start).getTime() - now.getTime()) / 3_600_000;
    const kind = hoursUntil >= 23 && hoursUntil <= 25
      ? "reminder-24h"
      : hoursUntil >= 2 && hoursUntil <= 4
        ? "reminder-3h"
        : null;
    if (!kind) {
      counts.skipped += 1;
      continue;
    }
    const deliveries = await sendSiteVisitCommunication(visit, kind);
    const sent = deliveries.filter((delivery) => delivery.status === "sent").length;
    const failed = deliveries.filter((delivery) => delivery.status === "failed").length;
    const skipped = deliveries.filter((delivery) => delivery.status === "skipped").length;
    counts.sent += sent;
    counts.failed += failed;
    counts.skipped += skipped;
    if (sent > 0) {
      await appendSiteVisitEvent(visit.id, "reminder_sent", "system", null, {
        reminder: kind,
        scheduleVersion: visit.schedule_version,
        channels: deliveries.filter((delivery) => delivery.status === "sent").map((delivery) => delivery.channel),
      });
    } else if (failed > 0) {
      await appendSiteVisitEvent(visit.id, "reminder_failed", "system", null, {
        reminder: kind,
        scheduleVersion: visit.schedule_version,
      });
    }

    if (kind === "reminder-24h" && !visit.confirmed_at) {
      const eventType = `risk_alerted_24h_v${visit.schedule_version}`;
      const { count } = await supabase
        .from("site_visit_events")
        .select("id", { count: "exact", head: true })
        .eq("site_visit_id", visit.id)
        .eq("event_type", eventType);
      if ((count || 0) === 0) {
        try {
          await sendSiteVisitAlert(visit, "Unconfirmed site visit within 24 hours", "Contact the customer or resolve the appointment before the arrival window.", 1);
          await appendSiteVisitEvent(visit.id, eventType, "system");
          counts.riskAlerts += 1;
        } catch (alertError) {
          await appendSiteVisitEvent(visit.id, "internal_alert_failed", "system", null, {
            alertType: eventType,
            error: alertError instanceof Error ? alertError.message.slice(0, 200) : "Alert failed",
          });
        }
      }
    }
  }

  return noStoreJson({ ok: counts.failed === 0, ...counts });
}
