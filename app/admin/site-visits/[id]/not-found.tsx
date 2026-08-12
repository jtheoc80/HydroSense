import Link from "next/link";

export default function SiteVisitNotFound() {
  return <main className="min-h-screen bg-ink-950 p-8 text-fog-100"><div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-ink-900 p-8"><h1 className="font-display text-3xl text-fog-50">Site visit not found</h1><p className="mt-3 text-sm text-fog-300">The record may have been removed or the link is incorrect.</p><Link href="/admin/site-visits" className="btn-primary mt-6">Back to site visits</Link></div></main>;
}
