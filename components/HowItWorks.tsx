const steps = [
  {
    number: "1",
    title: "15-minute phone assessment",
    description:
      "We review your home, plumbing layout, and current insurance carrier to confirm eligibility and recommend the right device.",
  },
  {
    number: "2",
    title: "2 hours on site",
    description:
      "A Texas-licensed RMP plumber installs the smart shutoff valve at your main water line. No drywall cuts, no mess.",
  },
  {
    number: "3",
    title: "Same-day certificate",
    description:
      "Your installation certificate is emailed to you and your insurance agent the same day. The discount applies immediately.",
  },
  {
    number: "4",
    title: "Annual renewal",
    description:
      "We reissue the certificate before each policy renewal so the credit stays applied. You never have to think about it.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-12">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="w-10 h-10 rounded-full bg-hydro-400 text-ink-950 font-bold flex items-center justify-center text-sm mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-fog-50 mb-2">{step.title}</h3>
              <p className="text-fog-300 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
