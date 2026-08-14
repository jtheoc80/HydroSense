import {
  BUSINESS_ENTITY_ID,
  SITE_ORIGIN,
} from "@/lib/seo/indexable-pages";

export default function Schema() {
  const sameAs = [
    process.env.GOOGLE_BUSINESS_PROFILE_URL,
    process.env.FACEBOOK_URL,
  ].filter((value): value is string => Boolean(value));

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Plumber"],
    "@id": BUSINESS_ENTITY_ID,
    name: "HydroSense Texas",
    legalName: "Lead Ledger Pro LLC",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/brand/logo-horizontal-light.png`,
    image: `${SITE_ORIGIN}/og-image.png`,
    telephone: "+1-281-694-5754",
    priceRange: "$$",
    description:
      "Professional whole-home smart water shutoff installation across Greater Houston, including device selection, plumbing installation, app setup, shutoff testing, and an itemized installation record. Work coordinated under Texas Master Plumber License MPL 43057.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Greater Houston, Texas",
    },
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
    "@id": `${SITE_ORIGIN}/#smart-water-shutoff-installation`,
    name: "Smart Water Shutoff Installation",
    serviceType: "Whole-home smart water shutoff installation",
    provider: { "@id": BUSINESS_ENTITY_ID },
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
        id="hydrosense-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c"),
        }}
      />
      <script
        id="hydrosense-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(service).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
