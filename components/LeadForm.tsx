"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
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

/* ------------------------------------------------------------------ */
/*  Shared dark-on-navy override classes for Catalyst controls         */
/* ------------------------------------------------------------------ */

// Inner <input> overrides
const inputClasses = [
  // Background and border
  "[&_input]:!bg-ink-900 [&_input]:!border [&_input]:!border-white/15 [&_input]:!rounded-lg",
  "[&_input]:data-[hover]:!border-white/25",
  "[&_input]:focus:!border-hydro-400",
  // Text and placeholder
  "[&_input]:!text-white [&_input]:!text-base [&_input]:sm:!text-base",
  "[&_input]:placeholder:!text-fog-300",
  // Sizing: min 44px tap target, comfortable padding
  "[&_input]:!py-3 [&_input]:!px-4",
  // Invalid state: bright border
  "[&_input]:data-[invalid]:!border-[#F87171] [&_input]:data-[invalid]:data-[hover]:!border-[#F87171]",
].join(" ");

// Inner <select> overrides
const selectClasses = [
  // Background and border
  "[&_select]:!bg-ink-900 [&_select]:!border [&_select]:!border-white/15 [&_select]:!rounded-lg",
  "[&_select]:data-[hover]:!border-white/25",
  "[&_select]:data-[focus]:!border-hydro-400",
  // Text
  "[&_select]:!text-white [&_select]:!text-base [&_select]:sm:!text-base",
  // Option backgrounds
  "[&_select_option]:!bg-ink-800 [&_select_option]:!text-white",
  // Sizing
  "[&_select]:!py-3 [&_select]:!pl-4",
  // Invalid
  "[&_select]:data-[invalid]:!border-[#F87171]",
  // Dropdown arrow
  "[&_svg]:!stroke-fog-300",
].join(" ");

// Inner <textarea> overrides
const textareaClasses = [
  "[&_textarea]:!bg-ink-900 [&_textarea]:!border [&_textarea]:!border-white/15 [&_textarea]:!rounded-lg",
  "[&_textarea]:data-[hover]:!border-white/25",
  "[&_textarea]:focus:!border-hydro-400",
  "[&_textarea]:!text-white [&_textarea]:!text-base [&_textarea]:sm:!text-base",
  "[&_textarea]:placeholder:!text-fog-300",
  "[&_textarea]:!py-3 [&_textarea]:!px-4",
  "[&_textarea]:data-[invalid]:!border-[#F87171]",
].join(" ");

/* ------------------------------------------------------------------ */
/*  Label style: white, 15px+, medium weight                           */
/* ------------------------------------------------------------------ */
const labelClasses = "!text-white !text-[15px] !font-medium";

const radioOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
] as const;

