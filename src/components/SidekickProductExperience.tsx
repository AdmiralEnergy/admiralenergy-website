"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import {
  Battery,
  BatteryCharging,
  Cable,
  Car,
  CheckCircle,
  ChevronDown,
  Compass,
  Flashlight,
  Hammer,
  Headphones,
  Lightbulb,
  MapPin,
  PackageCheck,
  PlugZap,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sun,
  Tent,
  Truck,
  Usb,
  Watch,
  X,
  Zap,
} from "lucide-react";

interface SidekickProductExperienceProps {
  product: Product;
}

interface MediaItem {
  src: string;
  alt: string;
  label: string;
  caption: string;
}

interface IconItem {
  title: string;
  description?: string;
  icon: typeof Battery;
}

const galleryImages: MediaItem[] = [
  {
    src: "/images/sidekick/hero-real-20260812.webp",
    alt: "Sidekick PowerBank standing beside its retail box",
    label: "Hero",
    caption: "Sidekick PowerBank shown with retail packaging.",
  },
  {
    src: "/images/sidekick/front-real-20260812.webp",
    alt: "Front view of the Sidekick PowerBank solar panel face",
    label: "Front",
    caption: "Solar panel face with rugged edge protection.",
  },
  {
    src: "/images/sidekick/solar-real-20260812.webp",
    alt: "Angled view of the Sidekick PowerBank solar panel",
    label: "Solar",
    caption: "Integrated solar panel for supplemental charging.",
  },
  {
    src: "/images/sidekick/cables-real-20260812.webp",
    alt: "Rear cable side of the Sidekick PowerBank",
    label: "Cables",
    caption: "Integrated output cables stored on the back of the unit.",
  },
  {
    src: "/images/sidekick/flashlight-real-20260812.webp",
    alt: "Sidekick PowerBank flashlight turned on",
    label: "Lights",
    caption: "Dual LED flashlight shown powered on.",
  },
  {
    src: "/images/sidekick/crank-real-20260812.webp",
    alt: "Side profile of the Sidekick PowerBank with compass detail",
    label: "Crank",
    caption: "Side profile with onboard compass and rugged body rails.",
  },
  {
    src: "/images/sidekick/sidekick-field-features.jpg",
    alt: "Sidekick PowerBank showing solar panel, compass, hand crank and emergency flashlight features",
    label: "Tools",
    caption: "Contained feature graphic showing solar, crank, compass, level, cables, and lights.",
  },
  {
    src: "/images/sidekick/in-hand-real-20260812.webp",
    alt: "Sidekick PowerBank shown beside its product box",
    label: "Box",
    caption: "Product and package context from the source photo set.",
  },
  {
    src: "/images/sidekick/field-real-20260812.webp",
    alt: "Sidekick PowerBank front edge with flashlight lenses",
    label: "Field",
    caption: "Front flashlight lenses and solar-panel surface.",
  },
  {
    src: "/images/sidekick/demo-thumbnail-real-20260812.webp",
    alt: "Sidekick PowerBank charging indicator lights",
    label: "Video",
    caption: "Battery indicator lights while the unit is charging.",
  },
];

const heroFeatureList = [
  "40,000mAh portable capacity",
  "USB-C fast charging",
  "Built-in charging cables",
  "Emergency lighting",
  "Solar backup",
  "Hand-crank generation",
  "Compass + bubble level",
  "Free shipping",
];

const identityItems: IconItem[] = [
  { title: "Truck", icon: Truck },
  { title: "Bag", icon: ShoppingBag },
  { title: "Toolbox", icon: Hammer },
  { title: "Emergency Kit", icon: Zap },
];

