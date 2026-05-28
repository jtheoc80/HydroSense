import Image from "next/image";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";

const serviceAreas = [
  { name: "Houston", href: "/service-area/houston" },
  { name: "Katy", href: "/service-area/katy" },
  { name: "Cypress", href: "/service-area/cypress" },
  { name: "The Woodlands", href: "/service-area/the-woodlands" },
  { name: "Sugar Land", href: "/service-area/sugar-land" },
  { name: "Spring", href: "/service-area/spring" },
  { name: "Baytown", href: "/service-area/baytown" },
];

export default function Footer() {
  const gbpUrl = process.env.GOOGLE_BUSINESS_PROFILE_URL;

  return (
    <footer className="bg-ink-950 border-t border-ink-700/30">
      {/* Accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-hydro-400/40 to-transparent" />

      <div className="section-container py-16 lg:py-20">
        <div className="grid md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Image
              src="/brand/logo-horizontal-light.png"
              alt="HydroSense Texas"
              width={200}
              height={50}
              className="h-12 w-auto mb-5"
            />
            <p className="text-sm text-fog-300 leading-relaxed mb-5">
              Licensed Texas smart water shutoff installs. Carrier-recognized
              certificates that earn homeowners insurance credits.
            </p>
            <a
              href="tel:+12816945754"
              className="text-hydro-400 hover:text-hydro-300 transition-colors text-sm font-semibold"
            >
              (281) 694-5754
            </a>
            {gbpUrl && (
              <a
                href={gbpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-fog-400 hover:text-fog-200 transition-colors mt-2"
              >
                Find us on Google
              </a>
            )}
          </div>

          {/* Service Area */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fog-400 font-medium mb-5">
              Service Area
            </p>
            <div className="flex flex-col gap-2.5">
              {serviceAreas.map((area) => (
                <a
                  key={area.name}
                  href={area.href}
                  className="text-sm text-fog-300 hover:text-fog-50 transition-colors"
                >
                  {area.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fog-400 font-medium mb-5">
              Quick Links
            </p>
            <div className="flex flex-col gap-2.5">
              <a href="#savings-estimator" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Savings Calculator
              </a>
              <a href="#the-certificate" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                The Certificate
              </a>
              <a href="#insurance-forms" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Insurance Forms Guide
              </a>
              <a href="/devices" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Devices We Install
              </a>
              <a href="#pricing" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Get Started */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fog-400 font-medium mb-5">
              Get Started
            </p>
            <p className="text-sm text-fog-300 leading-relaxed mb-5">
              15-minute phone assessment, same-week install, same-day
              certificate.
            </p>
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-sm px-6 py-3 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 transition-all"
            >
              Get a Quote
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-700/30 pt-8 space-y-4">
          <p className="text-xs text-fog-400 leading-relaxed max-w-3xl">
            Savings estimates are illustrative and based on published carrier
            discount tiers for automatic water shutoff devices. Actual discount
            varies by carrier, policy structure, and underwriting. HydroSense
            Texas is a service of Lead Ledger Pro LLC.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-fog-300 font-medium">
              Texas Registered Master Plumber. Master Plumber License {MASTER_PLUMBER_LICENSE}.
            </p>
            <p className="text-xs text-fog-400">
              Copyright {new Date().getFullYear()} Lead Ledger Pro LLC. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
