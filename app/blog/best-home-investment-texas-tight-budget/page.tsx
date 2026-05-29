import { Metadata } from "next";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "The Best $999 a Texas Homeowner Can Spend in a Hard Year | HydroSense",
  description:
    "Texas insurance is up 46%. Budgets are tight. One home upgrade under $1,000 returns money three ways: recurring insurance credit, catastrophic loss prevention, and resale value. Here is the math.",
  keywords: [
    "best home investment texas",
    "smart water shutoff resale value",
    "home upgrade insurance credit texas",
    "what to spend money on house tight budget",
    "home improvement roi texas",
  ],
  alternates: {
    canonical:
      "https://hydrosensetx.com/blog/best-home-investment-texas-tight-budget",
  },
  openGraph: {
    title:
      "The Best $999 a Texas Homeowner Can Spend in a Hard Year | HydroSense Texas",
    description:
      "One home upgrade under $1,000 returns money three ways: recurring insurance credit, catastrophic loss prevention, and resale marketability. The math for 2026.",
    url: "https://hydrosensetx.com/blog/best-home-investment-texas-tight-budget",
    siteName: "HydroSense Texas",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "The Best $999 a Texas Homeowner Can Spend in a Hard Year | HydroSense Texas",
    description:
      "Texas insurance up 46%. One sub-$1,000 home upgrade pays back three ways. Here is the math.",
  },
};

