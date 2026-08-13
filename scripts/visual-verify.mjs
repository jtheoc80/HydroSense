import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.env.VERIFY_BASE_URL ?? "http://127.0.0.1:3200";
const widths = [375, 768, 1024, 1440, 1792];
const routes = [
  ["pricing", "/pricing", "Device-included pricing"],
  ["agent-ready", "/agent-ready", "Home water protection structured for the agent economy"],
];
const screenshotDir = "docs/pr-assets/a2a-pricing";
mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const visualResults = [];

try {
  for (const [name, path, expectedText] of routes) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 1100 } });
      const consoleErrors = [];
      const failedResources = [];
      page.on("response", (resourceResponse) => {
        if (resourceResponse.status() >= 400) failedResources.push(new URL(resourceResponse.url()).pathname);
      });
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `${path} status at ${width}px`);
      assert.ok((await page.locator("body").innerText()).includes(expectedText), `${path} content at ${width}px`);
      assert.equal(await page.locator("[data-nextjs-dialog]").count(), 0, `${path} error overlay at ${width}px`);
      const metrics = await page.evaluate(() => ({
        bodyTextLength: document.body.innerText.trim().length,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      assert.ok(metrics.bodyTextLength > 500, `${path} meaningful content at ${width}px`);
      assert.ok(metrics.scrollWidth <= metrics.innerWidth, `${path} horizontal overflow at ${width}px`);
      const unexpectedResources = failedResources.filter(
        (resourcePath) => !["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"].includes(resourcePath),
      );
      assert.deepEqual(unexpectedResources, [], `${path} unexpected failed resources at ${width}px`);
      assert.deepEqual(consoleErrors.filter((message) => !message.includes("Failed to load resource: the server responded with a status of 404")), [], `${path} console errors at ${width}px`);

      if (width === 375 || width === 1440) {
        await page.screenshot({
          path: `${screenshotDir}/${name}-${width}.png`,
          fullPage: true,
        });
      }
      visualResults.push({
        path,
        width,
        ...metrics,
        unexpectedConsoleErrors: 0,
        expectedLocalAnalytics404s: failedResources.length,
      });
      await page.close();
    }
  }

  const home = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await home.goto(baseUrl, { waitUntil: "networkidle" });
  assert.ok(await home.getByRole("link", { name: "Pricing", exact: true }).first().isVisible());
  await home.close();

  const pricing = await browser.newPage();
  await pricing.goto(`${baseUrl}/pricing`, { waitUntil: "networkidle" });
  const jsonLdBlocks = await pricing.locator('script[type="application/ld+json"]').allTextContents();
  const structuredData = jsonLdBlocks
    .map((jsonLd) => JSON.parse(jsonLd))
    .find((item) => item["@type"] === "Service" && item.hasOfferCatalog);
  assert.ok(structuredData, "pricing Service JSON-LD");
  assert.equal(structuredData["@type"], "Service");
  assert.equal(structuredData.hasOfferCatalog.itemListElement.length, 9);
  assert.deepEqual(structuredData.provider, { "@id": "https://hydrosensetx.com/#business" });
  assert.equal(JSON.stringify(structuredData).includes("#organization"), false);
  assert.equal("@type" in structuredData.provider, false);
  await pricing.close();
} finally {
  await browser.close();
}

const standardInput = {
  postalCode: "77494",
  incomingLineSize: "1.00",
  propertyType: "single_family_residential",
  incomingLineSizeVerified: true,
  domesticMainAccessible: true,
  standardPipework: true,
  nearbyPower: true,
  wifiAvailable: true,
  dualMain: false,
  electricalModificationRequired: false,
  correctiveRepairRequired: false,
  irrigationRequested: false,
  fireSprinklerPresent: false,
};

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `GET ${path}`);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/);
  return { response, body: await response.json() };
}

async function post(path, body, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  assert.equal(response.status, expectedStatus, `POST ${path}`);
  assert.equal(response.headers.get("cache-control"), "no-store");
  return { response, body: await response.json() };
}

for (const path of [
  "/service-catalog.json",
  "/openapi.json",
  "/.well-known/agent-card.json",
  "/api/public/v1/services",
  "/api/public/v1/services/HS-INSTALL-100-001",
]) {
  const { body } = await get(path);
  assert.doesNotMatch(JSON.stringify(body), /SUPABASE|SERVICE_ROLE|ADMIN_PASSWORD|CRON_SECRET/i);
}

const catalog = (await get("/service-catalog.json")).body;
assert.equal(catalog.services.length, 11);
assert.equal(catalog.catalogVersion, "2026-08-12.1");

const openApi = (await get("/openapi.json")).body;
assert.equal(openApi.openapi, "3.1.0");
assert.ok(openApi.paths["/api/a2a"]);

