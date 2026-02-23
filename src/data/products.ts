export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  shortDescription: string;
  features: string[];
  specs: Record<string, string>;
  images: string[];
  category: string;
  inStock: boolean;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "solar-power-bank-001",
    name: "Admiral Solar Power Bank",
    slug: "solar-power-bank",
    price: 149.99,
    description:
      "Your first line of defense against power outages. The Admiral Solar Power Bank packs serious portable power into a rugged, solar-rechargeable unit. Keep phones charged, run a Wi-Fi router, power a CPAP machine, or light your home when the grid goes down. Charges from any wall outlet or the included solar panel connection. Built for North Carolina storm season.",
    shortDescription:
      "Portable solar-rechargeable power bank for outage preparedness. USB + AC outputs.",
    features: [
      "High-capacity lithium battery (500Wh)",
      "Pure sine wave AC outlet (300W continuous)",
      "Multiple USB-A and USB-C ports",
      "Solar panel input (100W max)",
      "Wall outlet charging (full in ~5 hours)",
      "LED emergency light built-in",
      "Lightweight and portable (12 lbs)",
      "LCD display showing charge level and output",
      "Pass-through charging (use while charging)",
      "Short-circuit and overload protection",
    ],
    specs: {
      Capacity: "500Wh (48,000mAh)",
      "AC Output": "300W continuous / 600W peak",
      "USB-C": "100W PD (x1)",
      "USB-A": "18W QC 3.0 (x2)",
      "Solar Input": "Up to 100W (MPPT)",
      "Wall Charge Time": "~5 hours",
      Weight: "12 lbs (5.4 kg)",
      Dimensions: '11.3 × 7.6 × 7.5"',
      "Battery Type": "LiFePO4 (3,000+ cycles)",
      Warranty: "2-year limited warranty",
    },
    images: [],
    category: "Portable Power",
    inStock: true,
    badge: "Flagship",
  },
  {
    id: "solar-panel-100w",
    name: "100W Portable Solar Panel",
    slug: "100w-solar-panel",
    price: 199.99,
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
    images: [],
    category: "Solar Panels",
    inStock: true,
  },
  {
    id: "emergency-kit-001",
    name: "Storm Ready Emergency Kit",
    slug: "storm-ready-kit",
    price: 79.99,
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
    images: [],
    category: "Emergency Kits",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
