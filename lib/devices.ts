/**
 * Video embed verification status (2026-05-27):
 *
 * EMBEDDED (HIGH confidence, verified official channel):
 *   - moen-flo:    youtube.com/@FloTechnologies → lLdCoFjWcr0
 *   - streamlabs:  youtube.com/@streamlabswater1549 → IOsW1SvFp2g
 *   - guardian:    youtube.com/@guardianbyelexa9545 → 4NXKJxAwkF8
 *
 * LINK CARD FALLBACK (MEDIUM confidence, channel not linked from official site):
 *   - phyn-plus:   Phyn primarily uses Vimeo; YouTube @phyn6361 not linked
 *                  from phyn.com. Fallback links to official product page.
 */

export interface DeviceVideo {
  /** If set, embed via lite-youtube-embed. Must be from verified official channel. */
  youtubeId?: string;
  /** Title for the embed / link card */
  videoTitle: string;
  /** Fallback URL if youtubeId is not set */
  fallbackUrl: string;
  /** Display label for fallback link */
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
  learningPeriod: string;
  insurerRecognition: string;
  installType: string;
  faqs: { q: string; a: string }[];
  video: DeviceVideo;
}

export const devices: Record<string, Device> = {
  "moen-flo": {
    slug: "moen-flo",
    name: "Flo by Moen",
    tagline:
      "The insurance default. Fastest to calibrate, most widely recognized.",
    howItWorks:
      "Installs at your main water line. Monitors flow and pressure continuously, runs a daily automated health test, and closes the valve when it detects an anomaly.",
    keyFacts: [
      "MicroLeak detection down to one drop per minute",
      "One-week learning period, the fastest in the category",
      "Most frequently listed device on insurer approved lists",
      "Optional FloProtect plan adds a warranty covering up to $5,000 in water damage",
      "UL-listed, professional install recommended",
    ],
    bestFor:
      "Homeowners who want the broadest carrier acceptance and protection calibrated within days, not a month.",
    officialSite: "https://www.moen.com/flo",
    detectionMethod: "Flow + pressure monitoring",
    learningPeriod: "1 week",
    insurerRecognition: "Broadest acceptance",
    installType: "Inline, main line",
    video: {
      youtubeId: "lLdCoFjWcr0",
      videoTitle: "Never Miss A Drip with the Flo by Moen Smart Water Shutoff",
      fallbackUrl: "https://www.moen.com/flo/how-it-works",
      fallbackLabel: "Watch the official Flo by Moen demo on moen.com",
    },
    faqs: [
      {
        q: "Does Flo by Moen qualify for an insurance discount in Texas?",
        a: "Yes. Flo by Moen is the most frequently listed device on insurer approved lists. When installed and certified by a licensed plumber, it qualifies for the carrier-recognized water damage credit.",
      },
      {
        q: "How long does the Flo by Moen learning period take?",
        a: "Approximately one week. Flo by Moen has the fastest calibration period of any whole-home shutoff device in the category.",
      },
      {
        q: "Does Flo by Moen require a subscription?",
        a: "Core monitoring and shutoff functionality works without a subscription. The optional FloProtect plan adds a warranty covering up to $5,000 in water damage.",
      },
    ],
  },
  "phyn-plus": {
    slug: "phyn-plus",
    name: "Phyn Plus",
    tagline:
      "The accuracy leader. Independently ranked first for leak detection.",
    howItWorks:
      "Installs at your main. Uses pressure wave analysis to read your plumbing 240 times per second, detecting leaks without separate sensors placed around the house.",
    keyFacts: [
      "Ranked first for leak detection accuracy in an independent Utah State University study",
      "Pressure wave analysis, no separate leak sensors required",
      "Real-time water pressure monitoring, useful for older homes on aging city mains",
      "Roughly fifteen insurer partnerships",
      "No ongoing subscription fees required for core function",
      "Thirty-day learning period",
    ],
    bestFor:
      "Older Houston homes, complex plumbing, and owners who want the most sensitive detection available.",
    officialSite: "https://www.phyn.com",
    detectionMethod: "Pressure wave analysis (240x/sec)",
    learningPeriod: "30 days",
    insurerRecognition: "~15 insurer partnerships",
    installType: "Inline, main line",
    video: {
      // MEDIUM confidence: Phyn uses Vimeo on their site, YouTube channel
      // @phyn6361 is not linked from phyn.com. Using fallback link card.
      videoTitle: "The Phyn Plus Smart Water Assistant",
      fallbackUrl: "https://phyn.com/products/phyn-plus-smart-water-assistant-shutoff-v2",
      fallbackLabel: "Watch the official Phyn Plus demo on phyn.com",
    },
    faqs: [
      {
        q: "Does Phyn Plus qualify for an insurance discount in Texas?",
        a: "Yes. Phyn Plus has roughly fifteen insurer partnerships. When installed and certified by a licensed plumber, it qualifies for the carrier-recognized water damage credit.",
      },
      {
        q: "Why does Phyn Plus have a 30-day learning period?",
        a: "Phyn reads your plumbing 240 times per second using pressure wave analysis. The 30-day period lets it build a detailed profile of your home's unique water signature for the most accurate leak detection.",
      },
      {
        q: "Is Phyn Plus good for older homes?",
        a: "Yes. The pressure wave analysis is especially useful in older Houston homes with complex plumbing and aging city mains, where traditional flow-only monitoring may miss slow leaks.",
      },
    ],
  },
  streamlabs: {
    slug: "streamlabs",
    name: "StreamLabs Control",
    tagline:
      "The durability pick. Fewer moving parts, fewer failure points.",
    howItWorks:
      "Installs inline on your main water line. Uses an ultrasonic flow meter with no internal turbine, monitors flow over Wi-Fi, and shuts off on a detected leak.",
    keyFacts: [
      "Ultrasonic flow meter with no internal turbine, fewer moving parts",
      "Inline install on the main line",
      "Competitively priced against Phyn and Flo",
      "Carrier recognized, though listed by fewer insurers than Moen or Phyn",
    ],
    bestFor:
      "Homeowners who prioritize mechanical simplicity and long-term reliability.",
    officialSite: "https://www.streamlabswater.com",
    detectionMethod: "Ultrasonic flow meter",
    learningPeriod: "Varies",
    insurerRecognition: "Recognized, narrower list",
    installType: "Inline, main line",
    video: {
      youtubeId: "IOsW1SvFp2g",
      videoTitle: "How The StreamLabs Water Control Works",
      fallbackUrl: "https://streamlabswater.com/pages/how-it-works-1",
      fallbackLabel: "Watch the official StreamLabs demo on streamlabswater.com",
    },
    faqs: [
      {
        q: "Does StreamLabs Control qualify for an insurance discount in Texas?",
        a: "Yes. StreamLabs Control is carrier recognized. The discount comes from the certified install and documentation, not the specific brand.",
      },
      {
        q: "What makes StreamLabs different from Moen Flo or Phyn?",
        a: "StreamLabs uses an ultrasonic flow meter with no internal turbine. Fewer moving parts means fewer mechanical failure points over the life of the device.",
      },
    ],
  },
  guardian: {
    slug: "guardian",
    name: "Guardian by Elexa",
    tagline:
      "The retrofit option. No plumbing replacement required.",
    howItWorks:
      "A motorized actuator mounts onto your existing main shutoff valve and physically turns the handle when wireless leak sensors detect water. No cutting into the line.",
    keyFacts: [
      "Mounts on your existing valve, no plumbing replacement",
      "Wireless leak sensors placed at vulnerable points",
      "Ideal for older homes, condos, or where cutting the main is impractical",
      "Battery backup keeps it working during power loss",
    ],
    bestFor:
      "Older homes and situations where replacing or cutting into the main line is not an option.",
    officialSite: "https://getguardian.com",
    detectionMethod: "Wireless leak sensors",
    learningPeriod: "None",
    insurerRecognition: "Recognized",
    installType: "Retrofit, mounts on existing valve",
    video: {
      youtubeId: "4NXKJxAwkF8",
      videoTitle: "Meet Guardian, by Elexa - Prevent Water Damage",
      fallbackUrl: "https://getguardian.com/pages/how-it-works",
      fallbackLabel: "Watch the official Guardian demo on getguardian.com",
    },
    faqs: [
      {
        q: "Does Guardian work if I cannot cut into my main water line?",
        a: "Yes. Guardian mounts a motorized actuator onto your existing shutoff valve. No plumbing replacement or cutting into the line is required.",
      },
      {
        q: "Does Guardian by Elexa qualify for an insurance discount in Texas?",
        a: "Yes. Guardian is carrier recognized. When installed and certified by a licensed plumber, it qualifies for the water damage credit.",
      },
      {
        q: "Does Guardian work during a power outage?",
        a: "Yes. Guardian includes battery backup that keeps the valve controller and leak sensors operational during power loss.",
      },
    ],
  },
};

export const deviceSlugs = Object.keys(devices);
export const deviceList = Object.values(devices);
