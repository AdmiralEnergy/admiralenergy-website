import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/home-resilience`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/portable-power`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/partners/ecoflow/delta-pro-ultra`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/policies/shipping`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/returns`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/warranty`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/terms`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/policies/affiliate-disclosure`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: now,
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
