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
    id: "generac-gb1000",
    name: "Generac GB1000 Portable Power Station",
    slug: "gb1000",
    price: 1049.0,
    priceCents: 104900,
    model: "GB1000",
    sku: "AE-GB1000-001",
    stripeEnabled: false,
    description:
      "The Generac GB1000 is a 1086Wh LiFePO4 portable power station built for real backup. It delivers 1200W continuous (2400W surge) of clean AC power — enough to run a refrigerator, CPAP, Wi-Fi router, and phone chargers simultaneously. Charge from AC wall, solar (up to 400W MPPT input), or car. Pair with one or two Admiral 200W panels for off-grid solar recharging. LiFePO4 chemistry means 2,500+ cycles of reliable, safe performance.",
    shortDescription:
      "1086Wh LiFePO4 power station — 1200W AC output, 400W solar input (MPPT), 2500+ cycle battery life.",
    features: [
      "1086Wh LiFePO4 battery (2,500+ cycle life)",
      "1200W continuous / 2400W surge AC output (pure sine wave)",
      "400W max solar input with MPPT charge controller",
      "USB-C PD 65W output for laptops",
      "6 total output ports: 2× AC, 2× USB-A, 1× USB-C, 1× 12V car port",
      "Charges 0–80% in ~1 hour via AC wall (1000W input)",
      "Compatible with Admiral 200W and most MC4 solar panels",
      "Built-in LED light with SOS mode",
      "UL 2743 certified",
    ],
    specs: {
      Model: "GB1000",
      Battery: "1086Wh, LiFePO4 (Lithium Iron Phosphate)",
      "Battery Life": "2,500+ cycles to 80% capacity",
      "AC Output": "1200W continuous / 2400W surge (pure sine wave, 120V 60Hz)",
      "USB-C Output": "PD 65W max",
      "USB-A Output": "18W QC 3.0 (×2)",
      "12V Car Port": "12V / 10A",
      "Solar Input": "11–50V, 400W max (MPPT)",
      "AC Input": "1000W max (0–80% in ~1 hr)",
      Dimensions: '13.1 × 10.8 × 9.4" (332 × 274 × 239 mm)',
      Weight: "~31.1 lbs (14.1 kg)",
      "Operating Temp": "32–113°F (0–45°C)",
      Certification: "UL 2743, FCC",
      Warranty: "2-year limited warranty",
    },
    images: ["/images/products/gb1000.svg"],
    category: "Portable Power",
    inStock: true,
    badge: "Generac",
  },
  {
    id: "admiral-200w-solar-panel",
    name: "Admiral 200W Foldable Solar Panel",
    slug: "200w-solar-panel",
    price: 349.0,
    priceCents: 34900,
    model: "AE-200W",
    sku: "AE-200W-001",
    stripeEnabled: false,
    description:
      "The Admiral 200W Foldable Solar Panel is built to pair with the Generac GB1000 and other portable power stations. ETFE-coated monocrystalline cells deliver up to 200W in direct sun — enough to meaningfully recharge a 1kWh station in 5–6 hours. Includes MC4 connectors and an XT90→MC4 adapter for direct GB1000 compatibility. Run two in parallel (400W) for maximum charge speed. Foldable, kickstand-equipped, and IP65 rated for outdoor use.",
    shortDescription:
      "200W ETFE foldable solar panel — MC4 connectors, GB1000 compatible, IP65 weather-resistant.",
    features: [
      "200W monocrystalline ETFE-coated solar cells",
      "MC4 output connectors (standard)",
      "Includes XT90→MC4 adapter for Generac GB1000/GB2000",
      "IP65 water-resistant rating",
      "Integrated adjustable kickstand",
      "Foldable design for easy transport and storage",
      "23%+ cell efficiency",
      "Pair two in parallel for 400W input to GB1000",
    ],
    specs: {
      Model: "AE-200W",
      "Max Power": "200W",
      "Cell Type": "Monocrystalline (ETFE coating)",
      Efficiency: "23%+",
      "Open Circuit Voltage (Voc)": "24.8V",
      "Max Power Voltage (Vmp)": "20.5V",
      "Max Power Current (Imp)": "9.76A",
      "Short Circuit Current (Isc)": "10.4A",
      Connector: "MC4 (XT90→MC4 adapter included)",
      "Water Resistance": "IP65",
      "Folded Size": '24.4 × 21.3 × 1.4"',
      "Unfolded Size": '24.4 × 87.0 × 0.8"',
      Weight: "~15.4 lbs (7.0 kg)",
      Warranty: "1-year limited warranty",
    },
    images: ["/images/products/200w-solar-panel.svg"],
    category: "Solar Panels",
    inStock: true,
    badge: "New",
  },
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
