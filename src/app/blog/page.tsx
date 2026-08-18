import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Emergency Power & Home Resilience Guides",
  description: "Practical guides to emergency phone charging, solar power banks, outage preparation, battery backup, and home standby power.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Emergency Power & Home Resilience Guides",
    description: "Honest, practical guidance for portable charging, outage preparation, and whole-home backup.",
    url: `${SITE_URL}/blog`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Admiral Energy guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emergency Power & Home Resilience Guides",
    description: "Practical answers about emergency charging, outages, and home backup power.",
    images: ["/og.png"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-10 h-10 text-admiral-gold mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Emergency Power & Home Resilience Guides</h1>
          <p className="text-gray-300 text-lg mb-6">
            Practical answers about keeping a phone charged, preparing for an outage,
            and deciding when whole-home backup makes sense.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Emergency Charging", "Solar Power Banks", "Outage Prep", "Whole-Home Backup"].map((cat) => (
              <span key={cat} className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">
              Blog posts coming soon. Check back!
            </p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                    <span className="bg-admiral-navy/10 text-admiral-navy px-2 py-0.5 rounded text-xs font-semibold">
                      {post.category}
                    </span>
                    <span className="text-gray-400">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-admiral-navy mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-admiral-gold transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-admiral-gold hover:text-admiral-navy font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
