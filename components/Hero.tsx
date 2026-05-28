import SavingsCounter from "./SavingsCounter";

const stats = [
  { value: "5-15%", label: "Typical carrier discount" },
  { value: "From $999", label: "Installed, certified" },
  { value: "15 min", label: "Quote over the phone" },
];

export default function Hero() {
  return (
    <section className="relative py-16 lg:py-24 hydro-mesh">
      <div className="dot-grid absolute inset-0 pointer-events-none" />
      <div className="section-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-hydro-400 mb-4">
              Texas Master Plumber License MPL 43057
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-fog-50 leading-[1.1] mb-6">
              Your homeowners insurance is bleeding $500 a year. We stop it.
            </h1>
            <p className="text-lg text-fog-200 mb-8 max-w-xl leading-relaxed">
              We install a carrier-recognized smart water shutoff, issue the
              certificate your insurer requires, and keep the documentation
              current at every renewal so the discount sticks year after year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#lead-form" className="btn-primary text-base">
                Get my 15-minute quote
              </a>
              <a href="#savings-estimator" className="btn-outline text-base">
                See the savings math
              </a>
            </div>
          </div>

          <SavingsCounter />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-ink-800/60 border border-ink-700/50 rounded-lg p-4 text-center"
            >
              <p className="font-mono text-xl sm:text-2xl text-hydro-400">
                {stat.value}
              </p>
              <p className="text-sm text-fog-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
