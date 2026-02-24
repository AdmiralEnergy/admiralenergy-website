"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-[70vh] bg-admiral-navy text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-4">
          Admiral Energy
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto mb-10">
          We hit a snag while loading this page. Please try again or head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-admiral-navy transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
