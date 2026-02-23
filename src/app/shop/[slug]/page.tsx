import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { products, getProductBySlug } from "@/data/products";
import { ArrowLeft, CheckCircle, Battery, Truck, RotateCcw, Shield, Eye } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import BuyNowButton from "@/components/BuyNowButton";

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
  const canonicalUrl = `${SITE_URL}/shop/${product.slug}`;
  return {
    title: product.model ? `${product.name} (${product.model})` : product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.model ? `${product.name} (${product.model})` : product.name,
      description: product.shortDescription,
      type: "website",
      url: canonicalUrl,
      images: product.images[0]
        ? [{ url: `${SITE_URL}${product.images[0]}`, width: 800, height: 800, alt: product.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.model ? `${product.name} (${product.model})` : product.name,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const canonicalProductUrl = `${SITE_URL}/shop/${product.slug}`;

  // Rich JSON-LD Product schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: canonicalProductUrl,
    image: product.images[0] ? `${SITE_URL}${product.images[0]}` : undefined,
    brand: {
      "@type": "Brand",
      name: "Admiral Energy",
    },
    ...(product.model && { model: product.model }),
    ...(product.sku && { sku: product.sku }),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Admiral Energy" },
      url: canonicalProductUrl,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "QuantitativeValue",
            minValue: 5,
            maxValue: 10,
          },
        },
      },
    },
  };

  return (
    <>
      {/* JSON-LD: Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
            <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Battery className="w-32 h-32 mx-auto mb-4 text-admiral-navy/20" />
                  <p className="text-sm">Product image coming soon</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.badge && (
                <span className="bg-admiral-gold text-admiral-navy text-xs font-bold px-2 py-1 rounded mb-3 inline-block">
                  {product.badge}
                </span>
              )}
              {product.model && (
                <p className="text-sm text-gray-500 mb-1">Model: {product.model}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-admiral-navy mb-6">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>

              {/* Buy Now (Stripe) or View Only */}
              {product.stripeEnabled ? (
                <div className="mb-6">
                  <BuyNowButton
                    productId={product.id}
                    productName={product.name}
                    price={product.price}
                    inStock={product.inStock}
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <Link
                    href="/contact"
                    className="bg-admiral-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy-light transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Eye className="w-5 h-5" /> Contact for Availability
                  </Link>
                  <p className="text-xs text-gray-500 mt-2">
                    Online checkout coming soon for this product.
                  </p>
                </div>
              )}

              {/* Shipping / Returns / Warranty badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Link href="/policies/shipping" className="text-center group">
                  <Truck className="w-6 h-6 mx-auto text-admiral-navy mb-1 group-hover:text-admiral-gold transition-colors" />
                  <p className="text-xs text-gray-600 group-hover:text-admiral-gold transition-colors">Free Shipping</p>
                </Link>
                <Link href="/policies/returns" className="text-center group">
                  <RotateCcw className="w-6 h-6 mx-auto text-admiral-navy mb-1 group-hover:text-admiral-gold transition-colors" />
                  <p className="text-xs text-gray-600 group-hover:text-admiral-gold transition-colors">30-Day Returns</p>
                </Link>
                <Link href="/policies/warranty" className="text-center group">
                  <Shield className="w-6 h-6 mx-auto text-admiral-navy mb-1 group-hover:text-admiral-gold transition-colors" />
                  <p className="text-xs text-gray-600 group-hover:text-admiral-gold transition-colors">{product.specs.Warranty || "Warranty"}</p>
                </Link>
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
