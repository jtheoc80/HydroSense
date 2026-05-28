import CriticalBar from "@/components/CriticalBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CriticalStatements from "@/components/CriticalStatements";
import FreezeDamage from "@/components/FreezeDamage";
import InsuranceForms from "@/components/InsuranceForms";
import SavingsEstimator from "@/components/SavingsEstimator";
import CustomerJourney from "@/components/CustomerJourney";
import TheCertificate from "@/components/TheCertificate";
import Pricing from "@/components/Pricing";
import CarriersSupported from "@/components/CarriersSupported";
import ServiceArea from "@/components/ServiceArea";
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
        <FreezeDamage />
        <InsuranceForms />
        <SavingsEstimator />
        <CustomerJourney />
        <TheCertificate />
        <Pricing />
        <CarriersSupported />
        <ServiceArea />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
