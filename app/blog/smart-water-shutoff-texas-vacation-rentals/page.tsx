import { Metadata } from "next";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "Smart Water Shutoff for Texas Vacation Rentals: Galveston, Lake Conroe, Lake Livingston | HydroSense",
  description:
    "Why Texas vacation rental owners in Galveston, Lake Conroe, and Lake Livingston need a certified smart water shutoff. Insurance credits, 8-second response, remote monitoring from anywhere.",
  keywords: [
    "smart water shutoff vacation rental texas",
    "vacation home water protection",
    "airbnb water damage prevention texas",
    "galveston lake conroe lake livingston vacation home insurance",
  ],
  alternates: {
    canonical:
      "https://hydrosensetx.com/blog/smart-water-shutoff-texas-vacation-rentals",
  },
  openGraph: {
    title:
      "Smart Water Shutoff for Texas Vacation Rentals | HydroSense Texas",
    description:
      "A pipe fails Monday at a Lake Conroe weekend house. Next guest checks in Sunday. 144 hours of undetected water. This is the guide to preventing that.",
    url: "https://hydrosensetx.com/blog/smart-water-shutoff-texas-vacation-rentals",
    siteName: "HydroSense Texas",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Smart Water Shutoff for Texas Vacation Rentals | HydroSense Texas",
    description:
      "Why Galveston, Lake Conroe, and Lake Livingston owners are installing smart shutoffs. Insurance credits, remote monitoring, 8-second response.",
  },
};

