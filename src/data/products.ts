export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceCents: number;
  description: string;
  shortDescription: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  category: string;
  inStock: boolean;
  badge?: string;
  model?: string;
  sku?: string;
  stripeEnabled?: boolean;
}

export const sidekickProduct: Product = {
  id: "hs-43-solar-power-bank",
  name: "SideKick PowerBank",
  slug: "sidekick",
  price: 69.99,
  priceCents: 6999,
  model: "HS-43",
  sku: "AE-HS43-001",
  stripeEnabled: true,
  description:
    "A rechargeable portable power bank selected and supported by Admiral Energy, with built-in charging cables, USB outputs, an integrated flashlight, and supplemental solar and hand-crank charging for emergencies.",
  shortDescription:
    "Portable backup power with built-in cables, emergency lighting, and backup solar and hand-crank charging.",
  features: [
    "Built-in USB-C, Micro-USB, and Lightning charging cables",
    "USB-A and USB-C charging connections",
    "Integrated dual-LED flashlight with emergency lighting modes",
    "Small integrated solar panel for supplemental charging",
    "Hand crank for last-resort emergency charging",
    "Built-in compass and bubble level",
    "Portable, rugged form designed for phones and small USB-powered electronics",
  ],
  specs: {
    Model: "HS-43",
    "Primary recharge method": "Wired USB charging",
    "Backup recharge methods": "Integrated solar panel and hand crank",
    "Built-in connections": "USB-C, Micro-USB, and Lightning cables",
    Outputs: "USB-A and USB-C connections",
    Lighting: "Dual-LED flashlight with emergency lighting modes",
    "Convenience tools": "Compass and bubble level",
    "Designed for": "Phones and compatible small USB-powered electronics",
    Warranty: "1-year limited warranty",
  },
  images: [
    "/images/sidekick/hero-real-20260812.webp",
    "/images/sidekick/front-real-20260812.webp",
    "/images/sidekick/solar-real-20260812.webp",
    "/images/sidekick/cables-real-20260812.webp",
    "/images/sidekick/flashlight-real-20260812.webp",
    "/images/sidekick/crank-real-20260812.webp",
  ],
  category: "Portable Power",
  inStock: true,
  badge: "Admiral Energy Pick",
};

// The direct storefront intentionally contains one product.
export const products: Product[] = [sidekickProduct];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
