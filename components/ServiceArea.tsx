import { cities } from "@/lib/cities";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";

const cityList = [
  "houston",
  "katy",
  "cypress",
  "the-woodlands",
  "league-city",
  "pearland",
  "friendswood",
  "sugar-land",
  "spring",
  "baytown",
] as const;

const houstonProjectSteps = [
  {
    title: "Compatibility review",
    body: "Domestic-line routing, device fit, access, power, and Wi-Fi are reviewed first.",
  },
  {
    title: "Written proposal",
    body: "Equipment, installation scope, exclusions, and site-specific work are documented before scheduling.",
  },
  {
    title: "Tested handoff",
    body: "Installation, app setup, shutoff-cycle testing, and homeowner guidance are completed together.",
  },
] as const;

export default function ServiceArea() {
  return (
    <section id="service-area" className="bg-[#f4f7fb] py-20 sm:py-24 lg:py-28">
      <div className="section-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge color="sky" className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]">
              Greater Houston coverage
            </Badge>
            <Heading level={2} className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-[#001a4e] sm:!text-5xl">
              Local installation with a clear service boundary.
            </Heading>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Submit the property ZIP code so HydroSense can confirm current appointment availability,
              travel requirements, and the right installation path for the home.
            </p>
          </div>
          <Button
            href="/service-area"
            outline
            className="!shrink-0 !self-start !rounded-full !border-slate-300 !bg-white !px-5 !py-3 !text-sm !font-semibold !text-[#001a4e] !shadow-sm hover:!border-slate-400 hover:!bg-slate-50 lg:!self-auto"
          >
            View all service areas
            <svg data-slot="icon" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
            </svg>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
          <div
            data-primary-market-card
            className="relative flex flex-col overflow-hidden rounded-[2rem] bg-[#001a4e] p-7 text-white shadow-[0_30px_80px_-45px_rgba(0,26,78,0.8)] sm:p-9 lg:p-10"
          >
            <div className="pointer-events-none absolute inset-0 opacity-25">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-sky-200/40" />
              <div className="absolute -right-4 -top-8 h-64 w-64 rounded-full border border-sky-200/25" />
              <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-400/20 blur-3xl" />
            </div>

            <div className="relative flex flex-1 flex-col">
              <span className="inline-flex rounded-full border border-sky-200/20 bg-sky-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-200">
                Primary market
              </span>
              <h3 className="mt-6 font-display text-5xl leading-none">Houston</h3>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Whole-home domestic-water shutoff installation across Houston and the surrounding metro,
                subject to site access and current scheduling capacity.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <p className="text-2xl font-semibold text-white">10</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">Core metro markets</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <p className="text-2xl font-semibold text-white">1 process</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">Consistent scope</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200">
                  From review to handoff
                </p>
                <ul className="mt-4 space-y-4">
                  {houstonProjectSteps.map((step) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-300/15 text-sky-200">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 10 3 3 7-7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-300">
                  Domestic water is the standard scope. Fire-sprinkler and fire-suppression
                  piping are excluded; irrigation must be specifically requested, reviewed,
                  and quoted.
                </p>
              </div>

              <a
                href="/service-area/houston"
                data-primary-market-link
                className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-sky-200 transition hover:text-white"
              >
                Houston installation details
                <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cityList.filter((slug) => slug !== "houston").map((slug) => {
              const city = cities[slug];
              return (
                <a
                  key={slug}
                  href={`/service-area/${slug}`}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_55px_-32px_rgba(2,132,199,0.28)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.015em] text-[#001a4e]">{city.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">{city.county}</p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-sky-50 group-hover:text-sky-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
                      </svg>
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {city.zips.slice(0, 3).map((zip) => (
                      <span key={zip} className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">{zip}</span>
                    ))}
                    {city.zips.length > 3 && (
                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">+ nearby</span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
