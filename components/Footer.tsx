const serviceAreas = [
  "Houston",
  "The Woodlands",
  "Sugar Land",
  "Katy / Cinco Ranch",
  "Cypress",
  "Spring",
  "League City",
  "Surrounding Texas Metro",
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-ink-700/50 py-12">
      <div className="section-container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-display text-xl text-fog-50 mb-2">HydroSense</p>
            <p className="text-sm text-fog-300 mb-4">
              Licensed Texas smart water shutoff installs. Carrier-recognized certificates
              that earn homeowners insurance credits.
            </p>
            <a
              href="tel:+18889999999"
              className="text-hydro-400 hover:text-hydro-300 transition-colors text-sm font-medium"
            >
              (888) 999-9999
            </a>
          </div>

          {/* Service areas */}
          <div>
            <p className="text-sm font-semibold text-fog-50 mb-3">Service Area</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {serviceAreas.map((area) => (
                <span key={area} className="text-sm text-fog-300">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-semibold text-fog-50 mb-3">Quick Links</p>
            <div className="flex flex-col gap-2">
              <a href="#savings-estimator" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Savings Calculator
              </a>
              <a href="#pricing" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                FAQ
              </a>
              <a href="#lead-form" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Get a Quote
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-700/50 pt-8">
          <p className="text-xs text-fog-300 leading-relaxed mb-4">
            Savings estimates are illustrative and based on published carrier discount tiers
            for automatic water shutoff devices. Actual discount varies by carrier, policy
            structure, and underwriting. HydroSense is a service of Lead Ledger Pro LLC.
            Texas RMP licensed installation.
          </p>
          <p className="text-xs text-fog-300">
            Copyright {new Date().getFullYear()} Lead Ledger Pro LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
