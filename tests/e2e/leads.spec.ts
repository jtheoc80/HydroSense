import { expect, test } from "@playwright/test";

const leadId = "11111111-1111-4111-8111-111111111111";

test("records an outcome and moves the lead without a stale reload", async ({ page }) => {
  let savedStatus: string | null = null;

  await page.route("**/api/admin/update-status", async (route) => {
    const body = route.request().postDataJSON() as {
      id: string;
      status: string;
    };
    savedStatus = body.status;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "Cache-Control": "no-store, max-age=0" },
      body: JSON.stringify({
        ok: true,
        lead: {
          id: body.id,
          created_at: "2026-08-14T12:00:00.000Z",
          first_name: "Test",
          last_name: "Homeowner",
          email: "lead-outcome@example.test",
          phone: "281-555-0100",
          zip: "77494",
          address: "100 Test Water Way",
          carrier: "Test carrier",
          message: null,
          city: "Katy",
          campaign: null,
          source: "hydrosensetx.com",
          page_path: "/",
          utm_source: null,
          lead_score: 3,
          lead_tier: "hot",
          status: body.status,
          booked_at: null,
          meeting_url: null,
          notes: null,
          power_within_12ft: "yes",
          fire_sprinkler_system: "no",
          wifi_at_install_location: "yes",
          qualifying_flags: {
            install_ready: true,
            needs_electrician: false,
            fire_sprinkler_concern: false,
            wifi_extender_needed: false,
          },
        },
      }),
    });
  });

  await page.goto("/e2e/leads");
  const card = page.getByTestId("lead-card-" + leadId);
  await expect(page.getByTestId("lead-column-new").getByTestId("lead-card-" + leadId)).toBeVisible();
  await card.getByRole("button", { name: "Move Test Homeowner to quoted" }).click();

  await expect.poll(() => savedStatus).toBe("quoted");
  await expect(page.getByTestId("lead-column-quoted").getByTestId("lead-card-" + leadId)).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Outcome saved: Test Homeowner → Quoted.");
});

test("keeps the lead in place and exposes a save failure", async ({ page }) => {
  await page.route("**/api/admin/update-status", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "Unable to save the lead outcome" }),
    })
  );

  await page.goto("/e2e/leads");
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByTestId("lead-card-" + leadId)
    .getByRole("button", { name: "Move Test Homeowner to won" })
    .click();

  await expect(
    page.locator('[role="alert"]').filter({
      hasText: "Unable to save the lead outcome",
    })
  ).toBeVisible();
  await expect(page.getByTestId("lead-column-new").getByTestId("lead-card-" + leadId)).toBeVisible();
});
