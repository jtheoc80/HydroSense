import { Metadata } from "next";
import { cities, cityKeys } from "@/lib/cities";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Houston Metro Smart Water Shutoff Service Area | HydroSense Texas",
  description:
    "HydroSense installs smart water shutoff devices across the Houston metro and Texas vacation home markets: Houston, Katy, Cypress, The Woodlands, Sugar Land, Spring, Baytown, Galveston, Lake Conroe, and Lake Livingston.",
  alternates: {
    canonical: "https://hydrosensetx.com/service-area",
  },
  openGraph: {
    title: "Service Area | HydroSense Texas",
    description:
      "Ten markets across Greater Houston and Texas vacation home destinations. Licensed smart water shutoff installs with carrier-recognized certification.",
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
      className="group bg-ink-800/40 border border-ink-700/30 rounded-xl p-7 hover:border-hydro-400/30 transition-all"
    >
      <h3 className="font-display text-2xl text-fog-50 group-hover:text-hydro-400 transition-colors mb-3">
        {city.name}
      </h3>
      <div className="space-y-1.5 text-sm mb-4">
        <p className="text-fog-300">
          County: <span className="text-fog-200">{city.county}</span>
        </p>
        <p className="text-fog-300">
          Median home:{" "}
          <span className="font-mono text-signal-400">{city.medianHome}</span>
        </p>
        <p className="text-fog-300">
          Typical premium:{" "}
          <span className="font-mono text-fog-200">{city.typicalPremium}</span>
        </p>
      </div>
      <p className="text-fog-300 text-sm leading-relaxed mb-4">
        {city.heroNote}
      </p>
      <span className="inline-flex items-center text-hydro-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
        {city.name} installs and carrier data
        <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

  const primaryKeys = cityKeys.filter((k) => !cities[k].vacationRental);
  const vacationKeys = cityKeys.filter((k) => cities[k].vacationRental);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CriticalBar />
      <Header />

      <main>
        <div className="section-container pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-fog-400">
            <a href="/" className="hover:text-fog-200 transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-fog-200">Service Area</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Where we install
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-6">
              Houston metro and Texas vacation home service area
            </h1>
            <p className="text-xl text-fog-200 leading-relaxed">
              We install across ten markets including seven primary residence
              cities in the Greater Houston area and three vacation home
              destinations. Each page includes local carrier data, freeze risk
              profile, and ZIP codes served.
            </p>
          </div>
        </section>

        {/* Primary residence markets */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              Primary residence markets
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {primaryKeys.map((key) => (
                <CityCard key={key} cityKey={key} />
              ))}
            </div>
          </div>
        </section>

        {/* Vacation home markets */}
        <section className="py-16 lg:py-20">
          <div className="section-container">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-4">
              Vacation home markets
            </h2>
            <p className="text-fog-200 leading-relaxed max-w-3xl mb-8">
              Second homes, beach houses, and lake cabins face elevated risk
              because no one is on-site when a pipe fails. A smart shutoff
              closes the main in seconds whether the property is occupied or
              not.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {vacationKeys.map((key) => (
                <CityCard key={key} cityKey={key} />
              ))}
            </div>
          </div>
        </section>

        {/* Guide and resource links */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
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
              <a href="/blog/best-home-investment-texas-tight-budget" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Blog</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">The best $999 a Texas homeowner can spend</p>
                <p className="text-fog-300 text-sm">Insurance credits, loss prevention, and resale value from one upgrade.</p>
              </a>
              <a href="/blog/smart-water-shutoff-texas-vacation-rentals" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Blog</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">Smart shutoff for Texas vacation rentals</p>
                <p className="text-fog-300 text-sm">Galveston, Lake Conroe, and Lake Livingston owner&apos;s guide.</p>
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