export default function BestHomeInvestmentPost() {
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
        name: "The Best $999 a Texas Homeowner Can Spend in a Hard Year",
        item: "https://hydrosensetx.com/blog/best-home-investment-texas-tight-budget",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Best $999 a Texas Homeowner Can Spend in a Hard Year",
    author: { "@type": "Organization", name: "Lead Ledger Pro LLC" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    description:
      "One home upgrade under $1,000 returns money three ways in Texas: recurring insurance credit, catastrophic loss prevention, and resale marketability.",
    mainEntityOfPage:
      "https://hydrosensetx.com/blog/best-home-investment-texas-tight-budget",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does the insurance credit really apply at every renewal or just the first one?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The credit applies at every renewal as long as the device is installed and the certificate is on file with your carrier. It is not a one-time incentive. Most Texas carriers re-apply the water mitigation discount automatically at each policy renewal. Some carriers require an updated certificate annually, which HydroSense provides at no charge.",
        },
      },
      {
        "@type": "Question",
        name: "What if I sell the house - does the device transfer with the home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The device stays with the property. It is plumbed into the main water line and does not get removed at sale. The new owner contacts HydroSense to transfer the certificate into their name and provide it to their carrier. We reissue the certificate at no charge for ownership transfers.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if the device fails after warranty?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All four devices we install carry a manufacturer warranty of 2 to 5 years depending on model. After warranty, the devices are designed for 10+ year service life with no moving parts exposed to water. If a device does fail post-warranty, replacement cost is significantly less than a new install because the plumbing work is already done.",
        },
      },
      {
        "@type": "Question",
        name: "Is the install disruptive - does it require drywall cuts or water shut off for hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No drywall cuts in the vast majority of installs. The device installs on the main water line where it enters the home, typically in the garage, utility closet, or near the water heater. Water is off for approximately 45 minutes during the actual plumbing work. Total on-site time is about 2 hours including device configuration and app setup.",
        },
      },
      {
        "@type": "Question",
        name: "Does my carrier require a specific brand of device?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most Texas carriers accept any professionally installed smart water shutoff with automatic valve closure and leak detection. They do not mandate a specific brand. HydroSense matches the device to your home's plumbing configuration and issues a carrier-recognized certificate regardless of which device is installed.",
        },
      },
      {
        "@type": "Question",
        name: "Can I install it myself and still get the credit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most carriers require professional installation under a licensed plumber to honor the credit. A DIY install may void the device warranty and will not come with the carrier-recognized certificate that triggers the discount. The certificate is what your carrier needs to apply the credit, and it requires documented professional installation.",
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
              <a href="/blog" className="hover:text-fog-200 transition-colors">
                Blog
              </a>
              <span className="mx-2">/</span>
              <span className="text-fog-200">Best $999 Home Investment</span>
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Home investment
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-fog-50 mb-8">
              The Best $999 a Texas Homeowner Can Spend in a Hard Year
            </h1>
            <p className="text-fog-400 text-sm">Published May 28, 2026</p>
          </div>
        </section>

        {/* Article body */}
        <article className="pb-20 lg:pb-28">
          <div className="section-container max-w-3xl space-y-16">
            {/* Intro */}
            <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
              <p>
                Texas homeowners insurance is up 46% since 2022 in some zip codes. Property tax
                assessments reset every year and they have only gone one direction. AC repair, lawn
                service, plumbing visits, roof patches. Every recurring home expense is more
                expensive than it was 18 months ago. The homeowner question of 2026 has changed.
                It is not &quot;what would be nice to have&quot; anymore. It is &quot;what is
                genuinely worth spending money on with the budget I actually have.&quot;
              </p>
              <p>
                There is exactly one home upgrade under $1,000 that returns money to a Texas
                homeowner in three different directions. It is also the one that quiets the worry
                most owners do not talk about. This is the math.
              </p>
            </div>

            {/* H2: The Three Returns */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The Three Returns on a $999 Smart Water Shutoff Install
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  A certified smart water shutoff installation stacks three returns that no other
                  sub-$1,000 home upgrade can match. First, a recurring insurance credit that pays
                  back the install in under two years and keeps paying every year after. Second,
                  catastrophic loss prevention that takes the single most expensive homeowner
                  claim category off the table. Third, a resale marketability signal that helps a
                  listing convert faster in a slower Texas market.
                </p>
                <p>
                  This is the rare kind of home spend where the returns do not compete with each
                  other. They stack. Each one is independent. Even if you only care about one of
                  the three, the math works. When all three compound, the $999 is the
                  highest-return investment available to a Texas homeowner in 2026.
                </p>
              </div>
            </section>

            {/* H2: Return One - Insurance Credit */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Return One: The Insurance Credit That Pays You Back Every Year
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Most Texas carriers offer a 5% to 15% credit on the water damage portion of the
                  premium when a certified smart shutoff is installed. On a typical Texas premium
                  of $5,500 to $7,500 a year, that translates to $300 to $600 in annual savings.
                  The credit is not one time. It is recurring. It applies at every policy renewal
                  as long as the device is installed and the certificate is on file with your
                  carrier.
                </p>
                <p>
                  Most homeowners do not realize this. They assume the discount is a first year
                  incentive and it expires. It does not. Your carrier re-applies the credit
                  automatically at renewal. Some carriers require an updated certificate annually,
                  which we provide at no charge.
                </p>
              </div>

              {/* Data callout */}
              <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl p-7 lg:p-9">
                <div className="grid sm:grid-cols-3 gap-8">
                  <div>
                    <p className="font-mono text-3xl text-signal-400 tracking-tight">
                      $300-$600
                    </p>
                    <p className="text-sm text-fog-300 mt-2">
                      Typical annual insurance credit
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl text-hydro-400 tracking-tight">
                      18-24 mo
                    </p>
                    <p className="text-sm text-fog-300 mt-2">
                      Payback on credit alone
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl text-signal-400 tracking-tight">
                      $2,000+
                    </p>
                    <p className="text-sm text-fog-300 mt-2">
                      Cumulative credit over 5 years
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Here is what that compounds to. Year one: $400 to $600 credit depending on your
                  carrier and policy form. Five years: $2,000 to $3,000 in cumulative credit on a
                  single $999 install. The payback on credit alone is typically 18 to 24 months.
                  After the payback period, the credit is pure return. Every renewal check from
                  your carrier is money that would not exist without the device on the line.
                </p>
                <p>
                  Different policy forms qualify at different rates. For a breakdown of how the
                  credit applies to HO-A, HO-B, and HO-3 policies, see our{" "}
                  <a
                    href="/insurance/ho-a-vs-ho-b-ho-3"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    insurance policy guide
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* H2: Return Two - Loss Prevention */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Return Two: The Loss You Do Not Have
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Water damage is the number one homeowner insurance claim category in Texas. More
                  frequent than fire. More frequent than theft. More frequent than wind and hail
                  combined. The Insurance Information Institute data puts the frequency at roughly
                  1 in 50 homes filing a water damage claim in any given year. Over a 15 year
                  ownership horizon, the cumulative probability is over 25%. A Texas homeowner has
                  roughly a one in four chance of a water damage claim during their time in the
                  home.
                </p>
                <p>
                  The claim costs scale with detection time. Average reported water damage claim:
                  $13,000. Severe claim from an overnight or unattended failure: $35,000 to
                  $80,000. Total loss with mold remediation cascade: six figures. The variable in
                  every scenario is not the pipe. Pipes fail. The variable is how long the water
                  runs before someone or something stops it.
                </p>
                <p>
                  A certified smart shutoff catches abnormal flow in roughly 8 seconds and closes
                  the main valve automatically. That is the difference between a $280 drywall
                  patch and a $35,000 remediation. No phone call. No frantic drive home. No
                  contractor scramble. The valve closes before the water reaches the next room.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  The deductible math most homeowners forget
                </h3>
                <p>
                  Even if the homeowner has insurance and files the claim successfully, there is
                  still a deductible. The typical Texas homeowner deductible is 1% to 2% of the
                  dwelling coverage amount. On a $400,000 home, that is $4,000 to $8,000 out of
                  pocket per incident. The insurance check does not cover the deductible, the
                  temporary housing, or the weeks of disruption.
                </p>
                <p>
                  Avoid one incident in 15 years and the $999 install pays for itself five times
                  over on deductible avoidance alone. That math does not include the premium
                  increase that follows a filed claim, which typically adds 20% to 40% to the
                  renewal for 3 to 5 years after the incident.
                </p>
                <p>
                  For the Texas-specific pipe failure pattern that drives most of these claims,
                  including hard freeze failures and supply line degradation, see our{" "}
                  <a
                    href="/freeze-damage-texas"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    freeze damage guide
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* H2: Return Three - Resale */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Return Three: The Listing Premium You Did Not Realize Existed
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Smart home features have moved from novelty to expectation in Texas listings
                  $400K and up. Water mitigation specifically is gaining traction faster than most
                  homeowners realize.
                </p>
                <p>
                  Zillow now surfaces smart water mitigation as a listing feature in property
                  search filters. Real estate agents across the Houston, Austin, and Dallas metros
                  are starting to note water mitigation in their listing copy alongside smart
                  thermostats and security systems. Buyers under 45, the largest segment in the
                  current Texas resale market, actively look for mitigation features when
                  comparing listings. Home inspection reports in 2025 and 2026 are starting to
                  flag the absence of water mitigation as a recommendation on older homes.
                </p>
                <p>
                  The honest framing: the resale uplift is harder to put an exact number on than
                  the credit and the loss avoidance. Most appraisers do not give it a specific
                  line item dollar value yet. But the listing conversion math is real. A house
                  with smart water protection sells faster and to more qualified buyers than the
                  comparable listing without it. In a slower Texas resale market, that gap between
                  30 days on market and 60 days on market is worth far more than the $999 install.
                </p>
                <p>
                  Compare the four{" "}
                  <a
                    href="/devices"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    devices we install
                  </a>{" "}
                  and the listing features each one supports. All four qualify for the insurance
                  certificate and the resale listing feature.
                </p>
              </div>
            </section>

            {/* H2: Comparison Table */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Comparing the $999 Spend to Other Home Upgrades Under $20,000
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Every home improvement has a return profile. Most of them are single-axis:
                  resale value or energy savings or maintenance prevention. The smart shutoff is
                  the only one in the Texas market that stacks three independent returns at a
                  sub-$1,000 price point. Here is how the most common home upgrades compare.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Kitchen remodel: $20,000 to $40,000
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Roughly 60% return on resale according to Remodeling Magazine cost vs. value
                    data. No insurance benefit. No loss prevention. Payback requires selling the
                    home, and even then the homeowner typically recovers less than they spent. A
                    strong lifestyle upgrade, but not a financial return in the way the word
                    &quot;return&quot; is normally used.
                  </p>
                </div>

                <div className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    New windows: $15,000
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Roughly 60% return on resale. Modest energy savings, typically $200 to $400
                    per year in Texas depending on the number of windows and existing insulation.
                    Some carriers offer a small wind mitigation credit for impact-rated windows.
                    Payback on energy savings alone: 7 to 10 years. A solid upgrade, but the
                    upfront cost is 15 times higher than a shutoff install for a smaller annual
                    return.
                  </p>
                </div>

                <div className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    New roof: $12,000 to $20,000
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Essential maintenance, not value creation. A new roof does not increase resale
                    value. It prevents the value from decreasing. Some carriers offer an impact
                    resistant shingle credit, typically 5% to 15% on the wind/hail portion of
                    premium. The credit is real but the spend is 12 to 20 times higher. Necessary
                    when the roof is due, but this is replacement, not investment.
                  </p>
                </div>

                <div className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Smart thermostat: $250
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    5% to 10% energy savings. No insurance benefit. Minimal resale signal because
                    the market assumes them at this point. A good $250 spend, but it is a single
                    axis return with no compounding.
                  </p>
                </div>

                <div className="bg-ink-800/40 border border-signal-400/30 rounded-xl p-6">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Smart water shutoff: $999
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    $300 to $600 annual insurance credit, recurring. Catastrophic loss prevention
                    against the number one claim category. Resale listing signal in a market where
                    buyers are starting to expect it. Payback in 18 to 24 months on credit alone.
                    The only sub-$1,000 upgrade with three independent return axes.
                  </p>
                </div>
              </div>

              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The smart shutoff is the highest ROI per dollar of any home improvement under
                  $1,000 in the Texas market in 2026. Not because the other improvements are bad.
                  Because of the unique stacked return profile. Nothing else at this price point
                  pays you back annually, prevents catastrophic loss, and improves listing
                  conversion simultaneously.
                </p>
                <p>
                  Use the{" "}
                  <a
                    href="/#savings-estimator"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    savings estimator
                  </a>{" "}
                  to see the carrier-specific credit math for your home.
                </p>
              </div>
            </section>

            {/* H2: The Worry Tax */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                The Worry Tax That Does Not Show Up on a Spreadsheet
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Owning a Texas home is mentally expensive. Hurricane season. Hard freezes. The
                  week you are out of town and you wonder whether you set the water heater right.
                  The drip you heard last month that you have not gone back to check on. The
                  30-day premium review letter from your carrier that arrived yesterday and you
                  have not opened.
                </p>
                <p>
                  Most of those things are outside the homeowner&apos;s control. Hurricanes
                  happen. Freezes happen. Premiums go up regardless of what the policyholder does.
                  But the pipe failure worry is the one a homeowner can actually take off the
                  table for $999. Eight seconds of automatic response. A phone alert wherever you
                  are. A certificate the carrier honors.
                </p>
                <p>
                  That is not the same as peace of mind in the marketing brochure sense. It is
                  one specific worry, removed. In a year when so many other things feel
                  uncontrollable, that one worry being controllable matters more than usual.
                </p>
              </div>
            </section>

            {/* H2: How to Get This Done */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                How to Get This Done When the Budget Is Genuinely Tight
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Two paths, depending on cash flow.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Path one: standalone install at $999
                </h3>
                <p>
                  Pay upfront or through carrier-facilitated financing where available. Own the
                  device outright. No recurring fee. The insurance credit starts applying at your
                  next policy renewal after the certificate is on file. Some carriers apply it
                  mid-term. The $999 is a one-time spend with a recurring annual return.
                </p>

                <h3 className="font-display text-xl text-fog-50 pt-2">
                  Path two: subscription at $9, $19, or $39 per month
                </h3>
                <p>
                  Includes the device, the professional install, monitoring, and the certificate.
                  Easier on cash flow when the upfront $999 is a stretch. The insurance credit
                  still applies because it is tied to the certificate, not the payment structure.
                  Your carrier does not care whether you bought the device or subscribed to it.
                  They care that it is installed and certified.
                </p>
                <p>
                  The honest call for a homeowner who is genuinely tight: the subscription is
                  workable. The insurance credit covers most or all of the monthly fee starting at
                  your next renewal. After the credit kicks in, the homeowner is net positive
                  every month. The device pays for itself faster than the monthly cost accumulates.
                  See{" "}
                  <a
                    href="/#pricing"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    pricing details
                  </a>{" "}
                  for all three tiers.
                </p>
              </div>
            </section>

            {/* H2: FAQ */}
            <section className="space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Does the insurance credit really apply at every renewal or just the first one?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Every renewal. The credit applies as long as the device is installed and the
                    certificate is on file with your carrier. It is not a one time incentive. Most
                    Texas carriers re-apply the water mitigation discount automatically at each
                    policy renewal. Some require an updated certificate annually, which HydroSense
                    provides at no charge.
                  </p>
                </div>

                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    What if I sell the house? Does the device transfer?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    The device stays with the property. It is plumbed into the main water line and
                    does not get removed at sale. The new owner contacts us to transfer the
                    certificate into their name and provide it to their carrier. We reissue the
                    certificate at no charge for ownership transfers.
                  </p>
                </div>

                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    What happens if the device fails after warranty?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    All four devices we install carry a manufacturer warranty of 2 to 5 years
                    depending on model. After warranty, the devices are designed for 10+ year
                    service life with no moving parts exposed to water. If a device does fail post
                    warranty, replacement cost is significantly less than a new install because the
                    plumbing work is already done. You are replacing the electronics, not redoing
                    the pipe work.
                  </p>
                </div>

                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Is the install disruptive? Drywall cuts, water off for hours?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    No drywall cuts in the vast majority of installs. The device installs on the
                    main water line where it enters the home, typically in the garage, utility
                    closet, or near the water heater. Water is off for approximately 45 minutes
                    during the actual plumbing work. Total on site time is about 2 hours including
                    device configuration and app setup.
                  </p>
                </div>

                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Does my carrier require a specific brand of device?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Most Texas carriers accept any professionally installed smart water shutoff
                    with automatic valve closure and leak detection. They do not mandate a
                    specific brand. We match the{" "}
                    <a
                      href="/devices"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      device
                    </a>{" "}
                    to your home&apos;s plumbing configuration and issue a carrier recognized
                    certificate regardless of which one is installed.
                  </p>
                </div>

                <div className="bg-ink-800/40 rounded-xl p-6 lg:p-8">
                  <h3 className="text-fog-50 font-semibold text-lg mb-3">
                    Can I install it myself and still get the credit?
                  </h3>
                  <p className="text-fog-200 leading-relaxed">
                    Most carriers require professional installation under a licensed plumber to
                    honor the credit. A DIY install may void the device warranty and will not come
                    with the carrier recognized certificate that triggers the discount. The
                    certificate is what your carrier needs to apply the credit, and it requires
                    documented professional installation.
                  </p>
                </div>
              </div>
            </section>

            {/* H2: CTA */}
            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Get the Carrier-Specific Math for Your Home
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  The 15 minute call confirms your carrier&apos;s exact discount tier, the right
                  device for your home, and the install price. No commitment. No credit card.
                  Fill out the form below and we will get back to you within one business day with
                  your carrier-specific estimate.
                </p>
                <p>
                  If you want to see the math before the call, the{" "}
                  <a
                    href="/#savings-estimator"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    savings estimator
                  </a>{" "}
                  gives you a carrier-specific range in 30 seconds. Or{" "}
                  <a
                    href="/book"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    book the call directly
                  </a>{" "}
                  and skip the form.
                </p>
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
