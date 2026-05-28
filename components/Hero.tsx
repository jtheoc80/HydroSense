import SavingsCounter from "./SavingsCounter";

const stats = [
  { value: "5-15%", label: "Typical carrier discount" },
  { value: "From $999", label: "Installed, certified" },
  { value: "15 min", label: "Quote over the phone" },
];

export default function Hero() {
  return (
    <section className="relative py-20 lg:py-32 hydro-mesh overflow-hidden">
      <div className="dot-grid absolute inset-0 pointer-events-none" />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/60 pointer-events-none" />

      <div className="section-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-5">
              Licensed Texas Master Plumber install
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.25rem] lg:leading-[1.05] text-fog-50 mb-8">
              Your homeowners insurance is bleeding{" "}
              <span className="text-signal-400">$500</span> a year.
              <br className="hidden sm:block" />
              <span className="text-fog-200"> We stop it.</span>
            </h1>
            <p className="text-lg lg:text-xl text-fog-200 mb-10 max-w-xl leading-relaxed">
              We install a carrier-recognized smart water shutoff, issue the
              certificate your insurer requires, and keep the documentation
              current at every renewal so the discount sticks year after year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#lead-form"
                className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-base px-8 py-4 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 transition-all hover:shadow-hydro-400/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get my 15-minute quote
              </a>
              <a
                href="#savings-estimator"
                className="inline-flex items-center justify-center rounded-lg border border-fog-300/20 text-fog-100 font-medium text-base px-8 py-4 hover:bg-white/5 hover:border-fog-300/30 transition-all"
              >
                See the savings math
              </a>
            </div>
          </div>

          <SavingsCounter />
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6 mt-20 lg:mt-24">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-5 lg:p-6 text-center backdrop-blur-sm"
            >
              <p className="font-mono text-xl sm:text-2xl lg:text-3xl text-hydro-400 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-fog-300 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
