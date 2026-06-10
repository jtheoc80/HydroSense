// TODO: Replace hero image. Real image needed at
//       /public/blog/how-to-find-water-leak-home-houston/1.jpg
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "How to Find a Water Leak in Your Home: A Houston 60-Minute Response Plan | HydroSense",
  description:
    "Suspect a leak? The first 60 minutes determine whether you pay $500 or $50,000. Here is exactly how to find a water leak in your home in Houston and what to do once you spot it.",
  keywords: [
    "how to find a water leak in my home Houston",
    "emergency leak detection Houston TX",
    "water leak detection company Houston",
  ],
  alternates: {
    canonical:
      "https://hydrosensetx.com/blog/how-to-find-water-leak-home-houston",
  },
  openGraph: {
    title:
      "How to Find a Water Leak in Your Home: A Houston 60-Minute Response Plan | HydroSense Texas",
    description:
      "The first 60 minutes determine whether you pay $500 or $50,000. Here is the exact response sequence for a Houston water leak.",
    url: "https://hydrosensetx.com/blog/how-to-find-water-leak-home-houston",
    siteName: "HydroSense Texas",
    type: "article",
    images: [
      {
        url: "https://hydrosensetx.com/blog/how-to-find-water-leak-home-houston/1.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "How to Find a Water Leak in Your Home: A Houston 60-Minute Response Plan | HydroSense Texas",
    description:
      "The first 60 minutes determine whether you pay $500 or $50,000. Here is the exact response sequence.",
  },
};

export default function HowToFindWaterLeakHomeHouston() {
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
        name: "How to Find a Water Leak in Your Home: A Houston 60-Minute Response Plan",
        item: "https://hydrosensetx.com/blog/how-to-find-water-leak-home-houston",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "How to Find a Water Leak in Your Home: A Houston Homeowner's 60-Minute Response Plan",
    author: { "@type": "Organization", name: "Lead Ledger Pro LLC" },
    publisher: { "@type": "Organization", name: "HydroSense Texas" },
    datePublished: "2026-06-11",
    dateModified: "2026-06-11",
    description:
      "Suspect a leak? The first 60 minutes determine whether you pay $500 or $50,000. Here is exactly how to find a water leak in your home in Houston and what to do once you spot it.",
    mainEntityOfPage:
      "https://hydrosensetx.com/blog/how-to-find-water-leak-home-houston",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Respond to a Water Leak in Your Houston Home in 60 Minutes",
    description:
      "The exact sequence to follow when you discover a water leak in your Houston home. Each step is timed to minimize damage and protect your insurance claim.",
    step: [
      {
        "@type": "HowToStep",
        name: "Confirm the leak with a meter test",
        text: "Turn off every water-using appliance in the house. Walk to your water meter at the curb, note the reading, wait 15 minutes without using any water, and check the meter again. If the meter moved, you have an active leak.",
      },
      {
        "@type": "HowToStep",
        name: "Shut off the water (Minute 0)",
        text: "Find your main water shutoff valve, typically near the front of your home where the supply line enters from the street. If you cannot find it, use the shutoff at your water meter at the curb. If your home has a smart water shutoff, the device may have already closed the valve.",
      },
      {
        "@type": "HowToStep",
        name: "Document everything (Minute 5)",
        text: "Before any cleanup, photograph and video the damage from multiple angles. Wide shots showing the room, close-ups of standing water, ceiling stains, warped flooring, and visible damage. Insurance carriers require visual evidence of pre-mitigation damage.",
      },
      {
        "@type": "HowToStep",
        name: "Call your insurance carrier (Minute 15)",
        text: "Open a claim immediately. Get the claim number in writing. Ask about emergency mitigation requirements. Do not admit fault, speculate about the cause, or name a dollar figure. Stick to facts: where the water is, when it started, and what area is affected.",
      },
      {
        "@type": "HowToStep",
        name: "Call a licensed leak detection company (Minute 30)",
        text: "A licensed plumber with acoustic and thermal imaging equipment can identify the source, isolate the leak, and complete an emergency repair often within 2 to 3 hours of arrival. For Houston-area homeowners, call HydroSense at (281) 694-5754.",
      },
      {
        "@type": "HowToStep",
        name: "Mitigate the spread (Minute 45)",
        text: "While waiting for the plumber, move what you can to a dry area. Lift rugs and furniture off wet flooring. Run AC harder in Houston summer rather than opening windows. Place towels to absorb standing water but leave them as evidence for the adjuster. Do not cut into walls or ceilings.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Header />

      <main className="bg-ink-950">
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
                60 minute leak response plan
              </span>
            </nav>
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Emergency Response
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-fog-50 mb-8">
              How to Find a Water Leak in Your Home: A Houston
              Homeowner&apos;s 60 Minute Response Plan
            </h1>
            <p className="text-fog-400 text-sm">
              Published June 11, 2026
            </p>
          </div>
        </section>

        <article className="pb-20 lg:pb-28">
          <div className="section-container max-w-3xl space-y-16">
            <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
              <p>
                If you are reading this because you just spotted a water leak in
                your Houston home, here is what matters: the first 60 minutes
                determine whether you are looking at a $500 repair or a $50,000
                insurance claim. Most homeowners get the response wrong because
                they panic, or because they assume the leak is smaller than it
                actually is.
              </p>
              <p>
                This is the exact sequence we recommend to every customer who
                calls us during an active leak. It works whether you have a
                smart shutoff device or not.
              </p>
            </div>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                First, Confirm There Is Actually a Leak
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Before you respond, make sure you are looking at a real leak
                  and not a one time spill or condensation issue. The fastest
                  confirmation method in any Houston home:
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Turn off every water using appliance in the house, including
                    ice makers, irrigation timers, and water softeners.
                  </li>
                  <li>
                    Walk to your water meter (usually in a concrete box at the
                    curb).
                  </li>
                  <li>Note the position of the dial or digital reading.</li>
                  <li>
                    Wait 15 minutes without using any water in the house.
                  </li>
                  <li>Check the meter again.</li>
                </ol>
                <p>
                  If the meter moved, you have a leak somewhere in your
                  home&apos;s plumbing. If the meter did not move, the issue is
                  likely a fixture specific leak (toilet flapper, faucet,
                  appliance hose) rather than a supply line leak.
                </p>
              </div>
              <Image
                src="/blog/how-to-find-water-leak-home-houston/1.jpg"
                alt="Water shutoff valve and plumbing used during leak detection in a Houston home"
                width={800}
                height={450}
                className="rounded-xl"
              />
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Minute 0: Shut Off the Water
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Find your main water shutoff valve. It is typically located
                  near the front of your home, often where the supply line
                  enters from the street. If you cannot find it, the second best
                  option is the shutoff at your water meter, usually in a
                  concrete box at the curb. You will need a water meter key
                  (also called a curb key), which can be purchased at any
                  Houston hardware store for under $20.
                </p>
                <p>
                  If your home has a smart water shutoff installed, the device
                  may have already closed the main valve and notified you on
                  your phone. For a catastrophic leak with high continuous flow,
                  this happens within seconds of the abnormal pattern being
                  detected. For slower leaks, it can take longer or require the
                  daily diagnostic test to catch it. Either way, check your
                  phone for an alert before assuming the system has already
                  acted.
                </p>
                <p>
                  If you cannot shut off the main, shut off the supply to the
                  affected fixture. Every sink, toilet, and water heater should
                  have a dedicated shutoff valve nearby.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Minute 5: Document Everything
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Before you start any cleanup, photograph and video the damage.
                  Pictures from multiple angles. Wide shots showing the room.
                  Close ups showing standing water, ceiling stains, warped
                  flooring, and visible damage to walls. Photograph the source
                  of the leak if you can identify it. Photograph any personal
                  property that is affected.
                </p>
                <p>
                  This step is critical because insurance carriers require
                  visual evidence of pre mitigation damage. If you start mopping
                  or moving things before documenting, the insurance adjuster
                  has nothing to assess and your claim may be reduced or denied.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Minute 15: Call Your Insurance Carrier
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Open a claim immediately. The carrier will assign a claim
                  number and likely send an adjuster within 24 to 72 hours
                  depending on severity. Get the claim number in writing.
                </p>
                <p>
                  Ask the carrier what their requirements are for emergency
                  mitigation. Most carriers will reimburse you for emergency
                  cleanup services if you act quickly to prevent further damage.
                </p>
                <p>
                  A few things to avoid on this call: do not admit fault, do not
                  speculate about the cause, do not name a dollar figure for
                  damages. Stick to facts. The water started here, at this time,
                  the affected area is this room. That is all you need to say at
                  this stage.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Minute 30: Call a Licensed Leak Detection Company in Houston
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Time matters. The longer water has to seep into walls, floors,
                  and the foundation, the more damage compounds in our Houston
                  climate (more on that in our breakdown of{" "}
                  <Link
                    href="/blog/hidden-water-leak-damage-houston"
                    className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                  >
                    hidden water leak damage in Houston homes
                  </Link>
                  ). A licensed plumber with acoustic and thermal imaging
                  equipment can identify the source, isolate the leak, and
                  complete an emergency repair often within 2 to 3 hours of
                  arrival.
                </p>
                <p>
                  For Houston area homeowners, call us at (281) 694-5754. We
                  will get our Texas Master Plumber on site within 90 minutes
                  during business hours, and after hours emergency leak detection
                  in Houston TX is available for active flooding situations.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Minute 45: Mitigate the Spread
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  While waiting for the plumber, move what you can to a dry
                  area. Lift rugs and furniture off wet flooring. Open windows
                  if humidity outside is acceptable (in Houston summer, run AC
                  harder instead). Place towels or old sheets to absorb standing
                  water but do not move them around. Leave them as wet evidence
                  for the adjuster.
                </p>
                <p>
                  Do not attempt structural repair. Do not cut into walls or
                  ceilings yourself. The plumber and adjuster need to see the
                  damage in its original state.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Common Mistakes That Void Insurance Claims
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  These are the response errors we see most often. Every one is
                  reversible if you avoid them on the front end. They are
                  difficult or impossible to undo after the fact.
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Waiting more than 24 hours to file the claim</li>
                  <li>Cleaning up before documenting</li>
                  <li>
                    Throwing away damaged property before the adjuster sees it
                  </li>
                  <li>
                    Hiring restoration contractors before insurance approval
                  </li>
                  <li>
                    Paying for repairs out of pocket without claim documentation
                  </li>
                  <li>
                    Allowing the leak to continue while you research options
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                How Smart Monitoring Changes This Sequence
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  If you have a HydroSense installed smart water shutoff, the
                  system has likely already started the documentation for you.
                  The device logs the timestamp the abnormal flow began, the
                  flow rate, and the moment the valve closed. That data is
                  available in the app and can be exported for the insurance
                  claim.
                </p>
                <p>
                  For catastrophic leaks (burst pipe, supply line failure,
                  frozen pipe break), the valve closes within seconds of
                  detection. For slower leaks (slab pinhole, hidden drip),
                  detection may take hours and is most often caught by the
                  device&apos;s daily diagnostic test rather than real time flow
                  monitoring.
                </p>
                <p>
                  What that means practically: a smart shutoff dramatically
                  reduces the worst case scenario where a leak runs for days or
                  weeks while you are away. It does not guarantee zero damage
                  from every leak. It does guarantee that the device will not be
                  the slow link in your response chain.
                </p>
                <p>
                  Every smart shutoff install we do includes coordinated
                  insurance certification paperwork so your carrier knows the
                  device is installed and can apply your annual discount. When a
                  leak event does occur, the device documents itself.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                When to Call Us
              </h2>
              <div className="space-y-5 text-fog-200 text-lg leading-relaxed">
                <p>
                  Call (281) 694-5754 for any of the following:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    Active water leak in your Houston home right now (mention
                    &quot;emergency&quot; for priority dispatch)
                  </li>
                  <li>
                    Suspected slow leak (high water bill, warm floor spots,
                    musty odor){" "}
                    <Link
                      href="/blog/five-slab-leak-warning-signs"
                      className="text-hydro-400 hover:text-hydro-300 underline underline-offset-2 transition-colors"
                    >
                      see our 5 slab leak warning signs guide
                    </Link>
                  </li>
                  <li>
                    Smart water shutoff installation consultation (free, 15
                    minutes)
                  </li>
                  <li>
                    Insurance certification for a previously installed device
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl text-fog-50">
                Related reading
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                  href="/blog/five-slab-leak-warning-signs"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    5 slab leak warning signs
                  </p>
                  <p className="text-fog-300 text-sm">
                    The early indicators most Houston homeowners miss.
                  </p>
                </a>
                <a
                  href="/blog/slab-leak-repair-cost-houston"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Slab leak repair cost in Houston
                  </p>
                  <p className="text-fog-300 text-sm">
                    The hourly compound curve and what monitoring changes.
                  </p>
                </a>
                <a
                  href="/blog/slab-leaks-houston-clay-soil"
                  className="bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    Blog
                  </p>
                  <p className="text-fog-50 font-semibold text-lg group-hover:text-hydro-400 transition-colors mb-2">
                    Why Houston clay soil causes slab leaks
                  </p>
                  <p className="text-fog-300 text-sm">
                    The geology that makes slab leaks almost inevitable.
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
