"use client";

import Image from "next/image";
import { Badge } from "./catalyst/badge";
import { Button } from "./catalyst/button";
import TrackedPhoneLink from "./TrackedPhoneLink";

const assuranceItems = [
  {
    title: "Compatibility reviewed",
    body: "Pipe, valve, power, Wi-Fi, and sprinkler routing checked first.",
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

      <div className="section-container relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
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

            <div className="mt-10 grid gap-4 border-t border-slate-200 pt-7 sm:grid-cols-3">
              {assuranceItems.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-[#001a4e]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-500">
              Insurance eligibility and incentives vary by insurer and policy.
              Confirm eligibility with your insurance agent before purchasing for a discount.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-[10px] border-white bg-slate-200 shadow-[0_35px_90px_-35px_rgba(0,26,78,0.5)]">
              <Image
                src="https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Professional plumber installing pipe fittings during a residential plumbing project"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a4e]/75 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 pb-28 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                  Professional installation
                </p>
                <p className="mt-2 max-w-sm font-display text-3xl leading-tight text-white">
                  The device is only one part of a reliable system.
                </p>
              </div>
              <p className="absolute right-3 top-3 rounded-full bg-black/35 px-2 py-1 text-[10px] text-white/75 backdrop-blur-sm">
                Photo: Anıl Karakaya / Pexels
              </p>
            </div>

            <div className="absolute -left-3 top-8 max-w-[15rem] rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur sm:-left-8 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Readiness checked first</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">Main line, power, Wi-Fi, valve, and prior leaks.</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-3 rounded-2xl border border-white/20 bg-[#001a4e] px-5 py-4 text-white shadow-2xl shadow-blue-950/25 sm:-right-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-200">Systems supported</p>
              <p className="mt-1 text-sm font-semibold">Flo • Phyn • StreamLabs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
