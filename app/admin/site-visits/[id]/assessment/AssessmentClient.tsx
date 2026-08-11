"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { emptyFixture } from "@/lib/site-visits/assessment-defaults";
import { evaluateReadiness } from "@/lib/site-visits/readiness";
import type { FixtureCheck, InspectionResult, SiteAssessment, SiteVisit, YesNoUnsure } from "@/lib/site-visits/types";

const steps = ["Arrival", "Exterior", "Kitchen", "Bathrooms", "Laundry / utility", "Other areas", "Connectivity", "Review"];
const selectClass = "min-h-11 w-full rounded-lg border border-white/15 bg-ink-800 px-3 py-2 text-sm text-fog-50 outline-none focus:border-hydro-400";
const inputClass = selectClass;

export default function AssessmentClient({ visit, initialAssessment }: { visit: SiteVisit; initialAssessment: SiteAssessment }) {
  const [assessment, setAssessment] = useState(initialAssessment);
  const [step, setStep] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "offline" | "error">("idle");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [syncNonce, setSyncNonce] = useState(0);
  const initialized = useRef(false);
  const revisionRef = useRef(visit.assessment_revision);
  const latestAssessmentRef = useRef(initialAssessment);
  const saveChain = useRef<Promise<void>>(Promise.resolve());
  const localKey = `hydrosense:site-visit-assessment:${visit.id}`;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(localKey);
      if (stored) {
        const parsed = JSON.parse(stored) as { savedAt: string; revision: number; assessment: SiteAssessment };
        if (new Date(parsed.savedAt).getTime() > new Date(visit.updated_at).getTime()) {
          const divergent = parsed.revision !== visit.assessment_revision;
          const useLocal = !divergent || window.confirm(
            "This device has a newer local draft from a different server revision. Select OK to reconcile with the local draft, or Cancel to keep the server draft."
          );
          if (useLocal) {
            setAssessment(parsed.assessment);
            latestAssessmentRef.current = parsed.assessment;
            setMessage(divergent ? "Local draft selected. It will reconcile against the latest server revision." : "Recovered a newer local field draft. It will sync automatically.");
          }
        }
      }
    } catch { /* Ignore an unreadable local draft. */ }
    initialized.current = true;
    setReady(true);
  }, [localKey, visit.updated_at, visit.assessment_revision]);

  useEffect(() => {
    latestAssessmentRef.current = assessment;
  }, [assessment]);

  useEffect(() => {
    const online = () => { setSaveState("saving"); setSyncNonce((value) => value + 1); };
    const offline = () => setSaveState("offline");
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); };
  }, []);

  useEffect(() => {
    if (!ready || !initialized.current) return;
    window.localStorage.setItem(localKey, JSON.stringify({ savedAt: new Date().toISOString(), revision: revisionRef.current, assessment }));
    if (!navigator.onLine) { setSaveState("offline"); return; }
    setSaveState("saving");
    const timer = window.setTimeout(() => { void saveDraft().catch(() => undefined); }, 850);
    return () => window.clearTimeout(timer);
    // syncNonce intentionally retries the latest draft after reconnecting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, ready, syncNonce]);

  function saveDraft(): Promise<void> {
    const draft = structuredClone(latestAssessmentRef.current);
    const task = saveChain.current.catch(() => undefined).then(async () => {
      setSaveState("saving");
      try {
      const response = await fetch(`/api/admin/site-visits/${visit.id}/assessment`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessment: draft, revision: revisionRef.current, actorLabel: visit.assigned_rep_name }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        if (response.status === 409) setMessage("This assessment changed in another session. Reload and explicitly reconcile the server and local drafts.");
        throw new Error(body.error || "Save failed");
      }
      revisionRef.current = body.visit.assessment_revision;
      window.localStorage.setItem(localKey, JSON.stringify({
        savedAt: new Date().toISOString(), revision: revisionRef.current, assessment: draft,
      }));
      setSaveState("saved");
    } catch (error) {
      setSaveState(navigator.onLine ? "error" : "offline");
      setMessage(error instanceof Error ? error.message : "Save failed. The local draft is retained.");
      throw error;
      }
    });
    saveChain.current = task;
    return task;
  }

  async function complete() {
    setMessage(""); setSaveState("saving");
    try {
      await saveDraft();
      const latestAssessment = latestAssessmentRef.current;
      const response = await fetch(`/api/admin/site-visits/${visit.id}/complete`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assessment: latestAssessment, revision: revisionRef.current }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        const missing = body.details?.missingRequiredFields as string[] | undefined;
        throw new Error(missing?.length ? `Complete these fields: ${missing.join(", ")}` : body.error || "Unable to complete visit");
      }
      window.localStorage.removeItem(localKey);
      window.location.href = `/admin/site-visits/${visit.id}`;
    } catch (error) { setSaveState("error"); setMessage(error instanceof Error ? error.message : "Unable to complete visit"); }
  }

  function update<K extends keyof SiteAssessment>(key: K, value: SiteAssessment[K]) {
    setAssessment((current) => ({ ...current, [key]: value }));
  }
  const readiness = useMemo(() => evaluateReadiness(assessment, visit.previsit_answers), [assessment, visit.previsit_answers]);

  return (
    <main className="min-h-screen bg-ink-950 text-fog-100">
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-4"><div><Link href={`/admin/site-visits/${visit.id}`} className="text-xs text-hydro-300 hover:text-hydro-200">Back to appointment</Link><p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-hydro-300">Mobile field assessment</p><h1 className="mt-1 font-display text-3xl text-fog-50">{visit.customer_first_name} {visit.customer_last_name}</h1><p className="mt-1 text-sm text-fog-300">{visit.property_address}</p></div><SaveBadge state={saveState} /></header>

        <nav className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8" aria-label="Assessment progress">{steps.map((label, index) => <button type="button" key={label} onClick={() => setStep(index)} className={`min-h-12 rounded-lg border px-2 py-2 text-center text-[10px] font-semibold ${step === index ? "border-hydro-400 bg-hydro-400 text-ink-950" : index < step ? "border-hydro-400/30 bg-hydro-400/10 text-hydro-300" : "border-white/10 bg-ink-900 text-fog-400"}`}><span className="block font-mono">{index + 1}</span><span className="hidden sm:block">{label}</span></button>)}</nav>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-800"><div className="h-full bg-hydro-400 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        {message && <div role="status" className="mt-5 rounded-xl border border-signal-400/30 bg-signal-400/10 px-4 py-3 text-sm text-signal-400">{message}</div>}

        <section className="mt-6 rounded-2xl border border-white/10 bg-ink-900 p-5 sm:p-7">
          <div className="mb-6"><div className="text-xs font-bold uppercase tracking-[0.14em] text-hydro-300">Step {step + 1} of {steps.length}</div><h2 className="mt-2 text-2xl font-semibold text-fog-50">{steps[step]}</h2></div>
          {step === 0 && <ArrivalStep assessment={assessment} setAssessment={setAssessment} visit={visit} />}
          {step === 1 && <ExteriorStep value={assessment.exterior} onChange={(value) => update("exterior", value)} />}
          {step === 2 && <FixtureSection title="Kitchen" value={assessment.kitchen} onChange={(value) => update("kitchen", value)} labels={{ sinkSupplyAndDrain: "Sink supplies and drain", dishwasher: "Dishwasher", refrigeratorIceMaker: "Refrigerator / ice maker", visibleMoisture: "Visible moisture or prior damage" }} />}
          {step === 3 && <BathroomsStep assessment={assessment} setAssessment={setAssessment} />}
          {step === 4 && <FixtureSection title="Laundry and utility" value={assessment.laundryUtility} onChange={(value) => update("laundryUtility", value)} labels={{ washingMachine: "Washing-machine supplies and drain", waterHeater: "Water heater", utilitySink: "Utility sink", waterSoftenerOrFilter: "Water softener or filter", visibleMoisture: "Visible moisture or prior damage" }} />}
          {step === 5 && <OtherAreasStep assessment={assessment} setAssessment={setAssessment} />}
          {step === 6 && <ConnectivityStep assessment={assessment} setAssessment={setAssessment} visit={visit} />}
          {step === 7 && <ReviewStep assessment={assessment} setAssessment={setAssessment} visit={visit} readiness={readiness} />}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-4xl items-center justify-between gap-3"><button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="min-h-11 rounded-lg border border-white/20 px-4 text-sm font-semibold disabled:opacity-30">Previous</button><button onClick={() => void saveDraft().catch(() => undefined)} className="hidden min-h-11 rounded-lg border border-hydro-400/50 px-4 text-sm font-semibold text-hydro-300 sm:block">Save now</button>{step < steps.length - 1 ? <button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className="btn-primary min-h-11">Next section</button> : <button disabled={saveState === "saving"} onClick={() => void complete()} className="min-h-11 rounded-lg bg-green-400 px-5 text-sm font-bold text-ink-950 disabled:opacity-50">Complete visit</button>}</div></div>
    </main>
  );
}

