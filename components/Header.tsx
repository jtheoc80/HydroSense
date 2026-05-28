"use client";

import { useState } from "react";

const navLinks = [
  { label: "Why now", href: "#critical-statements" },
  { label: "The certificate", href: "#the-certificate" },
  { label: "Savings", href: "#savings-estimator" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-[42px] z-40 bg-ink-900/90 backdrop-blur-md border-b border-ink-700/50">
      <div className="section-container flex items-center justify-between h-16">
        {/* Wordmark */}
        <a href="/" className="font-display text-2xl text-fog-50 tracking-tight">
          HydroSense
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-fog-300 hover:text-fog-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+18889999999"
            className="text-sm text-fog-300 hover:text-fog-50 transition-colors"
          >
            (888) 999-9999
          </a>
          <a href="#lead-form" className="btn-primary text-sm">
            Get my quote
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-fog-300 hover:text-fog-50"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-ink-800 border-t border-ink-700/50 px-4 pb-4 pt-2" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-fog-200 hover:text-fog-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-ink-700/50 mt-2 flex flex-col gap-3">
            <a href="tel:+18889999999" className="text-fog-300 text-sm">
              (888) 999-9999
            </a>
            <a href="#lead-form" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center">
              Get my quote
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
