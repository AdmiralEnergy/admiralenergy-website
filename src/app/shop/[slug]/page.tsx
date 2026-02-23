import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProductBySlug } from "@/data/products";
import { ShoppingCart, ArrowLeft, CheckCircle, Battery, Truck, RotateCcw, Shield } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      {/* JSON-LD: Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Admiral Energy" },
            },
          }),
        }}
      />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="text-admiral-navy hover:text-admiral-gold transition-colors inline-flex items-center gap-1 mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-gray-400">
                <Battery className="w-32 h-32 mx-auto mb-4 text-admiral-navy/20" />
                <p className="text-sm">Product image coming soon</p>
              </div>
            </div>

            {/* Details */}
            <div>
              {product.badge && (
                <span className="bg-admiral-gold text-admiral-navy text-xs font-bold px-2 py-1 rounded mb-3 inline-block">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-admiral-navy mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>

              {/* Add to cart */}
              <button
                className="snipcart-add-item bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center mb-6"
                data-item-id={product.id}
                data-item-name={product.name}
                data-item-price={product.price}
                data-item-url={`/shop/${product.slug}`}
                data-item-description={product.shortDescription}
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>

              {/* Shipping / Returns / Warranty badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto text-admiral-navy mb-1" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto text-admiral-navy mb-1" />
                  <p className="text-xs text-gray-600">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto text-admiral-navy mb-1" />
                  <p className="text-xs text-gray-600">{product.specs.Warranty || "Warranty"}</p>
                </div>
              </div>

              {/* Features */}
              <h2 className="text-xl font-semibold text-admiral-navy mb-4">Features</h2>
              <ul className="space-y-2 mb-8">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Specs */}
              <h2 className="text-xl font-semibold text-admiral-navy mb-4">Specifications</h2>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                {Object.entries(product.specs).map(([key, val], i) => (
                  <div
                    key={key}
                    className={`flex justify-between px-4 py-3 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
