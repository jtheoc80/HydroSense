import CriticalBar from "@/components/CriticalBar";
import ScrollToHash from "@/components/ScrollToHash";
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
import HowItWorks from "@/components/HowItWorks";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Will my carrier actually accept the certificate?", acceptedAnswer: { "@type": "Answer", text: "Yes. The HydroSense certificate documents a licensed installation of a carrier-recognized automatic water shutoff device, certified under a Texas Master Plumber license. We format it to match what underwriters expect. State Farm, USAA, Allstate, Farmers, Travelers, and every other major Texas carrier has published discount tiers for this class of device. If your agent needs a specific format, we accommodate it." } },
    { "@type": "Question", name: "What is the typical discount?", acceptedAnswer: { "@type": "Answer", text: "Published tiers range from 4% to 15% off your homeowners premium, applied to the water-damage portion of your policy. On an average Houston premium of $6,600, that works out to $264 to $990 per year. Your actual credit depends on your carrier and policy structure." } },
    { "@type": "Question", name: "What is the difference between HO-A, HO-B, and HO-3?", acceptedAnswer: { "@type": "Answer", text: "HO-A is named-peril, actual cash value (depreciated). HO-B is open-peril on the dwelling with replacement cost, historically the Texas gold standard but now phased out by many carriers. HO-3 is open-peril on the dwelling, named-peril on contents, replacement cost, and the form most Texas carriers default to today. The smart shutoff discount applies on all three forms, but the device protection is most critical on HO-A where claim settlements are depreciated." } },
    { "@type": "Question", name: "Can freeze damage show up weeks after the event?", acceptedAnswer: { "@type": "Answer", text: "Yes. This is the most common pattern. A hard freeze creates hairline cracks in supply lines that hold under normal pressure but fail days or weeks later when conditions shift. By the time the homeowner notices, water has been running behind walls for hours. The smart shutoff catches these failures at onset, not after damage accumulates." } },
    { "@type": "Question", name: "Why do I need the subscription?", acceptedAnswer: { "@type": "Answer", text: "You don't. The standalone install at $999 includes the device and the certificate. The subscription adds annual certificate renewal (so the discount stays applied at each policy renewal), 24/7 leak monitoring alerts, and insurance liaison service. Most homeowners choose Standard because the annual renewal alone is worth it. Miss one renewal and the credit drops off your policy." } },
    { "@type": "Question", name: "What device will you install?", acceptedAnswer: { "@type": "Answer", text: "We install carrier-recognized devices: Moen Flo, Phyn, or StreamLabs. During the phone assessment we recommend the best fit based on your home's plumbing configuration, water pressure, and pipe material. All three qualify for the same insurance credits." } },
    { "@type": "Question", name: "How long does the install take?", acceptedAnswer: { "@type": "Answer", text: "Approximately two hours on site. Our trained, licensed technicians perform the installation at your main water line under the supervision of our Texas Registered Master Plumber, whose license certifies the work. No drywall cuts, no damage, no mess. Your water is off for roughly 30 minutes during the swap." } },
    { "@type": "Question", name: "Who performs the installation?", acceptedAnswer: { "@type": "Answer", text: "Your install is performed by trained, licensed technicians. Our Texas Registered Master Plumber trains and supervises the install team and holds the license that certifies every installation for your insurer. This is the standard structure for licensed plumbing work in Texas, and it is what lets us schedule installs quickly across the Houston metro while keeping every job certified." } },
    { "@type": "Question", name: "When do I get my certificate?", acceptedAnswer: { "@type": "Answer", text: "After your final payment, we issue the certificate in both paper and digital form. The digital copy is emailed to you and, with your permission, to your agent. You keep the paper copy for your records. We reissue it annually so the discount stays applied at each renewal." } },
    { "@type": "Question", name: "What does $999+ really mean?", acceptedAnswer: { "@type": "Answer", text: "The base install is $999 for a standard single-family home with accessible main line. Homes with non-standard configurations (slab foundation access, recirculation systems, or dual mains) may require additional work. We quote the exact price during the 15-minute phone assessment before scheduling anything." } },
    { "@type": "Question", name: "Do you monitor my home 24/7?", acceptedAnswer: { "@type": "Answer", text: "The device monitors water flow continuously and will automatically shut off the main if it detects a leak pattern. With a Standard or Premier subscription, you also receive real-time alerts on your phone. Without a subscription, the device still operates autonomously. It just won't push notifications to you." } },
  ],
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
        <HowItWorks />
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
