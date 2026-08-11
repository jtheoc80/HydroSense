import { cities } from "@/lib/cities";

const cityList = [
  "houston",
  "katy",
  "cypress",
  "the-woodlands",
  "sugar-land",
  "spring",
  "baytown",
] as const;

export default function ServiceArea() {
  return (
    <section id="service-area" className="bg-ink-950/50 py-20 lg:py-28">
      <div className="section-container">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
            Greater Houston coverage
          </p>
          <h2 className="mb-5 font-display text-3xl text-fog-50 sm:text-4xl lg:text-[2.75rem]">
            Local installation across the Houston metro
          </h2>
          <p className="text-lg leading-relaxed text-fog-300">
            Review the areas we currently serve, then submit your ZIP code so we
            can confirm appointment availability and the correct installation path.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cityList.map((slug) => {
            const city = cities[slug];
            return (
              <a key={slug} href={`/service-area/${slug}`} className="group rounded-2xl border border-ink-700/30 bg-ink-800/40 p-6 backdrop-blur-sm transition-all hover:border-hydro-400/40 hover:bg-ink-800/60">
                <h3 className="mb-2 text-lg font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">
                  {city.name}
                </h3>
                <p className="text-sm text-fog-300">County coverage: {city.county}</p>
                <p className="mt-3 text-xs leading-relaxed text-fog-400">
                  ZIP codes: {city.zips.slice(0, 4).join(", ")}
                  {city.zips.length > 4 ? " and nearby" : ""}
                </p>
              </a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-6">
          <a href="/service-area" className="inline-flex items-center text-base font-medium text-hydro-400 transition-colors hover:text-hydro-300">
            View all service areas
            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </a>
          <a href="/devices" className="inline-flex items-center text-base font-medium text-hydro-400 transition-colors hover:text-hydro-300">
            Compare devices we install
            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
