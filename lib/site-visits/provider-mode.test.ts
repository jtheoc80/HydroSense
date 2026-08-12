import assert from "node:assert/strict";
import test from "node:test";
import { mockProviderMessageId, siteVisitProviderMode } from "./provider-mode";

test("site-visit providers are mocked by default outside production", () => {
  assert.equal(siteVisitProviderMode({}), "mock");
  assert.equal(siteVisitProviderMode({ VERCEL_ENV: "preview" }), "mock");
  assert.equal(siteVisitProviderMode({ VERCEL_ENV: "development" }), "mock");
});

test("production is live unless an explicit mock override is set", () => {
  assert.equal(siteVisitProviderMode({ VERCEL_ENV: "production" }), "live");
  assert.equal(siteVisitProviderMode({ NODE_ENV: "production" }), "live");
  assert.equal(siteVisitProviderMode({ VERCEL_ENV: "production", SITE_VISIT_PROVIDER_MODE: "mock" }), "mock");
});

test("an explicit live override supports owner-approved provider testing", () => {
  assert.equal(siteVisitProviderMode({ VERCEL_ENV: "preview", SITE_VISIT_PROVIDER_MODE: "live" }), "live");
  assert.equal(mockProviderMessageId("email", "abc"), "mock-email-abc");
});
