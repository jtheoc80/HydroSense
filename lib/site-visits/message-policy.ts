import type { SiteVisit, SiteVisitMessage } from "./types";

export type SiteVisitMessageKind =
  | "confirmation"
  | "confirmation-receipt"
  | "previsit-complete"
  | "reminder-24h"
  | "reminder-3h"
  | "en-route"
  | "completion"
  | "recheck-receipt";

export type MessageBinding = "schedule" | "visit" | "assessment";

export const MESSAGE_BINDING: Readonly<Record<SiteVisitMessageKind, MessageBinding>> = {
  confirmation: "schedule",
  "confirmation-receipt": "schedule",
  "previsit-complete": "visit",
  "reminder-24h": "schedule",
  "reminder-3h": "schedule",
  "en-route": "schedule",
  completion: "assessment",
  "recheck-receipt": "assessment",
};

export function messageKeyFor(
  kind: SiteVisitMessageKind,
  visit: Pick<SiteVisit, "schedule_version" | "assessment_version">
): string {
  const binding = MESSAGE_BINDING[kind];
  if (binding === "schedule") return `${kind}:v${visit.schedule_version}`;
  if (binding === "assessment") return `${kind}:assessment-v${visit.assessment_version}`;
  return kind;
}

export const MESSAGE_CLAIM_LEASE_MS = 5 * 60_000;

export function isCurrentMessageKey(
  messageKey: string,
  visit: Pick<SiteVisit, "schedule_version" | "assessment_version">
): boolean {
  const assessment = /:assessment-v(\d+)$/.exec(messageKey);
  if (assessment) return Number(assessment[1]) === visit.assessment_version;
  const schedule = /:v(\d+)$/.exec(messageKey);
  if (schedule) return Number(schedule[1]) === visit.schedule_version;
  return true;
}

export function isMessageClaimAvailable(
  message: Pick<SiteVisitMessage, "status" | "claimed_at">,
  now = new Date(),
  leaseMs = MESSAGE_CLAIM_LEASE_MS
): boolean {
  if (["pending", "failed"].includes(message.status)) return true;
  if (message.status !== "sending") return false;
  if (!message.claimed_at) return true;
  return new Date(message.claimed_at).getTime() <= now.getTime() - leaseMs;
}
