"use client";

import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./catalyst/button";
import {
  Description,
  ErrorMessage,
  Field,
  Label,
} from "./catalyst/fieldset";
import { Input } from "./catalyst/input";
import { Select } from "./catalyst/select";
import { Textarea } from "./catalyst/textarea";
import TrackedPhoneLink from "./TrackedPhoneLink";
import { fireSprinklerFieldHelper } from "@/lib/installation-scope";

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

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

const fieldControlClass = [
  "[&_input]:!rounded-xl [&_input]:!border-slate-200 [&_input]:!bg-white",
  "[&_input]:!px-4 [&_input]:!py-3.5 [&_input]:!text-base [&_input]:!text-slate-950",
  "[&_input]:placeholder:!text-slate-400 [&_input]:hover:!border-slate-300",
  "[&_input]:focus:!border-sky-500 [&_input]:focus:!ring-4 [&_input]:focus:!ring-sky-500/10",
  "[&_input]:data-[invalid]:!border-red-400",
].join(" ");

const selectControlClass = [
  "[&_select]:!rounded-xl [&_select]:!border-slate-200 [&_select]:!bg-white",
  "[&_select]:!px-4 [&_select]:!py-3.5 [&_select]:!text-base [&_select]:!text-slate-950",
  "[&_select]:hover:!border-slate-300 [&_select]:focus:!border-sky-500",
  "[&_select]:focus:!ring-4 [&_select]:focus:!ring-sky-500/10",
  "[&_select_option]:!bg-white [&_select_option]:!text-slate-950",
  "[&_svg]:!stroke-slate-500",
].join(" ");

const textareaControlClass = [
  "[&_textarea]:!rounded-xl [&_textarea]:!border-slate-200 [&_textarea]:!bg-white",
  "[&_textarea]:!px-4 [&_textarea]:!py-3.5 [&_textarea]:!text-base [&_textarea]:!text-slate-950",
  "[&_textarea]:placeholder:!text-slate-400 [&_textarea]:hover:!border-slate-300",
  "[&_textarea]:focus:!border-sky-500 [&_textarea]:focus:!ring-4 [&_textarea]:focus:!ring-sky-500/10",
].join(" ");

const labelClass = "!text-[15px] !font-semibold !text-slate-800";

const assessmentPoints = [
  "Confirm service availability for your ZIP code",
  "Review the domestic water line, power, Wi-Fi, and valve location",
  "Identify and exclude fire-sprinkler and fire-suppression piping",
  "Recommend a compatible device and issue a written proposal",
];

