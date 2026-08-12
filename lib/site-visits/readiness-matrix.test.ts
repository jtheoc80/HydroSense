import assert from "node:assert/strict";
import test from "node:test";
import { evaluateReadiness } from "./readiness";
import { cleanAssessment, cleanPrevisit } from "./test-fixtures";
import type { InspectionResult, SiteAssessment } from "./types";

const exteriorFields = ["meterAccessible", "mainShutoffAccessible", "mainValveCondition", "visibleExteriorLeak"] as const;
const expectedByResult: Record<InspectionResult, string> = {
  clear: "ready_for_proposal",
  needs_attention: "plumber_review_required",
  active_leak: "leak_repair_required",
  not_present: "plumber_review_required",
  not_accessible: "plumber_review_required",
  not_tested: "unassessed",
};

for (const field of exteriorFields) {
  for (const result of Object.keys(expectedByResult) as InspectionResult[]) {
    test(`${field}=${result} follows the documented readiness matrix`, () => {
      const assessment = cleanAssessment();
      assessment.exterior[field] = result;
      if (result === "not_accessible") assessment.exterior.notes = "Documented access obstruction";
      assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, expectedByResult[result]);
    });
  }
}

test("meter access is independent of the fire-sprinkler rule", () => {
  const assessment = cleanAssessment();
  assessment.exterior.meterAccessible = "not_accessible";
  assessment.exterior.notes = "Locked utility enclosure";
  assessment.exterior.fireSprinklerBranchConcern = "no";
  const result = evaluateReadiness(assessment, cleanPrevisit());
  assert.equal(result.status, "plumber_review_required");
  assert.ok(result.blockers.some((item) => item.code === "meter-not-accessible"));
});

test("missing observations win over leak, plumber, and preparation blockers", () => {
  const assessment = cleanAssessment();
  assessment.exterior.meterAccessible = "not_tested";
  assessment.exterior.mainValveCondition = "active_leak";
  assessment.connectivity.powerVerified = "no";
  const result = evaluateReadiness(assessment, cleanPrevisit());
  assert.equal(result.status, "unassessed");
  assert.ok(result.blockers.some((item) => item.code === "main-valve-active-leak"));
  assert.ok(result.blockers.some((item) => item.code === "power-not-verified"));
});

test("known bathrooms must be fully assessed and zero bathrooms needs Admin evidence", () => {
  const missingBathroom = cleanAssessment();
  missingBathroom.bathrooms = [];
  let result = evaluateReadiness(missingBathroom, cleanPrevisit());
  assert.equal(result.status, "unassessed");
  assert.ok(result.missingRequiredFields.includes("homeHasNoBathrooms"));

  missingBathroom.homeHasNoBathrooms = true;
  result = evaluateReadiness(missingBathroom, cleanPrevisit());
  assert.ok(result.missingRequiredFields.includes("noBathroomsReason"));
  missingBathroom.noBathroomsReason = "Verified studio has no bathroom plumbing";
  assert.equal(evaluateReadiness(missingBathroom, cleanPrevisit()).status, "ready_for_proposal");

  const knownBathroom = cleanAssessment();
  knownBathroom.bathrooms[0].toilet.result = "not_tested";
  assert.equal(evaluateReadiness(knownBathroom, cleanPrevisit()).status, "unassessed");
});

test("other water areas cannot remain untested and inaccessible areas need notes", () => {
  const assessment = cleanAssessment();
  assessment.otherWaterAreas = [{ id: "bar", label: "Wet bar", result: "not_tested", notes: "" }];
  assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "unassessed");
  assessment.otherWaterAreas[0].result = "not_accessible";
  assert.ok(evaluateReadiness(assessment, cleanPrevisit()).missingRequiredFields.includes("otherWaterAreas.0.notes"));
  assessment.otherWaterAreas[0].notes = "Cabinet locked";
  assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "plumber_review_required");
});

test("ready requires location, pipe-selection, Wi-Fi, power, and outlet evidence", () => {
  const cases: Array<(assessment: SiteAssessment) => void> = [
    (a) => { a.exterior.proposedDeviceLocation = ""; },
    (a) => { a.exterior.pipeMaterial = ""; },
    (a) => { a.exterior.approximatePipeDiameter = ""; },
    (a) => { a.connectivity.outletDistanceFeet = undefined; },
  ];
  for (const mutate of cases) {
    const assessment = cleanAssessment();
    mutate(assessment);
    assert.equal(evaluateReadiness(assessment, cleanPrevisit()).status, "unassessed");
  }
});

test("unresolved sprinkler concern blocks quoting while a verified bypass is conditional", () => {
  const unresolved = cleanAssessment();
  unresolved.exterior.fireSprinklerBranchConcern = "yes";
  assert.equal(evaluateReadiness(unresolved, cleanPrevisit()).status, "plumber_review_required");

  const verified = cleanAssessment();
  verified.exterior.fireSprinklerBranchConcern = "no";
  verified.exterior.sprinklerBypassRequired = "yes";
  const result = evaluateReadiness(verified, cleanPrevisit());
  assert.equal(result.status, "site_prep_required");
  assert.ok(result.blockers.some((item) => item.code === "sprinkler-bypass-required"));
});
