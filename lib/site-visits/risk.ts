import type { AppointmentStatus, PrevisitStatus } from "./types";

export type RiskLevel = "high" | "medium" | "low" | "none";

export interface RiskInput {
  scheduledStart: string | Date;
  appointmentStatus: AppointmentStatus;
  previsitStatus: PrevisitStatus;
  confirmedAt?: string | null;
  allConfirmationChannelsFailed?: boolean;
  now?: Date;
}

export interface RiskResult {
  level: RiskLevel;
  reasons: string[];
  nextAction: string;
}

export function evaluateVisitRisk(input: RiskInput): RiskResult {
  const inactive = ["canceled", "completed", "no_show"].includes(input.appointmentStatus);
  if (inactive) return { level: "none", reasons: [], nextAction: "No action required" };

  const now = input.now ?? new Date();
  const hoursUntil = (new Date(input.scheduledStart).getTime() - now.getTime()) / 3_600_000;
  const reasons: string[] = [];

  if (input.appointmentStatus === "reschedule_requested") {
    reasons.push("Reschedule request is awaiting HydroSense review");
  }
  if (input.allConfirmationChannelsFailed) {
    reasons.push("All confirmation delivery channels failed");
  }
  if (hoursUntil <= 24 && hoursUntil >= 0 && !input.confirmedAt) {
    reasons.push("Appointment is under 24 hours away and unconfirmed");
  }
  if (reasons.length > 0) {
    return { level: "high", reasons, nextAction: input.appointmentStatus === "reschedule_requested" ? "Resolve reschedule request" : "Contact customer now" };
  }

  if (hoursUntil <= 24 && hoursUntil >= 0 && input.previsitStatus !== "complete") {
    return {
      level: "medium",
      reasons: ["Appointment is under 24 hours away and the pre-visit form is incomplete"],
      nextAction: "Remind customer to complete preparation",
    };
  }

  if (input.confirmedAt && input.previsitStatus === "complete") {
    return { level: "low", reasons: ["Confirmed with preparation complete"], nextAction: "Prepare for visit" };
  }

  return { level: "none", reasons: [], nextAction: input.confirmedAt ? "Await pre-visit form" : "Await confirmation" };
}