export default function VacationRentalPillarPost() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hydrosensetx.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://hydrosensetx.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Smart Water Shutoff for Texas Vacation Rentals",
        item: "https://hydrosensetx.com/blog/smart-water-shutoff-texas-vacation-rentals",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Smart Water Shutoff for Texas Vacation Rentals: A Galveston, Lake Conroe, and Lake Livingston Owner's Guide",
    author: { "@type": "Organization", name: "HydroSense Texas" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    description:
      "Why Texas vacation rental owners in Galveston, Lake Conroe, and Lake Livingston need a certified smart water shutoff. Insurance credits, 8-second response, remote monitoring.",
    mainEntityOfPage:
      "https://hydrosensetx.com/blog/smart-water-shutoff-texas-vacation-rentals",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I monitor my vacation home's water shutoff from the app while I'm away?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All four devices we install include a smartphone app with real-time flow monitoring. If the device detects an anomaly, it shuts the main automatically and sends you a push notification and SMS. You can also manually close the valve from the app at any time.",
        },
      },
      {
        "@type": "Question",
        name: "What if a guest accidentally trips the shutoff?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The device monitors for leak patterns, not normal household use. Running showers, filling a pool, and watering the lawn do not trigger a shutoff. After the initial learning period (1 to 7 days depending on device), false positives are rare. If a shutoff does trigger, you can reopen the valve from the app in seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Does the smart water shutoff work with a property manager's account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All four devices support shared access. You can grant your property manager monitoring and control access without giving them your login. Some property managers in Galveston and Lake Conroe already require documented water mitigation as a condition of their management agreements.",
        },
      },
      {
        "@type": "Question",
        name: "What about a vacation home in another state?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We currently install in the Houston metro, Galveston, Lake Conroe, and Lake Livingston areas. The device itself works anywhere with Wi-Fi and a standard main water line. If your out-of-state property has a local plumber who can install, the same device and app monitoring will work.",
        },
      },
      {
        "@type": "Question",
        name: "Does the insurance certificate transfer if I sell the property?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The device stays with the property. The new owner can contact us to transfer the certificate into their name and provide it to their carrier. We reissue the certificate at no charge for ownership transfers.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="bg-ink-950">
        {/* Breadcrumb + Hero */}
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-sm text-fog-400 mb-8">
              <a href="/" className="hover:text-fog-200 transition-colors">
                Home
              </a>
              <span className="mx-2">/</span>
              <a
                href="/blog/smart-water-shutoff-texas-vacation-rentals"
                className="text-fog-200"
              >
                Blog
              </a>
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Vacation home water protection
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-fog-50 mb-8">
              Smart Water Shutoff for Texas Vacation Rentals: A Galveston, Lake
              Conroe, and Lake Livingston Owner&apos;s Guide
            </h1>
            <p className="text-fog-400 text-sm">
              Published May 28, 2026
            </p>
          </div>
        </section>

        {/* Article body */}
        <article className="pb-20 lg:pb-28">
          <div className="section-container max-w-3xl space-y-16">
            {/* Intro */}
            <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
              <p>
                A pipe fitting fails Monday morning at a Lake Conroe weekend house. The owner is in
                Houston, 70 miles south. The property manager does not have a site visit scheduled
                until Thursday. The next guest does not check in until Sunday. By the time anyone
                walks through the door, water has been running for 144 hours straight.
              </p>
              <p>
                At a primary residence, someone notices a wet floor within hours. The same failure in a
                vacation home runs undetected for days. What would be a $35,000 insurance claim at a
                primary residence becomes a $150,000 total loss at a vacation property: subfloor
                replacement, mold remediation across multiple rooms, structural drying, furniture
                replacement, and weeks of lost rental income.
              </p>
              <p>
                This is not a hypothetical worst case. This is the claim pattern that drives vacation
                home insurance premiums in Galveston, Lake Conroe, and Lake Livingston above primary
                residence rates. The variable is not the pipe. It is the time between failure and
                detection. A smart water shutoff eliminates that variable by closing the main within
                8 seconds, whether anyone is on the property or not.
              </p>
            </div>

            {/* H2: Why vacation homes carry higher risk */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Why vacation homes carry higher water damage risk than primary residences
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The risk profile of a vacation home is fundamentally different from a primary
                  residence. Five factors compound to create a scenario where water damage claims are
                  both more frequent and more severe.
                </p>
                <p>
                  The first factor is unoccupied time. A primary residence is empty 8 to 10 hours a
                  day while the family is at work and school. A vacation home can sit empty for 5 to
                  25 days at a stretch between visits or guest stays. Every additional hour of
                  unoccupied time is an hour that a leak runs without detection.
                </p>
                <p>
                  The second factor is occupant awareness. In your own home, you know where the main
                  shutoff is. Your family knows what a dripping sound behind a wall means. A
                  short term rental guest does not know where the shutoff is, does not know the
                  sounds of the house, and may not report a slow drip to the property manager until
                  checkout day.
                </p>
                <p>
                  The third factor is distance. Most Galveston beach houses are owned by families in
                  Houston, 60 to 90 minutes away. Lake Conroe owners are typically 45 to 70 minutes
                  from their property. Lake Livingston owners are 90 minutes to 2 hours out. When a
                  pipe fails, you cannot walk downstairs and close the valve. You are driving an hour
                  while water runs.
                </p>
                <p>
                  The fourth factor is property value. A typical Galveston beach house is valued
                  around $450,000. Lake Conroe waterfront homes average $550,000. Lake Livingston
                  properties, including cabins and retirement homes, average $325,000. Higher property
                  values mean higher premiums and larger absolute dollar exposure on every claim.
                </p>
                <p>
                  The fifth factor is weather exposure. Texas vacation markets face a unique
                  combination of hurricane risk, hard freeze cycles, and storm surge. Galveston adds
                  salt air corrosion to the equation, which accelerates pipe fitting degradation on a
                  timeline that most inland homeowners never encounter. Lake Conroe and Lake
                  Livingston sit north of Houston where winter temperatures run 3 to 5 degrees colder,
                  and weekend homes with HVAC set low during unoccupied periods are especially
                  vulnerable during freeze events.
                </p>
              </div>
            </section>

            {/* H2: Insurance reality */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The insurance reality for Texas vacation rentals
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Standard HO-3 homeowners policies often exclude or limit coverage for properties
                  used for commercial purposes, including paid short term rental stays. If you list
                  your beach house on Airbnb or VRBO and file a water damage claim, your carrier may
                  deny it based on the commercial use exclusion. Many vacation rental owners discover
                  this gap only after the damage is already done.
                </p>
                <p>
                  The most common policy type for Texas vacation rentals is the DP-3 dwelling fire
                  policy, which covers the structure on an open peril basis. Some owners carry
                  specialized short term rental insurance from providers like Proper Insurance or add
                  an STR rider to an HO-5 policy. Regardless of the policy type, water damage is the
                  number one claim category across all of them.
                </p>
                <p>
                  Here is the part that matters for your premium: most Texas carriers offer 5% to 15%
                  credit on the water damage portion of the premium for a certified smart water
                  shutoff installation. On a vacation home premium of $6,000 to $9,000 per year, that
                  credit translates to $400 to $700 in annual savings. The credit applies every year
                  the device is installed and the certificate is on file.
                </p>
                <p>
                  Some specialized vacation rental insurers are going further. A growing number of STR
                  policies now list documented water mitigation as a condition of coverage, not just a
                  discount opportunity. If this trend continues, a smart shutoff may become a
                  requirement for certain vacation rental policies in Texas within the next 2 to 3
                  years.
                </p>
                <p>
                  For background on how policy forms affect water damage settlements at primary
                  residences, see our{" "}
                  <a
                    href="/insurance/ho-a-vs-ho-b-ho-3"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    HO-A vs HO-B vs HO-3 guide
                  </a>
                  . The principles are the same for vacation properties, but the stakes are higher
                  because undetected leaks run longer and damage accumulates faster.
                </p>
              </div>
            </section>

            {/* H2: Three markets */}
            <section className="space-y-8">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The three Texas vacation home markets we serve
              </h2>

              <div className="space-y-5">
                <h3 className="font-display text-xl text-fog-50">Galveston</h3>
                <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                  <p>
                    Galveston Island has one of the densest concentrations of short term vacation
                    rentals in Texas. The Strand district, Pirates Beach, and the entire west end of
                    the island are dominated by Airbnb and VRBO listings. Many of these properties
                    turn over guests weekly during peak season and sit empty for stretches during the
                    off season.
                  </p>
                  <p>
                    The island adds a risk factor that inland properties do not face: salt air
                    corrosion. Salt spray accelerates the degradation of copper and brass pipe
                    fittings, particularly in elevated pier and beam beach houses where underfloor
                    plumbing is exposed to the coastal environment. Fitting failures on Galveston
                    properties occur on a shorter timeline than identical fittings in Houston or Katy.
                  </p>
                  <p>
                    Hurricane exposure adds a second dimension. Even when the storm itself does not
                    cause direct damage, the power outages and pressure fluctuations that follow a
                    hurricane season event can trigger latent pipe failures. A smart shutoff protects
                    the property through the power restoration cycle when pressure surges are most
                    common.
                  </p>
                  <p>
                    See the full{" "}
                    <a
                      href="/service-area/galveston"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      Galveston service area page
                    </a>{" "}
                    for local carrier data, ZIP codes served, and case study.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="font-display text-xl text-fog-50">Lake Conroe</h3>
                <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                  <p>
                    Lake Conroe is the highest value second home market in the Houston metro.
                    Communities like Walden, April Sound, Del Lago, Grand Harbor, and Bentwater draw
                    primarily Houston based owners who use the properties on weekends and holidays.
                    The typical pattern is 2 days occupied, 5 days empty, every week.
                  </p>
                  <p>
                    Winter Storm Uri in 2021 exposed the vulnerability of this pattern. Lake Conroe
                    properties sat empty during the freeze because owners could not reach them. Pipes
                    failed on Tuesday. Owners did not arrive until Saturday. By then, the damage had
                    escalated from a burst fitting to a full floor remediation. The claims that came
                    out of Uri at Lake Conroe were among the most expensive per property in the
                    Houston metro because of the extended undetected run time.
                  </p>
                  <p>
                    Montgomery County winter temperatures consistently run 3 to 5 degrees colder than
                    central Houston. Properties with HVAC set to 55 or 60 degrees during unoccupied
                    periods are at elevated risk when overnight lows drop below 25 degrees.
                  </p>
                  <p>
                    See the full{" "}
                    <a
                      href="/service-area/lake-conroe"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      Lake Conroe service area page
                    </a>{" "}
                    for carrier data and local install details.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="font-display text-xl text-fog-50">Lake Livingston</h3>
                <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                  <p>
                    Lake Livingston is the largest lake in Texas and draws a mix of weekend cabin
                    owners and retirees. Ownership is split between Houston families and East Texas
                    residents. Properties range from 1970s era fishing cabins in Onalaska to newer
                    lakefront retirement homes in Cape Royale and Westwood Shores.
                  </p>
                  <p>
                    The freeze risk at Lake Livingston is the most severe of the three markets. The
                    lake sits 80 miles north of Houston in the Piney Woods, where winter temperatures
                    regularly drop below 25 degrees. Older cabins with galvanized and copper plumbing,
                    minimal wall insulation, and pier and beam construction have the highest failure
                    rates during hard freezes.
                  </p>
                  <p>
                    Some Lake Livingston properties use well water rather than city water. Smart
                    shutoff devices install downstream of the pressure tank on well systems. The
                    monitoring and automatic shutoff function identically to city water installations.
                  </p>
                  <p>
                    See the full{" "}
                    <a
                      href="/service-area/lake-livingston"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      Lake Livingston service area page
                    </a>{" "}
                    for carrier data and well water install details.
                  </p>
                </div>
              </div>
            </section>

            {/* H2: What a certified shutoff does */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                What a certified smart water shutoff actually does
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  A smart water shutoff is a single device installed on the main water line where it
                  enters the home. It replaces or augments the manual shutoff valve that most
                  homeowners never touch. The device does four things continuously.
                </p>
                <p>
                  First, it monitors flow 24 hours a day, 7 days a week. It learns the normal usage
                  patterns of the property, including the difference between a running shower and a
                  slow leak behind a wall. Second, it detects abnormal patterns: sustained flow when
                  no one is home, micro leaks that develop over hours, and pressure drops consistent
                  with freeze related pipe failure. Third, when an anomaly is confirmed, it
                  automatically closes the valve within approximately 8 seconds. No human
                  intervention required. Fourth, it sends push notifications and SMS alerts to the
                  owner regardless of where they are.
                </p>
                <p>
                  The insurance component is the certificate. After professional installation and
                  final payment, HydroSense issues a carrier recognized certificate in paper and
                  digital form. This is the document your insurance carrier needs to apply the water
                  damage credit to your policy. We reissue the certificate annually.
                </p>
                <p>
                  We install four devices depending on the property:{" "}
                  <a
                    href="/devices"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Flo by Moen, Phyn Plus, StreamLabs Control, and Guardian by Elexa
                  </a>
                  . Device selection depends on pipe material, plumbing layout, and whether the
                  property has city water or a well system. We match the device to the property during
                  the 15 minute assessment call.
                </p>
              </div>
            </section>

            {/* H2: Install process */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The install process for beach and lake houses
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The install process for vacation properties follows the same six steps as primary
                  residences, with a few adjustments for the travel logistics and property types
                  common in the three markets.
                </p>
                <p>
                  The process starts with a 15 minute phone assessment. We confirm your carrier, the
                  property location, plumbing configuration, and whether the home is on city water or
                  well water. For beach and lake houses, we also ask about foundation type (slab vs.
                  pier and beam) and whether the main line enters from underneath or through a utility
                  closet.
                </p>
                <p>
                  We travel to all three markets from our Houston base. Galveston installs are
                  scheduled in batches to serve the island efficiently. Lake Conroe and Lake
                  Livingston installs are scheduled based on geographic clustering. Typical lead time
                  from assessment to completed install is 7 to 10 business days for vacation
                  properties, slightly longer than the 5 to 7 day window for Houston metro primary
                  residences.
                </p>
                <p>
                  Older lake cabins sometimes require a small reroute at the main entry point. If the
                  existing shutoff valve is corroded, buried behind a wall, or in a location that
                  makes device mounting impractical, we relocate the entry point to an accessible
                  location. This is included in the install scope when identified during the
                  assessment.
                </p>
                <p>
                  All installations are performed by licensed plumbing professionals operating under a
                  Texas Master Plumber license. Install takes approximately 2 hours on site. After
                  install, we configure the device, connect it to Wi-Fi, walk through the app with
                  you (in person or over the phone for remote owners), and hand off monitoring access.
                  The certificate is issued after final payment in both paper and digital form.
                </p>
              </div>
            </section>

            {/* H2: The math */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The math on a $999 install
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The economics of a smart shutoff on a vacation property are more favorable than on a
                  primary residence because vacation premiums are higher and the avoided loss exposure
                  is larger.
                </p>
                <p>
                  On the credit side: vacation home premiums in these three markets range from $3,200
                  per year at Lake Livingston to $9,200 per year at Galveston. A 5% to 15% water
                  damage credit translates to $400 to $700 per year in typical savings. On a $999
                  install, the payback period on credit alone is 18 to 24 months.
                </p>
              </div>

              {/* Data callout */}
              <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                <div className="grid sm:grid-cols-3 gap-8">
                  <div>
                    <p className="font-mono text-3xl text-signal-400 tracking-tight">
                      $400-$700
                    </p>
                    <p className="text-sm text-fog-300 mt-2">
                      Typical annual insurance credit on a vacation home
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl text-hydro-400 tracking-tight">
                      18-24 mo
                    </p>
                    <p className="text-sm text-fog-300 mt-2">
                      Payback period on credit alone
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl text-signal-400 tracking-tight">
                      $150,000
                    </p>
                    <p className="text-sm text-fog-300 mt-2">
                      Potential total loss from undetected 6 day leak
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  On the avoided loss side: the math is more substantial and harder to ignore. A
                  6 day undetected leak at a vacation property produces an average claim of $75,000 to
                  $150,000 depending on the property. The expected value of a single avoided incident
                  exceeds the install cost by 75 to 150 times. Even if you assign a conservative 2%
                  annual probability to a multi day leak event, the expected annual loss avoidance is
                  $1,500 to $3,000.
                </p>
                <p>
                  Combined, the insurance credit plus the expected loss avoidance make the $999
                  install one of the highest return investments available on a vacation property. The
                  credit pays back the install in under 2 years. The first prevented incident pays it
                  back immediately.
                </p>
                <p>
                  Use our{" "}
                  <a
                    href="/#savings-estimator"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    savings estimator
                  </a>{" "}
                  to see the carrier specific credit for your vacation property.
                </p>
              </div>
            </section>

            {/* H2: FAQ */}
            <section className="space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Can I monitor it from the app while I am away?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Yes. All four devices we install include a smartphone app with real time flow
                    monitoring. If the device detects an anomaly, it shuts the main automatically and
                    sends you a push notification and SMS. You can also manually close the valve from
                    the app at any time. This is the core value proposition for vacation home owners:
                    you have the same control from Houston, Dallas, or anywhere else as you would
                    standing next to the valve.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    What if a guest accidentally trips the shutoff?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    The device monitors for leak patterns, not normal household use. Running showers,
                    filling a pool, and watering the lawn do not trigger a shutoff. After the initial
                    learning period (1 to 7 days depending on device), false positives are rare. If a
                    shutoff does trigger, you can reopen the valve from the app in seconds. Some
                    vacation rental hosts include a one line note in their guest manual explaining the
                    device and the owner contact for any water questions.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Does this work with a property manager&apos;s account?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Yes. All four devices support shared access. You can grant your property manager
                    monitoring and control access without giving them your login credentials. Some
                    property managers in Galveston and Lake Conroe already require documented water
                    mitigation as a condition of their management agreements. The HydroSense
                    certificate satisfies that requirement.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    What about a vacation home in another state?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    We currently install in the Houston metro, Galveston, Lake Conroe, and Lake
                    Livingston areas. The device itself works anywhere with Wi-Fi and a standard main
                    water line. If your out of state property has a local plumber who can install, the
                    same device and app monitoring will work. The insurance certificate is specific to
                    the installed property and your Texas carrier.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Does the certificate transfer if I sell the property?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    The device stays with the property. The new owner can contact us to transfer the
                    certificate into their name and provide it to their carrier. We reissue the
                    certificate at no charge for ownership transfers. The device does not need to be
                    reinstalled.
                  </p>
                </div>
              </div>
            </section>

            {/* H2: Get the quote */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Get the quote
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The process starts with a 15 minute call. We confirm your carrier, your property
                  type, the plumbing layout, and a locked install price. No commitment on the call.
                  After you submit the form, you will receive a confirmation email and an SMS within
                  30 seconds with a link to book the call at a time that works for you.
                </p>
                <p>
                  If you own in{" "}
                  <a
                    href="/service-area/galveston"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Galveston
                  </a>
                  ,{" "}
                  <a
                    href="/service-area/lake-conroe"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Lake Conroe
                  </a>
                  , or{" "}
                  <a
                    href="/service-area/lake-livingston"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Lake Livingston
                  </a>
                  , the form below routes directly to our vacation property team. Mention your
                  property type in the message field so we can prepare the right device
                  recommendation for your assessment call.
                </p>
              </div>
            </section>

            {/* Cross-links */}
            <section>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                  href="/service-area/galveston"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Service area
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Galveston
                  </p>
                  <p className="text-fog-300 text-sm">
                    Beach houses, vacation rentals, salt air corrosion, hurricane exposure.
                  </p>
                </a>
                <a
                  href="/service-area/lake-conroe"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Service area
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Lake Conroe
                  </p>
                  <p className="text-fog-300 text-sm">
                    High end second homes, weekend occupancy, Houston based owners.
                  </p>
                </a>
                <a
                  href="/service-area/lake-livingston"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Service area
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Lake Livingston
                  </p>
                  <p className="text-fog-300 text-sm">
                    Weekend cabins, retirement homes, Piney Woods freeze exposure.
                  </p>
                </a>
              </div>
            </section>
          </div>
        </article>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
