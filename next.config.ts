import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow EcoFlow and placeholder images
    remotePatterns: [
      { protocol: "https", hostname: "www.ecoflow.com" },
    ],
  },
};

export default nextConfig;
