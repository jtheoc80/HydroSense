"use client";

import { useState } from "react";
import { homeFaqs } from "@/lib/home-faqs";
import TrackedPhoneLink from "./TrackedPhoneLink";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="section-container max-w-3xl">
        <div className="mb-14">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
            Common questions
          </p>
          <h2 className="font-display text-3xl text-fog-50 sm:text-4xl lg:text-[2.75rem]">
            Smart shutoff installation FAQ
          </h2>
        </div>

        <div className="divide-y divide-ink-700/50">
          {homeFaqs.map((faq, index) => (
            <div key={faq.q}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="group flex w-full items-center justify-between py-6 text-left"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="pr-6 text-base font-medium leading-snug text-fog-50 transition-colors group-hover:text-hydro-400">
                  {faq.q}
                </span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-700/40 bg-ink-800/60 transition-all ${openIndex === index ? "border-hydro-400/30 bg-hydro-400/10" : ""}`}>
                  <svg className={`h-4 w-4 text-fog-300 transition-transform duration-200 ${openIndex === index ? "rotate-180 text-hydro-400" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div id={`faq-answer-${index}`} className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-[32rem] pb-6" : "max-h-0"}`}>
                <p className="pr-12 leading-relaxed text-fog-300">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <TrackedPhoneLink trackingLocation="faq" className="inline-flex items-center justify-center rounded-lg bg-hydro-400 px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-hydro-400/20 transition-all hover:bg-hydro-300">
            Still have questions? Call (281) 694-5754
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
