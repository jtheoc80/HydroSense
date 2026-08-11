import { installationScopeDisclosure } from "./installation-scope";

/**
 * Device details are intentionally limited to installation-relevant facts from
 * manufacturer documentation. Product capabilities, app services, and model
 * specifications can change; verify the current manufacturer requirements before
 * issuing a final proposal.
 */

export interface DeviceVideo {
  youtubeId?: string;
  videoTitle: string;
  fallbackUrl: string;
  fallbackLabel: string;
}

export interface Device {
  slug: string;
  name: string;
  tagline: string;
  howItWorks: string;
  keyFacts: string[];
  bestFor: string;
  officialSite: string;
  detectionMethod: string;
  setupProfile: string;
  installType: string;
  faqs: { q: string; a: string }[];
  video: DeviceVideo;
}

const insuranceAnswer = (deviceName: string) =>
  `Some insurers may offer an incentive for an approved automatic water shutoff such as ${deviceName}, but eligibility varies by insurer, policy, model, installation, and documentation requirement. Confirm the requirement with your insurance agent before purchasing for a discount. HydroSense provides an installation record and helps locate manufacturer verification documents when available; neither the device nor the documentation guarantees a credit.`;

export const devices: Record<string, Device> = {
  "moen-flo": {
    slug: "moen-flo",
    name: "Flo by Moen",
    tagline: "Inline flow-and-pressure monitoring with automatic shutoff control.",
    howItWorks:
      "The Moen Flo Shutoff installs on the home's domestic potable-water line and monitors water activity through the manufacturer platform. Depending on device settings and conditions, it can alert the homeowner and close the valve automatically.",
    keyFacts: [
      "Designed for installation on compatible potable-water service lines, including copper, PEX, and PVC",
      "Requires standard 120V power and 2.4 GHz Wi-Fi for setup, updates, app alerts, and remote control",
      "The manufacturer says the device can continue local monitoring and store data during a Wi-Fi interruption, while real-time alerts and remote control require connectivity",
      "Galvanized piping at or near the installation point requires evaluation and may need replacement or filtration before installation",
      "Moen states that core device features and data do not require a monthly fee",
    ],
    bestFor:
      "Homes suited to an inline device where the owner wants whole-home domestic-water flow-and-pressure monitoring, app visibility, and automatic valve control.",
    officialSite: "https://www.moen.com/flo",
    detectionMethod: "Flow and pressure monitoring",
    setupProfile: "120V power + 2.4 GHz Wi-Fi",
    installType: "Inline on the potable main",
    video: {
      youtubeId: "lLdCoFjWcr0",
      videoTitle: "Never Miss A Drip with the Flo by Moen Smart Water Shutoff",
      fallbackUrl: "https://www.moen.com/flo/how-it-works",
      fallbackLabel: "View the official Flo by Moen overview",
    },
    faqs: [
      {
        q: "Can Flo by Moen qualify for an insurance discount?",
        a: insuranceAnswer("Flo by Moen"),
      },
      {
        q: "Does Flo by Moen require a HydroSense subscription?",
        a: "No. A HydroSense care plan is optional and is not required for the device's manufacturer-provided core functions. Moen states that core Flo device features and data are available without a monthly fee. Connectivity, app-account, and manufacturer-service requirements still apply.",
      },
      {
        q: "What does HydroSense verify before a Flo installation?",
        a: `We verify the domestic potable-water line, pipe size and material, nearby galvanized piping, valve condition, installation space, power, and 2.4 GHz Wi-Fi reach. ${installationScopeDisclosure}`,
      },
    ],
  },
  "phyn-plus": {
    slug: "phyn-plus",
    name: "Phyn Plus",
    tagline: "Pressure-wave analysis with whole-home domestic-water monitoring and automatic shutoff.",
    howItWorks:
      "Phyn Plus installs on the domestic water supply after the primary shutoff and before downstream household branches. It uses pressure-based analysis through the manufacturer platform to identify water events, provide alerts, and control the integrated shutoff valve.",
    keyFacts: [
      "Installed on the domestic water supply immediately after the main shutoff and before downstream household branches or fixtures",
      "Manufacturer guidance requires installation within 11 feet of a 120V outlet and strongly recommends GFCI protection",
      "Requires reliable broadband internet and a strong 2.4 GHz Wi-Fi signal at the installation location",
      "The Phyn app can generate a Proof of Activation document, but the insurer determines whether that document satisfies a policy requirement",
      "Outdoor installation is possible only when the location meets the manufacturer's mounting, spray, and environmental requirements",
    ],
    bestFor:
      "Homes suited to an inline device where the owner wants pressure-based whole-home domestic-water monitoring, plumbing insights, and automatic valve control.",
    officialSite: "https://www.phyn.com",
    detectionMethod: "Pressure-wave analysis",
    setupProfile: "120V power + reliable 2.4 GHz Wi-Fi",
    installType: "Inline on the domestic water supply",
    video: {
      videoTitle: "The Phyn Plus Smart Water Assistant",
      fallbackUrl: "https://phyn.com/products/phyn-plus-smart-water-assistant-shutoff-v2",
      fallbackLabel: "View the official Phyn Plus product page",
    },
    faqs: [
      {
        q: "Can Phyn Plus qualify for an insurance discount?",
        a: insuranceAnswer("Phyn Plus"),
      },
      {
        q: "What Wi-Fi does Phyn Plus require?",
        a: "Current manufacturer guidance requires a strong 2.4 GHz Wi-Fi signal and an always-on broadband connection at the installation location. Some mesh or band-steering networks may require a dedicated 2.4 GHz or guest-network setup.",
      },
      {
        q: "What does HydroSense verify before a Phyn Plus installation?",
        a: `We verify the domestic-line position, pipe size and material, mounting environment, outlet distance, Wi-Fi strength, internet availability, and valve condition. ${installationScopeDisclosure}`,
      },
    ],
  },
  streamlabs: {
    slug: "streamlabs",
    name: "StreamLabs Control",
    tagline: "Ultrasonic flow measurement with configurable alerts and automatic shutoff.",
    howItWorks:
      "StreamLabs Control installs inline on the domestic water entry line, uses ultrasonic measurement to monitor household flow, and controls an integrated shutoff valve through device settings and the StreamLabs app.",
    keyFacts: [
      "Manufacturer guidance lists compatibility with 3/4-inch, 1-inch, and 1-1/4-inch pipe diameters",
      "Installed after the main shutoff and pressure-reducing valve, when present, and before downstream branches",
      "Requires 2.4 GHz Wi-Fi and power within reach of the manufacturer power supply",
      "The manufacturer says automatic shutoff can still operate without Wi-Fi when Auto-Shut is enabled, while app reporting and remote control require connectivity",
      "Fire-sprinkler and fire-suppression piping are excluded from HydroSense installations; the unit should be installed indoors or in a covered, protected location",
      "Optional Smart Alerts learn normal water use over a seven-day period",
    ],
    bestFor:
      "Homes suited to an inline device where the owner wants ultrasonic flow measurement, configurable leak thresholds, and automatic valve control.",
    officialSite: "https://streamlabswater.com/pages/streamlabs-control",
    detectionMethod: "Ultrasonic flow measurement",
    setupProfile: "Power + 2.4 GHz Wi-Fi + protected location",
    installType: "Inline on the domestic water entry line",
    video: {
      youtubeId: "IOsW1SvFp2g",
      videoTitle: "How the StreamLabs Water Control Works",
      fallbackUrl: "https://streamlabswater.com/pages/streamlabs-control",
      fallbackLabel: "View the official StreamLabs Control page",
    },
    faqs: [
      {
        q: "Can StreamLabs Control qualify for an insurance discount?",
        a: insuranceAnswer("StreamLabs Control"),
      },
      {
        q: "Will StreamLabs Control shut off water if Wi-Fi is down?",
        a: "The manufacturer says the Control can still close the valve after detecting a leak without an active Wi-Fi connection when Auto-Shut is enabled. App reporting, notifications, and remote control are unavailable until connectivity returns.",
      },
      {
        q: "What does HydroSense verify before a StreamLabs installation?",
        a: `We verify domestic-line pipe diameter, installation order relative to the shutoff and pressure-reducing valve, protected placement, outlet reach, and 2.4 GHz Wi-Fi. ${installationScopeDisclosure}`,
      },
    ],
  },
  guardian: {
    slug: "guardian",
    name: "Guardian by Elexa",
    tagline: "A sensor-based retrofit controller for compatible quarter-turn ball valves.",
    howItWorks:
      "Guardian uses point leak detectors that communicate with a motorized controller mounted over an existing compatible quarter-turn valve on the domestic water line. When a detector senses water or a configured freezing condition, the controller can close that valve without cutting into the pipe.",
    keyFacts: [
      "The manufacturer lists compatibility with existing 1/2-inch to 1-1/4-inch quarter-turn metal ball valves",
      "The valve controller mounts over the existing valve without cutting into the water line",
      "Leak detectors must be placed at the fixtures or locations the homeowner wants to monitor",
      "The manufacturer describes offline shutoff functionality and offers an optional battery backup",
      "This is domestic-water point-sensor protection rather than whole-home flow or pressure analysis",
    ],
    bestFor:
      "Homes with a compatible, accessible domestic-line quarter-turn ball valve where a sensor-based retrofit is preferable to cutting an inline device into the pipe.",
    officialSite: "https://getguardian.com",
    detectionMethod: "Point leak and temperature sensors",
    setupProfile: "Compatible ball valve + planned sensor locations",
    installType: "Retrofit over an existing domestic-line valve",
    video: {
      youtubeId: "4NXKJxAwkF8",
      videoTitle: "Meet Guardian by Elexa",
      fallbackUrl: "https://getguardian.com/pages/how-it-works",
      fallbackLabel: "View the official Guardian overview",
    },
    faqs: [
      {
        q: "Can Guardian be installed without cutting the domestic water line?",
        a: "Yes, when the home has a compatible and accessible quarter-turn metal ball valve. The Guardian controller mounts over the existing valve. The valve type, handle clearance, mounting room, and ability to fully operate the valve must be verified first.",
      },
      {
        q: "Can Guardian qualify for an insurance discount?",
        a: insuranceAnswer("Guardian by Elexa"),
      },
      {
        q: "How is Guardian different from an inline monitor?",
        a: "Guardian relies on point sensors placed near toilets, appliances, water heaters, drains, and other domestic-water risk areas. It does not analyze household water flow or pressure through the domestic line in the same way as an inline whole-home monitor.",
      },
    ],
  },
};

export const deviceSlugs = Object.keys(devices);
export const deviceList = Object.values(devices);
