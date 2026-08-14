import { expect, test } from "@playwright/test";
import {
  BUSINESS_ENTITY_ID,
  SITE_ORIGIN,
  getIndexablePages,
  protectedNoindexPaths,
} from "../../lib/seo/indexable-pages";

type JsonLd = Record<string, unknown>;

const browserRoutes = [
  "/",
  "/pricing",
  "/devices",
  "/devices/moen-flo",
  "/devices/phyn-plus",
  "/devices/streamlabs",
  "/devices/flologic",
  "/service-area",
  "/service-area/houston",
  "/service-area/katy",
  "/agent-ready",
] as const;

const rawHtmlRoutes = [
  "/",
  "/pricing",
  "/devices/moen-flo",
  "/devices/flologic",
  "/service-area/houston",
  "/agent-ready",
] as const;

function parseRawJsonLd(html: string): JsonLd[] {
  return Array.from(
    html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
    (match) => JSON.parse(match[1]) as JsonLd,
  );
}

test("structured data is present in raw server HTML before hydration", async ({ request }) => {
  const structuredDataByRoute = new Map<string, JsonLd[]>();

  for (const route of rawHtmlRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(response.headers()["content-type"], route).toContain("text/html");

    const html = await response.text();
    expect(html, `${route} JSON-LD marker`).toContain("application/ld+json");

    const jsonLd = parseRawJsonLd(html);
    expect(jsonLd.length, `${route} raw JSON-LD blocks`).toBeGreaterThan(0);
    structuredDataByRoute.set(route, jsonLd);
  }

  const homepageJsonLd = structuredDataByRoute.get("/") ?? [];
  const businessEntities = homepageJsonLd.filter(
    (item) => item["@id"] === BUSINESS_ENTITY_ID,
  );
  expect(businessEntities).toHaveLength(1);
  expect(businessEntities[0]["@type"]).toEqual(["LocalBusiness", "Plumber"]);
  expect(businessEntities[0]).toMatchObject({
    name: "HydroSense Texas",
    hasCredential: { identifier: "MPL 43057" },
  });

  const pricingJsonLd = structuredDataByRoute.get("/pricing") ?? [];
  const pricingService = pricingJsonLd.find(
    (item) => item["@type"] === "Service" && item.hasOfferCatalog,
  );
  expect(pricingService).toBeDefined();
  expect(pricingService?.provider).toEqual({ "@id": BUSINESS_ENTITY_ID });
  const offerCatalog = pricingService?.hasOfferCatalog as
    | { "@type"?: unknown; itemListElement?: unknown[] }
    | undefined;
  expect(offerCatalog?.["@type"]).toBe("OfferCatalog");
  expect(offerCatalog?.itemListElement).toHaveLength(9);

  for (const route of [
    "/pricing",
    "/devices/moen-flo",
    "/devices/flologic",
    "/service-area/houston",
    "/agent-ready",
  ]) {
    expect(
      (structuredDataByRoute.get(route) ?? []).some(
        (item) => item["@type"] === "BreadcrumbList",
      ),
      `${route} raw BreadcrumbList`,
    ).toBe(true);
  }
});

