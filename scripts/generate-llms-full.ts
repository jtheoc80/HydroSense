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
};

import { writeFileSync } from "fs";
import { join } from "path";

let output = `# HydroSense Texas - Full Content

> Licensed smart water shutoff installs certified under a Texas Master Plumber license, with carrier-recognized insurance discount certification. Houston metro.

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
4. Professional install by Texas Master Plumber (~2 hours)
5. App handoff and device configuration
6. Certificate issued in paper and digital form after final payment

## Pricing

- Basic: $9/mo or $99/yr (install + certificate)
- Standard: $19/mo or $199/yr (+ annual renewal + monitoring)
- Premier: $39/mo or $399/yr (+ inspection + liaison + warranty)
- Standalone install from $999

## Carriers

State Farm, USAA, Allstate, Farmers, Travelers, Liberty Mutual, Nationwide, Progressive, Texas Farm Bureau, Chubb

## Devices Installed

Flo by Moen, Phyn Plus, StreamLabs Control, Guardian by Elexa

---

`;

output += `# Guides

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

// Device pages
const deviceData = [
  { name: "Flo by Moen", slug: "moen-flo", tagline: "The insurance default. Fastest to calibrate, most widely recognized.", howItWorks: "Installs at your main water line. Monitors flow and pressure continuously, runs a daily automated health test, and closes the valve when it detects an anomaly.", bestFor: "Homeowners who want the broadest carrier acceptance and protection calibrated within days, not a month." },
  { name: "Phyn Plus", slug: "phyn-plus", tagline: "The accuracy leader. Independently ranked first for leak detection.", howItWorks: "Installs at your main. Uses pressure wave analysis to read your plumbing 240 times per second, detecting leaks without separate sensors placed around the house.", bestFor: "Older Houston homes, complex plumbing, and owners who want the most sensitive detection available." },
  { name: "StreamLabs Control", slug: "streamlabs", tagline: "The durability pick. Fewer moving parts, fewer failure points.", howItWorks: "Installs inline on your main water line. Uses an ultrasonic flow meter with no internal turbine, monitors flow over Wi-Fi, and shuts off on a detected leak.", bestFor: "Homeowners who prioritize mechanical simplicity and long-term reliability." },
  { name: "Guardian by Elexa", slug: "guardian", tagline: "The retrofit option. No plumbing replacement required.", howItWorks: "A motorized actuator mounts onto your existing main shutoff valve and physically turns the handle when wireless leak sensors detect water. No cutting into the line.", bestFor: "Older homes and situations where replacing or cutting into the main line is not an option." },
];

for (const dev of deviceData) {
  output += `# ${dev.name}

${dev.tagline}

## How it works

${dev.howItWorks}

## Best for

${dev.bestFor}

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
- License: Texas Registered Master Plumber
- Company: Lead Ledger Pro LLC
`;

const outPath = join(__dirname, "..", "public", "llms-full.txt");
writeFileSync(outPath, output, "utf-8");
console.log(`Generated ${outPath} (${output.length} chars)`);
