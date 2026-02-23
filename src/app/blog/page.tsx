import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides on portable power, solar energy, home resilience, and storm preparedness for NC homeowners.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-10 h-10 text-admiral-gold mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Energy Intelligence</h1>
          <p className="text-gray-300 text-lg">
            Practical guides, honest takes, and real information — no fluff,
            no sales pitches, just what NC homeowners actually need to know.
          </p>
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
