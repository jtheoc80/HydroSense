"use client";

import { useState, useEffect, FormEvent } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const carriers = [
  "State Farm",
  "USAA",
  "Allstate",
  "Farmers",
  "Travelers",
  "Liberty Mutual",
  "Nationwide",
  "Progressive",
  "Texas Farm Bureau",
  "Chubb",
  "Other",
  "Not sure",
];

interface UTMData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
  page_path: string;
  user_agent: string;
}

export default function LeadForm() {
  const [utm, setUtm] = useState<UTMData>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    referrer: "",
    page_path: "",
    user_agent: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
      referrer: document.referrer || "",
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const body = {
      first_name: data.get("first_name") as string,
      last_name: data.get("last_name") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      zip: data.get("zip") as string,
      address: data.get("address") as string,
      carrier: data.get("carrier") as string,
      message: data.get("message") as string,
      source: "hydrosensetx.com",
      ...utm,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.errors ? "Please check the form fields and try again." : "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);

      // Fire analytics events
      if (window.gtag) {
        window.gtag("event", "generate_lead", {
          value: 0,
          currency: "USD",
          source: "hydrosensetx.com",
        });

        const convId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
        const convLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
        if (convId && convLabel) {
          window.gtag("event", "conversion", {
            send_to: `${convId}/${convLabel}`,
          });
        }
      }

      if (window.fbq) {
        window.fbq("track", "Lead");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section id="lead-form" className="py-20 lg:py-28 bg-ink-950/50">
        <div className="section-container max-w-2xl text-center">
          <div className="bg-ink-800 border border-hydro-400/30 rounded-xl p-8 lg:p-12">
            <div className="w-16 h-16 bg-hydro-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-hydro-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-fog-50 mb-3">
              You are on the list.
            </h3>
            <p className="text-fog-300">
              We will reach out within one business day with your carrier&apos;s likely discount.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: value prop */}
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-6">
              Texas insurance is up 46%. The credit is sitting there waiting.
            </h2>
            <p className="text-fog-200 leading-relaxed mb-4">
              A certified smart shutoff install qualifies you for{" "}
              <span className="font-mono text-signal-300">$300 to $600</span> in annual
              insurance credits. Most homeowners earn back the full install cost inside 24
              months.
            </p>
            <p className="text-fog-300 text-sm">
              Fill out the form and we will get back to you within one business day with your
              carrier-specific discount estimate.
            </p>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm text-fog-300 mb-1.5">
                  First name *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm text-fog-300 mb-1.5">
                  Last name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-fog-300 mb-1.5">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm text-fog-300 mb-1.5">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm text-fog-300 mb-1.5">
                  ZIP code *
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  pattern="\d{5}(-\d{4})?"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm text-fog-300 mb-1.5">
                Property address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="carrier" className="block text-sm text-fog-300 mb-1.5">
                Current insurance carrier
              </label>
              <select
                id="carrier"
                name="carrier"
                className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent"
              >
                <option value="">Select your carrier</option>
                {carriers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-fog-300 mb-1.5">
                Anything we should know
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                maxLength={2000}
                className="w-full px-4 py-3 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-300/50 focus:outline-none focus:ring-2 focus:ring-hydro-400 focus:border-transparent resize-y"
              />
            </div>

            {error && (
              <p className="text-alert-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Get my 15-minute quote"}
            </button>

            <p className="text-xs text-fog-300 text-center">
              No spam. We contact you once to discuss your install and carrier discount.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
