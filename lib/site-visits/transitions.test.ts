import assert from "node:assert/strict";
import test from "node:test";
import { TRANSITION_RULES, InvalidSiteVisitTransitionError, validateTransition } from "./transitions";
import type { AppointmentStatus } from "./types";

const statuses: AppointmentStatus[] = [
  "draft", "awaiting_confirmation", "confirmed", "reschedule_requested", "canceled",
  "en_route", "in_progress", "completed", "no_show", "recheck_requested",
  "recheck_scheduled", "recheck_closed",
];

test("every documented ordinary transition is accepted", () => {
  for (const rule of TRANSITION_RULES) {
    validateTransition(rule.from, rule.to, rule.requiresAdminOverride ? { adminOverrideReason: "Customer emergency" } : {});
  }
});

test("every undocumented direct transition is rejected", () => {
  for (const from of statuses) {
    for (const to of statuses) {
      if (from === to || TRANSITION_RULES.some((rule) => rule.from === from && rule.to === to)) continue;
      assert.throws(() => validateTransition(from, to), InvalidSiteVisitTransitionError, `${from} -> ${to}`);
    }
  }
});

test("en-route and in-progress cancellation require an Admin override reason", () => {
  assert.throws(() => validateTransition("en_route", "canceled"), /override reason/);
  assert.throws(() => validateTransition("in_progress", "canceled", { adminOverrideReason: "  " }), /override reason/);
  validateTransition("in_progress", "canceled", { adminOverrideReason: "Unsafe conditions" });
});
