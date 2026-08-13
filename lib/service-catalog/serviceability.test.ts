import assert from "node:assert/strict";
import test from "node:test";
import { checkServiceability } from "./serviceability";

test("known ZIP returns serviceable with its market", () => {
  const result = checkServiceability("77494");
  assert.equal(result.status, "serviceable");
  assert.deepEqual(result.markets, [{ slug: "katy", name: "Katy" }]);
  assert.equal(result.nextAction, "request_compatibility_assessment");
});

test("unknown ZIP requests manual review without unsupported rejection", () => {
  const result = checkServiceability("99999");
  assert.equal(result.status, "review_required");
  assert.deepEqual(result.markets, []);
  assert.equal(result.nextAction, "manual_service_area_review");
  assert.doesNotMatch(JSON.stringify(result), /unsupported|rejected/i);
});
