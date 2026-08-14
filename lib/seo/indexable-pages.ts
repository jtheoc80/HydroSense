export const SITE_ORIGIN = "https://hydrosensetx.com";
export const BUSINESS_ENTITY_ID = `${SITE_ORIGIN}/#business`;

export type IndexablePageType =
  | "home"
  | "pricing"
  | "device-hub"
  | "device-detail"
  | "service-area-hub"
  | "city-service"
  | "blog-hub"
  | "article"
  | "agent-ready"
  | "legal";

export interface IndexablePage {
  path: string;
  pageType: IndexablePageType;
  title: string;
  indexable: boolean;
  lastModified?: string;
  indexNowEligible: boolean;
}

const searchTeachingUpdate = "2026-08-13";

/**
 * Canonical registry for every public HTML URL HydroSense intentionally exposes
 * to search engines. Machine endpoints, authenticated routes, tests, redirects,
 * and protected noindex editorial URLs must never be added here.
 */
export const indexablePages: readonly IndexablePage[] = [
  { path: "/", pageType: "home", title: "Smart Water Shutoff Installation Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/pricing", pageType: "pricing", title: "Smart Water Shutoff Installation Pricing Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/devices", pageType: "device-hub", title: "Smart Water Shutoff Devices Installed in Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/devices/moen-flo", pageType: "device-detail", title: "Flo by Moen Installation in Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/devices/phyn-plus", pageType: "device-detail", title: "Phyn Plus Installation in Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/devices/streamlabs", pageType: "device-detail", title: "StreamLabs Control Installation in Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/devices/guardian", pageType: "device-detail", title: "Guardian by Elexa Installation in Houston", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area", pageType: "service-area-hub", title: "Greater Houston Smart Water Shutoff Service Area", indexable: true, indexNowEligible: true },
  { path: "/service-area/houston", pageType: "city-service", title: "Smart Water Shutoff Installation in Houston, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/katy", pageType: "city-service", title: "Smart Water Shutoff Installation in Katy, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/cypress", pageType: "city-service", title: "Smart Water Shutoff Installation in Cypress, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/the-woodlands", pageType: "city-service", title: "Smart Water Shutoff Installation in The Woodlands, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/league-city", pageType: "city-service", title: "Smart Water Shutoff Installation in League City, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/pearland", pageType: "city-service", title: "Smart Water Shutoff Installation in Pearland, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/friendswood", pageType: "city-service", title: "Smart Water Shutoff Installation in Friendswood, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/sugar-land", pageType: "city-service", title: "Smart Water Shutoff Installation in Sugar Land, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/spring", pageType: "city-service", title: "Smart Water Shutoff Installation in Spring, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/baytown", pageType: "city-service", title: "Smart Water Shutoff Installation in Baytown, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/galveston", pageType: "city-service", title: "Smart Water Shutoff Installation in Galveston, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/lake-conroe", pageType: "city-service", title: "Smart Water Shutoff Installation in Lake Conroe, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/service-area/lake-livingston", pageType: "city-service", title: "Smart Water Shutoff Installation in Lake Livingston, TX", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/blog", pageType: "blog-hub", title: "HydroSense Smart Water Shutoff and Leak Prevention Guides", indexable: true, indexNowEligible: true },
  { path: "/blog/hidden-water-leak-damage-houston", pageType: "article", title: "Hidden Water Leak Damage: What 6 Months Does to a Houston Home", indexable: true, indexNowEligible: true },
  { path: "/blog/slab-leak-repair-cost-houston", pageType: "article", title: "Slab Leak Repair Cost in Houston: What an Untreated Leak Costs Every Hour", indexable: true, indexNowEligible: true },
  { path: "/blog/how-to-find-water-leak-home-houston", pageType: "article", title: "How to Find a Water Leak in Your Home: A Houston 60-Minute Response Plan", indexable: true, indexNowEligible: true },
  { path: "/blog/five-slab-leak-warning-signs", pageType: "article", title: "5 Slab Leak Warning Signs Every Houston Homeowner Should Know", indexable: true, indexNowEligible: true },
  { path: "/blog/slab-leaks-houston-clay-soil", pageType: "article", title: "Slab Leaks in Houston: Why Our Clay Soil Makes Them Almost Inevitable", indexable: true, indexNowEligible: true },
  { path: "/agent-ready", pageType: "agent-ready", title: "Agent-ready HydroSense Pricing and Service Discovery", indexable: true, lastModified: searchTeachingUpdate, indexNowEligible: true },
  { path: "/privacy", pageType: "legal", title: "Privacy Policy", indexable: true, indexNowEligible: false },
  { path: "/terms", pageType: "legal", title: "Terms of Service", indexable: true, indexNowEligible: false },
];

/** These legacy editorial URLs stay reachable but are protected by X-Robots-Tag. */
export const protectedNoindexPaths = [
  "/insurance/ho-a-vs-ho-b-ho-3",
  "/freeze-damage-texas",
  "/blog/smart-water-shutoff-texas-vacation-rentals",
  "/blog/best-home-investment-texas-tight-budget",
  "/blog/texas-freeze-survival-checklist",
  "/blog/houston-home-insurance-rising-smart-shutoff",
  "/blog/frozen-pipes-while-traveling-winter",
  "/blog/cost-of-burst-pipe-texas",
  "/blog/smart-vs-manual-water-shutoff-freeze",
] as const;

export function absoluteSearchUrl(path: string, origin = SITE_ORIGIN) {
  return new URL(path, `${origin}/`).toString();
}

export function getIndexablePages() {
  return indexablePages.filter((page) => page.indexable);
}

export function getSitemapEntries() {
  return getIndexablePages().map((page) => ({
    url: absoluteSearchUrl(page.path),
    ...(page.lastModified ? { lastModified: page.lastModified } : {}),
  }));
}

export function getIndexNowUrls(origin = SITE_ORIGIN) {
  return getIndexablePages()
    .filter((page) => page.indexNowEligible)
    .map((page) => absoluteSearchUrl(page.path, origin));
}
