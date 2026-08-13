import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { devices, deviceSlugs, deviceList } from "@/lib/devices";
import Breadcrumbs from "@/components/Breadcrumbs";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import TrackedPhoneLink from "@/components/TrackedPhoneLink";
import LiteYouTube from "@/components/LiteYouTube";
import { installationScopeDisclosure } from "@/lib/installation-scope";

export function generateStaticParams() {
  return deviceSlugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const device = devices[params.slug];
  if (!device) return {};

  const title = `${device.name} Installation in Houston`;
  const socialTitle = `${title} | HydroSense Texas`;
  const description = `${device.name} installation for Houston-area homes. Review plumbing, power, Wi-Fi, valve, and site requirements before receiving a written HydroSense proposal.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hydrosensetx.com/devices/${device.slug}`,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://hydrosensetx.com/devices/${device.slug}`,
      siteName: "HydroSense Texas",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}

const processSteps = [
  {
    title: "Compatibility review",
    body: "We confirm the domestic-line position, pipe size and material, valve condition, power, Wi-Fi, and installation space while excluding all fire-suppression piping.",
  },
  {
    title: "Written proposal",
    body: "The proposal identifies the exact model, device source, fittings, labor, included setup, exclusions, and fixed project price before scheduling.",
  },
  {
    title: "Install, test, and handoff",
    body: "The device is installed, connected to the manufacturer app, tested for shutoff operation, and documented for the homeowner's records.",
  },
];

