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
      <main className="bg-white text-slate-950">
        <Hero />
        <CustomerJourney />
        <Pricing />
        <ServiceArea />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
