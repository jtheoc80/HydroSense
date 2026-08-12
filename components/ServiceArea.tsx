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

export default function ServiceArea() {
  return (
    <section id="service-area" className="bg-[#f4f7fb] py-16 sm:py-20 lg:py-24 xl:py-28">
      <div className="section-container">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge
              color="sky"
              className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]"
            >
              GREATER HOUSTON COVERAGE
            </Badge>
            <Heading
              level={2}
              className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-[#001a4e] sm:!text-5xl"
            >
              Serving Greater Houston.
            </Heading>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Enter your ZIP code to confirm availability and travel requirements.
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

        <div
          data-service-grid="true"
          className="mt-12 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#001a4e] p-7 text-white shadow-[0_30px_80px_-45px_rgba(0,26,78,0.8)] sm:p-9 lg:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-25">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-sky-200/40" />
              <div className="absolute -right-4 -top-8 h-64 w-64 rounded-full border border-sky-200/25" />
              <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-sky-400/20 blur-3xl" />
            </div>

            <div className="relative flex h-full flex-col items-start">
              <h3 className="font-display text-5xl leading-none">Houston</h3>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Domestic-water shutoff installation across Houston and the surrounding metro, subject to site access and scheduling.
              </p>
              <a
                href="/service-area/houston"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition hover:text-white lg:mt-auto lg:pt-10"
              >
                Houston installation details
                <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cityList.filter((slug) => slug !== "houston").map((slug) => {
              const city = cities[slug];
              return (
                <a
                  key={slug}
                  href={`/service-area/${slug}`}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_24px_55px_-32px_rgba(2,132,199,0.28)] sm:p-6"
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
                      <span key={zip} className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
                        {zip}
                      </span>
                    ))}
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
