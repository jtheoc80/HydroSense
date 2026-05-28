import { MetadataRoute } from "next";
import { cityKeys } from "@/lib/cities";
import { deviceSlugs } from "@/lib/devices";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hydrosensetx.com";

  const cityPages = cityKeys.map((city) => ({
    url: `${baseUrl}/service-area/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const devicePages = deviceSlugs.map((slug) => ({
    url: `${baseUrl}/devices/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/devices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...cityPages,
    ...devicePages,
  ];
}