function RadioQuestion({
  label,
  caption,
  name,
  value,
  onChange,
}: {
  label: string;
  caption: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[15px] font-medium text-white mb-1.5">
        {label}
      </legend>
      <p className="text-xs text-fog-300 leading-relaxed mb-3">{caption}</p>
      <div className="flex gap-2">
        {radioOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? "" : opt.value)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
              value === opt.value
                ? "bg-signal-400/15 border-signal-400/60 text-signal-400"
                : "bg-ink-900 border-white/15 text-fog-300 hover:border-white/25"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function QualifyingDisclosure({
  powerNear,
  setPowerNear,
  fireSprinkler,
  setFireSprinkler,
  wifiReach,
  setWifiReach,
}: {
  powerNear: string;
  setPowerNear: (v: string) => void;
  fireSprinkler: string;
  setFireSprinkler: (v: string) => void;
  wifiReach: string;
  setWifiReach: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [open, powerNear, fireSprinkler, wifiReach]);

  const answered = [powerNear, fireSprinkler, wifiReach].filter(Boolean).length;

  return (
    <div
      className="rounded-[10px] border transition-colors"
      style={{
        background: "rgba(56, 189, 248, 0.05)",
        borderColor: open
          ? "rgba(56, 189, 248, 0.3)"
          : "rgba(56, 189, 248, 0.2)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="qualifying-questions"
        className="w-full flex items-center justify-between gap-3 p-4 min-h-[48px] text-left group hover:[border-color:rgba(56,189,248,0.4)] transition-colors rounded-[10px]"
      >
        <div className="flex-1 min-w-0">
          <span className="text-[15px] font-medium text-fog-100 block">
            Speed up your install assessment{" "}
            <span className="text-fog-400 font-normal">(optional)</span>
          </span>
          <span className="text-xs text-fog-300 leading-relaxed block mt-1">
            Three quick questions help us match the right device and crew. You
            can answer them on the call instead.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {answered > 0 && (
            <span className="font-mono text-xs text-signal-400">
              {answered} of 3
            </span>
          )}
          <svg
            className="w-5 h-5 text-fog-400 transition-transform duration-250"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        id="qualifying-questions"
        role="region"
        style={{
          maxHeight: open ? `${contentHeight}px` : "0px",
          transition: "max-height 250ms ease",
          overflow: "hidden",
        }}
      >
        <div ref={contentRef} className="space-y-5 px-4 pb-4 pt-1">
          <RadioQuestion
            label="Is there a power outlet within 12 feet of your main water shutoff?"
            caption="Usually in the garage, utility room, or near the water heater. If not sure, no problem — we'll confirm on the call."
            name="power_within_12ft"
            value={powerNear}
            onChange={setPowerNear}
          />

          <RadioQuestion
            label="Does your home have a fire sprinkler system?"
            caption="Common in some newer Texas builds and required in some master-planned communities. Affects the install path."
            name="fire_sprinkler_system"
            value={fireSprinkler}
            onChange={setFireSprinkler}
          />
          {fireSprinkler === "yes" && (
            <p className="text-sm text-fog-300 -mt-2 ml-1">
              Got it. We will talk through the install options for
              sprinkler-equipped homes on the call.
            </p>
          )}

          <RadioQuestion
            label="Does your home WiFi reach the area where your main water shutoff is located?"
            caption="The device needs WiFi to send you alerts. If signal is weak, we include a WiFi extender at no extra cost."
            name="wifi_at_install_location"
            value={wifiReach}
            onChange={setWifiReach}
          />
        </div>
      </div>
    </div>
  );
}

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
  const [powerNear, setPowerNear] = useState("");
  const [fireSprinkler, setFireSprinkler] = useState("");
  const [wifiReach, setWifiReach] = useState("");

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

    // Validate all required fields before submit
    const required = ["first_name", "last_name", "email", "zip"];
    const errors: Record<string, string> = {};
    for (const field of required) {
      const val = (data.get(field) as string) || "";
      const err = validateField(field, val);
      if (err) errors[field] = err;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      setSubmitting(false);
      return;
    }

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
      ...(powerNear ? { power_within_12ft: powerNear } : {}),
      ...(fireSprinkler ? { fire_sprinkler_system: fireSprinkler } : {}),
      ...(wifiReach ? { wifi_at_install_location: wifiReach } : {}),
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
            {process.env.NEXT_PUBLIC_BOOKING_URL && (
              <a
                href={process.env.NEXT_PUBLIC_BOOKING_URL}
                className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-base px-8 py-4 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 hover:-translate-y-0.5 transition-all mt-8"
              >
                Book your 15-minute call now
              </a>
            )}
            <p className="text-fog-400 text-sm mt-6">
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
                  <Label htmlFor="first_name" className={labelClasses}>
                    First name <span className="text-hydro-400">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    placeholder="Jane"
                    onBlur={handleBlur}
                    invalid={!!fieldErrors.first_name}
                    className={inputClasses}
                  />
                  {fieldErrors.first_name && (
                    <ErrorMessage className="!text-[#F87171] !text-sm">
                      {fieldErrors.first_name}
                    </ErrorMessage>
                  )}
                </Field>
                <Field>
                  <Label htmlFor="last_name" className={labelClasses}>
                    Last name <span className="text-hydro-400">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    placeholder="Smith"
                    onBlur={handleBlur}
                    invalid={!!fieldErrors.last_name}
                    className={inputClasses}
                  />
                  {fieldErrors.last_name && (
                    <ErrorMessage className="!text-[#F87171] !text-sm">
                      {fieldErrors.last_name}
                    </ErrorMessage>
                  )}
                </Field>
              </div>

              <Field>
                <Label htmlFor="email" className={labelClasses}>
                  Email <span className="text-hydro-400">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  onBlur={handleBlur}
                  invalid={!!fieldErrors.email}
                  className={inputClasses}
                />
                {fieldErrors.email && (
                  <ErrorMessage className="!text-[#F87171] !text-sm">
                    {fieldErrors.email}
                  </ErrorMessage>
                )}
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field>
                  <Label htmlFor="phone" className={labelClasses}>
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(281) 555-0100"
                    className={inputClasses}
                  />
                </Field>
                <Field>
                  <Label htmlFor="zip" className={labelClasses}>
                    ZIP code <span className="text-hydro-400">*</span>
                  </Label>
                  <Input
                    id="zip"
                    name="zip"
                    type="text"
                    required
                    maxLength={10}
                    placeholder="77449"
                    onBlur={handleBlur}
                    invalid={!!fieldErrors.zip}
                    className={`${inputClasses} [&_input]:!font-mono`}
                  />
                  {fieldErrors.zip && (
                    <ErrorMessage className="!text-[#F87171] !text-sm">
                      {fieldErrors.zip}
                    </ErrorMessage>
                  )}
                </Field>
              </div>

              <Field>
                <Label htmlFor="address" className={labelClasses}>
                  Property address
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St, Katy, TX"
                  className={inputClasses}
                />
              </Field>

              <Field>
                <Label htmlFor="carrier" className={labelClasses}>
                  Current insurance carrier
                </Label>
                <Select
                  id="carrier"
                  name="carrier"
                  className={selectClasses}
                >
                  <option value="">Select your carrier</option>
                  {carriers.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>

              {/* Collapsible qualifying questions */}
              <QualifyingDisclosure
                powerNear={powerNear}
                setPowerNear={setPowerNear}
                fireSprinkler={fireSprinkler}
                setFireSprinkler={setFireSprinkler}
                wifiReach={wifiReach}
                setWifiReach={setWifiReach}
              />

              <Field>
                <Label htmlFor="message" className={labelClasses}>
                  Anything we should know
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={3}
                  maxLength={2000}
                  placeholder="e.g. I have a two-story home built in 2005"
                  className={textareaClasses}
                />
              </Field>

              {error && (
                <div className="bg-[#F87171]/10 border-2 border-[#F87171]/30 rounded-lg p-4">
                  <p className="text-[#F87171] text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="!w-full !rounded-lg !py-4 !text-base !font-semibold !bg-hydro-400 !text-ink-900 hover:!bg-hydro-300 !border-transparent !shadow-lg !shadow-hydro-400/25 disabled:!opacity-50 disabled:!cursor-not-allowed [--btn-bg:theme(--color-hydro-400)] [--btn-border:transparent] [--btn-hover-overlay:transparent] before:!bg-hydro-400 before:!shadow-none dark:!bg-hydro-400 dark:!text-ink-900 dark:before:!hidden"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2 text-ink-900">
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

              <p className="text-sm text-fog-200 text-center leading-relaxed">
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
