/** @type {import('next').NextConfig} */
const legacyEditorialAuditPaths = [
  "/insurance/ho-a-vs-ho-b-ho-3",
  "/freeze-damage-texas",
  "/blog/smart-water-shutoff-texas-vacation-rentals",
  "/blog/best-home-investment-texas-tight-budget",
  "/blog/texas-freeze-survival-checklist",
  "/blog/houston-home-insurance-rising-smart-shutoff",
  "/blog/frozen-pipes-while-traveling-winter",
  "/blog/cost-of-burst-pipe-texas",
  "/blog/smart-vs-manual-water-shutoff-freeze",
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hydrosensetx.com" }],
        destination: "https://hydrosensetx.com/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "hydrosensehouston.com" }],
        destination: "https://hydrosensetx.com/service-area/houston",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "hydrosensehouston.com" }],
        destination: "https://hydrosensetx.com/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "host", value: "www.hydrosensehouston.com" }],
        destination: "https://hydrosensetx.com/service-area/houston",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hydrosensehouston.com" }],
        destination: "https://hydrosensetx.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return legacyEditorialAuditPaths.map((source) => ({
      source,
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, follow",
        },
      ],
    }));
  },
};

export default nextConfig;
