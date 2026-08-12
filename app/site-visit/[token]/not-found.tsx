import Image from "next/image";

export default function CustomerSiteVisitNotFound() {
  return <main className="min-h-screen bg-ink-950 px-4 py-12 text-fog-100"><div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-ink-900 p-7 text-center"><Image src="/icon.png" alt="HydroSense" width={48} height={48} className="mx-auto rounded-xl" /><h1 className="mt-5 font-display text-3xl text-fog-50">Appointment link unavailable</h1><p className="mt-3 text-sm leading-relaxed text-fog-300">This link is invalid or no longer available. Call HydroSense at <a href="tel:+12816945754" className="font-semibold text-hydro-300">(281) 694-5754</a> for help.</p></div></main>;
}
