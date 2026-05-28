const tiers = [
  {
    name: "Basic",
    monthly: 9,
    annual: 99,
    badge: null,
    features: [
      "Smart shutoff device installed",
      "Installation certificate issued",
      "Certificate sent to your agent",
      "Email support",
    ],
  },
  {
    name: "Standard",
    monthly: 19,
    annual: 199,
    badge: "Most homes pick this",
    features: [
      "Everything in Basic",
      "Annual certificate renewal",
      "24/7 leak monitoring alerts",
      "Priority scheduling",
      "Phone and email support",
    ],
  },
  {
    name: "Premier",
    monthly: 39,
    annual: 399,
    badge: null,
    features: [
      "Everything in Standard",
      "Annual device inspection",
      "Insurance liaison service",
      "Warranty extension coverage",
      "Dedicated account manager",
      "Same-day emergency response",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="section-container">
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-4">
          Pricing
        </h2>
        <p className="text-fog-300 mb-12 max-w-2xl">
          Every plan includes the certified install. Subscriptions add ongoing monitoring,
          annual renewal, and carrier liaison services.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-ink-800 rounded-xl p-6 lg:p-8 border ${
                tier.badge
                  ? "border-hydro-400"
                  : "border-ink-700"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-6 bg-hydro-400 text-ink-950 text-xs font-bold px-3 py-1 rounded-full">
                  {tier.badge}
                </div>
              )}
              <h3 className="text-xl font-semibold text-fog-50 mb-4">{tier.name}</h3>
              <div className="mb-6">
                <span className="font-mono text-3xl text-fog-50">${tier.monthly}</span>
                <span className="text-fog-300">/mo</span>
                <span className="text-fog-300 ml-2">
                  or <span className="font-mono text-fog-100">${tier.annual}</span>/yr
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-fog-200">
                    <svg
                      className="w-4 h-4 text-hydro-400 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#lead-form"
                className={`block text-center w-full py-3 rounded-lg font-semibold transition-colors ${
                  tier.badge
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                Get started
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-fog-300 text-sm mt-8">
          Subscription optional. Installs from{" "}
          <span className="font-mono text-fog-100">$999</span> standalone.
        </p>
      </div>
    </section>
  );
}
