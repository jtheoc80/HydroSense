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
  "lib/business/plumbing-license.ts",
  "lib/business/google-business-profile.ts",
  "app/about/page.tsx",
  "app/devices/page.tsx",
  "app/devices/[slug]/page.tsx",
  "components/Schema.tsx",
  "docs/manufacturer-authority-ledger.md",
  "docs/sprint-3-owner-actions.md",
  "docs/google-business-profile-recommendation.md",
  "docs/estimates-invoices-plumbing-compliance-follow-up.md",
  "tests/e2e/entity-authority.spec.ts",
  "scripts/generate-llms-full.ts",
  "public/llms.txt",
  "public/llms-full.txt",
];

for (const file of requiredFiles) {
  check(existsSync(resolve(root, file)), `Missing entity-authority file: ${file}`);
}

async function loadTypescriptModule(path) {
  const source = read(path);
  const transpiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return import(
    `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`
  );
}

const authority = await loadTypescriptModule(
  "lib/business/manufacturer-authorizations.ts",
);
const license = await loadTypescriptModule("lib/business/plumbing-license.ts");
const catalog = await loadTypescriptModule("lib/service-catalog/catalog.ts");

const records = authority.manufacturerAuthorities;
check(Array.isArray(records), "manufacturerAuthorities must be an array");
check(records.length === 2, "Only FloLogic and Phyn may have governed authority records");

const floLogic = records.find((record) => record.deviceSlug === "flologic");
check(floLogic?.manufacturer === "FloLogic", "FloLogic authority record is missing");
check(floLogic?.relationshipType === "authorization", "FloLogic relationship must remain authorization");
check(floLogic?.programStatus === "owner_verified_authorization", "FloLogic program status drifted");
check(floLogic?.publicLabel === "Authorized by FloLogic", "FloLogic public label drifted");
check(floLogic?.ownerVerified === true, "FloLogic must remain owner verified");
check(floLogic?.publiclyCorroborated === false, "FloLogic must not be publicly corroborated yet");
check(floLogic?.exactProgramTitle === null, "FloLogic exact program title is not confirmed");
check(floLogic?.verificationUrl === null, "FloLogic public verification URL is not confirmed");

const phyn = records.find((record) => record.deviceSlug === "phyn-plus");
check(phyn?.manufacturer === "Phyn", "Phyn authority record is missing");
check(phyn?.relationshipType === "program_participation", "Phyn must be program participation");
check(phyn?.programStatus === "phyn_pro", "Phyn programStatus must be phyn_pro");
check(phyn?.publicLabel === "Phyn Pro", "Phyn short label must be Phyn Pro");
check(
  phyn?.publicStatement ===
    "HydroSense Texas is listed in Phyn's Find a Phyn Pro Directory.",
  "Phyn public statement drifted",
);
check(phyn?.exactProgramTitle === "Phyn Pro Program", "Phyn exact program title drifted");
check(
  phyn?.verificationUrl === "https://phyn.com/pages/find-a-phyn-pro",
  "Phyn corroboration URL drifted",
);
check(phyn?.publiclyCorroborated === true, "Phyn must be publicly corroborated");
check(phyn?.ownerVerified === true, "Phyn must remain owner verified");

for (const unsupportedSlug of ["moen-flo", "streamlabs", "guardian"]) {
  check(
    authority.getManufacturerAuthority(unsupportedSlug) === undefined,
    `${unsupportedSlug} must remain supported-only`,
  );
}
check(
  authority.manufacturerAuthoritySummary ===
    "HydroSense Texas is authorized by FloLogic and listed in Phyn's Find a Phyn Pro Directory.",
  "Combined manufacturer authority statement drifted",
);
check(
  authority.manufacturerAuthorityShortLabel === "Authorized by FloLogic; Phyn Pro",
  "Short manufacturer authority label drifted",
);

