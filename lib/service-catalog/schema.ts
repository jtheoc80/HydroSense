import { activeServices, serviceCatalog } from "./catalog";

const SITE_URL = "https://hydrosensetx.com";

export function buildPricingJsonLd() {
  const fixedOffers = activeServices.flatMap((service) => {
    if (service.price.type !== "fixed") return [];

    return [
      {
        "@type": "Offer",
        sku: service.id,
        name: service.name,
        description: service.description,
        price: service.price.amount,
        priceCurrency: serviceCatalog.currency,
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/pricing#${service.id.toLowerCase()}`,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          serviceType: service.category,
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: service.price.amount,
          priceCurrency: serviceCatalog.currency,
          unitText: service.price.unit,
          ...(service.price.unit === "year" ? { billingDuration: "P1Y" } : {}),
        },
      },
    ];
  });

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/pricing#smart-water-shutoff-installation`,
    name: "HydroSense smart water shutoff installation",
    description:
      "Published line-size pricing for compatible smart shutoff devices and standard domestic-water installation in Greater Houston.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: "HydroSense Texas",
      url: SITE_URL,
    },
    areaServed: "Greater Houston, Texas",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `HydroSense public service catalog ${serviceCatalog.catalogVersion}`,
      itemListElement: fixedOffers,
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Catalog version",
        value: serviceCatalog.catalogVersion,
      },
      {
        "@type": "PropertyValue",
        name: "Quote-required services",
        value: activeServices
          .filter((service) => service.price.type === "quote_required")
          .map((service) => `${service.id}: ${service.name}`)
          .join("; "),
      },
      {
        "@type": "PropertyValue",
        name: "Final written proposal required",
        value: true,
      },
    ],
  } as const;
}
