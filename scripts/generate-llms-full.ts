/**
 * Build-time script to generate /public/llms-full.txt
 * Run: npx tsx scripts/generate-llms-full.ts
 */

// We inline the city data to avoid import issues in the script context
const cities: Record<
  string,
  {
    name: string;
    slug: string;
    county: string;
    medianHome: string;
    typicalPremium: string;
    heroNote: string;
    freezeRisk: string;
    homeAge: string;
    whyInstall: string[];
    hoFormScenario: string;
    carriers: { name: string; typicalDiscount: string }[];
    cityFaqs: { q: string; a: string }[];
    zips: string[];
  }
> = {
  katy: { name: "Katy", slug: "katy", county: "Harris/Fort Bend/Waller", medianHome: "$385,000", typicalPremium: "$4,800-$6,200", heroNote: "KISD zone, post-Uri rebuild market", freezeRisk: "Katy saw widespread pipe failures during Winter Storm Uri.", homeAge: "Dominant housing stock is 15 to 30 years old.", whyInstall: ["Katy is one of the highest-volume water damage claim markets in the Houston metro."], hoFormScenario: "A 2019 KISD-zone home on HO-B vs HO-A: same dishwasher leak settles at $14,200 replacement cost on HO-B and $4,400 actual cash value on HO-A.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Is this available in Cinco Ranch?", a: "Yes." }], zips: ["77449", "77450", "77493", "77494"] },
  cypress: { name: "Cypress", slug: "cypress", county: "Harris", medianHome: "$340,000", typicalPremium: "$4,200-$5,800", heroNote: "Northwest Houston, deep freeze exposure", freezeRisk: "Cypress sits in northwest Harris County where overnight lows consistently drop 2 to 4 degrees below central Houston.", homeAge: "Mix of 2000s-era development and active new construction.", whyInstall: ["Cypress is in one of the coldest micro-zones within the Houston metro during freeze events."], hoFormScenario: "A Bridgeland home insured on HO-3 settles a burst supply line at $18,600. On HO-A, the same event settles at $6,200.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you service Bridgeland?", a: "Yes." }], zips: ["77429", "77433"] },
  "the-woodlands": { name: "The Woodlands", slug: "the-woodlands", county: "Montgomery", medianHome: "$510,000", typicalPremium: "$6,200-$8,500", heroNote: "Higher home values, HOA-active", freezeRisk: "The Woodlands sits north of Houston and consistently records lower temperatures.", homeAge: "Established neighborhoods date to the 1980s and 1990s.", whyInstall: ["The Woodlands has some of the highest median home values in the Houston metro."], hoFormScenario: "A $650,000 Woodlands home on HO-3 settles at $42,000. On HO-A, $14,800.", carriers: [{ name: "Chubb", typicalDiscount: "10-15%" }], cityFaqs: [{ q: "Do you install in Creekside Park?", a: "Yes." }], zips: ["77380", "77381", "77382", "77384", "77389"] },
  "sugar-land": { name: "Sugar Land", slug: "sugar-land", county: "Fort Bend", medianHome: "$440,000", typicalPremium: "$5,200-$7,000", heroNote: "Fort Bend ISD, slab-on-grade", freezeRisk: "Sugar Land's slab-on-grade construction means supply lines run through walls and attic spaces.", homeAge: "Established neighborhoods date to late 1980s and 1990s.", whyInstall: ["Sugar Land homes in the $400K-$600K range carry premiums that make the discount particularly valuable."], hoFormScenario: "A First Colony home on HO-B: kitchen supply failure settles at $16,800. On HO-A, $5,600.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you service First Colony?", a: "Yes." }], zips: ["77478", "77479", "77498"] },
  spring: { name: "Spring", slug: "spring", county: "Harris", medianHome: "$310,000", typicalPremium: "$3,800-$5,200", heroNote: "Klein/Spring ISD, north Harris", freezeRisk: "Spring is in north Harris County, which records consistently lower temperatures.", homeAge: "Wide range from 1970s-era neighborhoods to active new construction.", whyInstall: ["Spring's north Harris location means colder overnight lows during freeze events."], hoFormScenario: "A 2005 Klein ISD home on HO-3: water heater failure settles at $12,400. On HO-A, $4,100.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you service Old Town Spring?", a: "Yes." }], zips: ["77373", "77379", "77386", "77388", "77389"] },
  baytown: { name: "Baytown", slug: "baytown", county: "Harris/Chambers", medianHome: "$260,000", typicalPremium: "$3,600-$5,400", heroNote: "Coastal exposure, hurricane and freeze risk", freezeRisk: "Baytown faces dual risk: coastal and freeze.", homeAge: "Mix of older neighborhoods and newer development.", whyInstall: ["Baytown carries a dual risk profile that carriers price accordingly."], hoFormScenario: "A Baytown home on HO-B: water heater failure settles at $9,800. On HO-A, $3,200.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Does coastal exposure affect the discount?", a: "No." }], zips: ["77520", "77521", "77523"] },
  houston: { name: "Houston", slug: "houston", county: "Harris", medianHome: "$340,000", typicalPremium: "$4,200-$6,600", heroNote: "Houston proper, 88 neighborhoods", freezeRisk: "Houston proper experienced the full impact of Winter Storm Uri.", homeAge: "Houston spans every era from 1920s to present.", whyInstall: ["Houston is the epicenter of the Texas homeowners insurance crisis."], hoFormScenario: "A Heights bungalow on HO-3: galvanized supply failure settles at $24,000. On HO-A, $7,800.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you install in all Houston neighborhoods?", a: "Yes, 88 neighborhoods." }], zips: ["multiple ZIP codes across 88 neighborhoods"] },
  galveston: { name: "Galveston", slug: "galveston", county: "Galveston", medianHome: "$320,000", typicalPremium: "$5,400-$9,200", heroNote: "Beach houses, vacation rentals, year-round and seasonal occupancy", freezeRisk: "Vacation homes without anyone on-site during freezes are highest risk for catastrophic damage.", homeAge: "From historic Strand-area homes to modern west-end beachfront construction.", whyInstall: ["Galveston vacation properties carry some of the highest premiums in the Houston metro. Unoccupied time is the core risk. A smart shutoff closes the main in seconds whether anyone is home or not."], hoFormScenario: "A west-end beach house on HO-3: supply failure while owner is in Houston settles at $28,000. On HO-A, $9,400.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you install in vacation rental properties on Galveston Island?", a: "Yes, including West End, East Beach, and Strand area." }], zips: ["77550", "77551", "77553", "77554"] },
  "lake-conroe": { name: "Lake Conroe", slug: "lake-conroe", county: "Montgomery", medianHome: "$420,000", typicalPremium: "$5,000-$7,400", heroNote: "Lake houses, second homes, weekend occupancy, owners often Houston-based", freezeRisk: "Montgomery County runs 3-5 degrees colder than Houston. Second homes unoccupied during weekdays are highest risk.", homeAge: "Mix of 1990s lakefront development and newer luxury construction.", whyInstall: ["Lake Conroe is one of the most active second-home markets in the Houston metro. Most owners live in Houston and visit weekends, leaving properties unoccupied 5 days a week."], hoFormScenario: "A $500,000 lakefront home on HO-3: supply failure while owner is in Houston settles at $38,000. On HO-A, $12,600.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you install in April Sound and Walden?", a: "Yes, all Lake Conroe communities." }], zips: ["77301", "77302", "77303", "77304", "77316", "77356"] },
  "lake-livingston": { name: "Lake Livingston", slug: "lake-livingston", county: "Polk/San Jacinto/Trinity", medianHome: "$240,000", typicalPremium: "$3,200-$5,000", heroNote: "Weekend cabins, retirement homes, mixed occupancy", freezeRisk: "80 miles north of Houston in the Piney Woods. Winter temperatures regularly drop below 25F.", homeAge: "From 1970s fishing cabins to modern lakefront retirement homes.", whyInstall: ["Lake Livingston is 80 miles north of Houston. Weekend cabins and seasonal homes that sit empty during freezes are the highest-risk category for catastrophic pipe damage."], hoFormScenario: "A Lake Livingston cabin on HO-B: supply failure while owner in Houston settles at $14,000. On HO-A, $4,800.", carriers: [{ name: "State Farm", typicalDiscount: "5-10%" }], cityFaqs: [{ q: "Do you install at Lake Livingston?", a: "Yes, Livingston, Onalaska, Coldspring, and surrounding communities." }], zips: ["77351", "77360", "77331", "77334"] },
};