function ArrivalStep({ assessment, setAssessment, visit }: { assessment: SiteAssessment; setAssessment: React.Dispatch<React.SetStateAction<SiteAssessment>>; visit: SiteVisit }) {
  return <div className="space-y-6"><div className="rounded-xl border border-hydro-400/20 bg-hydro-400/5 p-4 text-sm leading-relaxed text-fog-200">Introduce yourself as {visit.assigned_rep_name}. Explain that this is normally a visual, non-destructive installation-readiness assessment covering the exterior water path, kitchen, every bathroom, laundry/utility, other water-connected areas, Wi-Fi coverage, and nearby power.</div><Choice label="Permission to perform the visual assessment" value={assessment.permissionToInspect} options={[[true, "Permission granted"], [false, "Permission not granted"]]} onChange={(value) => setAssessment((current) => ({ ...current, permissionToInspect: value as boolean }))} /><Choice label="Homeowner present" value={assessment.homeownerPresent} options={[[true, "Present"], [false, "Not present"]]} onChange={(value) => setAssessment((current) => ({ ...current, homeownerPresent: value as boolean }))} /></div>;
}

function ExteriorStep({ value, onChange }: { value: SiteAssessment["exterior"]; onChange: (value: SiteAssessment["exterior"]) => void }) {
  const set = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) => onChange({ ...value, [key]: next });
  return <div className="space-y-5"><p className="text-sm leading-relaxed text-fog-300">Trace the service from meter and main shutoff to the proposed monitoring position. Record only what was observed.</p><InspectionField label="Meter accessibility" value={value.meterAccessible} notes={value.notes} onChange={(next) => set("meterAccessible", next)} /><InspectionField label="Main shutoff accessibility" value={value.mainShutoffAccessible} onChange={(next) => set("mainShutoffAccessible", next)} /><InspectionField label="Main valve condition" value={value.mainValveCondition} onChange={(next) => set("mainValveCondition", next)} /><TextField label="Water-entry route" value={value.waterEntryRoute || ""} onChange={(next) => set("waterEntryRoute", next)} /><div className="grid gap-4 sm:grid-cols-2"><TextField label="Pipe material" value={value.pipeMaterial || ""} onChange={(next) => set("pipeMaterial", next)} /><TextField label="Approximate pipe diameter" value={value.approximatePipeDiameter || ""} onChange={(next) => set("approximatePipeDiameter", next)} /></div><label className="block text-xs text-fog-300">Optional static pressure (PSI)<input type="number" min="0" max="300" value={value.staticPressurePsi ?? ""} onChange={(event) => set("staticPressurePsi", event.target.value ? Number(event.target.value) : undefined)} className={`${inputClass} mt-1`} /></label><YesNoField label="Unexplained meter movement with fixtures believed off" value={value.unexplainedMeterMovement} onChange={(next) => set("unexplainedMeterMovement", next)} /><InspectionField label="Visible exterior leakage" value={value.visibleExteriorLeak} onChange={(next) => set("visibleExteriorLeak", next)} /><YesNoField label="Unresolved fire-sprinkler branch concern" value={value.fireSprinklerBranchConcern} onChange={(next) => set("fireSprinklerBranchConcern", next)} /><YesNoField label="Verified installation requires approved sprinkler bypass" value={value.sprinklerBypassRequired} onChange={(next) => set("sprinklerBypassRequired", next)} /><YesNoField label="Irrigation or pool branch present" value={value.irrigationOrPoolBranchPresent} onChange={(next) => set("irrigationOrPoolBranchPresent", next)} /><YesNoField label="Proposed device location suitable" value={value.proposedInstallLocationSuitable} onChange={(next) => set("proposedInstallLocationSuitable", next)} /><TextField label="Proposed device location" value={value.proposedDeviceLocation || ""} onChange={(next) => set("proposedDeviceLocation", next)} /><YesNoField label="Service clearance adequate" value={value.serviceClearanceAdequate} onChange={(next) => set("serviceClearanceAdequate", next)} /><TextArea label="Weather / freeze exposure notes" value={value.weatherExposureNotes || ""} onChange={(next) => set("weatherExposureNotes", next)} /><TextArea label="Exterior notes" value={value.notes || ""} onChange={(next) => set("notes", next)} /></div>;
}

