export interface CityData {
  name: string;
  slug: string;
  county: string;
  medianHome?: string;
  medianHomeNum?: number;
  typicalPremium?: string;
  zips: string[];
  heroNote?: string;
  schoolDistrict?: string;
  freezeRisk?: string;
  homeAge?: string;
  hoaNote?: string;
  carriers?: { name: string; typicalDiscount: string }[];
  hoFormScenario?: string;
  caseStudy?: {
    name: string;
    neighborhood: string;
    premium: string;
    event: string;
    deviceCaught: string;
    outcome: string;
  };
  cityFaqs?: { q: string; a: string }[];
  whyInstall?: string[];
  vacationRental?: boolean;
}

export const cities: Record<string, CityData> = {
  katy: {
    name: "Katy",
    slug: "katy",
    county: "Harris / Fort Bend / Waller",
    medianHome: "$385,000",
    medianHomeNum: 385000,
    typicalPremium: "$4,800 to $6,200",
    zips: ["77449", "77450", "77493", "77494"],
    heroNote:
      "KISD zone, post-Uri rebuild market",
    schoolDistrict: "Katy ISD",
    freezeRisk:
      "Katy saw widespread pipe failures during Winter Storm Uri. Homes built between 1995 and 2010 with CPVC supply lines in attic spaces were hit hardest. Many homeowners discovered damage weeks after the thaw when mold appeared behind drywall.",
    homeAge:
      "Dominant housing stock is 15 to 30 years old, with a second wave of new construction in Elyson and Cane Island since 2018.",
    hoaNote:
      "Most Katy HOAs now flag repeated water-damage claims during annual insurance reviews. A shutoff device is increasingly a condition of underwriting, not just a discount opportunity.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "Allstate", typicalDiscount: "7-12%" },
      { name: "Farmers", typicalDiscount: "5-8%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "Texas Farm Bureau", typicalDiscount: "5-10%" },
    ],
    hoFormScenario:
      "A 2019 KISD-zone home on HO-B form versus HO-A form: the same dishwasher leak settles at $14,200 replacement cost on HO-B and $4,400 actual cash value on HO-A. The form your policy uses determines whether you rebuild or patch.",
    caseStudy: {
      name: "The Martinez Family",
      neighborhood: "Cinco Ranch",
      premium: "$5,400/yr",
      event:
        "January 2024 freeze. Temperature dropped to 19F overnight. Supply line in the attic above the master bath developed a pinhole crack.",
      deviceCaught:
        "Moen Flo detected abnormal flow at 2:14 AM and shut off the main within 8 seconds. The family received a phone alert but did not need to act.",
      outcome:
        "Estimated avoided damage: $22,000 to $35,000 based on comparable attic-origin claims in Cinco Ranch. The family filed zero claims that year and applied a 10% water-damage credit at renewal, saving $540/yr.",
    },
    cityFaqs: [
      {
        q: "Is this available in the Cinco Ranch master-planned community?",
        a: "Yes. We install throughout Cinco Ranch, Elyson, Cane Island, and all Katy ISD neighborhoods. The standard install is on the home's domestic water line and does not require HOA approval in any Katy community we have serviced.",
      },
      {
        q: "My home was built after Uri. Do I still qualify for the discount?",
        a: "Yes. The carrier discount applies to the device and certificate, not the age of the home. Newer homes with PEX supply lines are less vulnerable to freeze damage but the discount is the same.",
      },
      {
        q: "How quickly can you schedule in Katy?",
        a: "Most Katy installs are scheduled within 5 to 7 business days of the phone assessment. We keep inventory staged for the greater Katy area.",
      },
    ],
    whyInstall: [
      "Katy is one of the highest-volume water damage claim markets in the Houston metro. The combination of 1990s-era CPVC supply lines, attic-routed plumbing, and hard freeze exposure creates a risk profile that carriers price aggressively. A certified smart shutoff install moves you into a lower risk tier on paper.",
      "The Katy ISD zone experienced $180M+ in residential water damage claims during Winter Storm Uri. Insurance carriers responded by tightening underwriting in this ZIP cluster. A growing number of Katy homeowners report that their renewal premiums are conditional on documented water mitigation. The HydroSense certificate satisfies that requirement.",
      "Post-Uri construction in Elyson and Cane Island uses PEX and updated building codes. These homes face lower freeze risk but the insurance discount still applies. If you are paying $5,000+/yr in premiums on a $400K home, a 10% water-damage credit returns $600/yr for a $999 install.",
    ],
  },
  cypress: {
    name: "Cypress",
    slug: "cypress",
    county: "Harris",
    medianHome: "$340,000",
    medianHomeNum: 340000,
    typicalPremium: "$4,200 to $5,800",
    zips: ["77429", "77433"],
    heroNote: "Northwest Houston, deep freeze exposure",
    schoolDistrict: "Cy-Fair ISD",
    freezeRisk:
      "Cypress sits in northwest Harris County where overnight lows consistently drop 2 to 4 degrees below central Houston during freeze events. Homes in Bridgeland, Towne Lake, and Cypress Creek Lakes have high attic-pipe exposure.",
    homeAge:
      "Mix of 2000s-era development and active new construction. Bridgeland alone has added 3,000+ homes since 2017.",
    hoaNote:
      "Bridgeland and Towne Lake HOAs have increasingly strict property maintenance standards. Water damage that leads to visible exterior deterioration can trigger HOA enforcement.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "Allstate", typicalDiscount: "7-12%" },
      { name: "Liberty Mutual", typicalDiscount: "5-10%" },
      { name: "Travelers", typicalDiscount: "6-10%" },
    ],
    hoFormScenario:
      "A Bridgeland home insured on HO-3 form with replacement cost coverage settles a burst supply line at full repair: $18,600. The same event on HO-A form with actual cash value settles at $6,200 after depreciation. Know your form before you need it.",
    caseStudy: {
      name: "The Nguyen Family",
      neighborhood: "Bridgeland",
      premium: "$4,900/yr",
      event:
        "February 2024 cold snap. Attic temperature dropped below freezing for 6 hours overnight.",
      deviceCaught:
        "StreamLabs detected a pressure drop at 3:47 AM and closed the valve before any water escaped the line. The crack was discovered during a scheduled plumber visit the following week.",
      outcome:
        "Estimated avoided damage: $15,000 to $28,000. Zero claims filed. The family applied a 7% credit at renewal, saving $343/yr.",
    },
    cityFaqs: [
      {
        q: "Do you service the Bridgeland and Towne Lake communities?",
        a: "Yes. Both communities are in our primary service area. We install on the home's domestic water line, which does not require HOA architectural approval.",
      },
      {
        q: "My home is new construction in Cypress. Is it worth it?",
        a: "New construction in Cypress uses PEX, which is more freeze-resistant than CPVC. The insurance discount still applies at the same tier. On a $4,500 premium, a 7% credit returns $315/yr.",
      },
      {
        q: "What is the install timeline for Cypress?",
        a: "Typically 5 to 7 business days from phone assessment to completed install. After final payment, we issue the certificate in both paper and digital form.",
      },
    ],
    whyInstall: [
      "Cypress is in one of the coldest micro-zones within the Houston metro during freeze events. The 77429 and 77433 ZIP codes logged some of the highest per-capita water damage claims during Winter Storm Uri. Carriers have adjusted pricing accordingly.",
      "Cy-Fair ISD zone homes built between 2000 and 2015 commonly have CPVC supply lines routed through unconditioned attic space. This is the highest-risk configuration for freeze-related pipe failure. A smart shutoff eliminates the catastrophic tail risk by closing the main within seconds of detected anomaly.",
    ],
  },
  "the-woodlands": {
    name: "The Woodlands",
    slug: "the-woodlands",
    county: "Montgomery",
    medianHome: "$510,000",
    medianHomeNum: 510000,
    typicalPremium: "$6,200 to $8,500",
    zips: ["77380", "77381", "77382", "77384", "77389"],
    heroNote: "Higher home values, HOA-active community",
    schoolDistrict: "Conroe ISD / The Woodlands Township",
    freezeRisk:
      "The Woodlands sits north of Houston and consistently records lower temperatures during freeze events. Large lot sizes and multi-story homes mean longer pipe runs and more exposure.",
    homeAge:
      "Established neighborhoods in the Village of Cochran's Crossing and Panther Creek date to the 1980s and 1990s. Creekside Park and Sterling Ridge are newer, 2005 to present.",
    hoaNote:
      "The Woodlands Township enforces strict property standards. Water damage claims that result in visible exterior deterioration are a frequent source of compliance letters.",
    carriers: [
      { name: "Chubb", typicalDiscount: "10-15%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "Travelers", typicalDiscount: "6-10%" },
      { name: "Nationwide", typicalDiscount: "5-8%" },
    ],
    hoFormScenario:
      "A $650,000 Woodlands home on HO-3 with replacement cost settles a second-floor supply line failure at $42,000 for full remediation. The same event on HO-A form settles at $14,800 after depreciation. On higher-value homes, the form difference is the difference between whole and partial restoration.",
    caseStudy: {
      name: "The Richardson Family",
      neighborhood: "Creekside Park",
      premium: "$7,200/yr",
      event:
        "December 2023 hard freeze. Outdoor temperature hit 22F. Second-floor laundry supply line developed a stress fracture.",
      deviceCaught:
        "Phyn detected abnormal micro-leak at 1:22 AM and shut the main. The family was asleep. Morning inspection found a hairline crack with no water damage.",
      outcome:
        "Estimated avoided damage: $35,000 to $55,000 based on comparable two-story laundry-origin claims. Applied a 12% water-damage credit at renewal through Chubb, saving $864/yr.",
    },
    cityFaqs: [
      {
        q: "Do you install in Creekside Park and Sterling Ridge?",
        a: "Yes. We service all Woodlands villages including Creekside Park, Sterling Ridge, Alden Bridge, Cochran's Crossing, Panther Creek, Indian Springs, and Grogan's Mill.",
      },
      {
        q: "My home is valued above $500,000. Is the discount proportionally larger?",
        a: "Yes. Higher premiums mean higher absolute dollar savings. On a $7,200 premium, even a 5% credit returns $360/yr. At 12%, that is $864/yr. The install pays for itself faster on higher-value homes.",
      },
      {
        q: "Does Chubb accept the HydroSense certificate?",
        a: "Yes. Chubb typically offers one of the highest discount tiers for smart shutoff certification, often 10-15%. We format the certificate to match Chubb's documentation requirements.",
      },
    ],
    whyInstall: [
      "The Woodlands has some of the highest median home values in the Houston metro, which means higher premiums and larger absolute dollar savings from the water-damage discount. A 10% credit on a $7,000 premium is $700/yr, paying back the install in under 18 months.",
      "Older Woodlands neighborhoods built in the 1980s and 1990s have aging copper and CPVC supply lines. These homes face both freeze risk and general age-related failure risk. The smart shutoff addresses both vectors with a single install.",
    ],
  },
  "league-city": {
    name: "League City",
    slug: "league-city",
    county: "Galveston / Harris",
    zips: ["77573"],
  },
  pearland: {
    name: "Pearland",
    slug: "pearland",
    county: "Brazoria / Harris / Fort Bend",
    zips: ["77581", "77584"],
  },
  friendswood: {
    name: "Friendswood",
    slug: "friendswood",
    county: "Galveston / Harris",
    zips: ["77546"],
  },
  "sugar-land": {
    name: "Sugar Land",
    slug: "sugar-land",
    county: "Fort Bend",
    medianHome: "$440,000",
    medianHomeNum: 440000,
    typicalPremium: "$5,200 to $7,000",
    zips: ["77478", "77479", "77498"],
    heroNote: "Fort Bend ISD, established neighborhoods, slab-on-grade",
    schoolDistrict: "Fort Bend ISD",
    freezeRisk:
      "Sugar Land's slab-on-grade construction means supply lines run through walls and attic spaces rather than basements. During hard freezes, exposed attic runs are the primary failure point.",
    homeAge:
      "Established neighborhoods in First Colony and New Territory date to the late 1980s and 1990s. Telfair and Riverstone are 2005 to present.",
    hoaNote:
      "Fort Bend County HOAs are among the most active in the Houston metro. First Colony and New Territory HOAs track property maintenance closely.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "Farmers", typicalDiscount: "5-8%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "Allstate", typicalDiscount: "7-12%" },
      { name: "Progressive", typicalDiscount: "4-8%" },
    ],
    hoFormScenario:
      "A First Colony home on HO-B form: a kitchen supply line failure settles at $16,800 replacement cost. On HO-A form, the same claim settles at $5,600 after depreciation. The difference is $11,200 on a single event.",
    caseStudy: {
      name: "The Patel Family",
      neighborhood: "First Colony",
      premium: "$5,800/yr",
      event:
        "January 2024 freeze event. Attic-routed CPVC supply line to master bath cracked at a fitting.",
      deviceCaught:
        "Moen Flo detected the pressure anomaly at 4:08 AM and shut the main. Inspection found the crack with zero water release.",
      outcome:
        "Estimated avoided damage: $18,000 to $30,000. Applied an 8% water-damage credit at renewal, saving $464/yr.",
    },
    cityFaqs: [
      {
        q: "Do you service First Colony and New Territory?",
        a: "Yes. We install throughout Sugar Land including First Colony, New Territory, Telfair, Riverstone, and Greatwood.",
      },
      {
        q: "My home is slab-on-grade. Does that affect the install?",
        a: "No. Slab-on-grade is the standard construction type we install on. The device goes on the domestic water line, typically at the meter or where that line enters the home. Install takes approximately 2 hours.",
      },
      {
        q: "Is Fort Bend ISD zone eligible for higher discounts?",
        a: "The discount is carrier-specific, not school-district specific. However, Fort Bend County homes tend to carry higher premiums due to home values, which means larger absolute dollar savings from the same percentage credit.",
      },
    ],
    whyInstall: [
      "Sugar Land homes in the $400K to $600K range carry premiums that make the water-damage discount particularly valuable. A $5,800 premium with a 10% credit returns $580/yr. The install pays for itself in under 21 months.",
      "First Colony and New Territory homes built in the 1990s have CPVC supply lines at the age where failure rates increase. The smart shutoff provides both immediate insurance savings and long-term risk mitigation.",
    ],
  },
  spring: {
    name: "Spring",
    slug: "spring",
    county: "Harris",
    medianHome: "$310,000",
    medianHomeNum: 310000,
    typicalPremium: "$3,800 to $5,200",
    zips: ["77373", "77379", "77386", "77388", "77389"],
    heroNote: "Klein / Spring ISD, north Harris",
    schoolDistrict: "Klein ISD / Spring ISD",
    freezeRisk:
      "Spring is in north Harris County, which records consistently lower temperatures than central Houston during freeze events. The 77389 ZIP code overlaps with The Woodlands and carries elevated freeze exposure.",
    homeAge:
      "Wide range from 1970s-era neighborhoods near Old Town Spring to active new construction in the Klein ISD corridor.",
    hoaNote:
      "HOA presence varies. Master-planned communities in Klein ISD have active property standards. Older Spring neighborhoods may not have HOA oversight.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "Progressive", typicalDiscount: "4-8%" },
      { name: "Nationwide", typicalDiscount: "5-8%" },
      { name: "Liberty Mutual", typicalDiscount: "5-10%" },
      { name: "Texas Farm Bureau", typicalDiscount: "5-10%" },
    ],
    hoFormScenario:
      "A 2005 Klein ISD home on HO-3 form with replacement cost: a water heater supply line failure settles at $12,400. On HO-A form, the same event settles at $4,100 after depreciation.",
    caseStudy: {
      name: "The Davis Family",
      neighborhood: "Klein ISD zone, Spring",
      premium: "$4,200/yr",
      event:
        "February 2024 freeze. Overnight low of 21F. Garage-routed supply line cracked at a 90-degree elbow.",
      deviceCaught:
        "StreamLabs detected flow anomaly at 5:12 AM and shut the main. Water damage was limited to a 2-square-foot area of drywall at the elbow location.",
      outcome:
        "Estimated avoided damage: $8,000 to $15,000. The drywall patch cost $280. Applied a 5% water-damage credit at renewal, saving $210/yr.",
    },
    cityFaqs: [
      {
        q: "Do you service Old Town Spring and the Klein ISD corridor?",
        a: "Yes. We install throughout Spring including Old Town Spring, Champions area, Klein ISD neighborhoods, and the 77389 overlap with The Woodlands.",
      },
      {
        q: "My premium is under $4,000. Is the install still worth it?",
        a: "At a $3,800 premium with a 5% credit, you save $190/yr and the install pays back in about 5 years. At 10%, you save $380/yr and pay back in under 3 years. The savings are real but the timeline is longer on lower premiums.",
      },
      {
        q: "Can you install on homes built in the 1970s?",
        a: "Yes. Older homes often have galvanized or copper supply lines. We install the device at the main regardless of interior pipe material. Older homes also tend to benefit the most from the shutoff protection itself.",
      },
    ],
    whyInstall: [
      "Spring's north Harris location means colder overnight lows during Texas freeze events. Homes in the 77373 and 77388 ZIP codes logged significant claim volume during Winter Storm Uri. Carriers have adjusted rates upward for this area.",
      "The Klein ISD corridor has a mix of home ages, from 1990s development to active new construction. Regardless of age, the insurance discount applies at the same tier. The device earns the credit, the home age does not affect it.",
    ],
  },
  baytown: {
    name: "Baytown",
    slug: "baytown",
    county: "Harris / Chambers",
    medianHome: "$260,000",
    medianHomeNum: 260000,
    typicalPremium: "$3,600 to $5,400",
    zips: ["77520", "77521", "77523"],
    heroNote: "Coastal exposure, hurricane and freeze risk",
    schoolDistrict: "Goose Creek CISD",
    freezeRisk:
      "Baytown faces a dual risk profile: coastal wind and flood exposure plus inland freeze risk. Winter Storm Uri caused significant pipe damage in Baytown despite the coastal location.",
    homeAge:
      "Mix of older neighborhoods near the ship channel (1950s to 1970s) and newer development in the 77523 corridor (2000s to present).",
    hoaNote:
      "HOA presence is less consistent than in master-planned communities to the west. Individual homeowner insurance management is more common.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "Texas Farm Bureau", typicalDiscount: "5-10%" },
      { name: "Progressive", typicalDiscount: "4-8%" },
      { name: "Nationwide", typicalDiscount: "5-8%" },
      { name: "Farmers", typicalDiscount: "5-8%" },
    ],
    hoFormScenario:
      "A Baytown home on HO-B form: a water heater tank failure settles at $9,800 replacement cost including remediation. On HO-A form with depreciation, the same event settles at $3,200. Baytown homeowners on HO-A form are effectively self-insuring the difference.",
    caseStudy: {
      name: "The Johnson Family",
      neighborhood: "West Baytown",
      premium: "$4,800/yr",
      event:
        "January 2024 freeze event. Exterior hose bib froze and the pressure spike cracked an interior fitting downstream.",
      deviceCaught:
        "Moen Flo detected the flow spike within 12 seconds and shut the main. The fitting crack was contained to a drip.",
      outcome:
        "Estimated avoided damage: $6,000 to $12,000. Applied a 5% credit at renewal, saving $240/yr.",
    },
    cityFaqs: [
      {
        q: "Does the coastal wind exposure affect the water-damage discount?",
        a: "No. The water-damage discount is separate from wind/hail coverage. Your smart shutoff certificate applies specifically to the water-damage portion of your policy, regardless of your home's wind exposure rating.",
      },
      {
        q: "My home is near the ship channel and was built in the 1960s. Can you install?",
        a: "Yes. We install on homes of any age. Older homes with galvanized or copper lines benefit significantly from both the insurance discount and the actual leak protection.",
      },
      {
        q: "Is Baytown in your primary service area?",
        a: "Yes. Baytown is within our standard service radius. No travel surcharge for 77520, 77521, and 77523 ZIP codes.",
      },
    ],
    whyInstall: [
      "Baytown carries a dual risk profile that carriers price accordingly. Between coastal exposure and freeze risk, Baytown premiums run higher relative to home values than most Houston suburbs. The water-damage credit is one of the few tools homeowners have to push premiums down without changing coverage.",
      "Older Baytown housing stock with galvanized and copper supply lines is at higher risk for both freeze-related and age-related pipe failure. The smart shutoff mitigates both risk categories, and the insurance discount applies regardless of the home's age.",
    ],
  },
  houston: {
    name: "Houston",
    slug: "houston",
    county: "Harris",
    medianHome: "$340,000",
    medianHomeNum: 340000,
    typicalPremium: "$4,200 to $6,600",
    zips: ["multiple neighborhoods served across 88 ZIP codes"],
    heroNote: "Houston proper, 88 distinct neighborhoods served",
    schoolDistrict: "Houston ISD / Multiple districts",
    freezeRisk:
      "Houston proper experienced the full impact of Winter Storm Uri. Inner Loop neighborhoods with older housing stock and Heights-area homes with pier-and-beam construction were particularly vulnerable.",
    homeAge:
      "Houston spans every era from 1920s bungalows in the Heights to new construction in the Energy Corridor. The majority of claims during Uri came from homes built between 1970 and 2005.",
    hoaNote:
      "HOA presence varies dramatically across Houston's 88 neighborhoods. Inner Loop areas like Montrose and the Heights have minimal HOA oversight. Master-planned communities in West Houston are heavily regulated.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "Allstate", typicalDiscount: "7-12%" },
      { name: "Farmers", typicalDiscount: "5-8%" },
      { name: "Travelers", typicalDiscount: "6-10%" },
      { name: "Liberty Mutual", typicalDiscount: "5-10%" },
      { name: "Chubb", typicalDiscount: "10-15%" },
    ],
    hoFormScenario:
      "A Heights bungalow on HO-3 form: a 1960s-era galvanized supply line failure behind a bathroom wall settles at $24,000 including mold remediation. On HO-A form, the same event settles at $7,800. On a home that age, the depreciation gap is severe.",
    caseStudy: {
      name: "The Chen Family",
      neighborhood: "Heights",
      premium: "$6,100/yr",
      event:
        "January 2024 freeze. Pier-and-beam crawl space exposed supply lines to below-freezing air for 8 hours.",
      deviceCaught:
        "Phyn detected the pressure drop at 2:38 AM and closed the main. Morning inspection found a cracked fitting under the house with no water release.",
      outcome:
        "Estimated avoided damage: $20,000 to $40,000 based on comparable Heights pier-and-beam claims. Applied a 10% credit through USAA, saving $610/yr.",
    },
    cityFaqs: [
      {
        q: "Do you install in all Houston neighborhoods?",
        a: "Yes. We service 88 neighborhoods across Houston including the Heights, Montrose, River Oaks, West University, Bellaire, Meyerland, Memorial, Energy Corridor, and all HISD-zone areas.",
      },
      {
        q: "My home is pier-and-beam construction. Does that change the install?",
        a: "No. The device installs on the domestic water line regardless of foundation type. Pier-and-beam homes actually benefit more from the shutoff because crawl-space supply lines have higher freeze exposure than slab-routed lines.",
      },
      {
        q: "Which Houston ZIP codes do you serve?",
        a: "All of them within the Houston metro. If your home is in Harris County or adjacent counties (Fort Bend, Montgomery, Chambers, Waller, Galveston), you are in our service area.",
      },
    ],
    whyInstall: [
      "Houston is the epicenter of the Texas homeowners insurance crisis. The average Houston household pays $6,600/yr in premiums. A 10% water-damage credit puts $660 back in your pocket annually. Over 10 years, that is $6,600, more than 6x the cost of the install.",
      "The city spans every construction era and pipe material. Whether you have a 1960s galvanized system in the Heights or PEX in a 2023 Energy Corridor build, the insurance discount applies at the same tier. The certificate is what the carrier needs, not a specific pipe material.",
      "Houston carriers are actively tightening underwriting on water damage claims. Several major carriers now offer preferential renewal terms to homeowners with documented smart shutoff installations. The HydroSense certificate positions you on the right side of that underwriting shift.",
    ],
  },
  galveston: {
    name: "Galveston",
    slug: "galveston",
    county: "Galveston",
    medianHome: "$320,000",
    medianHomeNum: 320000,
    typicalPremium: "$5,400 to $9,200",
    zips: ["77550", "77551", "77553", "77554"],
    heroNote:
      "Beach houses, vacation rentals, year-round and seasonal occupancy",
    schoolDistrict: "Galveston ISD",
    freezeRisk:
      "Galveston's island location provides some thermal buffering, but hard freezes still reach the island. Winter Storm Uri caused widespread pipe failures in beach houses and rental properties that sat unoccupied during the freeze. Vacation homes without anyone on-site to cut the water are the highest-risk category for catastrophic damage.",
    homeAge:
      "Housing stock ranges from historic Strand-area homes built in the 1890s to modern beachfront construction on the west end. Elevated pier-and-beam homes have exposed underfloor plumbing that is particularly freeze-vulnerable.",
    hoaNote:
      "Many Galveston beach communities and rental complexes require documented water mitigation for properties listed on Airbnb, VRBO, and other short-term rental platforms. Property managers increasingly list smart shutoff installation as a condition of management agreements.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "Texas Farm Bureau", typicalDiscount: "5-10%" },
      { name: "Allstate", typicalDiscount: "7-12%" },
      { name: "Nationwide", typicalDiscount: "5-8%" },
    ],
    hoFormScenario:
      "A west-end beach house on HO-3 form: a supply line failure while the owner is in Houston settles at $28,000 for full remediation including mold treatment in the salt-air environment. On HO-A form, the same event settles at $9,400 after depreciation. On vacation properties, the form difference is amplified because undetected leaks run longer.",
    caseStudy: {
      name: "The Warren Family",
      neighborhood: "West End, Galveston",
      premium: "$7,800/yr",
      event:
        "January 2024 freeze. Beach house unoccupied for two weeks. Overnight low hit 24F. Supply line under the elevated first floor cracked at a copper fitting.",
      deviceCaught:
        "Moen Flo detected abnormal flow at 1:48 AM and shut the main remotely. The owner received a phone alert in Houston 45 minutes away. Morning inspection found the crack with no water damage.",
      outcome:
        "Estimated avoided damage: $25,000 to $45,000 based on comparable unoccupied beach house claims. The family applied an 8% water-damage credit at renewal, saving $624/yr.",
    },
    cityFaqs: [
      {
        q: "Do you install in vacation rental properties on Galveston Island?",
        a: "Yes. We install on beach houses, vacation rentals, and year-round residences across the island including the West End, East Beach, and the Strand area. Many of our Galveston installs are for Houston-based owners who need remote monitoring.",
      },
      {
        q: "Does salt air affect the device?",
        a: "The device installs on the domestic water line inside the home or in a utility closet, not in direct salt-air exposure. All four devices we install are rated for indoor residential use. The salt-air environment does accelerate pipe corrosion, which is one more reason a shutoff device is valuable on the island.",
      },
      {
        q: "Can I monitor my Galveston property from Houston?",
        a: "Yes. All four devices include a smartphone app with real-time flow monitoring and instant alerts. If the device detects an anomaly, it shuts the main automatically and notifies you immediately, whether you are in Houston, Dallas, or anywhere else.",
      },
    ],
    whyInstall: [
      "Galveston vacation properties carry some of the highest insurance premiums in the Houston metro due to combined wind, flood, and water damage exposure. Premiums on island properties routinely exceed $7,000/yr. A 10% water-damage credit puts $700+ back in your pocket annually.",
      "The core risk on vacation properties is unoccupied time. A burst pipe in an occupied home gets caught in minutes. The same failure in an empty beach house runs for hours or days. A smart shutoff closes the main in seconds whether anyone is home or not. For Airbnb and VRBO hosts, this is the difference between a maintenance call and a $40,000 remediation.",
      "Galveston property managers are increasingly requiring documented water mitigation as a condition of management agreements. The HydroSense certificate satisfies that requirement and positions your property favorably with both your insurer and your property manager.",
    ],
    vacationRental: true,
  },
  "lake-conroe": {
    name: "Lake Conroe",
    slug: "lake-conroe",
    county: "Montgomery",
    medianHome: "$420,000",
    medianHomeNum: 420000,
    typicalPremium: "$5,000 to $7,400",
    zips: ["77301", "77302", "77303", "77304", "77316", "77356"],
    heroNote:
      "Lake houses, second homes, weekend occupancy, owners often Houston-based",
    schoolDistrict: "Conroe ISD / Montgomery ISD",
    freezeRisk:
      "Lake Conroe sits in Montgomery County, north of Houston, where winter temperatures consistently run 3 to 5 degrees colder than the city. Second homes that sit unoccupied during weekdays are the highest-risk category. No one is home to notice a drip, cut the water, or call a plumber. Winter Storm Uri caused severe damage to lake houses where owners could not reach their properties for days.",
    homeAge:
      "Mix of 1990s-era lakefront development and newer luxury construction from 2010 to present. April Sound, Walden, and Del Lago date to the 1980s and 1990s. Newer communities like Grand Harbor and The Reserve are 2015+.",
    hoaNote:
      "Lakefront HOAs and POAs in communities like April Sound and Walden have tightened property maintenance standards. Water damage that goes undetected in a weekend home creates mold issues that affect neighboring properties.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "USAA", typicalDiscount: "8-15%" },
      { name: "Chubb", typicalDiscount: "10-15%" },
      { name: "Travelers", typicalDiscount: "6-10%" },
      { name: "Farmers", typicalDiscount: "5-8%" },
    ],
    hoFormScenario:
      "A $500,000 lakefront home on HO-3 form: a second-floor bathroom supply line failure while the owner is in Houston for the workweek settles at $38,000 for full remediation. On HO-A form, the same event settles at $12,600. On high-value second homes, the form gap is substantial.",
    caseStudy: {
      name: "The Brooks Family",
      neighborhood: "Walden on Lake Conroe",
      premium: "$6,400/yr",
      event:
        "February 2024 freeze. Lake house unoccupied Monday through Thursday. Temperature dropped to 20F on Wednesday night. CPVC supply line in the attic cracked at a tee fitting.",
      deviceCaught:
        "Phyn detected the pressure anomaly at 11:22 PM and shut the main automatically. The owner in Katy received an immediate alert. Thursday morning inspection found the crack with zero water release.",
      outcome:
        "Estimated avoided damage: $30,000 to $50,000 based on comparable unoccupied lakefront claims. Applied a 10% credit through USAA, saving $640/yr.",
    },
    cityFaqs: [
      {
        q: "Do you install in April Sound and Walden?",
        a: "Yes. We service all Lake Conroe communities including April Sound, Walden, Del Lago, Grand Harbor, The Reserve, Bentwater, and lakefront properties in Conroe, Montgomery, and Willis.",
      },
      {
        q: "My lake house is only occupied on weekends. Is that when most damage happens?",
        a: "Unoccupied time is when damage escalates. A burst pipe in an occupied home gets caught quickly. The same failure in a weekend-only home can run for days before anyone notices. The smart shutoff closes the main within seconds regardless of occupancy.",
      },
      {
        q: "I am based in Houston. Can I monitor my Lake Conroe property remotely?",
        a: "Yes. All four devices include smartphone apps with real-time monitoring and instant push alerts. If a leak is detected, the valve closes automatically and you are notified immediately. No need to drive up to check.",
      },
    ],
    whyInstall: [
      "Lake Conroe is one of the most active second-home markets in the Houston metro. Most owners live in Houston, Katy, or The Woodlands and visit on weekends. That leaves the property unoccupied 5 days a week during which a pipe failure can run undetected. A smart shutoff closes the main in seconds whether anyone is home or not.",
      "Montgomery County winter temperatures run 3 to 5 degrees colder than central Houston. Lake Conroe properties with attic-routed plumbing face elevated freeze risk, compounded by the fact that HVAC may be set to a lower temperature during unoccupied periods. The shutoff device protects the home even when the thermostat is dialed down.",
      "High-value lakefront homes carry premiums in the $5,000 to $7,400 range. A 10% water-damage credit on a $6,400 premium returns $640/yr, paying back the install in under 18 months. For second-home owners already carrying the overhead of a lake property, the credit is one of the simplest ways to reduce carrying cost.",
    ],
    vacationRental: true,
  },
  "lake-livingston": {
    name: "Lake Livingston",
    slug: "lake-livingston",
    county: "Polk / San Jacinto / Trinity",
    medianHome: "$240,000",
    medianHomeNum: 240000,
    typicalPremium: "$3,200 to $5,000",
    zips: ["77351", "77360", "77331", "77334"],
    heroNote:
      "Weekend cabins, retirement homes, mixed occupancy, Houston and East Texas owners",
    schoolDistrict: "Livingston ISD / Coldspring-Oakhurst CISD",
    freezeRisk:
      "Lake Livingston is 80 miles north of Houston in the Piney Woods. Winter temperatures regularly drop below 25F, colder than anywhere in the Houston metro. Weekend cabins and seasonal homes often have minimal insulation and exposed plumbing under pier-and-beam construction. During Winter Storm Uri, the Livingston area experienced prolonged sub-freezing conditions that caused widespread pipe failures in unoccupied lake cabins.",
    homeAge:
      "Housing stock ranges from 1970s-era fishing cabins to modern lakefront retirement homes built in the 2010s. Older cabins in Onalaska and along FM 356 have galvanized and copper plumbing that is highly freeze-vulnerable. Newer construction in Cape Royale and Westwood Shores uses PEX but still benefits from the shutoff.",
    hoaNote:
      "POA presence varies. Cape Royale and Westwood Shores have active property owner associations. Many lakefront lots outside organized communities have no HOA. Individual insurance management is the norm.",
    carriers: [
      { name: "State Farm", typicalDiscount: "5-10%" },
      { name: "Texas Farm Bureau", typicalDiscount: "5-10%" },
      { name: "Farmers", typicalDiscount: "5-8%" },
      { name: "Nationwide", typicalDiscount: "5-8%" },
      { name: "Progressive", typicalDiscount: "4-8%" },
    ],
    hoFormScenario:
      "A Lake Livingston cabin on HO-B form: a supply line failure while the owner is in Houston settles at $14,000 for remediation including mold treatment. On HO-A form, the same event settles at $4,800 after depreciation. On older cabins with limited insulation, mold escalation is faster and remediation costs are proportionally higher.",
    caseStudy: {
      name: "The Hernandez Family",
      neighborhood: "Onalaska, Lake Livingston",
      premium: "$4,200/yr",
      event:
        "January 2024 freeze. Weekend cabin unoccupied. Temperature hit 18F. Copper supply line under the pier-and-beam foundation cracked at a 90-degree elbow.",
      deviceCaught:
        "StreamLabs detected the flow anomaly at 3:15 AM and closed the valve. The owner in Spring received an alert and arranged a plumber visit for the following day. Inspection found the crack with no water damage.",
      outcome:
        "Estimated avoided damage: $12,000 to $22,000 based on comparable unoccupied cabin claims. Applied a 5% credit at renewal, saving $210/yr.",
    },
    cityFaqs: [
      {
        q: "Do you install at Lake Livingston? That is further out than Houston.",
        a: "Yes. Lake Livingston is within our extended service area. We service Livingston, Onalaska, Coldspring, and surrounding lake communities. There is no travel surcharge for the ZIP codes we cover.",
      },
      {
        q: "My cabin is pier-and-beam with exposed plumbing underneath. Does that work?",
        a: "Yes. The device installs on the domestic water line regardless of foundation type. Pier-and-beam homes with exposed underfloor plumbing actually benefit the most from the shutoff because those pipes have the highest freeze exposure.",
      },
      {
        q: "My lake house has well water, not city water. Can you still install?",
        a: "Yes. The device can be installed on well systems after the pressure tank on the domestic supply line into the home. The installation is similar to city water but positioned downstream of the well equipment.",
      },
    ],
    whyInstall: [
      "Lake Livingston is 80 miles north of Houston in the East Texas Piney Woods. Winter temperatures regularly drop below 25F, colder than anywhere in the Houston metro. Weekend cabins and seasonal homes that sit empty during freezes are the highest-risk category for catastrophic pipe damage. A smart shutoff closes the main within seconds whether anyone is on-site or not.",
      "Many Lake Livingston properties are owned by Houston or East Texas families who visit on weekends and holidays. That leaves the property unoccupied most of the time. The combination of older plumbing, minimal insulation, and extended unoccupied periods creates a risk profile that carriers recognize. A smart shutoff device addresses the root cause: no one is there to cut the water when something fails.",
      "Lake Livingston premiums are lower than Houston metro averages but the percentage credit is the same. A 5% credit on a $4,200 premium returns $210/yr. At 10%, that is $420/yr. The install pays for itself in 2 to 5 years depending on your carrier, and the actual leak protection is immediate.",
    ],
    vacationRental: true,
  },
};

export const cityKeys = Object.keys(cities);
