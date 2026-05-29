import { Metadata } from "next";
import QuoteFormClient from "../QuoteFormClient";

export const metadata: Metadata = {
  title: "Admin | New Quote",
  robots: { index: false, follow: false },
};

export default function NewQuotePage() {
  return <QuoteFormClient mode="new" />;
}
