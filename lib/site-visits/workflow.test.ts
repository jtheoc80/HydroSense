import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMessageContent, messageKeyFor } from "./communications";
import { evaluateReadiness } from "./readiness";
import { createSiteVisitSchema, previsitAnswersSchema } from "./schemas";
import { cleanAssessment, cleanPrevisit } from "./test-fixtures";
import type { SiteVisit } from "./types";

describe("closed-loop workflow safeguards", () => {
  it("requires an explicit meter-movement observation", () => {
    const assessment = cleanAssessment();
    assessment.exterior.unexplainedMeterMovement = "unsure";
    const result = evaluateReadiness(assessment, cleanPrevisit());
    assert.equal(result.status, "unassessed");
    assert.ok(result.missingRequiredFields.includes("exterior.unexplainedMeterMovement"));
  });

  it("requires a note for inaccessible critical exterior checks", () => {
    const assessment = cleanAssessment();
    assessment.exterior.meterAccessible = "not_accessible";
    assessment.exterior.notes = "";
    const result = evaluateReadiness(assessment, cleanPrevisit());
    assert.equal(result.status, "unassessed");
    assert.ok(result.missingRequiredFields.includes("exterior.meterAccessible.notes"));
  });

  it("treats an active main-valve leak as leak repair required", () => {
    const assessment = cleanAssessment();
    assessment.exterior.mainValveCondition = "active_leak";
    assessment.exterior.notes = "Leak at valve body";
    const result = evaluateReadiness(assessment, cleanPrevisit());
    assert.equal(result.status, "leak_repair_required");
    assert.ok(result.blockers.some((item) => item.code === "main-valve-active-leak"));
  });

  it("requires at least one appointment contact method", () => {
    const result = createSiteVisitSchema.safeParse({
      customerFirstName: "A", customerLastName: "Customer", customerPhone: "", customerEmail: "",
      propertyAddress: "123 Main Street", scheduledStart: "2026-08-12T15:00:00.000Z",
      arrivalWindowMinutes: 30, estimatedDurationMinutes: 60, timezone: "America/Chicago",
      assignedRepName: "HydroSense Rep", sendConfirmation: true,
    });
    assert.equal(result.success, false);
  });

  it("requires repair status when a previous leak is reported", () => {
    const result = previsitAnswersSchema.safeParse({
      bathroomCount: 2, shutoffLocationKnown: "yes", activeLeak: "no", previousLeak: "yes",
      wifiAtInstallLocation: "yes", powerWithin12Feet: "yes", fireSprinklerSystem: "no",
    });
    assert.equal(result.success, false);
  });

  it("versions appointment-time message keys and leaves completion stable", () => {
    assert.equal(messageKeyFor("confirmation", { schedule_version: 3 }), "confirmation:v3");
    assert.equal(messageKeyFor("reminder-24h", { schedule_version: 3 }), "reminder-24h:v3");
    assert.equal(messageKeyFor("completion", { schedule_version: 3 }), "completion");
  });

  it("escapes customer content in site-visit email HTML", () => {
    const visit = {
      id: "visit", schedule_version: 1, customer_first_name: "<script>alert(1)</script>",
      customer_last_name: "Customer", customer_phone: "+12816945754", customer_email: "test@example.com",
      property_address: "123 <b>Main</b>", scheduled_start: "2026-08-12T15:00:00.000Z",
      timezone: "America/Chicago", arrival_window_minutes: 30, assigned_rep_name: "HydroSense <Rep>",
      customer_portal_token: "a".repeat(64), confirmed_at: null,
    } as SiteVisit;
    const content = buildMessageContent(visit, "confirmation");
    assert.equal(content.html.includes("<script>alert(1)</script>"), false);
    assert.ok(content.html.includes("&lt;b&gt;Main&lt;/b&gt;"));
  });
});
