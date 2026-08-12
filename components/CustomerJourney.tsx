import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";

const steps = [
  {
    number: "01",
    title: "Assess the home",
    body: "We check the domestic line, valve, pipe, power, Wi-Fi, and installation location.",
  },
  {
    number: "02",
    title: "Approve the scope",
    body: "You receive the device recommendation, final price, exclusions, and timing in writing.",
  },
  {
    number: "03",
    title: "Install and test",
    body: "We configure the app, run a shutoff test, and complete the homeowner handoff.",
  },
];

export default function CustomerJourney() {
  return (
    <section id="customer-journey" className="bg-[#f8fafc] py-16 sm:py-20 lg:py-24 xl:py-28">
      <div className="section-container">
        <div className="max-w-3xl">
          <Badge
            color="sky"
            className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]"
          >
            HOW IT WORKS
          </Badge>
          <Heading
            level={2}
            className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-[#001a4e] sm:!text-5xl"
          >
            From assessment to tested handoff.
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            We assess the home, document the scope, then install and test the system.
          </p>
        </div>

        <ol
          data-process-timeline="true"
          className="mt-12 divide-y divide-slate-200 border-y border-slate-200 lg:mt-14 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0"
        >
          {steps.map((step) => (
            <li
              key={step.number}
              className="grid grid-cols-[3.5rem_1fr] gap-5 py-8 lg:block lg:px-8 lg:py-10 lg:first:pl-0 lg:last:pr-0"
            >
              <span className="font-mono text-sm font-semibold tracking-[0.14em] text-sky-600">
                {step.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.015em] text-[#001a4e] lg:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Irrigation is optional when quoted. Fire-suppression piping is excluded.
          </p>
          <Button
            href="#lead-form"
            outline
            className="!shrink-0 !rounded-full !border-slate-300 !bg-white !px-5 !py-3 !text-sm !font-semibold !text-[#001a4e] !shadow-sm hover:!border-slate-400 hover:!bg-slate-50"
          >
            Start with the assessment
            <svg
              data-slot="icon"
              className="h-5 w-5 shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
