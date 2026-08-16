import assert from "node:assert/strict";
import test from "node:test";
import {
  getManufacturerAuthorization,
  isManufacturerAuthorized,
  manufacturerAuthorizationSummary,
  manufacturerAuthorizationShortLabel,
  manufacturerAuthorizations,
} from "./manufacturer-authorizations";
import {
  GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT,
  recommendedGoogleBusinessProfileDescription,
} from "./google-business-profile";

test("FloLogic and Phyn are governed owner-verified authorizations", () => {
  for (const deviceSlug of ["flologic", "phyn-plus"]) {
    const authorization = getManufacturerAuthorization(deviceSlug);

    assert.ok(authorization);
    assert.equal(authorization.status, "authorized");
    assert.equal(authorization.ownerVerified, true);
    assert.equal(authorization.exactProgramTitle, null);
    assert.equal(authorization.verificationUrl, null);
  }

  assert.deepEqual(
    manufacturerAuthorizations.map((authorization) => authorization.manufacturer),
    ["FloLogic", "Phyn"],
  );
  assert.equal(
    manufacturerAuthorizationSummary,
    "HydroSense Texas is authorized by FloLogic and Phyn.",
  );
  assert.equal(
    manufacturerAuthorizationShortLabel,
    "Authorized by FloLogic and Phyn.",
  );
});

test("supported manufacturers are not automatically marked authorized", () => {
  for (const deviceSlug of ["moen-flo", "streamlabs", "guardian"]) {
    assert.equal(isManufacturerAuthorized(deviceSlug), false);
  }
});

test("recommended Google Business Profile description stays within current policy", () => {
  assert.ok(
    recommendedGoogleBusinessProfileDescription.length <=
      GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT,
  );
  assert.match(
    recommendedGoogleBusinessProfileDescription,
    /HydroSense Texas is authorized by FloLogic and Phyn\./,
  );
  assert.doesNotMatch(recommendedGoogleBusinessProfileDescription, /https?:|<[^>]+>/);
});
