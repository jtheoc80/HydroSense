import { expect, test } from "@playwright/test";
import { deviceList } from "../../lib/devices";
import { SITE_ORIGIN } from "../../lib/seo/indexable-pages";

type JsonLd = Record<string, unknown>;

const guides = [
  {
    route: "/guides/smart-water-shutoff-installation-cost-houston",
    title: "Smart Water Shutoff Installation Cost in Houston | HydroSense",
    question: "How much does a smart water shutoff cost to install in Houston?",
    facts: ["$999", "$4,175", "written proposal"],
  },
  {
    route: "/guides/what-size-smart-water-shutoff-do-i-need",
    title: "What Size Smart Water Shutoff Do I Need? | HydroSense",
    question: "What size smart water shutoff do I need?",
    facts: ["FloLogic", "1.5-inch", "2-inch"],
  },
  {
    route: "/guides/flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic",
    title: "Flo by Moen vs Phyn vs StreamLabs vs FloLogic | HydroSense",
    question: "How do Flo by Moen, Phyn Plus, StreamLabs, and FloLogic compare?",
    facts: ["Flo by Moen", "Phyn Plus", "StreamLabs Control", "FloLogic"],
  },
  {
    route: "/guides/do-i-need-a-plumber-for-smart-water-shutoff",
    title: "Do You Need a Plumber for a Smart Water Shutoff? | HydroSense",
    question: "Do I need a plumber to install a smart water shutoff?",
    facts: ["M-43057", "domestic", "fire-sprinkler"],
  },
  {
    route: "/guides/smart-water-shutoff-power-wifi-outage",
    title: "Do Smart Water Shutoffs Work Without Power or Wi-Fi? | HydroSense",
    question: "What happens to a smart water shutoff if power or Wi-Fi goes out?",
    facts: ["without Wi-Fi", "remote control", "battery"],
  },
] as const;

function parseJsonLd(html: string): JsonLd[] {
  return Array.from(
    html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    (match) => JSON.parse(match[1]) as JsonLd,
  );
}

test("guide hub and five commercial answers are complete in raw server HTML", async ({ request }) => {
  const hubResponse = await request.get("/guides");
  expect(hubResponse.status()).toBe(200);
  const hubHtml = await hubResponse.text();
  expect(hubHtml).toContain("Smart Water Shutoff Buying Guides | HydroSense Texas");
  expect(hubHtml).toContain('rel="canonical" href="https://hydrosensetx.com/guides"');
  for (const guide of guides) expect(hubHtml).toContain(guide.route);

  for (const guide of guides) {
    const response = await request.get(guide.route);
    expect(response.status(), guide.route).toBe(200);
    expect(response.headers()["content-type"], guide.route).toContain("text/html");
    const html = await response.text();

    expect((html.match(/<h1\b/g) ?? []).length, `${guide.route} H1 count`).toBe(1);
    expect(html, `${guide.route} title`).toContain(guide.title);
    expect(html, `${guide.route} canonical`).toContain(
      `rel="canonical" href="${SITE_ORIGIN}${guide.route}"`,
    );
    expect(html, `${guide.route} DirectAnswer`).toContain("data-direct-answer");
    expect(html, `${guide.route} direct question`).toContain(guide.question);
    expect(html, `${guide.route} noindex`).not.toMatch(/<meta[^>]+name=["']robots["'][^>]+noindex/i);
    expect(
      parseJsonLd(html).some((item) => item["@type"] === "BreadcrumbList"),
      `${guide.route} BreadcrumbList`,
    ).toBe(true);
    for (const fact of guide.facts) expect(html, `${guide.route} fact ${fact}`).toContain(fact);
  }
});

test("commercial answers remain visible, canonical, and overflow-safe in a browser", async ({ page }) => {
  for (const guide of guides) {
    const response = await page.goto(guide.route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), guide.route).toBe(200);
    await expect(page).toHaveTitle(guide.title);
    await expect(page.locator("h1"), `${guide.route} H1`).toHaveCount(1);
    await expect(page.locator("h1"), `${guide.route} visible H1`).toBeVisible();
    await expect(page.locator("[data-direct-answer]"), `${guide.route} DirectAnswer`).toBeVisible();
    await expect(page.locator("[data-direct-answer-text]"), `${guide.route} answer text`).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: guide.question })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${SITE_ORIGIN}${guide.route}`,
    );

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${guide.route} horizontal overflow`).toBeLessThanOrEqual(
      dimensions.innerWidth,
    );
  }
});

test("global Service schema names every governed HydroSense device family", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const service = parseJsonLd(await response.text()).find(
    (item) => item["@type"] === "Service" && item["@id"] === `${SITE_ORIGIN}/#smart-water-shutoff-installation`,
  );
  expect(service).toBeDefined();
  const description = String(service?.description ?? "");
  for (const device of deviceList) expect(description).toContain(device.name);
});

test("cost, sizing, comparison, plumbing, and outage claims remain intentionally distinct", async ({ page }) => {
  await page.goto(guides[0].route);
  await expect(page.getByText("$3,456", { exact: true })).toBeVisible();
  await expect(page.getByText("$4,175", { exact: true })).toBeVisible();

  await page.goto(guides[1].route);
  await expect(page.getByText(/designated supported large-line device family/i).first()).toBeVisible();

  await page.goto(guides[2].route);
  await expect(page.getByText(/not an affiliate ranking/i)).toBeVisible();
  await expect(page.getByText(/A universal winner cannot be named/i)).toBeVisible();

  await page.goto(guides[3].route);
  await expect(page.locator("[data-direct-answer-text]")).toContainText("Texas-licensed plumbing partner under Responsible Master Plumber M-43057");
  await expect(page.locator("#scope-boundary")).toContainText(/fire-sprinkler or fire-suppression piping/i);

  await page.goto(guides[4].route);
  for (const device of deviceList) {
    await expect(page.getByRole("link", { name: device.name, exact: true }).first()).toBeVisible();
  }
});
