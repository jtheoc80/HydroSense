import type { ReactNode } from "react";

const installFeatures = [
  "Compatible smart shutoff device",
  "Standard fittings and installation labor",
  "Manufacturer app setup",
  "Automatic shutoff test and homeowner handoff",
  "Itemized installation record",
];

const careFeatures = [
  "Annual physical valve inspection",
  "Shutoff-cycle test",
  "App and notification configuration review",
  "Power and Wi-Fi connectivity check",
  "Documentation assistance",
];

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-fog-200">
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-hydro-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
            Clear pricing
          </p>
          <h2 className="mb-5 font-display text-3xl text-fog-50 sm:text-4xl lg:text-[2.75rem]">
            Know the installation price before work begins
          </h2>
          <p className="text-lg leading-relaxed text-fog-300">
            Every customer receives a written proposal based on the selected
            device, pipe size and material, main-line access, power, fittings,
            and any corrective plumbing required before installation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="rounded-2xl border-2 border-hydro-400/25 bg-ink-800/75 p-7 shadow-lg shadow-hydro-400/5 backdrop-blur-sm lg:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-hydro-400">One-time project</p>
            <h3 className="font-display text-2xl text-fog-50">Professional installation</h3>
            <div className="my-6 flex items-end gap-2">
              <span className="font-mono text-4xl tracking-tight text-fog-50">$999</span>
              <span className="pb-1 text-fog-300">starting price</span>
            </div>
            <ul className="mb-8 space-y-3.5">
              {installFeatures.map((feature) => <CheckItem key={feature}>{feature}</CheckItem>)}
            </ul>
            <a href="#lead-form" className="block w-full rounded-xl bg-hydro-400 py-3.5 text-center text-sm font-semibold text-ink-950 shadow-lg shadow-hydro-400/20 transition-all hover:bg-hydro-300">
              Request a written proposal
            </a>
          </article>

          <article className="rounded-2xl border border-ink-700/40 bg-ink-800/40 p-7 backdrop-blur-sm lg:p-9">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-fog-400">Optional aftercare</p>
            <h3 className="font-display text-2xl text-fog-50">Annual system care</h3>
            <div className="my-6 flex items-end gap-2">
              <span className="font-mono text-4xl tracking-tight text-fog-50">$99</span>
              <span className="pb-1 text-fog-300">per year</span>
            </div>
            <ul className="mb-8 space-y-3.5">
              {careFeatures.map((feature) => <CheckItem key={feature}>{feature}</CheckItem>)}
            </ul>
            <a href="#lead-form" className="block w-full rounded-xl border border-fog-300/20 py-3.5 text-center text-sm font-semibold text-fog-100 transition-all hover:border-fog-300/30 hover:bg-white/5">
              Ask about annual care
            </a>
          </article>
        </div>

        <div id="savings-estimator" className="mt-8 scroll-mt-32 rounded-xl border border-ink-700/40 bg-ink-900/60 p-5 text-sm leading-relaxed text-fog-300">
          <strong className="text-fog-100">The care plan is optional.</strong>{" "}
          Core device monitoring, manufacturer-app alerts, and automatic shutoff
          functions do not require a HydroSense plan. Those features depend on
          the selected device, its settings, connectivity, and manufacturer service.
        </div>
      </div>
    </section>
  );
}
