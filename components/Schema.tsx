export default function Schema() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HydroSense Texas",
    url: "https://hydrosensetx.com",
    telephone: "+12816945754",
    description:
      "Texas Master Plumber installed smart water shutoff systems with carrier-recognized insurance discount certification. Houston metro and surrounding Texas markets.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    ...(process.env.GOOGLE_BUSINESS_PROFILE_URL
      ? { sameAs: [process.env.GOOGLE_BUSINESS_PROFILE_URL] }
      : {}),
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: "HydroSense Texas",
    url: "https://hydrosensetx.com",
    telephone: "+12816945754",
    priceRange: "$$",
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
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Smart water shutoff installation",
    provider: {
      "@type": "Organization",
      name: "HydroSense Texas",
    },
    areaServed: {
      "@type": "State",
      name: "Texas",
    },
    description:
      "Licensed Texas Master Plumber installs carrier-recognized smart water shutoff valves (Moen Flo, Phyn, StreamLabs) and issues the insurance certificate required to apply a 5-15% homeowners discount.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
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
