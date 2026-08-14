import assert from "node:assert/strict";
import test from "node:test";
import { calculateEstimate, type EstimateRequest } from "./pricing";

const standardInput: EstimateRequest = {
  postalCode: "77494",
  incomingLineSize: "1.00",
  propertyType: "single_family_residential",
  incomingLineSizeVerified: true,
  domesticMainAccessible: true,
  standardPipework: true,
  nearbyPower: true,
  wifiAvailable: true,
  dualMain: false,
  electricalModificationRequired: false,
  correctiveRepairRequired: false,
  irrigationRequested: false,
  fireSprinklerPresent: false,
};

test("standard confirmed inputs return a catalog-exact estimate", () => {
  const estimate = calculateEstimate(standardInput);
  assert.equal(estimate.estimateStatus, "catalog_exact_standard_scope");
  assert.equal(estimate.oneTimeCatalogTotal, 1450);
  assert.equal(estimate.publishedCatalogTotal, 1450);
  assert.deepEqual(estimate.recurringSelections, []);
  assert.deepEqual(estimate.missingInputs, []);
  assert.deepEqual(estimate.reviewReasons, []);
  assert.equal(estimate.finalWrittenProposalRequired, true);
  assert.equal(estimate.bookingAuthority, "assessment_only");
});

test("large-line estimates expose FloLogic while smaller tiers remain unmapped", () => {
  const oneAndHalf = calculateEstimate({ ...standardInput, incomingLineSize: "1.50" });
  assert.equal(oneAndHalf.publishedCatalogTotal, 2638);
  assert.deepEqual(oneAndHalf.baseService?.deviceFamily, {
    slug: "flologic",
    name: "FloLogic",
    designation: "designated",
  });

  const twoInch = calculateEstimate({ ...standardInput, incomingLineSize: "2.00" });
  assert.equal(twoInch.publishedCatalogTotal, 3425);
  assert.deepEqual(twoInch.baseService?.deviceFamily, oneAndHalf.baseService?.deviceFamily);

  assert.equal(calculateEstimate(standardInput).baseService?.deviceFamily, undefined);
});

test("two compatible sensors add exact catalog arithmetic", () => {
  const estimate = calculateEstimate({
    ...standardInput,
    sensorQuantity: 2,
    sensorCompatibilityConfirmed: true,
  });
  assert.equal(estimate.publishedCatalogTotal, 1600);
  assert.equal(estimate.confirmedFixedAddOns[0].total, 150);
});

test("confirmed compatible battery adds $475", () => {
  const estimate = calculateEstimate({
    ...standardInput,
    batteryRequested: true,
    batteryCompatibilityConfirmed: true,
  });
  assert.equal(estimate.publishedCatalogTotal, 1925);
  assert.equal(estimate.confirmedFixedAddOns[0].serviceId, "HS-BATTERY-ADD-001");
});

test("annual care stays separate from the one-time installation total", () => {
  const estimate = calculateEstimate({
    ...standardInput,
    sensorQuantity: 2,
    sensorCompatibilityConfirmed: true,
    batteryRequested: true,
    batteryCompatibilityConfirmed: true,
    annualCareRequested: true,
  });
  assert.equal(estimate.oneTimeCatalogTotal, 2075);
  assert.equal(estimate.publishedCatalogTotal, 2075);
  assert.notEqual(estimate.oneTimeCatalogTotal, 2174);
  assert.deepEqual(
    estimate.confirmedFixedAddOns.map((item) => item.serviceId),
    ["HS-SENSOR-ADD-001", "HS-BATTERY-ADD-001"],
  );
  assert.deepEqual(estimate.recurringSelections, [
    {
      serviceId: "HS-CARE-ANNUAL-001",
      name: "Annual system care",
      amount: 99,
      currency: "USD",
      billingDuration: "P1Y",
    },
  ]);
  assert.equal(estimate.finalWrittenProposalRequired, true);
  assert.equal(estimate.bookingAuthority, "assessment_only");
});

test("annual care by itself has no one-time catalog total", () => {
  const estimate = calculateEstimate({
    postalCode: "77494",
    annualCareRequested: true,
  });
  assert.equal(estimate.oneTimeCatalogTotal, null);
  assert.equal(estimate.publishedCatalogTotal, null);
  assert.deepEqual(estimate.confirmedFixedAddOns, []);
  assert.deepEqual(estimate.recurringSelections, [
    {
      serviceId: "HS-CARE-ANNUAL-001",
      name: "Annual system care",
      amount: 99,
      currency: "USD",
      billingDuration: "P1Y",
    },
  ]);
});

test("requested battery with unknown compatibility stays conditional and outside total", () => {
  const estimate = calculateEstimate({ ...standardInput, batteryRequested: true });
  assert.equal(estimate.estimateStatus, "conditional");
  assert.equal(estimate.publishedCatalogTotal, 1450);
  assert.equal(estimate.conditionalAddOns[0].possibleUnitPrice, 475);
});

test("missing standard inputs require review and remain explicit", () => {
  const estimate = calculateEstimate({ postalCode: "77494", incomingLineSize: "0.75" });
  assert.equal(estimate.estimateStatus, "review_required");
  assert.ok(estimate.missingInputs.includes("propertyType"));
  assert.ok(estimate.missingInputs.includes("fireSprinklerPresent"));
  assert.equal(estimate.publishedCatalogTotal, 999);
});

test("irrigation request requires a quote without fabricated price", () => {
  const estimate = calculateEstimate({ ...standardInput, irrigationRequested: true });
  assert.equal(estimate.estimateStatus, "review_required");
  assert.ok(estimate.reviewReasons.includes("irrigation_quote_required"));
  assert.match(estimate.scope.quoteRequired.join(" "), /written quote/i);
  assert.equal(estimate.publishedCatalogTotal, 1450);
});

test("fire-sprinkler presence preserves the exclusion and requires routing review", () => {
  const needsReview = calculateEstimate({ ...standardInput, fireSprinklerPresent: true });
  assert.equal(needsReview.estimateStatus, "review_required");
  assert.ok(needsReview.reviewReasons.includes("fire_system_routing_review_required"));
  assert.match(needsReview.scope.excluded[0], /always excluded/i);

  const reviewed = calculateEstimate({
    ...standardInput,
    fireSprinklerPresent: true,
    fireSystemRoutingReviewed: true,
  });
  assert.equal(reviewed.estimateStatus, "catalog_exact_standard_scope");
  assert.match(reviewed.scope.excluded[0], /fire-sprinkler/i);
});

test("2-inch estimate carries the commercial-grade catalog service", () => {
  const estimate = calculateEstimate({ ...standardInput, incomingLineSize: "2.00" });
  assert.equal(estimate.publishedCatalogTotal, 3425);
  assert.match(estimate.baseService?.name ?? "", /commercial-grade/i);
  assert.equal(estimate.baseService?.deviceFamily?.designation, "designated");
});