function FixtureSection<T extends Record<string, FixtureCheck>>({ title, value, onChange, labels }: { title: string; value: T; onChange: (value: T) => void; labels: Record<keyof T, string> }) {
  return <div className="space-y-4"><p className="text-sm text-fog-300">Mark every known fixture. Do not leave an uninspected item as clear.</p>{(Object.keys(labels) as Array<keyof T>).map((key) => <FixtureCard key={String(key)} label={labels[key]} value={value[key]} onChange={(next) => onChange({ ...value, [key]: next })} />)}</div>;
}

function BathroomsStep({ assessment, setAssessment }: { assessment: SiteAssessment; setAssessment: React.Dispatch<React.SetStateAction<SiteAssessment>> }) {
  function updateBathroom(index: number, patch: Partial<SiteAssessment["bathrooms"][number]>) { setAssessment((current) => ({ ...current, bathrooms: current.bathrooms.map((bathroom, i) => i === index ? { ...bathroom, ...patch } : bathroom) })); }
  return <div className="space-y-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-fog-300">Customer reported {assessment.bathrooms.length} bathroom{assessment.bathrooms.length === 1 ? "" : "s"}. Add, rename, or remove cards to match the home.</p><button type="button" onClick={() => setAssessment((current) => ({ ...current, homeHasNoBathrooms: false, noBathroomsReason: "", bathrooms: [...current.bathrooms, { id: crypto.randomUUID(), label: `Bathroom ${current.bathrooms.length + 1}`, toilet: emptyFixture(), sinkSupplyAndDrain: emptyFixture(), tubOrShower: emptyFixture(), visibleMoisture: emptyFixture() }] }))} className="min-h-11 shrink-0 rounded-lg border border-hydro-400/50 px-3 text-xs font-semibold text-hydro-300">Add bathroom</button></div>{assessment.bathrooms.map((bathroom, index) => <div key={bathroom.id} className="rounded-xl border border-white/10 bg-ink-800/60 p-4"><div className="flex items-center gap-3"><input aria-label={`Bathroom ${index + 1} name`} value={bathroom.label} onChange={(event) => updateBathroom(index, { label: event.target.value })} className={inputClass} /><button type="button" onClick={() => setAssessment((current) => ({ ...current, bathrooms: current.bathrooms.filter((_, i) => i !== index) }))} className="min-h-11 rounded-lg border border-alert-500/30 px-3 text-xs text-red-300">Remove</button></div><div className="mt-4 space-y-3">{([['toilet', 'Toilet'], ['sinkSupplyAndDrain', 'Sink supply and drain'], ['tubOrShower', 'Tub or shower'], ['visibleMoisture', 'Visible moisture']] as const).map(([key, label]) => <FixtureCard key={key} label={label} value={bathroom[key]} onChange={(next) => updateBathroom(index, { [key]: next })} />)}</div></div>)}{assessment.bathrooms.length === 0 && <div className="rounded-xl border border-signal-400/30 bg-signal-400/10 p-4 text-sm text-signal-400"><label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={assessment.homeHasNoBathrooms} onChange={(event) => setAssessment((current) => ({ ...current, homeHasNoBathrooms: event.target.checked }))} className="h-5 w-5 accent-sky-400" />Admin verified that this home has no bathrooms</label>{assessment.homeHasNoBathrooms && <TextArea label="Required verification reason" value={assessment.noBathroomsReason || ""} onChange={(noBathroomsReason) => setAssessment((current) => ({ ...current, noBathroomsReason }))} />}</div>}</div>;
}

