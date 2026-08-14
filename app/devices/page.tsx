import type { Metadata } from "next";
import { deviceList } from "@/lib/devices";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import TrackedPhoneLink from "@/components/TrackedPhoneLink";
import { installationScopeDisclosure } from "@/lib/installation-scope";

export const metadata: Metadata = {
  title: "Smart Water Shutoff Devices Installed in Houston",
  description:
    "Compare Flo by Moen, Phyn Plus, StreamLabs Control, Guardian, and FloLogic for Houston-area homes. HydroSense scopes plumbing, power, connectivity, and shutoff requirements before installation.",
  alternates: {
    canonical: "https://hydrosensetx.com/devices",
  },
  openGraph: {
    title: "Smart Water Shutoff Devices Installed in Houston",
    description:
      "Compare five smart water shutoff approaches, including FloLogic for qualifying large domestic lines, and see what HydroSense verifies before installation.",
    url: "https://hydrosensetx.com/devices",
    siteName: "HydroSense Texas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Water Shutoff Devices Installed in Houston",
    description:
      "Compare Flo by Moen, Phyn Plus, StreamLabs Control, Guardian, and FloLogic installation requirements.",
  },
};

const fitFactors = [
  {
    title: "Plumbing configuration",
    body: "We identify the domestic water line, pipe size and material, valve condition, working space, and pressure-reducing valve while excluding fire-sprinkler and fire-suppression piping.",
  },
  {
    title: "Power and connectivity",
    body: "Inline devices normally require nearby power and reliable 2.4 GHz Wi-Fi. We verify outlet distance and signal where the device will actually be installed.",
  },
  {
    title: "Protection approach",
    body: "Inline systems analyze domestic-water activity. Retrofit systems use point sensors and a compatible domestic-line valve. Irrigation requires a separate, requested scope review.",
  },
];

