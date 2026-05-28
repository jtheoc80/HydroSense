export default function Schema() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HydroSense Texas",
    url: "https://hydrosensetx.com",
    logo: "https://hydrosensetx.com/brand/logo-horizontal-dark.png",
    telephone: "+12816945754",
    description:
      "Licensed smart water shutoff installs certified under a Texas Master Plumber license, with carrier-recognized insurance discount certification. Houston metro and surrounding Texas markets.",
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
      "Trained, licensed technicians install carrier-recognized smart water shutoff valves (Moen Flo, Phyn, StreamLabs, Guardian) under a Texas Master Plumber license, then issue the insurance certificate required to apply a 5-15% homeowners discount.",
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
