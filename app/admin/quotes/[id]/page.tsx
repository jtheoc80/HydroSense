import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import QuoteFormClient from "../QuoteFormClient";
import type { Quote } from "../types";

export const metadata: Metadata = {
  title: "Admin | Edit Quote",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-ink-900 p-8">
        <p className="text-alert-500">Quote not found.</p>
        <Link href="/admin/quotes" className="mt-4 inline-block text-sm text-hydro-400">
          Back to quotes
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-ink-950 px-6 pt-5">
        {quote.site_visit_id && (
          <Link
            href={`/admin/site-visits/${quote.site_visit_id}`}
            className="inline-flex min-h-10 items-center rounded-lg border border-hydro-400/40 px-3 text-xs font-semibold text-hydro-300"
          >
            Back to source site visit
          </Link>
        )}
      </div>
      <QuoteFormClient mode="edit" existing={quote as Quote} />
    </>
  );
}
