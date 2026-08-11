"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminNav } from "@/components/site-visits/AdminNav";

interface LeadOption {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  zip: string;
}

const inputClass = "min-h-11 w-full rounded-lg border border-white/15 bg-ink-800 px-3 py-2.5 text-sm text-fog-50 outline-none placeholder:text-fog-400 focus:border-hydro-400 focus:ring-2 focus:ring-hydro-400/20";

export default function NewSiteVisitForm() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState<LeadOption[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null);
  const [form, setForm] = useState({
    customerFirstName: "", customerLastName: "", customerPhone: "", customerEmail: "",
    propertyAddress: "", propertyCity: "", propertyZip: "", scheduledStart: "",
    arrivalWindowMinutes: 30, estimatedDurationMinutes: 60, assignedRepName: "",
    assignedRepPhone: "", internalNotes: "",
  });

  const searchLeads = useCallback(async (query: string) => {
    if (query.trim().length < 2) return setLeadResults([]);
    const response = await fetch(`/api/admin/leads/search?q=${encodeURIComponent(query)}`);
    const body = await response.json();
    setLeadResults(body.leads || []);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void searchLeads(leadSearch), 250);
    return () => window.clearTimeout(timer);
  }, [leadSearch, searchLeads]);

  function chooseLead(lead: LeadOption) {
    setSelectedLead(lead);
    setLeadSearch(`${lead.first_name} ${lead.last_name}`);
    setLeadResults([]);
    setForm((current) => ({
      ...current,
      customerFirstName: lead.first_name,
      customerLastName: lead.last_name,
      customerPhone: lead.phone || "",
      customerEmail: lead.email,
      propertyAddress: lead.address || "",
      propertyZip: lead.zip,
    }));
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(sendConfirmation: boolean) {
    setSaving(true);
    setMessage("");
    try {
      const scheduled = new Date(form.scheduledStart);
      if (Number.isNaN(scheduled.getTime())) throw new Error("Choose a valid appointment date and time");
      const response = await fetch("/api/admin/site-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead?.id || null,
          ...form,
          scheduledStart: scheduled.toISOString(),
          timezone: "America/Chicago",
          sendConfirmation,
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error || "Unable to schedule site visit");
      const failed = body.deliveries?.length > 0 && body.deliveries.every((item: { status: string }) => item.status !== "sent");
      window.location.href = `/admin/site-visits/${body.visit.id}${failed ? "?delivery=failed" : ""}`;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to schedule site visit");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink-950 text-fog-100">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminNav current="site-visits" />
        <div className="mt-6 flex items-center gap-2 text-xs text-fog-400"><Link href="/admin/site-visits" className="hover:text-hydro-300">Site visits</Link><span>/</span><span>New appointment</span></div>
        <h1 className="mt-3 font-display text-3xl text-fog-50">Schedule a site visit</h1>
        <p className="mt-2 text-sm text-fog-300">Start with what HydroSense already knows. Confirmation, preparation, reminders, and assessment will remain connected to this record.</p>

        <div className="mt-7 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-hydro-300">Customer and property</h2>
            <div className="relative mt-4"><label className="text-xs text-fog-300">Find an existing lead</label><input value={leadSearch} onChange={(event) => { setLeadSearch(event.target.value); setSelectedLead(null); }} placeholder="Name, email, or phone" className={`${inputClass} mt-1`} />{leadResults.length > 0 && <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-white/15 bg-ink-800 shadow-2xl">{leadResults.map((lead) => <button type="button" key={lead.id} onClick={() => chooseLead(lead)} className="block min-h-12 w-full border-b border-white/10 px-4 py-3 text-left hover:bg-ink-700"><span className="block text-sm text-fog-50">{lead.first_name} {lead.last_name}</span><span className="block text-xs text-fog-400">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</span></button>)}</div>}</div>
            {selectedLead && <p className="mt-2 text-xs text-green-300">Linked to existing lead. Booking status and portal link will update automatically.</p>}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First name" required><input value={form.customerFirstName} onChange={(e) => set("customerFirstName", e.target.value)} className={inputClass} /></Field>
              <Field label="Last name" required><input value={form.customerLastName} onChange={(e) => set("customerLastName", e.target.value)} className={inputClass} /></Field>
              <Field label="Mobile number"><input type="tel" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className={inputClass} /></Field>
              <Field label="Email"><input type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} className={inputClass} /></Field>
              <div className="sm:col-span-2"><Field label="Property address" required><input value={form.propertyAddress} onChange={(e) => set("propertyAddress", e.target.value)} className={inputClass} /></Field></div>
              <Field label="City"><input value={form.propertyCity} onChange={(e) => set("propertyCity", e.target.value)} className={inputClass} /></Field>
              <Field label="ZIP"><input inputMode="numeric" value={form.propertyZip} onChange={(e) => set("propertyZip", e.target.value)} className={inputClass} /></Field>
            </div>
            <p className="mt-3 text-xs text-fog-400">At least one contact method is required.</p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-hydro-300">Appointment</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Exact date and time" required><input type="datetime-local" value={form.scheduledStart} onChange={(e) => set("scheduledStart", e.target.value)} className={inputClass} /></Field>
              <Field label="Assigned representative" required><input value={form.assignedRepName} onChange={(e) => set("assignedRepName", e.target.value)} className={inputClass} /></Field>
              <Field label="Arrival window"><select value={form.arrivalWindowMinutes} onChange={(e) => set("arrivalWindowMinutes", Number(e.target.value))} className={inputClass}>{[15, 30, 45, 60].map((value) => <option key={value} value={value}>{value} minutes</option>)}</select></Field>
              <Field label="Expected assessment duration"><select value={form.estimatedDurationMinutes} onChange={(e) => set("estimatedDurationMinutes", Number(e.target.value))} className={inputClass}>{[30, 45, 60, 90, 120].map((value) => <option key={value} value={value}>{value} minutes</option>)}</select></Field>
              <Field label="Representative phone"><input type="tel" value={form.assignedRepPhone} onChange={(e) => set("assignedRepPhone", e.target.value)} className={inputClass} /></Field>
              <div className="sm:col-span-2"><Field label="Internal note"><textarea value={form.internalNotes} onChange={(e) => set("internalNotes", e.target.value)} rows={3} className={inputClass} /></Field></div>
            </div>
            <p className="mt-3 text-xs text-fog-400">Times display in America/Chicago and are stored in UTC.</p>
          </section>

          {message && <div role="alert" className="rounded-xl border border-alert-500/30 bg-alert-500/10 px-4 py-3 text-sm text-red-200">{message}</div>}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button disabled={saving} type="button" onClick={() => void submit(false)} className="min-h-11 rounded-lg border border-white/20 px-5 text-sm font-semibold text-fog-100 hover:bg-white/5 disabled:opacity-50">Save draft</button>
            <button disabled={saving} type="button" onClick={() => void submit(true)} className="btn-primary min-h-11 disabled:opacity-50">{saving ? "Scheduling…" : "Schedule and send confirmation"}</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-fog-300">{label}{required ? " *" : ""}</span>{children}</label>;
}
