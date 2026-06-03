import { cities } from "@/lib/cities";

const cityList = [
  "katy",
  "cypress",
  "the-woodlands",
  "sugar-land",
  "spring",
  "baytown",
  "houston",
] as const;

export default function ServiceArea() {
  return (
    <section id="service-area" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
            Coverage map
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-5">
            Service area
          </h2>
          <p className="text-fog-300 text-lg leading-relaxed">
            We install across the Houston metro and surrounding Texas markets.
            Each city page includes local carrier data, median premiums, and
            city-specific case studies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {cityList.map((slug) => {
            const city = cities[slug];
            return (
              <a
                key={slug}
                href={`/service-area/${slug}`}
                className="bg-ink-800/40 border border-ink-700/30 rounded-2xl p-6 hover:border-hydro-400/40 hover:bg-ink-800/60 transition-all group backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-fog-50 group-hover:text-hydro-400 transition-colors mb-2">
                  {city.name}
                </h3>
                <p className="text-sm text-fog-300">
                  Median home:{" "}
                  <span className="font-mono text-signal-400">
                    {city.medianHome}
                  </span>
                </p>
                <p className="text-xs text-fog-400 mt-3 leading-relaxed">
                  {city.heroNote}
                </p>
              </a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-6">
          <a
            href="/service-area"
            className="inline-flex items-center text-hydro-400 hover:text-hydro-300 text-base font-medium transition-colors"
          >
            View all service areas including Galveston and Lake Conroe
            <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/devices"
            className="inline-flex items-center text-hydro-400 hover:text-hydro-300 text-base font-medium transition-colors"
          >
            Compare smart shutoff devices we install
            <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
