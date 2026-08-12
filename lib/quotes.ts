import { supabase } from "./supabase";

export const QUOTE_STATUSES = [
  "draft", "sent", "viewed", "accepted", "declined", "expired",
  "deposit_paid", "install_scheduled", "install_complete", "deposit_refunded", "canceled",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

/** Allocates a unique quote number atomically in Postgres. */
export async function allocateQuoteNumber(year = new Date().getUTCFullYear()): Promise<string> {
  const { data, error } = await supabase.rpc("allocate_quote_number", { p_year: year });
  if (error || typeof data !== "string") {
    throw new Error(`Unable to allocate quote number: ${error?.message || "invalid database response"}`);
  }
  return data;
}
