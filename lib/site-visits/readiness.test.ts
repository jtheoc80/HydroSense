import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateReadiness, quoteEligibility } from "./readiness";
import { cleanAssessment, cleanPrevisit } from "./test-fixtures";

describe("evaluateReadiness", () => {
  it("returns ready for a clean, complete assessment", () => {
    const result = evaluateReadiness(cleanAssessment(), cleanPrevisit());
    assert.equal(result.status, "ready_for_proposal");
    assert.deepEqual(result.blockers, []);
    assert.deepEqual(result.missingRequiredFields, []);
  });

  it("prioritizes an active reported leak", () => {
    const previsit = cleanPrevisit();
    previsit.activeLeak = "yes";
    const result = evaluateReadiness(cleanAssessment(), previsit);
    assert.equal(result.status, "leak_repair_required");
    assert.ok(result.blockers.some((item) => item.code === "active-leak-reported"));
  });

  it("blocks an unresolved prior leak", () => {
    const previsit = cleanPrevisit();
    previsit.previousLeak = "yes";
    previsit.previousLeakRepaired = "no";
    const result = evaluateReadiness(cleanAssessment(), previsit);
    assert.equal(result.status, "leak_repair_required");
    assert.ok(result.blockers.some((item) => item.code === "prior-leak-unresolved"));
  });

  it("blocks unexplained meter movement", () => {
    const assessment = cleanAssessment();
    assessment.exterior.unexplainedMeterMovement = "yes";
    assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "leak_repair_required");
  });

  it("requires plumber review for a main valve concern", () => {
    const assessment = cleanAssessment();
    assessment.exterior.mainValveCondition = "needs_attention";
    assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "plumber_review_required");
  });

  it("requires plumber review for a sprinkler branch concern", () => {
    const assessment = cleanAssessment();
    assessment.exterior.fireSprinklerBranchConcern = "unsure";
    assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "unassessed");
  });

  it("requires preparation when power is not verified", () => {
    const assessment = cleanAssessment();
    assessment.connectivity.powerVerified = "no";
    assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "site_prep_required");
  });

  it("requires preparation when Wi-Fi is not verified", () => {
    const assessment = cleanAssessment();
    assessment.connectivity.wifiVerified = "unsure";
    assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "unassessed");
  });

  it("remains unassessed when critical data is missing", () => {
    const assessment = cleanAssessment();
    assessment.exterior.meterAccessible = "not_tested";
    const result = evaluateReadiness(assessment, cleanPrevisit());
    assert.equal(result.status, "unassessed");
    assert.ok(result.missingRequiredFields.includes("exterior.meterAccessible"));
  });

  it("returns all blockers while applying deterministic priority", () => {
    const assessment = cleanAssessment();
    const previsit = cleanPrevisit();
    previsit.activeLeak = "yes";
    assessment.exterior.fireSprinklerBranchConcern = "yes";
    assessment.connectivity.powerVerified = "no";
    const result = evaluateReadiness(assessment, previsit);
    assert.equal(result.status, "leak_repair_required");
    assert.ok(result.blockers.some((item) => item.code === "active-leak-reported"));
    assert.ok(result.blockers.some((item) => item.code === "sprinkler-branch-concern"));
    assert.ok(result.blockers.some((item) => item.code === "power-not-verified"));
  });

  it("only permits ready and conditional-preparation quote handoffs", () => {
    assert.deepEqual(quoteEligibility("ready_for_proposal"), { allowed: true, conditional: false });
    assert.deepEqual(quoteEligibility("site_prep_required"), { allowed: true, conditional: true });
    assert.equal(quoteEligibility("leak_repair_required").allowed, false);
    assert.equal(quoteEligibility("plumber_review_required").allowed, false);
    assert.equal(quoteEligibility("unassessed").allowed, false);
  });
});
