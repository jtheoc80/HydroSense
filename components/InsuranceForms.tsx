const forms = [
  {
    name: "HO-A (Basic)",
    coverage: "Actual Cash Value",
    description:
      "Covers 10 named perils only. Claims settle at depreciated value, not replacement cost. A 15-year-old water heater that fails is valued at what a 15-year-old water heater is worth, not what a new one costs.",
    example:
      "A burst supply line causing $18,000 in damage settles at $6,000 after depreciation. You cover the $12,000 gap out of pocket.",
    verdict:
      "Least coverage. Lowest premium. Largest out-of-pocket exposure.",
    highlight: false,
  },
  {
    name: "HO-B (Broad)",
    coverage: "Replacement Cost",
    description:
      "Covers 16 named perils at replacement cost. Claims settle at what it costs to repair or replace, regardless of age or depreciation. This is the most common form in Texas.",
    example:
      "The same $18,000 supply line claim settles at $18,000. No depreciation gap. You pay the deductible only.",
    verdict:
      "Standard for most Texas homes. Replacement cost eliminates the depreciation gap.",
    highlight: true,
  },
  {
    name: "HO-3 (Special)",
    coverage: "Open Peril, Replacement Cost",
    description:
      "Covers all perils except those specifically excluded. This is the broadest standard form. Your dwelling is covered unless your policy says otherwise, instead of only being covered for listed events.",
    example:
      "An unusual event that is not listed in HO-A or HO-B named perils is still covered under HO-3, as long as it is not specifically excluded.",
    verdict:
      "Broadest coverage. Higher premium. Recommended for homes valued above $400,000.",
    highlight: false,
  },
];

export default function InsuranceForms() {
  return (
    <section id="insurance-forms" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
            Know your policy
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-5">
            HO-A vs HO-B vs HO-3: what your Texas policy actually covers
          </h2>
          <p className="text-fog-300 text-lg leading-relaxed">
            Most Texas homeowners do not know which form they are on. The form
            determines whether a water damage claim settles at replacement cost
            or depreciated value. That single distinction can mean a{" "}
            <span className="font-mono text-signal-400">$12,000</span>{" "}
            difference on one event.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {forms.map((form) => (
            <div
              key={form.name}
              className={`rounded-2xl p-7 lg:p-9 flex flex-col backdrop-blur-sm transition-all ${
                form.highlight
                  ? "bg-ink-800/80 border-2 border-hydro-400/30 shadow-lg shadow-hydro-400/5"
                  : "bg-ink-800/40 border border-ink-700/40"
              }`}
            >
              <div className="mb-6">
                <h3 className="font-display text-xl lg:text-2xl text-fog-50 mb-2">
                  {form.name}
                </h3>
                <p className="font-mono text-sm text-hydro-400 tracking-wide">
                  {form.coverage}
                </p>
                {form.highlight && (
                  <span className="inline-block mt-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-hydro-400 bg-hydro-400/10 px-3 py-1 rounded-full">
                    Most common in Texas
                  </span>
                )}
              </div>

              <p className="text-fog-200 leading-relaxed mb-6 flex-1">
                {form.description}
              </p>

              <div className="bg-ink-900/50 border border-ink-700/30 rounded-xl p-5 mb-6">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                  Example
                </p>
                <p className="text-sm text-fog-200 leading-relaxed">
                  {form.example}
                </p>
              </div>

              <p className="text-sm font-semibold text-fog-50">
                {form.verdict}
              </p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-10 bg-ink-800/60 border-l-4 border-l-signal-400 rounded-r-xl p-7 lg:p-9 backdrop-blur-sm">
          <p className="text-fog-50 font-display text-xl mb-3">
            The smart shutoff discount applies on all three forms.
          </p>
          <p className="text-fog-300 leading-relaxed">
            Regardless of whether you carry HO-A, HO-B, or HO-3, the
            carrier-recognized certificate qualifies you for the water-damage
            credit. But if you are on HO-A, the device protection itself is
            even more critical because your claim settlement will be
            depreciated. Prevention is worth more when your coverage pays less.
          </p>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-sm px-8 py-3.5 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 transition-all"
          >
            Find out what your carrier credits
          </a>
        </div>
      </div>
    </section>
  );
}
