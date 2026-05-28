"use client";

import { useState } from "react";

const navLinks = [
  { label: "Why now", href: "#critical-statements" },
  { label: "The certificate", href: "#the-certificate" },
  { label: "Savings", href: "#savings-estimator" },
  { label: "How it works", href: "#customer-journey" },
  { label: "Service area", href: "#service-area" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function WaterDropIcon() {
  return (
    <svg
      width="20"
      height="26"
      viewBox="0 0 20 26"
      fill="none"
      className="text-hydro-400"
      aria-hidden="true"
    >
      <path
        d="M10 0C10 0 0 12 0 17C0 22.5228 4.47715 26 10 26C15.5228 26 20 22.5228 20 17C20 12 10 0 10 0Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-[42px] z-40 bg-ink-900/95 backdrop-blur-md border-b border-ink-700/50">
      <div className="section-container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2" aria-label="HydroSense home">
          <WaterDropIcon />
          <span className="font-display text-2xl text-fog-50 tracking-tight">
            HydroSense
          </span>
        </a>

        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label="Main navigation"
        >
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

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+12816945754"
            className="text-sm text-fog-300 hover:text-fog-50 transition-colors"
          >
            (281) 694-5754
          </a>
          <a href="#lead-form" className="btn-primary text-sm">
            Get my quote
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-fog-300 hover:text-fog-50"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="lg:hidden bg-ink-800 border-t border-ink-700/50 px-4 pb-4 pt-2"
          aria-label="Mobile navigation"
        >
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
            <a href="tel:+12816945754" className="text-fog-300 text-sm">
              (281) 694-5754
            </a>
            <a
              href="#lead-form"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-sm text-center"
            >
              Get my quote
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
