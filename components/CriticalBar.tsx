import TrackedPhoneLink from "./TrackedPhoneLink";

export default function CriticalBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-ink-700/30 bg-ink-950/95 backdrop-blur-md">
      <div className="section-container flex min-h-[42px] items-center justify-between gap-4 py-2.5 text-sm">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-hydro-400 opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-hydro-400" />
          </span>
          <p className="truncate text-xs text-fog-200 sm:text-sm">
            Greater Houston smart water shutoff installation
            <span className="hidden md:inline">
              {" "}• Work coordinated under Texas Master Plumber License MPL 43057
            </span>
          </p>
        </div>
        <TrackedPhoneLink
          trackingLocation="trust_bar"
          className="shrink-0 whitespace-nowrap text-xs font-semibold text-hydro-400 transition-colors hover:text-hydro-300 sm:text-sm"
        >
          (281) 694-5754
        </TrackedPhoneLink>
      </div>
    </div>
  );
}
