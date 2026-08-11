"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminNav } from "@/components/site-visits/AdminNav";
import { quoteEligibility } from "@/lib/site-visits/readiness";
import type { SiteVisit, SiteVisitEvent, SiteVisitMessage } from "@/lib/site-visits/types";

interface QuoteSummary { id: string; quote_number: string; status: string; public_token: string }

export default function SiteVisitDetail({
  visit, events, messages, quote, portalUrl, initialDeliveryFailure,
}: {
  visit: SiteVisit;
  events: SiteVisitEvent[];
  messages: SiteVisitMessage[];
  quote: QuoteSummary | null;
  portalUrl: string;
  initialDeliveryFailure: boolean;
}) {
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(initialDeliveryFailure ? "The appointment was saved, but no confirmation channel delivered. Review Communication history and contact the customer." : "");
  const [rescheduleOpen, setRescheduleOpen] = useState(visit.appointment_status === "reschedule_requested");
  const [newTime, setNewTime] = useState("");
  const eligibility = quoteEligibility(visit.readiness_status);

  async function action(name: string, url: string, body: unknown = {}) {
    setBusy(name); setNotice("");
    try {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Action failed");
      if (name === "quote") window.location.href = `/admin/quotes/${payload.quoteId}`;
      else window.location.reload();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Action failed");
      setBusy("");
    }
  }

  async function reschedule() {
    setBusy("reschedule"); setNotice("");
    try {
      const value = new Date(newTime);
      if (Number.isNaN(value.getTime())) throw new Error("Choose the new appointment date and time");
      const response = await fetch(`/api/admin/site-visits/${visit.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledStart: value.toISOString() }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to reschedule");
      window.location.reload();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to reschedule"); setBusy(""); }
  }

  const date = new Intl.DateTimeFormat("en-US", { timeZone: visit.timezone, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(visit.scheduled_start));
  const time = new Intl.DateTimeFormat("en-US", { timeZone: visit.timezone, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(visit.scheduled_start));
  return (
    <main className="min-h-screen bg-ink-950 text-fog-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav current="site-visits" />
        <div className="mt-6 flex items-center gap-2 text-xs text-fog-400"><Link href="/admin/site-visits" className="hover:text-hydro-300">Site visits</Link><span>/</span><span>{visit.customer_first_name} {visit.customer_last_name}</span></div>
        <header className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-hydro-300">{visit.appointment_status.replaceAll("_", " ")}</p><h1 className="mt-2 font-display text-3xl text-fog-50 sm:text-4xl">{visit.customer_first_name} {visit.customer_last_name}</h1><p className="mt-2 text-sm text-fog-300">{visit.property_address}{visit.property_city ? `, ${visit.property_city}` : ""} {visit.property_zip || ""}</p></div>
          <div className="flex flex-wrap gap-2">
            {visit.customer_phone && <a href={`tel:${visit.customer_phone}`} className="min-h-11 rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/5">Call customer</a>}
            <button onClick={() => { void navigator.clipboard.writeText(portalUrl); setNotice("Customer portal link copied."); }} className="min-h-11 rounded-lg border border-hydro-400/50 px-4 py-3 text-sm font-semibold text-hydro-300 hover:bg-hydro-400/10">Copy portal link</button>
            <Link href={`/admin/site-visits/${visit.id}/assessment`} className="btn-primary min-h-11">Open assessment</Link>
          </div>
        </header>

        {notice && <div role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${notice.includes("copied") ? "border-green-500/30 bg-green-500/10 text-green-200" : "border-signal-400/30 bg-signal-400/10 text-signal-400"}`}>{notice}</div>}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Appointment" value={`${date} · ${time}`} sub={`${visit.arrival_window_minutes}-minute arrival window`} />
          <Info label="Representative" value={visit.assigned_rep_name} sub={visit.assigned_rep_phone || "No rep phone"} />
          <Info label="Confirmation" value={visit.confirmed_at ? "Confirmed" : "Awaiting confirmation"} sub={visit.confirmed_at ? formatStamp(visit.confirmed_at) : "Customer action needed"} />
          <Info label="Preparation" value={visit.previsit_status.replaceAll("_", " ")} sub={visit.previsit_completed_at ? formatStamp(visit.previsit_completed_at) : "Not complete"} />
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-ink-900 p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-fog-300">Next actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button disabled={Boolean(busy)} onClick={() => void action("resend", `/api/admin/site-visits/${visit.id}/resend`, { idempotencyKey: crypto.randomUUID() })} className="min-h-11 rounded-lg border border-white/20 px-4 text-sm font-semibold hover:bg-white/5 disabled:opacity-50">{busy === "resend" ? "Sending…" : "Resend confirmation"}</button>
            <button disabled={Boolean(busy) || Boolean(visit.en_route_at)} onClick={() => { const eta = window.prompt("Optional ETA in minutes", "30"); void action("en-route", `/api/admin/site-visits/${visit.id}/en-route`, eta ? { etaMinutes: Number(eta) } : {}); }} className="min-h-11 rounded-lg border border-hydro-400/50 px-4 text-sm font-semibold text-hydro-300 hover:bg-hydro-400/10 disabled:opacity-50">{visit.en_route_at ? "En route sent" : busy === "en-route" ? "Sending…" : "Mark en route"}</button>
            <button onClick={() => setRescheduleOpen((value) => !value)} className="min-h-11 rounded-lg border border-signal-400/50 px-4 text-sm font-semibold text-signal-400 hover:bg-signal-400/10">Edit / reschedule</button>
            {quote ? <Link href={`/admin/quotes/${quote.id}`} className="min-h-11 rounded-lg border border-green-500/40 px-4 py-3 text-sm font-semibold text-green-300">Open {quote.quote_number}</Link> : <button disabled={Boolean(busy) || !eligibility.allowed} title={eligibility.reason} onClick={() => void action("quote", `/api/admin/site-visits/${visit.id}/quote`)} className="min-h-11 rounded-lg bg-hydro-400 px-4 text-sm font-bold text-ink-950 disabled:cursor-not-allowed disabled:opacity-40">{busy === "quote" ? "Creating…" : eligibility.conditional ? "Create conditional draft quote" : "Create draft quote"}</button>}
          </div>
          {!eligibility.allowed && !quote && <p className="mt-3 text-xs text-fog-400">{eligibility.reason}</p>}
          {rescheduleOpen && <div className="mt-4 flex flex-col gap-3 rounded-xl border border-signal-400/20 bg-signal-400/5 p-4 sm:flex-row sm:items-end"><label className="flex-1 text-xs text-fog-300">New exact date and time<input type="datetime-local" value={newTime} onChange={(event) => setNewTime(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-ink-800 px-3 text-sm text-fog-50" /></label><button disabled={busy === "reschedule"} onClick={() => void reschedule()} className="btn-primary min-h-11">{busy === "reschedule" ? "Updating…" : "Update and send confirmation"}</button></div>}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-ink-900 p-5"><h2 className="font-semibold text-fog-50">Customer preparation</h2>{Object.keys(visit.previsit_answers || {}).length ? <dl className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(visit.previsit_answers).map(([key, value]) => <div key={key} className="rounded-lg bg-ink-800 p-3"><dt className="text-[11px] uppercase tracking-wide text-fog-400">{humanize(key)}</dt><dd className="mt-1 text-sm text-fog-100">{String(value || "—")}</dd></div>)}</dl> : <p className="mt-4 text-sm text-fog-400">The pre-visit form has not been completed.</p>}{visit.internal_notes && <div className="mt-5 border-t border-white/10 pt-4"><div className="text-xs font-bold uppercase tracking-wide text-fog-400">Internal note</div><p className="mt-2 whitespace-pre-wrap text-sm text-fog-200">{visit.internal_notes}</p></div>}</section>
          <section className="rounded-2xl border border-white/10 bg-ink-900 p-5"><h2 className="font-semibold text-fog-50">Readiness and closeout</h2><div className="mt-4 rounded-xl border border-white/10 bg-ink-800 p-4"><div className="text-xs uppercase tracking-wide text-fog-400">Status</div><div className="mt-1 text-lg font-semibold text-fog-50">{visit.readiness_status.replaceAll("_", " ")}</div></div>{visit.blockers.length > 0 ? <ul className="mt-4 space-y-3">{visit.blockers.map((blocker) => <li key={blocker.code} className="rounded-lg border border-signal-400/20 bg-signal-400/5 p-3"><div className="text-sm font-semibold text-signal-400">{blocker.title}</div><p className="mt-1 text-xs leading-relaxed text-fog-300">{blocker.detail}</p><span className="mt-2 inline-block text-[10px] uppercase tracking-wide text-fog-400">Owner: {blocker.owner}</span></li>)}</ul> : <p className="mt-4 text-sm text-fog-400">No blockers recorded.</p>}</section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Timeline title="Communication history" empty="No communication attempts recorded.">{messages.map((message) => <li key={message.id} className="border-l border-white/15 pb-5 pl-4 last:pb-0"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-fog-100">{message.template.replaceAll("-", " ")} · {message.channel}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${message.status === "sent" ? "bg-green-500/15 text-green-300" : message.status === "failed" ? "bg-alert-500/15 text-red-300" : "bg-fog-400/15 text-fog-300"}`}>{message.status}</span></div><p className="mt-1 text-xs text-fog-400">{formatStamp(message.created_at)} · attempt {message.attempt_count}</p>{message.last_error && <p className="mt-2 text-xs text-red-300">{message.last_error}</p>}</li>)}</Timeline>
          <Timeline title="Audit timeline" empty="No events recorded.">{events.map((event) => <li key={event.id} className="border-l border-white/15 pb-5 pl-4 last:pb-0"><div className="text-sm font-semibold text-fog-100">{event.event_type.replaceAll("_", " ")}</div><p className="mt-1 text-xs text-fog-400">{formatStamp(event.created_at)} · {event.actor_type}{event.actor_label ? ` · ${event.actor_label}` : ""}</p></li>)}</Timeline>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value, sub }: { label: string; value: string; sub: string }) { return <div className="rounded-xl border border-white/10 bg-ink-900 p-4"><div className="text-[11px] font-bold uppercase tracking-wide text-fog-400">{label}</div><div className="mt-2 text-sm font-semibold text-fog-50">{value}</div><div className="mt-1 text-xs text-fog-400">{sub}</div></div>; }
function Timeline({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) { return <section className="rounded-2xl border border-white/10 bg-ink-900 p-5"><h2 className="font-semibold text-fog-50">{title}</h2>{children.length ? <ul className="mt-5">{children}</ul> : <p className="mt-4 text-sm text-fog-400">{empty}</p>}</section>; }
function formatStamp(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }
function humanize(value: string) { return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " "); }
