import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "@/lib/supabase";
import QuotesListClient from "./QuotesListClient";
import type { Quote } from "./types";

export const metadata: Metadata = {
  title: "Admin | Quotes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  noStore();

  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="min-h-screen bg-ink-900 p-8">
        <p className="text-alert-500">
          Error loading quotes: {error.message}
        </p>
      </div>
    );
  }

  return <QuotesListClient quotes={(quotes || []) as Quote[]} />;
}
