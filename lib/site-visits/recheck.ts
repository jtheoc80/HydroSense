import type { CorrectiveAction, SiteVisit } from "./types";

export function markCorrectiveActionsCustomerReported(
  actions: CorrectiveAction[],
  reportedAt: string
): CorrectiveAction[] {
  return actions.map((action) => action.status === "open"
    ? { ...action, status: "customer_reported_complete", customerCompletedAt: reportedAt }
    : action);
}

export function latestVisitInCycle<T extends Pick<SiteVisit, "assessment_version">>(cycle: T[]): T | null {
  return [...cycle].sort((a, b) => b.assessment_version - a.assessment_version)[0] || null;
}

export function quoteSourceForCycle<T extends Pick<SiteVisit, "assessment_version" | "appointment_status" | "readiness_status">>(
  cycle: T[]
): T | null {
  const latest = latestVisitInCycle(cycle);
  if (!latest || latest.appointment_status !== "completed") return null;
  return ["ready_for_proposal", "site_prep_required"].includes(latest.readiness_status) ? latest : null;
}
