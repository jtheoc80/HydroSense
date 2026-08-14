import assert from "node:assert/strict";
import test from "node:test";
import {
  isLeadStatus,
  leadStatusLabel,
  parseLeadStatusUpdate,
} from "./lead-status";

const leadId = "5ac90aed-24d0-4734-af09-1a34505ddb03";

test("accepts every supported lead outcome", () => {
  for (const status of ["new", "booked", "showed", "quoted", "won", "lost"]) {
    assert.equal(isLeadStatus(status), true);
    assert.deepEqual(parseLeadStatusUpdate({ id: leadId, status }), {
      id: leadId,
      status,
    });
  }
});

test("rejects malformed lead outcome requests", () => {
  assert.equal(parseLeadStatusUpdate(null), null);
  assert.equal(parseLeadStatusUpdate({ id: "not-a-uuid", status: "won" }), null);
  assert.equal(parseLeadStatusUpdate({ id: leadId, status: "deleted" }), null);
  assert.equal(parseLeadStatusUpdate({ id: leadId }), null);
});

test("formats outcome labels for Admin feedback", () => {
  assert.equal(leadStatusLabel("quoted"), "Quoted");
});
