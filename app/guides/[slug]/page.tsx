import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommercialGuideTable, {
  type CommercialGuideTableColumn,
  type CommercialGuideTableRow,
} from "@/components/CommercialGuideTable";
import CriticalBar from "@/components/CriticalBar";
import DirectAnswer from "@/components/DirectAnswer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/catalyst/badge";
import { Button } from "@/components/catalyst/button";
import {
  commercialGuideSlugs,
  comparisonGuideRows,
  getCommercialGuide,
  installationGuideRows,
  outageGuideRows,
  type CommercialGuideKind,
} from "@/lib/guides/commercial-guides";
import { absoluteSearchUrl } from "@/lib/seo/indexable-pages";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return commercialGuideSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = getCommercialGuide(params.slug);
  if (!guide) return {};

  const canonical = absoluteSearchUrl(guide.href);
  return {
    title: { absolute: guide.metaTitle },
    description: guide.metaDescription,
    alternates: { canonical: canonical },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: canonical,
      siteName: "HydroSense Texas",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}

function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-900">
      {children}
    </Link>
  );
}

function GuideEvidenceTable({ kind }: { kind: CommercialGuideKind }) {
  let eyebrow = "Decision table";
  let heading = "Compare the conditions that change the recommendation";
  let context = "Use this table as a planning tool. The written proposal confirms the actual home and equipment.";
  let columns: readonly CommercialGuideTableColumn[] = [];
  let rows: readonly CommercialGuideTableRow[] = [];
  let minWidthClassName = "min-w-[860px]";

  if (kind === "cost") {
    eyebrow = "Catalog-backed prices";
    heading = "Starting prices by verified incoming domestic-main size";
    context = "Every row is generated from the active HydroSense service catalog. Additional material or non-standard work is confirmed in the written proposal.";
    columns = [
      { key: "line", label: "Incoming line" },
      { key: "price", label: "Starting price" },
      { key: "included", label: "Included standard scope" },
      { key: "notes", label: "Device / grade note" },
    ];
    rows = installationGuideRows.map((row) => ({
      key: row.lineSize,
      cells: {
        line: row.lineSize,
        price: <span className="font-mono text-base text-slate-950">{row.price}</span>,
        included: row.inclusion,
        notes: row.commercialGrade ? `${row.approach}; commercial grade` : row.approach,
      },
    }));
  } else if (kind === "sizing") {
    eyebrow = "HydroSense sizing map";
    heading = "How line size changes the supported approach";
    context = "The table maps verified domestic-main size to HydroSense's current supported approach without guaranteeing a model before compatibility review.";
    columns = [
      { key: "line", label: "Incoming line" },
      { key: "approach", label: "HydroSense approach" },
      { key: "price", label: "Published starting price" },
      { key: "verification", label: "What must be verified" },
    ];
    rows = installationGuideRows.map((row) => ({
      key: row.lineSize,
      cells: {
        line: row.lineSize,
        approach: row.commercialGrade ? `${row.approach}; commercial-grade context` : row.approach,
        price: <span className="font-mono text-base text-slate-950">{row.price}</span>,
        verification: row.verification,
      },
    }));
  } else if (kind === "comparison") {
    eyebrow = "Four supported inline profiles";
    heading = "Compare detection, installation, connectivity, and line-size fit";
    context = "The comparison is generated from HydroSense's governed device data. Manufacturer requirements are reconfirmed for the selected model before proposal.";
    columns = [
      { key: "device", label: "Device" },
      { key: "detection", label: "Detection approach" },
      { key: "install", label: "Installation type" },
      { key: "line", label: "Typical line-size fit" },
      { key: "power", label: "Power profile" },
      { key: "connectivity", label: "Connectivity profile" },
      { key: "local", label: "Local / offline behavior" },
      { key: "large", label: "Large-line suitability" },
      { key: "fit", label: "HydroSense best-fit interpretation" },
    ];
    rows = comparisonGuideRows.map((row) => ({
      key: row.device,
      cells: {
        device: <GuideLink href={row.href}>{row.device}</GuideLink>,
        detection: row.detection,
        install: row.installation,
        line: row.lineSizeFit,
        power: row.power,
        connectivity: row.connectivity,
        local: row.localBehavior,
        large: row.largeLineFit,
        fit: row.bestFit,
      },
    }));
    minWidthClassName = "min-w-[1560px]";
  } else if (kind === "outage") {
    eyebrow = "Device-specific behavior";
    heading = "Separate local protection from connected features";
    context = "Wi-Fi loss, internet loss, and AC power loss are different events. This table limits claims to the governed HydroSense device facts.";
    columns = [
      { key: "device", label: "Device" },
      { key: "monitoring", label: "Local monitoring context" },
      { key: "shutoff", label: "Automatic shutoff context" },
      { key: "remote", label: "App alerts / remote control" },
      { key: "power", label: "Power / battery profile" },
    ];
    rows = outageGuideRows.map((row) => ({
      key: row.device,
      cells: {
        device: <GuideLink href={row.href}>{row.device}</GuideLink>,
        monitoring: row.monitoring,
        shutoff: row.automaticShutoff,
        remote: row.appAndRemote,
        power: row.powerProfile,
      },
    }));
    minWidthClassName = "min-w-[1180px]";
  } else {
    return null;
  }

  return (
    <section className="border-b border-slate-200 bg-[#f7fbff] py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e] sm:text-5xl">{heading}</h2>
          <p className="mt-5 text-base leading-7 text-slate-600">{context}</p>
        </div>
        <div className="mt-9">
          <CommercialGuideTable
            caption={heading}
            columns={columns}
            rows={rows}
            minWidthClassName={minWidthClassName}
          />
        </div>
      </div>
    </section>
  );
}

