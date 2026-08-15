import Image from "next/image";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";
import { Button } from "./catalyst/button";
import TrackedPhoneLink from "./TrackedPhoneLink";

const serviceAreas = [
  { name: "Houston", href: "/service-area/houston" },
  { name: "Katy", href: "/service-area/katy" },
  { name: "Cypress", href: "/service-area/cypress" },
  { name: "The Woodlands", href: "/service-area/the-woodlands" },
  { name: "League City", href: "/service-area/league-city" },
  { name: "Pearland", href: "/service-area/pearland" },
  { name: "Friendswood", href: "/service-area/friendswood" },
  { name: "Sugar Land", href: "/service-area/sugar-land" },
  { name: "Spring", href: "/service-area/spring" },
  { name: "Baytown", href: "/service-area/baytown" },
  { name: "Galveston", href: "/service-area/galveston" },
];

const quickLinks = [
  { name: "How it works", href: "/#customer-journey" },
  { name: "Devices we install", href: "/devices" },
  { name: "Service areas", href: "/service-area" },
  { name: "Pricing", href: "/pricing" },
  { name: "Agent-ready", href: "/agent-ready" },
  { name: "FAQ", href: "/#faq" },
  { name: "Blog", href: "/blog" },
  { name: "Privacy policy", href: "/privacy" },
  { name: "Terms of service", href: "/terms" },
];

export default function Footer() {
  const gbpUrl = process.env.GOOGLE_BUSINESS_PROFILE_URL;
  const facebookUrl = process.env.FACEBOOK_URL;

  return (
    <footer className="bg-[#000f2d] text-white">
      <div className="section-container pt-16 sm:pt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-400 to-cyan-300 p-7 text-[#001a4e] shadow-[0_30px_80px_-45px_rgba(56,189,248,0.75)] sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/40" />
          <div className="pointer-events-none absolute -right-2 -top-12 h-72 w-72 rounded-full border border-white/25" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#001a4e]/70">Start with the property</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
              Confirm the home is ready for a smart shutoff installation.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#001a4e]/75">
              Submit the ZIP code and contact details. HydroSense will review service availability
              and the conditions that affect device selection, scope, and price.
            </p>
          </div>
          <div className="relative mt-7 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
            <Button href="/#lead-form" color="dark" className="!rounded-full !border-transparent !bg-[#001a4e] !px-6 !py-3.5 !text-sm !font-semibold !text-white !shadow-lg hover:!bg-[#002469]">
              Check availability
            </Button>
            <TrackedPhoneLink trackingLocation="footer_cta" className="inline-flex items-center justify-center rounded-full border border-[#001a4e]/20 bg-white/35 px-6 py-3.5 text-sm font-semibold text-[#001a4e] backdrop-blur transition hover:bg-white/55">
              Call (281) 694-5754
            </TrackedPhoneLink>
          </div>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-4 lg:gap-14 lg:py-16">
          <div>
            <Image
              src="/brand/logo-horizontal-light.png"
              alt="HydroSense Texas"
              width={200}
              height={50}
              className="mb-5 h-11 w-auto"
            />
            <p className="text-sm leading-7 text-slate-400">
              Professional whole-home domestic-water shutoff installation,
              configuration, testing, and homeowner handoff across Greater Houston.
            </p>
            <TrackedPhoneLink trackingLocation="footer" className="mt-5 inline-flex text-sm font-semibold text-sky-300 transition hover:text-white">
              (281) 694-5754
            </TrackedPhoneLink>
            {gbpUrl && (
              <a href={gbpUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-slate-500 transition hover:text-slate-300">
                HydroSense on Google
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-slate-500 transition hover:text-slate-300">
                HydroSense on Facebook
              </a>
            )}
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Service areas</p>
            <div className="grid gap-2.5">
              {serviceAreas.map((area) => (
                <a key={area.name} href={area.href} className="text-sm text-slate-400 transition hover:text-white">
                  {area.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</p>
            <div className="grid gap-2.5">
              {quickLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Installation standard</p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-semibold text-white">Scope before scheduling</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The domestic water line is the standard scope. Fire-sprinkler and
                fire-suppression piping are excluded. Irrigation is included only when
                specifically requested, reviewed, and quoted in the written proposal.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-7">
          <p className="max-w-4xl text-xs leading-5 text-slate-500">
            Insurance incentives vary by insurer, policy, approved device, and underwriting requirements.
            HydroSense does not guarantee a premium discount. Confirm eligibility with your insurance agent before purchase.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-slate-400">
              Work coordinated under Texas Master Plumber License {MASTER_PLUMBER_LICENSE}.
            </p>
            <p className="text-xs text-slate-500">
              Copyright {new Date().getFullYear()} Lead Ledger Pro LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
