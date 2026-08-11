"use client";

import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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

const inputClass =
  "mt-2 w-full rounded-lg border border-white/15 bg-ink-900 px-4 py-3 text-base text-white outline-none transition placeholder:text-fog-400 hover:border-white/25 focus:border-hydro-400 focus:ring-2 focus:ring-hydro-400/15";

const labelClass = "text-[15px] font-medium text-white";

export default function LeadForm({ city }: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
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
    track("form_start", { form_name: "installation_assessment", city: city || "" });
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
    track("form_submit", { form_name: "installation_assessment", city: city || "" });

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
      <section id="lead-form" className="scroll-mt-32 bg-ink-950/50 py-20 lg:py-28">
        <div className="section-container max-w-2xl text-center">
          <div className="rounded-2xl border border-hydro-400/20 bg-ink-800/80 p-10 backdrop-blur-sm lg:p-14">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-hydro-400/10">
              <svg className="h-10 w-10 text-hydro-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="mb-4 font-display text-3xl text-fog-50 lg:text-4xl">Request received</h2>
            <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-fog-200">
              We will contact you within one business day to confirm the service
              area, review the installation conditions, and explain the next step.
            </p>
            {process.env.NEXT_PUBLIC_BOOKING_URL && (
              <a href={process.env.NEXT_PUBLIC_BOOKING_URL} className="inline-flex items-center justify-center rounded-lg bg-hydro-400 px-8 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-hydro-400/20 transition-all hover:-translate-y-0.5 hover:bg-hydro-300">
                Choose a call time
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="scroll-mt-32 bg-ink-950/50 py-20 lg:py-28">
      <div className="section-container">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center lg:sticky lg:top-32">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">Installation assessment</p>
            <h2 className="mb-6 font-display text-3xl leading-[1.15] text-fog-50 sm:text-4xl lg:text-[2.75rem]">
              Check availability for your home
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-fog-200">
              Tell us where the home is and how to reach you. We will confirm the
              service area, review the main-line conditions, and provide a written
              proposal before scheduling installation.
            </p>

            <div className="space-y-4 rounded-xl border border-ink-700/40 bg-ink-800/50 p-6">
              {[
                "Confirm your ZIP code and preferred contact details",
                "Review main-line access, power, Wi-Fi, and sprinkler routing",
                "Recommend a compatible device and issue a written proposal",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hydro-400/10 font-mono text-xs text-hydro-400">{index + 1}</span>
                  <p className="text-sm leading-relaxed text-fog-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink-700/40 bg-ink-800/60 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-fog-50">Step {step} of 2</p>
                <p className="mt-1 text-sm text-fog-400">{step === 1 ? "Contact and service area" : "Optional home details"}</p>
              </div>
              <div className="flex gap-2" aria-hidden="true">
                <span className="h-1.5 w-10 rounded-full bg-hydro-400" />
                <span className={`h-1.5 w-10 rounded-full ${step === 2 ? "bg-hydro-400" : "bg-ink-700"}`} />
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} onFocus={trackFormStart} className="space-y-6" noValidate>
              <div className={step === 1 ? "space-y-6" : "hidden"} aria-hidden={step !== 1}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    First name <span className="text-hydro-400">*</span>
                    <input name="first_name" type="text" autoComplete="given-name" required placeholder="Jane" onBlur={handleBlur} onChange={handleChange} className={inputClass} />
                    {fieldErrors.first_name && <span className="mt-2 block text-sm text-red-400">{fieldErrors.first_name}</span>}
                  </label>
                  <label className={labelClass}>
                    Last name <span className="text-hydro-400">*</span>
                    <input name="last_name" type="text" autoComplete="family-name" required placeholder="Smith" onBlur={handleBlur} onChange={handleChange} className={inputClass} />
                    {fieldErrors.last_name && <span className="mt-2 block text-sm text-red-400">{fieldErrors.last_name}</span>}
                  </label>
                </div>

                <label className={labelClass}>
                  Email <span className="text-hydro-400">*</span>
                  <input name="email" type="email" autoComplete="email" required placeholder="jane@example.com" onBlur={handleBlur} onChange={handleChange} className={inputClass} />
                  {fieldErrors.email && <span className="mt-2 block text-sm text-red-400">{fieldErrors.email}</span>}
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Phone
                    <input name="phone" type="tel" autoComplete="tel" placeholder="(281) 555-0100" className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    ZIP code <span className="text-hydro-400">*</span>
                    <input name="zip" type="text" inputMode="numeric" autoComplete="postal-code" required maxLength={10} placeholder="77449" onBlur={handleBlur} onChange={handleChange} className={`${inputClass} font-mono`} />
                    {fieldErrors.zip && <span className="mt-2 block text-sm text-red-400">{fieldErrors.zip}</span>}
                  </label>
                </div>
              </div>

              <div id="assessment-details" tabIndex={-1} className={step === 2 ? "space-y-6 outline-none" : "hidden"} aria-hidden={step !== 2}>
                <label className={labelClass}>
                  Property address <span className="font-normal text-fog-400">(optional)</span>
                  <input name="address" type="text" autoComplete="street-address" placeholder="123 Main St, Katy, TX" className={inputClass} />
                </label>

                <label className={labelClass}>
                  Insurance carrier <span className="font-normal text-fog-400">(optional)</span>
                  <select name="carrier" className={inputClass} defaultValue="">
                    <option value="">Select a carrier</option>
                    {carriers.map((carrier) => <option key={carrier} value={carrier}>{carrier}</option>)}
                  </select>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Power near main shutoff
                    <select name="power_within_12ft" className={inputClass} defaultValue="">
                      <option value="">Not answered</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unsure">Not sure</option>
                    </select>
                  </label>
                  <label className={labelClass}>
                    Wi-Fi reaches shutoff area
                    <select name="wifi_at_install_location" className={inputClass} defaultValue="">
                      <option value="">Not answered</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="unsure">Not sure</option>
                    </select>
                  </label>
                </div>

                <label className={labelClass}>
                  Fire-sprinkler system
                  <select name="fire_sprinkler_system" className={inputClass} defaultValue="">
                    <option value="">Not answered</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Not sure</option>
                  </select>
                </label>

                <label className={labelClass}>
                  Anything we should know <span className="font-normal text-fog-400">(optional)</span>
                  <textarea name="message" rows={4} maxLength={2000} placeholder="Device already purchased, previous leaks, access limitations, or timing needs" className={inputClass} />
                </label>
              </div>

              {error && <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm font-medium text-red-300">{error}</div>}

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="rounded-lg border border-fog-300/20 px-6 py-4 text-sm font-semibold text-fog-100 transition-all hover:bg-white/5 sm:w-auto">
                    Back
                  </button>
                )}
                <button type="submit" disabled={submitting} className="w-full rounded-lg bg-hydro-400 px-6 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-hydro-400/25 transition-all hover:bg-hydro-300 disabled:cursor-not-allowed disabled:opacity-50">
                  {step === 1 ? "Continue" : submitting ? "Submitting..." : "Request installation assessment"}
                </button>
              </div>

              <p className="text-center text-sm leading-relaxed text-fog-300">
                We use this information only to respond to your installation request.
                Insurance discounts are determined by your insurer and are not guaranteed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
