import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    ["", "weekly", 1.0],
    ["/sidekick", "weekly", 0.95],
    ["/home-backup", "monthly", 0.9],
    ["/resources", "monthly", 0.8],
    ["/about", "monthly", 0.6],
    ["/blog", "weekly", 0.6],
    ["/policies/shipping", "yearly", 0.3],
    ["/policies/returns", "yearly", 0.3],
    ["/policies/warranty", "yearly", 0.3],
    ["/policies/privacy", "yearly", 0.3],
    ["/policies/terms", "yearly", 0.3],
  ] as const;

  const pages: MetadataRoute.Sitemap = staticPages.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path || "/"}`,
    changeFrequency,
    priority,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
