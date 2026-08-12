import assert from "node:assert/strict";
import test from "node:test";
import { evaluateVisitRisk } from "./risk";

const now = new Date("2026-08-10T12:00:00.000Z");
const atMinutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();

test("a visit is high risk immediately after its start passes", () => {
  const risk = evaluateVisitRisk({
    scheduledStart: atMinutesAgo(1), appointmentStatus: "confirmed", previsitStatus: "complete", now,
    arrivalWindowMinutes: 30, overdueGraceMinutes: 15,
  });
  assert.equal(risk.level, "high");
  assert.equal(risk.nextAction, "Resolve visit");
});

test("exactly at arrival-window plus grace remains in the initial overdue boundary", () => {
  const risk = evaluateVisitRisk({
    scheduledStart: atMinutesAgo(45), appointmentStatus: "awaiting_confirmation", previsitStatus: "pending", now,
    arrivalWindowMinutes: 30, overdueGraceMinutes: 15,
  });
  assert.equal(risk.nextAction, "Resolve visit");
});

test("past arrival-window plus grace suggests explicit resolution actions", () => {
  const risk = evaluateVisitRisk({
    scheduledStart: atMinutesAgo(46), appointmentStatus: "en_route", previsitStatus: "complete", now,
    arrivalWindowMinutes: 30, overdueGraceMinutes: 15,
  });
  assert.match(risk.nextAction, /mark no-show or completed, reschedule, or cancel/);
});

test("terminal visits are never overdue", () => {
  for (const appointmentStatus of ["completed", "canceled", "no_show", "recheck_closed"] as const) {
    assert.equal(evaluateVisitRisk({ scheduledStart: atMinutesAgo(200), appointmentStatus, previsitStatus: "complete", now }).level, "none");
  }
});
