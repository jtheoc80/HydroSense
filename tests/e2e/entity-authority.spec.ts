import { expect, test } from "@playwright/test";
import {
  PHYN_PRO_DIRECTORY_URL,
  getManufacturerAuthorityStatement,
  manufacturerAuthoritySummary,
} from "../../lib/business/manufacturer-authorizations";
import {
  fullServiceAuthorityStatement,
  homepagePlumbingTrustStatement,
  publicPlumbingAuthorityStatement,
} from "../../lib/business/plumbing-license";

const unsupportedAuthorityClaim =
  /Phyn Certified|Phyn Authorized Installer|Phyn Approved Installer|Phyn Endorsed Installer|Certified Installer|Preferred Installer|Factory Certified|Official Partner|Authorized Dealer/i;

function normalizeRawHtml(html: string) {
  return html.replaceAll("&#x27;", "'").replaceAll("&apos;", "'");
}

test("manufacturer authority is visible in raw server HTML", async ({ request }) => {
  const expectedPages = [
    { route: "/about", statement: manufacturerAuthoritySummary },
    {
      route: "/devices/flologic",
      statement: getManufacturerAuthorityStatement("flologic")!,
    },
    {
      route: "/devices/phyn-plus",
      statement: getManufacturerAuthorityStatement("phyn-plus")!,
    },
  ];

  for (const expected of expectedPages) {
    const response = await request.get(expected.route);
    expect(response.status(), expected.route).toBe(200);
    expect(response.headers()["content-type"], expected.route).toContain("text/html");
    const html = normalizeRawHtml(await response.text());
    expect(html, expected.route).toContain(expected.statement);
    expect(html, expected.route).not.toMatch(unsupportedAuthorityClaim);
    if (expected.route.startsWith("/devices/")) {
      expect(html, expected.route).toContain("data-manufacturer-authority");
    }
  }
});

