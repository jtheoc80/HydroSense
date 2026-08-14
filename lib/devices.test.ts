import assert from "node:assert/strict";
import test from "node:test";
import { deviceList, deviceSlugs, devices } from "./devices";

test("FloLogic is the fifth governed device family", () => {
  assert.equal(deviceList.length, 5);
  assert.ok(deviceSlugs.includes("flologic"));

  const flologic = devices.flologic;
  assert.equal(flologic.name, "FloLogic");
  assert.equal(flologic.metadataTitle, "FloLogic Installation Houston | HydroSense Texas");
  assert.equal(flologic.officialSite, "https://flologic.com/collections/flologic-system");
  assert.equal(flologic.hubBadge, "Large-line option");
  assert.match(flologic.bestFor, /1 1\/2-inch or 2-inch domestic incoming water lines/i);
  assert.equal(flologic.faqs.length, 5);
});

test("FloLogic commercial copy preserves the domestic-water and fire-system boundary", () => {
  const copy = JSON.stringify(devices.flologic);
  assert.match(copy, /designated large-line device family/i);
  assert.match(copy, /final compatibility and model are confirmed in the written proposal/i);
  assert.match(copy, /fire-sprinkler and fire-suppression piping are excluded/i);
  assert.doesNotMatch(copy, /protect(?:s|ion)? (?:for |on )?(?:fire-sprinkler|fire-suppression)/i);
});
