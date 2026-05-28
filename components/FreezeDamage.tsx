export default function FreezeDamage() {
  return (
    <section id="freeze-damage" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Editorial copy */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Long-tail freeze risk
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] text-fog-50 mb-8">
              Everything seemed fine after the freeze.{" "}
              <span className="text-fog-200">Then it wasn't.</span>
            </h2>
            <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
              <p>
                A hard freeze does not always announce itself immediately.
                Supply lines develop hairline cracks under pressure that hold
                for days, weeks, sometimes months. The pipe does not burst
                during the event. It fails at 2 AM on a Tuesday in March when
                the pressure fluctuates and the weakened fitting gives way.
              </p>
              <p>
                By the time the homeowner notices, there are 200 gallons of
                water behind the drywall. The damage is not a broken pipe. The
                damage is mold remediation, subfloor replacement, and a
                restoration crew in your home for three weeks.
              </p>
              <p>
                This is not hypothetical. This is the single most common claim
                pattern in the Houston metro insurance market. Carriers know
                it. That is why they reward the shutoff. The device catches the
                failure at the moment it begins, not hours later when the
                ceiling is sagging.
              </p>
              <p>
                A smart shutoff valve monitors flow and pressure continuously.
                When it detects an anomaly consistent with a leak, it closes
                the main water line within seconds. No human intervention
                required. The difference between a{" "}
                <span className="font-mono text-hydro-400">$280</span> drywall
                patch and a{" "}
                <span className="font-mono text-signal-400">$35,000</span>{" "}
                remediation is whether the water ran for 8 seconds or 8 hours.
              </p>
            </div>
          </div>

          {/* Data cards */}
          <div className="space-y-6 lg:sticky lg:top-32">
            {/* Uri stat */}
            <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9 backdrop-blur-sm">
              <p className="font-mono text-5xl lg:text-6xl text-signal-400 tracking-tight leading-none mb-4">
                $10B+
              </p>
              <p className="text-fog-50 font-semibold text-lg mb-3">
                Texas insurance industry losses from Winter Storm Uri
              </p>
              <p className="text-fog-300 leading-relaxed">
                The single largest cause category was burst supply lines
                downstream of unattended main shutoffs. Homes with smart
                shutoff devices filed claims at a fraction of the rate.
              </p>
              <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mt-5">
                Texas Department of Insurance, 2021 catastrophe report
              </p>
            </div>

            {/* Comparison grid */}
            <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-mono text-3xl text-hydro-400 tracking-tight">
                    8 sec
                  </p>
                  <p className="text-sm text-fog-300 mt-2">
                    Typical shutoff response time
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl text-signal-400 tracking-tight">
                    $35,000
                  </p>
                  <p className="text-sm text-fog-300 mt-2">
                    Average unmitigated water claim
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl text-hydro-400 tracking-tight">
                    $280
                  </p>
                  <p className="text-sm text-fog-300 mt-2">
                    Average mitigated repair cost
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl text-signal-400 tracking-tight">
                    125x
                  </p>
                  <p className="text-sm text-fog-300 mt-2">
                    Cost difference: caught vs. missed
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#lead-form"
              className="block w-full text-center rounded-xl bg-hydro-400 text-ink-950 font-semibold text-base px-8 py-4 shadow-lg shadow-hydro-400/20 hover:bg-hydro-300 transition-all"
            >
              Protect your home. Get a quote.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