import { writeFileSync } from "fs";
import { join } from "path";
import {
  activeServices,
  formatUsd,
  installationServices,
  serviceCatalog,
} from "../lib/service-catalog/catalog";
import {
  commercialGuides,
  installationMaximumStartingPrice,
  installationStartingPrice,
} from "../lib/guides/commercial-guides";

import { deviceList } from "../lib/devices";
import {
  getManufacturerAuthority,
  getManufacturerAuthorityStatement,
  manufacturerAuthorities,
  manufacturerAuthoritySummary,
} from "../lib/business/manufacturer-authorizations";
import {
  fullServiceAuthorityStatement,
  publicPlumbingAuthorityStatement,
} from "../lib/business/plumbing-license";
const publicPricingLines = activeServices.map((service) => {
  const price = service.price.type === "fixed"
    ? `${formatUsd(service.price.amount)} per ${service.price.unit}`
    : "Quote required";
  const family = "deviceFamily" in service && service.deviceFamily
    ? ` — ${service.deviceFamily.name} (${service.deviceFamily.designation} device family)`
    : "";
  return `- ${service.id}: ${service.name} — ${price}${family}`;
}).join("\n");

const installationPricingLines = installationServices.map((service) => {
  if (service.price.type !== "fixed") {
    throw new Error(`Installation service ${service.id} must have a fixed price`);
  }
  const family = service.deviceFamily
    ? `; designated device family: ${service.deviceFamily.name}`
    : "";
  const grade = service.commercialGradeDeviceIncluded
    ? "; commercial-grade device included"
    : "";
  return `- ${service.incomingLineSize}-inch domestic main: starting at ${formatUsd(service.price.amount)}${family}${grade}`;
}).join("\n");

