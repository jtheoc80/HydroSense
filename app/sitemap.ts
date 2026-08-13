import type { MetadataRoute } from "next";
import { cityKeys } from "@/lib/cities";
import { deviceSlugs } from "@/lib/devices";

const staticPaths = [
  "",
  "/devices",
  "/pricing",
  "/agent-ready",
  "/service-area",
  "/blog",
  "/blog/slab-leaks-houston-clay-soil",
  "/blog/five-slab-leak-warning-signs",
  "/blog/how-to-find-water-leak-home-houston",
  "/blog/slab-leak-repair-cost-houston",
  "/blog/hidden-water-leak-damage-houston",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hydrosensetx.com";

  const staticPages = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
  }));

  const cityPages = cityKeys.map((city) => ({
    url: `${baseUrl}/service-area/${city}`,
  }));

  const devicePages = deviceSlugs.map((slug) => ({
    url: `${baseUrl}/devices/${slug}`,
  }));

  return [...staticPages, ...cityPages, ...devicePages];
}
