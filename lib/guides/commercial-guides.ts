import { deviceList, devices, type Device } from "@/lib/devices";
import { installationScopeDisclosure } from "@/lib/installation-scope";
import {
  formatUsd,
  getFixedService,
  installationServices,
  serviceCatalog,
} from "@/lib/service-catalog/catalog";

export const guideCategories = [
  "Cost",
  "Sizing",
  "Device selection",
  "Installation",
  "Reliability",
] as const;

export type GuideCategory = (typeof guideCategories)[number];
export type CommercialGuideKind =
  | "cost"
  | "sizing"
  | "comparison"
  | "plumber"
  | "outage";

export interface CommercialGuideSection {
  id: string;
  eyebrow: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
}

export interface CommercialGuideLink {
  href: string;
  label: string;
  description: string;
}

export interface CommercialGuideSource {
  label: string;
  href: string;
  note: string;
}

export interface CommercialGuide {
  slug: string;
  href: string;
  kind: CommercialGuideKind;
  category: GuideCategory;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  directQuestion: string;
  directAnswer: string;
  homeownerMeaning?: string;
  sections: readonly CommercialGuideSection[];
  relatedLinks: readonly CommercialGuideLink[];
  sourceNotes?: readonly CommercialGuideSource[];
}

export const lineSizeLabels = {
  "0.75": "3/4 inch",
  "1.00": "1 inch",
  "1.25": "1 1/4 inch",
  "1.50": "1 1/2 inch",
  "2.00": "2 inch",
} as const;

function fixedInstallationAmount(service: (typeof installationServices)[number]) {
  if (service.price.type !== "fixed") {
    throw new Error(`Installation service ${service.id} must have a fixed catalog price`);
  }
  return service.price.amount;
}

const installationAmounts = installationServices.map(fixedInstallationAmount);
export const installationStartingPrice = Math.min(...installationAmounts);
export const installationMaximumStartingPrice = Math.max(...installationAmounts);

export const installationGuideRows = installationServices.map((service) => ({
  lineSize: lineSizeLabels[service.incomingLineSize],
  price: formatUsd(fixedInstallationAmount(service)),
  approach: service.deviceFamily
    ? `${service.deviceFamily.name} designated large-line family`
    : "Compatible standard residential device",
  inclusion: service.commercialGradeDeviceIncluded
    ? "Compatible commercial-grade device + standard installation"
    : "Compatible device + standard installation",
  verification: service.deviceFamily
    ? "Domestic-main size, material, clearance, flow needs, power, and final FloLogic configuration"
    : "Domestic-main size, material, valve arrangement, clearance, power, connectivity, and device fit",
  commercialGrade: service.commercialGradeDeviceIncluded,
}));

function requiredDevice(slug: string): Device {
  const device = devices[slug];
  if (!device) throw new Error(`Missing governed device ${slug}`);
  return device;
}

function requiredFact(slug: string, pattern: RegExp): string {
  const device = requiredDevice(slug);
  const fact = device.keyFacts.find((candidate) => pattern.test(candidate));
  if (!fact) throw new Error(`Missing governed ${device.name} fact: ${pattern}`);
  return fact;
}

const moen = requiredDevice("moen-flo");
const phyn = requiredDevice("phyn-plus");
const streamlabs = requiredDevice("streamlabs");
const guardian = requiredDevice("guardian");
const flologic = requiredDevice("flologic");