const featureTiles: IconItem[] = [
  {
    title: "40,000mAh Portable Capacity",
    description: "Backup power within reach when normal charging is not convenient.",
    icon: BatteryCharging,
  },
  {
    title: "Built-In Charging Cables",
    description: "USB-C, Micro-USB, and Lightning connectors stay attached to the unit.",
    icon: Cable,
  },
  {
    title: "Emergency Lighting",
    description: "Integrated dual LEDs help you preserve your phone battery after dark.",
    icon: Flashlight,
  },
  {
    title: "Solar Backup",
    description: "Integrated solar input provides a supplemental option away from conventional power.",
    icon: Sun,
  },
  {
    title: "Hand-Crank Generation",
    description: "Manual generation gives you another emergency option when outlets are unavailable.",
    icon: RotateCcw,
  },
  {
    title: "Compass + Bubble Level",
    description: "Convenient built-in reference tools reinforce Sidekick as field equipment.",
    icon: Compass,
  },
];

const fieldUtilityCards = [
  {
    title: "Compass",
    headline: "Keep a Directional Reference Close.",
    copy:
      "The built-in compass gives you a convenient directional reference when you're traveling, outdoors, or away from familiar surroundings.",
    icon: Compass,
  },
  {
    title: "Bubble Level",
    headline: "A Quick Level Check.",
    copy:
      "The integrated bubble level provides a simple visual reference when positioning equipment, a work surface, camping gear, or other objects where a quick level check is useful.",
    icon: Ruler,
  },
  {
    title: "Emergency Light",
    headline: "Save Your Phone Battery.",
    copy: "Built-in lighting gives you illumination without depending on your phone's flashlight.",
    icon: Flashlight,
  },
  {
    title: "Hand Crank",
    headline: "Another Way Back to Power.",
    copy: "Manual generation provides an additional emergency option when an outlet isn't available.",
    icon: RotateCcw,
  },
];

const rechargeCards = [
  {
    title: "Wired / USB",
    subtitle: "Primary charging method",
    label: "Primary Charging Method",
    copy: "Use wired USB charging as the normal way to recharge Sidekick whenever grid power is available.",
    icon: PlugZap,
  },
  {
    title: "Solar",
    subtitle: "Supplemental charging",
    label: "Supplemental Charging",
    copy:
      "The integrated solar panel gives Sidekick another source of input when conventional power isn't available.",
    icon: Sun,
  },
  {
    title: "Hand Crank",
    subtitle: "Emergency backup",
    label: "Emergency Backup",
    copy: "Manual generation provides an additional last-resort option when other charging methods are unavailable.",
    icon: RotateCcw,
  },
];

const deviceCategories: IconItem[] = [
  {
    title: "Smartphones",
    description: "Compatible phones charged through USB-C, USB-A, or built-in cables.",
    icon: Smartphone,
  },
  {
    title: "Earbuds",
    description: "Small USB rechargeable accessories you keep close.",
    icon: Headphones,
  },
  {
    title: "Smartwatches",
    description: "Wearables and compatible mobile accessories.",
    icon: Watch,
  },
  {
    title: "USB Lighting",
    description: "Small lights and emergency USB gear.",
    icon: Lightbulb,
  },
  {
    title: "USB Electronics",
    description: "Compatible small electronics that match Sidekick output ratings.",
    icon: Usb,
  },
  {
    title: "Mobile Accessories",
    description: "Everyday carry gear that depends on USB power.",
    icon: Battery,
  },
];

const trustItems: IconItem[] = [
  { title: "Free Shipping", description: "Continental U.S. orders ship free.", icon: Truck },
  { title: "30-Day Returns", description: "Return policy available before checkout.", icon: RotateCcw },
  { title: "1-Year Limited Warranty", description: "Admiral Energy warranty support.", icon: ShieldCheck },
  { title: "Real Support", description: "Help from the Admiral Energy team.", icon: MapPin },
];

const includedItems = [
  "Sidekick PowerBank",
  "Integrated USB-C, Micro-USB, and Lightning cables",
  "Built-in compass, bubble level, flashlight, solar panel, and hand crank",
  "User manual",
  "Admiral Energy support",
  "1-year limited warranty",
];

