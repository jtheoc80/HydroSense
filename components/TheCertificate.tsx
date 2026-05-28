export default function TheCertificate() {
  return (
    <section id="the-certificate" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-hydro-400 mb-4">
              The actual product
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-6">
              The certificate is the product. The device is the hardware.
            </h2>
            <div className="space-y-4 text-fog-200 leading-relaxed">
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
                HydroSense handles both sides. A Texas Master Plumber (License
                MPL 43057) installs the device, then we issue a
                carrier-recognized certificate the same day. We email it
                directly to you and to your insurance agent.
              </p>
              <p>
                At renewal, we reissue the certificate so the discount stays
                applied. No lapse, no missed credits, no phone tag with your
                agent.
              </p>
            </div>
            <a href="#lead-form" className="btn-primary mt-8 inline-block">
              Get your certificate. Get the credit.
            </a>
          </div>

          <div className="relative">
            <div className="bg-fog-50 text-ink-950 rounded-sm border-2 border-signal-400/40 p-8 lg:p-10 font-body relative overflow-hidden shadow-2xl shadow-signal-400/5">
              {/* Watermark */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span className="text-7xl font-display text-fog-200/[0.06] -rotate-12 uppercase tracking-widest">
                  Sample
                </span>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-6 pb-6 border-b-2 border-signal-400/20">
                  <p className="font-display text-2xl text-ink-950">
                    HydroSense Texas
                  </p>
                  <p className="text-xs uppercase tracking-widest text-fog-400 mt-1">
                    Smart Water Shutoff Installation Certificate
                  </p>
                </div>

                <div className="space-y-3.5 text-sm">
                  {[
                    ["Property", "1234 Oak Meadow Ln, Houston TX 77024"],
                    ["Install Date", "2026-05-15"],
                    ["Device", "Moen Flo Smart Water Monitor"],
                    ["Serial No.", "FLO-2026-049281"],
                    ["TX Master Plumber", "License MPL 43057"],
                    ["Issued By", "HydroSense Texas, Lead Ledger Pro LLC"],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[130px_1fr] gap-2">
                      <span className="text-fog-400">{label}:</span>
                      <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-signal-400/20 text-xs text-fog-400 text-center">
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