function OtherAreasStep({ assessment, setAssessment }: { assessment: SiteAssessment; setAssessment: React.Dispatch<React.SetStateAction<SiteAssessment>> }) {
  return <div className="space-y-5"><p className="text-sm text-fog-300">Add wet bars, outdoor kitchens, pool equipment, irrigation tie-ins, or other water-connected appliances and spaces.</p><button type="button" onClick={() => setAssessment((current) => ({ ...current, otherWaterAreas: [...current.otherWaterAreas, { id: crypto.randomUUID(), label: "Other water-connected area", result: "not_tested", notes: "" }] }))} className="min-h-11 rounded-lg border border-hydro-400/50 px-4 text-sm font-semibold text-hydro-300">Add area</button>{assessment.otherWaterAreas.map((area, index) => <div key={area.id} className="rounded-xl border border-white/10 bg-ink-800/60 p-4"><div className="flex items-center gap-3"><input value={area.label} onChange={(event) => setAssessment((current) => ({ ...current, otherWaterAreas: current.otherWaterAreas.map((item, i) => i === index ? { ...item, label: event.target.value } : item) }))} className={inputClass} /><button type="button" onClick={() => setAssessment((current) => ({ ...current, otherWaterAreas: current.otherWaterAreas.filter((_, i) => i !== index) }))} className="min-h-11 rounded-lg border border-alert-500/30 px-3 text-xs text-red-300">Remove</button></div><select value={area.result} onChange={(event) => setAssessment((current) => ({ ...current, otherWaterAreas: current.otherWaterAreas.map((item, i) => i === index ? { ...item, result: event.target.value as InspectionResult } : item) }))} className={`${selectClass} mt-3`}>{inspectionOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><textarea value={area.notes || ""} onChange={(event) => setAssessment((current) => ({ ...current, otherWaterAreas: current.otherWaterAreas.map((item, i) => i === index ? { ...item, notes: event.target.value } : item) }))} placeholder="Observation notes" rows={2} className={`${inputClass} mt-3`} /></div>)}</div>;
}

function ConnectivityStep({ assessment, setAssessment, visit }: { assessment: SiteAssessment; setAssessment: React.Dispatch<React.SetStateAction<SiteAssessment>>; visit: SiteVisit }) {
  const value = assessment.connectivity;
  const set = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) => setAssessment((current) => ({ ...current, connectivity: { ...current.connectivity, [key]: next } }));
  return <div className="space-y-5"><div className="rounded-xl border border-white/10 bg-ink-800 p-4"><div className="text-xs font-bold uppercase tracking-wide text-fog-400">Customer-reported context</div><p className="mt-2 text-sm text-fog-200">Wi-Fi: {String(visit.previsit_answers?.wifiAtInstallLocation || "not provided")} · Power within 12 ft: {String(visit.previsit_answers?.powerWithin12Feet || "not provided")}</p><p className="mt-2 text-xs text-fog-400">Field verification remains separate. Never ask the customer to submit a Wi-Fi password; credentials are handled only during authorized device setup.</p></div><YesNoField label="Wi-Fi coverage verified at proposed location" value={value.wifiVerified} onChange={(next) => set("wifiVerified", next)} /><YesNoField label="Standard power verified nearby" value={value.powerVerified} onChange={(next) => set("powerVerified", next)} /><label className="block text-xs text-fog-300">Approximate outlet distance (feet)<input type="number" min="0" max="1000" value={value.outletDistanceFeet ?? ""} onChange={(event) => set("outletDistanceFeet", event.target.value ? Number(event.target.value) : undefined)} className={`${inputClass} mt-1`} /></label><TextArea label="Connectivity and location notes" value={value.notes || ""} onChange={(next) => set("notes", next)} /></div>;
}