const fieldCards = [
  {
    title: "Jobsite",
    copy: "Portable backup power during long working days.",
    image: "/images/sidekick/toolbox-real-20260812.webp",
    icon: Hammer,
  },
  {
    title: "Vehicle",
    copy: "Keep Sidekick in a truck, car, or work vehicle.",
    image: "/images/sidekick/truck-real-20260812.webp",
    icon: Car,
  },
  {
    title: "Outdoors",
    copy: "Portable charging and lighting away from normal power.",
    image: "/images/sidekick/outdoors-real-20260812.webp",
    icon: Tent,
  },
  {
    title: "Emergency Kit",
    copy: "Backup charging and lighting during outages and unexpected situations.",
    image: "/images/sidekick/field-real-20260812.webp",
    icon: Zap,
  },
];

const comparisonRows = [
  ["Portable battery", "✓", "✓"],
  ["Built-in charging cables", "✓", "Varies"],
  ["USB-C fast charging", "✓", "Varies"],
  ["Integrated emergency lighting", "✓", "Varies"],
  ["Solar backup", "✓", "Usually No"],
  ["Hand-crank generation", "✓", "Usually No"],
  ["Built-in compass", "✓", "Usually No"],
  ["Bubble level", "✓", "Usually No"],
  ["Field / emergency utility", "✓", "Limited"],
  ["Admiral Energy support", "✓", "Depends"],
  ["1-year limited warranty", "✓", "Depends"],
];

const specGroups = [
  {
    title: "Power",
    items: [
      ["Capacity", "40,000 mAh"],
      ["Rated energy", "148Wh"],
      ["Battery type", "Rechargeable lithium polymer battery"],
    ],
  },
  {
    title: "Input / Output",
    items: [
      ["USB-C input", "PD 18W max"],
      ["USB-A input cable", "QC 18W max"],
      ["USB-A1 output", "SCP 22.5W max"],
      ["USB-A2 output", "5V/2.1A"],
      ["USB-C output", "PD 20W max"],
      ["Solar input", "5.5V/300mA supplemental input"],
      ["Hand-crank generation", "5V/400mA emergency input"],
      ["Wired charging time", "Approximately 6 hours with a PD20W charger"],
    ],
  },
  {
    title: "Built-In Cables",
    items: [
      ["USB-C cable", "PD 20W max"],
      ["Lightning cable", "5V/2.4A"],
      ["Micro-USB cable", "5V/2.1A"],
      ["USB-A input cable", "Built-in input cable for recharging the power bank"],
    ],
  },
  {
    title: "Lighting",
    items: [
      ["LED flashlight", "2 LEDs, 4W total"],
      ["Luminous flux", "~480 lumens total"],
      ["Lighting modes", "High, low, SOS, and strobe"],
      ["Lighting runtime", "Up to 25 hours"],
    ],
  },
  {
    title: "Field Utility",
    items: [
      ["Compass", "Built-in convenience directional reference"],
      ["Bubble level", "Built-in convenience leveling reference"],
      ["Hand crank", "Manual emergency generation handle"],
      ["Lanyard hole", "Built-in attachment point"],
    ],
  },
  {
    title: "Physical",
    items: [
      ["Dimensions", "173.2 × 84 × 42.2 mm"],
      ["Weight", "~580 g (1.28 lbs)"],
      ["Operating temperature", "0-40°C (32-104°F)"],
    ],
  },
  {
    title: "Warranty",
    items: [["Coverage", "1-year limited warranty"]],
  },
];

