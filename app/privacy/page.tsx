import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | HydroSense Texas",
  description:
    "How HydroSense Texas collects, uses, and protects your personal information including form data, analytics, and SMS communications.",
  alternates: {
    canonical: "https://hydrosensetx.com/privacy",
  },
};

export default function PrivacyPolicy() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hydrosensetx.com" },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://hydrosensetx.com/privacy" },
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
              <li className="text-fog-200">Privacy Policy</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-4">
            Privacy Policy
          </h1>
          <p className="text-fog-400 text-sm mb-12">Last updated: May 28, 2026</p>

          <div className="prose-policy space-y-10 text-fog-100 text-base leading-relaxed">
            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Who we are</h2>
              <p>
                HydroSense Texas is a service of <strong className="text-fog-50">Lead Ledger Pro LLC</strong>, a Texas limited liability company. When this policy says "we," "us," or "our," it means Lead Ledger Pro LLC operating as HydroSense Texas.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Information we collect</h2>
              <p className="mb-4">When you submit the quote request form on our site, we collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-fog-200">
                <li>Name (first and last)</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Property address (optional)</li>
                <li>ZIP code</li>
                <li>Insurance carrier (optional)</li>
                <li>Any message you include in the form</li>
              </ul>
              <p className="mt-4 mb-4">We also collect automatically:</p>
              <ul className="list-disc pl-6 space-y-2 text-fog-200">
                <li>IP address (from the server request)</li>
                <li>Browser user agent string</li>
                <li>Page URL and referrer</li>
                <li>UTM campaign parameters (if present in the URL)</li>
                <li>Analytics data through Google Analytics 4 and Meta Pixel cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">How we use your information</h2>
              <ul className="list-disc pl-6 space-y-2 text-fog-200">
                <li>Contact you about the quote you requested</li>
                <li>Send transactional emails (quote confirmation, appointment booking links, process updates)</li>
                <li>Send transactional SMS messages if you provide a phone number</li>
                <li>Schedule and complete your smart water shutoff installation</li>
                <li>Build your insurance discount certificate after install and final payment</li>
                <li>Send the certificate to your insurance agent with your consent</li>
                <li>Improve our website, services, and marketing based on aggregate analytics</li>
              </ul>
            </section>

            <section className="bg-ink-900/60 border border-ink-700/40 rounded-xl p-6 lg:p-8">
              <h2 className="font-display text-xl text-fog-50 mb-4">SMS communications</h2>
              <p>
                If you provide your phone number, you consent to receive SMS messages from HydroSense Texas including quote confirmations, appointment booking links, and follow-up messages. Message frequency varies. Msg &amp; data rates may apply. Reply STOP at any time to opt out. Reply HELP for help.
              </p>
              <p className="mt-4 font-semibold text-fog-50">
                We do not sell or share mobile information with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Third-party services</h2>
              <p className="mb-4">We use the following third-party services to operate our business:</p>
              <ul className="list-disc pl-6 space-y-2 text-fog-200">
                <li><strong className="text-fog-50">Supabase</strong> — secure database for storing lead and customer information</li>
                <li><strong className="text-fog-50">Resend</strong> — transactional email delivery</li>
                <li><strong className="text-fog-50">Twilio</strong> — transactional SMS delivery</li>
                <li><strong className="text-fog-50">Cal.com</strong> — appointment booking and scheduling</li>
                <li><strong className="text-fog-50">Vercel</strong> — website hosting and infrastructure</li>
                <li><strong className="text-fog-50">Google Analytics 4</strong> — website analytics and conversion tracking</li>
                <li><strong className="text-fog-50">Meta Pixel</strong> — conversion tracking for advertising</li>
              </ul>
              <p className="mt-4">
                Each of these services has its own privacy policy. We share only the minimum information each service needs to function. We do not sell your personal information to any third party.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Cookies and tracking</h2>
              <p>
                Our site uses cookies placed by Google Analytics 4 and Meta Pixel to understand how visitors use the site and to measure advertising performance. These are standard analytics cookies. You can disable cookies in your browser settings or use an ad blocker to prevent them from loading.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Data retention</h2>
              <p>
                We retain your lead and customer information for as long as needed to provide our services and fulfill legal obligations. If you become a customer, we retain your install records and certificate information indefinitely since your insurance carrier may need to re-verify your certificate at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Your rights and data deletion</h2>
              <p>
                You can request access to, correction of, or deletion of your personal information at any time. To make a request, email us at{" "}
                <a href="mailto:privacy@hydrosensetx.com" className="text-hydro-400 hover:text-hydro-300 transition-colors">
                  privacy@hydrosensetx.com
                </a>. We will respond within 30 days. If you request deletion and are an active customer, we will explain what information we need to retain for your certificate and warranty records.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Children&apos;s privacy</h2>
              <p>
                Our services are not directed at anyone under 18. We do not knowingly collect personal information from minors. If you believe we have collected information from someone under 18, contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Changes to this policy</h2>
              <p>
                We may update this policy from time to time. If we make material changes, we will update the "Last updated" date at the top and, where appropriate, notify you by email.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-fog-50 mb-4">Contact</h2>
              <p>
                For privacy questions or data requests, email{" "}
                <a href="mailto:privacy@hydrosensetx.com" className="text-hydro-400 hover:text-hydro-300 transition-colors">
                  privacy@hydrosensetx.com
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
