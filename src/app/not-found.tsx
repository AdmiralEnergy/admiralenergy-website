import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-gradient-to-br from-admiral-navy to-[#0a2540] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-4">
          Admiral Energy
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Page not found
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-10">
          We couldn&apos;t locate that page. Head back to safer waters or browse the shop.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-admiral-navy transition-colors"
          >
            Visit the Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
