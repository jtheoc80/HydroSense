import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import FreezeSeasonCTA from "@/components/FreezeSeasonCTA";

export const metadata: Metadata = {
  title:
    "Smart Water Shutoff vs. Manual Shutoff: What Actually Saves Your Home in a Freeze | HydroSense",
  description:
    "Side-by-side comparison of smart automatic water shutoff valves versus manual shutoff valves during a Texas freeze. Response times, insurance credits, and the failure modes that matter at 3 a.m.",
  keywords: [
    "smart water shutoff vs manual",
    "automatic water shutoff valve freeze",
    "smart water valve houston",
    "manual shutoff valve problems",
    "moen flo vs manual valve",
    "water shutoff insurance credit texas",
    "freeze pipe burst prevention",
  ],
  alternates: {
    canonical:
      "https://hydrosensetx.com/blog/smart-vs-manual-water-shutoff-freeze",
  },
  openGraph: {
    title:
      "Smart Water Shutoff vs. Manual Shutoff: What Actually Saves Your Home in a Freeze | HydroSense Texas",
    description:
      "A manual valve requires you to be home, awake, and fast. A smart shutoff closes the main in 8 seconds while you sleep. The side-by-side comparison for Houston homeowners.",
    url: "https://hydrosensetx.com/blog/smart-vs-manual-water-shutoff-freeze",
    siteName: "HydroSense Texas",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Smart Water Shutoff vs. Manual Shutoff: What Actually Saves Your Home in a Freeze | HydroSense Texas",
    description:
      "Manual valve: 10-30 minutes if you are home. Smart shutoff: 3-8 seconds whether you are home or not. The comparison that matters before freeze season.",
  },
};

