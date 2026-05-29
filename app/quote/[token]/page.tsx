import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";
import QuoteDocument from "./QuoteDocument";

export const metadata: Metadata = {
  title: "Your HydroSense Quote",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("public_token", token)
    .single();

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-[#001A4E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F8FAFC] text-xl mb-2">Quote not found</p>
          <p className="text-[#9AA8BF] text-sm">
            This link may have expired or is invalid.
          </p>
        </div>
      </div>
    );
  }

  // Record first view server-side
  if (quote.status === "sent" && !quote.viewed_at) {
    await supabase
      .from("quotes")
      .update({
        status: "viewed",
        viewed_at: new Date().toISOString(),
      })
      .eq("id", quote.id);
    quote.status = "viewed";
    quote.viewed_at = new Date().toISOString();
  }

  const isExpired =
    quote.expires_at && new Date(quote.expires_at) < new Date();
  const isActionable =
    !isExpired &&
    (quote.status === "sent" || quote.status === "viewed");

  return (
    <QuoteDocument
      quote={quote}
      token={token}
      isExpired={!!isExpired}
      isActionable={isActionable}
      mpl={MASTER_PLUMBER_LICENSE}
    />
  );
}
