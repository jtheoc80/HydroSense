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
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-4">
          Service area
        </h2>
        <p className="text-fog-300 mb-12 max-w-2xl">
          We install across the Houston metro and surrounding Texas markets.
          Each city page includes local carrier data, median premiums, and
          city-specific case studies.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cityList.map((slug) => {
            const city = cities[slug];
            return (
              <a
                key={slug}
                href={`/service-area/${slug}`}
                className="bg-ink-800 border border-ink-700 rounded-lg p-5 hover:border-hydro-400/50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-fog-50 group-hover:text-hydro-400 transition-colors">
                  {city.name}
                </h3>
                <p className="text-sm text-fog-300 mt-1">
                  Median home:{" "}
                  <span className="font-mono text-fog-200">
                    {city.medianHome}
                  </span>
                </p>
                <p className="text-xs text-fog-400 mt-2">{city.heroNote}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
