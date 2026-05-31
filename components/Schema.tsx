const SITE_URL = "https://hydrosensetx.com";

export default function Schema() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${SITE_URL}/#business`,
    name: "HydroSense Texas",
    legalName: "Lead Ledger Pro LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-horizontal-light.png`,
    image: `${SITE_URL}/og-image.png`,
    telephone: "+1-281-694-5754",
    priceRange: "$$",
    description:
      "Licensed smart water shutoff installation across the Houston metro. Carrier-recognized certificates that qualify Texas homeowners for homeowners insurance credits. Installed under Texas Registered Master Plumber license MPL 43057.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.7604,
      longitude: -95.3698,
    },
    areaServed: [
      { "@type": "City", name: "Houston" },
      { "@type": "City", name: "Katy" },
      { "@type": "City", name: "Cypress" },
      { "@type": "City", name: "The Woodlands" },
      { "@type": "City", name: "Sugar Land" },
      { "@type": "City", name: "Spring" },
      { "@type": "City", name: "Baytown" },
      { "@type": "City", name: "Galveston" },
      { "@type": "City", name: "Lake Conroe" },
      { "@type": "City", name: "Lake Livingston" },
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "Texas Registered Master Plumber",
      identifier: "MPL 43057",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-281-694-5754",
      contactType: "customer service",
      areaServed: "US-TX",
      availableLanguage: "English",
    },
    // sameAs: [ add Google Business Profile URL and social profiles once live ]
    // aggregateRating: add ONLY when real reviews exist
    ...(process.env.GOOGLE_BUSINESS_PROFILE_URL
      ? { sameAs: [process.env.GOOGLE_BUSINESS_PROFILE_URL] }
      : {}),
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#install-service`,
    serviceType: "Smart water shutoff installation",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Houston metro, Texas",
    },
    description:
      "Professional installation of a carrier-recognized smart water shutoff device (Moen Flo, Phyn, or StreamLabs) under a Texas Master Plumber license, including the insurance certificate that qualifies homeowners for water-damage premium credits.",
    offers: [
      {
        "@type": "Offer",
        name: "Standalone install",
        price: "999",
        priceCurrency: "USD",
        description:
          "Device installed and insurance certificate issued. Base price for a standard single-family home with an accessible main line.",
      },
      {
        "@type": "Offer",
        name: "Basic plan",
        price: "99",
        priceCurrency: "USD",
        description:
          "Install, certificate issued, certificate sent to your agent, email support. Billed annually.",
      },
      {
        "@type": "Offer",
        name: "Standard plan",
        price: "199",
        priceCurrency: "USD",
        description:
          "Everything in Basic plus annual certificate renewal, 24/7 leak monitoring alerts, and priority scheduling. Billed annually.",
      },
      {
        "@type": "Offer",
        name: "Premier plan",
        price: "399",
        priceCurrency: "USD",
        description:
          "Everything in Standard plus annual device inspection, insurance liaison service, warranty extension, dedicated account manager, and same-day emergency response. Billed annually.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
    </>
  );
}
