import type { CustomerSummary, ReadinessResult, SiteAssessment } from "./types";
import { buildCorrectiveActions } from "./readiness";

const outcomeCopy: Record<ReadinessResult["status"], { title: string; detail: string }> = {
  unassessed: {
    title: "Assessment incomplete",
    detail: "HydroSense needs to complete the required observations before determining installation readiness.",
  },
  ready_for_proposal: {
    title: "Ready for proposal",
    detail: "The visible assessment found no installation blocker. HydroSense can prepare the appropriate monitoring proposal.",
  },
  site_prep_required: {
    title: "Site preparation required",
    detail: "The home can move toward a proposal after the listed preparation items are addressed.",
  },
  leak_repair_required: {
    title: "Leak repair required before installation",
    detail: "The visit can document conditions, but the monitoring device cannot be installed until active or unresolved leakage is remedied and reassessed.",
  },
  plumber_review_required: {
    title: "Licensed plumber review required",
    detail: "A water-entry, valve, sprinkler-branch, or location concern requires licensed review before installation planning continues.",
  },
};

export function buildCustomerSummary(
  assessment: SiteAssessment,
  readiness: ReadinessResult,
  followUpAt?: string
): CustomerSummary {
  const copy = outcomeCopy[readiness.status];
  const correctiveActions = buildCorrectiveActions(readiness.blockers);
  const areasReviewed = [
    "Exterior water entry, meter, and shutoff",
    "Kitchen water-connected fixtures",
    ...assessment.bathrooms.map((bathroom) => bathroom.label),
    "Laundry and utility area",
    "Connectivity and proposed monitoring location",
  ];
  if (assessment.otherWaterAreas.length > 0) areasReviewed.push("Other water-connected areas");

  const ready = readiness.status === "ready_for_proposal";
  return {
    outcomeTitle: copy.title,
    outcomeDetail: copy.detail,
    areasReviewed,
    blockers: readiness.blockers.map(({ title, detail, owner }) => ({ title, detail, owner })),
    correctiveActions,
    hydrosenseNextStep: ready
      ? "HydroSense will prepare a draft proposal for the appropriate monitoring device."
      : "HydroSense will keep the visit open for follow-up and review your completion report before changing readiness.",
    customerNextStep: ready
      ? "Review the proposal when HydroSense sends it."
      : "Complete the listed work, then use this page to request a HydroSense recheck.",
    ...(followUpAt ? { followUpAt } : {}),
  };
}
