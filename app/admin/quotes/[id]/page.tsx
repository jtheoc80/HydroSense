import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import QuoteFormClient from "../QuoteFormClient";
import QuoteLog from "../QuoteLog";
import type { Quote } from "../types";
import type { QuoteDeliveryEvent } from "@/lib/quote-delivery";

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
  const [quoteResult, deliveryResult] = await Promise.all([
    supabase.from("quotes").select("*").eq("id", id).single(),
    supabase
      .from("quote_delivery_events")
      .select(
        "id,quote_id,attempt_id,channel,provider,recipient,copy_recipient,status,provider_message_id,provider_status,error,created_at,completed_at"
      )
      .eq("quote_id", id)
      .order("created_at", { ascending: false }),
  ]);
  const { data: quote, error } = quoteResult;

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

  if (deliveryResult.error) {
    console.error("Unable to load quote delivery log:", deliveryResult.error);
  }

  const typedQuote = quote as Quote;

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
      <QuoteFormClient mode="edit" existing={typedQuote} />
      <div className="bg-ink-950">
        <QuoteLog
          quote={typedQuote}
          deliveryEvents={(deliveryResult.data || []) as QuoteDeliveryEvent[]}
        />
      </div>
    </>
  );
}
