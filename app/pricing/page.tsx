import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CriticalBar from "@/components/CriticalBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/catalyst/badge";
import { Button } from "@/components/catalyst/button";
import {
  activeServices,
  formatUsd,
  installationServices,
  serviceCatalog,
} from "@/lib/service-catalog/catalog";
import { buildPricingJsonLd } from "@/lib/service-catalog/schema";

export const metadata: Metadata = {
  title: "Smart Water Shutoff Installation Pricing Houston",
  description:
    "See device-included smart water shutoff installation rates by incoming line size, fixed compatible add-ons, and quote-required scope in Greater Houston.",
  alternates: { canonical: "https://hydrosensetx.com/pricing" },
};

const lineSizeLabels = {
  "0.75": "3/4 inch",
  "1.00": "1 inch",
  "1.25": "1 1/4 inch",
  "1.50": "1 1/2 inch",
  "2.00": "2 inch",
} as const;

const machineLinks = [
  ["Service catalog", "/service-catalog.json", "Stable JSON catalog"],
  ["OpenAPI 3.1", "/openapi.json", "Public REST contract"],
  ["Agent Card", "/.well-known/agent-card.json", "A2A v1.0 discovery"],
  ["Agent-ready guide", "/agent-ready", "Authority and input model"],
] as const;

export default function PricingPage() {
  const addOns = activeServices.filter(
    (service) => service.category === "add_on" || service.category === "care",
  );
  const assessment = activeServices.find((service) => service.category === "assessment");
  const quoteRequired = activeServices.filter((service) => service.price.type === "quote_required");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPricingJsonLd()) }}
      />
      <CriticalBar />
      <Header />
      <main className="bg-white text-slate-950">
        <div className="bg-[#00163f] pt-8">
          <div className="section-container">
            <Breadcrumbs
              trailId="pricing"
              tone="dark"
              items={[
                { name: "Home", href: "/" },
                { name: "Pricing", href: "/pricing" },
              ]}
            />
          </div>
        </div>
        <section className="relative overflow-hidden bg-[#00163f] py-20 text-white sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute -right-44 -top-52 h-[34rem] w-[34rem] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="section-container relative">
            <Badge color="sky" className="!rounded-full !bg-sky-300/10 !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em] !text-sky-200">
              Public catalog {serviceCatalog.catalogVersion}
            </Badge>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <h1 className="max-w-4xl text-balance font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                Smart water shutoff installation pricing by incoming line size.
              </h1>
              <div>
                <p className="text-lg leading-8 text-slate-300">
                  Every published rate includes one compatible smart shutoff device and standard domestic-water installation. No separate standard device charge is added.
                </p>
                <Button href="/#lead-form" color="cyan" className="!mt-7 !rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-sm !font-semibold !text-ink-950 hover:!bg-hydro-300">
                  Request a written proposal
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="section-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Device + standard installation</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e] sm:text-5xl">Published line-size rates</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Incoming line size must be verified. A final written proposal confirms access, pipework, power, Wi-Fi, routing, and non-standard conditions.
              </p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
              {installationServices.map((service) => (
                <article id={service.id.toLowerCase()} key={service.id} className="bg-white p-6 sm:p-7">
                  <p className="font-mono text-xs font-medium text-slate-500">{service.id}</p>
                  <h3 className="mt-5 font-display text-3xl text-[#001a4e]">{lineSizeLabels[service.incomingLineSize]}</h3>
                  <p className="mt-4 font-mono text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                    {service.price.type === "fixed" ? formatUsd(service.price.amount) : null}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {service.commercialGradeDeviceIncluded
                      ? "Commercial-grade smart shutoff included"
                      : "Compatible smart shutoff included"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
          <div className="section-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Published options</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e]">Fixed add-ons and a free first step.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Confirmed sensors and battery backup may enter the one-time project total. Optional annual care is recurring at $99/year and is always shown separately.
              </p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {addOns.map((service) => (
                <div id={service.id.toLowerCase()} key={service.id} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  <div>
                    <h3 className="font-semibold text-slate-950">{service.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{service.description}</p>
                  </div>
                  <p className="font-mono text-xl font-semibold text-[#001a4e]">
                    {service.price.type === "fixed" ? `${formatUsd(service.price.amount)} / ${service.price.unit}` : null}
                  </p>
                </div>
              ))}
              {assessment && assessment.price.type === "fixed" && (
                <div id={assessment.id.toLowerCase()} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  <div>
                    <h3 className="font-semibold text-slate-950">{assessment.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{assessment.description}</p>
                  </div>
                  <p className="font-mono text-xl font-semibold text-emerald-700">{formatUsd(assessment.price.amount)}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="section-container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Written quote required</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e]">Variables that are not autoquoted.</h2>
              <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                {quoteRequired.map((service) => (
                  <div key={service.id} className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-semibold text-slate-950">{service.name}</h3>
                      <span className="font-mono text-xs text-amber-700">Quote required</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-600">
                Travel, after-hours work, permits, taxes, electrical changes, dual mains, inaccessible routing, corrective repair, and non-standard pipework are reviewed in the final proposal—not guessed by the public estimator.
              </p>
            </div>
            <div className="rounded-[2rem] bg-[#00163f] p-7 text-white sm:p-9 lg:p-11">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Scope boundary</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em]">Domestic water only.</h2>
              <div className="mt-8 space-y-6 text-sm leading-7 text-slate-300">
                <p><strong className="text-white">Included:</strong> {serviceCatalog.policies.standardScope}</p>
                <p><strong className="text-white">Irrigation:</strong> Optional only when specifically requested, technically reviewed, and quoted.</p>
                <p><strong className="text-white">Always excluded:</strong> {serviceCatalog.policies.fireSuppressionExclusion}</p>
                <p><strong className="text-white">Authority:</strong> Assessment-only next steps. A final written proposal is required before work.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
          <div className="section-container">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Plan the installation</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl tracking-[-0.025em] text-[#001a4e]">
              Confirm the process, device fit, and service coverage before requesting a proposal.
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/#customer-journey" outline className="!rounded-full !border-slate-300 !px-5 !py-3 !text-[#001a4e]">
                Review the installation process
              </Button>
              <Button href="/devices" outline className="!rounded-full !border-slate-300 !px-5 !py-3 !text-[#001a4e]">
                Compare compatible smart shutoff devices
              </Button>
              <Button href="/service-area" outline className="!rounded-full !border-slate-300 !px-5 !py-3 !text-[#001a4e]">
                Check Greater Houston service areas
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#f7fbff] py-16 sm:py-20">
          <div className="section-container">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Machine-readable pricing</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl tracking-[-0.025em] text-[#001a4e]">The same catalog, without a second price list.</h2>
            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {machineLinks.map(([label, href, note]) => (
                <a key={href} href={href} className="group bg-white p-6 transition hover:bg-sky-50">
                  <span className="font-semibold text-[#001a4e] group-hover:text-sky-700">{label} →</span>
                  <span className="mt-2 block text-sm text-slate-500">{note}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
