const steps = [
  {
    number: "01",
    title: "Home assessment",
    body: "We review the main water line, pipe size and material, nearby power, Wi-Fi reach, valve condition, fire-sprinkler routing, and any existing leaks that must be repaired first.",
    iconPath: "M4.5 10.5 12 3l7.5 7.5M5.25 9.75v9A1.5 1.5 0 0 0 6.75 20.25h10.5a1.5 1.5 0 0 0 1.5-1.5v-9",
  },
  {
    number: "02",
    title: "Written proposal",
    body: "You receive the recommended device, exact installation scope, site requirements, price, exclusions, and expected appointment duration before scheduling.",
    iconPath: "M19.5 14.25v-2.63a3.38 3.38 0 0 0-3.38-3.37h-1.5A1.13 1.13 0 0 1 13.5 7.13v-1.5a3.38 3.38 0 0 0-3.38-3.38H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.63A1.13 1.13 0 0 0 4.5 3.38v17.24c0 .63.5 1.13 1.13 1.13h12.74c.63 0 1.13-.5 1.13-1.13V11.25a9 9 0 0 0-9-9Z",
  },
  {
    number: "03",
    title: "Install, test, and hand off",
    body: "The system is installed, connected to the manufacturer app, tested through a shutoff cycle, and handed over with operating guidance and an itemized installation record.",
    iconPath: "m4.5 12.75 6 6 9-13.5",
  },
];

export default function CustomerJourney() {
  return (
    <section id="customer-journey" className="bg-ink-950/50 py-20 lg:py-28">
      <div className="section-container">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
            The process
          </p>
          <h2 className="mb-5 font-display text-3xl text-fog-50 sm:text-4xl lg:text-[2.75rem]">
            Three clear steps from assessment to tested handoff
          </h2>
          <p className="text-lg leading-relaxed text-fog-300">
            No guesswork and no surprise scope. The home is reviewed first, the
            proposal is approved second, and installation begins only after the
            requirements are clear.
          </p>
        </div>

        <ol className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <li key={step.number} className="rounded-2xl border border-ink-700/40 bg-ink-800/45 p-7 backdrop-blur-sm lg:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-hydro-400/20 bg-hydro-400/10 text-hydro-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.iconPath} />
                  </svg>
                </div>
                <span className="font-mono text-sm text-hydro-400/70">{step.number}</span>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-fog-50">{step.title}</h3>
              <p className="text-sm leading-relaxed text-fog-300 sm:text-base">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <a href="#lead-form" className="inline-flex items-center justify-center rounded-lg bg-hydro-400 px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-hydro-400/20 transition-all hover:bg-hydro-300">
            Check installation availability
          </a>
        </div>
      </div>
    </section>
  );
}
