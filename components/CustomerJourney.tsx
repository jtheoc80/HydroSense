import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";

const steps = [
  {
    number: "01",
    eyebrow: "Before a price is issued",
    title: "We assess the home",
    body: "We review the main water line, pipe size and material, nearby power, Wi-Fi reach, valve condition, fire-sprinkler routing, and any existing leaks that must be corrected first.",
    detail: "No blind scheduling. No surprise change order caused by a missed site condition.",
  },
  {
    number: "02",
    eyebrow: "Before work is scheduled",
    title: "You receive a written proposal",
    body: "The proposal identifies the recommended device, exact installation scope, required fittings, price, exclusions, and expected appointment duration.",
    detail: "You approve the scope before anyone begins cutting into the main line.",
  },
  {
    number: "03",
    eyebrow: "Before we leave",
    title: "We install, test, and hand off",
    body: "The system is installed, connected to the manufacturer app, tested through a shutoff cycle, and handed over with operating guidance and an itemized installation record.",
    detail: "The homeowner sees the system operate and knows what to do next.",
  },
];

export default function CustomerJourney() {
  return (
    <section id="customer-journey" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <Badge color="sky" className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]">
              A controlled installation process
            </Badge>
            <Heading level={2} className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-[#001a4e] sm:!text-5xl">
              Clear decisions before the water is turned off.
            </Heading>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              HydroSense treats the installation like a small residential project,
              not an impulse service call. Site conditions are understood first,
              the price is documented second, and the work is tested before handoff.
            </p>

            <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#001a4e]">Typical site visit</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Main-line review, interior water-fixture walkthrough, power and Wi-Fi check,
                    installation location review, and next-step confirmation.
                  </p>
                </div>
              </div>
            </div>

            <Button
              href="#lead-form"
              outline
              className="!mt-8 !rounded-full !border-slate-300 !bg-white !px-5 !py-3 !text-sm !font-semibold !text-[#001a4e] !shadow-sm hover:!border-slate-400 hover:!bg-slate-50"
            >
              Start with the assessment
              <svg data-slot="icon" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
              </svg>
            </Button>
          </div>

          <ol className="relative space-y-5 before:absolute before:bottom-12 before:left-7 before:top-12 before:w-px before:bg-slate-200 sm:before:left-9">
            {steps.map((step) => (
              <li
                key={step.number}
                className="relative rounded-[1.75rem] border border-slate-200 bg-[#f8fafc] p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)] sm:p-8"
              >
                <div className="flex gap-5 sm:gap-7">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#001a4e] font-mono text-sm font-semibold text-white shadow-lg shadow-blue-950/15 sm:h-[4.5rem] sm:w-[4.5rem] sm:text-base">
                    {step.number}
                  </span>
                  <div className="min-w-0 pt-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                      {step.eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-slate-600">{step.body}</p>
                    <p className="mt-4 border-l-2 border-sky-300 pl-4 text-sm font-medium leading-6 text-slate-700">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
