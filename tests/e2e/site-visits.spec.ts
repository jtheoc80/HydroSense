import { expect, test, type Page, type TestInfo } from "@playwright/test";

function evidence(testInfo: TestInfo, name: string) {
  return `docs/pr2-evidence/${testInfo.project.name}-${name}.png`;
}

async function mockMutation(page: Page, pattern: string, body: Record<string, unknown>) {
  let requestBody: Record<string, unknown> | null = null;
  await page.route(pattern, async (route) => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  return () => requestBody;
}

test("Admin schedules an appointment with Chicago-local input", async ({ page }, testInfo) => {
  const payload = await mockMutation(page, "**/api/admin/site-visits", {
    ok: true,
    visit: { id: "11111111-1111-4111-8111-111111111111" },
    deliveries: [{ channel: "email", status: "sent" }],
  });
  await page.route("**/admin/site-visits/11111111-1111-4111-8111-111111111111", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Scheduled test visit</h1>" }));
  await page.goto("/admin/site-visits/new");
  await page.getByLabel("First name *").fill("Playwright");
  await page.getByLabel("Last name *").fill("Homeowner");
  await page.getByLabel("Email").fill("playwright@example.test");
  await page.getByLabel("Property address *").fill("100 Test Water Way");
  await page.getByLabel("Exact date and time *").fill("2026-10-15T10:00");
  await page.getByLabel("Assigned representative *").fill("Test Representative");
  await page.screenshot({ path: evidence(testInfo, "schedule"), fullPage: true });
  await page.getByRole("button", { name: "Schedule and send confirmation" }).click();
  await expect.poll(payload).not.toBeNull();
  expect(payload()?.scheduledStart).toBe("2026-10-15T10:00");
  expect(payload()?.timezone).toBe("America/Chicago");
});

test("Customer confirms and sees preparation state", async ({ page }, testInfo) => {
  await mockMutation(page, "**/api/site-visits/*/confirm", { ok: true, visit: {} });
  await page.goto("/e2e/site-visits/portal-pending");
  await page.getByRole("button", { name: "Confirm appointment" }).click();
  await expect(page.getByText("Appointment confirmed")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Help us prepare" })).toBeVisible();
  await page.screenshot({ path: evidence(testInfo, "customer-confirmed"), fullPage: true });
});

test("Customer completes the pre-visit form", async ({ page }) => {
  const payload = await mockMutation(page, "**/api/site-visits/*/previsit", { ok: true, visit: {} });
  await page.goto("/e2e/site-visits/portal-pending");
  await mockMutation(page, "**/api/site-visits/*/confirm", { ok: true, visit: {} });
  await page.getByRole("button", { name: "Confirm appointment" }).click();
  await page.getByRole("button", { name: "Complete preparation" }).click();
  await expect.poll(payload).not.toBeNull();
  expect(payload()?.bathroomCount).toBe(1);
  expect(payload()?.activeLeak).toBe("unsure");
});

test("Dashboard shows status, reschedule, and overdue queues", async ({ page }, testInfo) => {
  await page.goto("/e2e/site-visits/dashboard");
  await expect(page.getByRole("heading", { name: "Site visits" })).toBeVisible();
  await page.getByRole("button", { name: /Reschedule requests/ }).click();
  await expect(page.getByText("reschedule requested", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Overdue \/ unresolved/ }).click();
  await expect(page.getByText("Mark no-show or start visit")).toBeVisible();
  await page.screenshot({ path: evidence(testInfo, "dashboard-queues"), fullPage: true });
});

test("Customer requests a reschedule with two Chicago-local options", async ({ page }) => {
  const payload = await mockMutation(page, "**/api/site-visits/*/reschedule", { ok: true, visit: {} });
  await page.goto("/e2e/site-visits/portal-confirmed");
  await page.getByRole("button", { name: "Need a different time?" }).click();
  await page.getByLabel("Preferred option 1").fill("2026-10-20T10:00");
  await page.getByLabel("Preferred option 2").fill("2026-10-21T12:00");
  await page.getByLabel("Reason or note").fill("Morning is easier for access.");
  await page.getByRole("button", { name: "Send reschedule request" }).click();
  await expect.poll(payload).not.toBeNull();
  expect(payload()?.option1).toBe("2026-10-20T10:00");
  expect(payload()?.option2).toBe("2026-10-21T12:00");
});

test("Admin selects an exact customer-requested option", async ({ page }, testInfo) => {
  const payload = await mockMutation(page, "**/api/admin/site-visits/*", { ok: true, visit: {}, deliveries: [] });
  await page.goto("/e2e/site-visits/admin-reschedule");
  await expect(page.getByRole("heading", { name: "Customer reschedule request" })).toBeVisible();
  await page.getByRole("button", { name: /Accept option 1/ }).click();
  await expect.poll(payload).not.toBeNull();
  expect(payload()?.selectedOption).toBe("option1");
  await page.screenshot({ path: evidence(testInfo, "admin-reschedule"), fullPage: true });
});

test("Technician completes a clean assessment", async ({ page }, testInfo) => {
  await page.route("**/api/admin/site-visits/*/assessment", async (route) => {
    const body = route.request().postDataJSON() as { revision: number };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, visit: { assessment_revision: body.revision + 1 } }),
    });
  });
  await page.route("**/admin/site-visits/11111111-1111-4111-8111-111111111111", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Completed test visit</h1>" }));
  const payload = await mockMutation(page, "**/api/admin/site-visits/*/complete", { ok: true, visit: {}, deliveries: [] });
  await page.goto("/e2e/site-visits/assessment-clean");
  for (let index = 0; index < 7; index += 1) await page.getByRole("button", { name: "Next section" }).click();
  await expect(page.getByText("ready for proposal", { exact: true })).toBeVisible();
  await page.screenshot({ path: evidence(testInfo, "clean-assessment"), fullPage: true });
  await page.getByRole("button", { name: "Complete visit" }).click();
  await expect.poll(payload).not.toBeNull();
  expect(Number(payload()?.revision)).toBeGreaterThanOrEqual(1);
});

