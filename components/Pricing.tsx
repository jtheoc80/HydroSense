import type { ReactNode } from "react";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";

const installFeatures = [
  "Compatible smart shutoff",
  "Standard fittings and labor",
  "App setup and shutoff test",
  "Homeowner handoff and record",
];

const careFeatures = [
  "Valve inspection",
  "Shutoff-cycle test",
  "App, power, and Wi-Fi review",
  "Documentation support",
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
    <section id="pricing" className="relative overflow-hidden bg-[#00163f] py-16 text-white sm:py-20 lg:py-24 xl:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -bottom-48 left-0 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-16">
          <div className="max-w-3xl">
            <Badge color="sky" className="!rounded-full !bg-sky-300/10 !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em] !text-sky-200">
              TRANSPARENT SCOPE AND PRICE
            </Badge>
            <Heading level={2} className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-white sm:!text-5xl">
              Know the price before installation day.
            </Heading>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-300 lg:justify-self-end">
            Your written proposal confirms the device, installation scope, and final price before work begins.
          </p>
        </div>

        <div
          data-pricing-cards="true"
          className="mx-auto mt-12 grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 lg:gap-8"
        >
          <article className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-7 text-slate-950 shadow-[0_35px_100px_-45px_rgba(0,0,0,0.7)] sm:p-9 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">ONE-TIME PROJECT</p>
            <h3 className="mt-3 font-display text-3xl text-[#001a4e] sm:text-4xl">Professional installation</h3>
            <p className="mt-6 font-mono text-4xl font-semibold tracking-[-0.04em] text-[#001a4e]">From $999</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              For a standard single-family home with an accessible domestic main.
            </p>

            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {installFeatures.map((feature) => (
                <CheckItem key={feature} light>{feature}</CheckItem>
              ))}
            </ul>

            <Button
              href="#lead-form"
              color="cyan"
              className="!mt-9 !w-full !rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-sm !font-semibold !text-ink-950 !shadow-lg !shadow-sky-500/15 hover:!bg-hydro-300 sm:!w-auto lg:!mt-auto lg:!self-start"
            >
              Request a written proposal
            </Button>
          </article>

          <article className="flex h-full flex-col rounded-[2rem] border border-white/15 bg-white/[0.07] p-7 sm:p-9 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">OPTIONAL AFTERCARE</p>
            <h3 className="mt-3 font-display text-3xl text-white sm:text-4xl">Annual system care</h3>
            <p className="mt-6 font-mono text-4xl font-semibold tracking-[-0.04em] text-white">$99 per year</p>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Optional annual inspection and operating check.
            </p>

            <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {careFeatures.map((feature) => (
                <CheckItem key={feature}>{feature}</CheckItem>
              ))}
            </ul>

            <Button
              href="#lead-form"
              outline
              className="!mt-9 !w-full !rounded-full !border-white/20 !bg-white/5 !px-6 !py-3.5 !text-sm !font-semibold !text-white hover:!border-white/35 hover:!bg-white/10 lg:!mt-auto lg:!self-start"
            >
              Ask about annual care
            </Button>
          </article>
        </div>

        <div id="savings-estimator" className="mx-auto mt-8 max-w-6xl scroll-mt-32 space-y-2 text-sm leading-6 text-slate-300">
          <p>
            Non-standard piping, electrical work, dual mains, inaccessible routing, irrigation, and required repairs are quoted separately.
          </p>
          <p>
            Annual care is optional. Manufacturer monitoring and automatic shutoff do not require a HydroSense plan.
          </p>
          <p>Insurance eligibility and incentives vary by insurer and policy.</p>
        </div>
      </div>
    </section>
  );
}
