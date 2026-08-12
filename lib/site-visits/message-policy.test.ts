import assert from "node:assert/strict";
import test from "node:test";
import { isCurrentMessageKey, isMessageClaimAvailable, messageKeyFor, MESSAGE_BINDING } from "./message-policy";

const visit = { schedule_version: 4, assessment_version: 2 };

test("every message kind has an explicit binding", () => {
  assert.deepEqual(Object.keys(MESSAGE_BINDING).sort(), [
    "completion", "confirmation", "confirmation-receipt", "en-route", "previsit-complete",
    "recheck-receipt", "reminder-24h", "reminder-3h",
  ].sort());
});

test("schedule and assessment messages use the right version", () => {
  assert.equal(messageKeyFor("confirmation-receipt", visit), "confirmation-receipt:v4");
  assert.equal(messageKeyFor("en-route", visit), "en-route:v4");
  assert.equal(messageKeyFor("completion", visit), "completion:assessment-v2");
  assert.equal(messageKeyFor("previsit-complete", visit), "previsit-complete");
});
test("only the current schedule and assessment versions are actionable", () => {
  assert.equal(isCurrentMessageKey("confirmation:v4", visit), true);
  assert.equal(isCurrentMessageKey("confirmation:v3", visit), false);
  assert.equal(isCurrentMessageKey("completion:assessment-v2", visit), true);
  assert.equal(isCurrentMessageKey("completion:assessment-v1", visit), false);
  assert.equal(isCurrentMessageKey("previsit-complete", visit), true);
});


test("stale sending claims become available after the five-minute lease", () => {
  const now = new Date("2026-08-10T12:00:00Z");
  assert.equal(isMessageClaimAvailable({ status: "sending", claimed_at: "2026-08-10T11:55:01Z" }, now), false);
  assert.equal(isMessageClaimAvailable({ status: "sending", claimed_at: "2026-08-10T11:55:00Z" }, now), true);
  assert.equal(isMessageClaimAvailable({ status: "failed", claimed_at: null }, now), true);
  assert.equal(isMessageClaimAvailable({ status: "sent", claimed_at: null }, now), false);
  assert.equal(isMessageClaimAvailable({ status: "sending", claimed_at: null }, now), true);
});
