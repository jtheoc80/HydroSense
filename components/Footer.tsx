import Image from "next/image";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";
import PhoneLink from "@/components/PhoneLink";

const serviceAreas = [
  { name: "Houston", href: "/service-area/houston" },
  { name: "Katy", href: "/service-area/katy" },
  { name: "Cypress", href: "/service-area/cypress" },
  { name: "The Woodlands", href: "/service-area/the-woodlands" },
  { name: "Sugar Land", href: "/service-area/sugar-land" },
  { name: "Spring", href: "/service-area/spring" },
  { name: "Baytown", href: "/service-area/baytown" },
  { name: "Galveston", href: "/service-area/galveston" },
  { name: "Lake Conroe", href: "/service-area/lake-conroe" },
  { name: "Lake Livingston", href: "/service-area/lake-livingston" },
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
            <PhoneLink className="text-hydro-400 hover:text-hydro-300 transition-colors text-sm font-semibold" />
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

            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              <p className="text-xs uppercase tracking-[0.15em] text-fog-400 font-medium">
                Follow us
              </p>
              <a
                href="https://www.facebook.com/share/1BTbBn6UZo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HydroSense on Facebook"
                className="text-fog-400 hover:text-hydro-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[22px] h-[22px]"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.yelp.com/biz/hydrosense-houston"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HydroSense on Yelp"
                className="text-fog-400 hover:text-hydro-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[22px] h-[22px]"
                  aria-hidden="true"
                >
                  <path d="M11.088 8.832V3.723c0-.927.362-1.6 1.073-1.697.295-.04.616.072.86.306.168.161 3.27 4.209 3.27 4.209a1.07 1.07 0 0 1-.084 1.44 1.07 1.07 0 0 1-.595.302s-3.452.702-3.737.743c-.768.112-1.322-.178-1.322-1.078 0-.393.535-3.116.535-3.116zm1.31 4.15c-.358-.78.076-1.382.847-1.572l3.68-.906a1.07 1.07 0 0 1 1.248.565 1.07 1.07 0 0 1 .067.442s-.32 3.83-.378 4.137c-.125.67-.578 1.017-1.212.87-.33-.077-3.44-2.338-3.746-2.551a1.34 1.34 0 0 1-.506-.985zm-1.2 1.538c.373-.77 1.02-.883 1.69-.43.35.237 2.825 2.558 3.05 2.78.487.48.546 1.07.116 1.558-.224.254-3.594 2.78-3.907 2.998-.68.472-1.29.334-1.627-.337-.156-.31-.586-3.944-.647-4.308a1.34 1.34 0 0 1 .104-.856c.072-.157.133-.262.22-.405zm-2.094-.186c.86-.036 1.278.455 1.278 1.244 0 .413-.2 4.095-.24 4.444-.088.76-.483 1.196-1.18 1.152-.363-.023-4.6-1.682-4.877-1.806a1.07 1.07 0 0 1-.577-1.2 1.07 1.07 0 0 1 .3-.538s3.79-2.69 4.1-2.895c.382-.252.767-.38 1.196-.401zm-.88-2.278c.008.86-.49 1.318-1.273 1.2-.408-.062-3.946-1.198-4.274-1.312-.713-.248-1.004-.797-.815-1.487.098-.36 2.382-4.31 2.596-4.65a1.07 1.07 0 0 1 1.388-.377 1.07 1.07 0 0 1 .403.369s1.716 4.483 1.855 4.862c.14.382.128.632.12 1.395z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Service Area */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fog-400 font-medium mb-5">
              <a href="/service-area" className="hover:text-fog-200 transition-colors">Service Area</a>
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
              <a href="/#savings-estimator" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Savings Calculator
              </a>
              <a href="/#the-certificate" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                The Certificate
              </a>
              <a href="/#insurance-forms" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Insurance Forms Guide
              </a>
              <a href="/devices" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Devices We Install
              </a>
              <a href="/freeze-damage-texas" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Freeze Damage Guide
              </a>
              <a href="/insurance/ho-a-vs-ho-b-ho-3" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                HO-A vs HO-B vs HO-3
              </a>
              <a href="/#pricing" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Pricing
              </a>
              <a href="/#faq" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                FAQ
              </a>
              <a href="/blog" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Blog
              </a>
              <a href="/privacy" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-fog-300 hover:text-fog-50 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Get Started */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-fog-400 font-medium mb-5">
              Get Started
            </p>
            <p className="text-sm text-fog-300 leading-relaxed mb-5">
              15-minute phone assessment, same-week install, certificate
              in paper and digital form after final payment.
            </p>
            <a
              href="/#lead-form"
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