export default function LeadForm({ city }: LeadFormProps) {
  const formStarted = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  function track(eventName: string, parameters: Record<string, unknown> = {}) {
    const analytics = window as AnalyticsWindow;
    analytics.gtag?.("event", eventName, parameters);
  }

  function trackFormStart() {
    if (formStarted.current) return;
    formStarted.current = true;
    track("form_start", {
      form_name: "installation_assessment",
      city: city || "",
    });
  }

  function validateField(name: string, value: string) {
    if (name === "first_name" && !value.trim()) return "First name is required";
    if (name === "last_name" && !value.trim()) return "Last name is required";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address";
    }
    if (name === "zip" && !/^\d{5}(-\d{4})?$/.test(value)) {
      return "Enter a valid 5-digit ZIP code";
    }
    return "";
  }

  function validateContact(data: FormData) {
    const required = ["first_name", "last_name", "email", "zip"];
    const nextErrors: Record<string, string> = {};

    for (const field of required) {
      const value = String(data.get(field) || "");
      const message = validateField(field, value);
      if (message) nextErrors[field] = message;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    if (!["first_name", "last_name", "email", "zip"].includes(name)) return;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    if (!fieldErrors[name]) return;
    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (!validateContact(data)) return;

    if (step === 1) {
      setStep(2);
      track("form_step_1_complete", {
        form_name: "installation_assessment",
        city: city || "",
      });
      requestAnimationFrame(() => {
        document.getElementById("assessment-details")?.focus();
      });
      return;
    }

    setSubmitting(true);
    track("form_submit", {
      form_name: "installation_assessment",
      city: city || "",
    });

    const powerNear = String(data.get("power_within_12ft") || "");
    const fireSprinkler = String(data.get("fire_sprinkler_system") || "");
    const wifiReach = String(data.get("wifi_at_install_location") || "");

    const body = {
      first_name: String(data.get("first_name") || ""),
      last_name: String(data.get("last_name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      zip: String(data.get("zip") || ""),
      address: String(data.get("address") || ""),
      carrier: String(data.get("carrier") || ""),
      message: String(data.get("message") || ""),
      city: city || "",
      source: "hydrosensetx.com",
      ...utm,
      ...(powerNear ? { power_within_12ft: powerNear } : {}),
      ...(fireSprinkler ? { fire_sprinkler_system: fireSprinkler } : {}),
      ...(wifiReach ? { wifi_at_install_location: wifiReach } : {}),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        setError(
          json.errors
            ? "Please review the required fields and try again."
            : "We could not submit the request. Please call (281) 694-5754 or try again."
        );
        return;
      }

      const analytics = window as AnalyticsWindow;
      analytics.gtag?.("event", "generate_lead", {
        value: 0,
        currency: "USD",
        source: "hydrosensetx.com",
        form_name: "installation_assessment",
      });

      const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
      const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
      if (conversionId && conversionLabel) {
        analytics.gtag?.("event", "conversion", {
          send_to: `${conversionId}/${conversionLabel}`,
        });
      }

      analytics.fbq?.("track", "Lead");
      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection or call (281) 694-5754.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section id="lead-form" className="scroll-mt-32 bg-[#001a4e] py-20 lg:py-28">
        <div className="section-container max-w-3xl text-center">
          <div className="rounded-[2rem] border border-white/20 bg-white p-10 shadow-2xl shadow-black/20 lg:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="mt-6 font-display text-4xl tracking-tight text-[#001a4e]">
              Your assessment request is in.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">
              We will contact you within one business day to confirm the service area,
              review the installation conditions, and explain the next step.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {process.env.NEXT_PUBLIC_BOOKING_URL && (
                <Button
                  href={process.env.NEXT_PUBLIC_BOOKING_URL}
                  color="cyan"
                  className="!rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-base !font-semibold !text-ink-950 hover:!bg-hydro-300"
                >
                  Choose a call time
                </Button>
              )}
              <TrackedPhoneLink
                trackingLocation="lead_success"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-[#001a4e] transition hover:bg-slate-50"
              >
                Call (281) 694-5754
              </TrackedPhoneLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="relative scroll-mt-32 overflow-hidden bg-[#001a4e] py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-0 h-[30rem] w-[30rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="grid items-start gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
          <div className="lg:sticky lg:top-36">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Installation assessment
            </p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-tight tracking-[-0.025em] text-white sm:text-5xl">
              Let us confirm the right installation path for your home.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100/75">
              Start with your ZIP code and contact details. We will review the site
              conditions, recommend a compatible system, and provide a written proposal
              before anything is scheduled.
            </p>

            <div className="mt-9 space-y-5">
              {assessmentPoints.map((item, index) => (
                <div key={item} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-300/30 bg-sky-300/10 font-mono text-xs font-semibold text-sky-200">
                    0{index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-6 text-blue-100/80">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Prefer to talk first?</p>
              <TrackedPhoneLink
                trackingLocation="lead_form_sidebar"
                className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-sky-300 transition hover:text-sky-200"
              >
                (281) 694-5754
                <svg className="h-4 w-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7 5 5 5-5 5" />
                </svg>
              </TrackedPhoneLink>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white p-6 shadow-[0_35px_100px_-40px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-5 border-b border-slate-200 pb-6">
              <div>
                <p className="text-sm font-semibold text-[#001a4e]">Step {step} of 2</p>
                <p className="mt-1 text-sm text-slate-500">
                  {step === 1 ? "Contact and service area" : "Optional home details"}
                </p>
              </div>
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="h-2 w-12 rounded-full bg-sky-500" />
                <span className={`h-2 w-12 rounded-full ${step === 2 ? "bg-sky-500" : "bg-slate-200"}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} onFocus={trackFormStart} className="space-y-6" noValidate>
              <div className={step === 1 ? "space-y-6" : "hidden"} aria-hidden={step !== 1}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="first_name" className={labelClass}>
                      First name <span className="text-sky-600">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      autoComplete="given-name"
                      required
                      placeholder="Jane"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      invalid={Boolean(fieldErrors.first_name)}
                      className={fieldControlClass}
                    />
                    {fieldErrors.first_name && (
                      <ErrorMessage className="!text-sm !text-red-600">{fieldErrors.first_name}</ErrorMessage>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor="last_name" className={labelClass}>
                      Last name <span className="text-sky-600">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      autoComplete="family-name"
                      required
                      placeholder="Smith"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      invalid={Boolean(fieldErrors.last_name)}
                      className={fieldControlClass}
                    />
                    {fieldErrors.last_name && (
                      <ErrorMessage className="!text-sm !text-red-600">{fieldErrors.last_name}</ErrorMessage>
                    )}
                  </Field>
                </div>

                <Field>
                  <Label htmlFor="email" className={labelClass}>
                    Email <span className="text-sky-600">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="jane@example.com"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    invalid={Boolean(fieldErrors.email)}
                    className={fieldControlClass}
                  />
                  {fieldErrors.email && (
                    <ErrorMessage className="!text-sm !text-red-600">{fieldErrors.email}</ErrorMessage>
                  )}
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="phone" className={labelClass}>Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(281) 555-0100"
                      className={fieldControlClass}
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="zip" className={labelClass}>
                      ZIP code <span className="text-sky-600">*</span>
                    </Label>
                    <Input
                      id="zip"
                      name="zip"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      required
                      maxLength={10}
                      placeholder="77449"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      invalid={Boolean(fieldErrors.zip)}
                      className={`${fieldControlClass} [&_input]:!font-mono`}
                    />
                    {fieldErrors.zip && (
                      <ErrorMessage className="!text-sm !text-red-600">{fieldErrors.zip}</ErrorMessage>
                    )}
                  </Field>
                </div>
              </div>

              <div
                id="assessment-details"
                tabIndex={-1}
                className={step === 2 ? "space-y-6 outline-none" : "hidden"}
                aria-hidden={step !== 2}
              >
                <Field>
                  <Label htmlFor="address" className={labelClass}>
                    Property address <span className="font-normal text-slate-400">(optional)</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="123 Main St, Katy, TX"
                    className={fieldControlClass}
                  />
                </Field>

                <Field>
                  <Label htmlFor="carrier" className={labelClass}>
                    Insurance carrier <span className="font-normal text-slate-400">(optional)</span>
                  </Label>
                  <Select id="carrier" name="carrier" defaultValue="" className={selectControlClass}>
                    <option value="">Select a carrier</option>
                    {carriers.map((carrier) => (
                      <option key={carrier} value={carrier}>{carrier}</option>
                    ))}
                  </Select>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="power_within_12ft" className={labelClass}>Power near main shutoff</Label>
                    <Select id="power_within_12ft" name="power_within_12ft" defaultValue="" className={selectControlClass}>
                      <option value="">Not answered</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unsure">Not sure</option>
                    </Select>
                  </Field>

                  <Field>
                    <Label htmlFor="wifi_at_install_location" className={labelClass}>Wi-Fi reaches shutoff area</Label>
                    <Select id="wifi_at_install_location" name="wifi_at_install_location" defaultValue="" className={selectControlClass}>
                      <option value="">Not answered</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unsure">Not sure</option>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <Label htmlFor="fire_sprinkler_system" className={labelClass}>Does the home have a fire-sprinkler system?</Label>
                  <Select
                    id="fire_sprinkler_system"
                    name="fire_sprinkler_system"
                    defaultValue=""
                    aria-describedby="fire_sprinkler_system_help"
                    className={selectControlClass}
                  >
                    <option value="">Not answered</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Not sure</option>
                  </Select>
                  <Description id="fire_sprinkler_system_help" className="!mt-2 !text-sm !leading-6 !text-slate-600">
                    {fireSprinklerFieldHelper}
                  </Description>
                </Field>

                <Field>
                  <Label htmlFor="message" className={labelClass}>
                    Anything we should know <span className="font-normal text-slate-400">(optional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={2000}
                    placeholder="Device already purchased, previous leaks, access limitations, or timing needs"
                    className={textareaControlClass}
                  />
                </Field>
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                {step === 2 && (
                  <Button
                    type="button"
                    outline
                    onClick={() => setStep(1)}
                    className="!rounded-full !border-slate-300 !px-6 !py-3.5 !text-sm !font-semibold !text-slate-700 hover:!bg-slate-50"
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  color="cyan"
                  disabled={submitting}
                  className="!w-full !rounded-full !border-transparent !bg-hydro-400 !px-6 !py-3.5 !text-base !font-semibold !text-ink-950 !shadow-lg !shadow-sky-500/10 hover:!bg-hydro-300 disabled:!opacity-50"
                >
                  {step === 1
                    ? "Continue"
                    : submitting
                      ? "Submitting..."
                      : "Request installation assessment"}
                </Button>
              </div>

              <p className="text-center text-xs leading-5 text-slate-500">
                We use this information only to respond to your installation request.
                Insurance incentives are determined by your insurer and are not guaranteed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
