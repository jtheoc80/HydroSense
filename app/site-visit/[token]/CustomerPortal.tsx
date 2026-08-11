"use client";

import Image from "next/image";
import { useState } from "react";
import type { CustomerSummary, PrevisitAnswers, ReadinessBlocker } from "@/lib/site-visits/types";

interface PortalVisit {
  id: string;
  customerFirstName: string;
  propertyAddress: string;
  propertyCity: string | null;
  propertyZip: string | null;
  scheduledStart: string;
  arrivalWindowMinutes: number;
  estimatedDurationMinutes: number;
  timezone: string;
  assignedRepName: string;
  assignedRepPhone: string | null;
  appointmentStatus: string;
  previsitStatus: string;
  readinessStatus: string;
  confirmedAt: string | null;
  previsitAnswers: Partial<PrevisitAnswers>;
  customerSummary: CustomerSummary | null;
  completedAt: string | null;
  canceledAt: string | null;
  recheckRequestedAt: string | null;
  assessmentVersion: number;
  priorResults: Array<{
    assessmentVersion: number;
    readinessStatus: string;
    completedAt: string | null;
    blockers: ReadinessBlocker[];
  }>;
  quoteUrl: string | null;
}

interface RescheduleFormValue {
  option1: string;
  option2: string;
  option3: string;
  note: string;
}