const agentCardResult = await get("/.well-known/agent-card.json");
assert.equal(agentCardResult.body.supportedInterfaces[0].protocolVersion, "1.0");
assert.ok(agentCardResult.response.headers.get("etag"));

const known = await post("/api/public/v1/serviceability", { postalCode: "77494" });
assert.equal(known.body.serviceability.status, "serviceable");
const unknown = await post("/api/public/v1/serviceability", { postalCode: "99999" });
assert.equal(unknown.body.serviceability.status, "review_required");

const expectedLineTotals = { "0.75": 999, "1.00": 1450, "1.25": 1875, "1.50": 2638, "2.00": 3425 };
for (const [incomingLineSize, expectedTotal] of Object.entries(expectedLineTotals)) {
  const estimate = await post("/api/public/v1/estimate", { ...standardInput, incomingLineSize });
  assert.equal(estimate.body.publishedCatalogTotal, expectedTotal);
  assert.equal(estimate.body.estimateStatus, "catalog_exact_standard_scope");
}

const sensors = await post("/api/public/v1/estimate", {
  ...standardInput,
  sensorQuantity: 2,
  sensorCompatibilityConfirmed: true,
});
assert.equal(sensors.body.publishedCatalogTotal, 1600);

const battery = await post("/api/public/v1/estimate", {
  ...standardInput,
  batteryRequested: true,
  batteryCompatibilityConfirmed: true,
});
assert.equal(battery.body.publishedCatalogTotal, 1925);

const recurring = await post("/api/public/v1/estimate", {
  ...standardInput,
  sensorQuantity: 2,
  sensorCompatibilityConfirmed: true,
  batteryRequested: true,
  batteryCompatibilityConfirmed: true,
  annualCareRequested: true,
});
assert.equal(recurring.body.oneTimeCatalogTotal, 2075);
assert.equal(recurring.body.publishedCatalogTotal, 2075);
assert.notEqual(recurring.body.oneTimeCatalogTotal, 2174);
assert.deepEqual(recurring.body.recurringSelections, [
  {
    serviceId: "HS-CARE-ANNUAL-001",
    name: "Annual system care",
    amount: 99,
    currency: "USD",
    billingDuration: "P1Y",
  },
]);
assert.equal(recurring.body.finalWrittenProposalRequired, true);
assert.equal(recurring.body.bookingAuthority, "assessment_only");

const conditionalBattery = await post("/api/public/v1/estimate", {
  ...standardInput,
  batteryRequested: true,
});
assert.equal(conditionalBattery.body.estimateStatus, "conditional");
assert.equal(conditionalBattery.body.conditionalAddOns[0].possibleUnitPrice, 475);

const irrigation = await post("/api/public/v1/estimate", { ...standardInput, irrigationRequested: true });
assert.ok(irrigation.body.reviewReasons.includes("irrigation_quote_required"));
const fire = await post("/api/public/v1/estimate", { ...standardInput, fireSprinklerPresent: true });
assert.ok(fire.body.scope.excluded[0].includes("always excluded"));

await post("/api/public/v1/estimate", { ...standardInput, incomingLineSize: "3.00" }, 400);
await post("/api/public/v1/estimate", "{not-json", 400);
const unknownService = await fetch(`${baseUrl}/api/public/v1/services/HS-UNKNOWN-001`);
assert.equal(unknownService.status, 404);

const unsupportedA2A = await post("/api/a2a", {
  jsonrpc: "2.0",
  id: "req-unsupported",
  method: "GetTask",
  params: {},
});
assert.equal(unsupportedA2A.body.error.code, -32601);
assert.equal(unsupportedA2A.response.headers.get("a2a-version"), "1.0");

const a2aEstimateRequest = {
  jsonrpc: "2.0",
  id: "req-1",
  method: "SendMessage",
  params: {
    message: {
      messageId: "msg-1",
      role: "ROLE_USER",
      parts: [
        {
          data: {
            skill: "estimate_standard_installation",
            input: {
              ...standardInput,
              sensorQuantity: 2,
              sensorCompatibilityConfirmed: true,
              batteryRequested: true,
              batteryCompatibilityConfirmed: true,
              annualCareRequested: true,
            },
          },
          mediaType: "application/json",
        },
      ],
    },
  },
};
const a2aEstimate = await post("/api/a2a", a2aEstimateRequest);
assert.equal(a2aEstimate.body.result.message.role, "ROLE_AGENT");
const a2aData = a2aEstimate.body.result.message.parts[0].data;
assert.equal(a2aData.oneTimeCatalogTotal, 2075);
assert.equal(a2aData.publishedCatalogTotal, 2075);
assert.equal(a2aData.recurringSelections[0].amount, 99);

for (const path of ["/", "/devices", "/service-area", "/robots.txt", "/sitemap.xml"]) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, path);
}

console.log(JSON.stringify({ visualResults, apiChecks: "passed", jsonLdOffers: 9 }, null, 2));
