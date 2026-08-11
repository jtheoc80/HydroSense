import assert from "node:assert/strict";
import test from "node:test";
import { markCorrectiveActionsCustomerReported, quoteSourceForCycle } from "./recheck";
import type { CorrectiveAction, SiteVisit } from "./types";

const action: CorrectiveAction = {
  id: "active-leak", action: "Repair leak", reason: "Observed leak", owner: "plumber",
  severity: "blocking", status: "open",
};

test("customer completion reports preserve blocked readiness and require HydroSense verification", () => {
  const reported = markCorrectiveActionsCustomerReported([action], "2026-08-10T12:00:00Z");
  assert.equal(reported[0].status, "customer_reported_complete");
  assert.equal(reported[0].verifiedAt, undefined);
  assert.equal(reported[0].verifiedBy, undefined);
});

test("repeated completion reports are idempotent", () => {
  const once = markCorrectiveActionsCustomerReported([action], "2026-08-10T12:00:00Z");
  const twice = markCorrectiveActionsCustomerReported(once, "2026-08-11T12:00:00Z");
  assert.deepEqual(twice, once);
});

test("quote eligibility is based only on the latest completed cycle", () => {
  const initial = { assessment_version: 1, appointment_status: "completed", readiness_status: "leak_repair_required" } as SiteVisit;
  const openRecheck = { assessment_version: 2, appointment_status: "in_progress", readiness_status: "unassessed" } as SiteVisit;
  const cleanRecheck = { assessment_version: 2, appointment_status: "completed", readiness_status: "ready_for_proposal" } as SiteVisit;
  assert.equal(quoteSourceForCycle([initial]), null);
  assert.equal(quoteSourceForCycle([initial, openRecheck]), null);
  assert.equal(quoteSourceForCycle([initial, cleanRecheck]), cleanRecheck);
  assert.equal(initial.readiness_status, "leak_repair_required", "prior result remains preserved");
});
