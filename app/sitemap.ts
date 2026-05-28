import { MetadataRoute } from "next";
import { cityKeys } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hydrosensetx.com";

  const cityPages = cityKeys.map((city) => ({
    url: `${baseUrl}/service-area/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...cityPages,
  ];
}