const plumbingEvidence = license.plumbingLicenseEvidence;
check(plumbingEvidence.licenseNumber === "43057", "License number drifted");
check(plumbingEvidence.publicIdentifier === "M-43057", "Public RMP identifier drifted");
check(plumbingEvidence.licenseType === "Master Plumber", "License type drifted");
check(plumbingEvidence.licenseStatus === "Current", "License status drifted");
check(plumbingEvidence.licensePubliclyVerified === true, "License must remain publicly verified");
check(plumbingEvidence.licenseHolderName === "Jamyron L. Davis", "Internal license holder evidence drifted");
check(plumbingEvidence.stateListedCompanyName === "Davis Quality Plumbing LLC", "Internal state-listed company evidence drifted");
check(plumbingEvidence.rmpEndorsementVerified === true, "RMP endorsement evidence must remain verified");
check(plumbingEvidence.certificateOfInsuranceVerified === true, "Certificate-of-insurance evidence must remain verified");
check(
  plumbingEvidence.hydroSenseContractualRelationshipOwnerVerified === true,
  "HydroSense contractual relationship must remain owner verified",
);
check(
  plumbingEvidence.plumbingExecutionRelationshipOwnerVerified === true,
  "Plumbing execution relationship must remain owner verified",
);
check(
  plumbingEvidence.rmpBusinessRelationshipPubliclyCorroborated === false,
  "Private RMP/company relationship must not be represented as publicly corroborated",
);
check(
  license.publicPlumbingAuthorityStatement ===
    "Plumbing work is performed through a Texas-licensed plumbing partner under Responsible Master Plumber M-43057.",
  "Public plumbing authority statement drifted",
);
check(
  license.fullServiceAuthorityStatement ===
    "HydroSense manages device selection, plumbing coordination, installation, setup, shutoff testing, and homeowner handoff in one complete service. Plumbing work is performed through a Texas-licensed plumbing partner under Responsible Master Plumber M-43057.",
  "Full HydroSense service authority statement drifted",
);
check(
  license.homepagePlumbingTrustStatement ===
    "Licensed plumbing execution under RMP M-43057.",
  "Homepage plumbing trust statement drifted",
);
check(
  license.googleBusinessProfilePlumbingStatement ===
    "Plumbing execution is performed under RMP M-43057.",
  "Google Business Profile plumbing statement drifted",
);
check(
  license.footerPlumbingTrustStatement === "Plumbing execution under RMP M-43057.",
  "Footer plumbing trust statement drifted",
);
for (const publicCopy of [
  license.publicPlumbingAuthorityStatement,
  license.fullServiceAuthorityStatement,
  license.homepagePlumbingTrustStatement,
  license.googleBusinessProfilePlumbingStatement,
  license.footerPlumbingTrustStatement,
]) {
  check(!/Jamyron|Davis Quality/i.test(publicCopy), "Public authority copy exposes private fulfillment identity");
}
check(
  license.TEXAS_PUBLIC_LICENSE_SEARCH_URL ===
    "https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do" &&
    !/list\.do\?anchor/i.test(license.TEXAS_PUBLIC_LICENSE_SEARCH_URL),
  "License verification must use the durable Texas Public License Search destination",
);

const aboutSource = read("app/about/page.tsx");
check(
  aboutSource.includes("manufacturerAuthoritySummary") &&
    aboutSource.includes("manufacturerAuthorities.map") &&
    aboutSource.includes("Manufacturer authority and program participation"),
  "/about must render governed manufacturer relationships",
);
check(
  aboutSource.includes("PHYN_PRO_DIRECTORY_URL") &&
    aboutSource.includes("Official Find a Phyn Pro Directory"),
  "/about must expose the official Phyn corroboration link",
);
check(
  aboutSource.includes("fullServiceAuthorityStatement") &&
    aboutSource.includes("publicPlumbingAuthorityStatement") &&
    aboutSource.includes("Every HydroSense project includes compatibility review"),
  "/about must keep HydroSense primary and use partner-neutral authority wording",
);
for (const fact of [
  "HydroSense Texas",
  "Lead Ledger Pro LLC",
  "Greater Houston, Texas",
  "(281) 694-5754",
]) {
  check(aboutSource.includes(fact), `/about is missing business fact: ${fact}`);
}
for (const scopeFact of [
  "domestic household water line is the standard scope",
  "Fire-sprinkler",
  "fire-suppression piping are excluded",
  "Irrigation is optional",
  "final written proposal",
]) {
  check(aboutSource.includes(scopeFact), `/about is missing scope fact: ${scopeFact}`);
}
check(
  aboutSource.includes("Math.min(...installationAmounts)") &&
    aboutSource.includes("Math.max(...installationAmounts)") &&
    aboutSource.includes('getInstallationService("1.50")') &&
    aboutSource.includes('getInstallationService("2.00")'),
  "/about pricing must remain catalog derived",
);

