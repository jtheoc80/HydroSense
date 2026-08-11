import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { customerPortalUrl } from "@/lib/site-visits/format";
import { getAdminVisitDetail, SiteVisitValidationError } from "@/lib/site-visits/service";
import SiteVisitDetail from "./SiteVisitDetail";

export const metadata: Metadata = { title: "Admin | Site Visit", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SiteVisitDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ delivery?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  try {
    const detail = await getAdminVisitDetail(id);
    return <SiteVisitDetail {...detail} portalUrl={customerPortalUrl(detail.visit.customer_portal_token)} initialDeliveryFailure={query.delivery === "failed"} />;
  } catch (error) {
    if (error instanceof SiteVisitValidationError) notFound();
    throw error;
  }
}
