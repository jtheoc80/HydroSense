"use client";

import { useState, useEffect, FormEvent } from "react";
import { estimatedSavingsForCarrier } from "@/lib/savings";
import { Field, Label, ErrorMessage } from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Select } from "@/components/catalyst/select";
import { Textarea } from "@/components/catalyst/textarea";
import { Button } from "@/components/catalyst/button";

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

interface LeadFormProps {
  city?: string;
}

interface UTMData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
  page_path: string;
  user_agent: string;
  campaign: string;
}

export default function LeadForm({ city }: LeadFormProps) {
  const [utm, setUtm] = useState<UTMData>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    referrer: "",
    page_path: "",
    user_agent: "",
    campaign: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      campaign: params.get("utm_campaign") || "",
    });
  }, []);

  function validateField(name: string, value: string): string {
    switch (name) {
      case "first_name":
        return value.trim() ? "" : "First name is required";
      case "last_name":
        return value.trim() ? "" : "Last name is required";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Enter a valid email address";
      case "zip":
        return /^\d{5}(-\d{4})?$/.test(value)
          ? ""
          : "Enter a valid 5-digit ZIP code";
      default:
        return "";
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  }

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
      city: city || "",
      source: "hydrosensetx.com",
      ...utm,
    };

    setSelectedCarrier(body.carrier);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(
          json.errors
            ? "Please check the form fields and try again."
            : "Something went wrong. Please try again."
        );
        setSubmitting(false);
        return;
      }

      setSuccess(true);

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
    const savings = estimatedSavingsForCarrier(selectedCarrier);

    return (
      <section id="lead-form" className="py-20 lg:py-28 bg-ink-950/50">
        <div className="section-container max-w-2xl text-center">
          <div className="bg-ink-800/80 border border-hydro-400/20 rounded-2xl p-10 lg:p-14 backdrop-blur-sm">
            <div className="w-20 h-20 bg-hydro-400/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-hydro-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl text-fog-50 mb-4">
              You are on the list.
            </h3>
            <p className="text-fog-200 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              We will reach out within one business day with your
              carrier-specific discount details.
            </p>
            {selectedCarrier &&
              selectedCarrier !== "Other" &&
              selectedCarrier !== "Not sure" && (
                <div className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 lg:p-8 inline-block">
                  <p className="text-xs uppercase tracking-[0.2em] text-fog-400 mb-3">
                    Estimated annual savings with {selectedCarrier}
                  </p>
                  <p className="font-mono text-4xl lg:text-5xl text-signal-400 tracking-tight">
                    ${savings.low}&ndash;${savings.high}
                  </p>
                </div>
              )}
            <p className="text-fog-400 text-sm mt-8">
              Check your email for a confirmation with the full process
              overview.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Copy side */}
          <div className="flex flex-col justify-center lg:sticky lg:top-32">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Free quote
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] text-fog-50 mb-6">
              Texas insurance is up 46%.{" "}
              <span className="text-fog-200">
                The credit is sitting there waiting.
              </span>
            </h2>
            <p className="text-fog-200 text-lg leading-relaxed mb-6">
              A certified smart shutoff install qualifies you for{" "}
              <span className="font-mono text-signal-400 font-semibold">
                $300 to $600
              </span>{" "}
              in annual insurance credits. Most homeowners earn back the full
              install cost inside 24 months.
            </p>
            <div className="hidden lg:flex items-start gap-4 p-5 bg-ink-800/50 border border-ink-700/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-hydro-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-hydro-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-fog-50 text-sm font-medium mb-1">
                  15-minute call, same-week install
                </p>
                <p className="text-fog-300 text-sm leading-relaxed">
                  Fill out the form and we will get back to you within one
                  business day with your carrier-specific discount estimate.
                </p>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6 dark">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field>
                  <Label className="text-sm text-fog-300">
                    First name <span className="text-hydro-400">*</span>
                  </Label>
                  <Input
                    name="first_name"
                    type="text"
                    required
                    onBlur={handleBlur}
                    invalid={!!fieldErrors.first_name}
                    className="[&_input]:!bg-ink-900/80 [&_input]:!border-ink-700 [&_input]:!text-fog-50 [&_input]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400"
                  />
                  {fieldErrors.first_name && (
                    <ErrorMessage className="!text-alert-500">
                      {fieldErrors.first_name}
                    </ErrorMessage>
                  )}
                </Field>
                <Field>
                  <Label className="text-sm text-fog-300">
                    Last name <span className="text-hydro-400">*</span>
                  </Label>
                  <Input
                    name="last_name"
                    type="text"
                    required
                    onBlur={handleBlur}
                    invalid={!!fieldErrors.last_name}
                    className="[&_input]:!bg-ink-900/80 [&_input]:!border-ink-700 [&_input]:!text-fog-50 [&_input]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400"
                  />
                  {fieldErrors.last_name && (
                    <ErrorMessage className="!text-alert-500">
                      {fieldErrors.last_name}
                    </ErrorMessage>
                  )}
                </Field>
              </div>

              <Field>
                <Label className="text-sm text-fog-300">
                  Email <span className="text-hydro-400">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  required
                  onBlur={handleBlur}
                  invalid={!!fieldErrors.email}
                  className="[&_input]:!bg-ink-900/80 [&_input]:!border-ink-700 [&_input]:!text-fog-50 [&_input]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400"
                />
                {fieldErrors.email && (
                  <ErrorMessage className="!text-alert-500">
                    {fieldErrors.email}
                  </ErrorMessage>
                )}
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field>
                  <Label className="text-sm text-fog-300">Phone</Label>
                  <Input
                    name="phone"
                    type="tel"
                    className="[&_input]:!bg-ink-900/80 [&_input]:!border-ink-700 [&_input]:!text-fog-50 [&_input]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400"
                  />
                </Field>
                <Field>
                  <Label className="text-sm text-fog-300">
                    ZIP code <span className="text-hydro-400">*</span>
                  </Label>
                  <Input
                    name="zip"
                    type="text"
                    required
                    maxLength={10}
                    onBlur={handleBlur}
                    invalid={!!fieldErrors.zip}
                    className="[&_input]:!bg-ink-900/80 [&_input]:!border-ink-700 [&_input]:!text-fog-50 [&_input]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400 [&_input]:font-mono"
                  />
                  {fieldErrors.zip && (
                    <ErrorMessage className="!text-alert-500">
                      {fieldErrors.zip}
                    </ErrorMessage>
                  )}
                </Field>
              </div>

              <Field>
                <Label className="text-sm text-fog-300">
                  Property address
                </Label>
                <Input
                  name="address"
                  type="text"
                  className="[&_input]:!bg-ink-900/80 [&_input]:!border-ink-700 [&_input]:!text-fog-50 [&_input]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400"
                />
              </Field>

              <Field>
                <Label className="text-sm text-fog-300">
                  Current insurance carrier
                </Label>
                <Select
                  name="carrier"
                  className="[&_select]:!bg-ink-900/80 [&_select]:!border-ink-700 [&_select]:!text-fog-50 has-data-focus:after:!ring-hydro-400 [&_select_option]:!bg-ink-800"
                >
                  <option value="">Select your carrier</option>
                  {carriers.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label className="text-sm text-fog-300">
                  Anything we should know
                </Label>
                <Textarea
                  name="message"
                  rows={3}
                  maxLength={2000}
                  className="[&_textarea]:!bg-ink-900/80 [&_textarea]:!border-ink-700 [&_textarea]:!text-fog-50 [&_textarea]:placeholder:!text-fog-400/50 focus-within:after:!ring-hydro-400"
                />
              </Field>

              {error && (
                <div className="bg-alert-500/10 border border-alert-500/20 rounded-lg p-3">
                  <p className="text-alert-500 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="!w-full !rounded-lg !py-3.5 !text-base !font-semibold !bg-hydro-400 !text-ink-950 hover:!bg-hydro-300 !border-transparent !shadow-lg !shadow-hydro-400/25 disabled:!opacity-50 disabled:!cursor-not-allowed [--btn-bg:var(--color-hydro-400)] [--btn-border:var(--color-hydro-400)] [--btn-hover-overlay:transparent] before:!bg-hydro-400 before:!shadow-none dark:!bg-hydro-400 dark:before:!hidden"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Get my 15-minute quote"
                )}
              </Button>

              <p className="text-xs text-fog-400 text-center leading-relaxed">
                No spam. We contact you once to discuss your install and
                carrier discount.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
