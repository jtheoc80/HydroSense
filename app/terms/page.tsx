import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | HydroSense Texas",
  description:
    "Terms of service for HydroSense Texas smart water shutoff installation, certificate issuance, and subscription services.",
  alternates: {
    canonical: "https://hydrosensetx.com/terms",
  },
};

export default function TermsOfService() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hydrosensetx.com" },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://hydrosensetx.com/terms" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="bg-ink-950 min-h-screen">
        <div className="section-container max-w-3xl py-20 lg:py-28">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-fog-400">
              <li><a href="/" className="hover:text-fog-200 transition-colors">Home</a></li>
              <li className="text-fog-400/50">/</li>
              <li className="text-fog-200">Terms of Service</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-4">
            Terms of Service
          </h1>
          <p className="text-fog-400 text-sm mb-12">Last updated: May 28, 2026</p>

          <div className="prose-policy space-y-10 text-fog-100 text-base leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Acceptance of terms</h2>
              <p>
                By using the HydroSense Texas website or purchasing our services, you agree to these terms. If you do not agree, do not use the site or purchase services. HydroSense Texas is operated by <strong className="text-fog-50">Lead Ledger Pro LLC</strong>, a Texas limited liability company. When these terms say "we," "us," or "our," they mean Lead Ledger Pro LLC doing business as HydroSense Texas.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Services</h2>
              <p className="mb-4">HydroSense Texas provides:</p>
              <ul className="list-disc pl-6 space-y-2 text-fog-200">
                <li><strong className="text-fog-50">Smart water shutoff installation</strong> — professional installation of an automatic water shutoff device at your home&apos;s main water line through a Texas-licensed plumbing partner under Responsible Master Plumber M-43057.</li>
                <li><strong className="text-fog-50">Insurance discount certificate</strong> — a certificate in paper and digital form documenting the installed device, issued after install completion and final payment. This certificate is designed for submission to your homeowners insurance carrier to request an applicable discount.</li>
                <li><strong className="text-fog-50">Optional monitoring subscription</strong> — ongoing device monitoring, anomaly alerts, and app access on a monthly subscription basis.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Pricing and payment</h2>
              <p className="mb-4">
                Installation starts at $999 depending on device selection, plumbing configuration, and property specifics. Final pricing is confirmed during the 15-minute quote call before any commitment.
              </p>
              <p className="mb-4">Optional monthly monitoring subscriptions:</p>
              <ul className="list-disc pl-6 space-y-2 text-fog-200">
                <li><strong className="text-fog-50">Essentials</strong> — $9/month</li>
                <li><strong className="text-fog-50">Plus</strong> — $19/month</li>
                <li><strong className="text-fog-50">Premium</strong> — $39/month</li>
              </ul>
              <p className="mt-4">
                All prices are in US dollars. Texas state and local sales tax may apply. Payment terms are specified in the service agreement you sign before installation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Certificate issuance</h2>
              <p>
                The insurance discount certificate is issued only after the installation is complete and final payment has been received in full. We do not issue certificates for partial payments or incomplete installations. Once issued, the certificate is yours to submit to your insurance carrier.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Cancellation and refunds</h2>
              <p className="mb-4">
                <strong className="text-fog-50">Before installation:</strong> You may cancel your service agreement at any time before the scheduled install date. Any deposit paid will be refunded in full minus the cost of any device already ordered on your behalf (if applicable).
              </p>
              <p className="mb-4">
                <strong className="text-fog-50">After installation:</strong> Because installation involves permanent plumbing modifications, completed installations are not eligible for refund. If there is a defect in workmanship, we will return to correct it at no additional charge within 12 months of install.
              </p>
              <p>
                <strong className="text-fog-50">Subscriptions:</strong> Monthly monitoring subscriptions can be cancelled at any time. Cancellation takes effect at the end of the current billing period. No partial-month refunds.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Installation and workmanship</h2>
              <p>
                HydroSense coordinates each project, and plumbing work is performed through a Texas-licensed plumbing partner under Responsible Master Plumber M-43057. Each device is installed according to the manufacturer&apos;s specifications and local plumbing codes. We warrant our workmanship (pipe fittings, mounting, and connections) for 12 months from the date of install.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Device warranty and performance</h2>
              <p>
                The smart water shutoff device itself is covered by the device manufacturer&apos;s warranty, not ours. Device performance, leak detection accuracy, app functionality, and automatic shutoff behavior are subject to the manufacturer&apos;s specifications and warranty terms. We do not guarantee any specific level of device performance beyond proper installation per the manufacturer&apos;s instructions.
              </p>
            </section>

            <section className="bg-ink-900/60 border border-ink-700/40 rounded-xl p-6 lg:p-8">
              <h2 className="font-display text-xl text-fog-50 mb-4">Insurance discount disclaimer</h2>
              <p>
                All savings estimates on this website are illustrative and based on published carrier discount tiers for automatic water shutoff devices. The actual insurance credit you receive depends on your specific carrier, policy type (HO-A, HO-B, HO-3, or other), coverage structure, underwriting guidelines, and your carrier&apos;s current discount schedule.
              </p>
              <p className="mt-4 font-semibold text-fog-50">
                We do not guarantee any specific discount amount. We provide the installation and certificate. Your insurance carrier determines the discount.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Limitation of liability</h2>
              <p>
                To the maximum extent permitted by Texas law, Lead Ledger Pro LLC&apos;s total liability for any claim arising from our services is limited to the amount you paid us for the specific service giving rise to the claim. We are not liable for indirect, incidental, consequential, or punitive damages including but not limited to water damage, property damage, or lost insurance discounts.
              </p>
              <p className="mt-4">
                We are not your insurance agent or broker. We do not provide insurance advice. For questions about your specific policy and available discounts, contact your insurance carrier or agent directly.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Website use</h2>
              <p>
                The content on this website is for informational purposes. We make reasonable efforts to keep information accurate and current but do not guarantee that all content is complete or error-free. Quote estimates provided through the website are preliminary and subject to confirmation during the quote call.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Governing law</h2>
              <p>
                These terms are governed by the laws of the State of Texas. Any disputes arising from these terms or our services will be resolved in the courts of Harris County, Texas.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Changes to these terms</h2>
              <p>
                We may update these terms from time to time. If we make material changes, we will update the "Last updated" date at the top. Continued use of our site or services after changes are posted constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Contact</h2>
              <p>
                Questions about these terms? Email{" "}
                <a href="mailto:hello@hydrosensetx.com" className="text-hydro-400 hover:text-hydro-300 transition-colors">
                  hello@hydrosensetx.com
                </a>{" "}
                or call{" "}
                <a href="tel:+12816945754" className="text-hydro-400 hover:text-hydro-300 transition-colors">
                  (281) 694-5754
                </a>.
              </p>
              <p className="mt-4 text-fog-300 text-sm">
                Lead Ledger Pro LLC<br />
                Houston, TX
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
