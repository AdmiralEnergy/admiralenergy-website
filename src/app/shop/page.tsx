import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { ArrowRight, Battery, ShoppingBag, Sun, CheckCircle, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Portable Power | Generac GB1000 & Solar Panels",
  description:
    "Shop the Generac GB1000 portable power station, Admiral 200W foldable solar panels, and emergency kits. Portable backup power for NC homeowners.",
};

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-admiral-navy to-[#0a2540] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-3">
            Shop Portable Power
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Backup Power You Can Own Today
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Generac power stations, foldable solar panels, and emergency kits — curated for NC homeowners. Every product we sell, we&apos;d put in our own home.
          </p>
        </div>
      </section>

      {/* Products Grid (Above the Fold) */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image */}
                <div className="bg-gray-50 h-52 flex items-center justify-center relative">
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
                          className="bg-admiral-gold text-admiral-navy px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-1"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education: Portable Power is the Fastest Way to Start */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Sun className="w-10 h-10 text-admiral-gold mb-4" />
              <h2 className="text-3xl font-bold text-admiral-navy mb-4">
                Portable Power Is the Fastest Way to Start
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Portable power stations + foldable solar panels = renewable backup without permitting, contractors, or utility interconnection. It&apos;s the fastest way for anyone to benefit from solar energy.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "No permits or electrician needed",
                  "Works for outages, hurricanes, camping, and WFH continuity",
                  "Solar recharging means indefinite power with sun",
                  "Start here — upgrade to whole-home later if needed",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8">
              <Zap className="w-8 h-8 text-admiral-navy mb-3" />
              <h3 className="text-xl font-semibold text-admiral-navy mb-3">
                Need Multi-Day Whole-Home Backup?
              </h3>
              <p className="text-gray-600 mb-4">
                If you need backup that powers your entire home for days — not just essentials — a Generac home standby generator is the right move. We provide install quotes for the Charlotte / Kings Mountain area.
              </p>
              <Link
                href="/contact"
                className="bg-admiral-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors inline-flex items-center gap-2"
              >
                Get a Generac Install Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate note */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600">
              Some product links may earn a small commission at no extra cost
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
