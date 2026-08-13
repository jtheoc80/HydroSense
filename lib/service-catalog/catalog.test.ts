import assert from "node:assert/strict";
import test from "node:test";
import {
  activeServices,
  getInstallationService,
  getServiceById,
  publicCatalogProjection,
  serviceCatalog,
} from "./catalog";
import { createAgentCard, processA2ARequest } from "./a2a";
import { buildPricingJsonLd } from "./schema";

const expectedFixedPrices: Record<string, number> = {
  "HS-INSTALL-075-001": 999,
  "HS-INSTALL-100-001": 1450,
  "HS-INSTALL-125-001": 1875,
  "HS-INSTALL-150-001": 2638,
  "HS-INSTALL-200-001": 3425,
  "HS-SENSOR-ADD-001": 75,
  "HS-BATTERY-ADD-001": 475,
  "HS-CARE-ANNUAL-001": 99,
  "HS-SITE-ASSESS-001": 0,
};

test("catalog contains every exact public price and two quote-required records", () => {
  assert.equal(serviceCatalog.catalogVersion, "2026-08-12.1");
  assert.equal(serviceCatalog.effectiveDate, "2026-08-12");
  assert.equal(serviceCatalog.currency, "USD");
  assert.equal(activeServices.length, 11);

  for (const [serviceId, expectedPrice] of Object.entries(expectedFixedPrices)) {
    const service = getServiceById(serviceId);
    assert.ok(service, serviceId);
    assert.equal(service.price.type, "fixed");
    if (service.price.type === "fixed") assert.equal(service.price.amount, expectedPrice);
  }

  assert.equal(getServiceById("HS-IRRIGATION-ADD-001")?.price.type, "quote_required");
  assert.equal(getServiceById("HS-CORRECTIVE-001")?.price.type, "quote_required");
});

test("every line-size price includes a device and 2-inch includes commercial grade", () => {
  for (const lineSize of ["0.75", "1.00", "1.25", "1.50", "2.00"] as const) {
    assert.equal(getInstallationService(lineSize).deviceIncluded, true);
  }
  assert.equal(getInstallationService("2.00").commercialGradeDeviceIncluded, true);
  assert.match(getInstallationService("2.00").description, /commercial-grade/i);
});

test("unknown service ID is not exposed", () => {
  assert.equal(getServiceById("HS-UNKNOWN-001"), undefined);
});

test("public projection excludes unpublished policy variables", () => {
  const serialized = JSON.stringify(publicCatalogProjection());
  assert.doesNotMatch(serialized, /unpublishedVariables/);
  assert.doesNotMatch(serialized, /owner/i);
});

test("pricing structured data matches fixed catalog records without invented quote prices", () => {
  const jsonLd = buildPricingJsonLd();
  const offers = jsonLd.hasOfferCatalog.itemListElement;
  assert.equal(offers.length, Object.keys(expectedFixedPrices).length);
  for (const offer of offers) {
    assert.equal(offer.price, expectedFixedPrices[offer.sku]);
    assert.equal(offer.priceCurrency, "USD");
  }
  const serialized = JSON.stringify(jsonLd);
  assert.doesNotMatch(serialized, /HS-IRRIGATION-ADD-001[^}]*"price"/);
  assert.doesNotMatch(serialized, /HS-CORRECTIVE-001[^}]*"price"/);
});

function a2aRequest(skill: string, input: unknown = {}) {
  return {
    jsonrpc: "2.0",
    id: "req-1",
    method: "SendMessage",
    params: {
      message: {
        messageId: "msg-1",
        role: "ROLE_USER",
        parts: [{ data: { skill, input }, mediaType: "application/json" }],
      },
    },
  };
}

function a2aResultData(outcome: ReturnType<typeof processA2ARequest>) {
  assert.equal(outcome.status, 200);
  const result = outcome.body.result as {
    message: { role: string; parts: [{ data: Record<string, unknown>; mediaType: string }] };
  };
  assert.equal(result.message.role, "ROLE_AGENT");
  assert.equal(result.message.parts[0].mediaType, "application/json");
  return result.message.parts[0].data;
}

test("A2A catalog skill returns the runtime catalog", () => {
  const data = a2aResultData(processA2ARequest(a2aRequest("get_service_catalog")));
  assert.equal(data.catalogVersion, "2026-08-12.1");
  assert.equal((data.services as unknown[]).length, 11);
});

test("A2A serviceability skill returns a known market", () => {
  const data = a2aResultData(
    processA2ARequest(a2aRequest("check_serviceability", { postalCode: "77494" })),
  );
  const serviceability = data.serviceability as { status: string };
  assert.equal(serviceability.status, "serviceable");
});

test("A2A estimate skill uses catalog arithmetic", () => {
  const data = a2aResultData(
    processA2ARequest(
      a2aRequest("estimate_standard_installation", {
        postalCode: "77494",
        incomingLineSize: "1.00",
        sensorQuantity: 2,
        sensorCompatibilityConfirmed: true,
      }),
    ),
  );
  assert.equal(data.publishedCatalogTotal, 1600);
  assert.equal(data.estimateStatus, "review_required");
});

test("A2A unsupported method returns method not found", () => {
  const request = a2aRequest("get_service_catalog");
  request.method = "GetTask";
  const outcome = processA2ARequest(request);
  assert.equal(outcome.status, 200);
  assert.equal((outcome.body.error as { code: number }).code, -32601);
});

test("A2A rejects legacy discriminated Part shape", () => {
  const request = a2aRequest("get_service_catalog") as any;
  request.params.message.parts = [
    {
      kind: "data",
      data: { skill: "get_service_catalog", input: {} },
      mediaType: "application/json",
    },
  ];
  const outcome = processA2ARequest(request);
  assert.equal((outcome.body.error as { code: number }).code, -32602);
});

test("Agent Card declares only the three read-only A2A v1 skills", () => {
  const card = createAgentCard();
  assert.deepEqual(card.supportedInterfaces[0], {
    url: "https://hydrosensetx.com/api/a2a",
    protocolBinding: "JSONRPC",
    protocolVersion: "1.0",
  });
  assert.deepEqual(
    card.skills.map((skill) => skill.id),
    ["get_service_catalog", "check_serviceability", "estimate_standard_installation"],
  );
  assert.deepEqual(card.capabilities, {
    streaming: false,
    pushNotifications: false,
    extendedAgentCard: false,
  });
});
