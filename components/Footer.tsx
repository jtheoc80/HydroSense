import Image from "next/image";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";
import TrackedPhoneLink from "./TrackedPhoneLink";

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

const quickLinks = [
  { name: "How it works", href: "/#customer-journey" },
  { name: "Devices we install", href: "/devices" },
  { name: "Service areas", href: "/service-area" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
  { name: "Guides", href: "/blog" },
  { name: "Privacy policy", href: "/privacy" },
  { name: "Terms of service", href: "/terms" },
];

export default function Footer() {
  const gbpUrl = process.env.GOOGLE_BUSINESS_PROFILE_URL;
  const facebookUrl = process.env.FACEBOOK_URL;

  return (
    <footer className="border-t border-ink-700/30 bg-ink-950">
      <div className="h-px bg-gradient-to-r from-transparent via-hydro-400/40 to-transparent" />

      <div className="section-container py-16 lg:py-20">
        <div className="mb-12 grid gap-10 md:grid-cols-4 lg:gap-12">
          <div>
            <Image
              src="/brand/logo-horizontal-light.png"
              alt="HydroSense Texas"
              width={200}
              height={50}
              className="mb-5 h-12 w-auto"
            />
            <p className="mb-5 text-sm leading-relaxed text-fog-300">
              Professional whole-home smart water shutoff installation,
              configuration, testing, and homeowner handoff across Greater Houston.
            </p>
            <TrackedPhoneLink
              trackingLocation="footer"
              className="text-sm font-semibold text-hydro-400 transition-colors hover:text-hydro-300"
            >
              (281) 694-5754
            </TrackedPhoneLink>
            {gbpUrl && (
              <a href={gbpUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-fog-400 transition-colors hover:text-fog-200">
                Find HydroSense on Google
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-fog-400 transition-colors hover:text-fog-200">
                Follow HydroSense on Facebook
              </a>
            )}
          </div>

          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-fog-400">
              <a href="/service-area" className="transition-colors hover:text-fog-200">Service areas</a>
            </p>
            <div className="flex flex-col gap-2.5">
              {serviceAreas.map((area) => (
                <a key={area.name} href={area.href} className="text-sm text-fog-300 transition-colors hover:text-fog-50">
                  {area.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-fog-400">Quick links</p>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-fog-300 transition-colors hover:text-fog-50">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-fog-400">Get started</p>
            <p className="mb-5 text-sm leading-relaxed text-fog-300">
              Submit your ZIP code and contact information. We will review the
              home requirements and provide a written proposal before scheduling.
            </p>
            <a href="/#lead-form" className="inline-flex items-center justify-center rounded-lg bg-hydro-400 px-6 py-3 text-sm font-semibold text-ink-950 shadow-lg shadow-hydro-400/20 transition-all hover:bg-hydro-300">
              Check availability
            </a>
          </div>
        </div>

        <div className="space-y-4 border-t border-ink-700/30 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-fog-400">
            Insurance incentives vary by insurer, policy, approved device, and
            underwriting requirements. HydroSense does not guarantee a premium
            discount. Confirm eligibility with your insurance agent before purchase.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-fog-300">
              Work coordinated under Texas Master Plumber License {MASTER_PLUMBER_LICENSE}.
            </p>
            <p className="text-xs text-fog-400">
              Copyright {new Date().getFullYear()} Lead Ledger Pro LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
