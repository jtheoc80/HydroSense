import { expect, test } from "@playwright/test";
import {
  BUSINESS_ENTITY_ID,
  SITE_ORIGIN,
  getIndexablePages,
  protectedNoindexPaths,
} from "../../lib/seo/indexable-pages";

const browserRoutes = [
  "/",
  "/pricing",
  "/devices",
  "/devices/moen-flo",
  "/devices/phyn-plus",
  "/devices/streamlabs",
  "/service-area",
  "/service-area/houston",
  "/service-area/katy",
  "/agent-ready",
] as const;

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

  for (const path of protectedNoindexPaths) {
    expect(sitemapUrls).not.toContain(new URL(path, `${SITE_ORIGIN}/`).toString());
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["x-robots-tag"], path).toContain("noindex");
  }
});
