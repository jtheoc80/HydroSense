import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/seo/indexable-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}
