import assert from "node:assert/strict";
import test from "node:test";
import { buildSiteVisitCalendar } from "./calendar";

const base = {
  id: "11111111-1111-4111-8111-111111111111",
  scheduled_start: "2026-07-15T14:00:00.000Z",
  estimated_duration_minutes: 60,
  schedule_version: 1,
  updated_at: "2026-07-01T12:00:00.000Z",
  property_address: "123 Main St",
  property_city: "Houston",
  property_zip: "77001",
  assigned_rep_name: "HydroSense",
  customer_portal_token: "a".repeat(64),
};

test("rescheduling preserves UID while sequence, dates, and last-modified change", () => {
  const before = buildSiteVisitCalendar(base, { now: new Date("2026-07-01T12:00:00Z") });
  const after = buildSiteVisitCalendar({
    ...base,
    scheduled_start: "2026-07-16T15:30:00.000Z",
    schedule_version: 2,
    updated_at: "2026-07-02T13:00:00.000Z",
  }, { now: new Date("2026-07-02T13:00:00Z") });
  assert.match(before, /UID:site-visit-11111111-1111-4111-8111-111111111111@hydrosensetx\.com/);
  assert.match(after, /UID:site-visit-11111111-1111-4111-8111-111111111111@hydrosensetx\.com/);
  assert.match(before, /SEQUENCE:1/);
  assert.match(after, /SEQUENCE:2/);
  assert.match(before, /DTSTART:20260715T140000Z/);
  assert.match(after, /DTSTART:20260716T153000Z/);
  assert.match(after, /LAST-MODIFIED:20260702T130000Z/);
});
