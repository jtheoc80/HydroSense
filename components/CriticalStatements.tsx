import CriticalDataPanel from "./CriticalDataPanel";

const statements = [
  {
    headline:
      "Texas home insurance climbed 46% in two years and Houston is the bullseye.",
    source: "Policygenius pricing analysis, May 2022 to May 2024",
  },
  {
    headline:
      "Average Houston household pays $6,600 a year. A 10-15% water-damage credit puts $300 to $600 back in your pocket, every year you stay insured.",
    source: "Rice Kinder Institute, 2025 State of Housing",
  },
  {
    headline:
      "10+ major Texas carriers actively reward smart shutoff installs. The discount applies the moment the certificate is on file. Most homeowners earn back the install inside 24 months.",
    source: "Texas Department of Insurance rate filings",
  },
];

export default function CriticalStatements() {
  return (
    <section id="critical-statements" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-4">
            The numbers
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50">
            What no one is telling Texas homeowners
          </h2>
        </div>

        <div className="grid lg:grid-cols-[58fr_42fr] gap-8 lg:gap-10">
          {/* Left column: statement cards stacked */}
          <div className="flex flex-col gap-6">
            {statements.map((s, i) => (
              <article
                key={i}
                className="bg-ink-800/40 border-l-4 border-l-hydro-400 rounded-r-xl p-7 lg:p-9 flex flex-col backdrop-blur-sm"
              >
                <p className="font-display text-xl lg:text-2xl text-fog-50 leading-snug flex-1">
                  {s.headline}
                </p>
                <p className="mt-8 text-xs uppercase tracking-[0.15em] text-fog-400">
                  {s.source}
                </p>
              </article>
            ))}
          </div>

          {/* Right column: sticky data panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <CriticalDataPanel />
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-lg border border-fog-300/20 text-fog-100 font-medium text-sm px-8 py-3.5 hover:bg-white/5 hover:border-fog-300/30 transition-all"
          >
            Stop leaving money on the table
          </a>
        </div>
      </div>
    </section>
  );
}
