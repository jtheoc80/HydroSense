"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import { Heading } from "./catalyst/heading";
import { homeFaqs } from "@/lib/home-faqs";
import TrackedPhoneLink from "./TrackedPhoneLink";

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-16 sm:py-20 lg:py-24 xl:py-28">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <Badge
              color="sky"
              className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]"
            >
              COMMON QUESTIONS
            </Badge>
            <Heading
              level={2}
              className="!mt-5 !text-balance !font-display !text-4xl !leading-[1.05] !tracking-[-0.025em] !text-[#001a4e] sm:!text-5xl"
            >
              Questions before you schedule.
            </Heading>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Review compatibility, scope, pricing, installation, and handoff.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <TrackedPhoneLink
                trackingLocation="faq"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#001a4e] shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                <svg className="h-4 w-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.28 6.72 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.37c0-.52-.35-.97-.85-1.09l-4.42-1.11c-.44-.11-.9.06-1.17.42l-.97 1.29c-.28.38-.77.54-1.21.38a12.04 12.04 0 0 1-7.14-7.14c-.16-.44 0-.93.38-1.21l1.29-.97c.36-.27.53-.73.42-1.17L6.96 3.1A1.13 1.13 0 0 0 5.87 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                Call (281) 694-5754
              </TrackedPhoneLink>
              <Button
                href="#lead-form"
                outline
                className="!rounded-full !border-slate-300 !bg-white !px-5 !py-3 !text-sm !font-semibold !text-[#001a4e] !shadow-sm hover:!border-slate-400 hover:!bg-slate-50"
              >
                Request an assessment
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[#f8fafc] px-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.6)] sm:px-7">
            {homeFaqs.map((faq) => (
              <Disclosure key={faq.q} as="div" className="border-b border-slate-200 last:border-b-0">
                {({ open }) => (
                  <>
                    <DisclosureButton className="group flex w-full items-center justify-between gap-6 py-6 text-left focus:outline-none sm:py-7">
                      <span className="text-base font-semibold leading-7 text-slate-950 transition-colors group-hover:text-sky-700 sm:text-lg">
                        {faq.q}
                      </span>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${open ? "border-sky-200 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300"}`}>
                        <svg className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-45" : ""}`} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <path strokeLinecap="round" d="M10 4v12M4 10h12" />
                        </svg>
                      </span>
                    </DisclosureButton>
                    <DisclosurePanel className="pb-7 pr-10 text-base leading-7 text-slate-600 sm:pr-16">
                      {faq.a}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