test("FloLogic detail page has unique search intent and governed manufacturer copy", async ({ page }) => {
  const response = await page.goto("/devices/flologic", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("FloLogic Installation Houston | HydroSense Texas");
  await expect(page.getByRole("heading", { level: 1, name: "FloLogic installation in Houston" })).toBeVisible();
  await expect(page.locator(`a[href="https://flologic.com/collections/flologic-system"]`).first()).toBeVisible();
  await expect(page.getByText(/designated large-line device family/i).first()).toBeVisible();
  await expect(page.getByText(/fire-sprinkler and fire-suppression piping are excluded/i).first()).toBeVisible();
});

test("catalog, REST estimate, and A2A expose the same FloLogic designation", async ({ request }) => {
  const expectedFamily = {
    slug: "flologic",
    name: "FloLogic",
    designation: "designated",
  };

  const catalogResponse = await request.get("/service-catalog.json");
  expect(catalogResponse.status()).toBe(200);
  const catalog = await catalogResponse.json();
  const catalogService = catalog.services.find(
    (service: { id: string }) => service.id === "HS-INSTALL-150-001",
  );
  expect(catalogService.deviceFamily).toEqual(expectedFamily);
  expect(catalogService.price.amount).toBe(2638);

  const servicesResponse = await request.get("/api/public/v1/services");
  expect(servicesResponse.status()).toBe(200);
  const services = await servicesResponse.json();
  expect(
    services.services.find((service: { id: string }) => service.id === "HS-INSTALL-200-001").deviceFamily,
  ).toEqual(expectedFamily);

  const estimateResponse = await request.post("/api/public/v1/estimate", {
    data: { postalCode: "77494", incomingLineSize: "1.50" },
  });
  expect(estimateResponse.status()).toBe(200);
  const estimate = await estimateResponse.json();
  expect(estimate.baseService.deviceFamily).toEqual(expectedFamily);
  expect(estimate.baseService.unitPrice).toBe(2638);

  const a2aResponse = await request.post("/api/a2a", {
    data: {
      jsonrpc: "2.0",
      id: "flologic-e2e",
      method: "SendMessage",
      params: {
        message: {
          messageId: "flologic-e2e-message",
          role: "ROLE_USER",
          parts: [{
            data: {
              skill: "estimate_standard_installation",
              input: { postalCode: "77494", incomingLineSize: "2.00" },
            },
            mediaType: "application/json",
          }],
        },
      },
    },
  });
  expect(a2aResponse.status()).toBe(200);
  const a2a = await a2aResponse.json();
  expect(a2a.result.message.parts[0].data.baseService.deviceFamily).toEqual(expectedFamily);
  expect(a2a.result.message.parts[0].data.baseService.unitPrice).toBe(3425);

  const agentCardResponse = await request.get("/.well-known/agent-card.json");
  expect(agentCardResponse.status()).toBe(200);
});

for (const route of browserRoutes) {
  test(`${route} exposes canonical intent without viewport overflow`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), `${route} H1`).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]'), `${route} noindex`).toHaveCount(0);

    const expectedCanonical = new URL(route, `${SITE_ORIGIN}/`).toString();
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonicalHref ?? "", `${SITE_ORIGIN}/`).toString(), `${route} canonical`).toBe(
      expectedCanonical,
    );

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(dimensions.scrollWidth, `${route} horizontal overflow`).toBeLessThanOrEqual(
      dimensions.innerWidth,
    );

    if (route === "/") {
      await expect(
        page.getByText(/Standard device-and-install rates range from \$999–\$3,425 based on verified incoming line size/i),
      ).toBeVisible();
    }
  });
}

test("structured data preserves one global business identity and pricing provider", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const homepageJsonLd = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).map((block) => JSON.parse(block));

  const businessEntities = homepageJsonLd.filter((item) => item["@id"] === BUSINESS_ENTITY_ID);
  expect(businessEntities).toHaveLength(1);
  expect(businessEntities[0]["@type"]).toEqual(["LocalBusiness", "Plumber"]);
  expect(businessEntities[0]).toMatchObject({
    name: "HydroSense Texas",
    legalName: "Lead Ledger Pro LLC",
    url: SITE_ORIGIN,
    telephone: "+1-281-694-5754",
    areaServed: { name: "Greater Houston, Texas" },
    hasCredential: { identifier: "MPL 43057" },
  });
  expect(JSON.stringify(businessEntities[0])).not.toContain("streetAddress");

  await page.goto("/pricing", { waitUntil: "networkidle" });
  const pricingJsonLd = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  )
    .map((block) => JSON.parse(block))
    .find((item) => item["@type"] === "Service" && item.hasOfferCatalog);
  expect(pricingJsonLd.provider).toEqual({ "@id": BUSINESS_ENTITY_ID });
  expect(pricingJsonLd.hasOfferCatalog.itemListElement).toHaveLength(9);
  expect(JSON.stringify(pricingJsonLd)).not.toContain("#organization");
});

test("robots, sitemap, and legacy noindex headers match registry policy", async ({ request }) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  expect(robots.match(/^Sitemap:\s*\S+$/gm)).toEqual([
    "Sitemap: https://hydrosensetx.com/sitemap.xml",
  ]);

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  const sitemapUrls = Array.from(
    sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    (match) => match[1],
  );
  expect(sitemapUrls).toEqual(
    getIndexablePages().map((page) => new URL(page.path, `${SITE_ORIGIN}/`).toString()),
  );
  expect(sitemapUrls).toContain(`${SITE_ORIGIN}/pricing`);
  expect(sitemapUrls).toContain(`${SITE_ORIGIN}/agent-ready`);
  expect(sitemapUrls).toContain(`${SITE_ORIGIN}/devices/flologic`);

  for (const path of protectedNoindexPaths) {
    expect(sitemapUrls).not.toContain(new URL(path, `${SITE_ORIGIN}/`).toString());
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["x-robots-tag"], path).toContain("noindex");
  }
});
