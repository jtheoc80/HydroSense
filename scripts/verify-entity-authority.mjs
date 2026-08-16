import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const errors = [];
const read = (path) => readFileSync(resolve(root, path), "utf8").replace(/\r/g, "");
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const requiredFiles = [
  "lib/business/manufacturer-authorizations.ts",
  "lib/business/google-business-profile.ts",
  "app/about/page.tsx",
  "app/devices/page.tsx",
  "app/devices/[slug]/page.tsx",
  "docs/manufacturer-authority-ledger.md",
  "docs/sprint-3-owner-actions.md",
  "docs/google-business-profile-recommendation.md",
  "tests/e2e/entity-authority.spec.ts",
  "scripts/generate-llms-full.ts",
  "public/llms.txt",
  "public/llms-full.txt",
];

for (const file of requiredFiles) {
  check(existsSync(resolve(root, file)), `Missing entity-authority file: ${file}`);
}

const authoritySource = read("lib/business/manufacturer-authorizations.ts");
const transpiledAuthority = ts.transpileModule(authoritySource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const authority = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledAuthority).toString("base64")}`
);

const catalogSource = read("lib/service-catalog/catalog.ts");
const transpiledCatalog = ts.transpileModule(catalogSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const catalog = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledCatalog).toString("base64")}`
);

const records = authority.manufacturerAuthorizations;
check(Array.isArray(records), "manufacturerAuthorizations must be an array");
check(records.length === 2, "Only FloLogic and Phyn may be authorized in the current source");

for (const expected of [
  { manufacturer: "FloLogic", deviceSlug: "flologic", publicLabel: "Authorized by FloLogic" },
  { manufacturer: "Phyn", deviceSlug: "phyn-plus", publicLabel: "Authorized by Phyn" },
]) {
  const record = records.find((candidate) => candidate.deviceSlug === expected.deviceSlug);
  check(Boolean(record), `Missing ${expected.manufacturer} authorization`);
  if (!record) continue;
  check(record.manufacturer === expected.manufacturer, `${expected.deviceSlug} manufacturer drifted`);
  check(record.status === "authorized", `${expected.manufacturer} status must be authorized`);
  check(record.ownerVerified === true, `${expected.manufacturer} must be ownerVerified`);
  check(record.publicLabel === expected.publicLabel, `${expected.manufacturer} public label drifted`);
  check(record.exactProgramTitle === null, `${expected.manufacturer} exact program title is not documented`);
  check(record.verificationUrl === null, `${expected.manufacturer} has no public verification URL yet`);
}

for (const unsupportedSlug of ["moen-flo", "streamlabs", "guardian"]) {
  check(
    authority.getManufacturerAuthorization(unsupportedSlug) === undefined,
    `${unsupportedSlug} must remain supported-only, not authorized`,
  );
}
check(
  authority.manufacturerAuthorizationSummary ===
    "HydroSense Texas is authorized by FloLogic and Phyn.",
  "Combined authorization statement drifted",
);
check(
  authority.manufacturerAuthorizationShortLabel === "Authorized by FloLogic and Phyn.",
  "Short authorization label drifted",
);


const aboutSource = read("app/about/page.tsx");
check(
  aboutSource.includes("manufacturerAuthorizationSummary") &&
    aboutSource.includes("manufacturerAuthorizations.map") &&
    aboutSource.includes("Manufacturer authorization"),
  "/about must render authorization from the governed source",
);
for (const supportedName of ["Flo by Moen", "StreamLabs Control", "Guardian by Elexa"]) {
  check(
    !authoritySource.includes(`manufacturer: "${supportedName}"`),
    `${supportedName} entered the authorization source`,
  );
}
check(
  aboutSource.includes("Supported means HydroSense can evaluate and install compatible systems") &&
    aboutSource.includes("it does not represent manufacturer authorization"),
  "/about must distinguish supported systems from authorized manufacturers",
);
for (const fact of ["HydroSense Texas", "Lead Ledger Pro LLC", "Greater Houston, Texas", "(281) 694-5754", "MASTER_PLUMBER_LICENSE"]) {
  check(
    aboutSource.includes(fact),
    `/about is missing required business fact source: ${fact}`,
  );
}
check(
  aboutSource.includes('from "@/lib/service-catalog/catalog"') &&
    aboutSource.includes("Math.min(...installationAmounts)") &&
    aboutSource.includes("Math.max(...installationAmounts)"),
  "/about price range must derive from active installation catalog amounts",
);
check(
  aboutSource.includes('getInstallationService("1.50")') &&
    aboutSource.includes('getInstallationService("2.00")') &&
    aboutSource.includes("commercialGradeDeviceIncluded"),
  "/about FloLogic large-line facts must derive from governed catalog records",
);