export default function SmartVsManualWaterShutoffFreeze() {
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
        name: "Smart vs. Manual Water Shutoff in a Freeze",
        item: "https://hydrosensetx.com/blog/smart-vs-manual-water-shutoff-freeze",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Smart Water Shutoff vs. Manual Shutoff: What Actually Saves Your Home in a Freeze",
    author: { "@type": "Organization", name: "Lead Ledger Pro LLC" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    datePublished: "2026-06-03",
    dateModified: "2026-06-03",
    description:
      "Side-by-side comparison of smart automatic water shutoff valves versus manual shutoff valves during a Texas freeze. Response times, insurance credits, and the failure modes that matter at 3 a.m.",
    mainEntityOfPage:
      "https://hydrosensetx.com/blog/smart-vs-manual-water-shutoff-freeze",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I use both a manual valve and a smart shutoff?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The smart shutoff installs on the main line and becomes your primary defense. The manual valve remains as a backup for maintenance situations where you want to shut off water manually, such as during a renovation or plumbing repair. The two systems complement each other.",
        },
      },
      {
        "@type": "Question",
        name: "What if the smart shutoff triggers a false alarm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Modern devices learn your usage patterns and have very low false-positive rates after the initial 3-7 day calibration period. If a false closure occurs, you reopen the valve from the app in seconds. A false closure wastes 30 seconds of your time. A missed burst costs $35,000.",
        },
      },
      {
        "@type": "Question",
        name: "Does the device restrict water pressure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Negligible. Full-bore smart shutoff devices like Moen Flo and StreamLabs pass water through with minimal pressure loss, typically 1-3 PSI. You will not notice a difference in shower pressure or fixture performance.",
        },
      },
      {
        "@type": "Question",
        name: "How long do these devices last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Manufacturer warranties range from 2 to 5 years depending on model. Designed service life is 10+ years. Ultrasonic models like StreamLabs have no internal moving parts exposed to water. If a device fails post-warranty, replacement cost is lower than the initial install because the plumbing work is already done.",
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
                href="/blog"
                className="hover:text-fog-200 transition-colors"
              >
                Blog
              </a>
              <span className="mx-2">/</span>
              <span className="text-fog-200">
                Smart vs. manual water shutoff
              </span>
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Device comparison
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-fog-50 mb-8">
              Smart Water Shutoff vs. Manual Shutoff: What Actually Saves Your
              Home in a Freeze
            </h1>
            <p className="text-fog-400 text-sm">
              Published June 3, 2026
            </p>
          </div>
        </section>

        {/* Article body */}
        <article className="pb-20 lg:pb-28">
          <div className="section-container max-w-3xl space-y-16">
            {/* Answer-first intro */}
            <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
              <p>
                A manual shutoff valve only works if you are home, awake, and
                fast enough to close it before the damage accumulates. In a
                freeze, most pipe failures happen between midnight and 6 a.m.
                when temperatures bottom out and no one is checking faucets. A
                smart water shutoff monitors flow and pressure continuously,
                detects the anomalous pattern of a burst pipe, and closes the
                main valve automatically within approximately 8 seconds, no
                human intervention required. The practical difference: a manual
                valve that requires you to find it, reach it, and turn it under
                stress versus an automatic system that handles the crisis while
                you sleep. The smart shutoff also earns a 10-15% carrier
                insurance credit through its carrier-recognized certificate,
                returning $300-$600/year. The manual valve earns nothing. For a
                Houston home where the average annual premium is $6,600, this
                distinction matters.
              </p>
            </div>

            {/* Section 1: How a Manual Shutoff Works and Where It Fails */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                How a Manual Shutoff Works and Where It Fails
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Every Houston home has a manual main shutoff valve. It is
                  typically a gate valve or ball valve located where the city
                  supply enters the home, garage, utility closet, or exterior
                  near the meter. In theory, closing this valve stops all water
                  flow to the home. In practice, the manual valve has five
                  failure points that make it unreliable as your primary defense
                  during a freeze.
                </p>
                <p>
                  <strong className="text-fog-50">Location.</strong> Many
                  homeowners do not know where their shutoff valve is. During
                  Winter Storm Uri, plumber hotlines across Harris County were
                  flooded with calls from homeowners who could not find their
                  valve. When water is pouring through the ceiling at 2 a.m.,
                  searching the garage with a flashlight is not a reliable
                  response plan. The valve may be behind the water heater,
                  recessed into a wall, or buried under years of stored items
                  that have accumulated around it.
                </p>
                <p>
                  <strong className="text-fog-50">Accessibility.</strong> Even
                  when you know where the valve is, reaching it during an
                  emergency is another matter. The valve may be behind storage
                  bins, in a crawl space that requires moving furniture to
                  access, or require a special wrench for the meter-side valve
                  at the street. In the dark, in the cold, with water running,
                  accessibility becomes a real obstacle.
                </p>
                <p>
                  <strong className="text-fog-50">Condition.</strong> A gate
                  valve that has not been turned in 10 years may be corroded,
                  seized, or stuck. This is common in Houston homes where the
                  valve sits unused between rare freeze events. Forcing a stuck
                  valve can break the valve body or the pipe connection itself,
                  creating a worse problem than the one you were trying to
                  solve. Ball valves are more reliable than gate valves for
                  long-term inactivity, but even ball valves can develop mineral
                  buildup in Houston&apos;s hard water that makes them stiff after
                  years of disuse.
                </p>
                <p>
                  <strong className="text-fog-50">Response time.</strong> You
                  have to detect the leak, get to the valve, and close it. At
                  3 a.m. during a freeze, that sequence takes 10-30 minutes
                  under realistic conditions. You wake up to the sound of water,
                  orient yourself, find a flashlight, locate the valve, clear
                  any obstructions, and turn it. At 8 gallons per minute, a
                  typical burst pipe flow rate, 10 minutes is 80 gallons of
                  water on your floors, walls, and belongings. Thirty minutes is
                  240 gallons. That volume is the difference between replacing a
                  section of drywall and gutting a room.
                </p>
                <p>
                  <strong className="text-fog-50">Absence.</strong> If you are
                  not home, the manual valve is useless. It requires a human
                  hand. A pipe that bursts while you are at work, on vacation,
                  or even out running errands has no defense. The water runs
                  until someone physically arrives and closes the valve. During
                  Uri, some of the largest claims came from homes where the
                  owners were staying elsewhere because they had lost power,
                  and the pipes burst after pressure returned to the city water
                  system while the homes sat empty.
                </p>
              </div>
              <Image
                src="/blog/smart-vs-manual-water-shutoff-freeze/1.jpg"
                alt="Manual gate valve in a Houston garage showing corrosion and limited accessibility behind stored items"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            {/* Section 2: How a Smart Shutoff Works */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                How a Smart Shutoff Works
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  A smart shutoff device installs on the domestic water line and
                  monitors two things continuously: flow rate and pressure.
                  Machine learning establishes a baseline of your home&apos;s normal
                  water usage patterns over a 3-7 day calibration period. The
                  device learns when you shower, when the washing machine cycles,
                  and when the house is typically idle. Irrigation is monitored
                  only when it is specifically requested, technically reviewed,
                  and included in the written installation scope. The proposal
                  confirms the plumbing configuration and any separate equipment;
                  one device is not assumed to control both systems. Fire-sprinkler
                  and fire-suppression piping are always excluded.
                </p>
                <p>
                  When the device detects a flow pattern consistent with a
                  burst, sudden high volume that does not match any learned
                  pattern such as a toilet flush, shower, or washing-machine cycle,
                  it closes the motorized valve automatically. Response time:
                  approximately 3-8 seconds from detection to full valve
                  closure. No app interaction required. No notification that
                  needs to be acknowledged. The valve closes first, then sends
                  the alert to your phone.
                </p>
                <p>
                  Beyond burst detection, the device runs daily automated health
                  tests. These tests pressurize the system slightly and monitor
                  for slow pressure decay that would indicate a drip leak
                  somewhere in the plumbing. A slow drip, too small to trigger
                  the burst detection, can waste thousands of gallons per month
                  and cause mold growth inside walls. The daily health test
                  catches these before they become visible damage.
                </p>
                <p>
                  All major carrier-recognized devices ({" "}
                  <a
                    href="/devices/moen-flo"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Moen Flo
                  </a>
                  , Phyn, and StreamLabs) use this core approach with
                  variations in sensing technology. Some use mechanical flow
                  meters, others use ultrasonic sensors, and one uses
                  pressure-wave analysis. The differences matter for specific
                  home configurations, but the fundamental capability is the
                  same: continuous monitoring, automatic closure, and remote
                  alerts.
                </p>
              </div>
              <Image
                src="/blog/smart-vs-manual-water-shutoff-freeze/2.jpg"
                alt="Smart water shutoff device installed on a main water line with LED status indicators showing active monitoring"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            {/* Section 3: The Freeze-Specific Advantage */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The Freeze-Specific Advantage
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  A freeze creates two distinct failure modes, and this is where
                  the smart shutoff earns its value over a manual valve.
                </p>
                <p>
                  <strong className="text-fog-50">
                    The catastrophic burst.
                  </strong>{" "}
                  A pipe cracks under ice pressure and releases a high-volume
                  stream when water pressure returns or when the ice plug melts.
                  This is what most people picture when they think about frozen
                  pipes: a dramatic rupture with water spraying across the attic
                  or garage. The smart shutoff catches this within seconds. The
                  sudden high-volume flow is unmistakable to the device&apos;s
                  algorithm, no learned pattern matches a pipe dumping 8
                  gallons per minute at 3 a.m. when the household is asleep.
                  The valve closes. The alert fires. The total water released
                  before closure: less than a gallon.
                </p>
                <p>
                  <strong className="text-fog-50">
                    The slow thaw drip.
                  </strong>{" "}
                  This is the failure mode that catches manual-valve homeowners.
                  A hairline crack opens as ice melts and releases a slow drip
                  of 1-2 gallons per minute. Not dramatic. Not loud. Not visible
                  unless you happen to be looking at the exact spot where the
                  crack is. But 1 gallon per minute is 1,440 gallons per day.
                  Two gallons per minute is 2,880 gallons per day. Over three
                  days, that is 4,320-8,640 gallons of water inside your walls,
                  attic, or subfloor.
                </p>
                <p>
                  Smart shutoff devices detect the slow thaw drip through
                  cumulative flow analysis. The device knows that no fixture in
                  your home should be running 1 gallon per minute continuously
                  for an hour. No shower lasts that long. No toilet refill cycle
                  runs for 60 minutes straight. When the device sees sustained
                  flow that does not match any learned fixture pattern, it
                  alerts and closes the valve. The homeowner with a manual valve
                  does not discover this kind of leak until they see a water
                  stain on the ceiling, feel a soft spot in the floor, or
                  receive a water bill that is three times normal, often days
                  or weeks after the thaw.
                </p>
                <p>
                  After Winter Storm Uri, the majority of catastrophic insurance
                  claims came from slow thaw leaks detected days after the
                  freeze ended, not from dramatic bursts during the storm
                  itself. The homeowners who assumed they had survived because
                  nothing was visibly wrong were the ones who filed the largest
                  claims weeks later when the accumulated damage became
                  impossible to ignore.
                </p>
              </div>
            </section>

            {/* Section 4: A Side-by-Side Comparison */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                A Side-by-Side Comparison
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The differences between the two approaches become clear when
                  you compare them across the metrics that matter during a
                  freeze event.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                  <h3 className="font-display text-xl text-fog-50 mb-5">
                    Manual Shutoff Valve
                  </h3>
                  <ul className="space-y-3 text-fog-200 text-base leading-relaxed">
                    <li>
                      <span className="text-fog-400">Cost:</span> $0 (already
                      installed)
                    </li>
                    <li>
                      <span className="text-fog-400">Response time:</span>{" "}
                      10-30 minutes (if home)
                    </li>
                    <li>
                      <span className="text-fog-400">Requires human:</span> Yes
                    </li>
                    <li>
                      <span className="text-fog-400">Catches slow leaks:</span>{" "}
                      No
                    </li>
                    <li>
                      <span className="text-fog-400">
                        Catches bursts while away:
                      </span>{" "}
                      No
                    </li>
                    <li>
                      <span className="text-fog-400">Insurance credit:</span>{" "}
                      None
                    </li>
                    <li>
                      <span className="text-fog-400">Monitoring:</span> None
                    </li>
                  </ul>
                </div>
                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                  <h3 className="font-display text-xl text-fog-50 mb-5">
                    Smart Water Shutoff
                  </h3>
                  <ul className="space-y-3 text-fog-200 text-base leading-relaxed">
                    <li>
                      <span className="text-fog-400">Cost:</span> From $999
                      installed
                    </li>
                    <li>
                      <span className="text-fog-400">Response time:</span> 3-8
                      seconds
                    </li>
                    <li>
                      <span className="text-fog-400">Requires human:</span> No
                    </li>
                    <li>
                      <span className="text-fog-400">Catches slow leaks:</span>{" "}
                      Yes (daily health tests)
                    </li>
                    <li>
                      <span className="text-fog-400">
                        Catches bursts while away:
                      </span>{" "}
                      Yes
                    </li>
                    <li>
                      <span className="text-fog-400">Insurance credit:</span>{" "}
                      10-15% ($300-$600/yr)
                    </li>
                    <li>
                      <span className="text-fog-400">Monitoring:</span> 24/7
                      continuous
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The manual valve is not useless. Knowing where it is and
                  testing it annually should be on every homeowner&apos;s{" "}
                  <a
                    href="/blog/texas-freeze-survival-checklist"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    freeze preparation checklist
                  </a>
                  . You need it for maintenance situations, shutting off water
                  before a renovation, isolating a section of plumbing for
                  repair, or as a physical backup if the smart device ever needs
                  servicing. But the manual valve is a backup, not a primary
                  defense. Relying on it as your only shutoff strategy means
                  accepting that your home is unprotected every hour you are
                  asleep, at work, or away.
                </p>
              </div>
            </section>

            {/* Mid-post CTA */}
            <FreezeSeasonCTA />

            {/* Section 5: Device Options */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Device Options: Moen Flo, Phyn, and StreamLabs
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Three devices dominate the carrier-recognized smart shutoff
                  market. Each uses a different sensing approach, and the right
                  choice depends on your home&apos;s plumbing configuration. See
                  the{" "}
                  <a
                    href="/devices"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    full device comparison
                  </a>{" "}
                  for detailed specifications.
                </p>
                <p>
                  <strong className="text-fog-50">
                    <a
                      href="/devices/moen-flo"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      Moen Flo
                    </a>
                    .
                  </strong>{" "}
                  The most widely recognized option with the broadest carrier
                  acceptance. Uses a mechanical turbine flow meter and pressure
                  sensor. Three-day learning period to calibrate to your home&apos;s
                  usage patterns. Runs daily health tests that pressurize the
                  system and check for micro-leaks. The Flo app provides
                  real-time water usage data and historical consumption
                  tracking. If you are unsure which device to choose, the Moen
                  Flo is the safest default, every carrier we work with in
                  Texas recognizes it.
                </p>
                <p>
                  <strong className="text-fog-50">Phyn Plus.</strong> Uses
                  pressure-wave analysis at 240 samples per second, the most
                  granular sensing technology of the three. This high-frequency
                  sampling allows Phyn to distinguish between individual
                  fixtures with remarkable accuracy, it can tell the difference
                  between a kitchen faucet and a bathroom faucet based on the
                  pressure signature alone. Best suited for older Houston homes
                  with complex plumbing layouts, multiple stories, or unusual
                  fixture configurations where other devices might take longer
                  to calibrate.
                </p>
                <p>
                  <strong className="text-fog-50">StreamLabs Control.</strong>{" "}
                  Uses an ultrasonic flow meter with no internal turbine or
                  moving parts exposed to water flow. This design eliminates the
                  wear item that limits the lifespan of mechanical flow meters.
                  The ultrasonic sensor measures flow by timing sound pulses
                  through the water, providing accurate readings without any
                  component that can corrode, clog, or degrade over time. Best
                  long-term durability of the three options and the lowest
                  pressure loss across the valve body.
                </p>
                <p>
                  All three qualify for the same 10-15% carrier insurance
                  credit. HydroSense recommends the specific device based on
                  your home&apos;s plumbing configuration, pipe material, water
                  pressure, and layout during the phone assessment. The
                  recommendation is based on which device will perform most
                  reliably in your specific installation, not on price or margin.
                </p>
              </div>
              <Image
                src="/blog/smart-vs-manual-water-shutoff-freeze/3.jpg"
                alt="Three smart water shutoff devices compared side by side: Moen Flo, Phyn Plus, and StreamLabs Control"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            {/* Section 6: Installation and the Licensed/Permitted Angle */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Installation and the Licensed/Permitted Angle
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The device installs on your main water line, typically in the
                  garage or utility closet where the city supply enters the
                  home. Total on-site time: approximately 2 hours from arrival
                  to completion, including installation, configuration, app
                  setup, and a walkthrough of how the system works. Water is off
                  for about 45 minutes during the plumbing work itself. No
                  drywall cuts in the majority of installs, the main line entry
                  point is accessible in most Houston homes without opening
                  walls.
                </p>
                <p>
                  Plumbing work is performed through a Texas-licensed plumbing partner
                  under Responsible Master Plumber M-43057. This is not a marketing
                  detail, it is a
                  requirement. Most carriers require documented professional
                  installation under a licensed plumber to honor the insurance
                  credit. The carrier needs to see that the device was installed
                  by someone with the credentials and liability coverage to
                  guarantee the work. A DIY install may void the device
                  manufacturer&apos;s warranty and will not come with the
                  carrier-recognized certificate that triggers the discount.
                </p>
                <p>
                  The certificate is the document that matters. It confirms the
                  device model, serial number, installation date, installer
                  license number, and the property address. HydroSense issues
                  this certificate in both paper and digital form on the day of
                  installation. You submit it to your carrier, and the credit
                  applies to your next renewal. Without the certificate, the
                  carrier has no basis to apply the discount regardless of
                  whether a device is installed.
                </p>
                <p>
                  HydroSense serves the greater Houston metro including{" "}
                  <a
                    href="/service-area/sugar-land"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Sugar Land
                  </a>
                  , Katy, The Woodlands, Pearland, and surrounding communities.
                  Same licensing, same certificate, same carrier acceptance
                  across the service area.
                </p>
              </div>
            </section>

            {/* Section 7: Cost and the Monitoring Subscription */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Cost and the Monitoring Subscription
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Installation starts from $999 for a standard single-family
                  home with an accessible main line. The price includes the
                  device, all plumbing work, configuration, app setup, and the
                  carrier-recognized insurance certificate. Homes with
                  non-standard main line locations, multiple entry points, or
                  accessibility challenges may require additional work that
                  affects pricing, this is covered during the phone assessment
                  before scheduling.
                </p>
                <p>
                  Monitoring subscriptions run from $9-$39/month depending on
                  the level of service. Three tiers are available:
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                  <h3 className="font-display text-lg text-fog-50 mb-3">
                    Basic, $9/mo or $99/yr
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Installation, carrier-recognized certificate, email support.
                    The certificate is issued at install and valid for one year.
                    Renewal requires upgrading to Standard or scheduling a
                    separate certificate renewal visit.
                  </p>
                </div>
                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                  <h3 className="font-display text-lg text-fog-50 mb-3">
                    Standard, $19/mo or $199/yr
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Annual certificate renewal included, 24/7 monitoring alerts
                    with push notifications, priority scheduling for service
                    calls. The annual certificate renewal is handled
                    automatically, HydroSense reissues the certificate and
                    sends it to you and your carrier before expiration.
                  </p>
                </div>
                <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                  <h3 className="font-display text-lg text-fog-50 mb-3">
                    Premier, $39/mo or $399/yr
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Everything in Standard plus annual on-site inspection,
                    insurance liaison service (HydroSense communicates directly
                    with your carrier on your behalf), device warranty extension,
                    and a dedicated account manager. Best suited for high-value
                    homes or homeowners who want fully hands-off management of
                    the device and the insurance credit.
                  </p>
                </div>
              </div>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Most homeowners choose Standard because the annual certificate
                  renewal alone justifies the cost. Miss one renewal and the
                  credit drops off your policy at the next renewal cycle. The
                  carrier does not remind you. The credit simply disappears, and
                  your premium increases by $300-$600 without explanation unless
                  you check. The Standard plan eliminates that risk entirely.
                </p>
                <p>
                  The math on monitoring cost versus insurance credit is
                  straightforward. Standard monitoring costs $199/year. The
                  insurance credit returns $300-$600/year. The net cost of
                  monitoring is effectively zero or negative, the credit
                  exceeds the subscription cost in every scenario. You are being
                  paid to have your home monitored. The device installation cost
                  pays back within 18-24 months from the insurance credit alone,
                  before accounting for the avoided loss exposure of a single
                  unmitigated burst at $35,000.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section className="space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Can I use both a manual valve and a smart shutoff?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Yes. The smart shutoff installs on the main line and becomes
                    your primary defense. The manual valve remains as a backup
                    for maintenance situations where you want to shut off water
                    manually, during a renovation, when replacing a fixture, or
                    any scenario where you are intentionally working on the
                    plumbing and want a physical valve you can close by hand.
                    The two systems complement each other. The smart shutoff
                    handles the emergencies. The manual valve handles the
                    planned maintenance.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    What if the smart shutoff triggers a false alarm?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Modern devices learn your usage patterns over a 3-7 day
                    calibration period and have very low false-positive rates
                    once calibrated. The device distinguishes normal domestic-water
                    patterns, such as a shower or toilet refill, from a burst pipe.
                    If a false closure does occur, you reopen the valve
                    from the app in seconds, tap the notification, confirm
                    reopening, and water resumes. A false closure wastes 30
                    seconds of your time. A missed burst costs $35,000. The
                    asymmetry of those outcomes is why every device errs on the
                    side of closing when uncertain.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Does the device restrict water pressure?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Negligible. Full-bore smart shutoff devices like Moen Flo
                    and StreamLabs pass water through with minimal pressure
                    loss, typically 1-3 PSI. For context, most Houston homes
                    operate at 50-70 PSI from the city supply. A 1-3 PSI
                    reduction is within the range of normal daily pressure
                    fluctuation from the municipal system. You will not notice a
                    difference in shower pressure or other domestic fixture
                    performance.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    How long do these devices last?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Manufacturer warranties range from 2 to 5 years depending on
                    model. Designed service life is 10+ years for all three
                    major devices. Ultrasonic models like StreamLabs have no
                    internal moving parts exposed to water, which eliminates the
                    primary wear mechanism that limits mechanical flow meters.
                    If a device fails post-warranty, the replacement cost is
                    lower than the initial install because the plumbing work
                    (the cut-in, the fittings, the mounting) is already done.
                    The replacement is a device swap, not a new installation.
                  </p>
                </div>
              </div>
            </section>

            {/* End CTA */}
            <FreezeSeasonCTA />

            {/* Related reading */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Related reading
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                  href="/blog/texas-freeze-survival-checklist"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    The Texas freeze survival checklist
                  </p>
                  <p className="text-fog-300 text-sm">
                    Complete 72-hour prep, during-freeze monitoring, and
                    post-thaw inspection steps for Houston homeowners.
                  </p>
                </a>
                <a
                  href="/blog/frozen-pipes-while-traveling-winter"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Frozen pipes while traveling
                  </p>
                  <p className="text-fog-300 text-sm">
                    What to do when a freeze hits and you are not home to
                    respond.
                  </p>
                </a>
                <a
                  href="/devices"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Devices
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Smart water shutoff devices we install
                  </p>
                  <p className="text-fog-300 text-sm">
                    Full comparison of Moen Flo, Phyn Plus, and StreamLabs
                    Control with specifications and carrier acceptance.
                  </p>
                </a>
                <a
                  href="/devices/moen-flo"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Device
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Flo by Moen
                  </p>
                  <p className="text-fog-300 text-sm">
                    The most widely recognized smart shutoff with broadest
                    carrier acceptance in Texas.
                  </p>
                </a>
                <a
                  href="/service-area/sugar-land"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Service area
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Sugar Land
                  </p>
                  <p className="text-fog-300 text-sm">
                    Smart water shutoff installation and service in Sugar Land
                    and Fort Bend County.
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