test("Customer closeout shows quote and preserved prior assessment", async ({ page }, testInfo) => {
  await page.goto("/e2e/site-visits/portal-recheck-ready");
  await expect(page.getByRole("heading", { name: "Your home is ready for a HydroSense proposal" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Review your HydroSense quote" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Assessment history" })).toBeVisible();
  await expect(page.getByText("Assessment 1 · leak repair required")).toBeVisible();
  await page.screenshot({ path: evidence(testInfo, "recheck-history"), fullPage: true });
});

test("Draft quote creation is a single idempotent action", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/admin/site-visits/*/quote", async (route) => {
    calls += 1;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, quoteId: "quote-1", created: calls === 1 }) });
  });
  await page.route("**/admin/quotes/quote-1", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Test quote</h1>" }));
  await page.goto("/e2e/site-visits/admin-completed");
  await page.getByRole("button", { name: "Create draft quote" }).click();
  await expect.poll(() => calls).toBe(1);
});

test("Blocked flow preserves readiness, supports recheck, and shows corrective verification", async ({ page }, testInfo) => {
  const recheck = await mockMutation(page, "**/api/site-visits/*/recheck", { ok: true, visit: {} });
  await page.goto("/e2e/site-visits/portal-blocked");
  await expect(page.getByRole("heading", { name: "Required actions" })).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ waitUntil: "load" }),
    page.getByRole("button", { name: "I completed the required work" }).click(),
  ]);
  await expect.poll(recheck).not.toBeNull();
  await page.goto("/e2e/site-visits/admin-blocked");
  await expect(page.getByText("customer reported complete", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Verify complete" })).toBeVisible();
  await page.screenshot({ path: evidence(testInfo, "blocked-recheck"), fullPage: true });
});

test("Overdue visit can be resolved as no-show", async ({ page }, testInfo) => {
  const payload = await mockMutation(page, "**/api/admin/site-visits/*/no-show", { ok: true, visit: {} });
  await page.goto("/e2e/site-visits/admin-overdue");
  page.once("dialog", async (dialog) => dialog.accept("Customer was unavailable after the grace period."));
  await page.getByRole("button", { name: "Mark no-show" }).click();
  await expect.poll(payload).not.toBeNull();
  expect(payload()?.reason).toContain("grace period");
  await page.screenshot({ path: evidence(testInfo, "overdue-no-show"), fullPage: true });
});
