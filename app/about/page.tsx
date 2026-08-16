import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CriticalBar from "@/components/CriticalBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/catalyst/button";
import {
  getManufacturerAuthorization,
  manufacturerAuthorizationSummary,
  manufacturerAuthorizations,
} from "@/lib/business/manufacturer-authorizations";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";
import { deviceList } from "@/lib/devices";
import {
  formatUsd,
  getInstallationService,
  installationServices,
} from "@/lib/service-catalog/catalog";

function getFixedInstallationAmount(service: (typeof installationServices)[number]) {
  if (service.price.type !== "fixed") {
    throw new Error(`Catalog invariant failed for ${service.id}: installation price must be fixed`);
  }
  return service.price.amount;
}

const installationAmounts = installationServices.map(getFixedInstallationAmount);
const installationPriceRange = `${formatUsd(Math.min(...installationAmounts))}–${formatUsd(Math.max(...installationAmounts))}`;
const oneAndOneHalfInchService = getInstallationService("1.50");
const twoInchService = getInstallationService("2.00");
const oneAndOneHalfInchAmount = getFixedInstallationAmount(oneAndOneHalfInchService);
const twoInchAmount = getFixedInstallationAmount(twoInchService);


export const metadata: Metadata = {
  title: "About HydroSense Texas",
  description:
    `${manufacturerAuthorizationSummary} Learn how HydroSense scopes and installs compatible smart water shutoff systems across Greater Houston.`,
  alternates: {
    canonical: "https://hydrosensetx.com/about",
  },
  openGraph: {
    title: "About HydroSense Texas",
    description:
      `${manufacturerAuthorizationSummary} Professional smart water shutoff installation across Greater Houston.`,
    url: "https://hydrosensetx.com/about",
    siteName: "HydroSense Texas",
    type: "website",
  },
};

export default function AboutPage() {
  const supportedDevices = deviceList.filter(
    (device) => !getManufacturerAuthorization(device.slug),
  );

  return (
    <>
      <CriticalBar />
      <Header />

      <main>
        <div className="section-container pt-8">
          <Breadcrumbs
            trailId="about-hydrosense"
            items={[
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
            ]}
          />
        </div>

        <section className="py-16 lg:py-24">
          <div className="section-container">
            <div className="max-w-4xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
                About HydroSense Texas
              </p>
              <h1 className="mb-6 font-display text-4xl text-fog-50 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                Smart water protection scoped for the home in front of us.
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-fog-200">
                HydroSense evaluates the domestic water line, plumbing configuration,
                power, connectivity, and installation conditions before recommending a
                compatible system and issuing a written proposal.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-ink-700/40 bg-ink-950/30 py-10 lg:py-12" aria-label="HydroSense business facts">
          <div className="section-container">
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-fog-400">
                  Business
                </dt>
                <dd className="mt-2 font-semibold text-fog-50">HydroSense Texas</dd>
                <dd className="mt-1 text-sm text-fog-300">A Lead Ledger Pro LLC brand</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-fog-400">
                  Primary service area
                </dt>
                <dd className="mt-2 font-semibold text-fog-50">Greater Houston, Texas</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-fog-400">
                  Phone
                </dt>
                <dd className="mt-2">
                  <a className="font-semibold text-hydro-400 transition-colors hover:text-hydro-300" href="tel:+12816945754">
                    (281) 694-5754
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-fog-400">
                  License coordination
                </dt>
                <dd className="mt-2 text-sm leading-6 text-fog-200">
                  Work coordinated under Texas Master Plumber License {MASTER_PLUMBER_LICENSE}.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="bg-ink-950/50 py-16 lg:py-20" aria-labelledby="manufacturer-authorization">
          <div className="section-container">
            <div className="max-w-4xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-signal-400">
                Verified business relationships
              </p>
              <h2 id="manufacturer-authorization" className="font-display text-3xl text-fog-50 sm:text-4xl">
                Manufacturer authorization
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-fog-200">
                {manufacturerAuthorizationSummary} HydroSense also supports additional
                compatible smart water shutoff systems based on the home&apos;s plumbing,
                line size, power, connectivity, and installation requirements.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-hydro-400/30 bg-hydro-400/[0.06] p-7 lg:p-8" aria-labelledby="authorized-manufacturers">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hydro-400">
                  Authorized
                </p>
                <h3 id="authorized-manufacturers" className="sr-only">
                  Authorized manufacturers
                </h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {manufacturerAuthorizations.map((authorization) => (
                    <Link
                      key={authorization.deviceSlug}
                      href={`/devices/${authorization.deviceSlug}`}
                      className="rounded-xl border border-ink-700/50 bg-ink-900/50 p-5 transition-colors hover:border-hydro-400/50"
                    >
                      <span className="block font-semibold text-fog-50">
                        {authorization.manufacturer}
                      </span>
                      <span className="mt-1 block text-sm text-fog-300">
                        {authorization.publicLabel}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-ink-700/40 bg-ink-800/40 p-7 lg:p-8" aria-labelledby="supported-manufacturers">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-400">
                  Supported
                </p>
                <h3 id="supported-manufacturers" className="sr-only">
                  Supported manufacturers
                </h3>
                <div className="mt-5 grid gap-3">
                  {supportedDevices.map((device) => (
                    <Link
                      key={device.slug}
                      href={`/devices/${device.slug}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-ink-700/40 bg-ink-900/30 px-5 py-4 text-sm font-medium text-fog-200 transition-colors hover:border-ink-600 hover:text-white"
                    >
                      {device.name}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-6 text-fog-400">
                  Supported means HydroSense can evaluate and install compatible systems;
                  it does not represent manufacturer authorization.
                </p>
              </section>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="grid gap-8 rounded-2xl border border-ink-700/40 bg-ink-800/40 p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-400">
                  Installation accountability
                </p>
                <h2 className="mt-3 font-display text-3xl text-fog-50">
                  Scope, test, document, and hand off.
                </h2>
                <p className="mt-4 leading-7 text-fog-200">
                  The domestic household water line is the standard scope. Fire-sprinkler
                  and fire-suppression piping are excluded. Irrigation is optional only
                  when specifically requested, technically reviewed, and included in the
                  written proposal. Work is coordinated under Texas Master Plumber License
                  {` ${MASTER_PLUMBER_LICENSE}`}.
                </p>
                <div className="mt-6 border-t border-ink-700/50 pt-6">
                  <p className="text-sm font-semibold text-fog-50">
                    Published installation starting range: {installationPriceRange}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-fog-300">
                    <li>
                      1.5-inch domestic main: {formatUsd(oneAndOneHalfInchAmount)} — {oneAndOneHalfInchService.deviceFamily?.name} large-line system and standard installation.
                    </li>
                    <li>
                      2-inch domestic main: {formatUsd(twoInchAmount)} — {twoInchService.deviceFamily?.name} {twoInchService.commercialGradeDeviceIncluded ? "commercial grade" : "standard grade"} large-line system and standard installation.
                    </li>
                  </ul>
                  <p className="mt-3 text-sm leading-6 text-fog-400">
                    Published amounts are starting prices. The final written proposal confirms device compatibility, materials, routing, exclusions, and project price.
                  </p>
                </div>
              </div>
              <Button href="/#lead-form" color="cyan" className="!rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !font-semibold !text-ink-950 hover:!bg-hydro-300">
                Check availability
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