const commercialGuideContent = commercialGuides.map((guide) => `## ${guide.h1}

**${guide.directQuestion}**

${guide.directAnswer}

${guide.sections.map((section) => `### ${section.heading}\n\n${section.paragraphs.join("\n\n")}${section.bullets ? `\n\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}` : ""}`).join("\n\n")}

URL: https://hydrosensetx.com${guide.href}`).join("\n\n---\n\n");

let output = `# HydroSense Texas - Full Content

> ${fullServiceAuthorityStatement}

---

# Homepage

## Insurance Savings

Texas homeowners insurance is up 46% in two years. Most homeowners qualify for $300 to $600 in annual credits they never collect.

Average Houston household pays $6,600 a year. A 10-15% water-damage credit puts $300 to $600 back in your pocket, every year you stay insured.

10+ major Texas carriers actively reward smart shutoff installs. The discount applies the moment the certificate is on file. Most homeowners earn back the install inside 24 months.

## Freeze Damage

A hard freeze does not always announce itself immediately. Supply lines develop hairline cracks under pressure that hold for days, weeks, sometimes months. Winter Storm Uri caused $10B+ in Texas insurance industry losses. The single largest cause category was burst supply lines downstream of unattended main shutoffs.

## Insurance Forms: HO-A vs HO-B vs HO-3

- HO-A (Basic): Named-peril, actual cash value (depreciated). Least coverage.
- HO-B (Broad): Open-peril dwelling, named-peril contents, replacement cost. Historically the TX standard.
- HO-3 (Special): Open-peril dwelling, named-peril contents, replacement cost. Most common today.

The smart shutoff discount applies on all three forms.

## The Certificate

The certificate is the product. The device is the hardware. A smart water shutoff by itself does not earn the insurance discount. After final payment, HydroSense issues a carrier-recognized certificate in both paper and digital form and reissues annually.

## How It Works

1. Sign up (form or phone call)
2. 15-minute phone assessment
3. Service agreement with exact pricing
4. Plumbing installation through a Texas-licensed partner under RMP M-43057 (~2 hours)
5. App handoff and device configuration
6. Certificate issued in paper and digital form after final payment

## Pricing

Catalog version: ${serviceCatalog.catalogVersion}
Effective date: ${serviceCatalog.effectiveDate}
Currency: ${serviceCatalog.currency}

${publicPricingLines}

HydroSense standard installation starting prices currently range from ${formatUsd(installationStartingPrice)} to ${formatUsd(installationMaximumStartingPrice)}, based on the verified incoming domestic-main size:

${installationPricingLines}

FloLogic is HydroSense's designated device family for qualifying 1 1/2-inch and 2-inch domestic water-line installations. The final device model and compatibility are confirmed in the written proposal. Fire-sprinkler and fire-suppression piping remain excluded. HydroSense catalog prices—not manufacturer MSRP—are the authoritative HydroSense public service prices. The 2-inch rate retains its commercial-grade designation. Annual care is optional; irrigation and corrective plumbing require a written quote.

## Carriers

State Farm, USAA, Allstate, Farmers, Travelers, Liberty Mutual, Nationwide, Progressive, Texas Farm Bureau, Chubb

## Devices Installed

${deviceList.map((device) => device.name).join(", ")}

## Manufacturer authority and programs

${manufacturerAuthoritySummary}

${manufacturerAuthorities.map((authority) => `- ${authority.publicLabel}: ${authority.publicStatement}${authority.verificationUrl ? ` Official corroboration: ${authority.verificationUrl}` : ""}`).join("\n")}

About: https://hydrosensetx.com/about

---

`;

output += `# Guides

${commercialGuideContent}

---

## HO-A vs HO-B vs HO-3 in Texas

Your insurance form determines whether a water damage claim settles at replacement cost or depreciated value. That distinction can mean a $12,000 difference on one event.

- HO-A (Basic): Named-peril, actual cash value (depreciated). A burst supply line causing $18,000 in damage settles at roughly $6,000.
- HO-B (Broad): Open-peril dwelling, replacement cost. The same $18,000 claim settles at $18,000.
- HO-3 (Special): Open-peril dwelling, named-peril contents, replacement cost. Most common in Texas today.

The smart shutoff discount applies on all three forms.

## Freeze Damage Claims in Texas

A hard freeze does not always announce itself immediately. Supply lines develop hairline cracks under pressure that hold for days or weeks. Winter Storm Uri caused $10B+ in Texas insurance industry losses. The single largest cause category was burst supply lines downstream of unattended main shutoffs.

A smart shutoff responds in approximately 8 seconds. The difference between a $280 drywall patch and a $35,000 remediation is whether the water ran for seconds or hours.

---

`;

output += `# Blog

## Texas Freeze Survival Checklist

Interactive checklist for Houston homeowners: 72 hours before a freeze (disconnect hoses, insulate pipes, open cabinet doors, set thermostat to 55F, drain irrigation), during the freeze (drip faucets, monitor pressure, maintain heat), and after the thaw (walk every pipe, meter test for hidden leaks, re-inspect at 3 and 7 days). Includes the critical point: a checklist requires a human present, but a smart shutoff monitors and responds at 3 a.m. while you sleep.

URL: https://hydrosensetx.com/blog/texas-freeze-survival-checklist

## Why Houston Home Insurance Keeps Rising

Texas premiums rose ~46% over two years (Policygenius, 2022-2023). Average Houston household pays ~$6,600/year (Rice Kinder Institute, 2025). Three drivers: catastrophic weather claims, reinsurance cost pass-through, and water damage as the most frequent claim category. A carrier-recognized smart shutoff earns a 10-15% credit ($300-$600/year) and prevents the claim that drives the increase. Covers HO-A vs HO-B vs HO-3 implications, the certificate requirement, and timing the install before renewal.

URL: https://hydrosensetx.com/blog/houston-home-insurance-rising-smart-shutoff

## Frozen Pipes While Traveling This Winter

The snowbird and holiday-travel risk: Houston households leave homes empty 10-20 days during prime freeze window. An empty house has no one to drip faucets, catch bursts, or find water until days later. Illustrative scenario of a 14-day trip with a day-three burst resulting in six-figure remediation. Covers vacation rentals and second homes, a pre-travel checklist, and how remote shutoff with phone alerts (Moen Flo app) limits damage to seconds of water flow.

URL: https://hydrosensetx.com/blog/frozen-pipes-while-traveling-winter

## The Real Cost of a Burst Pipe in Texas

A single burst runs $7,000-$70,000 depending on detection time. Breakdown: pipe repair $200-$500, water extraction $1,000-$3,000, drywall $3,000-$8,000, flooring $2,000-$15,000, contents $5,000-$20,000+, mold remediation $5,000-$30,000 (if 48+ hours). Insurance consequences: deductible ($1,000-$5,000), 20-40% premium increase for 3-5 years, non-renewal risk. Comparison: caught in 8 seconds = $280 vs caught in 8 hours = $35,000.

URL: https://hydrosensetx.com/blog/cost-of-burst-pipe-texas

## Smart vs Manual Water Shutoff

Side-by-side comparison. Manual valve: $0, 10-30 minute response (if home), no monitoring, no insurance credit. Smart shutoff: from $999, 3-8 second response, 24/7 monitoring, 10-15% carrier credit ($300-$600/year). Five failure points of manual valves: location unknown, accessibility, corrosion, response time, absence. Device options: Moen Flo (broadest acceptance), Phyn Plus (most sensitive), StreamLabs (fewest moving parts). ${publicPlumbingAuthorityStatement}

URL: https://hydrosensetx.com/blog/smart-vs-manual-water-shutoff-freeze

## Best $999 Home Investment in Texas

One sub-$1,000 home upgrade returns money three ways: recurring insurance credit (10-15%, $300-$600/year), catastrophic loss prevention ($35,000 average unmitigated claim avoided), and resale value. Install pays for itself in 18-24 months. Full ROI math for 2026.

URL: https://hydrosensetx.com/blog/best-home-investment-texas-tight-budget

## Smart Water Shutoff for Texas Vacation Rentals

Pillar guide for Galveston, Lake Conroe, and Lake Livingston vacation home owners. Covers the 6-day undetected leak scenario, why vacation homes carry higher water damage risk than primary residences, insurance reality for Texas STR properties (DP-3, HO-5 with STR rider), the three vacation markets we serve, install process for beach and lake houses, and the math on a $999 install with $400-$700/yr typical credit.

URL: https://hydrosensetx.com/blog/smart-water-shutoff-texas-vacation-rentals

---

`;

// Device pages
const deviceData = deviceList;

for (const dev of deviceData) {
  const manufacturerAuthority = getManufacturerAuthority(dev.slug);
  const authorityStatement = getManufacturerAuthorityStatement(dev.slug);

  output += `# ${dev.name}

${dev.tagline}

## How it works

${dev.howItWorks}

## Best for

${dev.bestFor}

${dev.selectionNote ? `## HydroSense selection note

${dev.selectionNote}

` : ""}${authorityStatement ? `## Manufacturer authority

${authorityStatement}

${manufacturerAuthority?.verificationUrl ? `Official program corroboration: ${manufacturerAuthority.verificationUrl}\n\n` : ""}` : ""}Official manufacturer source: ${dev.officialSite}

URL: https://hydrosensetx.com/devices/${dev.slug}

---

`;
}

for (const [slug, city] of Object.entries(cities)) {
  output += `# ${city.name}, Texas

- County: ${city.county}
- Median home value: ${city.medianHome}
- Typical premium: ${city.typicalPremium}
- ZIP codes: ${city.zips.join(", ")}

## Why ${city.name} homeowners install

${city.whyInstall.join("\n\n")}

## Freeze risk

${city.freezeRisk} ${city.homeAge}

## Insurance form comparison

${city.hoFormScenario}

## Carriers active in ${city.name}

${city.carriers.map((c) => `- ${c.name}: ${c.typicalDiscount}`).join("\n")}

## FAQ

${city.cityFaqs.map((f) => `**Q: ${f.q}**\nA: ${f.a}`).join("\n\n")}

---

`;
}

output += `## Contact

- Phone: (281) 694-5754
- Website: https://hydrosensetx.com
- Public pricing: https://hydrosensetx.com/pricing
- Service catalog: https://hydrosensetx.com/service-catalog.json
- OpenAPI: https://hydrosensetx.com/openapi.json
- A2A Agent Card: https://hydrosensetx.com/.well-known/agent-card.json
- Plumbing authority: ${publicPlumbingAuthorityStatement}
- Company: Lead Ledger Pro LLC
`;

const outPath = join(__dirname, "..", "public", "llms-full.txt");
writeFileSync(outPath, output, "utf-8");
console.log(`Generated ${outPath} (${output.length} chars)`);
