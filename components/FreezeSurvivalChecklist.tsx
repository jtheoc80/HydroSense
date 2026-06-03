"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";

interface ChecklistItem {
  id: string;
  label: string;
}

const phases: { title: string; id: string; items: ChecklistItem[] }[] = [
  {
    title: "72 Hours Before a Freeze",
    id: "before",
    items: [
      { id: "b1", label: "Locate your main water shutoff valve and confirm you can turn it by hand" },
      { id: "b2", label: "Disconnect and drain all outdoor garden hoses" },
      { id: "b3", label: "Cover outdoor faucets with insulated hose bibb covers" },
      { id: "b4", label: "Insulate exposed pipes in the garage, attic, and crawl spaces with foam sleeves" },
      { id: "b5", label: "Open cabinet doors under kitchen and bathroom sinks on exterior walls" },
      { id: "b6", label: "Set thermostat to at least 55 degrees F and disable night setback" },
      { id: "b7", label: "Drain and winterize the irrigation system and backflow preventer" },
      { id: "b8", label: "Lower the pool water level below the skimmer and run the pump continuously" },
      { id: "b9", label: "Seal gaps around pipes that enter the home through exterior walls" },
      { id: "b10", label: "Charge your phone and save your plumber's number (and your shutoff valve location)" },
    ],
  },
  {
    title: "During the Freeze",
    id: "during",
    items: [
      { id: "d1", label: "Let faucets drip on both hot and cold lines at a pencil-lead stream" },
      { id: "d2", label: "Keep garage doors closed if water lines run through the garage" },
      { id: "d3", label: "Maintain interior temperature — never let it drop below 55 degrees" },
      { id: "d4", label: "Monitor for pressure drops: a faucet slowing to a trickle can indicate a forming ice block" },
      { id: "d5", label: "Do NOT use open flame or space heaters directly on pipes" },
      { id: "d6", label: "If traveling, have someone check the house daily or use a smart temperature sensor" },
    ],
  },
  {
    title: "After the Thaw",
    id: "after",
    items: [
      { id: "a1", label: "Walk the house and visually inspect every visible pipe, connection, and fixture" },
      { id: "a2", label: "Check under every sink, behind the water heater, and around the washing machine" },
      { id: "a3", label: "Read the water meter, wait two hours with no use, and read again — any movement means a leak" },
      { id: "a4", label: "Inspect walls and ceilings for new stains, soft spots, or bubbling paint" },
      { id: "a5", label: "Check the attic for moisture or dripping if supply lines run through it" },
      { id: "a6", label: "Re-inspect 3 days and 7 days after the thaw — hairline cracks can take time to fail" },
      { id: "a7", label: "Document any damage with photos before starting cleanup for insurance purposes" },
    ],
  },
];

const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);

interface FreezeSurvivalChecklistProps {
  showEmailCapture?: boolean;
}

