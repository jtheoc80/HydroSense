import type { ReactNode } from "react";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";

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

function CheckItem({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <li className={`flex items-start gap-3 text-sm leading-6 ${light ? "text-slate-600" : "text-slate-200"}`}>
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${light ? "bg-sky-100 text-sky-700" : "bg-sky-300/15 text-sky-200"}`}>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#00163f] py-20 text-white sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-48 left-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Badge color="sky" className="!rounded-full !bg-sky-300/10 !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em] !text-sky-200">
            Transparent scope and price
          </Badge>
          <Heading level={2} className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-white sm:!text-5xl">
            Know what is included before installation day.
          </Heading>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            The final proposal is based on the selected device, pipe size and material,
            domestic-line access, electrical availability, fittings, and corrective plumbing.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:gap-8">
          <article className="relative overflow-hidden rounded-[2rem] bg-white p-7 text-slate-950 shadow-[0_35px_100px_-45px_rgba(0,0,0,0.7)] sm:p-9 lg:p-11">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300" />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">One-time project</p>
                <h3 className="mt-3 font-display text-3xl text-[#001a4e] sm:text-4xl">Professional installation</h3>
              </div>
              <div className="sm:text-right">
                <p className="font-mono text-4xl font-semibold tracking-[-0.04em] text-[#001a4e]">$999</p>
                <p className="mt-1 text-sm text-slate-500">starting price</p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              A standard single-family installation with an accessible main line.
              Non-standard pipework, electrical work, dual mains, inaccessible routing,
              or required repairs are priced in the written proposal.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {installFeatures.map((feature) => (
                <CheckItem key={feature} light>{feature}</CheckItem>
              ))}
            </ul>

            <Button
              href="#lead-form"
              color="cyan"
              className="!mt-9 !w-full !rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-sm !font-semibold !text-ink-950 !shadow-lg !shadow-sky-500/15 hover:!bg-hydro-300 sm:!w-auto"
            >
              Request a written proposal
            </Button>
          </article>

          <article className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-7 backdrop-blur sm:p-9 lg:p-10">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Optional aftercare</p>
                <h3 className="mt-3 font-display text-3xl text-white">Annual system care</h3>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl font-semibold tracking-[-0.03em] text-white">$99</p>
                <p className="mt-1 text-xs text-slate-400">per year</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-300">
              A physical annual check for homeowners who prefer a scheduled review of the valve,
              shutoff operation, app configuration, power, Wi-Fi, and documentation.
            </p>

            <ul className="mt-7 space-y-4">
              {careFeatures.map((feature) => (
                <CheckItem key={feature}>{feature}</CheckItem>
              ))}
            </ul>

            <Button
              href="#lead-form"
              outline
              className="!mt-9 !w-full !rounded-full !border-white/20 !bg-white/5 !px-6 !py-3.5 !text-sm !font-semibold !text-white hover:!border-white/35 hover:!bg-white/10"
            >
              Ask about annual care
            </Button>
          </article>
        </div>

        <div id="savings-estimator" className="mx-auto mt-8 max-w-6xl scroll-mt-32 rounded-2xl border border-white/10 bg-black/10 px-5 py-4 text-sm leading-6 text-slate-300">
          <strong className="text-white">The care plan is optional.</strong>{" "}
          Core device monitoring, manufacturer-app alerts, and automatic shutoff functions do not require a HydroSense plan.
          Those capabilities depend on the selected device, settings, connectivity, and manufacturer service.
        </div>
      </div>
    </section>
  );
}
