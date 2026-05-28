"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CityViewEvent({ cityName }: { cityName: string }) {
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "view_item", {
        items: [{ item_name: cityName, item_category: "service_area" }],
      });
    }
  }, [cityName]);

  return null;
}
