import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mergeAssessment } from "@/lib/site-visits/assessment-defaults";
import { getSiteVisitById } from "@/lib/site-visits/repository";
import AssessmentClient from "./AssessmentClient";

export const metadata: Metadata = { title: "Admin | Field Assessment", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const visit = await getSiteVisitById(id);
  if (!visit) notFound();
  const bathroomCount = Number(visit.previsit_answers?.bathroomCount || 1);
  return <AssessmentClient visit={visit} initialAssessment={mergeAssessment(visit.assessment, bathroomCount)} />;
}
