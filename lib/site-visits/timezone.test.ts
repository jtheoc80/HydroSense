import assert from "node:assert/strict";
import test from "node:test";
import { chicagoDateKey, parseChicagoLocalDateTime, parseDistinctChicagoOptions } from "./timezone";

const now = new Date("2026-01-01T00:00:00.000Z");

test("parses CST and CDT independently of the process timezone", () => {
  assert.equal(parseChicagoLocalDateTime("2026-01-15T09:30", { now }), "2026-01-15T15:30:00.000Z");
  assert.equal(parseChicagoLocalDateTime("2026-07-15T09:30", { now }), "2026-07-15T14:30:00.000Z");
});

test("rejects DST gaps and ambiguous folds", () => {
  assert.throws(() => parseChicagoLocalDateTime("2026-03-08T02:30", { now }), /does not exist/);
  assert.throws(() => parseChicagoLocalDateTime("2026-11-01T01:30", { now }), /occurs twice/);
});

test("rejects past, distant, and duplicate choices", () => {
  assert.throws(() => parseChicagoLocalDateTime("2025-12-31T12:00", { now }), /future/);
  assert.throws(() => parseChicagoLocalDateTime("2028-01-01T12:00", { now }), /365 days/);
  assert.throws(() => parseDistinctChicagoOptions(["2026-02-01T09:00", "2026-02-01T09:00"], { now }), /different/);
});

test("Chicago date keys do not depend on browser-local midnight", () => {
  assert.equal(chicagoDateKey("2026-07-15T04:30:00.000Z"), "2026-07-14");
});
