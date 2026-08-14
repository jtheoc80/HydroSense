export const LEAD_STATUSES = [
  "new",
  "booked",
  "showed",
  "quoted",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadStatusUpdate {
  id: string;
  status: LeadStatus;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isLeadStatus(value: unknown): value is LeadStatus {
  return (
    typeof value === "string" &&
    LEAD_STATUSES.includes(value as LeadStatus)
  );
}

export function parseLeadStatusUpdate(value: unknown): LeadStatusUpdate | null {
  if (!value || typeof value !== "object") return null;

  const { id, status } = value as Record<string, unknown>;
  if (typeof id !== "string" || !UUID_PATTERN.test(id) || !isLeadStatus(status)) {
    return null;
  }

  return { id, status };
}

export function leadStatusLabel(status: LeadStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
