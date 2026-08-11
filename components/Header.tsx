"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./catalyst/button";
import {
  Navbar,
  NavbarSection,
  NavbarSpacer,
} from "./catalyst/navbar";
import TrackedPhoneLink from "./TrackedPhoneLink";

const navLinks = [
  { label: "How it works", href: "/#customer-journey" },
  { label: "Devices", href: "/devices" },
  { label: "Service areas", href: "/service-area" },
  { label: "Guides", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-[42px] z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.03)] backdrop-blur-xl">
      <div className="section-container flex h-[76px] items-center gap-6">
        <a
          href="/"
          className="flex shrink-0 items-center"
          aria-label="HydroSense home"
        >
          <Image
            src="/brand/logo-horizontal-dark.png"
            alt="HydroSense"
            width={180}
            height={45}
            className="hidden h-10 w-auto sm:block"
            priority
          />
          <Image
            src="/brand/logo-mark-clean.png"
            alt="HydroSense"
            width={36}
            height={36}
            className="h-9 w-9 sm:hidden"
            priority
          />
        </a>

        <Navbar className="hidden !py-0 lg:flex">
          <NavbarSection className="!gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                {link.label}
              </a>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection className="!gap-3">
            <TrackedPhoneLink
              trackingLocation="desktop_header"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#001a4e] transition-colors hover:bg-slate-100"
            >
              (281) 694-5754
            </TrackedPhoneLink>
            <Button
              href="/#lead-form"
              color="cyan"
              className="!rounded-full !border-transparent !bg-hydro-400 !px-5 !py-2.5 !text-sm !font-semibold !text-ink-950 !shadow-md !shadow-sky-500/10 hover:!bg-hydro-300"
            >
              Check availability
            </Button>
          </NavbarSection>
        </Navbar>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <TrackedPhoneLink
            trackingLocation="mobile_header"
            className="hidden rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-[#001a4e] sm:inline-flex"
          >
            Call
          </TrackedPhoneLink>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 shadow-xl lg:hidden">
          <nav className="section-container !px-0" aria-label="Mobile navigation">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
              <TrackedPhoneLink
                trackingLocation="mobile_menu"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-[#001a4e]"
              >
                Call (281) 694-5754
              </TrackedPhoneLink>
              <Button
                href="/#lead-form"
                color="cyan"
                onClick={() => setMobileOpen(false)}
                className="!w-full !rounded-full !border-transparent !bg-hydro-400 !px-5 !py-3 !text-sm !font-semibold !text-ink-950 hover:!bg-hydro-300"
              >
                Check availability
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
