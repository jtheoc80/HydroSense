import { pingIndexNow } from "../lib/indexnow";
import { getIndexNowUrls } from "../lib/seo/indexable-pages";

const urls = getIndexNowUrls();

async function main() {
  console.log(`Seeding ${urls.length} registry-approved URLs to IndexNow...`);
  const result = await pingIndexNow(urls);
  console.log("Result:", result);
}

main().catch(console.error);
