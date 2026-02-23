import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/portable-power`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/home-resilience`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/case-studies`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/partners/ecoflow/delta-pro-ultra`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/policies/shipping`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/returns`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/warranty`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/terms`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/affiliate-disclosure`, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
