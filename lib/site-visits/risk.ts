import type { AppointmentStatus, PrevisitStatus } from "./types";

export type RiskLevel = "high" | "medium" | "low" | "none";

export interface RiskInput {
  scheduledStart: string | Date;
  appointmentStatus: AppointmentStatus;
  previsitStatus: PrevisitStatus;
  confirmedAt?: string | null;
  allConfirmationChannelsFailed?: boolean;
  now?: Date;
  arrivalWindowMinutes?: number;
  overdueGraceMinutes?: number;
}

export interface RiskResult {
  level: RiskLevel;
  reasons: string[];
  nextAction: string;
}

export function evaluateVisitRisk(input: RiskInput): RiskResult {
  const inactive = ["canceled", "completed", "no_show", "recheck_closed", "recheck_scheduled"].includes(input.appointmentStatus);
  if (inactive) return { level: "none", reasons: [], nextAction: "No action required" };

  const now = input.now ?? new Date();
  const hoursUntil = (new Date(input.scheduledStart).getTime() - now.getTime()) / 3_600_000;
  const reasons: string[] = [];

  if (hoursUntil < 0 && ["awaiting_confirmation", "confirmed", "en_route", "reschedule_requested"].includes(input.appointmentStatus)) {
    const overdueMinutes = -hoursUntil * 60;
    const resolutionBoundary = (input.arrivalWindowMinutes ?? 30) + (input.overdueGraceMinutes ?? 15);
    const beyondWindow = overdueMinutes > resolutionBoundary;
    return {
      level: "high",
      reasons: [beyondWindow
        ? "Appointment is past its arrival window and remains unresolved"
        : "Appointment start time has passed and remains unresolved"],
      nextAction: beyondWindow
        ? "Resolve visit: mark no-show or completed, reschedule, or cancel"
        : "Resolve visit",
    };
  }

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
