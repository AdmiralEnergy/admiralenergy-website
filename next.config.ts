import type { NextConfig } from "next";

const redirects = [
  ["/shop", "/sidekick"],
  ["/shop/sidekick", "/sidekick"],
  ["/shop/hs-43-solar-power-bank", "/sidekick"],
  ["/shop/solar-power-bank", "/sidekick"],
  ["/shop/gb1000", "/resources"],
  ["/shop/200w-solar-panel", "/resources"],
  ["/shop/100w-solar-panel", "/resources"],
  ["/shop/storm-ready-kit", "/resources"],
  ["/portable-power", "/resources"],
  ["/home-resilience", "/resources"],
  ["/partners/ecoflow/delta-pro-ultra", "/home-backup"],
  ["/case-studies", "/about"],
  ["/contact", "/home-backup"],
  ["/policies/affiliate-disclosure", "/policies/terms"],
] as const;

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "www.ecoflow.com" }] },
  async redirects() {
    return redirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