for (const scopeFact of ["domestic household water line is the standard scope", "Fire-sprinkler", "fire-suppression piping are excluded", "Irrigation is optional", "final written proposal"]) {
  check(
    aboutSource.includes(scopeFact),
    `/about is missing required installation-scope source: ${scopeFact}`,
  );
}

const deviceDetailSource = read("app/devices/[slug]/page.tsx");
check(
  deviceDetailSource.includes("getManufacturerAuthorizationStatement") &&
    deviceDetailSource.includes("data-manufacturer-authorization"),
  "Device detail pages must render governed authorization wording",
);
const deviceHubSource = read("app/devices/page.tsx");
check(
  deviceHubSource.includes("getManufacturerAuthorization") &&
    deviceHubSource.includes("data-manufacturer-authorization-badge") &&
    deviceHubSource.includes("HydroSense Texas is authorized by this manufacturer."),
  "/devices must render accessible governed authorization badges",
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
const controlledTitles = new Set(
  records
    .map((record) => record.exactProgramTitle)
    .filter((value) => typeof value === "string"),
);
for (const claim of [
  "Authorized Dealer",
  "Certified Installer",
  "Preferred Installer",
  "Elite Partner",
  "Factory Certified",
  "Master Dealer",
]) {
  check(
    !new RegExp(claim, "i").test(productionSource) || controlledTitles.has(claim),
    `Unsupported manufacturer designation found in production source: ${claim}`,
  );
}

const schemaSource = read("components/Schema.tsx");
check(
  !schemaSource.includes("manufacturerAuthorizations"),
  "Manufacturer authorizations must not be added to sameAs or global schema",
);
check(
  schemaSource.includes("GOOGLE_BUSINESS_PROFILE_URL") && schemaSource.includes("FACEBOOK_URL"),
  "sameAs must remain limited to governed HydroSense profile URLs",
);
for (const relationship of ["memberOf", "brand", "parentOrganization", "affiliation"]) {
  check(!new RegExp(`(?:["']${relationship}["']|\\b${relationship})\\s*:`).test(schemaSource), `Fake schema relationship found: ${relationship}`);
}
const registrySource = read("lib/seo/indexable-pages.ts");
check(
  registrySource.includes('BUSINESS_ENTITY_ID = `${SITE_ORIGIN}/#business`') &&
    schemaSource.includes('"@id": BUSINESS_ENTITY_ID'),
  "Global business identity must remain https://hydrosensetx.com/#business",
);
for (const competingIdentity of ["#organization", "#company", "#plumber", "#hydrosense"]) {
  check(
    !productionSource.toLowerCase().includes(`https://hydrosensetx.com/${competingIdentity}`),
    `Competing business identity found: ${competingIdentity}`,
  );
}
check(!/AggregateRating/.test(productionSource), "Production source must not fabricate AggregateRating schema");
check(!/["']@type["']\s*:\s*["']Review["']/.test(productionSource), "Production source must not fabricate Review schema");
check(!/streetAddress\s*:/.test(productionSource), "Production source must not publish a street or residential address");
check(
  !/flologic\.com|phyn\.com|moen\.com|streamlabswater\.com|elexa/i.test(schemaSource),
  "Manufacturer websites must not enter HydroSense sameAs or global entity schema",
);


const ledger = read("docs/manufacturer-authority-ledger.md");
for (const manufacturer of ["FloLogic", "Phyn"]) {
  check(
    new RegExp(`\\| ${manufacturer} \\| Tier 1 \\| AUTHORIZED — OWNER VERIFIED \\| NOT PUBLICLY CORROBORATED`).test(ledger),
    `${manufacturer} ledger status is incomplete`,
  );
}

const ownerActions = read("docs/sprint-3-owner-actions.md");
for (const manufacturer of ["FLOLOGIC", "PHYN"]) {
  check(ownerActions.includes(`## ${manufacturer}`), `${manufacturer} owner-action section is missing`);
}
for (const line of [
  "Authorization confirmed — YES",
  "Exact manufacturer program title — OWNER PROVIDE IF AVAILABLE",
  "Public manufacturer listing/profile URL — OWNER PROVIDE IF AVAILABLE",
]) {
  check((ownerActions.match(new RegExp(line, "g")) ?? []).length === 2, `Owner-action output must contain twice: ${line}`);
}
check(!/apply for authorization/i.test(ownerActions), "Owner actions must not request an authorization application");

const gbpSource = read("lib/business/google-business-profile.ts");
const gbpRecommendation = read("docs/google-business-profile-recommendation.md");
check(
  gbpSource.includes("GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT = 750") &&
    gbpSource.includes("manufacturerAuthorizationSummary"),
  "GBP recommendation must use the current 750-character limit and governed authority copy",
);
check(
  gbpRecommendation.includes("https://support.google.com/business/answer/3039617") &&
    gbpRecommendation.includes(authority.manufacturerAuthorizationSummary),
  "GBP recommendation must cite current official guidance and include the governed statement",
);
for (const value of ["HydroSense Texas", "https://hydrosensetx.com", "(281) 694-5754", "Greater Houston"]) {
  check(
    gbpRecommendation.includes(`| ${value} | OWNER VERIFY |`),
    `GBP profile field is missing or not marked OWNER VERIFY: ${value}`,
  );
}
check(
  (gbpRecommendation.match(/OWNER VERIFY/g) ?? []).length >= 8,
  "GBP owner-only profile fields must be clearly marked OWNER VERIFY",
);
for (const service of catalog.activeServices) {
  const price = service.price.type === "fixed"
    ? catalog.formatUsd(service.price.amount)
    : "Quote required";
  check(
    gbpRecommendation.includes(`| ${service.name} | ${price} |`),
    `GBP custom-service parity drifted: ${service.name}`,
  );
}
check(
  gbpRecommendation.includes("Do not append a price to a custom service name") &&
    gbpRecommendation.includes("no category is fabricated") &&
    gbpRecommendation.includes("Do not publish a residential or unverified storefront address"),
  "GBP recommendation must preserve service-name, category, and address guardrails",
);


const e2eSource = read("tests/e2e/entity-authority.spec.ts");
for (const route of ["/about", "/devices/flologic", "/devices/phyn-plus"]) {
  check(e2eSource.includes(`route: "${route}"`), `Raw-HTML authority test is missing ${route}`);
}

const llmsGeneratorSource = read("scripts/generate-llms-full.ts");
check(
  llmsGeneratorSource.includes("manufacturerAuthorizationSummary") &&
    llmsGeneratorSource.includes("getManufacturerAuthorizationStatement"),
  "Full LLM content must derive authority copy from the governed source",
);
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const source = read(file);
  check(source.includes("https://hydrosensetx.com/about"), `${file} is missing the canonical About URL`);
  check(source.includes(authority.manufacturerAuthorizationSummary), `${file} is missing the governed authorization statement`);
  check(source.includes("FloLogic") && source.includes("Phyn"), `${file} is missing authorized manufacturer names`);
}

if (errors.length > 0) {
  console.error("HydroSense entity-authority verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `HydroSense entity-authority verification passed (${records.length} owner-verified manufacturer authorizations).`,
);
