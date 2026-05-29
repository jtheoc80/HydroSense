import { Metadata } from "next";
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
        <a href="/admin/quotes" className="text-hydro-400 text-sm mt-4 inline-block">
          Back to quotes
        </a>
      </div>
    );
  }

  return <QuoteFormClient mode="edit" existing={quote as Quote} />;
}