export const comparisonGuideRows = [
  {
    device: moen.name,
    href: `/devices/${moen.slug}`,
    detection: moen.detectionMethod,
    installation: moen.installType,
    lineSizeFit: "Compatible residential domestic mains; exact supported size is verified before selection",
    power: moen.setupProfile,
    connectivity: "App alerts and remote control require connectivity",
    localBehavior: "Manufacturer guidance in HydroSense data says local monitoring and stored data continue during a Wi-Fi interruption",
    largeLineFit: "Not HydroSense's designated 1 1/2-inch or 2-inch family",
    bestFit: moen.bestFor,
  },
  {
    device: phyn.name,
    href: `/devices/${phyn.slug}`,
    detection: phyn.detectionMethod,
    installation: phyn.installType,
    lineSizeFit: "Compatible residential domestic mains; exact supported size is verified before selection",
    power: phyn.setupProfile,
    connectivity: "Current governed data requires always-on broadband and strong 2.4 GHz Wi-Fi",
    localBehavior: "HydroSense does not promise offline behavior that is not documented in the governed device data",
    largeLineFit: "Not HydroSense's designated 1 1/2-inch or 2-inch family",
    bestFit: phyn.bestFor,
  },
  {
    device: streamlabs.name,
    href: `/devices/${streamlabs.slug}`,
    detection: streamlabs.detectionMethod,
    installation: streamlabs.installType,
    lineSizeFit: "Manufacturer guidance lists 3/4-inch, 1-inch, and 1 1/4-inch pipe diameters",
    power: streamlabs.setupProfile,
    connectivity: "App reporting, notifications, and remote control require connectivity",
    localBehavior: "Manufacturer guidance says Auto-Shut can operate without Wi-Fi when it is enabled",
    largeLineFit: "Governed compatibility stops at 1 1/4 inches",
    bestFit: streamlabs.bestFor,
  },
  {
    device: flologic.name,
    href: `/devices/${flologic.slug}`,
    detection: flologic.detectionMethod,
    installation: flologic.installType,
    lineSizeFit: "HydroSense designated family for qualifying 1 1/2-inch and 2-inch domestic mains",
    power: flologic.setupProfile,
    connectivity: "App and remote features depend on the configured Gateway or Connect service",
    localBehavior: "Local monitoring and shutoff continue without internet; a standard backup battery supports AC interruptions",
    largeLineFit: "HydroSense's designated supported large-line family; 2-inch scope is commercial grade",
    bestFit: flologic.bestFor,
  },
] as const;

export const outageGuideRows = [
  {
    device: moen.name,
    href: `/devices/${moen.slug}`,
    monitoring: requiredFact("moen-flo", /continue local monitoring/i),
    automaticShutoff: "Depends on the configured device behavior and available power; HydroSense confirms current requirements before proposal",
    appAndRemote: "Real-time alerts and remote control require Wi-Fi connectivity",
    powerProfile: "Standard 120V power is required; no backup-power promise is made from the governed HydroSense data",
  },
  {
    device: phyn.name,
    href: `/devices/${phyn.slug}`,
    monitoring: "Current HydroSense data requires reliable broadband and strong 2.4 GHz Wi-Fi; it does not document a general offline-operation claim",
    automaticShutoff: "HydroSense confirms current manufacturer behavior instead of promising an undocumented offline mode",
    appAndRemote: "Internet and Wi-Fi are required for the connected manufacturer experience described in the governed data",
    powerProfile: "Installation must be within the governed outlet distance; backup behavior is confirmed before proposal if relevant",
  },
  {
    device: streamlabs.name,
    href: `/devices/${streamlabs.slug}`,
    monitoring: requiredFact("streamlabs", /automatic shutoff can still operate without Wi-Fi/i),
    automaticShutoff: "Auto-Shut can operate without Wi-Fi when the feature is enabled",
    appAndRemote: "App reporting, notifications, and remote control are unavailable until connectivity returns",
    powerProfile: "The device requires power within reach of the manufacturer supply; Wi-Fi resilience is not the same as power-outage resilience",
  },
  {
    device: guardian.name,
    href: `/devices/${guardian.slug}`,
    monitoring: "Point sensors communicate with the valve controller; the manufacturer describes offline shutoff functionality",
    automaticShutoff: "A configured sensor event can close the compatible domestic-line valve offline",
    appAndRemote: "Connected reporting and remote functions remain separate from the local sensor-to-controller path",
    powerProfile: requiredFact("guardian", /optional battery backup/i),
  },
  {
    device: flologic.name,
    href: `/devices/${flologic.slug}`,
    monitoring: requiredFact("flologic", /do not replace local system operation/i),
    automaticShutoff: "Local monitoring and configured shutoff operation continue without internet service",
    appAndRemote: "App alerts, remote oversight, and remote controls depend on configured connectivity",
    powerProfile: requiredFact("flologic", /standard backup battery/i),
  },
] as const;

