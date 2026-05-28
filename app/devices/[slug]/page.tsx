import { Metadata } from "next";
import { notFound } from "next/navigation";
import { devices, deviceSlugs, deviceList } from "@/lib/devices";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import MechanismVisual from "@/components/MechanismVisual";
import LiteYouTube from "@/components/LiteYouTube";

export function generateStaticParams() {
  return deviceSlugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const device = devices[params.slug];
  if (!device) return {};

  const title = `${device.name} Installation in Houston | HydroSense Texas`;
  const description = `${device.name}: ${device.tagline} Licensed install, Texas Master Plumber certified. Carrier-recognized certificate. Save $300-$600/yr on insurance.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hydrosensetx.com/devices/${device.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hydrosensetx.com/devices/${device.slug}`,
      siteName: "HydroSense Texas",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${device.name} | HydroSense Texas`,
      description,
    },
  };
}

const cityLinks = [
  { name: "Houston", slug: "houston" },
  { name: "Katy", slug: "katy" },
  { name: "The Woodlands", slug: "the-woodlands" },
];

export default function DevicePage({ params }: PageProps) {
  const device = devices[params.slug];
  if (!device) notFound();

  const otherDevices = deviceList.filter((d) => d.slug !== device.slug);

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
      {
        "@type": "ListItem",
        position: 3,
        name: device.name,
        item: `https://hydrosensetx.com/devices/${device.slug}`,
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: device.name,
    description: device.howItWorks,
    brand: {
      "@type": "Brand",
      name: device.name.split(" by ").pop() || device.name,
    },
  };

  const videoSchema = device.video.youtubeId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: device.video.videoTitle,
        description: `Official ${device.name} product video.`,
        thumbnailUrl: `https://i.ytimg.com/vi/${device.video.youtubeId}/hqdefault.jpg`,
        contentUrl: `https://www.youtube.com/watch?v=${device.video.youtubeId}`,
        embedUrl: `https://www.youtube.com/embed/${device.video.youtubeId}`,
      }
    : null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: device.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoSchema),
          }}
        />
      )}

      <CriticalBar />
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="section-container pt-8">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-fog-400"
          >
            <a
              href="/"
              className="hover:text-fog-200 transition-colors"
            >
              Home
            </a>
            <span className="mx-2">/</span>
            <a
              href="/devices"
              className="hover:text-fog-200 transition-colors"
            >
              Devices
            </a>
            <span className="mx-2">/</span>
            <span className="text-fog-200">{device.name}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Device we install
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-5">
              {device.name}
            </h1>
            <p className="text-xl text-fog-200 leading-relaxed mb-4">
              {device.tagline}
            </p>
            <p className="text-fog-300 mb-8">
              We install this across the Houston metro. Licensed
              technicians, Texas Master Plumber certified. Carrier-recognized
              certificate in paper and digital form after final payment.
            </p>

            {/* Part 1: Lead visual -- mechanism animation */}
            <div className="mb-8">
              <MechanismVisual />
            </div>

            <a
              href="#lead-form"
              className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-base px-8 py-4 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 hover:-translate-y-0.5 transition-all"
            >
              Get a quote for {device.name}
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-4">
              How it works
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
              What {device.name} does inside your home
            </h2>
            <p className="text-lg text-fog-200 leading-relaxed">
              {device.howItWorks}
            </p>
          </div>
        </section>

        {/* Part 2: Official manufacturer video */}
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-fog-300 font-medium mb-4">
              Official {device.name} video
            </p>
            {device.video.youtubeId ? (
              <LiteYouTube
                videoId={device.video.youtubeId}
                title={device.video.videoTitle}
              />
            ) : (
              <a
                href={device.video.fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 bg-ink-800/50 border border-ink-700/40 rounded-xl p-6 lg:p-8 hover:border-hydro-400/30 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-hydro-400/10 flex items-center justify-center shrink-0 group-hover:bg-hydro-400/20 transition-colors">
                  <svg
                    className="w-7 h-7 text-hydro-400 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-fog-50 font-semibold text-lg mb-1">
                    {device.video.fallbackLabel}
                  </p>
                  <p className="text-fog-400 text-sm">
                    {device.video.fallbackUrl
                      .replace("https://", "")
                      .replace(/\/$/, "")}
                  </p>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* Key facts */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Verified facts
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              What you need to know about {device.name}
            </h2>
            <div className="space-y-4">
              {device.keyFacts.map((fact, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <svg
                    className="w-5 h-5 text-hydro-400 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-fog-200 leading-relaxed">
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best for callout */}
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-3xl">
            <div className="bg-ink-800/40 border-l-4 border-l-signal-400 rounded-r-xl p-7 lg:p-9">
              <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-3">
                Best for
              </p>
              <p className="font-display text-xl lg:text-2xl text-fog-50 leading-snug">
                {device.bestFor}
              </p>
            </div>
          </div>
        </section>

        {/* Insurance note */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Brand-agnostic
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
              The discount comes from the install, not the brand
            </h2>
            <p className="text-lg text-fog-200 leading-relaxed">
              Every device we install is carrier recognized. The discount
              comes from the certified install and the documentation, not
              the brand. We match the device to your home, your plumbing,
              and your carrier's approved list during the 15-minute
              assessment.
            </p>
          </div>
        </section>

        {/* How HydroSense installs it */}
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-4">
              Our process
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-6">
              How HydroSense installs {device.name}
            </h2>
            <p className="text-lg text-fog-200 leading-relaxed">
              Trained, licensed technicians install the device at your
              main water line under our Texas Master Plumber license,
              configure the app on your phone, and test the shutoff. After
              final payment, we issue the carrier-recognized certificate
              in paper and digital form. The on-site visit takes
              approximately two hours.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {device.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-ink-800/40 rounded-xl p-6 lg:p-8"
                >
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison strip */}
        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
                Compare all four
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                How {device.name} compares
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-700/50">
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Device
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Detection
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Learning
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Insurer recognition
                    </th>
                    <th className="py-4 px-4 text-fog-400 font-medium text-xs uppercase tracking-wider">
                      Install
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deviceList.map((d) => (
                    <tr
                      key={d.slug}
                      className={`border-b border-ink-700/30 ${
                        d.slug === device.slug
                          ? "bg-hydro-400/5"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        {d.slug === device.slug ? (
                          <span className="text-fog-50 font-semibold">
                            {d.name}
                          </span>
                        ) : (
                          <a
                            href={`/devices/${d.slug}`}
                            className="text-hydro-400 hover:text-hydro-300 transition-colors font-medium"
                          >
                            {d.name}
                          </a>
                        )}
                      </td>
                      <td className="py-4 px-4 text-fog-200">
                        {d.detectionMethod}
                      </td>
                      <td className="py-4 px-4 text-fog-200">
                        {d.learningPeriod}
                      </td>
                      <td className="py-4 px-4 text-fog-200">
                        {d.insurerRecognition}
                      </td>
                      <td className="py-4 px-4 text-fog-200">
                        {d.installType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8">
              <a
                href="/devices"
                className="inline-flex items-center justify-center rounded-lg border border-fog-300/20 text-fog-100 font-medium text-sm px-8 py-3.5 hover:bg-white/5 hover:border-fog-300/30 transition-all"
              >
                Full device comparison
              </a>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Other devices */}
              {otherDevices.map((d) => (
                <a
                  key={d.slug}
                  href={`/devices/${d.slug}`}
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Device
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    {d.name}
                  </p>
                  <p className="text-fog-300 text-sm line-clamp-2">
                    {d.tagline}
                  </p>
                </a>
              ))}
              {/* City links */}
              {cityLinks.map((city) => (
                <a
                  key={city.slug}
                  href={`/service-area/${city.slug}`}
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Service area
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    {city.name}
                  </p>
                  <p className="text-fog-300 text-sm">
                    Smart water shutoff installs in {city.name}, TX
                  </p>
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
