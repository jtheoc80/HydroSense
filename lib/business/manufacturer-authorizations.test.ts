import assert from "node:assert/strict";
import test from "node:test";
import {
  PHYN_PRO_DIRECTORY_URL,
  getManufacturerAuthority,
  hasManufacturerAuthority,
  manufacturerAuthorities,
  manufacturerAuthorityShortLabel,
  manufacturerAuthoritySummary,
} from "./manufacturer-authorizations";
import {
  cautiousLicenseCoordinationStatement,
  plumbingLicenseEvidence,
  TEXAS_PUBLIC_LICENSE_SEARCH_URL,
} from "./plumbing-license";
import {
  GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT,
  recommendedGoogleBusinessProfileDescription,
} from "./google-business-profile";

test("FloLogic remains an owner-verified authorization without public corroboration", () => {
  const authority = getManufacturerAuthority("flologic");

  assert.ok(authority);
  assert.equal(authority.relationshipType, "authorization");
  assert.equal(authority.programStatus, "owner_verified_authorization");
  assert.equal(authority.publicLabel, "Authorized by FloLogic");
  assert.equal(authority.publiclyCorroborated, false);
  assert.equal(authority.ownerVerified, true);
  assert.equal(authority.exactProgramTitle, null);
  assert.equal(authority.verificationUrl, null);
});

test("Phyn uses the corroborated Phyn Pro program terminology", () => {
  const authority = getManufacturerAuthority("phyn-plus");

  assert.ok(authority);
  assert.equal(authority.relationshipType, "program_participation");
  assert.equal(authority.programStatus, "phyn_pro");
  assert.equal(authority.publicLabel, "Phyn Pro");
  assert.equal(
    authority.publicStatement,
    "HydroSense Texas is listed in Phyn's Find a Phyn Pro Directory.",
  );
  assert.equal(authority.exactProgramTitle, "Phyn Pro Program");
  assert.equal(authority.verificationUrl, PHYN_PRO_DIRECTORY_URL);
  assert.equal(authority.publiclyCorroborated, true);
  assert.equal(authority.ownerVerified, true);
});

test("manufacturer authority summaries preserve distinct relationship types", () => {
  assert.deepEqual(
    manufacturerAuthorities.map((authority) => authority.manufacturer),
    ["FloLogic", "Phyn"],
  );
  assert.equal(
    manufacturerAuthoritySummary,
    "HydroSense Texas is authorized by FloLogic and listed in Phyn's Find a Phyn Pro Directory.",
  );
  assert.equal(
    manufacturerAuthorityShortLabel,
    "Authorized by FloLogic; Phyn Pro",
  );
});

test("supported manufacturers do not inherit manufacturer authority", () => {
  for (const deviceSlug of ["moen-flo", "streamlabs", "guardian"]) {
    assert.equal(hasManufacturerAuthority(deviceSlug), false);
  }
});

test("license evidence remains separate from the RMP business relationship", () => {
  assert.equal(plumbingLicenseEvidence.licenseNumber, "43057");
  assert.equal(plumbingLicenseEvidence.licenseType, "Master Plumber");
  assert.equal(plumbingLicenseEvidence.licenseStatus, "Current");
  assert.equal(plumbingLicenseEvidence.licensePubliclyVerified, true);
  assert.equal(plumbingLicenseEvidence.rmpBusinessRelationshipVerified, false);
  assert.equal(plumbingLicenseEvidence.verificationUrl, TEXAS_PUBLIC_LICENSE_SEARCH_URL);
  assert.equal(
    cautiousLicenseCoordinationStatement,
    "Work coordinated under Texas Master Plumber License MPL 43057.",
  );
  assert.doesNotMatch(TEXAS_PUBLIC_LICENSE_SEARCH_URL, /list\.do\?anchor/i);
});

test("recommended Google Business Profile description uses governed cautious wording", () => {
  assert.ok(
    recommendedGoogleBusinessProfileDescription.length <=
      GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT,
  );
  assert.match(
    recommendedGoogleBusinessProfileDescription,
    /listed in Phyn's Find a Phyn Pro Directory\./,
  );
  assert.match(
    recommendedGoogleBusinessProfileDescription,
    /Work coordinated under Texas Master Plumber License MPL 43057\./,
  );
  assert.doesNotMatch(recommendedGoogleBusinessProfileDescription, /https?:|<[^>]+>/);
});
