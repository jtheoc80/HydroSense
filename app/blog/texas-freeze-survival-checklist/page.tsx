import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import FreezeSeasonCTA from "@/components/FreezeSeasonCTA";
import FreezeSurvivalChecklist from "@/components/FreezeSurvivalChecklist";

export const metadata: Metadata = {
  title:
    "The Texas Freeze Survival Checklist Every Houston Homeowner Needs Before Winter | HydroSense",
  description:
    "A complete freeze preparation checklist for Houston homeowners: 72-hour prep, during-freeze monitoring, and post-thaw inspection steps.",
  keywords: [
    "texas freeze checklist",
    "houston freeze preparation",
    "winter storm pipe protection texas",
    "frozen pipes houston",
    "freeze damage prevention checklist",
    "houston homeowner winter prep",
  ],
  alternates: {
    canonical:
      "https://hydrosensetx.com/blog/texas-freeze-survival-checklist",
  },
  openGraph: {
    title:
      "The Texas Freeze Survival Checklist Every Houston Homeowner Needs Before Winter | HydroSense Texas",
    description:
      "Complete 72-hour freeze prep, during-freeze monitoring, and post-thaw inspection checklist for Houston homeowners. The steps that prevent $35,000 in water damage.",
    url: "https://hydrosensetx.com/blog/texas-freeze-survival-checklist",
    siteName: "HydroSense Texas",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "The Texas Freeze Survival Checklist Every Houston Homeowner Needs Before Winter | HydroSense Texas",
    description:
      "Complete freeze prep checklist for Houston homeowners: 72-hour prep, during-freeze steps, and the post-thaw inspection most people skip.",
  },
};

