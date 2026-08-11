import TrackedPhoneLink from "./TrackedPhoneLink";

const installationIncludes = [
  "Device selection matched to your plumbing",
  "Written scope and fixed-price proposal",
  "Plumbing installation, app setup, and testing",
  "Homeowner handoff and installation record",
];

const stats = [
  { value: "From $999", label: "Standard installation" },
  { value: "3", label: "Device families supported" },
  { value: "Greater Houston", label: "Primary service area" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 hydro-mesh">
      <div className="dot-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950/70" />

      <div className="section-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-hydro-400">
              Professional installation • Greater Houston
            </p>
            <h1 className="mb-7 font-display text-5xl leading-[1.04] text-fog-50 sm:text-6xl lg:text-[4.15rem]">
              Smart water shutoff installation for Houston-area homes.
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-fog-200 lg:text-xl">
              HydroSense installs and configures Flo by Moen, Phyn Plus, and
              StreamLabs systems, tests automatic shutoff performance, and
              provides a clear installation record at handoff.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#lead-form"
                className="inline-flex items-center justify-center rounded-lg bg-hydro-400 px-8 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-hydro-400/20 transition-all hover:-translate-y-0.5 hover:bg-hydro-300 hover:shadow-hydro-400/30 active:translate-y-0"
              >
                Check installation availability
              </a>
              <TrackedPhoneLink
                trackingLocation="hero"
                className="inline-flex items-center justify-center rounded-lg border border-fog-300/20 px-8 py-4 text-base font-medium text-fog-100 transition-all hover:border-fog-300/30 hover:bg-white/5"
              >
                Call (281) 694-5754
              </TrackedPhoneLink>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fog-400">
              Insurance incentives vary by insurer and policy. Confirm eligibility
              with your insurance agent before purchasing for a discount.
            </p>
          </div>

          <div className="rounded-2xl border border-hydro-400/20 bg-ink-800/75 p-7 shadow-2xl shadow-black/20 backdrop-blur-sm lg:p-9">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-hydro-400">
                  A tested handoff
                </p>
                <h2 className="font-display text-2xl text-fog-50 sm:text-3xl">
                  What your installation includes
                </h2>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hydro-400/10 text-hydro-400" aria-hidden="true">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m6-3.75A11.95 11.95 0 0 1 12 2.25 11.95 11.95 0 0 1 3 6c0 5.59 3.82 10.29 9 11.62 5.18-1.33 9-6.03 9-11.62Z" />
                </svg>
              </div>
            </div>

            <ul className="space-y-4">
              {installationIncludes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-fog-200 sm:text-base">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-hydro-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-ink-700/50 bg-ink-900/70 p-5">
              <p className="mb-2 text-sm font-semibold text-fog-50">Before we schedule</p>
              <p className="text-sm leading-relaxed text-fog-300">
                We confirm main-line access, pipe size, nearby power, Wi-Fi reach,
                fire-sprinkler routing, and whether existing leaks or plumbing
                defects must be corrected first.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-20 lg:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-ink-700/30 bg-ink-800/40 p-5 text-center backdrop-blur-sm lg:p-6">
              <p className="font-mono text-xl tracking-tight text-hydro-400 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-fog-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