export default function FreezeSurvivalChecklist({
  showEmailCapture = false,
}: FreezeSurvivalChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handlePrint() {
    window.print();
  }

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email") as string;
    const firstName = data.get("first_name") as string;

    if (!email) return;

    setEmailSubmitting(true);
    try {
      // Post to the existing lead creation endpoint so the homeowner enters
      // the Supabase/Resend drip. The message field signals the checklist origin.
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName || "",
          last_name: "",
          email,
          phone: "",
          zip: "",
          address: "",
          carrier: "",
          message: "[Freeze Checklist PDF Request]",
          city: "",
          source: "hydrosensetx.com",
          utm_content: "freeze-checklist-pdf",
          page_path: window.location.pathname,
        }),
      });
      if (res.ok) {
        setEmailSuccess(true);
      }
    } catch {
      // Silently fail — the form is a secondary CTA
    } finally {
      setEmailSubmitting(false);
    }
  }

  return (
    <>
      {/* Print-only styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * { visibility: hidden !important; }
              #freeze-checklist, #freeze-checklist * { visibility: visible !important; }
              #freeze-checklist {
                position: absolute; left: 0; top: 0; width: 100%;
                background: white !important; color: black !important;
                padding: 2rem !important;
              }
              #freeze-checklist [data-print-hide] { display: none !important; }
              #freeze-checklist .print-header { display: flex !important; }
              #freeze-checklist label { color: black !important; }
              #freeze-checklist h2, #freeze-checklist h3, #freeze-checklist p { color: black !important; }
              #freeze-checklist input[type="checkbox"] {
                -webkit-appearance: auto; appearance: auto;
                width: 16px; height: 16px; border: 2px solid black !important;
              }
            }
          `,
        }}
      />

      <div
        id="freeze-checklist"
        className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-6 lg:p-8"
      >
        {/* Print-only header */}
        <div className="print-header hidden items-center justify-between mb-6 pb-4 border-b-2 border-black">
          <div>
            <p className="text-xl font-bold">HydroSense Texas</p>
            <p className="text-sm">Freeze Survival Checklist</p>
          </div>
          <div className="text-right text-sm">
            <p>(281) 694-5754</p>
            <p>License {MASTER_PLUMBER_LICENSE}</p>
          </div>
        </div>

        {/* Screen header */}
        <div className="flex items-center justify-between mb-6" data-print-hide>
          <div>
            <h2 className="font-display text-xl lg:text-2xl text-fog-50 mb-1">
              Texas Freeze Survival Checklist
            </h2>
            <p className="text-fog-400 text-sm">
              {checkedCount} of {totalItems} complete
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-sm text-hydro-400 hover:text-hydro-300 transition-colors font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print this checklist
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8" data-print-hide>
          <div className="h-2 bg-ink-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-hydro-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-8">
          {phases.map((phase) => {
            const phaseChecked = phase.items.filter(
              (i) => checked[i.id]
            ).length;
            return (
              <div key={phase.id}>
                <h3 className="font-display text-lg text-fog-50 mb-4 flex items-center gap-3">
                  {phase.title}
                  <span
                    className="text-xs font-mono text-fog-400"
                    data-print-hide
                  >
                    {phaseChecked}/{phase.items.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {phase.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={!!checked[item.id]}
                        onChange={() => toggle(item.id)}
                        className="mt-1 h-4 w-4 rounded border-ink-600 bg-ink-900 text-hydro-400 focus:ring-hydro-400/50 focus:ring-offset-0 shrink-0"
                      />
                      <span
                        className={`text-sm leading-relaxed transition-colors ${
                          checked[item.id]
                            ? "text-fog-400 line-through"
                            : "text-fog-200 group-hover:text-fog-50"
                        }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Print-only footer */}
        <div className="hidden print-header mt-8 pt-4 border-t-2 border-black text-sm justify-between">
          <p>hydrosensetx.com</p>
          <p>License {MASTER_PLUMBER_LICENSE} | (281) 694-5754</p>
        </div>

        {/* Email capture variant */}
        {showEmailCapture && !emailSuccess && (
          <div
            className="mt-8 pt-6 border-t border-ink-700/30"
            data-print-hide
          >
            <p className="text-fog-50 font-semibold text-sm mb-3">
              Email me the printable PDF
            </p>
            <form
              ref={formRef}
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                className="flex-1 bg-ink-900 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-fog-50 placeholder:text-fog-400 focus:outline-none focus:ring-1 focus:ring-hydro-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="flex-1 bg-ink-900 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-fog-50 placeholder:text-fog-400 focus:outline-none focus:ring-1 focus:ring-hydro-400"
              />
              <button
                type="submit"
                disabled={emailSubmitting}
                className="rounded-lg bg-hydro-400 text-ink-950 font-semibold text-sm px-6 py-2.5 hover:bg-hydro-300 transition-all disabled:opacity-50"
              >
                {emailSubmitting ? "Sending..." : "Send PDF"}
              </button>
            </form>
          </div>
        )}
        {showEmailCapture && emailSuccess && (
          <div
            className="mt-8 pt-6 border-t border-ink-700/30 text-center"
            data-print-hide
          >
            <p className="text-hydro-400 font-semibold text-sm">
              Check your inbox. The checklist PDF is on its way.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
