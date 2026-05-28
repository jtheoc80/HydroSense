/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "hydrosensehouston.com" }],
          destination: "/service-area/houston",
        },
        {
          source: "/:path*",
          has: [{ type: "host", value: "www.hydrosensehouston.com" }],
          destination: "/service-area/houston",
        },
      ],
    };
  },
};

export default nextConfig;
