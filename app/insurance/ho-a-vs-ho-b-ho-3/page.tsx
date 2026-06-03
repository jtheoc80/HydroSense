import { Metadata } from "next";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "HO-A vs HO-B vs HO-3 in Texas | Insurance Forms Guide | HydroSense",
  description:
    "Understand your Texas homeowners insurance form. HO-A pays depreciated value. HO-B and HO-3 pay replacement cost. The smart shutoff discount applies on all three.",
  alternates: {
    canonical: "https://hydrosensetx.com/insurance/ho-a-vs-ho-b-ho-3",
  },
  openGraph: {
    title: "HO-A vs HO-B vs HO-3 in Texas | HydroSense",
    description:
      "Your insurance form determines whether a water damage claim settles at replacement cost or depreciated value. That distinction can mean a $12,000 difference.",
    url: "https://hydrosensetx.com/insurance/ho-a-vs-ho-b-ho-3",
    siteName: "HydroSense Texas",
    type: "article",
  },
};

export default function InsuranceFormsGuide() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hydrosensetx.com" },
      { "@type": "ListItem", position: 2, name: "HO-A vs HO-B vs HO-3", item: "https://hydrosensetx.com/insurance/ho-a-vs-ho-b-ho-3" },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "HO-A vs HO-B vs HO-3 in Texas: What Your Homeowners Policy Actually Covers",
    author: { "@type": "Organization", name: "HydroSense Texas" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    description: "A guide to Texas homeowners insurance forms and how the smart water shutoff discount applies to each.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between HO-A, HO-B, and HO-3 in Texas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HO-A is named-peril with actual cash value (depreciated). HO-B is open-peril on the dwelling with replacement cost. HO-3 is open-peril on the dwelling, named-peril on contents, with replacement cost. HO-3 is the most common form in Texas today.",
        },
      },
      {
        "@type": "Question",
        name: "Does the smart water shutoff insurance discount apply to all Texas policy forms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The carrier-recognized certificate qualifies you for the water-damage credit on HO-A, HO-B, and HO-3 forms. The discount applies the moment the certificate is on file with your insurer.",
        },
      },
      {
        "@type": "Question",
        name: "Why does the policy form matter for water damage claims?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The form determines whether your claim settles at replacement cost or depreciated actual cash value. On HO-A, a burst supply line causing $18,000 in damage might settle at $6,000 after depreciation. On HO-B or HO-3, the same claim settles at $18,000.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CriticalBar />
      <Header />

      <main>
        <div className="section-container pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-fog-400">
            <a href="/" className="hover:text-fog-200 transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-fog-200">HO-A vs HO-B vs HO-3</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Texas insurance guide
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-6">
              HO-A vs HO-B vs HO-3 in Texas
            </h1>
            <p className="text-xl text-fog-200 leading-relaxed">
              Your insurance form determines whether a water damage claim settles
              at replacement cost or depreciated value. That single distinction
              can mean a{" "}
              <span className="font-mono text-signal-400">$12,000</span>{" "}
              difference on one event.
            </p>
          </div>
        </section>

        {/* Form comparison */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* HO-A */}
              <div className="rounded-2xl bg-ink-800/40 border border-ink-700/40 p-7 lg:p-9 flex flex-col">
                <h2 className="font-display text-xl lg:text-2xl text-fog-50 mb-2">HO-A (Basic)</h2>
                <p className="font-mono text-sm text-hydro-400 tracking-wide mb-6">Actual Cash Value</p>
                <p className="text-fog-200 leading-relaxed mb-6 flex-1">
                  Named-peril coverage on a limited list: fire, hail, wind, theft, and a few others.
                  Does not automatically cover sudden water discharge from plumbing. Claims settle at
                  actual cash value, meaning depreciated, not replacement. A 15-year-old water heater
                  that fails is valued at what a 15-year-old water heater is worth, not what a new one costs.
                </p>
                <div className="bg-ink-900/50 border border-ink-700/30 rounded-xl p-5 mb-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Example</p>
                  <p className="text-sm text-fog-200 leading-relaxed">
                    A burst supply line causing $18,000 in damage settles at roughly $6,000 after depreciation. You cover the gap.
                  </p>
                </div>
                <p className="text-sm font-semibold text-fog-50">
                  Least coverage. Lowest premium. Largest out-of-pocket exposure.
                </p>
              </div>

              {/* HO-B */}
              <div className="rounded-2xl bg-ink-800/40 border border-ink-700/40 p-7 lg:p-9 flex flex-col">
                <h2 className="font-display text-xl lg:text-2xl text-fog-50 mb-2">HO-B (Broad)</h2>
                <p className="font-mono text-sm text-hydro-400 tracking-wide mb-6">Open Peril Dwelling, Replacement Cost</p>
                <p className="text-fog-200 leading-relaxed mb-6 flex-1">
                  Open-peril coverage on the dwelling, named-peril on contents. Settles at replacement
                  cost. This was historically the Texas gold standard for water and foundation claims.
                  Many carriers have phased it out in favor of HO-3, but some still write it. Worth
                  asking your carrier by name.
                </p>
                <div className="bg-ink-900/50 border border-ink-700/30 rounded-xl p-5 mb-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Example</p>
                  <p className="text-sm text-fog-200 leading-relaxed">
                    The same $18,000 supply line claim settles at $18,000. You pay only the deductible.
                  </p>
                </div>
                <p className="text-sm font-semibold text-fog-50">
                  Replacement cost eliminates the depreciation gap. Ask your carrier if they still write this form.
                </p>
              </div>

              {/* HO-3 */}
              <div className="rounded-2xl bg-ink-800/80 border-2 border-hydro-400/30 shadow-lg shadow-hydro-400/5 p-7 lg:p-9 flex flex-col">
                <h2 className="font-display text-xl lg:text-2xl text-fog-50 mb-2">HO-3 (Special)</h2>
                <p className="font-mono text-sm text-hydro-400 tracking-wide mb-2">Open Peril Dwelling, Named Peril Contents</p>
                <span className="inline-block mb-6 text-[10px] uppercase tracking-[0.2em] font-semibold text-hydro-400 bg-hydro-400/10 px-3 py-1 rounded-full w-fit">
                  Most common today
                </span>
                <p className="text-fog-200 leading-relaxed mb-6 flex-1">
                  Open-peril on the dwelling, named-peril on contents, replacement cost. The national
                  standard and the form most Texas carriers now default to. Your dwelling is covered
                  against anything not specifically excluded.
                </p>
                <div className="bg-ink-900/50 border border-ink-700/30 rounded-xl p-5 mb-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Example</p>
                  <p className="text-sm text-fog-200 leading-relaxed">
                    An unusual loss not on a named-peril list is still covered, as long as the policy does not specifically exclude it.
                  </p>
                </div>
                <p className="text-sm font-semibold text-fog-50">
                  Broadest standard coverage. The default for most Texas carriers today.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Callout */}
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-3xl">
            <div className="bg-ink-800/60 border-l-4 border-l-signal-400 rounded-r-xl p-7 lg:p-9">
              <p className="text-fog-50 font-display text-xl mb-3">
                The smart shutoff discount applies on all three forms.
              </p>
              <p className="text-fog-300 leading-relaxed">
                Regardless of whether you carry HO-A, HO-B, or HO-3, the
                carrier-recognized certificate qualifies you for the water-damage
                credit. But if you are on HO-A, the device protection itself is
                even more critical because your claim settlement will be
                depreciated. Prevention is worth more when your coverage pays less.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                <h3 className="text-fog-50 font-semibold text-lg mb-3">
                  What is the difference between HO-A, HO-B, and HO-3 in Texas?
                </h3>
                <p className="text-fog-200 leading-relaxed">
                  HO-A is named-peril with actual cash value (depreciated). HO-B is open-peril on the
                  dwelling with replacement cost. HO-3 is open-peril on the dwelling, named-peril on
                  contents, with replacement cost. HO-3 is the most common form in Texas today.
                </p>
              </div>
              <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                <h3 className="text-fog-50 font-semibold text-lg mb-3">
                  Does the smart water shutoff insurance discount apply to all Texas policy forms?
                </h3>
                <p className="text-fog-200 leading-relaxed">
                  Yes. The carrier-recognized certificate qualifies you for the water-damage credit
                  on HO-A, HO-B, and HO-3 forms. The discount applies the moment the certificate
                  is on file with your insurer.
                </p>
              </div>
              <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                <h3 className="text-fog-50 font-semibold text-lg mb-3">
                  Why does the policy form matter for water damage claims?
                </h3>
                <p className="text-fog-200 leading-relaxed">
                  The form determines whether your claim settles at replacement cost or depreciated
                  actual cash value. On HO-A, a burst supply line causing $18,000 in damage might
                  settle at $6,000 after depreciation. On HO-B or HO-3, the same claim settles at $18,000.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="py-16 lg:py-20">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <a href="/service-area" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Service area</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">Houston metro service area</p>
                <p className="text-fog-300 text-sm">Seven cities across Greater Houston.</p>
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
