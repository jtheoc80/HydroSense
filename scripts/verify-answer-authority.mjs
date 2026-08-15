import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const errors = [];
const read = (path) => readFileSync(resolve(root, path), "utf8").replace(/\r/g, "");
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const guideRoutes = [
  "/guides/smart-water-shutoff-installation-cost-houston",
  "/guides/what-size-smart-water-shutoff-do-i-need",
  "/guides/flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic",
  "/guides/do-i-need-a-plumber-for-smart-water-shutoff",
  "/guides/smart-water-shutoff-power-wifi-outage",
];
const allAuthorityRoutes = ["/guides", ...guideRoutes];

for (const file of [
  "lib/guides/commercial-guides.ts",
  "app/guides/page.tsx",
  "app/guides/[slug]/page.tsx",
  "components/DirectAnswer.tsx",
]) {
  check(existsSync(resolve(root, file)), `Missing answer-authority file: ${file}`);
}

const registrySource = read("lib/seo/indexable-pages.ts");
const transpiledRegistry = ts.transpileModule(registrySource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const registry = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledRegistry).toString("base64")}`
);
const pages = registry.getIndexablePages();
const indexNowPaths = registry.getIndexNowUrls().map((url) => new URL(url).pathname);

for (const route of allAuthorityRoutes) {
  const page = pages.find((candidate) => candidate.path === route);
  check(Boolean(page), `Answer-authority route missing from registry: ${route}`);
  check(indexNowPaths.includes(route), `Answer-authority route missing from IndexNow projection: ${route}`);
  check(!registry.protectedNoindexPaths.includes(route), `Answer-authority route entered protected noindex set: ${route}`);
}
check(registry.protectedNoindexPaths.length === 9, "Protected legacy noindex set must remain at nine URLs");

const guideSource = read("lib/guides/commercial-guides.ts");
const templateSource = read("app/guides/[slug]/page.tsx");
const hubSource = read("app/guides/page.tsx");
const directAnswerSource = read("components/DirectAnswer.tsx");

for (const route of guideRoutes) {
  check(guideSource.includes(`href: "${route}"`), `Typed guide source is missing ${route}`);
}
const metadataTitles = [...guideSource.matchAll(/\n\s+metaTitle:\s+"([^"]+)"/g)].map((match) => match[1]);
const guideH1s = [...guideSource.matchAll(/\n\s+h1:\s+"([^"]+)"/g)].map((match) => match[1]);
const guideQuestions = [...guideSource.matchAll(/\n\s+directQuestion:\s+"([^"]+)"/g)].map((match) => match[1]);
for (const [name, values] of [
  ["metadata title", metadataTitles],
  ["H1", guideH1s],
  ["direct question", guideQuestions],
]) {
  check(values.length === 5, `Expected five commercial guide ${name}s`);
  check(new Set(values.map((value) => value.toLowerCase())).size === 5, `Commercial guide ${name}s must be unique`);
}

check(
  hubSource.includes("Smart Water Shutoff Buying Guides | HydroSense Texas") &&
    hubSource.includes("https://hydrosensetx.com/guides"),
  "Guide hub metadata title or self-canonical drifted",
);
check((hubSource.match(/<h1\b/g) ?? []).length === 1, "Guide hub must contain exactly one H1");
check((templateSource.match(/<h1\b/g) ?? []).length === 1, "Shared commercial guide template must contain exactly one H1");
check(
  templateSource.includes("absoluteSearchUrl(guide.href)") && templateSource.includes("canonical: canonical"),
  "Commercial guide template must generate a self-canonical from the typed guide href",
);
check(
  templateSource.includes("<DirectAnswer") &&
    directAnswerSource.includes("data-direct-answer") &&
    directAnswerSource.includes("data-direct-answer-text"),
  "Commercial guides must render visible server-side DirectAnswer markup",
);
check(
  templateSource.indexOf("<DirectAnswer") < templateSource.indexOf("<GuideEvidenceTable"),
  "DirectAnswer must appear high on the page before the evidence table",
);
check(!/FAQPage|Article"/.test(templateSource), "Commercial guides must not emit unsupported FAQPage or Article JSON-LD");

check(
  guideSource.includes("installationServices") &&
    guideSource.includes("serviceCatalog") &&
    guideSource.includes("deviceList") &&
    guideSource.includes("requiredFact"),
  "Commercial guide facts must derive from the governed catalog and device data",
);
check(!/best[ -]?overall/i.test(guideSource), "Comparison guide must not use best-overall ranking language");
check(
  guideSource.includes("HydroSense designated family for qualifying 1 1/2-inch and 2-inch domestic mains") &&
    guideSource.includes("2-inch scope is commercial grade"),
  "Large-line guide mapping must preserve FloLogic and commercial-grade rules",
);
check(
  guideSource.includes("installationScopeDisclosure") &&
    /fire-sprinkler and fire-suppression piping/i.test(guideSource) &&
    /Irrigation is a separate quote-required catalog scope/i.test(guideSource),
  "Guide content must preserve domestic, irrigation, and fire-piping scope boundaries",
);

const schemaSource = read("components/Schema.tsx");
check(
  schemaSource.includes('import { deviceList } from "@/lib/devices"') &&
    schemaSource.includes("getSupportedDeviceNames") &&
    schemaSource.includes("buildGlobalServiceDescription"),
  "Global Service schema must derive its supported-device list from deviceList",
);

const internalLinks = [
  ["components/Header.tsx", ['href: "/guides"']],
  ["app/pricing/page.tsx", [guideRoutes[0], guideRoutes[1]]],
  ["app/devices/page.tsx", [guideRoutes[1], guideRoutes[2], guideRoutes[4]]],
  ["app/devices/[slug]/page.tsx", [guideRoutes[1], guideRoutes[2], guideRoutes[4]]],
  ["app/service-area/[city]/page.tsx", [guideRoutes[0]]],
];
for (const [file, hrefs] of internalLinks) {
  const source = read(file);
  for (const href of hrefs) check(source.includes(href), `${file} is missing internal guide link ${href}`);
}
check(templateSource.includes('href="/#lead-form"'), "Commercial guides must retain the assessment CTA");

for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const source = read(file);
  for (const route of allAuthorityRoutes) {
    check(source.includes(`https://hydrosensetx.com${route}`), `${file} is missing ${route}`);
  }
  check(!/2638|3425|2,638|3,425/.test(source), `${file} contains retired HydroSense pricing`);
}
const fullLlm = read("public/llms-full.txt");
for (const fact of [
  "$999 to $4,175",
  "1 1/2-inch and 2-inch domestic water-line installations",
  "Fire-sprinkler and fire-suppression piping remain excluded",
  "Irrigation",
  "MPL 43057",
]) {
  check(fullLlm.includes(fact), `llms-full.txt is missing governed answer fact: ${fact}`);
}

if (errors.length > 0) {
  console.error("HydroSense answer-authority verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `HydroSense answer-authority verification passed (${allAuthorityRoutes.length} authority routes, ${pages.length} sitemap URLs, ${indexNowPaths.length} IndexNow URLs).`,
);