const faqs = [
  {
    question: "What is Sidekick?",
    answer:
      "Sidekick is a portable backup power bank built for compatible USB-powered electronics when work, travel, weather, or outdoor use takes you away from convenient outlets.",
  },
  {
    question: "Who is Sidekick designed for?",
    answer:
      "Sidekick is useful for contractors, technicians, inspectors, field professionals, truck owners, travelers, outdoor users, and emergency-preparedness customers without excluding everyday carry use.",
  },
  {
    question: "What are the compass and bubble level for?",
    answer:
      "They're built-in convenience tools for quick directional and leveling reference while working, traveling, camping, or spending time outdoors. They should not be treated as precision surveying or navigation instruments.",
  },
  {
    question: "How should Sidekick normally be recharged?",
    answer:
      "Wired USB charging is the normal charging method. The manual lists approximately 6 hours to full charge when using a PD20W charger.",
  },
  {
    question: "What is the solar panel for?",
    answer:
      "The solar panel is for supplemental charging when normal power is not available. Solar charging speed depends on sunlight, temperature, positioning, and other conditions.",
  },
  {
    question: "What is the hand crank for?",
    answer:
      "The hand crank is an emergency backup input for situations where an outlet, USB charger, or useful sunlight is unavailable.",
  },
  {
    question: "What types of devices can it charge?",
    answer:
      "Sidekick is designed for compatible USB-powered electronics such as smartphones, earbuds, smartwatches, small USB electronics, USB lighting, and compatible mobile accessories.",
  },
  {
    question: "Is it a replacement for a portable power station?",
    answer:
      "No. Sidekick is personal portable power for USB electronics. It is not intended to power household appliances or replace a larger portable power station, home generator, or whole-home battery.",
  },
  {
    question: "What is the warranty?",
    answer: "Sidekick includes a 1-year limited warranty from Admiral Energy.",
  },
  {
    question: "What is the return policy?",
    answer: "Admiral Energy offers 30-day returns under the published return policy.",
  },
  {
    question: "How quickly does it ship?",
    answer:
      "Admiral Energy's shipping policy lists 1-2 business days for order processing and 5-7 business days for standard shipping.",
  },
];

function pushSidekickEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ event, ...payload });
}

