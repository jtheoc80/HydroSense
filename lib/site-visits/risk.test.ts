import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateVisitRisk } from "./risk";

const now = new Date("2026-08-10T12:00:00.000Z");
const inHours = (hours: number) => new Date(now.getTime() + hours * 3_600_000).toISOString();

describe("evaluateVisitRisk", () => {
  it("marks an unconfirmed visit under 24 hours as high risk", () => {
    assert.equal(evaluateVisitRisk({
      scheduledStart: inHours(12), appointmentStatus: "awaiting_confirmation", previsitStatus: "pending", now,
    }).level, "high");
  });

  it("marks an unresolved reschedule request as high risk", () => {
    assert.equal(evaluateVisitRisk({
      scheduledStart: inHours(72), appointmentStatus: "reschedule_requested", previsitStatus: "complete",
      confirmedAt: now.toISOString(), now,
    }).level, "high");
  });

  it("marks all failed confirmation channels as high risk", () => {
    assert.equal(evaluateVisitRisk({
      scheduledStart: inHours(72), appointmentStatus: "awaiting_confirmation", previsitStatus: "pending",
      allConfirmationChannelsFailed: true, now,
    }).level, "high");
  });

  it("marks confirmed but incomplete preparation under 24 hours as medium risk", () => {
    assert.equal(evaluateVisitRisk({
      scheduledStart: inHours(8), appointmentStatus: "confirmed", previsitStatus: "pending",
      confirmedAt: now.toISOString(), now,
    }).level, "medium");
  });

  it("marks confirmed and prepared as low risk", () => {
    assert.equal(evaluateVisitRisk({
      scheduledStart: inHours(48), appointmentStatus: "confirmed", previsitStatus: "complete",
      confirmedAt: now.toISOString(), now,
    }).level, "low");
  });
});
