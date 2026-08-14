import { expect, test } from "@playwright/test";

const refreshedQuotes = [
  {
    id: "quote-5",
    quote_number: "Q-2026-0005",
    public_token: "public-token-5",
    customer_first_name: "Revision",
    customer_last_name: "Draft",
    customer_email: "revision@example.test",
    total: 925,
    status: "draft",
    created_at: "2026-08-14T19:20:38.000Z",
  },
  {
    id: "quote-4",
    quote_number: "Q-2026-0004",
    public_token: "public-token-4",
    customer_first_name: "Viewed",
    customer_last_name: "Customer",
    customer_email: "viewed@example.test",
    total: 925,
    status: "viewed",
    created_at: "2026-08-14T17:11:54.000Z",
  },
  ...[3, 2, 1].map((number) => ({
    id: `quote-${number}`,
    quote_number: `Q-2026-000${number}`,
    public_token: `public-token-${number}`,
    customer_first_name: "Existing",
    customer_last_name: "Customer",
    customer_email: "existing@example.test",
    total: 700 + number,
    status: number === 2 ? "draft" : "expired",
    created_at: `2026-06-0${number}T12:00:00.000Z`,
  })),
];

test("stale quote list refreshes and a viewed quote opens its existing draft revision", async ({ page }) => {
  await page.route("**/api/quotes", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Cache-Control": "no-store, max-age=0" },
      body: JSON.stringify({ ok: true, quotes: refreshedQuotes }),
    })
  );
  await page.route("**/api/admin/quotes/quote-4/revise", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, quote: { id: "quote-5" }, reused: true }),
    })
  );
  await page.route("**/admin/quotes/quote-5", (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Editable revision Q-2026-0005</h1>" })
  );

  await page.goto("/e2e/quotes");
  await expect(page.getByText("5 total")).toBeVisible();
  await expect(page.getByRole("link", { name: "Q-2026-0005" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Q-2026-0004" })).toBeVisible();

  const viewedRow = page.getByRole("row").filter({ hasText: "Q-2026-0004" });
  page.once("dialog", (dialog) => dialog.accept());
  await viewedRow.getByRole("button", { name: "Revise" }).click();
  await expect(page.getByRole("heading", { name: "Editable revision Q-2026-0005" })).toBeVisible();
});

test("quote administration requires credentials while customer quote APIs remain public", async ({ baseURL }) => {
  expect(baseURL).toBeTruthy();
  const adminResponse = await fetch(`${baseURL}/api/quotes`);
  expect(adminResponse.status).toBe(401);
  expect(adminResponse.headers.get("www-authenticate")).toContain("HydroSense Admin");

  const cronResponse = await fetch(`${baseURL}/api/quotes/expire-stale`);
  expect(cronResponse.status).toBe(401);

  const customerResponse = await fetch(`${baseURL}/api/quotes/public/${"a".repeat(32)}`);
  expect(customerResponse.status).not.toBe(401);
});
