import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CriticalBar from "@/components/CriticalBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/catalyst/badge";
import { Button } from "@/components/catalyst/button";
import { commercialGuides, guideCategories } from "@/lib/guides/commercial-guides";

export const metadata: Metadata = {
  title: { absolute: "Smart Water Shutoff Buying Guides | HydroSense Texas" },
  description:
    "HydroSense answers the cost, sizing, device-selection, installation, and outage questions Greater Houston homeowners need resolved before requesting a proposal.",
  alternates: { canonical: "https://hydrosensetx.com/guides" },
  openGraph: {
    title: "Smart Water Shutoff Buying Guides | HydroSense Texas",
    description:
      "Commercial decision guides for smart shutoff cost, sizing, device fit, professional installation, and outage behavior.",
    url: "https://hydrosensetx.com/guides",
    siteName: "HydroSense Texas",
    type: "website",
  },
};

export default function GuidesPage() {
  return (
    <>
      <CriticalBar />
      <Header />
      <main className="bg-white text-slate-950">
        <div className="bg-[#00163f] pt-8">
          <div className="section-container">
            <Breadcrumbs
              trailId="guides"
              tone="dark"
              items={[
                { name: "Home", href: "/" },
                { name: "Guides", href: "/guides" },
              ]}
            />
          </div>
        </div>

        <section className="relative overflow-hidden bg-[#00163f] py-20 text-white sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute -right-44 -top-52 h-[34rem] w-[34rem] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="section-container relative">
            <Badge color="sky" className="!rounded-full !bg-sky-300/10 !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em] !text-sky-200">
              Homeowner decision center
            </Badge>
            <h1 className="mt-6 max-w-5xl text-balance font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Smart water shutoff buying and installation guides
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              These guides answer the questions HydroSense homeowners typically need resolved before choosing a device or requesting an installation proposal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/guides/smart-water-shutoff-installation-cost-houston" color="cyan" className="!rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-sm !font-semibold !text-ink-950 hover:!bg-hydro-300">
                Start with installation cost
              </Button>
              <Button href="/#lead-form" outline className="!rounded-full !border-white/25 !bg-white/5 !px-6 !py-3.5 !text-sm !font-semibold !text-white hover:!bg-white/10">
                Request compatibility review
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="section-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Five pre-purchase answers</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e] sm:text-5xl">
                Resolve price, fit, installation, and reliability before choosing hardware.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Each answer is visible, catalog- or device-governed where appropriate, and connected to the page that confirms the next commercial decision.
              </p>
            </div>

            <div className="mt-12 space-y-5">
              {guideCategories.map((category, index) => {
                const guides = commercialGuides.filter((guide) => guide.category === category);
                return (
                  <section key={category} aria-labelledby={`guide-category-${index}`} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:grid-cols-[0.32fr_0.68fr] lg:gap-10 lg:p-10">
                    <div>
                      <p className="font-mono text-xs font-semibold text-sky-700">0{index + 1}</p>
                      <h2 id={`guide-category-${index}`} className="mt-3 font-display text-3xl text-[#001a4e]">{category}</h2>
                    </div>
                    <div className="grid gap-4">
                      {guides.map((guide) => (
                        <Link key={guide.href} href={guide.href} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-sky-300 hover:shadow-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">{guide.eyebrow}</p>
                          <h3 className="mt-2 text-xl font-semibold text-[#001a4e] transition group-hover:text-sky-700">{guide.title} →</h3>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{guide.metaDescription}</p>
                          <p className="mt-4 text-sm font-medium text-slate-500">Primary question: {guide.directQuestion}</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#f7fbff] py-16 sm:py-20">
          <div className="section-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">HydroSense authority boundary</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e]">Answers grounded in the actual proposal workflow.</h2>
            </div>
            <div className="grid gap-5 text-sm leading-7 text-slate-600 sm:grid-cols-2">
              <p className="rounded-2xl border border-slate-200 bg-white p-6"><strong className="block text-[#001a4e]">HydroSense facts</strong> Pricing, scope, license, service area, and handoff details come from the governed catalog and workflow.</p>
              <p className="rounded-2xl border border-slate-200 bg-white p-6"><strong className="block text-[#001a4e]">Manufacturer facts</strong> Technical behavior is limited to current governed device data and official manufacturer sources.</p>
              <p className="rounded-2xl border border-slate-200 bg-white p-6"><strong className="block text-[#001a4e]">Property review</strong> Pipe size, material, valves, clearance, power, connectivity, and device compatibility are confirmed before proposal.</p>
              <p className="rounded-2xl border border-slate-200 bg-white p-6"><strong className="block text-[#001a4e]">Scope boundary</strong> Domestic household water is standard. Irrigation is separately reviewed and quoted; fire-suppression piping is excluded.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#00163f] py-16 text-white sm:py-20">
          <div className="section-container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Ready for the property-specific answer?</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] sm:text-5xl">Request a compatibility review and written proposal.</h2>
            </div>
            <Button href="/#lead-form" color="cyan" className="!shrink-0 !rounded-full !border-transparent !bg-hydro-400 !px-7 !py-3.5 !text-sm !font-semibold !text-ink-950 hover:!bg-hydro-300">
              Check my home
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
