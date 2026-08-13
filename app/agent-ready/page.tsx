import type { Metadata } from "next";
import CriticalBar from "@/components/CriticalBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/catalyst/button";
import { serviceCatalog } from "@/lib/service-catalog/catalog";

export const metadata: Metadata = {
  title: "Agent-ready HydroSense pricing and service discovery",
  description:
    "Discover HydroSense stable service IDs, versioned pricing, deterministic serviceability and estimate APIs, and the current read-only A2A authority boundary.",
  alternates: { canonical: "https://hydrosensetx.com/agent-ready" },
};

const endpoints = [
  ["Catalog", "/service-catalog.json", "Stable active services and scope"],
  ["OpenAPI", "/openapi.json", "OpenAPI 3.1 REST and A2A contract"],
  ["Agent Card", "/.well-known/agent-card.json", "A2A v1.0 discovery document"],
  ["Services", "/api/public/v1/services", "Active public service collection"],
  ["Serviceability", "/api/public/v1/serviceability", "POST a five-digit ZIP only"],
  ["Estimate", "/api/public/v1/estimate", "POST confirmed standard-scope inputs"],
  ["A2A", "/api/a2a", "JSON-RPC 2.0 SendMessage"],
] as const;

const limits = [
  "Schedule, reschedule, or cancel an assessment or installation",
  "Accept or decline a written quote",
  "Authorize payment or create a checkout session",
  "Collect customer identity, address, contact, or payment data",
  "Grant scope on fire-sprinkler or fire-suppression piping",
];

export default function AgentReadyPage() {
  return (
    <>
      <CriticalBar />
      <Header />
      <main className="bg-white text-slate-950">
        <section className="relative overflow-hidden bg-[#00163f] py-20 text-white sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />
          <div className="section-container relative grid gap-10 lg:grid-cols-[1.1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Agent-ready foundation</p>
              <h1 className="mt-5 text-balance font-display text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                Home water protection structured for the agent economy.
              </h1>
            </div>
            <div>
              <p className="text-lg leading-8 text-slate-300">
                One versioned catalog for people, crawlers, APIs, structured data, and A2A clients—with explicit limits on what a public agent may claim or do.
              </p>
              <Button href="/pricing" color="cyan" className="!mt-7 !rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-sm !font-semibold !text-ink-950 hover:!bg-hydro-300">
                View human-readable pricing
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="section-container grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Deterministic foundation</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e] sm:text-5xl">Stable facts before actions.</h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 sm:grid-cols-2">
              {[
                ["Stable service IDs", "Permanent SKU-style identifiers instead of display-copy matching."],
                ["Versioned catalog", `${serviceCatalog.catalogVersion}, effective ${serviceCatalog.effectiveDate}, in USD.`],
                ["Exact standard prices", "Five incoming-line rates include one compatible device and standard installation."],
                ["Explicit scope", "Domestic water is standard; irrigation is quoted; fire-suppression piping is excluded."],
                ["Deterministic ZIP checks", "Known ZIPs match markets; unknown ZIPs request manual review, never automatic rejection."],
                ["Separated totals", "Installation, confirmed sensors, and confirmed battery form the one-time total. Optional annual care is returned separately as $99 every P1Y."],
              ].map(([title, copy]) => (
                <article key={title} className="bg-white p-7">
                  <h3 className="font-semibold text-[#001a4e]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-600">
              <code>oneTimeCatalogTotal</code> never includes annual care. <code>recurringSelections</code> carries the optional $99 annual service, while <code>publishedCatalogTotal</code> remains a backward-compatible alias for the one-time total only.
            </p>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
          <div className="section-container">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Discovery surface</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e]">Public, no-auth, and read-only.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Responses identify the API and catalog version. POST responses are not cached, bodies are bounded, and no endpoint asks for identity or a street address.
              </p>
            </div>
            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {endpoints.map(([label, href, note]) => (
                <a key={href} href={href} className="group grid gap-2 py-5 sm:grid-cols-[0.45fr_1fr_1fr] sm:items-baseline sm:gap-6">
                  <span className="font-semibold text-[#001a4e] group-hover:text-sky-700">{label}</span>
                  <code className="break-all text-sm text-sky-700">{href}</code>
                  <span className="text-sm text-slate-500">{note}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="section-container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Current authority boundary</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e]">This public agent cannot transact.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Authority is limited to catalog discovery, ZIP-level serviceability, and published-price calculations. A final written proposal is always required.
              </p>
              <ul className="mt-8 space-y-4">
                {limits.map((limit) => (
                  <li key={limit} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">×</span>
                    {limit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] bg-[#00163f] p-7 text-white sm:p-9 lg:p-11">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">A2A v1.0</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.025em]">Three synchronous skills.</h2>
              <ol className="mt-8 space-y-6">
                {[
                  ["get_service_catalog", "Return active public services and scope."],
                  ["check_serviceability", "Match a ZIP or request manual service-area review."],
                  ["estimate_standard_installation", "Calculate a one-time catalog total, return recurring selections separately, and expose review conditions."],
                ].map(([skill, copy], index) => (
                  <li key={skill} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="font-mono text-sm text-sky-300">0{index + 1}</span>
                    <div>
                      <code className="break-all text-sm font-semibold text-white">{skill}</code>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-[#f7fbff] py-16 sm:py-20">
          <div className="section-container max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Future authenticated phase</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.025em] text-[#001a4e]">Scheduling follows only after this read-only contract is stable.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              A later phase may connect authenticated assessment scheduling and quote status to the existing closed-loop site-visit workflow. Those capabilities are intentionally absent today.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
