import type { Product } from "@/data/products";

export interface SidekickMediaItem {
  src: string;
  alt: string;
  label: string;
  caption: string;
}
export interface SidekickSpecGroup {
  title: string;
  items: Array<[label: string, value: string]>;
}

export const sidekickGallery: SidekickMediaItem[] = [
  {
    src: "/images/sidekick/hero-real-20260812.webp",
    alt: "SideKick PowerBank standing beside its retail box",
    label: "SideKick",
    caption: "SideKick shown with its retail packaging.",
  },
  {
    src: "/images/sidekick/in-hand-real-20260812.webp",
    alt: "SideKick PowerBank beside its product box for size context",
    label: "Scale",
    caption: "Product and package together for useful size context.",
  },
  {
    src: "/images/sidekick/back-real-20260812.webp",
    alt: "Rear of the SideKick PowerBank with four integrated cables stored in place",
    label: "Cables",
    caption: "Four integrated cables store against the back of the unit.",
  },
  {
    src: "/images/sidekick/truck-real-20260812.webp",
    alt: "SideKick PowerBank connection ports and charge indicator lights",
    label: "Ports",
    caption: "USB connection ports and charge indicator lights.",
  },
  {
    src: "/images/sidekick/flashlight-real-20260812.webp",
    alt: "SideKick PowerBank dual LED flashlight turned on",
    label: "Light",
    caption: "The integrated dual LED flashlight powered on.",
  },
  {
    src: "/images/sidekick/solar-real-20260812.webp",
    alt: "Angled view of the SideKick PowerBank solar panel",
    label: "Solar",
    caption: "Integrated solar panel for supplemental input.",
  },
  {
    src: "/images/sidekick/crank-real-20260812.webp",
    alt: "Side profile of the SideKick PowerBank with compass and hand-crank area",
    label: "Crank",
    caption: "Side profile with compass and emergency hand-crank area.",
  },
  {
    src: "/images/sidekick/front-real-20260812.webp",
    alt: "Front view of the SideKick PowerBank solar-panel face",
    label: "Front",
    caption: "Front solar-panel face and protective body rails.",
  },
  {
    src: "/images/sidekick/field-real-20260812.webp",
    alt: "SideKick PowerBank flashlight lenses and solar-panel surface",
    label: "Detail",
    caption: "Close view of the flashlight lenses and solar surface.",
  },
  {
    src: "/images/sidekick/demo-thumbnail-real-20260812.webp",
    alt: "SideKick PowerBank charging indicator lights illuminated",
    label: "Indicator",
    caption: "Battery indicator lights while the unit is charging.",
  },
];

export const sidekickIncluded = [
  "SideKick PowerBank",
  "Integrated USB-A input, USB-C, Micro-USB, and Lightning cables",
  "Built-in flashlight, solar panel, hand crank, compass, and bubble level",
  "Admiral Energy customer support",
  "1-year limited warranty",
];

const specLayout: Array<{
  title: string;
  rows: Array<[key: string, label: string]>;
}> = [
  {
    title: "Power",
    rows: [["Battery", "Battery"]],
  },
  {
    title: "Inputs",
    rows: [
      ["USB-C Input", "USB-C input"],
      ["USB-A Input Cable", "USB-A input cable"],
      ["Solar Charging", "Solar input"],
      ["Hand-Crank Generation", "Hand-crank generation"],
      ["Charging Time", "Wired charging time"],
      ["Hand-Crank Speed", "Hand-crank speed"],
    ],
  },
  {
    title: "Outputs & Built-In Cables",
    rows: [
      ["USB-A1 Output", "USB-A1 output"],
      ["USB-A2 Output", "USB-A2 output"],
      ["USB-C Output", "USB-C output"],
      ["Built-in USB-C Cable", "Built-in USB-C cable"],
      ["Built-in Lightning Cable", "Built-in Lightning cable"],
      ["Built-in Micro-USB Cable", "Built-in Micro-USB cable"],
    ],
  },
  {
    title: "Lighting & Tools",
    rows: [
      ["Flashlight", "Flashlight"],
      ["Flashlight Runtime", "Flashlight runtime"],
      ["Built-ins", "Other built-ins"],
    ],
  },
  {
    title: "Physical",
    rows: [
      ["Dimensions", "Dimensions"],
      ["Weight", "Weight"],
      ["Operating Temp", "Operating temperature"],
    ],
  },
  {
    title: "Warranty",
    rows: [["Warranty", "Coverage"]],
  },
];

export function getSidekickSpecGroups(specs: Product["specs"]): SidekickSpecGroup[] {
  return specLayout
    .map((group) => ({
      title: group.title,
      items: group.rows
        .filter(([key]) => Boolean(specs[key]))
        .map(([key, label]) => [label, specs[key]] as [string, string]),
    }))
    .filter((group) => group.items.length > 0);
}