test("About authority profile keeps HydroSense primary while separating evidence types", async ({
  request,
}) => {
  const response = await request.get("/about");
  expect(response.status()).toBe(200);
  const html = normalizeRawHtml(await response.text());

  expect((html.match(/<h1\b/g) ?? []).length).toBe(1);
  expect(html).toContain('rel="canonical" href="https://hydrosensetx.com/about"');

  for (const fact of [
    "HydroSense Texas",
    "Lead Ledger Pro LLC",
    "Greater Houston, Texas",
    "(281) 694-5754",
    fullServiceAuthorityStatement,
    publicPlumbingAuthorityStatement,
    "Authorized by FloLogic",
    "Phyn Pro",
    "listed in Phyn's Find a Phyn Pro Directory",
    PHYN_PRO_DIRECTORY_URL,
    "Published installation starting range:",
    "1.5-inch domestic main:",
    "$3,456",
    "2-inch domestic main:",
    "$4,175",
    "commercial grade",
    "Fire-sprinkler and fire-suppression piping are excluded.",
    "final written proposal",
  ]) {
    expect(html, `About fact: ${fact}`).toContain(fact);
  }
  expect(html).toContain('"@type":"BreadcrumbList"');
  expect(html).not.toMatch(/<meta[^>]+name=["']robots["'][^>]+noindex/i);
  expect(html).not.toMatch(unsupportedAuthorityClaim);
});

test("supported device pages do not inherit manufacturer authority", async ({ request }) => {
  for (const deviceSlug of ["moen-flo", "streamlabs", "guardian"]) {
    const response = await request.get(`/devices/${deviceSlug}`);
    expect(response.status(), deviceSlug).toBe(200);
    const html = normalizeRawHtml(await response.text());
    expect(html, deviceSlug).not.toContain("data-manufacturer-authority");
    expect(html, deviceSlug).not.toMatch(/HydroSense Texas is authorized by/i);
    expect(html, deviceSlug).not.toMatch(unsupportedAuthorityClaim);
  }
});

test("devices hub presents the exact governed relationship labels", async ({ page }) => {
  await page.goto("/devices", { waitUntil: "domcontentloaded" });

  const floLogicCard = page.locator('article[data-device-slug="flologic"]');
  await expect(floLogicCard.locator("[data-manufacturer-authority-badge]")).toBeVisible();
  await expect(floLogicCard).toContainText("Authorized by FloLogic");

  const phynCard = page.locator('article[data-device-slug="phyn-plus"]');
  await expect(phynCard.locator("[data-manufacturer-authority-badge]")).toBeVisible();
  await expect(phynCard).toContainText("Phyn Pro");
  await expect(phynCard).toContainText(
    "HydroSense Texas is listed in Phyn's Find a Phyn Pro Directory.",
  );

  for (const deviceSlug of ["moen-flo", "streamlabs", "guardian"]) {
    const card = page.locator(`article[data-device-slug="${deviceSlug}"]`);
    await expect(card.locator("[data-manufacturer-authority-badge]")).toHaveCount(0);
  }
});

test("Phyn corroboration is a visible link but never sameAs or a business credential", async ({
  request,
}) => {
  const phynResponse = await request.get("/devices/phyn-plus");
  const phynHtml = normalizeRawHtml(await phynResponse.text());
  expect(phynHtml).toContain(`href="${PHYN_PRO_DIRECTORY_URL}"`);

  const homeResponse = await request.get("/");
  const homeHtml = await homeResponse.text();
  const schemaBlocks = Array.from(
    homeHtml.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
    (match) => JSON.parse(match[1]) as Record<string, unknown>,
  );
  const business = schemaBlocks.find(
    (schema) => schema["@id"] === "https://hydrosensetx.com/#business",
  );
  expect(business).toBeDefined();
  expect(business).toMatchObject({
    name: "HydroSense Texas",
    telephone: "+1-281-694-5754",
  });
  expect(business).not.toHaveProperty("hasCredential");
  for (const relationship of [
    "employee",
    "memberOf",
    "parentOrganization",
    "subOrganization",
  ]) {
    expect(business).not.toHaveProperty(relationship);
  }
  expect(JSON.stringify(business?.sameAs ?? [])).not.toContain(PHYN_PRO_DIRECTORY_URL);
  expect(JSON.stringify(business)).not.toMatch(/Jamyron L\. Davis|Davis Quality Plumbing LLC/i);
  expect(JSON.stringify(business)).not.toMatch(unsupportedAuthorityClaim);
});

test("brand-first marketing pages keep fulfillment identities private", async ({ request }) => {
  const pages = [
    { route: "/", authority: homepagePlumbingTrustStatement },
    { route: "/about", authority: publicPlumbingAuthorityStatement },
    { route: "/pricing", authority: fullServiceAuthorityStatement },
    { route: "/devices", authority: fullServiceAuthorityStatement },
    {
      route: "/guides/do-i-need-a-plumber-for-smart-water-shutoff",
      authority: publicPlumbingAuthorityStatement,
    },
  ];

  for (const page of pages) {
    const response = await request.get(page.route);
    expect(response.status(), page.route).toBe(200);
    const html = normalizeRawHtml(await response.text());
    expect(html, page.route).toContain(page.authority);
    expect(html, page.route).not.toMatch(/Jamyron L\. Davis|Davis Quality Plumbing LLC/i);
    expect(html, page.route).not.toMatch(
      /Work coordinated under Texas Master Plumber License|MPL 43057/i,
    );
    expect(html, page.route).not.toMatch(
      /HydroSense(?: Texas)? (?:owns|holds|is licensed under).{0,80}M-43057/i,
    );
  }
});
test("authority pages remain readable and overflow-safe", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  for (const route of ["/", "/about", "/devices", "/devices/flologic", "/devices/phyn-plus"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    expect((await page.locator("body").innerText()).trim(), `${route} body content`).not.toBe("");
    await expect(
      page.locator('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay'),
      `${route} framework error overlay`,
    ).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${route} horizontal overflow`).toBeLessThanOrEqual(
      dimensions.innerWidth,
    );
  }
  expect(consoleErrors, "browser console errors").toEqual([]);
});
