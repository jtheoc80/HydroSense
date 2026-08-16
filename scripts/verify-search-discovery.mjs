import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const errors = [];
const read = (path) => readFileSync(resolve(root, path), "utf8").replace(/\r/g, "");
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const registryPath = "lib/seo/indexable-pages.ts";
check(existsSync(resolve(root, registryPath)), `Missing ${registryPath}`);

const registrySource = read(registryPath);
const transpiledRegistry = ts.transpileModule(registrySource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const registry = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledRegistry).toString("base64")}`
);

const {
  SITE_ORIGIN,
  BUSINESS_ENTITY_ID,
  indexablePages,
  protectedNoindexPaths,
  getIndexablePages,
  getSitemapEntries,
  getIndexNowUrls,
} = registry;

check(SITE_ORIGIN === "https://hydrosensetx.com", "Registry host must be https://hydrosensetx.com");
check(
  BUSINESS_ENTITY_ID === "https://hydrosensetx.com/#business",
  "Global business identity must remain https://hydrosensetx.com/#business",
);
check(protectedNoindexPaths.length === 9, "Expected exactly nine protected legacy noindex URLs");

const pages = getIndexablePages();
const paths = pages.map((page) => page.path);
const titles = pages.map((page) => page.title.toLowerCase());
check(paths.length === new Set(paths).size, "Registry contains duplicate canonical paths");
check(titles.length === new Set(titles).size, "Registry contains duplicate page titles/topics");
check(paths.includes("/pricing"), "Registry must include /pricing");
check(paths.includes("/agent-ready"), "Registry must include /agent-ready");

const forbiddenPath = /^\/(?:api|admin|e2e|quote|site-visit)(?:\/|$)|\.(?:json|xml)$/;
for (const page of pages) {
  check(page.path.startsWith("/"), `Registry path must be root-relative: ${page.path}`);
  check(!forbiddenPath.test(page.path), `Non-indexable route entered registry: ${page.path}`);
  check(!page.path.includes("?") && !page.path.includes("#"), `Registry path must not contain query or fragment: ${page.path}`);
  check(!protectedNoindexPaths.includes(page.path), `Protected noindex URL entered registry: ${page.path}`);
  if (page.lastModified) {
    check(
      /^\d{4}-\d{2}-\d{2}$/.test(page.lastModified),
      `lastModified must be a known YYYY-MM-DD date: ${page.path}`,
    );
  }
}

const sitemapSource = read("app/sitemap.ts");
const indexNowSource = read("scripts/indexnow-seed.ts");
check(
  sitemapSource.includes('from "@/lib/seo/indexable-pages"') &&
    sitemapSource.includes("getSitemapEntries()"),
  "sitemap.ts must consume getSitemapEntries from the canonical registry",
);
check(
  !/\b(?:cityKeys|deviceSlugs|staticPaths)\b/.test(sitemapSource),
  "sitemap.ts must not maintain a second route list",
);
check(
  !/(?:new Date\s*\(|Date\.now\s*\()/m.test(sitemapSource + registrySource),
  "Sitemap lastModified values must not be generated at build or request time",
);
check(
  indexNowSource.includes('from "../lib/seo/indexable-pages"') &&
    indexNowSource.includes("getIndexNowUrls()"),
  "IndexNow seeding must consume getIndexNowUrls from the canonical registry",
);
check(
  !/https:\/\/hydrosensetx\.com\/(?:insurance|freeze-damage|blog\/)/.test(indexNowSource),
  "IndexNow seeder still contains a hard-coded editorial URL list",
);

const sitemapEntries = getSitemapEntries();
const sitemapPaths = sitemapEntries.map((entry) => new URL(entry.url).pathname);
check(
  JSON.stringify(sitemapPaths) === JSON.stringify(paths),
  "Sitemap projection drifted from the indexable registry",
);
for (const entry of sitemapEntries) {
  const parsed = new URL(entry.url);
  check(parsed.origin === SITE_ORIGIN, `Sitemap URL uses the wrong host: ${entry.url}`);
  check(!protectedNoindexPaths.includes(parsed.pathname), `Sitemap contains protected noindex URL: ${parsed.pathname}`);
}

const indexNowUrls = getIndexNowUrls();
const expectedIndexNowPaths = indexablePages
  .filter((page) => page.indexable && page.indexNowEligible)
  .map((page) => page.path);
const actualIndexNowPaths = indexNowUrls.map((url) => new URL(url).pathname);
check(
  JSON.stringify(actualIndexNowPaths) === JSON.stringify(expectedIndexNowPaths),
  "IndexNow projection drifted from registry eligibility",
);
for (const url of indexNowUrls) {
  const parsed = new URL(url);
  check(parsed.origin === SITE_ORIGIN, `IndexNow URL uses the wrong host: ${url}`);
  check(!protectedNoindexPaths.includes(parsed.pathname), `IndexNow contains protected noindex URL: ${parsed.pathname}`);
}

const nextConfig = read("next.config.mjs");
for (const protectedPath of protectedNoindexPaths) {
  check(nextConfig.includes(`"${protectedPath}"`), `Protected noindex URL missing from next.config.mjs: ${protectedPath}`);
}
const pathOnlyRedirectBlocks = [
  ...nextConfig.matchAll(/\{\s*source:\s*"([^"]+)"([\s\S]*?)destination:\s*"([^"]+)"[\s\S]*?\}/g),
].filter((match) => !/\bhas\s*:/.test(match[2]));
for (const [, source] of pathOnlyRedirectBlocks) {
  check(!paths.includes(source), `Redirect source entered canonical registry: ${source}`);
}

const dynamicCanonicalSignals = {
  "device-detail": {
    file: "app/devices/[slug]/page.tsx",
    signal: "https://hydrosensetx.com/devices/\${device.slug}",
  },
  "city-service": {
    file: "app/service-area/[city]/page.tsx",
    signal: "https://hydrosensetx.com/service-area/\${city.slug}",
  },
  "commercial-guide": {
    file: "app/guides/[slug]/page.tsx",
    signal: "absoluteSearchUrl(guide.href)",
  },
};
for (const page of pages) {
  const dynamic = dynamicCanonicalSignals[page.pageType];
  if (dynamic) {
    const source = read(dynamic.file);
    check(source.includes("canonical:"), `${dynamic.file} is missing a canonical declaration`);
    check(source.includes(dynamic.signal), `${dynamic.file} canonical does not match registry routes`);
    continue;
  }

  const pageFile = page.path === "/" ? "app/page.tsx" : `app${page.path}/page.tsx`;
  check(existsSync(resolve(root, pageFile)), `Registry route has no page file: ${page.path}`);
  if (!existsSync(resolve(root, pageFile))) continue;
  const source = read(pageFile);
  const canonical = new URL(page.path, `${SITE_ORIGIN}/`).toString();
  check(source.includes("canonical:"), `${pageFile} is missing a self-canonical`);
  check(source.includes(canonical), `${pageFile} canonical does not match ${canonical}`);
}

const deviceSource = read("lib/devices.ts");
const deviceSlugs = [...deviceSource.matchAll(/^\s{2}"?([a-z][a-z-]+)"?:\s*\{/gm)]
  .map((match) => match[1])
  .filter((slug) => ["moen-flo", "phyn-plus", "streamlabs", "guardian", "flologic"].includes(slug));
const registryDeviceSlugs = paths
  .filter((path) => path.startsWith("/devices/"))
  .map((path) => path.split("/").at(-1));
check(
  JSON.stringify([...deviceSlugs].sort()) === JSON.stringify([...registryDeviceSlugs].sort()),
  "Device detail routes drifted from the discovery registry",
);

const citySource = read("lib/cities.ts");
const cityKeys = [...citySource.matchAll(/^\s{2}(?:"([^"]+)"|([a-z][a-z-]*)):\s*\{/gm)].map(
  (match) => match[1] ?? match[2],
);
const registryCityKeys = paths
  .filter((path) => path.startsWith("/service-area/"))
  .map((path) => path.split("/").at(-1));
check(
  JSON.stringify([...cityKeys].sort()) === JSON.stringify([...registryCityKeys].sort()),
  "City routes drifted from the discovery registry",
);

const protectedBlogPaths = protectedNoindexPaths.filter((path) => path.startsWith("/blog/"));
const approvedBlogPaths = readdirSync(resolve(root, "app/blog"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(root, "app/blog", entry.name, "page.tsx")))
  .map((entry) => `/blog/${entry.name}`)
  .filter((path) => !protectedBlogPaths.includes(path))
  .sort();
const registryBlogPaths = paths.filter((path) => path.startsWith("/blog/")).sort();
check(
  JSON.stringify(approvedBlogPaths) === JSON.stringify(registryBlogPaths),
  "Approved/indexable blog routes drifted from the discovery registry",
);

const schemaSource = read("components/Schema.tsx");
for (const fact of [
  '["LocalBusiness", "Plumber"]',
  'name: "HydroSense Texas"',
  'legalName: "Lead Ledger Pro LLC"',
  'telephone: "+1-281-694-5754"',
  'name: "Greater Houston, Texas"',
  "BUSINESS_ENTITY_ID",
]) {
  check(schemaSource.includes(fact), `Global business schema is missing required fact: ${fact}`);
}
check(!/streetAddress/.test(schemaSource), "Global business schema must not publish a street address");
check(
  !schemaSource.includes("hasCredential"),
  "Global business schema must not claim the unverified RMP/company relationship",
);
check(!/insurance|premium|discount/i.test(schemaSource), "Insurance claims must not define the core business entity");
check(
  schemaSource.includes('import { deviceList } from "@/lib/devices"') &&
    schemaSource.includes("buildGlobalServiceDescription()"),
  "Global Service schema must derive supported device names from deviceList",
);

function sourceFiles(directory) {
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const relative = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(relative);
    return /\.(?:ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [relative] : [];
  });
}
const productionSource = [...sourceFiles("app"), ...sourceFiles("components"), ...sourceFiles("lib")]
  .map((file) => read(file))
  .join("\n");
check(
  !/https:\/\/hydrosensetx\.com\/#(?:organization|company|local-business)/i.test(productionSource),
  "A competing global organization identifier remains in production source",
);
const pricingSchema = read("lib/service-catalog/schema.ts");
check(
  pricingSchema.includes('provider: {\n      "@id": "https://hydrosensetx.com/#business"'),
  "Pricing JSON-LD must reference the global #business entity",
);

for (const pageFile of [
  "app/pricing/page.tsx",
  "app/devices/[slug]/page.tsx",
  "app/service-area/[city]/page.tsx",
  "app/agent-ready/page.tsx",
]) {
  const source = read(pageFile);
  check(source.includes("<Breadcrumbs"), `${pageFile} must render a visible breadcrumb from shared items`);
}
const breadcrumbSource = read("components/Breadcrumbs.tsx");
check(
  breadcrumbSource.includes('"@type": "BreadcrumbList"') &&
    breadcrumbSource.includes('<nav aria-label="Breadcrumb"') &&
    breadcrumbSource.includes("items.map"),
  "Breadcrumb component must generate visible navigation and BreadcrumbList from the same items",
);

const homeMetadata = read("app/page.tsx");
const homeHero = read("components/Hero.tsx");
const homeH1 = homeHero.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? "";
check(/Smart Water Shutoff Installation Houston/.test(homeMetadata), "Homepage title must lead with smart water shutoff installation in Houston");
check(/Smart water shutoff installation/i.test(homeH1), "Homepage H1 must teach the primary installation intent");
check(!/insurance/i.test(homeH1), "Homepage H1 must not be insurance-first");

const homepagePricing = read("components/Pricing.tsx");
check(
  homepagePricing.includes("View current starting prices by incoming line size on the pricing page.") &&
    homepagePricing.includes('href="/pricing"') &&
    homepagePricing.includes("installationServices") &&
    !homepagePricing.includes("formatUsd") &&
    !homepagePricing.includes("standardPriceRange"),
  "Homepage must link to starting prices without displaying catalog amounts",
);

const homepageFaqs = read("lib/home-faqs.ts");
check(
  !/\$\d/.test(homepageFaqs),
  "Homepage FAQ content must direct visitors to pricing without displaying HydroSense amounts",
);
const retiredPriceTokens = ["2638", "3425", "$2,638", "$3,425"];
for (const file of [
  "lib/service-catalog/catalog.ts",
  "lib/service-catalog/openapi.ts",
  "app/pricing/page.tsx",
  "components/Pricing.tsx",
  "public/llms-full.txt",
  "public/llms.txt",
]) {
  const source = read(file);
  check(
    !retiredPriceTokens.some((token) => source.includes(token)),
    `${file} must not contain retired 1.5-inch or 2-inch HydroSense pricing`,
  );
}
check(read("components/Header.tsx").includes('href: "/devices"'), "Homepage navigation must link directly to /devices");
for (const city of ["houston", "katy", "cypress", "the-woodlands"]) {
  check(read("components/ServiceArea.tsx").includes(city), `Homepage must link to the major city page: ${city}`);
}

const deviceDetail = read("app/devices/[slug]/page.tsx");
for (const href of ['href="/pricing"', 'href="#lead-form"', 'href="/service-area"']) {
  check(deviceDetail.includes(href), `Device details are missing required internal link: ${href}`);
}
const cityPage = read("app/service-area/[city]/page.tsx");
for (const href of ['href="/pricing"', 'href="/devices"', 'href="#lead-form"']) {
  check(cityPage.includes(href), `City pages are missing required internal link: ${href}`);
}
const pricingPage = read("app/pricing/page.tsx");
check(
  pricingPage.includes("Starting at") &&
    pricingPage.includes("Amounts shown are starting prices.") &&
    !pricingPage.includes("{service.id}</p>"),
  "Pricing page must label installation amounts as starting prices without visible service part numbers",
);
for (const href of ['href="/#customer-journey"', 'href="/devices"', 'href="/service-area"']) {
  check(pricingPage.includes(href), `Pricing page is missing required internal link: ${href}`);
}

const robots = read("public/robots.txt");
const sitemapDeclarations = robots.match(/^Sitemap:\s*\S+$/gm) ?? [];
check(
  sitemapDeclarations.length === 1 &&
    sitemapDeclarations[0] === "Sitemap: https://hydrosensetx.com/sitemap.xml",
  "robots.txt must expose only the real HydroSense XML sitemap",
);

if (errors.length > 0) {
  console.error("HydroSense search discovery verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `HydroSense search discovery verification passed (${sitemapEntries.length} sitemap URLs, ${indexNowUrls.length} IndexNow URLs, ${protectedNoindexPaths.length} protected noindex URLs).`,
);
