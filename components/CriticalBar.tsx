export default function CriticalBar() {
  return (
    <div className="sticky top-0 z-50 bg-ink-950 border-b border-alert-500/30">
      <div className="section-container flex items-center justify-between py-2.5 text-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-alert-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-alert-500" />
          </span>
          <p className="text-fog-200">
            <span className="hidden sm:inline">
              Texas home insurance up 46% in two years. Most homeowners qualify for{" "}
              <span className="font-mono text-signal-300">$300 to $600</span> in annual credits
              they are not collecting.
            </span>
            <span className="sm:hidden">
              TX insurance up 46%.{" "}
              <span className="font-mono text-signal-300">$300-$600/yr</span> in credits uncollected.
            </span>
          </p>
        </div>
        <a
          href="#savings-estimator"
          className="shrink-0 text-hydro-400 hover:text-hydro-300 transition-colors font-medium whitespace-nowrap ml-4"
        >
          See the math
        </a>
      </div>
    </div>
  );
}