export default function TexasFreezeSurvivalChecklist() {
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
        name: "Texas Freeze Survival Checklist",
        item: "https://hydrosensetx.com/blog/texas-freeze-survival-checklist",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "The Texas Freeze Survival Checklist Every Houston Homeowner Needs Before Winter",
    author: { "@type": "Organization", name: "Lead Ledger Pro LLC" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    datePublished: "2026-06-03",
    dateModified: "2026-06-03",
    description:
      "A complete freeze preparation checklist for Houston homeowners covering 72-hour prep, during-freeze monitoring, and the post-thaw inspection steps most homeowners skip.",
    mainEntityOfPage:
      "https://hydrosensetx.com/blog/texas-freeze-survival-checklist",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When should I start freeze prep in Houston?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Monitor NWS forecasts beginning in late November. When a freeze warning appears in the 72-hour outlook, begin your exterior prep immediately. Most years Houston sees 5 to 15 nights below 32F between December and February. The 72-hour window gives you time to insulate pipes, cover outdoor faucets, and confirm your shutoff valve turns freely.",
        },
      },
      {
        "@type": "Question",
        name: "Will dripping faucets really prevent frozen pipes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dripping faucets reduce the risk of freezing by keeping water moving through the line. Run both hot and cold at a pencil-lead stream from the faucet farthest from the main. It significantly reduces freeze risk for pipes inside walls, but it does not eliminate the risk for uninsulated attic lines or exterior pipes where temperatures drop well below 28F for extended periods.",
        },
      },
      {
        "@type": "Question",
        name: "What if I already had a pipe freeze but it didn't burst?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A pipe that froze and thawed without an obvious burst may still have hairline cracks that hold for days or weeks before failing. The expansion from ice weakens joints and fittings even when it does not produce an immediate break. Have a licensed plumber inspect the affected lines. A smart water shutoff catches the eventual failure automatically when the hairline crack opens under pressure.",
        },
      },
      {
        "@type": "Question",
        name: "How much does freeze damage actually cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average unmitigated burst pipe claim in Texas is approximately $35,000, covering remediation, drying, drywall replacement, flooring, and personal property. With a smart shutoff that closes the main within 8 seconds of detecting the anomaly, the average mitigated claim drops to approximately $280. The difference is the volume of water that escapes before the line is closed.",
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
                Freeze survival checklist
              </span>
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Freeze protection
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-fog-50 mb-8">
              The Texas Freeze Survival Checklist Every Houston Homeowner Needs
              Before Winter
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
                Every Houston homeowner preparing for a freeze should complete these
                steps: disconnect and drain all garden hoses, insulate exposed pipes
                in the attic, garage, and exterior walls with foam sleeves, open
                cabinet doors under sinks on exterior walls, set faucets to drip at a
                pencil-lead stream on both hot and cold lines, set the thermostat to
                55F minimum and disable night setback, and confirm that your main
                water shutoff valve turns by hand before you need it in an emergency.
                After the thaw, walk every visible pipe, read your water meter twice
                over two hours with no usage, and re-inspect at three days and seven
                days for hairline cracks that take time to fail. A smart water shutoff
                valve automates the one thing no checklist can provide: overnight
                monitoring and an 8-second response at 3 a.m. when no one is awake
                to notice a pressure drop.
              </p>
            </div>

            {/* Section 1: Why Texas Freezes Catch Homeowners Off Guard */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Why Texas Freezes Catch Homeowners Off Guard
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Houston housing stock was not built for sustained cold. Homes
                  constructed between 1970 and 2010, which account for the majority of
                  the residential inventory in Harris County, were designed to shed
                  heat and humidity. The engineering priorities were roof ventilation,
                  air conditioning efficiency, and moisture management in a subtropical
                  climate. Freeze protection was an afterthought when it was considered
                  at all.
                </p>
                <p>
                  The result is a structural vulnerability that only becomes visible
                  when temperatures drop below 28F for more than a few hours. Supply
                  lines run through attics with minimal insulation, sometimes resting
                  directly on drywall with nothing between the pipe and the outdoor
                  temperature except a layer of plywood and shingles. Pipes route
                  through exterior walls on the north side of the house where wind
                  chill is harshest. Water heaters and washing machine connections sit
                  in uninsulated garages where a closed garage door is the only barrier
                  between the plumbing and freezing air.
                </p>
                <p>
                  The assumption that drives the vulnerability is simple and widely
                  shared: it does not freeze here. Houston averages 5 to 15 nights
                  below 32F per year, concentrated between December and February. In a
                  mild year, those nights barely dip below freezing and last only a few
                  hours. In a severe year, the sustained cold overwhelms the limited
                  freeze protection built into the housing stock.
                </p>
                <p>
                  Winter Storm Uri in February 2021 was the definitive proof. The Texas
                  Department of Insurance reported $10B+ in insurance losses across the
                  state, with water damage from burst pipes representing the single
                  largest category. Uri was extraordinary in its duration, four
                  consecutive days below freezing in Houston, but the damage pattern it
                  exposed applies to any sustained freeze event. The pipes that failed
                  were not defective. They were installed exactly to code in homes that
                  were never designed to handle 72 hours of sub-freezing temperatures.
                </p>
                <p>
                  The detail that surprises most homeowners: the worst damage does not
                  happen during the freeze. It happens 2 to 7 days after the thaw. Ice
                  expands inside a pipe and creates hairline cracks at joints, fittings,
                  and bends. While the pipe is frozen, the ice itself acts as a plug.
                  No water flows. No visible leak. The homeowner assumes they made it
                  through. Then temperatures rise, the ice melts, water pressure
                  returns to full, and those hairline cracks open. The leak starts
                  behind a wall or in an attic where no one sees it. By the time a
                  stain appears on the ceiling or the water bill spikes, the damage has
                  been accumulating for days.
                </p>
                <p>
                  Uri&apos;s worst insurance claims came not during the storm itself but in
                  the two weeks that followed, as thaw-related failures cascaded
                  through homes that appeared to have survived intact.
                </p>
              </div>
              <Image
                src="/blog/texas-freeze-survival-checklist/1.jpg"
                alt="Frozen pipe in a Houston attic with ice crystals visible along a copper supply line"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            {/* Section 2: 72 Hours Before a Freeze */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                72 Hours Before a Freeze
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  When the National Weather Service issues a freeze warning for the
                  Houston metro, you have roughly 72 hours to prepare. This is a
                  specific, actionable checklist. Work through it in order.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Exterior preparation
                </h3>
                <p>
                  Disconnect every garden hose from every outdoor faucet. A connected
                  hose traps water in the hose bibb, and when that water freezes it
                  can crack the bibb or the supply pipe behind it inside the wall.
                  Drain each hose completely and store it in the garage. After
                  disconnecting, install an insulated hose bibb cover over each outdoor
                  faucet. These foam covers cost $3 to $8 at any hardware store and
                  reduce heat loss at the most exposed point of your plumbing system.
                </p>
                <p>
                  Walk the exterior of the house and identify any gaps or cracks around
                  pipe penetrations, particularly where supply lines, gas lines, or
                  electrical conduit pass through the exterior wall. Seal gaps with
                  expanding foam or caulk. Cold air that reaches the pipe through a
                  half-inch gap is enough to cause a freeze in a pipe that would
                  otherwise survive.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Pipe insulation
                </h3>
                <p>
                  Insulate every exposed pipe in the garage, attic, and crawl space
                  with foam pipe sleeves. Focus first on supply lines that run through
                  unheated spaces: the cold water line in the attic, the hot water
                  supply from the water heater in the garage, and any pipes visible in
                  an unfinished crawl space. Pre-slit foam sleeves slide directly over
                  the pipe and can be secured with duct tape or zip ties at each joint.
                  This is a 30-minute project that meaningfully reduces your risk.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Interior preparation
                </h3>
                <p>
                  Open cabinet doors under every sink that sits against an exterior
                  wall. This allows heated air from the room to circulate around the
                  pipes behind the cabinet. The temperature difference between a closed
                  cabinet on an exterior wall and the heated room can be 15 to 20
                  degrees, enough to make the difference between a frozen pipe and one
                  that survives.
                </p>
                <p>
                  Set your thermostat to 55F minimum and disable any programmed night
                  setback. During a freeze event, you do not want the system dropping
                  to 62F at midnight while pipes in the attic are exposed to 18F air.
                  Keep the temperature constant, day and night, for the duration of the
                  freeze.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Irrigation and pool systems
                </h3>
                <p>
                  Drain your irrigation system and backflow preventer. Most residential
                  irrigation in Houston uses a reduced pressure backflow assembly
                  mounted above ground. Drain it by opening the test cocks and the
                  downstream shut-off. If you have a pool, lower the water level below
                  the skimmer and run the pump continuously during the freeze. Moving
                  water resists freezing, and a cracked pool pump housing is a $1,200
                  to $2,500 repair.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Shutoff valve and emergency contacts
                </h3>
                <p>
                  Locate your main water shutoff valve and confirm it turns by hand.
                  Most Houston homes have the main shutoff near the meter at the street
                  or where the main line enters the house. If the valve is corroded,
                  stiff, or you cannot find it, this is the time to call a plumber, not
                  during the freeze when every plumber in Harris County is booked out
                  48 hours. Charge your phone, save your plumber&apos;s number, and save
                  the HydroSense emergency line: (281) 694-5754.
                </p>
              </div>
              <Image
                src="/blog/texas-freeze-survival-checklist/2.jpg"
                alt="Homeowner installing foam pipe insulation on an exposed copper line in a Houston garage"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            {/* Section 3: During the Freeze */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                During the Freeze
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Once temperatures drop below freezing, your preparation is done. The
                  goal during the freeze is to maintain conditions and monitor for early
                  signs of trouble.
                </p>
                <p>
                  Let faucets drip at a pencil-lead stream. Run both hot and cold from
                  the faucet farthest from the main water entry point. This is
                  typically a bathroom at the far end of the house. Moving water
                  freezes at a lower temperature than standing water. The drip does
                  not need to be heavy. A thin, steady stream, about the diameter of a
                  pencil lead, is sufficient to keep water moving through the longest
                  run of pipe in your house.
                </p>
                <p>
                  Keep garage doors closed if any water lines run through the garage.
                  This includes the supply to the water heater, the washing machine
                  hookup, and any utility sink. An open garage door drops the
                  temperature inside the garage to within a few degrees of outdoor
                  conditions, which eliminates whatever marginal protection the
                  enclosed space provides.
                </p>
                <p>
                  Maintain 55F minimum inside the house at all times. If you lose
                  power, close interior doors to concentrate heat in the rooms with
                  plumbing. Open cabinets on exterior walls even wider. If the outage
                  extends beyond 6 hours and the interior temperature drops below 45F,
                  consider shutting off the main water supply and draining the lines as
                  a precaution.
                </p>
                <p>
                  Monitor for pressure drops. If a faucet that was dripping steadily
                  slows to an intermittent drip or stops entirely, ice is forming in
                  the line. Do not attempt to thaw the pipe with an open flame, a
                  propane torch, or a heat gun. House fires during freeze events are
                  alarmingly common and almost always caused by homeowners using open
                  flame on frozen pipes. Use a hair dryer on low heat directed at the
                  suspected freeze point, or wrap the area with towels soaked in warm
                  water.
                </p>
                <p>
                  If you are{" "}
                  <a
                    href="/blog/frozen-pipes-while-traveling-winter"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    traveling during a freeze
                  </a>
                  , have someone check the property daily. Not a drive-by. A walk
                  through the house checking every faucet, looking under every sink,
                  and confirming that the thermostat is maintaining temperature. A
                  single missed day during a sustained freeze can mean the difference
                  between catching a drip and discovering a flooded first floor.
                </p>
              </div>
            </section>

            {/* Mid-post CTA */}
            <FreezeSeasonCTA />

            {/* Section 4: After the Thaw */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                After the Thaw: The Hidden Danger
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  This is the section most freeze checklists leave out, and it is the
                  section that matters most. The majority of freeze-related water
                  damage in Houston does not happen while the pipes are frozen. It
                  happens after temperatures rise and water pressure returns to lines
                  with hairline cracks that are invisible to the eye.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Immediate post-thaw inspection (Day 1)
                </h3>
                <p>
                  Walk every visible pipe in the house. Start in the attic if your
                  supply lines run through it. Check under every sink. Inspect behind
                  the water heater. Look at the washing machine connections. Examine
                  the ice maker line behind the refrigerator. Check every toilet supply
                  line. You are looking for moisture, drips, discoloration on pipe
                  fittings, and any new sound of running water when all fixtures are
                  off.
                </p>
                <p>
                  Perform a water meter test. Read your water meter, record the
                  number, then ensure no water is used anywhere in the house for two
                  hours. No faucets, no toilets, no ice maker, no irrigation. After
                  two hours, read the meter again. Any movement at all indicates a
                  leak somewhere in the system. This test catches leaks that are
                  invisible to the eye, including those inside walls, under slabs, and
                  in the attic above the insulation line.
                </p>
                <p>
                  Inspect walls and ceilings throughout the house for new stains, soft
                  spots, bubbling paint, or warped baseboards. Pay particular attention
                  to ceilings below attic supply lines and walls on the north side of
                  the house where freeze exposure was greatest.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Follow-up inspections (Day 3 and Day 7)
                </h3>
                <p>
                  Re-inspect at three days and again at seven days after the thaw.
                  Hairline cracks created by ice expansion do not always fail
                  immediately. Some hold for days under normal water pressure before
                  the crack propagates enough to produce a visible leak. A fitting that
                  looked fine on Day 1 can be actively leaking behind a wall on Day 5.
                  The 3-day and 7-day inspections are not optional. They are the
                  inspections that catch the failures responsible for the largest
                  claims.
                </p>
                <p>
                  Repeat the water meter test at each follow-up inspection. If the
                  meter shows zero movement at Day 1 but any movement at Day 3 or
                  Day 7, a hairline crack has opened. Call a plumber immediately and
                  close the main shutoff valve until the leak is located and repaired.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Documentation for insurance
                </h3>
                <p>
                  If you discover damage at any point during the post-thaw inspection
                  window, document it with photos and video before you begin any
                  cleanup or mitigation. Photograph the source of the leak, the
                  affected area, the water meter reading, and any damaged personal
                  property. Your insurance carrier will require this documentation to
                  process the claim. Carriers that handled Uri claims reported that
                  homeowners who documented damage before cleanup received settlements
                  an average of 40% higher than those who cleaned up first and
                  documented after.
                </p>
                <p>
                  Uri&apos;s worst claims came days and weeks after the thaw. Homeowners
                  who thought they had survived discovered slow leaks behind walls,
                  in attics, and under cabinets that had been running undetected since
                  the ice melted. The post-thaw inspection protocol described here
                  exists specifically to catch those failures early, before the damage
                  compounds from a small repair into a full remediation.
                </p>
              </div>
            </section>

            {/* Section 5: The One Thing a Checklist Cannot Do at 3 a.m. */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The One Thing a Checklist Cannot Do at 3 a.m.
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Every item on this checklist assumes you are home, awake, and paying
                  attention. The dripping faucet requires someone to set it. The meter
                  test requires someone to walk outside and read it. The post-thaw
                  inspection requires someone to climb into the attic with a
                  flashlight.
                </p>
                <p>
                  A pipe does not consult the checklist before it fails. It fails at
                  3 a.m. on a Tuesday in January while you are asleep. It fails during
                  the workday while the house is empty. It fails on the second night of
                  the freeze when you assumed the worst was over. The checklist is on
                  the refrigerator. The water is on the floor.
                </p>
                <p>
                  A smart water shutoff valve does the one thing this checklist cannot:
                  it monitors flow and pressure 24 hours a day, 7 days a week, without
                  sleeping, without forgetting, and without assuming the worst is over.
                  When it detects a flow pattern consistent with a burst, a sustained
                  pressure drop, or abnormal usage during hours when the home should be
                  idle, it closes the main water line within 8 seconds. No human
                  intervention. No phone call. No waking up to the sound of water
                  running through the ceiling.
                </p>
                <p>
                  The financial difference is stark. The average unmitigated burst pipe
                  claim in Texas runs approximately $35,000: remediation, structural
                  drying, drywall replacement, flooring, and personal property. With a
                  smart shutoff that closes the line within seconds, the average
                  mitigated claim drops to approximately $280, typically just the
                  cost of repairing the pipe fitting itself. The variable is not the
                  pipe. It is the volume of water that escapes before the line is
                  closed. For the full data on freeze damage claims and mitigation
                  outcomes, see our{" "}
                  <a
                    href="/freeze-damage-texas"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    freeze damage guide for Texas homeowners
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Section 6: How a Smart Shutoff Automates the Riskiest Items */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                How a Smart Shutoff Automates the Riskiest Items
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Look at this checklist again and identify the items that fail most
                  often in practice. It is not the hose disconnection or the cabinet
                  doors. Those are simple, one-time actions that most prepared
                  homeowners complete. The items that fail are the ones that require
                  sustained attention over time: the overnight monitoring, the
                  post-thaw inspections at Day 3 and Day 7, and the 3 a.m. response
                  when a fitting finally gives way.
                </p>
                <p>
                  These are precisely the items that a carrier-recognized smart water
                  shutoff device handles automatically. Devices like Moen Flo, Phyn,
                  and StreamLabs monitor flow, pressure, and temperature continuously.
                  They learn the normal patterns of your household and flag deviations.
                  They do not need to be reminded to check the attic on Day 7. They do
                  not sleep through the pressure drop at 3 a.m. They close the valve
                  within 8 seconds and send an alert to your phone whether you are in
                  bed, at work, or{" "}
                  <a
                    href="/blog/smart-vs-manual-water-shutoff-freeze"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    comparing smart vs. manual shutoff options
                  </a>
                  .
                </p>
                <p>
                  Plumbing work is performed through a Texas-licensed plumbing partner
                  under Responsible Master Plumber M-43057. The device goes on the main
                  water line where it enters the
                  home, typically taking about two hours for a complete install,
                  configuration, and app walkthrough. After installation, HydroSense
                  issues a carrier-recognized insurance certificate in paper and
                  digital form.
                </p>
                <p>
                  That certificate earns a 10-15% carrier credit on the water damage
                  portion of your homeowners premium. On a typical Houston annual home
                  insurance premium of approximately $6,600 (per Rice Kinder Institute,
                  2025), that translates to roughly $300-$600 per year in savings. Texas
                  premiums have risen approximately 46% over the past two years
                  (Policygenius), and any documented mitigation that reduces your
                  premium is worth pursuing. The credit applies every year the device is
                  installed and the certificate is on file with your carrier. See
                  the full{" "}
                  <a
                    href="/service-area/houston"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    Houston service area page
                  </a>{" "}
                  for local carrier data, ZIP codes served, and install scheduling.
                </p>
                <p>
                  Install starts from $999. Monitoring runs $9-$39/mo depending on the
                  device and plan. The insurance credit alone typically pays back the
                  install cost within 18 to 24 months, before accounting for the
                  avoided loss exposure of a single unmitigated burst.
                </p>
              </div>
              <Image
                src="/blog/texas-freeze-survival-checklist/3.jpg"
                alt="Smart water shutoff device installed on a main water line in a Houston home"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            {/* Section 7: Interactive checklist embed */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Your Interactive Freeze Checklist
              </h2>
              <FreezeSurvivalChecklist showEmailCapture />
            </section>

            {/* Section 8: FAQ */}
            <section className="space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    When should I start freeze prep in Houston?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Monitor NWS forecasts beginning in late November. When a freeze
                    warning appears in the 72-hour outlook, begin your exterior prep
                    immediately: disconnect hoses, install bibb covers, and insulate
                    exposed pipes. Most years Houston sees 5-15 nights below 32F
                    between December and February. The 72-hour window gives you time
                    to work through the full checklist without rushing. If you have not
                    insulated attic lines or confirmed your shutoff valve before the
                    season starts, schedule that work in November while plumbers are
                    still available on normal lead times.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Will dripping faucets really prevent frozen pipes?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Dripping faucets keep water moving through the line, which reduces
                    the freeze point compared to standing water. Run both hot and cold
                    at a pencil-lead stream from the faucet farthest from the main
                    entry. This significantly reduces freeze risk for pipes routed
                    inside walls and under floors. However, it does not eliminate the
                    risk for uninsulated lines in the attic where ambient temperatures
                    can drop well below 20F during a sustained freeze. Attic lines
                    require physical insulation. Dripping is one layer of protection,
                    not a complete solution.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    What if I already had a pipe freeze but it didn&apos;t burst?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    A pipe that froze and thawed without an obvious burst may still have
                    hairline cracks at joints and fittings. The expansion from ice
                    weakens copper, CPVC, and PEX connections even when it does not
                    produce an immediate break. Those weakened points can hold for
                    days or weeks under normal water pressure before failing. Have a
                    licensed plumber inspect the affected lines, particularly any runs
                    through the attic or exterior walls. A smart water shutoff catches
                    the eventual failure automatically when the hairline crack finally
                    opens under pressure, closing the main within 8 seconds regardless
                    of whether anyone is home.
                  </p>
                </div>
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    How much does freeze damage actually cost?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    The average unmitigated burst pipe claim in Texas is approximately
                    $35,000, covering emergency water extraction, structural drying,
                    drywall replacement, flooring, baseboards, paint, and damaged
                    personal property. With a smart shutoff that closes the main within
                    8 seconds of detecting the anomaly, the average mitigated claim
                    drops to approximately $280, typically just the pipe repair itself.
                    The difference is the volume of water that escapes before the line
                    is closed: hours of undetected flow versus 8 seconds. For the full
                    breakdown of claim data and remediation costs, see our{" "}
                    <a
                      href="/blog/cost-of-burst-pipe-texas"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      detailed cost analysis of burst pipe claims in Texas
                    </a>
                    .
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
                    What to do when a freeze hits and you are not home to respond.
                  </p>
                </a>
                <a
                  href="/blog/cost-of-burst-pipe-texas"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    The real cost of a burst pipe
                  </p>
                  <p className="text-fog-300 text-sm">
                    Full breakdown of remediation costs, insurance claim data, and
                    mitigation outcomes.
                  </p>
                </a>
                <a
                  href="/blog/smart-vs-manual-water-shutoff-freeze"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Smart vs manual shutoff
                  </p>
                  <p className="text-fog-300 text-sm">
                    Side-by-side comparison of automated and manual shutoff options for
                    freeze protection.
                  </p>
                </a>
                <a
                  href="/freeze-damage-texas"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Guide
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Freeze damage claims in Texas
                  </p>
                  <p className="text-fog-300 text-sm">
                    Claim data, carrier responses, and the mitigation gap that drives
                    Texas premiums.
                  </p>
                </a>
                <a
                  href="/service-area/houston"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Service area
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Houston
                  </p>
                  <p className="text-fog-300 text-sm">
                    Local carrier data, ZIP codes served, and install scheduling for
                    the Houston metro.
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
