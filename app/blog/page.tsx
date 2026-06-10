import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | HydroSense Texas",
  description:
    "Guides, data, and install insights for Texas homeowners considering a smart water shutoff. Insurance credits, freeze protection, and home investment ROI.",
  alternates: {
    canonical: "https://hydrosensetx.com/blog",
  },
};

const posts = [
  {
    slug: "hidden-water-leak-damage-houston",
    title:
      "Hidden Water Leak Damage: What 6 Months Does to a Houston Home",
    description:
      "Hidden water leak damage in Houston compounds month by month: mold, rot, foundation movement, and $80,000+ in remediation. Here is the month-by-month progression.",
    date: "June 13, 2026",
    category: "Damage Assessment",
  },
  {
    slug: "slab-leak-repair-cost-houston",
    title:
      "Slab Leak Repair Cost in Houston: What an Untreated Leak Costs Every Hour",
    description:
      "Slab leak repair cost in Houston TX ranges from $50 to $80,000 depending on detection time. Here is the hourly cost compound curve and what monitoring actually changes.",
    date: "June 12, 2026",
    category: "Insurance & Cost",
  },
  {
    slug: "how-to-find-water-leak-home-houston",
    title:
      "How to Find a Water Leak in Your Home: A Houston Homeowner's 60-Minute Response Plan",
    description:
      "Suspect a leak? The first 60 minutes determine whether you pay $500 or $50,000. Here is exactly how to find a water leak in your home in Houston.",
    date: "June 11, 2026",
    category: "Emergency Response",
  },
  {
    slug: "five-slab-leak-warning-signs",
    title:
      "5 Slab Leak Warning Signs Every Houston Homeowner Should Know",
    description:
      "Slab leak detection in Houston starts with knowing what to look for. Here are the 5 warning signs most homeowners miss and how to confirm a leak.",
    date: "June 10, 2026",
    category: "Slab Leaks",
  },
  {
    slug: "slab-leaks-houston-clay-soil",
    title:
      "Slab Leaks in Houston: Why Our Clay Soil Makes Them Almost Inevitable",
    description:
      "Houston sits on expansive clay soil that moves up to 4 inches per season. Here is why the soil breaks pipes under your slab and what the math says about your risk.",
    date: "June 9, 2026",
    category: "Slab Leaks",
  },
  {
    slug: "texas-freeze-survival-checklist",
    title:
      "The Texas Freeze Survival Checklist Every Houston Homeowner Needs Before Winter",
    description:
      "72 hours before, during, and after the thaw. An interactive checklist covering every step to protect your home from freeze damage, plus the one thing a checklist cannot do at 3 a.m.",
    date: "June 3, 2026",
    category: "Freeze protection",
  },
  {
    slug: "houston-home-insurance-rising-smart-shutoff",
    title:
      "Why Houston Home Insurance Keeps Rising, and the Install That Pushes Back",
    description:
      "Texas premiums are up 46% in two years. Water damage is the leading claim category. One install earns a 10-15% carrier credit and prevents the claim that drives the increase.",
    date: "June 3, 2026",
    category: "Insurance savings",
  },
  {
    slug: "frozen-pipes-while-traveling-winter",
    title:
      "Leaving Town This Winter? Frozen Pipes Don't Wait for You to Come Home",
    description:
      "An empty house during a freeze has no one to drip faucets, no one to catch the burst, and no one to find the water until days later. How remote shutoff changes the math.",
    date: "June 3, 2026",
    category: "Winter travel protection",
  },
  {
    slug: "cost-of-burst-pipe-texas",
    title:
      "The Real Cost of a Burst Pipe in Texas (and How Fast It Adds Up)",
    description:
      "A single burst pipe runs $7,000 to $70,000 depending on response time. The repair cost breakdown, the insurance consequences, and the $999 install that limits damage to seconds.",
    date: "June 3, 2026",
    category: "Water damage costs",
  },
  {
    slug: "smart-vs-manual-water-shutoff-freeze",
    title:
      "Smart Water Shutoff vs. Manual Shutoff: What Actually Saves Your Home in a Freeze",
    description:
      "A manual valve only works if you are home, awake, and fast. A smart shutoff responds in 8 seconds while you sleep. Side-by-side comparison, device options, and the insurance credit.",
    date: "June 3, 2026",
    category: "Device comparison",
  },
  {
    slug: "best-home-investment-texas-tight-budget",
    title: "The Best $999 a Texas Homeowner Can Spend in a Hard Year",
    description:
      "One home upgrade under $1,000 returns money three ways: recurring insurance credit, catastrophic loss prevention, and resale value. The math for 2026.",
    date: "May 28, 2026",
    category: "Home investment",
  },
  {
    slug: "smart-water-shutoff-texas-vacation-rentals",
    title:
      "Smart Water Shutoff for Texas Vacation Rentals: A Galveston, Lake Conroe, and Lake Livingston Owner's Guide",
    description:
      "Why Texas vacation rental owners need a certified smart shutoff. Insurance credits, 8-second response, remote monitoring from anywhere.",
    date: "May 28, 2026",
    category: "Vacation home protection",
  },
];

export default function BlogIndex() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hydrosensetx.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://hydrosensetx.com/blog" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="bg-ink-950">
        <section className="py-16 lg:py-24">
          <div className="section-container max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-hydro-400 font-medium mb-4">
              Blog
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] text-fog-50 mb-4">
              Guides and Data for Texas Homeowners
            </h1>
            <p className="text-fog-200 text-lg leading-relaxed mb-12">
              Insurance credits, freeze protection, home investment ROI, and
              install insights.
            </p>

            <div className="space-y-6">
              {posts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-ink-800/40 border border-ink-700/30 rounded-xl p-6 lg:p-8 hover:border-hydro-400/30 transition-all group"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-fog-400 mb-2">
                    {post.category}
                  </p>
                  <h2 className="text-fog-50 font-semibold text-lg lg:text-xl group-hover:text-hydro-400 transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-fog-300 leading-relaxed mb-3">
                    {post.description}
                  </p>
                  <p className="text-fog-400 text-sm">{post.date}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