export default function DevicesPage() {
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
        name: "Devices",
        item: "https://hydrosensetx.com/devices",
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Smart water shutoff device selection and installation",
    serviceType: "Smart water shutoff installation",
    provider: { "@id": "https://hydrosensetx.com/#business" },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Houston, Texas",
    },
    url: "https://hydrosensetx.com/devices",
    description:
      `HydroSense evaluates plumbing, power, Wi-Fi, and device requirements before installing compatible domestic-water monitoring and shutoff systems. ${installationScopeDisclosure}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <CriticalBar />
      <Header />

      <main>
        <div className="section-container pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-fog-400">
            <a href="/" className="hover:text-fog-200 transition-colors">
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-fog-200">Devices</span>
          </nav>
        </div>

        <section className="py-16 lg:py-24">
          <div className="section-container max-w-4xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Device selection
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-6">
              Compare smart water shutoff systems for your Houston-area home.
            </h1>
            <p className="text-xl text-fog-200 leading-relaxed max-w-3xl mb-8">
              The best device is the one that fits your plumbing, power,
              connectivity, valve layout, and protection goals. HydroSense
              verifies those conditions before issuing a written installation
              proposal.
            </p>
            <div className="mb-8 max-w-3xl rounded-2xl border border-hydro-400/25 bg-hydro-400/[0.06] p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-hydro-400">
                Installation boundary
              </p>
              <p className="text-sm leading-6 text-fog-200">
                {installationScopeDisclosure}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#lead-form" className="btn-primary text-center">
                Check my home compatibility
              </a>
              <TrackedPhoneLink
                trackingLocation="devices_hub_hero"
                className="btn-outline text-center"
              >
                Call (281) 694-5754
              </TrackedPhoneLink>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-3">
                Side-by-side view
              </p>
              <h2 className="font-display text-3xl text-fog-50 mb-4">
                {deviceList.length} different installation profiles
              </h2>
              <p className="text-fog-300 leading-relaxed">
                Product features and manufacturer requirements can change. The
                final proposal confirms the current model, compatibility, and
                installation conditions for your home.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-ink-700/40">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-ink-800/70">
                  <tr className="border-b border-ink-700/50">
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Device
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Detection approach
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Setup profile
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Install type
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Best fit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deviceList.map((device) => (
                    <tr
                      key={device.slug}
                      className="border-b border-ink-700/30 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-5 px-5 align-top">
                        <a
                          href={`/devices/${device.slug}`}
                          className="text-hydro-400 hover:text-hydro-300 transition-colors font-semibold"
                        >
                          {device.name}
                        </a>
                        {device.hubBadge ? (
                          <span className="mt-2 block w-fit rounded-full border border-signal-400/35 bg-signal-400/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-signal-400">
                            {device.hubBadge}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-5 px-5 align-top text-fog-200">
                        {device.detectionMethod}
                      </td>
                      <td className="py-5 px-5 align-top text-fog-200">
                        {device.setupProfile}
                      </td>
                      <td className="py-5 px-5 align-top text-fog-200">
                        {device.installType}
                      </td>
                      <td className="py-5 px-5 align-top text-fog-300 max-w-sm">
                        {device.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-3">
                How we choose
              </p>
              <h2 className="font-display text-3xl text-fog-50">
                The home determines the recommendation.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {fitFactors.map((factor) => (
                <article
                  key={factor.title}
                  className="bg-ink-800/40 border border-ink-700/40 rounded-2xl p-7"
                >
                  <h3 className="text-lg font-semibold text-fog-50 mb-3">
                    {factor.title}
                  </h3>
                  <p className="text-fog-300 leading-relaxed">
                    {factor.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {deviceList.map((device) => (
                <article
                  key={device.slug}
                  className="bg-ink-800/40 border border-ink-700/30 rounded-2xl p-7 lg:p-9 flex flex-col"
                >
                  {device.hubBadge ? (
                    <p className="mb-3 w-fit rounded-full border border-signal-400/35 bg-signal-400/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-signal-400">
                      {device.hubBadge}
                    </p>
                  ) : null}
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-3">
                    {device.installType}
                  </p>
                  <h2 className="font-display text-2xl text-fog-50 mb-3">
                    {device.name}
                  </h2>
                  <p className="text-fog-200 leading-relaxed mb-4">
                    {device.tagline}
                  </p>
                  <p className="text-fog-300 text-sm leading-relaxed mb-7 flex-1">
                    {device.howItWorks}
                  </p>
                  <a
                    href={`/devices/${device.slug}`}
                    className="inline-flex items-center text-hydro-400 hover:text-hydro-300 text-sm font-medium transition-colors"
                  >
                    Review {device.name} installation details
                    <svg
                      className="w-4 h-4 ml-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container max-w-4xl">
            <div className="bg-ink-800/40 border-l-4 border-l-signal-400 rounded-r-2xl p-7 lg:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-3">
                Insurance qualification
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-5">
                Verify the insurance requirement separately from device selection.
              </h2>
              <div className="space-y-4 text-fog-200 leading-relaxed">
                <p>
                  Some insurers may offer a credit or underwriting consideration
                  for an approved automatic water shutoff, but eligibility varies
                  by insurer, policy, model, installation, and documentation
                  requirement.
                </p>
                <p>
                  Confirm the requirement with your insurance agent before buying
                  a device for a discount. HydroSense provides an installation
                  record and helps locate manufacturer verification documents when
                  available. No device, installation, or document guarantees a
                  premium credit.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <a
                href="/service-area"
                className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                  Service area
                </p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                  Greater Houston installation coverage
                </p>
                <p className="text-fog-300 text-sm">
                  Review the cities and ZIP codes in our current service area.
                </p>
              </a>
              <a
                href="/pricing"
                className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                  Pricing
                </p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                  What a standard installation includes
                </p>
                <p className="text-fog-300 text-sm">
                  See the starting price, scope, exclusions, and optional care plan.
                </p>
              </a>
              <a
                href="/blog"
                className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                  Guides
                </p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                  Home water-protection resources
                </p>
                <p className="text-fog-300 text-sm">
                  Read installation, leak-prevention, and homeowner planning guides.
                </p>
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
