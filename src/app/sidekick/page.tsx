import type { Metadata } from "next";
import SidekickProductExperience from "@/components/SidekickProductExperience";
import { sidekickProduct } from "@/data/products";
import { SITE_URL } from "@/lib/site";

const canonicalUrl = `${SITE_URL}/sidekick`;
const socialImage = `${SITE_URL}/images/sidekick/og-sidekick-real-20260812.webp`;

export const metadata: Metadata = {
  title: { absolute: "SideKick PowerBank | Portable Emergency Phone Charger | Admiral Energy" },
  description: "SideKick is the $69.99 portable power bank you keep close: built-in charging cables, USB-C support, flashlight, supplemental solar, emergency hand crank, compass, and bubble level.",
  keywords: ["portable power bank", "emergency power bank", "power bank with built-in cables", "emergency phone charger", "power bank with flashlight", "travel power bank"],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: "SideKick PowerBank | The Power Bank You Actually Keep With You",
    description: "Everyday portable backup power with built-in cables, lighting, and honest emergency recharge options. $69.99 from Admiral Energy.",
    url: canonicalUrl,
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "SideKick PowerBank by Admiral Energy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SideKick PowerBank | Everyday Portable Backup",
    description: "Built-in cables, lighting, USB charging, and backup solar and hand-crank options. $69.99.",
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
    seller: { "@type": "Organization", name: "Admiral Energy LLC" },
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
