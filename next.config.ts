import type { NextConfig } from "next";

const redirects = [
  ["/shop", "/sidekick"],
  ["/shop/sidekick", "/sidekick"],
  ["/shop/hs-43-solar-power-bank", "/sidekick"],
  ["/shop/solar-power-bank", "/sidekick"],
  ["/portable-power", "/resources"],
  ["/home-resilience", "/resources"],
  ["/partners/ecoflow/delta-pro-ultra", "/home-backup"],
  ["/case-studies", "/about"],
  ["/contact", "/home-backup"],
  ["/policies/affiliate-disclosure", "/policies/terms"],
] as const;

const commerceAdminSecurityHeaders = [
  { key: "Cache-Control", value: "private, no-store, max-age=0" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
] as const;

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "www.ecoflow.com" }] },
  async headers() {
    return [
      { source: "/admin/commerce/:path*", headers: [...commerceAdminSecurityHeaders] },
      { source: "/api/admin/commerce/:path*", headers: [...commerceAdminSecurityHeaders] },
    ];
  },
  async redirects() {
    return redirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
