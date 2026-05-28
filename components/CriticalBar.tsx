export default function CriticalBar() {
  return (
    <div className="sticky top-0 z-50 bg-ink-950/95 backdrop-blur-md border-b border-ink-700/30">
      <div className="section-container flex items-center justify-between py-2.5 text-sm">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-alert-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-alert-500" />
          </span>
          <p className="text-fog-200">
            <span className="hidden sm:inline">
              Texas homeowners insurance is up 46% in two years. Most homeowners
              qualify for{" "}
              <span className="font-mono text-signal-400 font-medium">
                $300 to $600
              </span>{" "}
              in annual credits they never collect.
            </span>
            <span className="sm:hidden text-xs">
              TX insurance up 46%.{" "}
              <span className="font-mono text-signal-400 font-medium">
                $300-$600/yr
              </span>{" "}
              in credits uncollected.
            </span>
          </p>
        </div>
        <a
          href="#savings-estimator"
          className="shrink-0 text-hydro-400 hover:text-hydro-300 transition-colors font-medium whitespace-nowrap ml-4 text-xs sm:text-sm"
        >
          See the math
        </a>
      </div>
    </div>
  );
}
