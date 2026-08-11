import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/devices/page.tsx",
  "app/devices/[slug]/page.tsx",
  "app/service-area/page.tsx",
  "app/service-area/[city]/page.tsx",
  "app/sitemap.ts",
  "components/Hero.tsx",
  "components/Pricing.tsx",
  "components/LeadForm.tsx",
  "components/Schema.tsx",
  "components/TrackedPhoneLink.tsx",
  "lib/devices.ts",
  "lib/home-faqs.ts",
  "next.config.mjs",
  "public/robots.txt",
];

const commercialFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/devices/page.tsx",
  "app/devices/[slug]/page.tsx",
  "app/service-area/page.tsx",
  "app/service-area/[city]/page.tsx",
  "components/CriticalBar.tsx",
  "components/CustomerJourney.tsx",
  "components/FAQ.tsx",
  "components/Footer.tsx",
  "components/Header.tsx",
  "components/Hero.tsx",
  "components/LeadForm.tsx",
  "components/Pricing.tsx",
  "components/Schema.tsx",
  "components/ServiceArea.tsx",
  "lib/devices.ts",
  "lib/home-faqs.ts",
];

const prohibitedPatterns = [
  /insurance is bleeding/i,
  /most homeowners qualify/i,
  /\$300\s*(?:to|[-–])\s*\$600/i,
  /5\s*(?:to|[-–])\s*15%/i,
  /carrier[- ]recognized/i,
  /recognized by every major/i,
  /certificate is the product/i,
  /discount applies (?:the moment|at your next renewal)/i,
  /24\/7 leak monitoring/i,
  /same-day emergency response/i,
  /warranty extension/i,
];

const errors = [];

for (const relativePath of requiredFiles) {
  if (!existsSync(resolve(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

for (const relativePath of commercialFiles) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) continue;
  const source = readFileSync(absolutePath, "utf8");

  for (const pattern of prohibitedPatterns) {
    if (pattern.test(source)) {
      errors.push(`${relativePath} contains prohibited credibility copy: ${pattern}`);
    }
  }
}

const robotsPath = resolve(root, "public/robots.txt");
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, "utf8");
  if (!robots.includes("Sitemap: https://hydrosensetx.com/sitemap.xml")) {
    errors.push("robots.txt must declare the XML sitemap");
  }
  if (/Sitemap:\s*https:\/\/hydrosensetx\.com\/llms\.txt/i.test(robots)) {
    errors.push("robots.txt must not declare llms.txt as a sitemap");
  }
}

const sitemapPath = resolve(root, "app/sitemap.ts");
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  if (/lastModified:\s*new Date\s*\(/.test(sitemap)) {
    errors.push("sitemap.ts must not mark every URL modified at build time");
  }

  const temporarilyNoindexed = [
    "/insurance/ho-a-vs-ho-b-ho-3",
    "/freeze-damage-texas",
    "/blog/best-home-investment-texas-tight-budget",
    "/blog/houston-home-insurance-rising-smart-shutoff",
  ];

  for (const url of temporarilyNoindexed) {
    if (sitemap.includes(`\"${url}\"`)) {
      errors.push(`sitemap.ts must not include temporarily noindexed URL: ${url}`);
    }
  }
}

const nextConfigPath = resolve(root, "next.config.mjs");
if (existsSync(nextConfigPath)) {
  const nextConfig = readFileSync(nextConfigPath, "utf8");
  if (!nextConfig.includes('key: "X-Robots-Tag"')) {
    errors.push("next.config.mjs must apply X-Robots-Tag to legacy audit pages");
  }
  if (!nextConfig.includes("https://hydrosensetx.com/:path*")) {
    errors.push("next.config.mjs must canonicalize alternate domains with redirects");
  }
}

if (errors.length > 0) {
  console.error("HydroSense credibility sprint verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("HydroSense credibility sprint verification passed.");
