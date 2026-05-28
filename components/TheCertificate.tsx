export default function TheCertificate() {
  return (
    <section id="the-certificate" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Copy */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-signal-400 font-medium mb-4">
              The actual product
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] text-fog-50 mb-8">
              The certificate is the product.{" "}
              <span className="text-fog-200">The device is the hardware.</span>
            </h2>
            <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
              <p>
                A smart water shutoff by itself does not earn the insurance
                discount. The device is the hardware. The certificate is the
                document your carrier needs on file to apply the credit.
              </p>
              <p>
                Most homeowners who install a shutoff valve never get the
                paperwork to their agent. They own the device but miss the
                savings entirely. The install happened. The documentation
                did not.
              </p>
              <p>
                HydroSense handles both sides. A licensed Texas Master Plumber
                installs the device, then we issue a
                carrier-recognized certificate the same day. We email it
                directly to you and to your insurance agent.
              </p>
              <p>
                At renewal, we reissue the certificate so the discount stays
                applied. No lapse, no missed credits, no phone tag with your
                agent.
              </p>
            </div>
            <a
              href="#lead-form"
              className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-base px-8 py-4 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 transition-all mt-10"
            >
              Get your certificate. Get the credit.
            </a>
          </div>

          {/* Certificate facsimile */}
          <div className="relative lg:sticky lg:top-32">
            <div className="bg-fog-50 text-ink-950 rounded-lg border-2 border-signal-400/30 p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-signal-400/10">
              {/* Watermark */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span className="text-8xl font-display text-fog-200/[0.06] -rotate-12 uppercase tracking-widest">
                  Sample
                </span>
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8 pb-8 border-b-2 border-signal-400/15">
                  <p className="font-display text-2xl lg:text-3xl text-ink-950 tracking-tight">
                    HydroSense Texas
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-fog-400 mt-2">
                    Smart Water Shutoff Installation Certificate
                  </p>
                </div>

                {/* Fields */}
                <div className="space-y-4 text-sm">
                  {[
                    ["Property", "1234 Oak Meadow Ln, Houston TX 77024"],
                    ["Install Date", "2026-05-15"],
                    ["Device", "Moen Flo Smart Water Monitor"],
                    ["Serial No.", "FLO-2026-049281"],
                    ["TX Master Plumber", "License on file"],
                    [
                      "Issued By",
                      "HydroSense Texas, Lead Ledger Pro LLC",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[140px_1fr] gap-3"
                    >
                      <span className="text-fog-400 text-xs uppercase tracking-wider pt-0.5">
                        {label}:
                      </span>
                      <span className="font-mono text-ink-800 text-sm border-b border-dashed border-fog-200 pb-1">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-10 pt-8 border-t-2 border-signal-400/15 text-xs text-fog-400 text-center leading-relaxed">
                  This certificate confirms installation of a carrier-recognized
                  automatic water shutoff device at the property listed above by
                  a Texas Registered Master Plumber.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
