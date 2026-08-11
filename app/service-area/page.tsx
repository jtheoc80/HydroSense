import type { Metadata } from "next";
import { cities, cityKeys } from "@/lib/cities";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Greater Houston Smart Water Shutoff Service Area",
  description:
    "HydroSense provides professional smart water shutoff installation across Houston, Katy, Cypress, The Woodlands, Sugar Land, Spring, Baytown, Galveston, Lake Conroe, and Lake Livingston.",
  alternates: {
    canonical: "https://hydrosensetx.com/service-area",
  },
  openGraph: {
    title: "Greater Houston Service Area | HydroSense Texas",
    description:
      "Professional whole-home smart water shutoff installation, configuration, and testing across Greater Houston and selected Texas second-home markets.",
    url: "https://hydrosensetx.com/service-area",
    siteName: "HydroSense Texas",
    type: "website",
  },
};

function CityCard({ cityKey }: { cityKey: string }) {
  const city = cities[cityKey];

  return (
    <a
      href={`/service-area/${city.slug}`}
      className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-7 transition-all hover:border-hydro-400/30"
    >
      <h3 className="mb-3 font-display text-2xl text-fog-50 transition-colors group-hover:text-hydro-400">
        {city.name}
      </h3>
      <p className="text-sm leading-relaxed text-fog-300">
        County coverage: <span className="text-fog-200">{city.county}</span>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-fog-400">
        ZIP codes: {city.zips.slice(0, 5).join(", ")}
        {city.zips.length > 5 ? " and nearby areas" : ""}
      </p>
      <span className="mt-5 inline-flex items-center text-sm font-medium text-hydro-400 transition-transform group-hover:translate-x-1">
        View installation details
        <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}

export default function ServiceAreaHub() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hydrosensetx.com" },
      { "@type": "ListItem", position: 2, name: "Service Area", item: "https://hydrosensetx.com/service-area" },
    ],
  };

  const primaryKeys = cityKeys.filter((key) => !cities[key].vacationRental);
  const vacationKeys = cityKeys.filter((key) => cities[key].vacationRental);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CriticalBar />
      <Header />

      <main>
        <div className="section-container pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-fog-400">
            <a href="/" className="transition-colors hover:text-fog-200">Home</a>
            <span className="mx-2">/</span>
            <span className="text-fog-200">Service area</span>
          </nav>
        </div>

        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">Where we install</p>
            <h1 className="mb-6 font-display text-4xl leading-[1.08] text-fog-50 sm:text-5xl lg:text-[3.5rem]">
              Smart water shutoff installation across Greater Houston
            </h1>
            <p className="text-xl leading-relaxed text-fog-200">
              HydroSense serves primary residences, second homes, and managed
              properties across the Houston metro and selected Gulf Coast and lake
              markets. Submit your ZIP code to confirm current appointment coverage.
            </p>
          </div>
        </section>

        <section className="bg-ink-950/50 py-16 lg:py-20">
          <div className="section-container">
            <h2 className="mb-8 font-display text-2xl text-fog-50 sm:text-3xl">Greater Houston markets</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {primaryKeys.map((key) => <CityCard key={key} cityKey={key} />)}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container">
            <h2 className="mb-4 font-display text-2xl text-fog-50 sm:text-3xl">Second-home and vacation markets</h2>
            <p className="mb-8 max-w-3xl leading-relaxed text-fog-200">
              Remote properties benefit from automatic detection and shutoff because
              a leak may otherwise continue until someone reaches the home. Device
              behavior depends on the selected model, settings, power, and connectivity.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {vacationKeys.map((key) => <CityCard key={key} cityKey={key} />)}
            </div>
          </div>
        </section>

        <section className="bg-ink-950/50 py-16 lg:py-20">
          <div className="section-container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <a href="/devices" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Devices</p>
                <p className="mb-2 text-lg font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Compare systems we install</p>
                <p className="text-sm text-fog-300">Review Flo by Moen, Phyn Plus, StreamLabs, and installation fit.</p>
              </a>
              <a href="/#customer-journey" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Process</p>
                <p className="mb-2 text-lg font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Understand the assessment</p>
                <p className="text-sm text-fog-300">See what we inspect before issuing a written proposal.</p>
              </a>
              <a href="/blog" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Guides</p>
                <p className="mb-2 text-lg font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Prepare your home</p>
                <p className="text-sm text-fog-300">Read about leak detection, pipe access, freeze preparation, and smart shutoff systems.</p>
              </a>
            </div>
          </div>
        </section>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
