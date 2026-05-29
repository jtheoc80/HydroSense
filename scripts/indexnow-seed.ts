import { pingIndexNow } from "../lib/indexnow";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hydrosensetx.com";

const urls: string[] = [
  `${SITE}/`,
  `${SITE}/insurance/ho-a-vs-ho-b-ho-3`,
  `${SITE}/freeze-damage-texas`,
  `${SITE}/devices`,
  `${SITE}/devices/moen-flo`,
  `${SITE}/devices/phyn-plus`,
  `${SITE}/devices/streamlabs`,
  `${SITE}/devices/guardian`,
  `${SITE}/service-area`,
  `${SITE}/service-area/houston`,
  `${SITE}/service-area/katy`,
  `${SITE}/service-area/cypress`,
  `${SITE}/service-area/the-woodlands`,
  `${SITE}/service-area/sugar-land`,
  `${SITE}/service-area/spring`,
  `${SITE}/service-area/baytown`,
  `${SITE}/service-area/galveston`,
  `${SITE}/service-area/lake-conroe`,
  `${SITE}/service-area/lake-livingston`,
  `${SITE}/blog`,
  `${SITE}/blog/smart-water-shutoff-texas-vacation-rentals`,
  `${SITE}/blog/best-home-investment-texas-tight-budget`,
  `${SITE}/privacy`,
  `${SITE}/terms`,
];

async function main() {
  console.log(`Seeding ${urls.length} URLs to IndexNow...`);
  const result = await pingIndexNow(urls);
  console.log("Result:", result);
}

main().catch(console.error);
