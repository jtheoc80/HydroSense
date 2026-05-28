const steps = [
  {
    number: "01",
    title: "Sign up",
    body: "Submit the form or call us. No commitment, no credit card. We collect your address, carrier, and policy details.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "15-minute assessment",
    body: "Phone call with our team. We review your plumbing layout, recommend the right device, and confirm your carrier's discount tier.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Service agreement",
    body: "You receive a written scope of work with exact pricing. No hidden fees. Approve before we schedule.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Professional install",
    body: "Texas Master Plumber on site for approximately 2 hours. Device installed at main water line. No drywall cuts, no mess.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.04A1.004 1.004 0 005 13.015V18a1 1 0 001 1h12a1 1 0 001-1v-4.985a1.004 1.004 0 00-1.036-.885l-5.384 3.04a1 1 0 01-.98 0zM20 7l-8 5-8-5V5a1 1 0 011-1h14a1 1 0 011 1v2z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "App handoff",
    body: "We configure the device, connect it to your phone, and walk you through the monitoring dashboard. You control it from day one.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Certificate to insurance",
    body: "Same-day certificate emailed to you and your agent. The discount applies at your next renewal. We reissue annually.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

export default function CustomerJourney() {
  return (
    <section id="customer-journey" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <div className="max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
            The process
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-fog-50 mb-5">
            How it works
          </h2>
          <p className="text-fog-300 text-lg leading-relaxed">
            Six steps from first contact to insurance credit applied. Most
            homeowners complete the process in under two weeks.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[8%] right-[8%] h-px bg-gradient-to-r from-hydro-400/40 via-ink-700 to-hydro-400/40" />
          <div className="grid grid-cols-6 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                <div className="w-20 h-20 rounded-2xl bg-ink-800/60 border border-ink-700/40 text-hydro-400 flex items-center justify-center mx-auto relative z-10 group-hover:border-hydro-400/40 group-hover:bg-ink-800 transition-all backdrop-blur-sm">
                  {step.icon}
                </div>
                <p className="font-mono text-xs text-hydro-400/60 mt-4 mb-2">
                  {step.number}
                </p>
                <h3 className="text-sm font-semibold text-fog-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-fog-300 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="lg:hidden space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-5 items-start bg-ink-800/30 border border-ink-700/30 rounded-xl p-5"
            >
              <div className="w-12 h-12 rounded-xl bg-ink-800/60 border border-ink-700/40 text-hydro-400 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-xs text-hydro-400/60">
                    {step.number}
                  </span>
                  <h3 className="text-sm font-semibold text-fog-50">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-fog-300 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#lead-form"
            className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-sm px-8 py-3.5 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 transition-all"
          >
            Start with step 1. It takes 60 seconds.
          </a>
        </div>
      </div>
    </section>
  );
}