export default function CommercialGuidePage({ params }: PageProps) {
  const guide = getCommercialGuide(params.slug);
  if (!guide) notFound();

  return (
    <>
      <CriticalBar />
      <Header />
      <main className="bg-white text-slate-950">
        <div className="bg-[#00163f] pt-8">
          <div className="section-container">
            <Breadcrumbs
              trailId={`commercial-guide-${guide.slug}`}
              tone="dark"
              items={[
                { name: "Home", href: "/" },
                { name: "Guides", href: "/guides" },
                { name: guide.title, href: guide.href },
              ]}
            />
          </div>
        </div>

        <section className="relative overflow-hidden bg-[#00163f] pb-20 pt-14 text-white sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
          <div className="pointer-events-none absolute -right-44 -top-52 h-[34rem] w-[34rem] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="section-container relative">
            <div className="max-w-5xl">
              <Badge color="sky" className="!rounded-full !bg-sky-300/10 !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em] !text-sky-200">
                {guide.eyebrow}
              </Badge>
              <h1 className="mt-6 max-w-5xl text-balance font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                {guide.h1}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{guide.intro}</p>
              <DirectAnswer
                question={guide.directQuestion}
                answer={guide.directAnswer}
                homeownerMeaning={guide.homeownerMeaning}
              />
            </div>
          </div>
        </section>

        <GuideEvidenceTable kind={guide.kind} />

        <div>
          {guide.sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              className={`py-16 sm:py-20 lg:py-24 ${index % 2 === 1 ? "border-y border-slate-200 bg-slate-50" : "bg-white"}`}
            >
              <div className="section-container grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{section.eyebrow}</p>
                  <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-[-0.025em] text-[#001a4e] sm:text-5xl">
                    {section.heading}
                  </h2>
                </div>
                <div className="space-y-5 text-base leading-8 text-slate-600">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? (
                    <ul className="mt-6 space-y-4">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>

        {guide.sourceNotes ? (
          <section className="border-t border-slate-200 bg-[#f7fbff] py-14 sm:py-16">
            <div className="section-container">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Source governance</p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.02em] text-[#001a4e]">Official manufacturer references</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                Product capabilities can change. HydroSense uses the governed device data for planning and reconfirms current manufacturer requirements before the written proposal.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guide.sourceNotes.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-sm"
                  >
                    <span className="font-semibold text-[#001a4e]">{source.label} ↗</span>
                    <span className="mt-2 block text-sm leading-6 text-slate-500">{source.note}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
          <div className="section-container">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Related decisions</p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl tracking-[-0.025em] text-[#001a4e]">
              Continue with the pages that confirm device fit, price, and service availability.
            </h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guide.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-sky-300 hover:bg-sky-50">
                  <span className="font-semibold text-[#001a4e] transition group-hover:text-sky-700">{link.label} →</span>
                  <span className="mt-2 block text-sm leading-6 text-slate-500">{link.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#00163f] py-16 text-white sm:py-20">
          <div className="section-container flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Property-specific next step</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] sm:text-5xl">Turn the guide answer into a written home scope.</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">HydroSense reviews service area, domestic-main conditions, device compatibility, power, connectivity, and exclusions before scheduling.</p>
            </div>
            <Button href="/#lead-form" color="cyan" className="!shrink-0 !rounded-full !border-transparent !bg-hydro-400 !px-7 !py-3.5 !text-sm !font-semibold !text-ink-950 hover:!bg-hydro-300">
              Request compatibility review
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
