import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { products } from "@/data/products";

const BASE = "https://admiralenergy.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${BASE}/`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/shop`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/portable-power`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/home-resilience`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/case-studies`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/partners/ecoflow/delta-pro-ultra`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/policies/shipping`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/policies/returns`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/policies/warranty`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/policies/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/policies/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/policies/affiliate-disclosure`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const productPages = products.map((p) => ({
    url: `${BASE}/shop/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