export default function SidekickProductExperience({ product }: SidekickProductExperienceProps) {
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);
  const [showStickyBuy, setShowStickyBuy] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    pushSidekickEvent("sidekick_view", {
      product_id: product.id,
      product_slug: product.slug,
      price: product.price,
    });
  }, [product.id, product.price, product.slug]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBuy(!entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sidekick-reveal]"),
    );

    if (reducedMotion) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.12 },
    );

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const selectGalleryImage = (image: MediaItem) => {
    setActiveImage(image);
    pushSidekickEvent("sidekick_gallery_view", {
      gallery_item: image.label,
    });
  };

  function CheckoutButton({
    location,
    children,
    className,
    showError = true,
  }: {
    location: string;
    children: ReactNode;
    className: string;
    showError?: boolean;
  }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCheckout = async () => {
      pushSidekickEvent("sidekick_buy_click", {
        cta_location: location,
        product_id: product.id,
        price: product.price,
      });

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/.netlify/functions/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });

        const data = (await res.json()) as { url?: string; error?: string };

        if (!res.ok || !data.url) {
          throw new Error(data.error || "Failed to start checkout");
        }

        pushSidekickEvent("sidekick_checkout_start", {
          cta_location: location,
          product_id: product.id,
          price: product.price,
        });

        window.location.href = data.url;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        setLoading(false);
      }
    };

    return (
      <div>
        <button
          type="button"
          onClick={startCheckout}
          disabled={loading || !product.inStock}
          className={className}
        >
          {loading ? "Starting checkout..." : children}
        </button>
        {showError && error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-admiral-white text-gray-900">
      <section
        id="overview"
        ref={heroRef}
        className="bg-admiral-navy text-white"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-4 py-5 sm:px-6 md:gap-10 md:py-12 lg:min-h-[calc(100svh-152px)] lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="min-w-0 order-2 lg:order-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-white sm:bg-[#111820]">
              <button
                type="button"
                onClick={() => setLightboxImage(activeImage)}
                className="group absolute inset-0 z-10"
                aria-label={`Open ${activeImage.label} image`}
              >
                <span className="sr-only">Open product image</span>
              </button>
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02] sm:object-cover"
                priority
              />
            </div>
            <div className="mt-3 flex max-w-full snap-x gap-2 overflow-x-auto pb-2 md:mt-4 md:gap-3">
              {galleryImages.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => selectGalleryImage(image)}
                  className={`relative h-16 w-20 shrink-0 snap-start overflow-hidden rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-admiral-gold sm:h-20 sm:w-24 ${
                    activeImage.src === image.src
                      ? "border-admiral-gold"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  aria-label={`Show ${image.label}`}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-1 text-[0.65rem] font-semibold text-white">
                    {image.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs leading-5 text-white/65 md:mt-2">{activeImage.caption}</p>
          </div>

          <div className="min-w-0 order-1 lg:order-1">
            <p className="mb-2 text-xs font-bold uppercase text-admiral-gold sm:text-sm">
              PORTABLE FIELD POWER
            </p>
            <h1 className="max-w-full text-[2.45rem] font-black leading-[1.02] sm:text-5xl lg:max-w-3xl lg:text-6xl">
              SIDEKICK PowerBank
            </h1>
            <p className="mt-3 max-w-2xl text-2xl font-black leading-tight text-white sm:text-3xl">
              Power When the Job Takes You Beyond the Outlet.
            </p>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-white/60">Today&apos;s Offer</p>
                  <p className="mt-1 text-4xl font-black">${product.price.toFixed(2)}</p>
                </div>
                <p className="pb-1 text-sm font-bold text-admiral-gold">Free Shipping</p>
              </div>
              <CheckoutButton
                location="hero"
                className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-admiral-gold px-5 py-4 text-sm font-black text-admiral-navy transition-colors hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                <ShoppingBag className="h-5 w-5" />
                GET YOUR SIDEKICK — ${product.price.toFixed(2)}
              </CheckoutButton>
              <p className="mt-3 text-center text-xs font-semibold text-white/70">
                30-Day Returns • 1-Year Limited Warranty • Secure Checkout
              </p>
            </div>
            <p className="mt-4 max-w-full text-base leading-7 text-white/82 sm:text-lg sm:leading-8 lg:max-w-2xl">
              40,000mAh of portable backup power with built-in charging cables, emergency lighting,
              solar backup, hand-crank generation, and field-ready convenience tools.
            </p>
            <p className="mt-3 text-base font-bold leading-7 text-admiral-gold sm:text-xl">
              The Only PowerBank You&apos;ll Ever Need.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-white sm:text-sm">
              {heroFeatureList.map((feature) => (
                <span key={feature} className="inline-flex items-start gap-2 rounded-md bg-white/[0.06] px-2.5 py-2 sm:px-3">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-admiral-gold" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071c2c] py-9 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-black uppercase leading-tight sm:text-3xl">
            Your Truck. Your Bag. Your Toolbox. Your Sidekick.
          </h2>
          <p className="mt-3 text-white/70">Sidekick was made for the places outlets aren&apos;t.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {identityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold"
                >
                  <Icon className="h-4 w-4 text-admiral-gold" />
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div className="relative min-h-[260px] overflow-hidden rounded-lg bg-gray-200 sm:min-h-[360px]">
            <Image
              src="/images/sidekick/field-real-20260812.webp"
              alt="Sidekick PowerBank on a tabletop showing the solar face and flashlight edge"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">The Problem</p>
            <h2 className="text-3xl font-black leading-tight text-admiral-navy sm:text-4xl">8% Battery. Three Jobs Left.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Your phone isn&apos;t just your phone when you&apos;re working in the field. It is your GPS,
              camera, communication, schedule, invoices, payments, authentication, hotspot, and
              connection back to the office.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold text-gray-700 sm:grid-cols-4">
              {["GPS", "Camera", "Invoices", "Hotspot", "Payments", "Schedule", "Auth", "Office"].map(
                (item) => (
                  <span key={item} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                    {item}
                  </span>
                ),
              )}
            </div>
            <p className="mt-7 text-2xl font-black text-admiral-navy">
              Losing your battery shouldn&apos;t mean losing your workday.
            </p>
            <a
              href="#features"
              className="mt-6 inline-flex w-fit rounded-lg bg-admiral-navy px-5 py-3 font-bold text-white transition-colors hover:bg-navy-light"
            >
              Meet Sidekick
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">One Device. Multiple Jobs.</p>
            <h2 className="text-4xl font-black text-admiral-navy">
              Why Carry Five Things When One Does the Job?
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureTiles.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() =>
                    pushSidekickEvent("sidekick_feature_engagement", {
                      feature: feature.title,
                    })
                  }
                  className="rounded-lg border border-gray-200 bg-admiral-white p-5 text-left transition hover:border-admiral-gold hover:bg-white"
                >
                  <Icon className="mb-5 h-8 w-8 text-admiral-navy" />
                  <h3 className="text-lg font-black text-admiral-navy">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{feature.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="utility" className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-admiral-white">
              <Image
                src="/images/sidekick/sidekick-field-features.jpg"
                alt="Sidekick PowerBank showing solar panel, compass, hand crank and emergency flashlight features"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Field Utility</p>
            <h2 className="text-4xl font-black text-admiral-navy">Built For More Than Charging.</h2>
            <p className="mt-3 text-2xl font-bold text-gray-700">
              Little tools. Big difference when you&apos;re away from the desk.
            </p>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Sidekick isn&apos;t only there when your phone battery gets low. It also keeps several
              practical tools within reach for work, travel, emergencies, and outdoor use.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {fieldUtilityCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <Icon className="mb-4 h-7 w-7 text-admiral-gold" />
                    <p className="text-xs font-black uppercase text-admiral-gold">{card.title}</p>
                    <h3 className="mt-2 text-xl font-black text-admiral-navy">{card.headline}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{card.copy}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-lg bg-admiral-navy p-5 text-white">
              <p className="text-2xl font-black">Power. Light. Direction. Level.</p>
              <p className="mt-1 text-xl font-black text-admiral-gold">One Sidekick.</p>
              <CheckoutButton
                location="field_utility"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-admiral-gold px-6 py-3 font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                GET YOUR SIDEKICK
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      <section className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="relative min-h-[440px] overflow-hidden rounded-lg bg-[#111820]">
            <Image
              src="/images/sidekick/cables-real-20260812.webp"
              alt="Sidekick PowerBank rear side showing integrated charging cables"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute left-5 top-5 rounded-lg bg-white px-3 py-2 text-xs font-black text-admiral-navy">
              USB-C
            </div>
            <div className="absolute bottom-20 left-10 rounded-lg bg-admiral-gold px-3 py-2 text-xs font-black text-admiral-navy">
              Micro-USB
            </div>
            <div className="absolute bottom-6 right-6 rounded-lg bg-white px-3 py-2 text-xs font-black text-admiral-navy">
              Lightning
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Built-In Cables</p>
            <h2 className="text-4xl font-black text-admiral-navy">Stop Hunting for Cables.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Backup power is less useful when the charging cable you need is somewhere else.
              Sidekick keeps USB-C, Micro-USB, and Lightning connectors built directly into the unit.
            </p>
            <div className="mt-7">
              <CheckoutButton
                location="cables"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-admiral-gold px-6 py-3 font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
              >
                GET SIDEKICK - ${product.price.toFixed(2)}
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      <section className="sidekick-reveal bg-admiral-navy py-16 text-white md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Power Three Ways</p>
          <h2 className="text-4xl font-black">Three Ways Back to Power.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {rechargeCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                  <Icon className="mb-6 h-9 w-9 text-admiral-gold" />
                  <p className="text-xs font-black uppercase text-admiral-gold">{item.label}</p>
                  <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
                  <p className="mt-1 text-white/70">{item.subtitle}</p>
                  <p className="mt-5 leading-7 text-white/75">{item.copy}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-white/70">
            Solar and hand-crank inputs are supplemental and emergency options. Wired USB charging
            remains the normal recharge method for filling the 40,000mAh battery.
          </p>
        </div>
      </section>

      <section id="field" className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Real-World Use Cases</p>
          <h2 className="text-4xl font-black text-admiral-navy">Wherever Work Takes You.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-700">
            Keep Sidekick close for the places and situations where waiting on an outlet slows you down.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {fieldCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="overflow-hidden rounded-lg bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-gray-200">
                    <Image
                      src={card.image}
                      alt={`Sidekick PowerBank product photo for ${card.title.toLowerCase()} use`}
                      fill
                      sizes="(min-width: 768px) 25vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <Icon className="mb-4 h-7 w-7 text-admiral-gold" />
                    <h3 className="text-lg font-black uppercase text-admiral-navy">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{card.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">What Can It Charge?</p>
            <h2 className="text-4xl font-black text-admiral-navy">
              Built For The Devices You Keep Close.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Sidekick is built for compatible USB-powered electronics. Match your device to the
              available USB-A, USB-C, or built-in cable output before depending on it.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deviceCategories.map((device) => {
              const Icon = device.icon;
              return (
                <div key={device.title} className="rounded-lg border border-gray-200 bg-admiral-white p-5">
                  <Icon className="mb-4 h-7 w-7 text-admiral-gold" />
                  <h3 className="text-lg font-black text-admiral-navy">{device.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{device.description}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-gray-500">
            Actual runtime and charging performance depend on device size, battery condition,
            charging efficiency, and usage.
          </p>
        </div>
      </section>

      <section className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Why Sidekick?</p>
            <h2 className="text-4xl font-black text-admiral-navy">Not Just Another Battery.</h2>
            <p className="mt-5 text-xl font-bold text-gray-700">
              One piece of gear. Fewer things to remember.
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              Basic power banks can solve one problem. Sidekick earns its place in a truck, work bag,
              or emergency kit by combining power with practical field utility.
            </p>
            <div className="mt-7">
              <CheckoutButton
                location="comparison"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-admiral-gold px-6 py-3 font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
              >
                GET SIDEKICK — ${product.price.toFixed(2)}
              </CheckoutButton>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[640px] border-collapse bg-white text-left text-sm">
              <thead className="bg-admiral-navy text-white">
                <tr>
                  <th className="px-4 py-4 font-bold">Capability</th>
                  <th className="px-4 py-4 text-right font-bold">Sidekick</th>
                  <th className="px-4 py-4 text-right font-bold">Typical Basic Power Bank</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([capability, sidekick, basic], index) => (
                  <tr key={capability} className={index % 2 === 0 ? "bg-admiral-white" : "bg-white"}>
                    <td className="px-4 py-3 font-semibold text-gray-800">{capability}</td>
                    <td className="px-4 py-3 text-right font-black text-admiral-navy">{sidekick}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{basic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="sidekick-reveal bg-[#111820] py-16 text-white md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">The Sidekick Philosophy</p>
          <h2 className="text-4xl font-black">Never Work Alone.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/78">
            A good Sidekick doesn&apos;t need to be the biggest tool you own. It needs to be there when
            you need it. Portable power that stays close whether you&apos;re moving between jobs,
            traveling, working outside, preparing for an outage, or simply nowhere near the outlet
            you need.
          </p>
          <div className="mt-8 text-3xl font-black text-admiral-gold">
            <p>Bring backup.</p>
            <p>Bring Sidekick.</p>
          </div>
        </div>
      </section>

      <section className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Admiral Energy Trust</p>
            <h2 className="text-4xl font-black text-admiral-navy">Backed By Admiral Energy.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Sidekick is part of Admiral Energy&apos;s broader focus on energy resilience—from portable
              backup power to whole-home energy systems.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex rounded-lg bg-admiral-navy px-5 py-3 font-bold text-white transition-colors hover:bg-navy-light"
            >
              Learn About Admiral Energy
            </Link>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
              <div key={item.title} className="rounded-lg border border-gray-200 bg-admiral-white p-5">
                <Icon className="mb-4 h-6 w-6 text-admiral-gold" />
                <h3 className="font-black text-admiral-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#111820]">
            <Image
              src="/images/sidekick/whats-in-box-real-20260812.webp"
              alt="Sidekick PowerBank shown with its retail box"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">What You Get</p>
            <h2 className="text-4xl font-black text-admiral-navy">
              Everything That Comes With Your Sidekick.
            </h2>
            <div className="mt-8 grid gap-3">
              {includedItems.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-admiral-gold" />
                  <span className="font-semibold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Product Details</p>
          <h2 className="text-4xl font-black text-admiral-navy">Know Your Gear.</h2>
          <p className="mt-4 text-sm leading-6 text-gray-500">
            Specifications are based on current product documentation. Actual performance may vary by
            device, charging conditions, temperature, and use.
          </p>
          <div className="mt-9 space-y-3">
            {specGroups.map((group) => (
              <details
                key={group.title}
                className="group rounded-lg border border-gray-200 bg-admiral-white p-5"
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    pushSidekickEvent("sidekick_feature_engagement", {
                      feature: `spec_${group.title}`,
                    });
                  }
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-admiral-navy [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {group.items.map(([label, value], index) => (
                    <div
                      key={label}
                      className={`grid gap-1 px-4 py-3 text-sm sm:grid-cols-[220px_1fr] ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <span className="font-bold text-gray-800">{label}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">FAQ</p>
          <h2 className="text-4xl font-black text-admiral-navy">Questions? We&apos;ve Got You.</h2>
          <div className="mt-9 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-gray-200 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-admiral-navy [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-7 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="buy" className="sidekick-reveal bg-[#111820] py-16 text-white md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-admiral-navy">
            <Image
              src="/images/sidekick/hero-real-20260812.webp"
              alt="Sidekick PowerBank standing beside its retail box"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Portable Field Power</p>
            <h2 className="text-4xl font-black">Keep Backup Within Reach.</h2>
            <p className="mt-5 text-lg leading-8 text-white/78">
              Put Sidekick where you keep the rest of the gear you rely on: your truck, bag,
              toolbox, vehicle, or emergency kit.
            </p>
            <h3 className="mt-8 text-3xl font-black">SIDEKICK PowerBank</h3>
            <p className="mt-2 text-xl font-bold text-admiral-gold">
              The Only PowerBank You&apos;ll Ever Need.
            </p>
            <p className="mt-6 text-5xl font-black">${product.price.toFixed(2)}</p>
            <div className="mt-7">
              <CheckoutButton
                location="final"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-admiral-gold px-7 py-4 text-base font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                <ShoppingBag className="h-5 w-5" />
                GET YOUR SIDEKICK
              </CheckoutButton>
            </div>
            <div className="mt-6 grid gap-2 text-sm font-semibold text-white/78 sm:grid-cols-2">
              {["Free Shipping", "30-Day Returns", "1-Year Limited Warranty", "Secure Checkout"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-admiral-gold" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-admiral-navy py-8 text-center text-white">
        <p className="text-sm font-black uppercase text-admiral-gold">Sidekick Is Just The Beginning.</p>
        <p className="mt-2 text-white/70">Portable power by Admiral Energy.</p>
      </section>

      <div
        className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-[4.75rem] right-3 z-50 md:hidden ${
          showStickyBuy ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        } transition duration-300`}
      >
        <div className="flex max-h-[72px] items-center justify-between gap-3 rounded-lg border border-white/10 bg-admiral-navy p-2.5 text-white shadow-2xl">
          <div>
            <p className="text-sm font-black">SIDEKICK</p>
            <p className="text-sm text-admiral-gold">${product.price.toFixed(2)}</p>
          </div>
          <CheckoutButton
            location="sticky"
            showError={false}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-admiral-gold px-5 py-2 text-sm font-black text-admiral-navy disabled:cursor-not-allowed disabled:opacity-70"
          >
            BUY NOW
          </CheckoutButton>
        </div>
      </div>

      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sidekick image preview"
          className="fixed inset-0 z-[70] bg-black/85 p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 z-10 rounded-lg bg-white p-2 text-admiral-navy"
            aria-label="Close image preview"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative mx-auto h-full max-w-5xl overflow-hidden rounded-lg">
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

