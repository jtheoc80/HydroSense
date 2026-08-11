import type { AppointmentStatus } from "./types";

export interface TransitionContext {
  adminOverrideReason?: string;
}

export interface TransitionRule {
  from: AppointmentStatus;
  to: AppointmentStatus;
  requiresAdminOverride?: boolean;
}

/**
 * The only legal appointment-state edges. Schedule edits that retain the same
 * state are not transitions, but still require their own structured audit event.
 */
export const TRANSITION_RULES: readonly TransitionRule[] = [
  { from: "draft", to: "awaiting_confirmation" },
  { from: "draft", to: "canceled" },
  { from: "awaiting_confirmation", to: "confirmed" },
  { from: "awaiting_confirmation", to: "reschedule_requested" },
  { from: "awaiting_confirmation", to: "canceled" },
  { from: "confirmed", to: "awaiting_confirmation" }, // Admin reschedule.
  { from: "confirmed", to: "en_route" },
  { from: "confirmed", to: "in_progress" },
  { from: "confirmed", to: "reschedule_requested" },
  { from: "confirmed", to: "canceled" },
  { from: "confirmed", to: "no_show" },
  { from: "reschedule_requested", to: "awaiting_confirmation" },
  { from: "reschedule_requested", to: "confirmed" }, // Admin declines and retains the confirmed time.
  { from: "reschedule_requested", to: "canceled" },
  { from: "en_route", to: "in_progress" },
  { from: "en_route", to: "canceled", requiresAdminOverride: true },
  { from: "in_progress", to: "completed" },
  { from: "in_progress", to: "canceled", requiresAdminOverride: true },
  { from: "completed", to: "recheck_requested" },
  { from: "recheck_requested", to: "recheck_scheduled" },
  { from: "recheck_requested", to: "recheck_closed" },
] as const;

export class InvalidSiteVisitTransitionError extends Error {
  constructor(
    public readonly from: AppointmentStatus,
    public readonly to: AppointmentStatus,
    message = `Cannot change a site visit from ${from} to ${to}`
  ) {
    super(message);
    this.name = "InvalidSiteVisitTransitionError";
  }
}

export function validateTransition(
  from: AppointmentStatus,
  to: AppointmentStatus,
  context: TransitionContext = {}
): void {
  if (from === to) return;
  const rule = TRANSITION_RULES.find((candidate) => candidate.from === from && candidate.to === to);
  if (!rule) throw new InvalidSiteVisitTransitionError(from, to);
  if (rule.requiresAdminOverride && !context.adminOverrideReason?.trim()) {
    throw new InvalidSiteVisitTransitionError(from, to, `Canceling an ${from.replace("_", "-")} visit requires an Admin override reason`);
  }
}

export function allowedTransitions(from: AppointmentStatus): AppointmentStatus[] {
  return TRANSITION_RULES.filter((rule) => rule.from === from).map((rule) => rule.to);
}
