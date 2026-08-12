import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow EcoFlow and placeholder images
    remotePatterns: [
      { protocol: "https", hostname: "www.ecoflow.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shop/hs-43-solar-power-bank",
        destination: "/shop/sidekick",
        permanent: true,
      },
      {
        source: "/shop/solar-power-bank",
        destination: "/shop/sidekick",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
