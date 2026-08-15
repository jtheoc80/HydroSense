import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, cityKeys } from "@/lib/cities";
import Breadcrumbs from "@/components/Breadcrumbs";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import TrackedPhoneLink from "@/components/TrackedPhoneLink";
import CityViewEvent from "./CityViewEvent";
import { installationScopeDisclosure } from "@/lib/installation-scope";

export function generateStaticParams() {
  return cityKeys.map((city) => ({ city }));
}

interface PageProps {
  params: { city: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const city = cities[params.city];
  if (!city) return {};

  const title = `Smart Water Shutoff Installation in ${city.name}, TX`;
  const description = `Professional Flo by Moen, Phyn Plus, and StreamLabs smart water shutoff installation in ${city.name}, Texas. App setup, shutoff testing, and installation records. Call (281) 694-5754.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hydrosensetx.com/service-area/${city.slug}`,
    },
    openGraph: {
      title: `${title} | HydroSense Texas`,
      description,
      url: `https://hydrosensetx.com/service-area/${city.slug}`,
      siteName: "HydroSense Texas",
      type: "website",
    },
  };
}

export default function CityPage({ params }: PageProps) {
  const city = cities[params.city];
  if (!city) notFound();

  const localFaqs = [
    {
      q: `Does HydroSense install throughout ${city.name}?`,
      a: `HydroSense serves the listed ${city.name} ZIP codes and nearby areas when crew availability and the property configuration allow. Submit the property ZIP code so we can confirm current coverage before scheduling.`,
    },
    {
      q: `What is reviewed before a ${city.name} installation?`,
      a: `We review domestic-line access, pipe size and material, valve condition, nearby power, Wi-Fi coverage, and any leaks that require repair before installation. ${installationScopeDisclosure}`,
    },
    {
      q: "Will the installation qualify for an insurance discount?",
      a: "Some insurers offer an incentive for approved automatic water shutoff systems, but eligibility varies by insurer, policy, device, and documentation requirement. Confirm the requirement with your agent before purchasing for a discount. HydroSense does not guarantee eligibility or savings.",
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Smart water shutoff installation in ${city.name}, Texas`,
    serviceType: "Whole-home domestic water shutoff installation",
    provider: { "@id": "https://hydrosensetx.com/#business" },
    areaServed: { "@type": "City", name: city.name },
    url: `https://hydrosensetx.com/service-area/${city.slug}`,
    description: `Professional smart water shutoff installation on the home's domestic water line, app setup, shutoff testing, and homeowner handoff in ${city.name}, Texas. Fire-sprinkler and fire-suppression piping are excluded.`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CityViewEvent cityName={city.name} />
      <CriticalBar />
      <Header />

      <main>
        <section className="relative py-16 hydro-mesh lg:py-24">
          <div className="dot-grid pointer-events-none absolute inset-0" />
          <div className="section-container relative">
            <Breadcrumbs
              trailId={`city-${city.slug}`}
              className="mb-6 text-xs"
              items={[
                { name: "Home", href: "/" },
                { name: "Service area", href: "/service-area" },
                { name: city.name, href: `/service-area/${city.slug}` },
              ]}
            />
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
              Professional installation • {city.name}, Texas
            </p>
            <h1 className="mb-6 max-w-4xl font-display text-4xl leading-[1.08] text-fog-50 sm:text-5xl lg:text-6xl">
              Smart water shutoff installation in {city.name}
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-fog-200 sm:text-xl">
              HydroSense installs and configures Flo by Moen, Phyn Plus, and
              StreamLabs systems, tests automatic shutoff performance, and hands
              over an itemized installation record.
            </p>
            <div className="mt-8 max-w-3xl rounded-2xl border border-hydro-400/25 bg-ink-900/65 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-hydro-400">
                Installation boundary
              </p>
              <p className="text-sm leading-6 text-fog-200">
                {installationScopeDisclosure}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#lead-form" className="btn-primary inline-block">Check {city.name} availability</a>
              <TrackedPhoneLink trackingLocation="city_hero" className="btn-outline inline-block">Call (281) 694-5754</TrackedPhoneLink>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="section-container">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">Before installation</p>
              <h2 className="mb-5 font-display text-3xl text-fog-50 sm:text-4xl">What we verify at the home</h2>
              <p className="text-lg leading-relaxed text-fog-300">
                The device has to fit the plumbing and remain connected after the
                crew leaves. These conditions are reviewed before a proposal is issued.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Domestic-line access", "Location, pipe size and material, valve condition, and room to install the selected device on the household water line."],
                ["Power and Wi-Fi", "Nearby power and reliable Wi-Fi coverage at the leak-detection and shutoff location."],
                ["Existing leaks", "Active leaks and previously damaged plumbing must be repaired before monitoring equipment is installed."],
                ["Life-safety exclusion", "Fire-sprinkler and fire-suppression piping are identified and excluded from leak detection, monitoring, and automatic shutoff control."],
              ].map(([title, copy]) => (
                <article key={title} className="rounded-xl border border-ink-700/40 bg-ink-800/45 p-6">
                  <h3 className="mb-3 font-semibold text-fog-50">{title}</h3>
                  <p className="text-sm leading-relaxed text-fog-300">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink-950/50 py-20 lg:py-28">
          <div className="section-container grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">Included handoff</p>
              <h2 className="mb-6 font-display text-3xl text-fog-50 sm:text-4xl">A working system, not an unfinished device install</h2>
              <ul className="space-y-4 text-fog-200">
                {[
                  "Written device recommendation, scope, and price before scheduling",
                  "Plumbing installation and manufacturer-app connection",
                  "Automatic shutoff test and homeowner operating walkthrough",
                  "Itemized installation record with responsible license details",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-hydro-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-700/40 bg-ink-800/50 p-7 lg:p-9">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-fog-400">Local coverage</p>
              <h2 className="mb-5 font-display text-2xl text-fog-50">{city.name} service details</h2>
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="mb-1 text-fog-400">County coverage</dt>
                  <dd className="text-fog-100">{city.county}</dd>
                </div>
                <div>
                  <dt className="mb-2 text-fog-400">ZIP codes listed</dt>
                  <dd className="flex flex-wrap gap-2">
                    {city.zips.map((zip) => (
                      <span key={zip} className="rounded-full border border-ink-700 bg-ink-900 px-3 py-1.5 font-mono text-fog-200">{zip}</span>
                    ))}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-fog-400">
                Coverage and scheduling can change. Submit the property ZIP code
                for a current availability check.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="section-container max-w-3xl">
            <h2 className="mb-8 font-display text-2xl text-fog-50 sm:text-3xl">{city.name} installation FAQ</h2>
            <div className="divide-y divide-ink-700">
              {localFaqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium text-fog-50 transition-colors hover:text-hydro-400">
                    <span className="pr-4">{faq.q}</span>
                    <svg className="h-5 w-5 shrink-0 text-fog-300 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-fog-300">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink-950/50 py-16 lg:py-20">
          <div className="section-container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/guides/smart-water-shutoff-installation-cost-houston" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Houston cost guide</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">
                  See starting prices and what changes the written proposal
                </p>
              </Link>
              <Link href="/pricing" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Published pricing</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">See device-and-install rates by line size</p>
              </Link>
              <Link href="/devices" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Smart shutoff devices</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Compare compatible installation options</p>
              </Link>
              <Link href="#lead-form" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Compatibility assessment</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Request a {city.name} home assessment</p>
              </Link>
            </div>
          </div>
        </section>

        <LeadForm city={city.name} />
      </main>
      <Footer />
    </>
  );
}
