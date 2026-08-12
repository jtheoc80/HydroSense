"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { chicagoDateKey } from "@/lib/site-visits/timezone";
import type { RiskResult } from "@/lib/site-visits/risk";
import type { SiteVisit } from "@/lib/site-visits/types";

type DashboardVisit = SiteVisit & {
  risk: RiskResult;
  hasCommunicationFailure: boolean;
  hasQuote: boolean;
};

const statusTone: Record<string, string> = {
  draft: "bg-fog-400/15 text-fog-300",
  awaiting_confirmation: "bg-signal-400/15 text-signal-400",
  confirmed: "bg-hydro-400/15 text-hydro-300",
  reschedule_requested: "bg-alert-500/15 text-red-300",
  canceled: "bg-alert-500/15 text-red-300",
  en_route: "bg-hydro-400 text-ink-950",
  in_progress: "bg-purple-500/20 text-purple-300",
  completed: "bg-green-500/20 text-green-300",
  no_show: "bg-alert-500/15 text-red-300",
  recheck_requested: "bg-signal-400/20 text-signal-400",
  recheck_scheduled: "bg-hydro-400/15 text-hydro-300",
  recheck_closed: "bg-fog-400/15 text-fog-300",
};

export default function SiteVisitsDashboard({ visits }: { visits: DashboardVisit[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [readiness, setReadiness] = useState("");
  const [rep, setRep] = useState("");
  const [queue, setQueue] = useState("");
  const [date, setDate] = useState("");
  const now = Date.now();
  const todayKey = chicagoDateKey(new Date(now));

  const filtered = useMemo(() => visits.filter((visit) => {
    const q = search.toLowerCase().trim();
    const haystack = `${visit.customer_first_name} ${visit.customer_last_name} ${visit.property_address} ${visit.customer_phone || ""}`.toLowerCase();
    if (q && !haystack.includes(q)) return false;
    if (status && visit.appointment_status !== status) return false;
    if (readiness && visit.readiness_status !== readiness) return false;
    if (rep && visit.assigned_rep_name !== rep) return false;
    if (date && chicagoDateKey(visit.scheduled_start) !== date) return false;
    if (queue && !matchesQueue(queue, visit, todayKey)) return false;
    return true;
  }), [visits, search, status, readiness, rep, date, queue, todayKey]);

  const queues = [
    ["Today", (v: DashboardVisit) => chicagoDateKey(v.scheduled_start) === todayKey],
    ["Awaiting confirmation", (v: DashboardVisit) => !v.confirmed_at && !["draft", "canceled", "completed", "no_show"].includes(v.appointment_status)],
    ["Pre-visit incomplete", (v: DashboardVisit) => v.previsit_status !== "complete" && !["draft", "canceled", "completed", "no_show"].includes(v.appointment_status)],
    ["At risk", (v: DashboardVisit) => v.risk.level === "high" || v.risk.level === "medium"],
    ["Reschedule requests", (v: DashboardVisit) => v.appointment_status === "reschedule_requested"],
    ["Completed awaiting quote", (v: DashboardVisit) => v.appointment_status === "completed" && !v.hasQuote && ["ready_for_proposal", "site_prep_required"].includes(v.readiness_status)],
    ["Repair / preparation follow-up", (v: DashboardVisit) => ["leak_repair_required", "plumber_review_required", "site_prep_required"].includes(v.readiness_status)],
    ["Overdue / unresolved", (v: DashboardVisit) => v.risk.level === "high" && new Date(v.scheduled_start).getTime() < now],
    ["Delivery failures", (v: DashboardVisit) => v.hasCommunicationFailure],
  ] as const;

  const reps = Array.from(new Set(visits.map((visit) => visit.assigned_rep_name))).sort();
  const upcoming = filtered;

  return (
    <main className="min-h-screen bg-ink-950 text-fog-100">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-hydro-300">Closed-loop field operations</p>
            <h1 className="mt-2 font-display text-3xl text-fog-50 sm:text-4xl">Site visits</h1>
            <p className="mt-2 max-w-2xl text-sm text-fog-300">Confirmation, preparation, field assessment, readiness, and quote handoff in one record.</p>
          </div>
          <Link href="/admin/site-visits/new" className="btn-primary min-h-11">Schedule site visit</Link>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8" aria-label="Operational queues">
          {queues.map(([label, predicate]) => {
            const count = visits.filter(predicate).length;
            return <button type="button" key={label} onClick={() => setQueue(queue === label ? "" : label)} aria-pressed={queue === label} className={`min-h-11 rounded-xl border p-4 text-left ${queue === label ? "border-hydro-400 bg-hydro-400/10" : "border-white/10 bg-ink-900"}`}><div className="font-mono text-2xl text-fog-50">{count}</div><div className="mt-1 text-xs leading-snug text-fog-300">{label}</div></button>;
          })}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="xl:col-span-2"><span className="sr-only">Search visits</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, address, or phone" className="h-11 w-full rounded-lg border border-white/15 bg-ink-800 px-3 text-sm text-fog-50 outline-none focus:border-hydro-400" /></label>
            <select aria-label="Appointment status" value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-ink-800 px-3 text-sm"><option value="">All appointment statuses</option>{Array.from(new Set(visits.map((visit) => visit.appointment_status))).map((value) => <option key={value}>{value}</option>)}</select>
            <select aria-label="Readiness status" value={readiness} onChange={(event) => setReadiness(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-ink-800 px-3 text-sm"><option value="">All readiness statuses</option>{Array.from(new Set(visits.map((visit) => visit.readiness_status))).map((value) => <option key={value}>{value}</option>)}</select>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-1"><select aria-label="Representative" value={rep} onChange={(event) => setRep(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-ink-800 px-3 text-sm"><option value="">All reps</option>{reps.map((value) => <option key={value}>{value}</option>)}</select><input aria-label="Appointment date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-11 rounded-lg border border-white/15 bg-ink-800 px-3 text-sm" /></div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
          <div className="border-b border-white/10 px-5 py-4"><h2 className="font-semibold text-fog-50">Operational and recent</h2><p className="text-xs text-fog-400">{upcoming.length} matching visits, including unresolved overdue work</p></div>
          <div className="divide-y divide-white/10">
            {upcoming.map((visit) => (
              <Link key={visit.id} href={`/admin/site-visits/${visit.id}`} className="grid gap-3 px-5 py-4 transition-colors hover:bg-ink-800/70 md:grid-cols-[180px_1.4fr_1fr_180px] md:items-center">
                <div><div className="text-sm font-semibold text-fog-50">{new Intl.DateTimeFormat("en-US", { timeZone: visit.timezone, weekday: "short", month: "short", day: "numeric" }).format(new Date(visit.scheduled_start))}</div><div className="font-mono text-xs text-hydro-300">{new Intl.DateTimeFormat("en-US", { timeZone: visit.timezone, hour: "numeric", minute: "2-digit" }).format(new Date(visit.scheduled_start))} · {visit.arrival_window_minutes}m window</div></div>
                <div><div className="font-semibold text-fog-50">{visit.customer_first_name} {visit.customer_last_name}</div><div className="truncate text-sm text-fog-300">{visit.property_address}</div></div>
                <div><div className="text-sm text-fog-200">{visit.assigned_rep_name}</div><div className={`mt-1 text-xs ${visit.risk.level === "high" ? "text-red-300" : visit.risk.level === "medium" ? "text-signal-400" : "text-fog-400"}`}>{visit.risk.nextAction}</div></div>
                <div className="flex flex-wrap gap-2 md:justify-end"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone[visit.appointment_status] || statusTone.draft}`}>{visit.appointment_status.replaceAll("_", " ")}</span>{visit.hasCommunicationFailure && <span className="rounded-full bg-alert-500/15 px-2.5 py-1 text-[11px] font-semibold text-red-300">delivery failed</span>}</div>
              </Link>
            ))}
            {upcoming.length === 0 && <p className="px-5 py-12 text-center text-sm text-fog-400">No site visits match these filters.</p>}
          </div>
          {queue && <button type="button" onClick={() => setQueue("")} className="mt-3 min-h-11 rounded-lg border border-hydro-400/40 px-4 text-sm text-hydro-300">Clear queue: {queue}</button>}
        </section>
      </div>
    </main>
  );
}

function matchesQueue(label: string, visit: DashboardVisit, todayKey: string): boolean {
  const active = !["draft", "canceled", "completed", "no_show", "recheck_closed", "recheck_scheduled"].includes(visit.appointment_status);
  switch (label) {
    case "Today": return chicagoDateKey(visit.scheduled_start) === todayKey;
    case "Awaiting confirmation": return !visit.confirmed_at && active;
    case "Pre-visit incomplete": return visit.previsit_status !== "complete" && active;
    case "At risk": return ["high", "medium"].includes(visit.risk.level);
    case "Overdue / unresolved": return visit.risk.level === "high" && new Date(visit.scheduled_start).getTime() < Date.now();
    case "Reschedule requests": return visit.appointment_status === "reschedule_requested";
    case "Completed awaiting quote": return visit.appointment_status === "completed" && !visit.hasQuote && ["ready_for_proposal", "site_prep_required"].includes(visit.readiness_status);
    case "Repair / preparation follow-up": return ["leak_repair_required", "plumber_review_required", "site_prep_required"].includes(visit.readiness_status);
    case "Delivery failures": return visit.hasCommunicationFailure;
    default: return true;
  }
}
