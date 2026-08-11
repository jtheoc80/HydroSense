import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><div className="border-b border-white/10 bg-ink-950 px-4 py-2.5 text-xs text-fog-300"><nav className="mx-auto flex max-w-[1600px] items-center gap-5" aria-label="HydroSense Admin"><span className="font-bold uppercase tracking-[0.14em] text-hydro-300">HydroSense Admin</span><Link href="/admin/leads" className="hover:text-fog-50">Leads</Link><Link href="/admin/site-visits" className="hover:text-fog-50">Site visits</Link><Link href="/admin/quotes" className="hover:text-fog-50">Quotes</Link></nav></div>{children}</>;
}