const annualCare = getFixedService("HS-CARE-ANNUAL-001");
const formattedStartingPrice = formatUsd(installationStartingPrice);
const formattedMaximumPrice = formatUsd(installationMaximumStartingPrice);

export const commercialGuides: readonly CommercialGuide[] = [
  {
    slug: "smart-water-shutoff-installation-cost-houston",
    href: "/guides/smart-water-shutoff-installation-cost-houston",
    kind: "cost",
    category: "Cost",
    title: "Smart water shutoff installation cost in Houston",
    metaTitle: "Smart Water Shutoff Installation Cost in Houston | HydroSense",
    metaDescription:
      "See HydroSense smart water shutoff starting prices by verified domestic-main size, what standard installation includes, and what requires a written quote.",
    eyebrow: "Cost and written scope",
    h1: "Smart water shutoff installation cost in Houston",
    intro:
      "Use the catalog-backed table below to understand standard starting prices before requesting a property-specific compatibility review.",
    directQuestion: "How much does a smart water shutoff cost to install in Houston?",
    directAnswer: `HydroSense smart water shutoff installation in Greater Houston starts at ${formattedStartingPrice} and currently ranges to ${formattedMaximumPrice} for a verified 2-inch domestic main. Each published starting price includes a compatible device and standard installation. Line size is a major price factor; plumbing compatibility, extra material, corrective work, and final equipment are confirmed in the written proposal.`,
    homeownerMeaning:
      "Your visible pipe or existing valve is not enough to set the final scope. HydroSense verifies the incoming domestic main and installation conditions first.",
    sections: [
      {
        id: "included",
        eyebrow: "Standard project",
        heading: "What each published starting price includes",
        paragraphs: [
          "Every installation row combines one compatible smart water shutoff device with standard installation on the verified incoming domestic water line. The standard handoff includes manufacturer-app setup where applicable, an automatic shutoff test, homeowner operating guidance, and an itemized installation record.",
          "Qualifying 1 1/2-inch and 2-inch services use FloLogic as HydroSense's designated supported large-line device family. The 2-inch service retains its commercial-grade designation, while the exact model and required equipment remain subject to the written proposal.",
        ],
      },
      {
        id: "review-required",
        eyebrow: "First-party scope review",
        heading: "When a standard installation becomes review-required",
        paragraphs: [
          "HydroSense checks line access, pipe size and material, existing valves, pressure-reducing-valve position, installation clearance, nearby power, connectivity, and the need for specialized fittings before committing to the final project scope.",
          "Corrective plumbing, electrical modification, dual mains, inaccessible routing, repairs, and other non-standard conditions are not guessed into the public price. They are identified and quoted in the written proposal.",
        ],
      },
      {
        id: "boundaries",
        eyebrow: "Scope boundary",
        heading: "Domestic water is standard; irrigation and fire piping are not",
        paragraphs: [
          installationScopeDisclosure,
          "Irrigation is a separate quote-required catalog scope when the homeowner specifically requests it. The proposal must confirm the actual plumbing configuration and equipment; HydroSense does not assume that one shutoff device controls both domestic water and irrigation.",
        ],
      },
      {
        id: "annual-care",
        eyebrow: "Recurring option",
        heading: "Annual care stays outside the one-time installation total",
        paragraphs: [
          `Annual system care is optional and currently published at ${formatUsd(annualCare.price.amount)} per ${annualCare.price.unit}. It is recurring and is never included in the one-time installation total. Manufacturer core monitoring and automatic shutoff do not require a HydroSense care plan.`,
        ],
      },
    ],
    relatedLinks: [
      { href: "/pricing", label: "Public pricing", description: "Review the full service catalog, optional add-ons, and quote-required scope." },
      { href: "/guides/what-size-smart-water-shutoff-do-i-need", label: "Line-size guide", description: "See why verified incoming-main size changes device selection and price." },
      { href: "/devices", label: "Device options", description: "Compare the supported HydroSense installation profiles." },
      { href: "/devices/flologic", label: "FloLogic", description: "Review the designated large-line family for qualifying domestic mains." },
      { href: "/service-area", label: "Service area", description: "Check Greater Houston coverage before requesting an assessment." },
    ],
  },
  {
    slug: "what-size-smart-water-shutoff-do-i-need",
    href: "/guides/what-size-smart-water-shutoff-do-i-need",
    kind: "sizing",
    category: "Sizing",
    title: "What size smart water shutoff do I need?",
    metaTitle: "What Size Smart Water Shutoff Do I Need? | HydroSense",
    metaDescription:
      "Learn how domestic-main size, pipe material, valves, clearance, power, connectivity, and flow needs determine a HydroSense smart shutoff recommendation.",
    eyebrow: "Domestic-main sizing",
    h1: "What size smart water shutoff do I need?",
    intro:
      "Device size follows the verified incoming household water line and installation conditions—not a visual guess from a fixture branch or valve handle.",
    directQuestion: "What size smart water shutoff do I need?",
    directAnswer:
      "Choose a smart water shutoff for the home's verified incoming domestic main—not by guessing from a nearby valve or fixture. HydroSense confirms nominal line size, pipe material, clearance, valve arrangement, PRV position, power, and connectivity. Qualifying 1.5-inch and 2-inch domestic mains use FloLogic as HydroSense's designated supported large-line family, with final model and equipment confirmed in writing.",
    homeownerMeaning:
      "Photographs can help screen the project, but the written proposal follows verified plumbing and device compatibility.",
    sections: [
      {
        id: "do-not-guess",
        eyebrow: "Sizing discipline",
        heading: "Nominal pipe size must be verified, not estimated",
        paragraphs: [
          "A domestic main can change material or diameter near a meter, pressure-reducing valve, transition fitting, or existing shutoff. Measuring the outside of insulation, a valve body, or a branch line can produce the wrong nominal size.",
          "HydroSense identifies the incoming domestic main and confirms the size at the proposed installation location before selecting the device and fittings.",
        ],
      },
      {
        id: "checks-before-quoting",
        eyebrow: "HydroSense field review",
        heading: "What HydroSense checks before quoting",
        paragraphs: [
          "The recommendation considers pipe material, existing valve condition, installation clearance, pressure-reducing-valve relationship, nearby power, required connectivity, protected placement, and the ability to test and service the installed system.",
          "These conditions can change the placement, fitting package, device family, and whether corrective work is needed before the smart shutoff can be commissioned.",
        ],
      },
      {
        id: "large-line-choice",
        eyebrow: "Large domestic mains",
        heading: "Why a 1.5-inch or 2-inch domestic main changes the device choice",
        paragraphs: [
          "Higher-flow and large-line applications require a supported valve architecture that fits the verified line and household demand. HydroSense uses FloLogic as its designated supported large-line device family for qualifying 1.5-inch and 2-inch domestic mains.",
          "That is a HydroSense supported-device decision, not a claim that FloLogic is the only manufacturer worldwide for those sizes. The final configuration, model, power, clearance, and equipment are confirmed in the written proposal; 2-inch HydroSense scope remains commercial grade.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/pricing", label: "Starting prices", description: "Match the verified domestic-main size to the current catalog starting price." },
      { href: "/devices/flologic", label: "FloLogic large-line profile", description: "Review HydroSense's designated supported large-line family." },
      { href: "/guides/flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic", label: "Compare devices", description: "Compare detection, installation, power, connectivity, and fit." },
      { href: "/service-area", label: "Service area", description: "Confirm that the property is within current Greater Houston coverage." },
    ],
  },
  {
    slug: "flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic",
    href: "/guides/flo-by-moen-vs-phyn-vs-streamlabs-vs-flologic",
    kind: "comparison",
    category: "Device selection",
    title: "Flo by Moen vs Phyn vs StreamLabs vs FloLogic",
    metaTitle: "Flo by Moen vs Phyn vs StreamLabs vs FloLogic | HydroSense",
    metaDescription:
      "Compare four HydroSense-supported smart water shutoff families by detection, installation, line-size fit, power, connectivity, and large-line suitability.",
    eyebrow: "Device fit comparison",
    h1: "Flo by Moen vs Phyn vs StreamLabs vs FloLogic",
    intro:
      "This is a fit comparison, not an affiliate ranking. Manufacturer requirements can change and are confirmed again before a written proposal.",
    directQuestion: "How do Flo by Moen, Phyn Plus, StreamLabs, and FloLogic compare?",
    directAnswer:
      "Flo by Moen combines flow-and-pressure monitoring, Phyn Plus uses pressure-wave analysis, StreamLabs Control uses ultrasonic flow measurement, and FloLogic continuously monitors flow for compatible domestic systems. The best fit depends on the home's domestic-main size, pipe arrangement, power, connectivity, installation location, and protection goals. HydroSense confirms the current model and requirements before proposing installation.",
    homeownerMeaning:
      "A device feature list is only one input. The recommendation must also fit the actual pipe, valve, power, signal, and service location.",
    sections: [
      {
        id: "no-universal-winner",
        eyebrow: "Selection principle",
        heading: "A universal winner cannot be named without seeing the home",
        paragraphs: [
          "Inline flow, pressure-wave, ultrasonic, and large-line architectures observe household water differently. A useful comparison connects those approaches to the verified plumbing and the homeowner's desired protection—not to a generic ranking badge.",
          "HydroSense supports multiple families so the written proposal can account for domestic-main size, pipe material, valve layout, installation clearance, power, connectivity, and protected placement.",
        ],
      },
      {
        id: "recommendation-changes",
        eyebrow: "First-party experience",
        heading: "What changes the HydroSense recommendation",
        paragraphs: [
          "A 3/4-inch indoor copper main near power can produce a different recommendation from a 2-inch high-flow domestic main, a protected outdoor location, or a home with a compatible quarter-turn valve and a preference for point sensors.",
          "HydroSense also identifies and excludes fire-sprinkler and fire-suppression piping. Irrigation is considered only when specifically requested and quoted separately.",
        ],
      },
      {
        id: "guardian-alternative",
        eyebrow: "Retrofit alternative",
        heading: "Where Guardian by Elexa fits differently",
        paragraphs: [
          "Guardian is a sensor-based retrofit alternative rather than one of the four primary inline comparison systems. It mounts over a compatible existing quarter-turn domestic-line ball valve and relies on point sensors placed near selected risk areas.",
          "That approach can avoid cutting the pipe when valve type, handle clearance, mounting room, and full valve operation are compatible. It does not analyze whole-home flow or pressure in the same way as an inline monitor.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/devices/moen-flo", label: "Flo by Moen", description: "Review its governed installation and connectivity profile." },
      { href: "/devices/phyn-plus", label: "Phyn Plus", description: "Review pressure-wave monitoring and site requirements." },
      { href: "/devices/streamlabs", label: "StreamLabs Control", description: "Review ultrasonic monitoring and Auto-Shut behavior." },
      { href: "/devices/flologic", label: "FloLogic", description: "Review large-line fit and local system operation." },
      { href: "/devices", label: "All supported devices", description: "See all five HydroSense installation profiles." },
      { href: "/pricing", label: "Starting prices", description: "Review catalog prices by verified incoming domestic-main size." },
    ],
    sourceNotes: [moen, phyn, streamlabs, flologic].map((device) => ({
      label: `${device.name} official manufacturer information`,
      href: device.officialSite,
      note: "HydroSense device data is limited to installation-relevant manufacturer facts and is reconfirmed before proposal.",
    })),
  },
  {
    slug: "do-i-need-a-plumber-for-smart-water-shutoff",
    href: "/guides/do-i-need-a-plumber-for-smart-water-shutoff",
    kind: "plumber",
    category: "Installation",
    title: "Do I need a plumber for a smart water shutoff?",
    metaTitle: "Do You Need a Plumber for a Smart Water Shutoff? | HydroSense",
    metaDescription:
      "See what a professional smart water shutoff installation involves, what HydroSense verifies, and how plumbing, setup, testing, and handoff differ.",
    eyebrow: "Professional installation",
    h1: "Do I need a plumber for a smart water shutoff?",
    intro:
      "The answer depends on the device architecture, but an inline system requires much more than choosing hardware and connecting an app.",
    directQuestion: "Do I need a plumber to install a smart water shutoff?",
    directAnswer:
      "An inline smart water shutoff requires the domestic water line, pipe, valves, fittings, placement, and orientation to be evaluated before the line is modified. HydroSense coordinates plumbing installation under Texas Master Plumber License MPL 43057, then completes compatible-device setup, commissioning, shutoff testing, and homeowner handoff. The written proposal confirms the exact responsibilities and scope before scheduling.",
    homeownerMeaning:
      "Buying a compatible device is not the same as confirming that it can be safely placed, powered, commissioned, and tested on your home's domestic main.",
    sections: [
      {
        id: "different-jobs",
        eyebrow: "One project, distinct responsibilities",
        heading: "Device selection, plumbing work, and commissioning are different tasks",
        paragraphs: [
          "A complete installation separates product selection from the physical work on the domestic line and from the connected-device handoff. HydroSense verifies each layer before the system is considered complete.",
        ],
        bullets: [
          "Select a compatible device for the verified incoming domestic main and protection goals.",
          "Plan cuts, fittings, valves, orientation, support, clearance, and service access.",
          "Inspect pressure, pipe material, existing valve condition, and PRV relationship where relevant.",
          "Confirm power and connectivity at the actual installation location.",
          "Commission the manufacturer app or gateway, configure settings, test shutoff operation, and hand the system over.",
        ],
      },
      {
        id: "before-installation",
        eyebrow: "HydroSense first-party workflow",
        heading: "What HydroSense verifies before installation",
        paragraphs: [
          "The review identifies the incoming domestic line, nominal size, pipe material, existing valve condition, working clearance, PRV relationship where relevant, nearby power, required connectivity, and current device compatibility.",
          "An active leak, failed valve, inaccessible routing, unsuitable material, missing power, or unverified line can move the project from standard scope to corrective work, preparation, or additional technical review.",
        ],
      },
      {
        id: "handoff",
        eyebrow: "Completion standard",
        heading: "What the homeowner receives after installation",
        paragraphs: [
          "HydroSense connects the compatible manufacturer experience, tests automatic shutoff operation, walks the homeowner through normal control and alerts, and provides an itemized installation record with responsible license details.",
          "Product requirements and services can change, so the proposal and handoff confirm the exact model, settings, documentation, and current manufacturer conditions used for that home.",
        ],
      },
      {
        id: "scope-boundary",
        eyebrow: "Explicit exclusion",
        heading: "The plumbing scope is the domestic household water line",
        paragraphs: [
          `${installationScopeDisclosure} Work is coordinated under Texas Master Plumber License MPL 43057.`,
        ],
      },
    ],
    relatedLinks: [
      { href: "/#customer-journey", label: "Installation process", description: "Review the HydroSense path from compatibility review through tested handoff." },
      { href: "/devices", label: "Supported devices", description: "Compare the installation profiles HydroSense currently supports." },
      { href: "/pricing", label: "Starting prices", description: "See device-and-standard-installation prices by verified line size." },
      { href: "/service-area", label: "Greater Houston coverage", description: "Check the current installation service area." },
    ],
  },
  {
    slug: "smart-water-shutoff-power-wifi-outage",
    href: "/guides/smart-water-shutoff-power-wifi-outage",
    kind: "outage",
    category: "Reliability",
    title: "Smart water shutoffs during power or Wi-Fi outages",
    metaTitle: "Do Smart Water Shutoffs Work Without Power or Wi-Fi? | HydroSense",
    metaDescription:
      "Compare device-specific local monitoring, automatic shutoff, app alerts, remote control, connectivity, and battery behavior during outages.",
    eyebrow: "Outage behavior",
    h1: "What happens to a smart water shutoff if power or Wi-Fi goes out?",
    intro:
      "Local monitoring, automatic shutoff, app alerts, remote control, cloud reporting, and backup power are separate capabilities and must be checked device by device.",
    directQuestion: "What happens to a smart water shutoff if power or Wi-Fi goes out?",
    directAnswer:
      "Outage behavior depends on the device and on whether the interruption affects internet service, Wi-Fi, or electrical power. Some supported systems retain local monitoring or configured automatic shutoff without Wi-Fi, while app alerts, remote control, and cloud reporting usually require connectivity. Battery support also varies. HydroSense confirms the selected device's current local, connected, and backup-power behavior before installation.",
    homeownerMeaning:
      "Ask which protections remain local, which features need the cloud, and what happens during an AC outage—rather than accepting a generic 'works offline' claim.",
    sections: [
      {
        id: "separate-capabilities",
        eyebrow: "Reliability vocabulary",
        heading: "Without Wi-Fi is not the same as without power",
        paragraphs: [
          "A device may continue measuring flow or receiving point-sensor signals locally while losing phone alerts and remote control. It may also retain an automatic shutoff rule during an internet interruption but stop if AC power is unavailable and no compatible backup is active.",
          "Cloud history, remote commands, push notifications, local sensing, valve operation, and backup power should be reviewed as separate rows—not compressed into one online/offline label.",
        ],
      },
      {
        id: "checks-before-recommendation",
        eyebrow: "HydroSense first-party review",
        heading: "What HydroSense checks before recommending an outage plan",
        paragraphs: [
          "HydroSense verifies the outlet, circuit environment, Wi-Fi signal, broadband availability, gateway or controller placement, manufacturer account requirements, configured automatic-shutoff settings, and available compatible backup options.",
          "The proposal and handoff document the selected architecture. HydroSense does not extend one manufacturer's offline behavior to every device or promise a feature that is absent from the governed manufacturer data.",
        ],
      },
      {
        id: "homeowner-handoff",
        eyebrow: "Tested expectations",
        heading: "The handoff should explain what the homeowner can still do",
        paragraphs: [
          "The homeowner should know how to operate the physical valve, which settings are stored locally, which alerts require connectivity, how backup power is checked where present, and what to review after service returns.",
          "HydroSense tests shutoff operation at installation and reviews the current manufacturer requirements for the exact model and configuration in the written proposal.",
        ],
      },
    ],
    relatedLinks: [
      { href: "/devices/moen-flo", label: "Flo by Moen", description: "Review governed power and Wi-Fi requirements." },
      { href: "/devices/phyn-plus", label: "Phyn Plus", description: "Review its broadband, Wi-Fi, and outlet profile." },
      { href: "/devices/streamlabs", label: "StreamLabs Control", description: "Review device-specific Auto-Shut behavior without Wi-Fi." },
      { href: "/devices/flologic", label: "FloLogic", description: "Review local operation and standard backup-battery context." },
      { href: "/devices", label: "All supported devices", description: "Compare all five governed installation profiles." },
    ],
    sourceNotes: deviceList.map((device) => ({
      label: `${device.name} official manufacturer information`,
      href: device.officialSite,
      note: "HydroSense reconfirms current power, connectivity, local-operation, and backup requirements for the selected model.",
    })),
  },
];

export const commercialGuideSlugs = commercialGuides.map((guide) => guide.slug);

export function getCommercialGuide(slug: string): CommercialGuide | undefined {
  return commercialGuides.find((guide) => guide.slug === slug);
}

export const guideDiscoverySummary = {
  pricingRange: `${formattedStartingPrice} to ${formattedMaximumPrice}`,
  standardScope: serviceCatalog.policies.standardScope,
  fireSuppressionExclusion: serviceCatalog.policies.fireSuppressionExclusion,
  finalWrittenProposalRequired: serviceCatalog.policies.finalWrittenProposalRequired,
} as const;
