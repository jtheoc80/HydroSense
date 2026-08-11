import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:3100",
    httpCredentials: { username: "admin", password: "playwright-only" },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/e2e/site-visits/portal-pending",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      PLAYWRIGHT_TEST_MODE: "1",
      NODE_OPTIONS: "--use-system-ca",
      SITE_VISIT_PROVIDER_MODE: "mock",
      ADMIN_USERNAME: "admin",
      ADMIN_PASSWORD: "playwright-only",
      NEXT_PUBLIC_HYDROSENSE_PHONE: "(281) 555-0199",
    },
  },
  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-chrome-390",
      use: { ...devices["Pixel 5"], channel: "chrome", viewport: { width: 390, height: 844 } },
    },
  ],
});
