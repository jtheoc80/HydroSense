"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Will my carrier actually accept the certificate?",
    a: "Yes. The HydroSense certificate documents a Texas Master Plumber installation of a carrier-recognized automatic water shutoff device. We format it to match what underwriters expect. State Farm, USAA, Allstate, Farmers, Travelers, and every other major Texas carrier has published discount tiers for this class of device. If your agent needs a specific format, we accommodate it.",
  },
  {
    q: "What is the typical discount?",
    a: "Published tiers range from 4% to 15% off your homeowners premium, applied to the water-damage portion of your policy. On an average Houston premium of $6,600, that works out to $264 to $990 per year. Your actual credit depends on your carrier and policy structure.",
  },
  {
    q: "What is the difference between HO-A, HO-B, and HO-3?",
    a: "HO-A covers 10 named perils at actual cash value (depreciated). HO-B covers 16 named perils at replacement cost. HO-3 is open peril with replacement cost, the broadest standard form. The smart shutoff discount applies on all three forms, but the device protection is most critical on HO-A where claim settlements are depreciated.",
  },
  {
    q: "Can freeze damage show up weeks after the event?",
    a: "Yes. This is the most common pattern. A hard freeze creates hairline cracks in supply lines that hold under normal pressure but fail days or weeks later when conditions shift. By the time the homeowner notices, water has been running behind walls for hours. The smart shutoff catches these failures at onset, not after damage accumulates.",
  },
  {
    q: "Why do I need the subscription?",
    a: "You don't. The standalone install at $999 includes the device and the certificate. The subscription adds annual certificate renewal (so the discount stays applied at each policy renewal), 24/7 leak monitoring alerts, and insurance liaison service. Most homeowners choose Standard because the annual renewal alone is worth it. Miss one renewal and the credit drops off your policy.",
  },
  {
    q: "What device will you install?",
    a: "We install carrier-recognized devices: Moen Flo, Phyn, or StreamLabs. During the phone assessment we recommend the best fit based on your home's plumbing configuration, water pressure, and pipe material. All three qualify for the same insurance credits.",
  },
  {
    q: "How long does the install take?",
    a: "Approximately 2 hours on site. A Texas Master Plumber (License MPL 43057) handles the full installation at your main water line. No drywall cuts, no damage, no mess. Your water is off for roughly 30 minutes during the swap.",
  },
  {
    q: "What does $999+ really mean?",
    a: "The base install is $999 for a standard single-family home with accessible main line. Homes with non-standard configurations (slab foundation access, recirculation systems, or dual mains) may require additional work. We quote the exact price during the 15-minute phone assessment before scheduling anything.",
  },
  {
    q: "Do you monitor my home 24/7?",
    a: "The device monitors water flow continuously and will automatically shut off the main if it detects a leak pattern. With a Standard or Premier subscription, you also receive real-time alerts on your phone. Without a subscription, the device still operates autonomously. It just won't push notifications to you.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="section-container max-w-3xl">
        <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-12">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-ink-700">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="text-fog-50 font-medium pr-4 group-hover:text-hydro-400 transition-colors">
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-fog-300 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="pb-5 text-fog-300 leading-relaxed text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#lead-form" className="btn-primary text-sm">
            Still have questions? We will call you.
          </a>
        </div>
      </div>
    </section>
  );
}
