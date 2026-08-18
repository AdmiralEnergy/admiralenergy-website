import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ArrowLeft, Clock, User } from "lucide-react";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* JSON-LD: BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${SITE_URL}/blog/${post.slug}#article`,
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@id": `${SITE_URL}/#organization`,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />

      <article className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-admiral-navy hover:text-admiral-gold transition-colors inline-flex items-center gap-1 mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <header className="mb-10">
            <span className="bg-admiral-navy/10 text-admiral-navy px-2 py-0.5 rounded text-xs font-semibold">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-admiral-navy mt-3 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {post.author}
              </span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.readingTime}
              </span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} />
          </div>

          <footer className="mt-12 pt-8 border-t">
            <p className="text-gray-500 text-sm mb-4">
              Have questions about this topic?
            </p>
            <Link
              href={post.ctaHref}
              className="bg-admiral-gold text-admiral-navy px-6 py-2 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-block"
            >
              {post.ctaLabel}
            </Link>
          </footer>
        </div>
      </article>
    </>
  );
}
