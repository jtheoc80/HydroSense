import { expect, test } from "@playwright/test";
import {
  getManufacturerAuthorizationStatement,
  manufacturerAuthorizationSummary,
} from "../../lib/business/manufacturer-authorizations";
const unsupportedAuthorityClaim =
  /Authorized Dealer|Certified Installer|Preferred Installer|Factory Certified|Official Partner/i;

test("manufacturer authorization is visible in raw server HTML", async ({ request }) => {
  const expectedPages = [
    { route: "/about", statement: manufacturerAuthorizationSummary },
    {
      route: "/devices/flologic",
      statement: getManufacturerAuthorizationStatement("flologic")!,
    },
    {
      route: "/devices/phyn-plus",
      statement: getManufacturerAuthorizationStatement("phyn-plus")!,
    },
  ];

  for (const expected of expectedPages) {
    const response = await request.get(expected.route);
    expect(response.status(), expected.route).toBe(200);
    expect(response.headers()["content-type"], expected.route).toContain("text/html");
    const html = await response.text();
    expect(html, expected.route).toContain(expected.statement);
    expect(html, expected.route).not.toMatch(unsupportedAuthorityClaim);
    if (expected.route.startsWith("/devices/"))
      expect(html, expected.route).toContain("data-manufacturer-authorization");
  }
});

test("About authority profile is complete in raw server HTML", async ({ request }) => {
  const response = await request.get("/about");
  expect(response.status()).toBe(200);
  const html = await response.text();

  expect((html.match(/<h1\b/g) ?? []).length).toBe(1);
  expect(html).toContain(
    'rel="canonical" href="https://hydrosensetx.com/about"',
  );

  for (const fact of [
    "HydroSense Texas",
    "Lead Ledger Pro LLC",
    "Greater Houston, Texas",
    "(281) 694-5754",
    "MPL 43057",
    "Authorized by FloLogic",
    "Authorized by Phyn",
    "$999–$4,175",
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

test("supported device pages do not inherit authorization", async ({ request }) => {
  for (const deviceSlug of ["moen-flo", "streamlabs", "guardian"]) {
    const response = await request.get(`/devices/${deviceSlug}`);
    expect(response.status(), deviceSlug).toBe(200);
    const html = await response.text();
    expect(html, deviceSlug).not.toContain("data-manufacturer-authorization");
    expect(html, deviceSlug).not.toMatch(/HydroSense Texas is authorized by/i);
    expect(html, deviceSlug).not.toMatch(unsupportedAuthorityClaim);
  }
});

test("devices hub marks only owner-verified manufacturers as authorized", async ({ page }) => {
  await page.goto("/devices", { waitUntil: "domcontentloaded" });

  for (const deviceSlug of ["flologic", "phyn-plus"]) {
    const card = page.locator(`article[data-device-slug="${deviceSlug}"]`);
    await expect(card.locator("[data-manufacturer-authorization-badge]")).toBeVisible();
    await expect(card).toContainText(
      "HydroSense Texas is authorized by this manufacturer.",
    );
  }

  for (const deviceSlug of ["moen-flo", "streamlabs", "guardian"]) {
    const card = page.locator(`article[data-device-slug="${deviceSlug}"]`);
    await expect(card.locator("[data-manufacturer-authorization-badge]")).toHaveCount(0);
  }
});

test("authorization pages remain readable and overflow-safe", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  for (const route of ["/", "/about", "/devices/flologic", "/devices/phyn-plus"]) {
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
