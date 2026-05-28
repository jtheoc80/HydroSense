import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CriticalStatements from "@/components/CriticalStatements";
import SavingsEstimator from "@/components/SavingsEstimator";
import TheCertificate from "@/components/TheCertificate";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CarriersSupported from "@/components/CarriersSupported";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CriticalBar />
      <Header />
      <main>
        <Hero />
        <CriticalStatements />
        <SavingsEstimator />
        <TheCertificate />
        <HowItWorks />
        <Pricing />
        <CarriersSupported />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
