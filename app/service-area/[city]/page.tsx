import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, cityKeys } from "@/lib/cities";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import CityViewEvent from "./CityViewEvent";

export function generateStaticParams() {
  return cityKeys.map((city) => ({ city }));
}

interface PageProps {
  params: { city: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const city = cities[params.city];
  if (!city) return {};

  const title = `Smart Water Shutoff Installation in ${city.name}, TX | HydroSense Texas`;
  const description = `${city.name} homeowners: save $300-$600/yr on insurance with a certified smart water shutoff install. Median home ${city.medianHome}. Licensed Texas Master Plumber.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hydrosensetx.com/service-area/${city.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hydrosensetx.com/service-area/${city.slug}`,
      siteName: "HydroSense Texas",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `HydroSense ${city.name} | Smart Water Shutoff Installs`,
      description,
    },
  };
}

export default function CityPage({ params }: PageProps) {
  const city = cities[params.city];
  if (!city) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hydrosensetx.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Area",
        item: "https://hydrosensetx.com/service-area",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city.name,
        item: `https://hydrosensetx.com/service-area/${city.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.cityFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Smart Water Shutoff Installation in ${city.name}, Texas`,
    author: {
      "@type": "Organization",
      name: "HydroSense Texas",
    },
    publisher: {
      "@type": "Organization",
      name: "HydroSense Texas",
    },
    description: `Insurance savings guide for ${city.name} homeowners. Covers carrier discounts, HO-A vs HO-B vs HO-3, freeze risk, and certified smart shutoff installation.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <CityViewEvent cityName={city.name} />
      <CriticalBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-16 lg:py-24 hydro-mesh">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="section-container relative">
            <nav className="text-xs text-fog-400 mb-6" aria-label="Breadcrumb">
              <a href="/" className="hover:text-fog-200 transition-colors">
                Home
              </a>
              <span className="mx-2">/</span>
              <a href="/service-area" className="hover:text-fog-200 transition-colors">
                Service Area
              </a>
              <span className="mx-2">/</span>
              <span className="text-fog-200">{city.name}</span>
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Licensed install, Texas Master Plumber certified
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-fog-50 leading-[1.1] mb-6">
              Smart water shutoff installation for {city.name} homeowners
            </h1>
            <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
              <div className="bg-ink-800/60 border border-ink-700/50 rounded-lg p-4">
                <p className="text-xs text-fog-400 mb-1">Median home value</p>
                <p className="font-mono text-xl text-signal-400">
                  {city.medianHome}
                </p>
              </div>
              <div className="bg-ink-800/60 border border-ink-700/50 rounded-lg p-4">
                <p className="text-xs text-fog-400 mb-1">Typical premium</p>
                <p className="font-mono text-xl text-signal-400">
                  {city.typicalPremium}
                </p>
              </div>
              <div className="bg-ink-800/60 border border-ink-700/50 rounded-lg p-4">
                <p className="text-xs text-fog-400 mb-1">County</p>
                <p className="text-lg text-fog-100">{city.county}</p>
              </div>
            </div>
            <p className="text-fog-300 text-sm mt-4">{city.heroNote}</p>
            <a href="#lead-form" className="btn-primary mt-8 inline-block">
              Get my {city.name} quote
            </a>
          </div>
        </section>

        {/* Why install */}
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-8">
              Why {city.name} homeowners install
            </h2>
            <div className="space-y-4 text-fog-200 leading-relaxed max-w-3xl">
              {city.whyInstall.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <a href="#lead-form" className="btn-outline mt-8 inline-block text-sm">
              See what your carrier credits in {city.name}
            </a>
          </div>
        </section>

        {/* Freeze risk */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
              Freeze risk in {city.name}
            </h2>
            <p className="text-fog-200 leading-relaxed max-w-3xl">
              {city.freezeRisk}
            </p>
            <p className="text-fog-300 text-sm mt-4 max-w-3xl">
              {city.homeAge}
            </p>
          </div>
        </section>

        {/* Carriers in city */}
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              Carriers active in {city.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {city.carriers.map((c) => (
                <div
                  key={c.name}
                  className="bg-ink-800 border border-ink-700 rounded-lg p-4"
                >
                  <p className="text-fog-50 font-semibold">{c.name}</p>
                  <p className="font-mono text-hydro-400 text-sm mt-1">
                    Typical discount: {c.typicalDiscount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HO forms */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
              HO-A vs HO-B vs HO-3 in {city.name}
            </h2>
            <div className="bg-ink-800 border-l-4 border-l-signal-400 rounded-r-lg p-6 max-w-3xl">
              <p className="text-fog-200 leading-relaxed">
                {city.hoFormScenario}
              </p>
            </div>
            <a href="#lead-form" className="btn-primary mt-6 inline-block text-sm">
              Check your policy form and carrier discount
            </a>
          </div>
        </section>

        {/* Case study */}
        <section className="py-20 lg:py-28">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              Case study: {city.caseStudy.neighborhood}
            </h2>
            <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 lg:p-8 max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-fog-400 mb-4">
                Illustrative scenario based on comparable claims data
              </p>
              <h3 className="text-lg font-semibold text-fog-50 mb-1">
                {city.caseStudy.name}
              </h3>
              <p className="text-sm text-fog-300 mb-4">
                {city.caseStudy.neighborhood} | Premium:{" "}
                <span className="font-mono text-signal-400">
                  {city.caseStudy.premium}
                </span>
              </p>
              <div className="space-y-3 text-sm text-fog-200 leading-relaxed">
                <p>
                  <span className="text-fog-400 font-semibold">Event:</span>{" "}
                  {city.caseStudy.event}
                </p>
                <p>
                  <span className="text-fog-400 font-semibold">
                    Device response:
                  </span>{" "}
                  {city.caseStudy.deviceCaught}
                </p>
                <p>
                  <span className="text-fog-400 font-semibold">Outcome:</span>{" "}
                  {city.caseStudy.outcome}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ZIP codes */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
              ZIP codes served in {city.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {city.zips.map((zip) => (
                <span
                  key={zip}
                  className="px-3 py-1.5 bg-ink-800 border border-ink-700 rounded-full text-sm font-mono text-fog-200"
                >
                  {zip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* City FAQ */}
        <section className="py-20 lg:py-28">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              {city.name} FAQ
            </h2>
            <div className="divide-y divide-ink-700">
              {city.cityFaqs.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between py-5 cursor-pointer text-fog-50 font-medium hover:text-hydro-400 transition-colors list-none">
                    <span className="pr-4">{faq.q}</span>
                    <svg
                      className="w-5 h-5 text-fog-300 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="pb-5 text-fog-300 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="space-y-5 text-fog-200 leading-relaxed max-w-3xl mb-8">
              <p>
                We install{" "}
                <a href="/devices/moen-flo" className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors">Flo by Moen</a>,{" "}
                <a href="/devices/phyn-plus" className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors">Phyn Plus</a>,{" "}
                <a href="/devices/streamlabs" className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors">StreamLabs Control</a>, and{" "}
                <a href="/devices/guardian" className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors">Guardian by Elexa</a>{" "}
                across {city.name}. We match the device to your home during the 15-minute assessment.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <a href="/insurance/ho-a-vs-ho-b-ho-3" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Guide</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">HO-A vs HO-B vs HO-3 in Texas</p>
                <p className="text-fog-300 text-sm">Your policy form determines how water damage claims settle.</p>
              </a>
              <a href="/freeze-damage-texas" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Guide</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">Freeze damage claims in Texas</p>
                <p className="text-fog-300 text-sm">How frozen pipe water damage claims work and why carriers reward prevention.</p>
              </a>
              <a href="/devices" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Devices</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">Smart water shutoff devices we install</p>
                <p className="text-fog-300 text-sm">Compare Flo by Moen, Phyn Plus, StreamLabs, and Guardian.</p>
              </a>
            </div>
          </div>
        </section>

        {/* Vacation rental cross-links */}
        {city.vacationRental && (
          <section className="py-16 lg:py-20">
            <div className="section-container">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
                Other vacation home markets we serve
              </h2>
              <p className="text-fog-200 leading-relaxed max-w-3xl mb-8">
                Second homes and vacation properties face elevated risk because
                no one is on-site when a pipe fails. We install across all three
                Texas vacation home markets.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {Object.values(cities)
                  .filter((c) => c.vacationRental && c.slug !== city.slug)
                  .map((c) => (
                    <a
                      key={c.slug}
                      href={`/service-area/${c.slug}`}
                      className="group bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all"
                    >
                      <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                        Vacation home market
                      </p>
                      <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                        {c.name}
                      </p>
                      <p className="text-fog-300 text-sm">{c.heroNote}</p>
                    </a>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Lead form */}
        <LeadForm city={city.name} />
      </main>
      <Footer />
    </>
  );
}
