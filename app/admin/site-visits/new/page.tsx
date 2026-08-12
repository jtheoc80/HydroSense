import type { Metadata } from "next";
import NewSiteVisitForm from "./NewSiteVisitForm";

export const metadata: Metadata = { title: "Admin | Schedule Site Visit", robots: { index: false, follow: false } };

export default function NewSiteVisitPage() {
  return <NewSiteVisitForm />;
}
