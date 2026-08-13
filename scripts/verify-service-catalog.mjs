import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];
const catalogPath = resolve(root, "lib/service-catalog/catalog.ts");
const catalog = existsSync(catalogPath) ? readFileSync(catalogPath, "utf8") : "";

const exactPrices = {
  "HS-INSTALL-075-001": 999,
  "HS-INSTALL-100-001": 1450,
  "HS-INSTALL-125-001": 1875,
  "HS-INSTALL-150-001": 2638,
  "HS-INSTALL-200-001": 3425,
  "HS-SENSOR-ADD-001": 75,
  "HS-BATTERY-ADD-001": 475,
  "HS-CARE-ANNUAL-001": 99,
  "HS-SITE-ASSESS-001": 0,
};

if (!catalog) errors.push("Missing lib/service-catalog/catalog.ts");

const ids = [...catalog.matchAll(/\bid:\s*"(HS-[A-Z0-9-]+)"/g)].map((match) => match[1]);
if (ids.length !== 11) errors.push(`Expected 11 service IDs, found ${ids.length}`);
if (new Set(ids).size !== ids.length) errors.push("Duplicate service ID found");

for (const [serviceId, price] of Object.entries(exactPrices)) {
  const recordPattern = new RegExp(
    `id:\\s*"${serviceId}"[\\s\\S]{0,900}?price:\\s*\\{\\s*type:\\s*"fixed",\\s*amount:\\s*${price}(?:,|\\s)`,
  );
  if (!recordPattern.test(catalog)) errors.push(`${serviceId} must have exact price ${price}`);
}

for (const serviceId of ["HS-IRRIGATION-ADD-001", "HS-CORRECTIVE-001"]) {
  const pattern = new RegExp(
    `id:\\s*"${serviceId}"[\\s\\S]{0,900}?price:\\s*\\{\\s*type:\\s*"quote_required"\\s*\\}`,
  );
  if (!pattern.test(catalog)) errors.push(`${serviceId} must remain quote required`);
}

for (const serviceId of Object.keys(exactPrices).filter((id) => id.startsWith("HS-INSTALL"))) {
  const record = catalog.match(new RegExp(`id:\\s*"${serviceId}"([\\s\\S]{0,900}?)\\n\\s*\\},`))?.[1] ?? "";
  if (!/deviceIncluded:\s*true/.test(record)) errors.push(`${serviceId} must include a device`);
}

const twoInch = catalog.match(/id:\s*"HS-INSTALL-200-001"([\s\S]{0,900}?)\n\s*\},/)?.[1] ?? "";
if (!/commercialGradeDeviceIncluded:\s*true/.test(twoInch)) {
  errors.push("2-inch installation must include a commercial-grade device");
}
if (!/Fire-sprinkler and fire-suppression piping are always excluded/.test(catalog)) {
  errors.push("Catalog must preserve the fire-system exclusion");
}
if (!/catalogVersion:\s*CATALOG_VERSION/.test(catalog) || !/2026-08-12\.1/.test(catalog)) {
  errors.push("Catalog version must be the stable 2026-08-12.1 value");
}
if (/catalogVersion[\s\S]{0,120}(?:new Date|Date\.now)/.test(catalog)) {
  errors.push("Catalog version must not be generated at request time");
}

const requiredFiles = [
  "app/pricing/page.tsx",
  "app/agent-ready/page.tsx",
  "app/service-catalog.json/route.ts",
  "app/openapi.json/route.ts",
  "app/.well-known/agent-card.json/route.ts",
  "app/api/public/v1/services/route.ts",
  "app/api/public/v1/services/[serviceId]/route.ts",
  "app/api/public/v1/serviceability/route.ts",
  "app/api/public/v1/estimate/route.ts",
  "app/api/a2a/route.ts",
];
for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing public surface: ${file}`);
}

for (const [file, signal] of [
  ["components/Pricing.tsx", "service-catalog/catalog"],
  ["app/pricing/page.tsx", "service-catalog/catalog"],
  ["lib/service-catalog/schema.ts", 'from "./catalog"'],
]) {
  const source = existsSync(resolve(root, file)) ? readFileSync(resolve(root, file), "utf8") : "";
  if (!source.includes(signal)) errors.push(`${file} must import the runtime catalog`);
}

const a2aFiles = [
  "lib/service-catalog/a2a.ts",
  "app/api/a2a/route.ts",
  "lib/service-catalog/openapi.ts",
];
for (const file of a2aFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (/\bkind\s*:/.test(source)) errors.push(`${file} contains a legacy A2A Part discriminator`);
}

const agentSource = readFileSync(resolve(root, "lib/service-catalog/a2a.ts"), "utf8");
if (/\bid:\s*"(?:schedule|booking|payment|accept_quote)/i.test(agentSource)) {
  errors.push("Agent Card exposes a transactional public skill");
}
for (const skill of ["get_service_catalog", "check_serviceability", "estimate_standard_installation"]) {
  if (!agentSource.includes(skill)) errors.push(`Agent is missing read-only skill ${skill}`);
}

if (errors.length) {
  console.error("HydroSense service catalog verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("HydroSense service catalog verification passed (11 services, 9 fixed prices, 2 quote-required records).");
