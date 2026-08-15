import { chromium } from "@playwright/test";

const baseUrl = process.env.PREVIEW_BASE_URL ?? "http://127.0.0.1:3200";
const errors = [];
const pages = [
  "/",
  "/pricing",
  "/devices",
  "/devices/flologic",
  "/guides",
  "/guides/smart-water-shutoff-installation-cost-houston",
  "/guides/what-size-smart-water-shutoff-do-i-need",
  "/guides/flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic",
  "/guides/do-i-need-a-plumber-for-smart-water-shutoff",
  "/guides/smart-water-shutoff-power-wifi-outage",
  "/service-area/houston",
];
const resources = [
  ["/sitemap.xml", "application/xml"],
  ["/robots.txt", "text/plain"],
  ["/llms.txt", "text/plain"],
  ["/llms-full.txt", "text/plain"],
];
const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1792, height: 1000 },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });

try {
  const request = await browser.newContext().then((context) => context.request);
  for (const [route, contentType] of resources) {
    const response = await request.get(`${baseUrl}${route}`);
    if (response.status() !== 200) errors.push(`${route} returned ${response.status()}`);
    if (!response.headers()["content-type"]?.includes(contentType)) {
      errors.push(`${route} returned unexpected content type ${response.headers()["content-type"]}`);
    }
    const body = await response.text();
    if (body.trim().length < 20) errors.push(`${route} returned an unexpectedly short body`);
  }

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });

    for (const route of pages) {
      const page = await context.newPage();
      const runtimeErrors = [];
      page.on("pageerror", (error) => runtimeErrors.push(error.message));
      page.on("console", (message) => {
        const content = message.text();
        const abortedPrefetch = content.includes("Failed to fetch RSC payload") && content.includes("Falling back to browser navigation");
        if (message.type() === "error" && !abortedPrefetch) runtimeErrors.push(content);
      });
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      if (response?.status() !== 200) errors.push(`${route} at ${viewport.width}px returned ${response?.status()}`);

      const state = await page.evaluate(() => ({
        bodyLength: document.body.innerText.trim().length,
        h1Count: document.querySelectorAll("h1").length,
        h1Visible: (() => {
          const heading = document.querySelector("h1");
          if (!heading) return false;
          const rect = heading.getBoundingClientRect();
          const style = window.getComputedStyle(heading);
          return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
        })(),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        errorOverlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")),
        directAnswerVisible: (() => {
          const answer = document.querySelector("[data-direct-answer]");
          if (!answer) return null;
          const rect = answer.getBoundingClientRect();
          const style = window.getComputedStyle(answer);
          return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
        })(),
      }));

      if (state.bodyLength < 100) errors.push(`${route} at ${viewport.width}px rendered too little content`);
      if (state.h1Count !== 1 || !state.h1Visible) errors.push(`${route} at ${viewport.width}px lacks one visible H1`);
      if (state.overflow > 1) errors.push(`${route} at ${viewport.width}px overflows by ${state.overflow}px`);
      if (state.errorOverlay) errors.push(`${route} at ${viewport.width}px rendered a framework error overlay`);
      if (route.startsWith("/guides/") && state.directAnswerVisible !== true) {
        errors.push(`${route} at ${viewport.width}px lacks a visible DirectAnswer`);
      }
      for (const error of runtimeErrors) errors.push(`${route} at ${viewport.width}px console: ${error}`);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

if (errors.length > 0) {
  console.error("HydroSense responsive answer-authority verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `HydroSense responsive answer-authority verification passed (${pages.length} pages × ${viewports.length} widths; ${resources.length} raw resources).`,
);
