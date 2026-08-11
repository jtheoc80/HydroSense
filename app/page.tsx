import type { Metadata } from "next";
import CriticalBar from "@/components/CriticalBar";
import ScrollToHash from "@/components/ScrollToHash";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CustomerJourney from "@/components/CustomerJourney";
import Pricing from "@/components/Pricing";
import ServiceArea from "@/components/ServiceArea";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import { homeFaqs } from "@/lib/home-faqs";

export const metadata: Metadata = {
  title: {
    absolute: "Smart Water Shutoff Installation Houston | HydroSense Texas",
  },
  description:
    "Professional Flo by Moen, Phyn Plus, and StreamLabs smart water shutoff installation across Greater Houston. App setup, shutoff testing, and installation records. Call (281) 694-5754.",
  alternates: {
    canonical: "https://hydrosensetx.com/",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ScrollToHash />
      <CriticalBar />
      <Header />
      <main>
        <Hero />
        <CustomerJourney />
        <Pricing />
        <ServiceArea />
        <FAQ />

        <section className="py-14 lg:py-20">
          <div className="section-container">
            <div className="rounded-2xl border border-ink-700/40 bg-ink-800/40 p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 lg:p-9">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-hydro-400">
                  Research before you schedule
                </p>
                <h2 className="font-display text-2xl text-fog-50 sm:text-3xl">
                  Compare devices and understand the installation requirements
                </h2>
              </div>
              <div className="mt-6 flex shrink-0 flex-wrap gap-4 sm:mt-0">
                <a href="/devices" className="text-sm font-semibold text-hydro-400 transition-colors hover:text-hydro-300">
                  Compare devices
                </a>
                <a href="/blog" className="text-sm font-semibold text-hydro-400 transition-colors hover:text-hydro-300">
                  Read installation guides
                </a>
              </div>
            </div>
          </div>
        </section>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
