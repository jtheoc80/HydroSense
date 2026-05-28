const forms = [
  {
    name: "HO-A (Basic)",
    coverage: "Actual Cash Value",
    description:
      "Covers 10 named perils only. Claims settle at depreciated value, not replacement cost. A 15-year-old water heater that fails is valued at what a 15-year-old water heater is worth, not what a new one costs.",
    example:
      "A burst supply line causing $18,000 in damage settles at $6,000 after depreciation. You cover the $12,000 gap out of pocket.",
    verdict: "Least coverage. Lowest premium. Largest out-of-pocket exposure.",
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
  },
];

export default function InsuranceForms() {
  return (
    <section id="insurance-forms" className="py-20 lg:py-28">
      <div className="section-container">
        <p className="text-xs uppercase tracking-widest text-hydro-400 mb-4">
          Know your policy
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-4">
          HO-A vs HO-B vs HO-3: what your Texas policy actually covers
        </h2>
        <p className="text-fog-300 mb-12 max-w-3xl">
          Most Texas homeowners do not know which form they are on. The form
          determines whether a water damage claim settles at replacement cost or
          depreciated value. That single distinction can mean a $12,000
          difference on one event.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.name}
              className="bg-ink-800 border border-ink-700 rounded-xl p-6 lg:p-8 flex flex-col"
            >
              <h3 className="font-display text-xl text-fog-50 mb-1">
                {form.name}
              </h3>
              <p className="text-sm font-mono text-hydro-400 mb-4">
                {form.coverage}
              </p>
              <p className="text-fog-200 text-sm leading-relaxed mb-4 flex-1">
                {form.description}
              </p>
              <div className="bg-ink-900/50 rounded-lg p-4 mb-4">
                <p className="text-xs uppercase tracking-wider text-fog-400 mb-1">
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

        <div className="mt-8 bg-ink-800 border-l-4 border-l-signal-400 rounded-r-lg p-6">
          <p className="text-fog-50 font-semibold mb-2">
            The smart shutoff discount applies on all three forms.
          </p>
          <p className="text-fog-300 text-sm leading-relaxed">
            Regardless of whether you carry HO-A, HO-B, or HO-3, the
            carrier-recognized certificate qualifies you for the water-damage
            credit. But if you are on HO-A, the device protection itself is
            even more critical because your claim settlement will be
            depreciated. Prevention is worth more when your coverage pays less.
          </p>
        </div>

        <div className="mt-6 text-center">
          <a href="#lead-form" className="btn-primary text-sm">
            Find out what your carrier credits
          </a>
        </div>
      </div>
    </section>
  );
}
