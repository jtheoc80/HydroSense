export default function TheCertificate() {
  return (
    <section id="the-certificate" className="py-20 lg:py-28">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Prose */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-6">
              The certificate is the product
            </h2>
            <div className="space-y-4 text-fog-200 leading-relaxed">
              <p>
                A smart water shutoff by itself does not earn the insurance discount. The
                device is the hardware. The certificate is the document your carrier needs on
                file to apply the credit.
              </p>
              <p>
                Most homeowners who install a shutoff valve never get the paperwork to their
                agent. They own the device but miss the savings entirely.
              </p>
              <p>
                HydroSense handles both sides. We install the device with a Texas-licensed
                RMP plumber, then issue a carrier-recognized certificate the same day. We
                email it directly to you and to your insurance agent.
              </p>
              <p>
                At renewal, we reissue the certificate so the discount stays applied. No
                lapse, no missed credits, no phone tag with your agent.
              </p>
            </div>
          </div>

          {/* Certificate facsimile */}
          <div className="relative">
            <div className="bg-fog-50 text-ink-950 rounded-sm border-2 border-fog-200 p-8 lg:p-10 font-body relative overflow-hidden">
              {/* Watermark */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span className="text-7xl font-display text-fog-200/40 -rotate-12 uppercase tracking-widest">
                  Sample
                </span>
              </div>

              {/* Document content */}
              <div className="relative z-10">
                <div className="text-center mb-6 pb-6 border-b-2 border-ink-950/10">
                  <p className="font-display text-2xl text-ink-950">HydroSense</p>
                  <p className="text-xs uppercase tracking-widest text-fog-300 mt-1">
                    Smart Water Shutoff Installation Certificate
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-fog-300">Property:</span>
                    <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                      1234 Oak Meadow Ln, Houston TX 77024
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-fog-300">Install Date:</span>
                    <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                      2026-05-15
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-fog-300">Device:</span>
                    <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                      Moen Flo Smart Water Monitor
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-fog-300">Serial No.:</span>
                    <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                      FLO-2026-049281
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-fog-300">TX RMP No.:</span>
                    <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                      RMP-41273
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-fog-300">Issued By:</span>
                    <span className="font-mono text-ink-800 border-b border-dashed border-fog-200">
                      HydroSense, Lead Ledger Pro LLC
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-ink-950/10 text-xs text-fog-300 text-center">
                  This certificate confirms installation of a carrier-recognized automatic water
                  shutoff device at the property listed above by a Texas-licensed Responsible
                  Master Plumber.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
