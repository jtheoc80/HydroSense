export default function FreezeDamage() {
  return (
    <section id="freeze-damage" className="py-20 lg:py-28 bg-ink-950/50">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-hydro-400 mb-4">
              Long-tail freeze risk
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-fog-50 mb-6">
              Everything seemed fine after the freeze. Then it wasn't.
            </h2>
            <div className="space-y-4 text-fog-200 leading-relaxed">
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
                required. The difference between a $280 drywall patch and a
                $35,000 remediation is whether the water ran for 8 seconds or
                8 hours.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-ink-800 border border-ink-700 rounded-xl p-6 lg:p-8">
              <p className="font-mono text-4xl lg:text-5xl text-signal-400 tracking-tight mb-2">
                $10B+
              </p>
              <p className="text-fog-50 font-semibold mb-2">
                Texas insurance industry losses from Winter Storm Uri
              </p>
              <p className="text-fog-300 text-sm leading-relaxed">
                The single largest cause category was burst supply lines
                downstream of unattended main shutoffs. Homes with smart
                shutoff devices filed claims at a fraction of the rate.
              </p>
              <p className="text-xs uppercase tracking-wider text-fog-400 mt-4">
                Texas Department of Insurance, 2021 catastrophe report
              </p>
            </div>

            <div className="bg-ink-800 border border-ink-700 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-2xl text-hydro-400">8 sec</p>
                  <p className="text-sm text-fog-300 mt-1">
                    Typical shutoff response time
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-signal-400">$35,000</p>
                  <p className="text-sm text-fog-300 mt-1">
                    Average unmitigated water claim
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-hydro-400">$280</p>
                  <p className="text-sm text-fog-300 mt-1">
                    Average mitigated repair cost
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl text-signal-400">125x</p>
                  <p className="text-sm text-fog-300 mt-1">
                    Cost difference: caught vs. missed
                  </p>
                </div>
              </div>
            </div>

            <a href="#lead-form" className="btn-primary w-full text-center block">
              Protect your home. Get a quote.
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
