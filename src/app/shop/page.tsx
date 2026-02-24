import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { ArrowRight, Battery, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Portable Backup Power",
  description:
    "Solar power banks, portable stations, and emergency kits for North Carolina homeowners. Own your backup power today.",
};

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-admiral-navy to-[#0a2540] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Portable Backup Power
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Curated resilience products for NC homeowners. Every product we sell,
            we&apos;d put in our own home.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image placeholder */}
                <div className="bg-gray-50 h-48 flex items-center justify-center relative">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      className="object-contain p-4"
                    />
                  ) : (
                    <Battery className="w-16 h-16 text-admiral-navy/20" />
                  )}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-admiral-gold text-admiral-navy text-xs font-bold px-2 py-1 rounded">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-semibold text-admiral-navy mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-admiral-navy">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      {product.stripeEnabled ? (
                        <Link
                          href={`/shop/${product.slug}`}
                          className="bg-admiral-gold text-admiral-navy px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                        </Link>
                      ) : (
                        <Link
                          href={`/shop/${product.slug}`}
                          className="text-sm text-admiral-navy font-medium hover:text-admiral-gold transition-colors inline-flex items-center gap-1"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Affiliate note */}
          <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600">
              Looking for whole-home backup? We also review and recommend
              professional-grade systems like the{" "}
              <Link
                href="/partners/ecoflow/delta-pro-ultra"
                className="text-admiral-navy font-semibold underline hover:no-underline"
              >
                EcoFlow DELTA Pro Ultra
              </Link>
              . Some product links may earn a small commission at no extra cost
              to you.{" "}
              <Link
                href="/policies/affiliate-disclosure"
                className="text-admiral-navy underline"
              >
                Learn more
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
