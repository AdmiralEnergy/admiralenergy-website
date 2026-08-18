import type { Metadata } from "next";
import SidekickProductExperience from "@/components/SidekickProductExperience";
import { sidekickProduct } from "@/data/products";
import { SITE_URL } from "@/lib/site";

const canonicalUrl = `${SITE_URL}/sidekick`;
const socialImage = `${SITE_URL}/images/sidekick/og-sidekick-real-20260812.webp`;

export const metadata: Metadata = {
  title: { absolute: "SideKick Solar Power Bank & Emergency Charger | Admiral Energy" },
  description: "SideKick is a portable emergency power bank with built-in charging cables, a flashlight, supplemental solar charging, and a hand crank for last-resort power.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "SideKick Solar Power Bank & Emergency Charger",
    description: "Portable phone backup with built-in cables, a flashlight, supplemental solar charging, and a last-resort hand crank. $69.99 from Admiral Energy.",
    url: canonicalUrl,
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "SideKick PowerBank by Admiral Energy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SideKick Solar Power Bank & Emergency Charger",
    description: "Built-in cables, a flashlight, wired USB charging, and honest backup solar and hand-crank options. $69.99.",
    images: [socialImage],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${canonicalUrl}#product`,
  name: sidekickProduct.name,
  description: sidekickProduct.description,
  image: sidekickProduct.images.map((image) => `${SITE_URL}${image}`),
  brand: { "@type": "Brand", name: "SideKick" },
  model: sidekickProduct.model,
  sku: sidekickProduct.sku,
  url: canonicalUrl,
  mainEntityOfPage: canonicalUrl,
  offers: {
    "@type": "Offer",
    "@id": `${canonicalUrl}#offer`,
    url: canonicalUrl,
    priceCurrency: "USD",
    price: sidekickProduct.price.toFixed(2),
    availability: sidekickProduct.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 7, unitCode: "DAY" },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "US",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
    },
  },
};

export default function SidekickPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SidekickProductExperience product={sidekickProduct} />
    </>
  );
}
