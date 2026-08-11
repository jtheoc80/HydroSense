"use client";

import Image from "next/image";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import TrackedPhoneLink from "./TrackedPhoneLink";
import { installationScopeDisclosure } from "@/lib/installation-scope";

const assuranceItems = [
  {
    title: "Compatibility reviewed",
    body: "Domestic-line routing, pipe, valve, power, and Wi-Fi checked first.",
  },
  {
    title: "Written proposal",
    body: "Device, scope, price, exclusions, and timing documented before work.",
  },
  {
    title: "Tested handoff",
    body: "App setup, shutoff-cycle testing, and homeowner guidance included.",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f8fc]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 top-12 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="section-container relative py-14 sm:py-16 lg:py-20 xl:py-24">
        <div className="grid gap-y-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-x-20 lg:gap-y-0">
          <div>
            <Badge
              color="sky"
              className="!rounded-full !px-3 !py-1 !text-[11px] !font-semibold !uppercase !tracking-[0.15em]"
            >
              MPL 43057 • Greater Houston
            </Badge>

            <h1 className="mt-6 max-w-3xl text-balance font-display text-5xl leading-[0.98] tracking-[-0.035em] text-[#001a4e] sm:text-6xl lg:text-[3.5rem] xl:text-[4.6rem]">
              Smart water shutoff installation,
              <span className="block text-sky-600">done the right way.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 lg:text-xl">
              HydroSense installs and configures Flo by Moen, Phyn Plus, and
              StreamLabs systems for Houston-area homes, then tests the shutoff
              and walks the homeowner through the finished system.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
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
          </div>

          <div className="relative mx-1 aspect-[4/3] w-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.32)] sm:mx-auto sm:w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:aspect-[5/6] lg:max-w-none">
            <Image
              src="https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Plumber tightening residential water-line fittings during an installation"
              fill
              priority
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 44vw, (min-width: 640px) 576px, calc(100vw - 40px)"
              className="object-cover object-[54%_center]"
            />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">
            <div className="mt-10 grid gap-4 border-t border-slate-200 pt-7 sm:grid-cols-3">
              {assuranceItems.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-[#001a4e]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                Domestic water scope
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {installationScopeDisclosure}
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Insurance eligibility and incentives vary by insurer and policy.
              Confirm eligibility with your insurance agent before purchasing for a discount.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
