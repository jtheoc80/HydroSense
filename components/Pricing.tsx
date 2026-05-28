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
        <div className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
            Investment
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-5">
            Pricing
          </h2>
          <p className="text-fog-300 text-lg leading-relaxed">
            Every plan includes the certified install. Subscriptions add ongoing
            monitoring, annual renewal, and carrier liaison services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-7 lg:p-9 flex flex-col backdrop-blur-sm transition-all ${
                tier.badge
                  ? "bg-ink-800/80 border-2 border-hydro-400/30 shadow-lg shadow-hydro-400/5"
                  : "bg-ink-800/40 border border-ink-700/40"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-7 bg-hydro-400 text-ink-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-hydro-400/30">
                  {tier.badge}
                </div>
              )}
              <h3 className="font-display text-xl text-fog-50 mb-5">
                {tier.name}
              </h3>
              <div className="mb-8">
                <span className="font-mono text-4xl text-fog-50 tracking-tight">
                  ${tier.monthly}
                </span>
                <span className="text-fog-300 ml-1">/mo</span>
                <span className="text-fog-400 ml-3 text-sm">
                  or{" "}
                  <span className="font-mono text-fog-200">
                    ${tier.annual}
                  </span>
                  /yr
                </span>
              </div>
              <ul className="space-y-3.5 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-fog-200"
                  >
                    <svg
                      className="w-4 h-4 text-hydro-400 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#lead-form"
                className={`block text-center w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  tier.badge
                    ? "bg-hydro-400 text-ink-950 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300"
                    : "border border-fog-300/20 text-fog-100 hover:bg-white/5 hover:border-fog-300/30"
                }`}
              >
                Get started
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-fog-400 text-sm mt-10">
          Subscription optional. Installs from{" "}
          <span className="font-mono text-signal-400">$999</span> standalone.
        </p>
      </div>
    </section>
  );
}
