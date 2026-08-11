const SITE_URL = "https://hydrosensetx.com";

export default function Schema() {
  const sameAs = [
    process.env.GOOGLE_BUSINESS_PROFILE_URL,
    process.env.FACEBOOK_URL,
  ].filter((value): value is string => Boolean(value));

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
      "Professional whole-home smart water shutoff installation across Greater Houston, including device selection, plumbing installation, app setup, shutoff testing, and an itemized installation record. Work coordinated under Texas Master Plumber License MPL 43057.",
    areaServed: [
      { "@type": "City", name: "Houston" },
      { "@type": "City", name: "Katy" },
      { "@type": "City", name: "Cypress" },
      { "@type": "City", name: "The Woodlands" },
      { "@type": "City", name: "Sugar Land" },
      { "@type": "City", name: "Spring" },
      { "@type": "City", name: "Baytown" },
      { "@type": "City", name: "Galveston" },
      { "@type": "City", name: "Conroe" },
      { "@type": "City", name: "Livingston" },
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "Texas Master Plumber License",
      identifier: "MPL 43057",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-281-694-5754",
      contactType: "customer service",
      areaServed: "US-TX",
      availableLanguage: "English",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#smart-water-shutoff-installation`,
    name: "Smart Water Shutoff Installation",
    serviceType: "Whole-home smart water shutoff installation",
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Houston, Texas",
    },
    description:
      "Professional installation and configuration of compatible Flo by Moen, Phyn Plus, and StreamLabs whole-home water monitoring and automatic shutoff systems. Service includes a written scope, plumbing installation, app setup, shutoff testing, homeowner handoff, and an itemized installation record.",
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
