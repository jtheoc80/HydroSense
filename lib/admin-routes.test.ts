import assert from "node:assert/strict";
import test from "node:test";
import { isAdminRequestPath, isPublicQuoteApiPath, isQuoteApiWithOwnAuth } from "./admin-routes";

test("protects admin pages and internal quote APIs", () => {
  assert.equal(isAdminRequestPath("/admin/quotes"), true);
  assert.equal(isAdminRequestPath("/api/admin/leads/search"), true);
  assert.equal(isAdminRequestPath("/api/quotes"), true);
  assert.equal(isAdminRequestPath("/api/quotes/quote-id/send"), true);
  assert.equal(isAdminRequestPath("/api/quotes/quote-id"), true);
});

test("keeps the bearer-authenticated quote cron outside Basic Auth", () => {
  assert.equal(isQuoteApiWithOwnAuth("/api/quotes/expire-stale"), true);
  assert.equal(isAdminRequestPath("/api/quotes/expire-stale"), false);
});

test("keeps customer quote APIs public", () => {
  assert.equal(isPublicQuoteApiPath("/api/quotes/public/token"), true);
  assert.equal(isPublicQuoteApiPath("/api/quotes/public/token/accept"), true);
  assert.equal(isAdminRequestPath("/api/quotes/public/token"), false);
  assert.equal(isAdminRequestPath("/api/quotes/public/token/decline"), false);
  assert.equal(isAdminRequestPath("/quote/token"), false);
});
