import { Metadata } from "next";
import { deviceList } from "@/lib/devices";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "Smart Water Shutoff Devices We Install | HydroSense Texas",
  description:
    "Compare Flo by Moen, Phyn Plus, StreamLabs Control, and Guardian by Elexa. We install all four and match the device to your home, plumbing, and carrier. Licensed Texas Master Plumber.",
  alternates: {
    canonical: "https://hydrosensetx.com/devices",
  },
  openGraph: {
    title: "Smart Water Shutoff Devices We Install | HydroSense Texas",
    description:
      "Compare Flo by Moen, Phyn Plus, StreamLabs Control, and Guardian by Elexa. Licensed Texas Master Plumber install with carrier-recognized certificate.",
    url: "https://hydrosensetx.com/devices",
    siteName: "HydroSense Texas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devices We Install | HydroSense Texas",
    description:
      "Compare Flo by Moen, Phyn Plus, StreamLabs Control, and Guardian by Elexa.",
  },
};

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <CriticalBar />
      <Header />

      <main>
        {/* Hero */}
        <section className="py-20 lg:py-28">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Devices we install
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-6">
              The four devices we install, and how to choose.
            </h1>
            <p className="text-xl text-fog-200 leading-relaxed">
              We install all four. We match the device to your home, your
              plumbing, and your carrier's approved list. We take no
              referral money from any manufacturer.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-700/50">
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Device
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Detection method
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Learning period
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Insurer recognition
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Best for
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Install type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deviceList.map((d) => (
                    <tr
                      key={d.slug}
                      className="border-b border-ink-700/30 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-5 px-4">
                        <a
                          href={`/devices/${d.slug}`}
                          className="text-hydro-400 hover:text-hydro-300 transition-colors font-semibold"
                        >
                          {d.name}
                        </a>
                      </td>
                      <td className="py-5 px-4 text-fog-200">
                        {d.detectionMethod}
                      </td>
                      <td className="py-5 px-4 text-fog-200">
                        {d.learningPeriod}
                      </td>
                      <td className="py-5 px-4 text-fog-200">
                        {d.insurerRecognition}
                      </td>
                      <td className="py-5 px-4 text-fog-300 max-w-xs">
                        {d.bestFor}
                      </td>
                      <td className="py-5 px-4 text-fog-200">
                        {d.installType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Brand-agnostic statement */}
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-3xl">
            <div className="bg-ink-800/40 border-l-4 border-l-signal-400 rounded-r-xl p-7 lg:p-9">
              <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-3">
                Brand-agnostic
              </p>
              <p className="font-display text-xl lg:text-2xl text-fog-50 leading-snug mb-4">
                We install all four. We recommend based on your home.
              </p>
              <p className="text-fog-200 leading-relaxed">
                HydroSense takes no referral money from any device
                manufacturer. We match the device to your plumbing layout,
                your carrier's approved list, and your budget. The
                insurance discount comes from the certified install and
                documentation, not the brand name on the device.
              </p>
            </div>
          </div>
        </section>

        {/* Device cards */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {deviceList.map((d) => (
                <a
                  key={d.slug}
                  href={`/devices/${d.slug}`}
                  className="group bg-ink-800/40 border border-ink-700/30 rounded-xl p-7 lg:p-9 hover:border-hydro-400/30 transition-all"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-3">
                    {d.installType}
                  </p>
                  <h3 className="font-display text-2xl text-fog-50 group-hover:text-hydro-400 transition-colors mb-3">
                    {d.name}
                  </h3>
                  <p className="text-fog-200 leading-relaxed mb-4">
                    {d.tagline}
                  </p>
                  <p className="text-fog-300 text-sm leading-relaxed mb-6">
                    {d.howItWorks}
                  </p>
                  <span className="inline-flex items-center text-hydro-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Lead form */}
        <LeadForm />
      </main>

      <Footer />
    </>
  );
}
