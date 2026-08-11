"use client";

import { useState } from "react";
import Image from "next/image";
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
    <header className="sticky top-[42px] z-40 border-b border-ink-700/50 bg-ink-900/95 backdrop-blur-md">
      <div className="section-container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center" aria-label="HydroSense home">
          <Image
            src="/brand/logo-horizontal-light.png"
            alt="HydroSense"
            width={160}
            height={40}
            className="hidden h-10 w-auto sm:block"
            priority
          />
          <Image
            src="/brand/logo-mark-light.png"
            alt="HydroSense"
            width={32}
            height={32}
            className="h-8 w-8 sm:hidden"
            priority
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-fog-300 transition-colors hover:text-fog-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <TrackedPhoneLink
            trackingLocation="desktop_header"
            className="text-sm text-fog-300 transition-colors hover:text-fog-50"
          >
            (281) 694-5754
          </TrackedPhoneLink>
          <a href="/#lead-form" className="btn-primary text-sm">
            Check availability
          </a>
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="p-2 text-fog-300 hover:text-fog-50 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-ink-700/50 bg-ink-800 px-4 pb-4 pt-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-fog-200 transition-colors hover:text-fog-50"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-3 border-t border-ink-700/50 pt-3">
            <TrackedPhoneLink
              trackingLocation="mobile_menu"
              className="text-sm text-fog-300"
              onClick={() => setMobileOpen(false)}
            >
              Call (281) 694-5754
            </TrackedPhoneLink>
            <a
              href="/#lead-form"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-center text-sm"
            >
              Check availability
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
