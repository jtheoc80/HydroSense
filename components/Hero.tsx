"use client";

import Image from "next/image";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import TrackedPhoneLink from "./TrackedPhoneLink";
import { manufacturerAuthorityShortLabel } from "@/lib/business/manufacturer-authorizations";

const assuranceItems = [
  {
    title: "Compatibility reviewed",
    body: "Domestic line, valve, pipe, power, and Wi-Fi checked before scheduling.",
  },
  {
    title: "Written proposal",
    body: "Device, installation scope, exclusions, price, and timing documented first.",
  },
  {
    title: "Tested handoff",
    body: "App setup, shutoff-cycle testing, and homeowner guidance included.",
  },
];

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[90rem] px-5 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pt-16 xl:pt-[4.5rem]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-14 xl:gap-20">
          <div className="min-w-0">
            <Badge
              color="sky"
              className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]"
            >
              SMART WATER PROTECTION · GREATER HOUSTON
            </Badge>

            <h1 className="mt-5 font-display text-[3.25rem] leading-[0.98] tracking-[-0.045em] text-[#001a4e] sm:text-[3.75rem] lg:text-[3.5rem] xl:text-[3.75rem]">
              <span data-heading-line="primary" className="block">
                Smart water shutoff installation,
              </span>
              {" "}
              <span data-heading-line="accent" className="block text-sky-600">
                done the right way.
              </span>
            </h1>

            <p
              data-hero-body="true"
              className="mt-6 max-w-[660px] text-lg leading-8 text-slate-600 lg:text-xl"
            >
              HydroSense manages device selection, plumbing coordination, installation,
              setup, shutoff testing, and homeowner handoff in one complete service.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                href="#lead-form"
                color="cyan"
                className="!rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-base !font-semibold !text-ink-950 !shadow-lg !shadow-sky-500/15 hover:!bg-hydro-300"
              >
                Check installation availability
                <svg
                  data-slot="icon"
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
                </svg>
              </Button>
              <TrackedPhoneLink
                trackingLocation="hero"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-[#001a4e] shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                <svg
                  className="h-5 w-5 text-sky-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.28 6.72 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.37c0-.52-.35-.97-.85-1.09l-4.42-1.11c-.44-.11-.9.06-1.17.42l-.97 1.29c-.28.38-.77.54-1.21.38a12.04 12.04 0 0 1-7.14-7.14c-.16-.44 0-.93.38-1.21l1.29-.97c.36-.27.53-.73.42-1.17L6.96 3.1A1.13 1.13 0 0 0 5.87 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                Call (281) 694-5754
              </TrackedPhoneLink>
            </div>

            <p
              data-hero-scope="true"
              className="mt-5 max-w-[660px] text-sm font-medium leading-6 text-slate-600"
            >
              Domestic household water is the standard scope. Irrigation is optional when
              requested and quoted. Fire-sprinkler and fire-suppression piping are excluded.
            </p>

            <p className="mt-3 text-sm font-semibold text-[#001a4e]">
              <a href="/about" className="underline decoration-sky-300 underline-offset-4 transition hover:decoration-sky-600">
                {manufacturerAuthorityShortLabel}
              </a>
            </p>

            <p className="mt-3 max-w-[620px] text-xs leading-5 text-slate-500">
              Insurance eligibility and incentives vary by insurer and policy. Confirm
              eligibility with your insurance agent before purchasing for a discount.
            </p>
          </div>

          <figure className="m-0 w-full max-w-[660px] justify-self-center lg:justify-self-end">
            <Image
              src="/images/hero/moen-flo-product-hero.jpg"
              alt="Flo by Moen smart water shutoff device beside its mobile app interface"
              width={996}
              height={765}
              priority
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 92vw"
              className="h-auto w-full object-contain"
            />
            <figcaption className="mx-auto mt-2 max-w-xl text-center text-xs leading-5 text-slate-500">
              Flo by Moen shown. Final device selection depends on the home&apos;s plumbing
              and installation conditions.
            </figcaption>
          </figure>
        </div>

        <div
          data-hero-proof="true"
          className="mt-12 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-14"
        >
          {assuranceItems.map((item) => (
            <div key={item.title} className="flex gap-3 px-1 py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0 lg:py-6">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5.5 10 3 3 6-6" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#001a4e]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
