import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomerPortalData, SiteVisitValidationError } from "@/lib/site-visits/service";
import CustomerPortal from "./CustomerPortal";

export const metadata: Metadata = {
  title: "Your HydroSense Site Visit",
  description: "Confirm and prepare for your HydroSense home water assessment.",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerSiteVisitPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const visit = await getCustomerPortalData(token);
    return <CustomerPortal token={token} initialVisit={visit} />;
  } catch (error) {
    if (error instanceof SiteVisitValidationError) notFound();
    throw error;
  }
}
