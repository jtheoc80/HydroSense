import assert from "node:assert/strict";
import test from "node:test";
import { QUOTE_STATUSES } from "./quotes";

test("quote status model preserves every production payment and install state", () => {
  assert.deepEqual(QUOTE_STATUSES, [
    "draft", "sent", "viewed", "accepted", "declined", "expired",
    "deposit_paid", "install_scheduled", "install_complete", "deposit_refunded", "canceled",
  ]);
});