export default function DevicePage({ params }: PageProps) {
  const device = devices[params.slug];
  if (!device) notFound();

  const otherDevices = deviceList.filter((item) => item.slug !== device.slug);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${device.name} installation`,
    serviceType: "Smart water shutoff installation",
    provider: { "@id": "https://hydrosensetx.com/#business" },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Houston, Texas",
    },
    url: `https://hydrosensetx.com/devices/${device.slug}`,
    description: `${device.howItWorks} ${installationScopeDisclosure}`,
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <CriticalBar />
      <Header />

      <main>
        <div className="section-container pt-8">
          <Breadcrumbs
            trailId={`device-${device.slug}`}
            items={[
              { name: "Home", href: "/" },
              { name: "Devices", href: "/devices" },
              { name: device.name, href: `/devices/${device.slug}` },
            ]}
          />
        </div>

        <section className="py-16 lg:py-24">
          <div className="section-container">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
                  Houston-area installation
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-5">
                  {device.name} installation in Houston
                </h1>
                <p className="text-xl text-fog-200 leading-relaxed mb-5">
                  {device.tagline}
                </p>
                <p className="text-fog-300 leading-relaxed max-w-2xl mb-8">
                  HydroSense scopes the exact installation after reviewing the
                  home&apos;s domestic water line, power, Wi-Fi, valve layout, and
                  separation from any fire-sprinkler or fire-suppression piping.
                  Product features and manufacturer requirements are confirmed
                  again in the written proposal.
                </p>
                <div className="mb-8 max-w-2xl rounded-2xl border border-hydro-400/25 bg-hydro-400/[0.06] p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-hydro-400">
                    Installation boundary
                  </p>
                  <p className="text-sm leading-6 text-fog-200">
                    {installationScopeDisclosure}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#lead-form" className="btn-primary text-center">
                    Check {device.name} compatibility
                  </a>
                  <TrackedPhoneLink
                    trackingLocation="device_detail_hero"
                    className="btn-outline text-center"
                  >
                    Call (281) 694-5754
                  </TrackedPhoneLink>
                </div>
              </div>

              <aside className="bg-ink-800/50 border border-ink-700/40 rounded-2xl p-7 lg:p-8">
                <p className="text-xs uppercase tracking-[0.18em] text-fog-400 mb-5">
                  Installation profile
                </p>
                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs text-fog-400 mb-1">Detection</dt>
                    <dd className="text-fog-50 font-medium">
                      {device.detectionMethod}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-fog-400 mb-1">Site setup</dt>
                    <dd className="text-fog-50 font-medium">
                      {device.setupProfile}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-fog-400 mb-1">Install type</dt>
                    <dd className="text-fog-50 font-medium">
                      {device.installType}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-fog-400 mb-1">Best fit</dt>
                    <dd className="text-fog-200 leading-relaxed">
                      {device.bestFor}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-4xl">
            <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-4">
              How the system works
            </p>
            <h2 className="font-display text-3xl text-fog-50 mb-6">
              What {device.name} is designed to do
            </h2>
            <p className="text-lg text-fog-200 leading-relaxed mb-10">
              {device.howItWorks}
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
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-fog-50 font-semibold text-lg mb-1">
                    {device.video.fallbackLabel}
                  </p>
                  <p className="text-fog-400 text-sm">
                    Manufacturer website opens in a new tab
                  </p>
                </div>
              </a>
            )}
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-3">
                  Installation-relevant details
                </p>
                <h2 className="font-display text-3xl text-fog-50">
                  What we verify before proposing {device.name}
                </h2>
              </div>
              <a
                href={device.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-hydro-400 hover:text-hydro-300 transition-colors"
              >
                Review the manufacturer website
              </a>
            </div>
            <div className="space-y-4">
              {device.keyFacts.map((fact) => (
                <div
                  key={fact}
                  className="flex gap-4 items-start bg-ink-800/35 border border-ink-700/30 rounded-xl p-5"
                >
                  <svg
                    className="w-5 h-5 text-hydro-400 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-fog-200 leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-fog-400 leading-relaxed mt-6">
              Product capabilities, app services, and model specifications can
              change. The final proposal confirms the current manufacturer
              requirements and exact device model.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-4xl">
            <div className="bg-ink-800/40 border-l-4 border-l-signal-400 rounded-r-2xl p-7 lg:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-3">
                Insurance qualification
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-5">
                An installation record is not a guarantee of an insurance credit.
              </h2>
              <div className="space-y-4 text-fog-200 leading-relaxed">
                <p>
                  Some insurers may offer a credit or underwriting consideration
                  for an approved automatic water shutoff, but the insurer decides
                  which models, installation methods, and documents qualify under
                  a specific policy.
                </p>
                <p>
                  Confirm the requirement with your agent before purchasing for a
                  discount. HydroSense provides an itemized installation record
                  and helps locate available manufacturer verification documents.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-3">
                Installation process
              </p>
              <h2 className="font-display text-3xl text-fog-50">
                From assessment to tested handoff
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="bg-ink-800/40 border border-ink-700/40 rounded-2xl p-7"
                >
                  <p className="font-mono text-xs text-hydro-400 mb-4">
                    0{index + 1}
                  </p>
                  <h3 className="text-lg font-semibold text-fog-50 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-fog-300 leading-relaxed">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-4xl">
            <h2 className="font-display text-3xl text-fog-50 mb-8">
              {device.name} frequently asked questions
            </h2>
            <div className="space-y-5">
              {device.faqs.map((faq) => (
                <article
                  key={faq.q}
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 lg:p-8"
                >
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-fog-200 leading-relaxed">{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-3">
                Compare options
              </p>
              <h2 className="font-display text-3xl text-fog-50">
                How {device.name} differs from the other systems
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-ink-700/40">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-ink-800/70">
                  <tr className="border-b border-ink-700/50">
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Device
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Detection
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Setup
                    </th>
                    <th className="py-4 px-5 text-fog-300 font-medium text-xs uppercase tracking-wider">
                      Install
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deviceList.map((item) => (
                    <tr
                      key={item.slug}
                      className={`border-b border-ink-700/30 last:border-b-0 ${
                        item.slug === device.slug ? "bg-hydro-400/5" : ""
                      }`}
                    >
                      <td className="py-5 px-5">
                        {item.slug === device.slug ? (
                          <span className="text-fog-50 font-semibold">
                            {item.name}
                          </span>
                        ) : (
                          <a
                            href={`/devices/${item.slug}`}
                            className="text-hydro-400 hover:text-hydro-300 transition-colors font-medium"
                          >
                            {item.name}
                          </a>
                        )}
                      </td>
                      <td className="py-5 px-5 text-fog-200">
                        {item.detectionMethod}
                      </td>
                      <td className="py-5 px-5 text-fog-200">
                        {item.setupProfile}
                      </td>
                      <td className="py-5 px-5 text-fog-200">
                        {item.installType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherDevices.map((item) => (
                <a
                  key={item.slug}
                  href={`/devices/${item.slug}`}
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Other device
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    {item.name}
                  </p>
                  <p className="text-fog-300 text-sm line-clamp-2">
                    {item.tagline}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="grid gap-6 sm:grid-cols-3">
              <Link href="/pricing" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Published pricing</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">See device-and-install rates by line size</p>
              </Link>
              <Link href="#lead-form" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Compatibility assessment</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Request a home and device fit review</p>
              </Link>
              <Link href="/service-area" className="group rounded-xl border border-ink-700/30 bg-ink-800/40 p-6 transition-all hover:border-hydro-400/30">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-fog-400">Greater Houston coverage</p>
                <p className="font-semibold text-fog-50 transition-colors group-hover:text-hydro-400">Check smart shutoff installation areas</p>
              </Link>
            </div>
          </div>
        </section>

        <LeadForm />
      </main>

      <Footer />
    </>
  );
}
