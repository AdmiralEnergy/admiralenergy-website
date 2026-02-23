export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  /** Price in cents for Stripe */
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
  /** If true, this product has a working Stripe checkout */
  stripeEnabled?: boolean;
}

export const products: Product[] = [
  {
    id: "hs-43-solar-power-bank",
    name: "Multifunctional Solar Power Bank",
    slug: "hs-43-solar-power-bank",
    price: 59.99,
    priceCents: 5999,
    model: "HS-43",
    sku: "AE-HS43-001",
    stripeEnabled: true,
    description:
      "Keep your phone, flashlight, and essential comms alive during outages. The HS-43 packs 40,000 mAh of portable power into a rugged, pocket-friendly frame with 3-way charging: wall, solar panel, and hand crank. Fast charge support (PD 20W + SCP 22.5W) means your devices are ready when you need them. Built-in cables for iPhone and Android — no hunting for cords in the dark.",
    shortDescription:
      "40,000 mAh rugged solar power bank with hand crank, built-in cables, and emergency flashlight.",
    features: [
      "40,000 mAh / 148Wh battery capacity",
      "3-way charging: wall, solar panel, hand crank",
      "Fast charge: PD 20W (USB-C) + SCP 22.5W (USB-A)",
      "Built-in cables: USB-C, Micro-USB, and Lightning",
      "Emergency flashlight: 480 lumens, SOS/strobe modes, up to 25 hours",
      "Built-in compass and bubble level",
      "Rugged, outdoor-ready frame",
      "Compact: fits in your hand (173 × 84 × 42 mm)",
    ],
    specs: {
      Model: "HS-43",
      Battery: "40,000 mAh, 3.7V, 148Wh",
      "USB-A Output (Red)": "SCP 22.5W max",
      "USB-C Output": "PD 20W max",
      "Built-in USB-C Cable": "PD 20W max",
      "USB-C Input": "PD 18W max",
      "USB-A Input Cable": "QC 18W max",
      Flashlight: "2 LEDs, 4W total, ~480 lumens, SOS/strobe",
      "Flashlight Runtime": "Up to 25 hours",
      Dimensions: "173.2 × 84 × 42.2 mm",
      Weight: "~580 g (1.28 lbs)",
      "Operating Temp": "0–40°C (32–104°F)",
      "Built-ins": "Compass, bubble level, USB-C/Micro-USB/Lightning cables",
      Warranty: "1-year limited warranty",
    },
    images: ["/images/products/solar-power-bank.svg"],
    category: "Portable Power",
    inStock: true,
    badge: "Flagship",
  },
  {
    id: "solar-panel-100w",
    name: "100W Portable Solar Panel",
    slug: "100w-solar-panel",
    price: 199.99,
    priceCents: 19999,
    description:
      "Pair with any Admiral power bank or portable station. This foldable 100W solar panel converts sunlight to charging power — perfect for extended outages, camping, or off-grid weekends. ETFE-coated for durability and weather resistance.",
    shortDescription: "Foldable 100W solar panel for charging power stations and power banks.",
    features: [
      "100W monocrystalline solar cells",
      "ETFE coating for durability",
      "Foldable and portable design",
      "Integrated kickstand",
      "Compatible with most power stations",
      "IP65 water-resistant",
    ],
    specs: {
      "Max Power": "100W",
      "Cell Type": "Monocrystalline",
      Efficiency: "23%",
      "Open Circuit Voltage": "21.6V",
      Weight: "9 lbs (4.1 kg)",
      "Folded Size": '20.5 × 14.2 × 1.0"',
      Connector: "Anderson + MC4 adapters included",
      Warranty: "1-year limited warranty",
    },
    images: ["/images/products/100w-solar-panel.svg"],
    category: "Solar Panels",
    inStock: true,
  },
  {
    id: "emergency-kit-001",
    name: "Storm Ready Emergency Kit",
    slug: "storm-ready-kit",
    price: 79.99,
    priceCents: 7999,
    description:
      "Essential emergency preparedness kit for NC homeowners. Includes a hand-crank/solar radio, LED flashlight, first-aid basics, emergency blankets, and a waterproof document bag. Designed around the specific risks North Carolina faces — hurricanes, ice storms, and summer thunderstorms.",
    shortDescription: "Essential emergency kit for NC storm preparedness.",
    features: [
      "Hand-crank + solar emergency radio (NOAA)",
      "LED flashlight (1000 lumens)",
      "Emergency blankets (2x)",
      "Basic first-aid kit",
      "Waterproof document bag",
      "Emergency whistle",
      "Compact carry bag",
    ],
    specs: {
      Contents: "7 essential items",
      "Radio Power": "Hand-crank + Solar + USB",
      "Radio Bands": "AM/FM/NOAA Weather",
      "Bag Size": '14 × 10 × 6"',
      Weight: "4.5 lbs",
      Warranty: "1-year limited warranty",
    },
    images: ["/images/products/storm-ready-kit.svg"],
    category: "Emergency Kits",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
