import { Metadata } from "next";
import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Frozen Pipe Water Damage Insurance in Texas | Freeze Damage Guide | HydroSense",
  description:
    "How freeze damage claims work in Texas. Winter Storm Uri caused $10B+ in losses. A smart shutoff catches pipe failures in seconds, not hours. Licensed install.",
  alternates: {
    canonical: "https://hydrosensetx.com/freeze-damage-texas",
  },
  openGraph: {
    title: "Freeze Damage Claims in Texas | HydroSense",
    description:
      "The difference between a $280 drywall patch and a $35,000 remediation is whether the water ran for 8 seconds or 8 hours.",
    url: "https://hydrosensetx.com/freeze-damage-texas",
    siteName: "HydroSense Texas",
    type: "article",
  },
};

export default function FreezeDamageGuide() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hydrosensetx.com" },
      { "@type": "ListItem", position: 2, name: "Freeze Damage in Texas", item: "https://hydrosensetx.com/freeze-damage-texas" },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Frozen Pipe Water Damage Insurance in Texas",
    author: { "@type": "Organization", name: "HydroSense Texas" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    description: "How freeze damage claims actually work in Texas and why carriers reward smart water shutoff devices.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can freeze damage show up weeks after the event?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Supply lines develop hairline cracks under pressure that hold for days or weeks. The pipe does not burst during the freeze. It fails later when pressure fluctuates and the weakened fitting gives way.",
        },
      },
      {
        "@type": "Question",
        name: "How much did Winter Storm Uri cost Texas insurers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over $10 billion in total insurance industry losses. The single largest cause category was burst supply lines downstream of unattended main shutoffs.",
        },
      },
      {
        "@type": "Question",
        name: "How fast does a smart water shutoff respond to a pipe burst?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Approximately 8 seconds. The difference between a $280 drywall patch and a $35,000 remediation is whether the water ran for seconds or hours.",
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
            <span className="text-fog-200">Freeze Damage in Texas</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Texas freeze risk guide
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] text-fog-50 mb-6">
              Everything seemed fine after the freeze.{" "}
              <span className="text-fog-200">Then it wasn't.</span>
            </h1>
          </div>
        </section>

        {/* Long-form content */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed max-w-xl">
                <p>
                  A hard freeze does not always announce itself immediately.
                  Supply lines develop hairline cracks under pressure that hold
                  for days, weeks, sometimes months. The pipe does not burst
                  during the event. It fails at 2 AM on a Tuesday in March when
                  the pressure fluctuates and the weakened fitting gives way.
                </p>
                <p>
                  By the time the homeowner notices, there are 200 gallons of
                  water behind the drywall. The damage is not a broken pipe. The
                  damage is mold remediation, subfloor replacement, and a
                  restoration crew in your home for three weeks.
                </p>
                <p>
                  This is not hypothetical. This is the single most common claim
                  pattern in the Houston metro insurance market. Carriers know
                  it. That is why they reward the shutoff. The device catches the
                  failure at the moment it begins, not hours later when the
                  ceiling is sagging.
                </p>
                <p>
                  A smart shutoff valve monitors flow and pressure continuously.
                  When it detects an anomaly consistent with a leak, it closes
                  the main water line within seconds. No human intervention
                  required. The difference between a{" "}
                  <span className="font-mono text-hydro-400">$280</span> drywall
                  patch and a{" "}
                  <span className="font-mono text-signal-400">$35,000</span>{" "}
                  remediation is whether the water ran for 8 seconds or 8 hours.
                </p>
                <p>
                  Understanding{" "}
                  <a href="/insurance/ho-a-vs-ho-b-ho-3" className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors">
                    which insurance form you carry (HO-A, HO-B, or HO-3)
                  </a>{" "}
                  matters here too. On HO-A, your freeze damage claim settles at
                  depreciated value, not replacement cost. Prevention is worth
                  even more when your coverage pays less.
                </p>
              </div>

              {/* Data cards */}
              <div className="space-y-6 lg:sticky lg:top-32">
                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                  <p className="font-mono text-5xl lg:text-6xl text-signal-400 tracking-tight leading-none mb-4">
                    $10B+
                  </p>
                  <p className="text-fog-50 font-semibold text-lg mb-3">
                    Texas insurance industry losses from Winter Storm Uri
                  </p>
                  <p className="text-fog-300 leading-relaxed">
                    The single largest cause category was burst supply lines
                    downstream of unattended main shutoffs. Homes with smart
                    shutoff devices filed claims at a fraction of the rate.
                  </p>
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mt-5">
                    Texas Department of Insurance, 2021 catastrophe report
                  </p>
                </div>

                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="font-mono text-3xl text-hydro-400 tracking-tight">8 sec</p>
                      <p className="text-sm text-fog-300 mt-2">Typical shutoff response time</p>
                    </div>
                    <div>
                      <p className="font-mono text-3xl text-signal-400 tracking-tight">$35,000</p>
                      <p className="text-sm text-fog-300 mt-2">Average unmitigated water claim</p>
                    </div>
                    <div>
                      <p className="font-mono text-3xl text-hydro-400 tracking-tight">$280</p>
                      <p className="text-sm text-fog-300 mt-2">Average mitigated repair cost</p>
                    </div>
                    <div>
                      <p className="font-mono text-3xl text-signal-400 tracking-tight">125x</p>
                      <p className="text-sm text-fog-300 mt-2">Cost difference: caught vs. missed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl text-fog-50 mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                <h3 className="text-fog-50 font-semibold text-lg mb-3">Can freeze damage show up weeks after the event?</h3>
                <p className="text-fog-200 leading-relaxed">
                  Yes. Supply lines develop hairline cracks under pressure that hold for days or weeks.
                  The pipe does not burst during the freeze. It fails later when pressure fluctuates
                  and the weakened fitting gives way.
                </p>
              </div>
              <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                <h3 className="text-fog-50 font-semibold text-lg mb-3">How much did Winter Storm Uri cost Texas insurers?</h3>
                <p className="text-fog-200 leading-relaxed">
                  Over $10 billion in total insurance industry losses. The single largest cause
                  category was burst supply lines downstream of unattended main shutoffs.
                </p>
              </div>
              <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                <h3 className="text-fog-50 font-semibold text-lg mb-3">How fast does a smart water shutoff respond to a pipe burst?</h3>
                <p className="text-fog-200 leading-relaxed">
                  Approximately 8 seconds. The difference between a $280 drywall patch and a $35,000
                  remediation is whether the water ran for seconds or hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="py-16 lg:py-20 bg-ink-950/50">
          <div className="section-container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <a href="/insurance/ho-a-vs-ho-b-ho-3" className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group">
                <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">Guide</p>
                <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">HO-A vs HO-B vs HO-3 in Texas</p>
                <p className="text-fog-300 text-sm">Your policy form determines how water damage claims settle.</p>
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
