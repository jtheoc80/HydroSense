import TrackedPhoneLink from "./TrackedPhoneLink";
import { homepagePlumbingTrustStatement } from "@/lib/business/plumbing-license";

export default function CriticalBar() {
  return (
    <div className="sticky top-0 z-50 h-[42px] border-b border-white/10 bg-[#00163f] text-white">
      <div className="section-container flex h-full items-center justify-between gap-4 py-0 text-sm">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="inline-flex shrink-0 items-center rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-0.5 text-[11px] font-semibold leading-5 uppercase tracking-[0.14em] text-sky-200"
          >
            Greater Houston
          </span>
          <p className="truncate text-xs text-slate-200 sm:text-sm">
            Whole-home domestic-water shutoff installation
            <span className="hidden lg:inline">
              {" "}• {homepagePlumbingTrustStatement}
            </span>
          </p>
        </div>
        <TrackedPhoneLink
          trackingLocation="trust_bar"
          className="shrink-0 whitespace-nowrap text-xs font-semibold text-white transition-colors hover:text-sky-200 sm:text-sm"
        >
          Call (281) 694-5754
        </TrackedPhoneLink>
      </div>
    </div>
  );
}
