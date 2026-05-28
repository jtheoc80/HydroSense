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
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-12">
          What no one is telling Texas homeowners
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {statements.map((s, i) => (
            <article
              key={i}
              className="bg-ink-800 border-l-4 border-l-hydro-400 rounded-r-lg p-6 lg:p-8 flex flex-col"
            >
              <p className="font-display text-xl lg:text-2xl text-fog-50 leading-snug flex-1">
                {s.headline}
              </p>
              <p className="mt-6 text-xs uppercase tracking-wider text-fog-300">
                {s.source}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#lead-form" className="btn-outline text-sm">
            Stop leaving money on the table
          </a>
        </div>
      </div>
    </section>
  );
}