const deviceDetailSource = read("app/devices/[slug]/page.tsx");
check(
  deviceDetailSource.includes("getManufacturerAuthorityStatement") &&
    deviceDetailSource.includes("data-manufacturer-authority") &&
    deviceDetailSource.includes("verificationUrl"),
  "Device details must render governed authority and corroboration",
);
const heroSource = read("components/Hero.tsx");
check(
  !heroSource.includes("manufacturerAuthorityShortLabel"),
  "Homepage hero must keep manufacturer authority on the relevant product pages",
);
const deviceHubSource = read("app/devices/page.tsx");
check(
  deviceHubSource.includes("getManufacturerAuthority") &&
    deviceHubSource.includes("data-manufacturer-authority-badge") &&
    deviceHubSource.includes("authority.publicLabel") &&
    deviceHubSource.includes("authority.publicStatement"),
  "/devices must render accessible exact authority labels",
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

const publicMarketingFiles = [
  ...sourceFiles("app").filter(
    (file) => !/^app[\\/](?:api|admin|quote|e2e)[\\/]/.test(file),
  ),
  ...sourceFiles("components").filter(
    (file) => !/(?:QuoteDocument|Admin)/.test(file),
  ),
  "lib/home-faqs.ts",
  "lib/guides/commercial-guides.ts",
  "lib/business/google-business-profile.ts",
  "public/llms.txt",
  "public/llms-full.txt",
];
const publicMarketingSource = publicMarketingFiles.map((file) => read(file)).join("\n");
for (const privateIdentity of ["Jamyron L. Davis", "Davis Quality Plumbing LLC"]) {
  check(
    !publicMarketingSource.includes(privateIdentity),
    `Public marketing exposes private fulfillment identity: ${privateIdentity}`,
  );
}
check(
  !/MPL 43057|Work coordinated under Texas Master Plumber License|HydroSense coordinates plumbing installation under Texas Master Plumber/i.test(
    publicMarketingSource,
  ),
  "Public marketing retains legacy license wording that can imply HydroSense owns the credential",
);
check(
  !/our Texas (?:Registered )?Master Plumber|HydroSense installs under Texas (?:Registered )?Master Plumber/i.test(
    publicMarketingSource,
  ),
  "Public marketing uses ownership-style plumbing authority language",
);
check(
  !publicMarketingSource.includes("plumbingLicenseEvidence"),
  "Public marketing must not render or serialize the private plumbing evidence object",
);

const positioningSources = {
  homepage: read("components/Hero.tsx"),
  about: aboutSource,
  pricing: read("app/pricing/page.tsx"),
  devices: deviceHubSource,
  guides: read("lib/guides/commercial-guides.ts"),
};
check(
  positioningSources.homepage.includes(
    "HydroSense manages device selection, plumbing coordination, installation,",
  ),
  "Homepage must position HydroSense as the complete-service manager",
);
for (const page of ["about", "pricing", "devices", "guides"]) {
  check(
    positioningSources[page].includes("fullServiceAuthorityStatement"),
    `${page} must use the governed HydroSense complete-service statement`,
  );
}
check(
  read("components/CriticalBar.tsx").includes("homepagePlumbingTrustStatement"),
  "Homepage trust bar must use the restrained RMP statement",
);
check(
  read("components/Footer.tsx").includes("footerPlumbingTrustStatement"),
  "Footer must use the compact RMP statement",
);
for (const claim of [
  "Authorized by Phyn",
  "Phyn Certified",
  "Phyn Authorized Installer",
  "Phyn Approved Installer",
  "Phyn Endorsed Installer",
  "Certified Installer",
  "Preferred Installer",
  "Factory Certified",
  "Official Partner",
  "Authorized Dealer",
]) {
  check(!new RegExp(claim, "i").test(productionSource), `Unsupported designation found: ${claim}`);
}

const schemaSource = read("components/Schema.tsx");
check(!schemaSource.includes("hasCredential"), "Business schema must not imply HydroSense owns the partner RMP credential");
check(
  schemaSource.includes('telephone: "+1-281-694-5754"'),
  "Current HydroSense public phone must remain in business schema",
);
check(
  schemaSource.includes("GOOGLE_BUSINESS_PROFILE_URL") &&
    schemaSource.includes("FACEBOOK_URL"),
  "sameAs must remain limited to governed HydroSense profile URLs",
);
check(
  !schemaSource.includes("https://phyn.com/pages/find-a-phyn-pro"),
  "Phyn directory corroboration must never enter sameAs or business schema",
);
check(
  !/flologic\.com|phyn\.com|moen\.com|streamlabswater\.com|elexa/i.test(schemaSource),
  "Manufacturer websites must not enter HydroSense sameAs",
);
for (const relationship of ["employee", "memberOf", "brand", "parentOrganization", "subOrganization", "affiliation"]) {
  check(
    !new RegExp(`(?:["']${relationship}["']|\\b${relationship})\\s*:`).test(schemaSource),
    `Fake schema relationship found: ${relationship}`,
  );
}
check(!/AggregateRating/.test(productionSource), "Production source must not fabricate ratings");
check(!/streetAddress\s*:/.test(productionSource), "Production source must not publish an address");
check(
  !schemaSource.includes("manufacturerAuthorities"),
  "Manufacturer authority records must not be added to global schema",
);
check(
  !/Jamyron L\. Davis|Davis Quality Plumbing LLC/i.test(schemaSource),
  "Business schema exposes private plumbing fulfillment identity",
);
check(
  (schemaSource.match(/"@type": \["LocalBusiness", "Plumber"\]/g) ?? []).length === 1,
  "HydroSense must remain the only public LocalBusiness entity",
);
const registrySource = read("lib/seo/indexable-pages.ts");
check(
  registrySource.includes('BUSINESS_ENTITY_ID = `${SITE_ORIGIN}/#business`') &&
    schemaSource.includes('"@id": BUSINESS_ENTITY_ID'),
  "Global business identity must remain https://hydrosensetx.com/#business",
);
for (const competingIdentity of ["#organization", "#company", "#plumber", "#hydrosense"]) {
  check(
    !productionSource.toLowerCase().includes(
      `https://hydrosensetx.com/${competingIdentity}`,
    ),
    `Competing business identity found: ${competingIdentity}`,
  );
}
check(
  !/["']@type["']\s*:\s*["']Review["']/.test(productionSource),
  "Production source must not fabricate Review schema",
);

const ledger = read("docs/manufacturer-authority-ledger.md");
for (const token of [
  "programStatus: phyn_pro",
  "publiclyCorroborated: true",
  "ownerVerified: true",
  "licensePubliclyVerified: true",
  "licenseHolderName: Jamyron L. Davis",
  "stateListedCompanyName: Davis Quality Plumbing LLC",
  "rmpEndorsementVerified: true",
  "certificateOfInsuranceVerified: true",
  "hydroSenseContractualRelationshipOwnerVerified: true",
  "plumbingExecutionRelationshipOwnerVerified: true",
  "rmpBusinessRelationshipPubliclyCorroborated: false",
  "https://phyn.com/pages/find-a-phyn-pro",
  "https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do",
]) {
  check(ledger.includes(token), `Authority ledger is missing: ${token}`);
}
const ownerActions = read("docs/sprint-3-owner-actions.md");
for (const token of [
  "HydroSense Texas",
  "(281) 694-5754",
  "https://hydrosensetx.com",
  "HydroSense-domain email if available",
  "Responsible Master Plumber endorsement: verified",
  "certificate of insurance: verified",
  "HydroSense contractual relationship: owner verified",
  "plumbing execution relationship: owner verified",
  "docs/estimates-invoices-plumbing-compliance-follow-up.md",
  "Referral Installer",
  "Dealer",
]) {
  check(ownerActions.includes(token), `Owner actions are missing: ${token}`);
}
check(!/apply for authorization/i.test(ownerActions), "Owner actions must not request authorization applications");

const complianceFollowup = read("docs/estimates-invoices-plumbing-compliance-follow-up.md");
for (const token of [
  "out of scope for PR #10",
  "estimates",
  "invoices",
  "transactional templates",
  "qualified Texas plumbing compliance or legal review",
]) {
  check(complianceFollowup.includes(token), `Compliance follow-up is missing: ${token}`);
}
const gbpSource = read("lib/business/google-business-profile.ts");
const gbpRecommendation = read("docs/google-business-profile-recommendation.md");
check(
  gbpSource.includes("GOOGLE_BUSINESS_PROFILE_DESCRIPTION_LIMIT = 750") &&
    gbpSource.includes("googleBusinessProfilePlumbingStatement") &&
    gbpSource.includes("supports FloLogic large-line applications") &&
    !gbpSource.includes("manufacturerAuthoritySummary"),
  "GBP source must stay HydroSense-focused and use governed partner-neutral wording",
);
for (const token of [
  "HydroSense is listed in Phyn's Find a Phyn Pro Directory and supports FloLogic large-line applications.",
  "Plumbing execution is performed under RMP M-43057.",
  "(281) 694-5754",
  "https://support.google.com/business/answer/3039617",
  "License publicly verified",
  "relationship is not publicly corroborated",
]) {
  check(gbpRecommendation.includes(token), `GBP recommendation is missing: ${token}`);
}
check(
  !/Jamyron L\. Davis|Davis Quality Plumbing LLC|Authorized by FloLogic/i.test(gbpRecommendation),
  "GBP recommendation exposes private fulfillment identity or non-preferred FloLogic positioning",
);for (const service of catalog.activeServices) {
  const price = service.price.type === "fixed"
    ? catalog.formatUsd(service.price.amount)
    : "Quote required";
  check(
    gbpRecommendation.includes(`| ${service.name} | ${price} |`),
    `GBP custom-service parity drifted: ${service.name}`,
  );
}

for (const value of [
  "HydroSense Texas",
  "https://hydrosensetx.com",
  "(281) 694-5754",
  "Greater Houston",
]) {
  check(
    gbpRecommendation.includes(`| ${value} | OWNER VERIFY |`),
    `GBP profile field is missing or not marked OWNER VERIFY: ${value}`,
  );
}
check(
  (gbpRecommendation.match(/OWNER VERIFY/g) ?? []).length >= 8,
  "GBP owner-only profile fields must be clearly marked OWNER VERIFY",
);
check(
  gbpRecommendation.includes("Do not append a price to a custom service name") &&
    gbpRecommendation.includes("no category is fabricated") &&
    gbpRecommendation.includes("Do not publish a residential or unverified storefront address"),
  "GBP recommendation must preserve service-name, category, and address guardrails",
);

const e2eSource = read("tests/e2e/entity-authority.spec.ts");
for (const route of [
  "/",
  "/about",
  "/pricing",
  "/devices",
  "/guides/do-i-need-a-plumber-for-smart-water-shutoff",
  "/devices/flologic",
  "/devices/phyn-plus",
]) {
  check(e2eSource.includes(`"${route}"`), `Authority browser test is missing ${route}`);
}
check(e2eSource.includes("not.toHaveProperty(\"hasCredential\")"), "E2E must reject unsupported credential schema");
check(e2eSource.includes("business?.sameAs"), "E2E must verify Phyn is absent from sameAs");
check(
  e2eSource.includes("Jamyron L\\. Davis|Davis Quality Plumbing LLC") &&
    e2eSource.includes("HydroSense(?: Texas)? (?:owns|holds|is licensed under)"),
  "E2E must reject private fulfillment identities and HydroSense license-ownership claims",
);
const llmsGeneratorSource = read("scripts/generate-llms-full.ts");
check(
  llmsGeneratorSource.includes("manufacturerAuthoritySummary") &&
    llmsGeneratorSource.includes("getManufacturerAuthorityStatement") &&
    llmsGeneratorSource.includes("verificationUrl") &&
    llmsGeneratorSource.includes("fullServiceAuthorityStatement") &&
    llmsGeneratorSource.includes("publicPlumbingAuthorityStatement"),
  "Full LLM output must derive governed manufacturer and plumbing authority wording",
);
for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
  const source = read(file);
  for (const token of [
    authority.manufacturerAuthoritySummary,
    "https://phyn.com/pages/find-a-phyn-pro",
    license.publicPlumbingAuthorityStatement,
    "(281) 694-5754",
  ]) {
    check(source.includes(token), `${file} is missing: ${token}`);
  }
  check(source.includes("HydroSense manages device selection"), `${file} lacks HydroSense-first positioning`);
  check(!/Authorized by Phyn/i.test(source), `${file} retains unsupported Phyn authorization language`);
  check(!/Jamyron L\. Davis|Davis Quality Plumbing LLC/i.test(source), `${file} exposes private fulfillment identity`);
  check(!/MPL 43057|Work coordinated under Texas Master Plumber License/i.test(source), `${file} retains legacy license wording`);
}
if (errors.length > 0) {
  console.error("HydroSense entity-authority verification failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `HydroSense entity-authority verification passed (${records.length} governed manufacturer relationships).`,
);