function ReviewStep({ assessment, setAssessment, visit, readiness }: { assessment: SiteAssessment; setAssessment: React.Dispatch<React.SetStateAction<SiteAssessment>>; visit: SiteVisit; readiness: ReturnType<typeof evaluateReadiness> }) {
  return <div className="space-y-5"><div className={`rounded-xl border p-5 ${readiness.status === "ready_for_proposal" ? "border-green-500/30 bg-green-500/10" : readiness.status === "unassessed" ? "border-signal-400/30 bg-signal-400/10" : "border-alert-500/30 bg-alert-500/10"}`}><div className="text-xs font-bold uppercase tracking-wide text-fog-300">System recommendation</div><div className="mt-2 text-xl font-semibold text-fog-50">{readiness.status.replaceAll("_", " ")}</div><p className="mt-2 text-sm text-fog-300">This result is deterministic and will be recalculated on the server at completion.</p></div>{readiness.missingRequiredFields.length > 0 && <div><h3 className="text-sm font-semibold text-signal-400">Required observations still missing</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-fog-300">{readiness.missingRequiredFields.map((field) => <li key={field}>{field}</li>)}</ul></div>}{readiness.blockers.length > 0 && <div><h3 className="text-sm font-semibold text-fog-50">Documented blockers</h3><div className="mt-3 space-y-3">{readiness.blockers.map((blocker) => <div key={blocker.code} className="rounded-lg border border-white/10 bg-ink-800 p-3"><div className="text-sm font-semibold text-fog-100">{blocker.title}</div><p className="mt-1 text-xs leading-relaxed text-fog-300">{blocker.detail}</p><p className="mt-2 text-[10px] uppercase tracking-wide text-fog-400">Owner: {blocker.owner} · {blocker.severity}</p></div>)}</div></div>}<TextArea label="Final technician notes (internal)" value={assessment.finalNotes || ""} onChange={(next) => setAssessment((current) => ({ ...current, finalNotes: next }))} /><div className="rounded-xl border border-white/10 bg-ink-800 p-4"><label className="flex min-h-11 items-center gap-3 text-sm text-fog-100"><input type="checkbox" checked={assessment.customerAcknowledgment?.acknowledged || false} onChange={(event) => setAssessment((current) => ({ ...current, customerAcknowledgment: { ...current.customerAcknowledgment, acknowledged: event.target.checked } }))} className="h-5 w-5 accent-sky-400" /><span>{assessment.homeownerPresent ? "Homeowner reviewed the result and next steps" : "Summary will be sent electronically"}</span></label>{assessment.homeownerPresent && <label className="mt-3 block text-xs text-fog-300">Customer acknowledgment name<input value={assessment.customerAcknowledgment?.typedName || ""} onChange={(event) => setAssessment((current) => ({ ...current, customerAcknowledgment: { ...current.customerAcknowledgment, acknowledged: current.customerAcknowledgment?.acknowledged || false, typedName: event.target.value } }))} className={`${inputClass} mt-1`} /></label>}<p className="mt-3 text-xs leading-relaxed text-fog-400">This assessment records visible and reported conditions for installation planning. It does not warrant that concealed plumbing is leak-free. Active or unresolved leakage must be remedied before installation.</p></div><div className="text-xs text-fog-400">Assigned representative: {visit.assigned_rep_name}</div></div>;
}

const inspectionOptions: Array<[InspectionResult, string]> = [["not_tested", "Not tested / select result"], ["clear", "Clear"], ["needs_attention", "Needs attention"], ["active_leak", "Active leak"], ["not_present", "Not present"], ["not_accessible", "Not accessible"]];
function FixtureCard({ label, value, onChange }: { label: string; value: FixtureCheck; onChange: (value: FixtureCheck) => void }) { return <div className="rounded-lg border border-white/10 bg-ink-800/70 p-3"><label className="block text-xs font-semibold text-fog-200">{label}<select value={value.result} onChange={(event) => onChange({ ...value, result: event.target.value as InspectionResult })} className={`${selectClass} mt-2`}>{inspectionOptions.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label><textarea value={value.notes || ""} onChange={(event) => onChange({ ...value, notes: event.target.value })} placeholder={value.result === "not_accessible" ? "Required: explain why it was inaccessible" : "Observation notes"} rows={2} className={`${inputClass} mt-2`} /></div>; }
function InspectionField({ label, value, onChange }: { label: string; value: InspectionResult; notes?: string; onChange: (value: InspectionResult) => void }) { return <label className="block text-xs font-medium text-fog-300">{label}<select value={value} onChange={(event) => onChange(event.target.value as InspectionResult)} className={`${selectClass} mt-1`}>{inspectionOptions.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>; }
function YesNoField({ label, value, onChange }: { label: string; value: YesNoUnsure; onChange: (value: YesNoUnsure) => void }) { return <Choice label={label} value={value} options={[["yes", "Yes"], ["no", "No"], ["unsure", "Unsure / not verified"]]} onChange={(next) => onChange(next as YesNoUnsure)} />; }
function Choice({ label, value, options, onChange }: { label: string; value: unknown; options: Array<[unknown, string]>; onChange: (value: unknown) => void }) { return <fieldset><legend className="text-sm font-semibold text-fog-100">{label}</legend><div className="mt-2 grid gap-2 sm:grid-cols-3">{options.map(([option, text]) => <button type="button" key={String(option)} onClick={() => onChange(option)} className={`min-h-12 rounded-lg border px-3 text-sm font-semibold ${value === option ? "border-hydro-400 bg-hydro-400 text-ink-950" : "border-white/15 bg-ink-800 text-fog-200"}`}>{text}</button>)}</div></fieldset>; }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-xs font-medium text-fog-300">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-1`} /></label>; }
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block text-xs font-medium text-fog-300">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className={`${inputClass} mt-1`} /></label>; }
function SaveBadge({ state }: { state: string }) { const tones: Record<string, string> = { saved: "bg-green-500/15 text-green-300", saving: "bg-hydro-400/15 text-hydro-300", offline: "bg-signal-400/15 text-signal-400", error: "bg-alert-500/15 text-red-300", idle: "bg-fog-400/15 text-fog-300" }; const labels: Record<string, string> = { saved: "Saved", saving: "Saving", offline: "Offline · saved locally", error: "Save failed · local copy kept", idle: "Draft" }; return <div role="status" className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${tones[state] || tones.idle}`}>{labels[state] || state}</div>; }