const fieldClass = "min-h-12 w-full rounded-xl border border-white/15 bg-ink-800 px-3 py-3 text-base text-fog-50 outline-none focus:border-hydro-400 focus:ring-2 focus:ring-hydro-400/20";
const ynu = [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Unsure" }];

export default function CustomerPortal({ token, initialVisit }: { token: string; initialVisit: PortalVisit }) {
  const phone = process.env.NEXT_PUBLIC_HYDROSENSE_PHONE || "(281) 694-5754";
  const phoneHref = `tel:+1${phone.replace(/\D/g, "").replace(/^1/, "")}`;
  const [visit, setVisit] = useState(initialVisit);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [rescheduleOpen, setRescheduleOpen] = useState(visit.appointmentStatus === "reschedule_requested");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reschedule, setReschedule] = useState({ option1: "", option2: "", option3: "", note: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [answers, setAnswers] = useState({
    bathroomCount: Number(visit.previsitAnswers.bathroomCount || 1),
    shutoffLocationKnown: visit.previsitAnswers.shutoffLocationKnown || "unsure",
    shutoffLocationNotes: visit.previsitAnswers.shutoffLocationNotes || "",
    activeLeak: visit.previsitAnswers.activeLeak || "unsure",
    previousLeak: visit.previsitAnswers.previousLeak || "no",
    previousLeakRepaired: visit.previsitAnswers.previousLeakRepaired || "unsure",
    previousLeakRemediationNotes: visit.previsitAnswers.previousLeakRemediationNotes || "",
    wifiAtInstallLocation: visit.previsitAnswers.wifiAtInstallLocation || "unsure",
    powerWithin12Feet: visit.previsitAnswers.powerWithin12Feet || "unsure",
    fireSprinklerSystem: visit.previsitAnswers.fireSprinklerSystem || "unsure",
    accessInstructions: visit.previsitAnswers.accessInstructions || "",
    gateCode: visit.previsitAnswers.gateCode || "",
    pets: visit.previsitAnswers.pets || "",
    parkingNotes: visit.previsitAnswers.parkingNotes || "",
    additionalNotes: visit.previsitAnswers.additionalNotes || "",
  });

  const date = new Intl.DateTimeFormat("en-US", { timeZone: visit.timezone, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(visit.scheduledStart));
  const time = new Intl.DateTimeFormat("en-US", { timeZone: visit.timezone, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(visit.scheduledStart));
  const location = [visit.propertyAddress, visit.propertyCity, visit.propertyZip].filter(Boolean).join(", ");

  async function post(name: string, path: string, body: unknown = {}) {
    setBusy(name); setMessage("");
    try {
      const response = await fetch(`/api/site-visits/${token}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to update appointment");
      if (name === "confirm") setVisit((current) => ({ ...current, confirmedAt: new Date().toISOString(), appointmentStatus: "confirmed" }));
      else window.location.reload();
      setBusy("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update appointment"); setBusy(""); }
  }

  async function submitReschedule() {
    try {
      const payload = {
        option1: reschedule.option1, option2: reschedule.option2,
        ...(reschedule.option3 ? { option3: reschedule.option3 } : {}),
        note: reschedule.note,
      };
      await post("reschedule", "reschedule", payload);
    } catch { setMessage("Choose at least two valid date and time options."); }
  }

  if (visit.canceledAt || visit.appointmentStatus === "canceled") {
    return <PortalShell><StateCard eyebrow="Appointment canceled" title="We recorded your cancellation"><p>Your appointment for {date} at {time} is canceled. If circumstances change, call HydroSense and we will help find another time.</p><a href={phoneHref} className="btn-primary mt-5 min-h-12">Call {phone}</a></StateCard></PortalShell>;
  }
  if (visit.completedAt && visit.customerSummary) {
    return <PortalShell><CompletedView visit={visit} token={token} busy={busy} message={message} onRecheck={() => void post("recheck", "recheck")} /></PortalShell>;
  }

  return (
    <PortalShell>
      <section className="rounded-3xl border border-white/10 bg-ink-900 p-5 shadow-2xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-hydro-300">Home water assessment</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-fog-50">Your visit, {visit.customerFirstName}</h1>
        <p className="mt-3 text-sm leading-relaxed text-fog-300">Confirm your appointment, prepare the areas we will review, and return here for your result and next steps.</p>
        <div className="mt-6 rounded-2xl border border-hydro-400/20 bg-ink-800 p-5"><div className="text-lg font-semibold text-fog-50">{date}</div><div className="mt-1 font-mono text-hydro-300">{time}</div><div className="mt-3 text-sm text-fog-200">{location}</div><div className="mt-3 grid grid-cols-2 gap-3 text-xs text-fog-400"><div><span className="block uppercase tracking-wide">Arrival window</span><span className="mt-1 block text-fog-200">{visit.arrivalWindowMinutes} minutes</span></div><div><span className="block uppercase tracking-wide">Expected duration</span><span className="mt-1 block text-fog-200">About {visit.estimatedDurationMinutes} minutes</span></div><div className="col-span-2"><span className="block uppercase tracking-wide">Representative</span><span className="mt-1 block text-fog-200">{visit.assignedRepName}</span></div></div></div>

        {!visit.confirmedAt ? <button disabled={busy === "confirm"} onClick={() => void post("confirm", "confirm")} className="mt-5 min-h-14 w-full rounded-xl bg-hydro-400 px-5 text-base font-bold text-ink-950 shadow-lg shadow-hydro-400/10 disabled:opacity-50">{busy === "confirm" ? "Confirming…" : "Confirm appointment"}</button> : <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">Appointment confirmed</div>}
        <a href={`/site-visit/${token}/calendar`} className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-hydro-400/50 px-4 text-sm font-semibold text-hydro-300">Add to calendar</a>
        <button onClick={() => { setRescheduleOpen((value) => !value); setCancelOpen(false); }} className="mt-3 min-h-12 w-full rounded-xl border border-signal-400/50 px-4 text-sm font-semibold text-signal-400">Need a different time?</button>
        {visit.appointmentStatus === "reschedule_requested" && <div className="mt-4 rounded-xl border border-signal-400/30 bg-signal-400/10 p-4 text-sm text-signal-400">Your request is with HydroSense. The original appointment remains pending until we confirm a new time.</div>}
        {rescheduleOpen && <ReschedulePanel value={reschedule} onChange={setReschedule} busy={busy === "reschedule"} onSubmit={() => void submitReschedule()} />}

        <div className="mt-7 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold text-fog-50">Please make these areas accessible</h2><ul className="mt-3 grid gap-2 text-sm text-fog-300 sm:grid-cols-2">{["Exterior water entry, meter, and shutoff", "Kitchen", "Every bathroom", "Laundry or utility area", "Other water-connected areas"].map((item) => <li key={item} className="rounded-lg bg-ink-800 px-3 py-2">{item}</li>)}</ul><p className="mt-4 text-xs leading-relaxed text-fog-400">The assessment is normally visual and non-destructive. Active or unresolved leakage must be remedied before a monitoring device can be installed, but it does not prevent us from documenting conditions during the visit.</p></div>
      </section>

      {visit.confirmedAt && visit.previsitStatus !== "complete" && <PrevisitForm answers={answers} setAnswers={setAnswers} busy={busy === "previsit"} onSubmit={() => void post("previsit", "previsit", answers)} />}
      {visit.previsitStatus === "complete" && <StateCard eyebrow="Preparation complete" title="Thank you—we have what we need"><p>Your answers are connected to this appointment. The representative will verify Wi-Fi, nearby power, and field conditions during the visit.</p></StateCard>}
      {message && <div role="alert" className="rounded-xl border border-alert-500/30 bg-alert-500/10 p-4 text-sm text-red-200">{message}</div>}

      <section className="rounded-2xl border border-white/10 bg-ink-900 p-5"><h2 className="text-sm font-semibold text-fog-100">Need help?</h2><p className="mt-2 text-sm text-fog-300">Call <a href={phoneHref} className="font-semibold text-hydro-300">{phone}</a>. Rescheduling is usually the fastest way to preserve your assessment.</p><button onClick={() => { setCancelOpen((value) => !value); setRescheduleOpen(false); }} className="mt-5 text-sm text-fog-400 underline underline-offset-4 hover:text-red-300">Cancel appointment</button>{cancelOpen && <div className="mt-4 rounded-xl border border-alert-500/20 bg-alert-500/5 p-4"><label className="text-xs font-medium text-fog-300">Cancellation reason<textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} rows={3} className={`${fieldClass} mt-1`} /></label><button disabled={busy === "cancel" || cancelReason.trim().length < 3} onClick={() => void post("cancel", "cancel", { reason: cancelReason })} className="mt-3 min-h-12 rounded-xl bg-alert-500 px-4 text-sm font-bold text-white disabled:opacity-40">Confirm cancellation</button></div>}</section>
    </PortalShell>
  );
}

function PortalShell({ children }: { children: React.ReactNode }) { return <main className="min-h-screen bg-ink-950 px-4 py-5 text-fog-100 sm:py-10"><div className="mx-auto max-w-2xl"><header className="mb-6 flex items-center gap-3"><Image src="/icon.png" alt="HydroSense" width={42} height={42} className="rounded-xl" priority /><div><div className="font-display text-xl text-fog-50">HydroSense Texas</div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-hydro-300">Home water defense</div></div></header><div className="space-y-5">{children}</div><footer className="py-8 text-center text-xs text-fog-400">Secure HydroSense appointment portal · This page is not indexed</footer></div></main>; }
function StateCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <section className="rounded-3xl border border-white/10 bg-ink-900 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-hydro-300">{eyebrow}</p><h1 className="mt-3 font-display text-3xl text-fog-50">{title}</h1><div className="mt-4 text-sm leading-relaxed text-fog-300">{children}</div></section>; }

function ReschedulePanel({ value, onChange, busy, onSubmit }: { value: RescheduleFormValue; onChange: (value: RescheduleFormValue) => void; busy: boolean; onSubmit: () => void }) { return <div className="mt-4 rounded-xl border border-signal-400/25 bg-signal-400/5 p-4"><h3 className="font-semibold text-fog-50">Request another time</h3><p className="mt-1 text-xs leading-relaxed text-fog-400">Share at least two options. Your original time remains pending until HydroSense confirms the change.</p><div className="mt-4 space-y-3">{(["option1", "option2", "option3"] as const).map((key, index) => <label key={key} className="block text-xs text-fog-300">Preferred option {index + 1}{index === 2 ? " (optional)" : ""}<input type="datetime-local" value={value[key]} onChange={(event) => onChange({ ...value, [key]: event.target.value })} className={`${fieldClass} mt-1`} /></label>)}<label className="block text-xs text-fog-300">Reason or note<textarea value={value.note} onChange={(event) => onChange({ ...value, note: event.target.value })} rows={2} className={`${fieldClass} mt-1`} /></label></div><button disabled={busy || !value.option1 || !value.option2} onClick={onSubmit} className="mt-4 min-h-12 w-full rounded-xl bg-signal-400 px-4 text-sm font-bold text-ink-950 disabled:opacity-40">{busy ? "Sending request…" : "Send reschedule request"}</button></div>; }

function PrevisitForm({ answers, setAnswers, busy, onSubmit }: { answers: Record<string, string | number>; setAnswers: React.Dispatch<React.SetStateAction<any>>; busy: boolean; onSubmit: () => void }) { const set = (key: string, value: string | number) => setAnswers((current: typeof answers) => ({ ...current, [key]: value })); return <section className="rounded-3xl border border-hydro-400/20 bg-ink-900 p-5 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-hydro-300">About two minutes</p><h2 className="mt-2 font-display text-3xl text-fog-50">Help us prepare</h2><p className="mt-2 text-sm text-fog-300">These answers guide the visit. The representative will verify field conditions separately.</p><div className="mt-6 space-y-6"><label className="block text-sm font-semibold text-fog-100">Number of bathrooms<input type="number" min="0" max="30" value={answers.bathroomCount} onChange={(event) => set("bathroomCount", Number(event.target.value))} className={`${fieldClass} mt-2`} /></label><Question label="Do you know where the main water shutoff is?" value={String(answers.shutoffLocationKnown)} onChange={(value) => set("shutoffLocationKnown", value)} /><Question label="Is there an active leak now?" value={String(answers.activeLeak)} onChange={(value) => set("activeLeak", value)} />{answers.activeLeak === "yes" && <Callout>We can still document conditions during the visit, but installation cannot proceed until the active leak is repaired and reassessed.</Callout>}<Question label="Has the home had a previous leak?" value={String(answers.previousLeak)} onChange={(value) => set("previousLeak", value)} />{answers.previousLeak === "yes" && <><Question label="Was the source repaired and the affected area remediated?" value={String(answers.previousLeakRepaired)} onChange={(value) => set("previousLeakRepaired", value)} />{answers.previousLeakRepaired !== "yes" && <Callout>Installation will remain blocked until repair and remediation are confirmed and the condition is reassessed.</Callout>}<SmallText label="Previous leak and remediation notes" value={String(answers.previousLeakRemediationNotes)} onChange={(value) => set("previousLeakRemediationNotes", value)} /></>}<Question label="Is there Wi-Fi coverage near the expected monitoring location?" value={String(answers.wifiAtInstallLocation)} onChange={(value) => set("wifiAtInstallLocation", value)} /><p className="-mt-4 text-xs leading-relaxed text-fog-400">Do not submit a Wi-Fi password. Credentials are handled only during authorized device setup.</p><Question label="Is a standard outlet available within about 12 feet?" value={String(answers.powerWithin12Feet)} onChange={(value) => set("powerWithin12Feet", value)} /><Question label="Does the home have a fire-sprinkler system?" value={String(answers.fireSprinklerSystem)} onChange={(value) => set("fireSprinklerSystem", value)} /><div className="grid gap-4 sm:grid-cols-2"><SmallText label="Gate / access instructions" value={String(answers.accessInstructions)} onChange={(value) => set("accessInstructions", value)} /><SmallText label="Gate code (if needed)" value={String(answers.gateCode)} onChange={(value) => set("gateCode", value)} /><SmallText label="Pets" value={String(answers.pets)} onChange={(value) => set("pets", value)} /><SmallText label="Parking notes" value={String(answers.parkingNotes)} onChange={(value) => set("parkingNotes", value)} /></div><SmallText label="Anything else we should know?" value={String(answers.additionalNotes)} onChange={(value) => set("additionalNotes", value)} rows={3} /></div><button disabled={busy} onClick={onSubmit} className="mt-7 min-h-14 w-full rounded-xl bg-hydro-400 px-5 text-base font-bold text-ink-950 disabled:opacity-50">{busy ? "Submitting…" : "Complete preparation"}</button></section>; }
function Question({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <fieldset><legend className="text-sm font-semibold text-fog-100">{label}</legend><div className="mt-2 grid grid-cols-3 gap-2">{ynu.map((option) => <button type="button" key={option.value} onClick={() => onChange(option.value)} className={`min-h-12 rounded-xl border text-sm font-semibold ${value === option.value ? "border-hydro-400 bg-hydro-400 text-ink-950" : "border-white/15 bg-ink-800 text-fog-200"}`}>{option.label}</button>)}</div></fieldset>; }
function SmallText({ label, value, onChange, rows = 2 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) { return <label className="block text-sm font-semibold text-fog-100">{label}<textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} mt-2`} /></label>; }
function Callout({ children }: { children: React.ReactNode }) { return <div className="rounded-xl border border-signal-400/30 bg-signal-400/10 p-4 text-sm leading-relaxed text-signal-400">{children}</div>; }

function CompletedView({ visit, busy, message, onRecheck }: { visit: PortalVisit; token: string; busy: string; message: string; onRecheck: () => void }) { const summary = visit.customerSummary!; const blocked = visit.readinessStatus !== "ready_for_proposal"; return <><StateCard eyebrow="Assessment complete" title={summary.outcomeTitle}><p>{summary.outcomeDetail}</p><div className="mt-5 rounded-xl border border-white/10 bg-ink-800 p-4"><div className="text-xs font-bold uppercase tracking-wide text-fog-400">HydroSense next step</div><p className="mt-2">{summary.hydrosenseNextStep}</p><div className="mt-4 text-xs font-bold uppercase tracking-wide text-fog-400">Your next step</div><p className="mt-2">{summary.customerNextStep}</p></div></StateCard><section className="rounded-3xl border border-white/10 bg-ink-900 p-6"><h2 className="text-xl font-semibold text-fog-50">Areas reviewed</h2><ul className="mt-3 grid gap-2 text-sm text-fog-300">{summary.areasReviewed.map((area) => <li key={area} className="rounded-lg bg-ink-800 px-3 py-2">{area}</li>)}</ul></section>{visit.priorResults.length > 0 && <section className="rounded-3xl border border-white/10 bg-ink-900 p-6"><h2 className="text-xl font-semibold text-fog-50">Assessment history</h2><p className="mt-2 text-sm text-fog-400">The latest verified result is shown above. Earlier outcomes remain preserved below.</p><ul className="mt-4 space-y-2">{visit.priorResults.map((result) => <li key={result.assessmentVersion} className="rounded-xl bg-ink-800 p-4 text-sm text-fog-200">Assessment {result.assessmentVersion} · {result.readinessStatus.replaceAll("_", " ")}{result.completedAt ? <span className="mt-1 block text-xs text-fog-400">Completed {new Date(result.completedAt).toLocaleDateString("en-US", { timeZone: "America/Chicago" })}</span> : null}</li>)}</ul></section>}{summary.correctiveActions.length > 0 && <section className="rounded-3xl border border-signal-400/20 bg-ink-900 p-6"><h2 className="text-xl font-semibold text-fog-50">Required actions</h2><div className="mt-4 space-y-3">{summary.correctiveActions.map((action) => <div key={action.id} className="rounded-xl border border-white/10 bg-ink-800 p-4"><div className="font-semibold text-signal-400">{action.action}</div><p className="mt-2 text-sm leading-relaxed text-fog-300">{action.reason}</p><div className="mt-3 text-[10px] font-bold uppercase tracking-wide text-fog-400">Owner: {action.owner} · {action.severity}</div></div>)}</div></section>}{visit.quoteUrl && <a href={visit.quoteUrl} className="flex min-h-14 items-center justify-center rounded-xl bg-hydro-400 px-5 text-base font-bold text-ink-950">Review your HydroSense quote</a>}{blocked && <section className="rounded-3xl border border-white/10 bg-ink-900 p-6"><h2 className="text-xl font-semibold text-fog-50">Completed the required work?</h2><p className="mt-2 text-sm leading-relaxed text-fog-300">Tell HydroSense when the listed work is complete. This requests a recheck; it does not automatically change the home to ready.</p>{visit.recheckRequestedAt ? <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-semibold text-green-200">Recheck requested. HydroSense will follow up.</div> : <button disabled={busy === "recheck"} onClick={onRecheck} className="mt-5 min-h-12 w-full rounded-xl bg-hydro-400 px-4 text-sm font-bold text-ink-950 disabled:opacity-50">{busy === "recheck" ? "Sending…" : "I completed the required work"}</button>}</section>}{message && <div role="alert" className="rounded-xl border border-alert-500/30 bg-alert-500/10 p-4 text-sm text-red-200">{message}</div>}</>; }
