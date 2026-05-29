import { MetadataRoute } from "next";
import { cities, cityKeys } from "@/lib/cities";
import { deviceSlugs } from "@/lib/devices";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hydrosensetx.com";

  const cityPages = cityKeys.map((city) => ({
    url: `${baseUrl}/service-area/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: cities[city].vacationRental ? 0.7 : 0.9,
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
    {
      url: `${baseUrl}/service-area`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insurance/ho-a-vs-ho-b-ho-3`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/freeze-damage-texas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/smart-water-shutoff-texas-vacation-rentals`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/best-home-investment-texas-tight-budget`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...cityPages,
    ...devicePages,
  ];
}
