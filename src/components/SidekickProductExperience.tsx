"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import {
  AlertTriangle,
  Battery,
  BatteryCharging,
  Briefcase,
  Cable,
  Car,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  Flashlight,
  Hammer,
  ImageIcon,
  MapPin,
  PackageCheck,
  PlayCircle,
  PlugZap,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Sun,
  Tent,
  Truck,
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

const identityItems: IconItem[] = [
  { title: "Field Work", icon: Truck },
  { title: "Jobsite", icon: Hammer },
  { title: "Vehicle", icon: Car },
  { title: "Outdoors", icon: Tent },
  { title: "Power Outages", icon: Zap },
];

const featureTiles: IconItem[] = [
  {
    title: "40,000mAh Capacity",
    description: "Keep backup energy within reach when normal charging is not convenient.",
    icon: BatteryCharging,
  },
  {
    title: "Grab It and Go",
    description: "Integrated USB-C, Micro-USB, and Lightning cables reduce missing-cable moments.",
    icon: Cable,
  },
  {
    title: "Light When You Need It",
    description: "Integrated 480-lumen emergency lighting gives Sidekick another job after dark.",
    icon: Flashlight,
  },
  {
    title: "Another Way Back to Power",
    description: "The integrated solar panel provides supplemental charging away from grid power.",
    icon: Sun,
  },
  {
    title: "Power Without an Outlet",
    description: "Manual generation provides an additional last-resort emergency power option.",
    icon: RotateCcw,
  },
];

const fieldCards = [
  {
    title: "Contractors",
    copy: "Keep phones, cameras, and small USB electronics powered throughout the day.",
    image: "/images/sidekick/toolbox-real-20260812.webp",
    icon: Hammer,
  },
  {
    title: "Field Professionals",
    copy: "Backup power when your work keeps you moving instead of sitting near an outlet.",
    image: "/images/sidekick/field-real-20260812.webp",
    icon: Briefcase,
  },
  {
    title: "Vehicles",
    copy: "Keep Sidekick in your truck, work vehicle, or emergency kit.",
    image: "/images/sidekick/truck-real-20260812.webp",
    icon: Truck,
  },
  {
    title: "Outdoors",
    copy: "Portable charging and lighting when you are away from conventional power.",
    image: "/images/sidekick/outdoors-real-20260812.webp",
    icon: Tent,
  },
];

const comparisonRows = [
  ["Portable battery", "Yes", "Yes"],
  ["Built-in cables", "Yes", "Varies"],
  ["Integrated lighting", "Yes", "Varies"],
  ["Solar charging", "Yes", "Usually no"],
  ["Hand-crank generation", "Yes", "No"],
  ["Emergency-focused design", "Yes", "Varies"],
  ["Admiral Energy support", "Yes", "No"],
];

const specGroups = [
  {
    title: "Power",
    items: [
      ["Capacity", "40,000 mAh"],
      ["Rated energy", "148Wh"],
      ["Battery type", "Rechargeable lithium polymer battery"],
      ["USB-A output", "SCP 22.5W max"],
      ["USB-C output", "PD 20W max"],
      ["Built-in USB-C cable", "PD 20W max"],
      ["Lightning cable output", "5V/2.4A"],
      ["Micro-USB cable output", "5V/2.1A"],
    ],
  },
  {
    title: "Charging",
    items: [
      ["Wired charging", "USB-C input PD 18W max"],
      ["USB-A input cable", "QC 18W max"],
      ["Solar charging", "5.5V/300mA supplemental input"],
      ["Hand crank generation", "5V/400mA emergency input"],
      ["Wired charging time", "Approximately 6 hours with a PD20W charger"],
      ["Hand-crank speed", "120-180 revolutions per minute"],
    ],
  },
  {
    title: "Physical",
    items: [
      ["Dimensions", "173.2 x 84 x 42.2 mm"],
      ["Weight", "~580 g (1.28 lbs)"],
      ["Built-ins", "Compass, bubble level, USB-C, Micro-USB, and Lightning cables"],
    ],
  },
  {
    title: "Environment",
    items: [
      ["Operating temperature", "0-40 C (32-104 F)"],
      ["Water/dust resistance", "Not published until verified"],
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
      "Sidekick is a portable backup power bank designed for charging compatible USB-powered electronics when normal charging is not convenient or available.",
  },
  {
    question: "Who is Sidekick designed for?",
    answer:
      "Sidekick is useful for people who spend significant time away from convenient outlets, including contractors, field professionals, travelers, outdoor users, and anyone building an emergency kit.",
  },
  {
    question: "Is Sidekick a replacement for a generator?",
    answer:
      "No. Sidekick is personal portable power. It is not intended to power household appliances or replace a home generator, portable power station, or whole-home battery.",
  },
  {
    question: "How should I normally recharge Sidekick?",
    answer: "Wired charging should be used as the normal charging method whenever possible.",
  },
  {
    question: "What is the solar panel for?",
    answer:
      "The solar panel is for supplemental charging when normal power is not available. The manual lists solar charging at 5.5V/300mA and notes that charging speed depends on sunlight and conditions.",
  },
  {
    question: "What is the hand crank for?",
    answer:
      "The hand crank is an emergency manual generation option for situations where other charging methods are unavailable.",
  },
  {
    question: "What devices can Sidekick charge?",
    answer:
      "Sidekick is designed for compatible USB-powered electronics. Confirm compatibility against USB-A, USB-C, and built-in cable output ratings before relying on it for critical devices.",
  },
  {
    question: "Can I take Sidekick camping?",
    answer:
      "Yes for normal portable charging and lighting use within the published operating temperature range. Water and dust resistance should not be assumed until verified.",
  },
  {
    question: "Does Sidekick have a warranty?",
    answer: "Yes. Sidekick includes a 1-year limited warranty from Admiral Energy.",
  },
  {
    question: "What is the return policy?",
    answer: "Admiral Energy offers 30-day returns. Review the complete return policy before purchase.",
  },
  {
    question: "How quickly does Sidekick ship?",
    answer: "The current checkout flow offers free shipping with an estimated 5-10 business day delivery window.",
  },
];

const showDigitalKit = false;

function pushSidekickEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ event, ...payload });
}

export default function SidekickProductExperience({ product }: SidekickProductExperienceProps) {
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
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
        setVideoOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const openVideo = () => {
    pushSidekickEvent("sidekick_video_play", {
      video: "sidekick_demo_still",
    });
    setVideoOpen(true);
  };

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
          <div className="min-w-0 lg:order-2">
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
            <div className="mt-3 hidden max-w-full snap-x gap-2 overflow-x-auto pb-2 sm:flex md:mt-4 md:gap-3">
              {galleryImages.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => selectGalleryImage(image)}
                  className={`relative h-16 w-20 shrink-0 snap-start overflow-hidden rounded-lg border transition sm:h-20 sm:w-24 ${
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
            <p className="mt-1 hidden text-xs leading-5 text-white/65 sm:block md:mt-2">{activeImage.caption}</p>
          </div>

          <div className="min-w-0 lg:order-1">
            <p className="mb-2 text-xs font-bold uppercase text-admiral-gold sm:text-sm">
              Portable Field Power
            </p>
            <h1 className="max-w-full text-[1.7rem] font-black leading-[1.08] sm:text-5xl lg:max-w-3xl lg:text-6xl">
              <span className="block sm:inline">Your Phone Shouldn&apos;t</span>{" "}
              <span className="block sm:inline">Clock Out Before</span>{" "}
              <span className="block sm:inline">You Do.</span>
            </h1>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.06] p-3 sm:hidden">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-white/60">SIDEKICK PowerBank</p>
                  <p className="mt-1 text-3xl font-black">${product.price.toFixed(2)}</p>
                </div>
                <p className="pb-1 text-sm font-bold text-admiral-gold">Free Shipping</p>
              </div>
              <CheckoutButton
                location="hero-mobile"
                className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-admiral-gold px-5 py-3 text-sm font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShoppingBag className="h-5 w-5" />
                GET YOUR SIDEKICK
              </CheckoutButton>
            </div>
            <p className="mt-4 max-w-full text-base leading-7 text-white/82 sm:text-lg sm:leading-8 lg:max-w-2xl">
              Sidekick gives you portable backup power when the job, road, or day takes you away
              from an outlet.
            </p>
            <p className="mt-3 max-w-full text-sm font-semibold leading-6 text-white sm:text-base lg:max-w-2xl">
              40,000mAh capacity. Built-in charging cables. Emergency lighting. Multiple ways to
              recharge.
            </p>
            <p className="mt-4 text-xl font-bold leading-7 text-admiral-gold sm:text-2xl">
              The Only PowerBank You&apos;ll Ever Need.
            </p>
            <div className="mt-7 hidden gap-4 sm:flex sm:flex-row sm:items-center">
              <div className="flex items-end justify-between gap-4 sm:block">
                <p className="text-3xl font-black sm:text-4xl">${product.price.toFixed(2)}</p>
                <p className="mt-1 text-sm font-semibold text-white/70">Free Shipping</p>
              </div>
              <CheckoutButton
                location="hero"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-admiral-gold px-5 py-4 text-sm font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-7 sm:text-base"
              >
                <ShoppingBag className="h-5 w-5" />
                GET YOUR SIDEKICK
              </CheckoutButton>
              <a
                href="#video"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10 sm:min-h-14 sm:w-auto sm:px-6 sm:py-4 sm:text-base"
              >
                See It In Action
              </a>
            </div>
            <div className="mt-5 grid gap-2 text-xs text-white/75 sm:flex sm:flex-wrap sm:gap-3 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-admiral-gold" />
                Secure Stripe Checkout
              </span>
              <span>30-Day Returns</span>
              <span>1-Year Limited Warranty</span>
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
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
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
          <div className="mt-10 grid gap-4 md:grid-cols-5">
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
          <p className="mt-5 text-xs text-gray-500">
            Capacity and technical specifications should match verified manufacturer documentation
            and Admiral Energy testing.
          </p>
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
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Built-In Cable Feature Story</p>
            <h2 className="text-4xl font-black text-admiral-navy">Stop Hunting for Cables.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              An emergency power bank isn&apos;t much help when your charging cable is somewhere else.
              Sidekick keeps multiple connectors physically attached to the device.
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
            {[
              {
                title: "Wired Charging",
                subtitle: "Everyday",
                label: "Primary Method",
                copy: "Recharge Sidekick normally whenever grid power is available.",
                icon: PlugZap,
              },
              {
                title: "Solar",
                subtitle: "Off-Grid",
                label: "Supplemental",
                copy: "Integrated solar charging provides another option when conventional power is not available.",
                icon: Sun,
              },
              {
                title: "Hand Crank",
                subtitle: "Last Resort",
                label: "Emergency",
                copy: "Generate power manually when other charging options are unavailable.",
                icon: RotateCcw,
              },
            ].map((item) => {
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
          <p className="mt-6 flex max-w-3xl gap-3 text-sm text-white/70">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-admiral-gold" />
            Solar and hand-crank charging are not represented as equivalent in speed to wired
            charging. Recharge-time claims are held until verified.
          </p>
        </div>
      </section>

      <section id="video" className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">See It Work</p>
          <h2 className="text-4xl font-black text-admiral-navy">Don&apos;t Take Our Word for It.</h2>
          <p className="mt-3 text-2xl font-bold text-gray-700">Watch Sidekick Work.</p>
          <button
            type="button"
            onClick={openVideo}
            className="group relative mt-10 aspect-video w-full overflow-hidden rounded-lg bg-[#111820] text-left"
          >
            <Image
              src="/images/sidekick/demo-thumbnail-real-20260812.webp"
              alt="Sidekick PowerBank battery indicator lights while charging"
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-admiral-gold text-admiral-navy transition-transform group-hover:scale-105">
                <PlayCircle className="h-11 w-11" />
              </span>
            </span>
            <span className="absolute bottom-5 left-5 rounded-lg bg-black/70 px-4 py-3 text-sm font-bold text-white">
              Demo video coming soon
            </span>
          </button>
          <div className="mt-7">
            <CheckoutButton
              location="video"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-admiral-navy px-6 py-3 font-black text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              GET YOUR SIDEKICK
            </CheckoutButton>
          </div>
        </div>
      </section>

      <section id="field" className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Built For The Field</p>
          <h2 className="text-4xl font-black text-admiral-navy">Wherever Work Takes You.</h2>
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
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Why Sidekick?</p>
            <h2 className="text-4xl font-black text-admiral-navy">Not Just Another Battery.</h2>
            <p className="mt-5 text-xl font-bold text-gray-700">
              One piece of gear. A lot fewer compromises.
            </p>
            <div className="mt-7">
              <CheckoutButton
                location="comparison"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-admiral-gold px-6 py-3 font-black text-admiral-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
              >
                GET SIDEKICK - ${product.price.toFixed(2)}
              </CheckoutButton>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full border-collapse bg-white text-left text-sm">
              <thead className="bg-admiral-navy text-white">
                <tr>
                  <th className="px-4 py-4 font-bold">Capability</th>
                  <th className="px-4 py-4 text-right font-bold">Sidekick</th>
                  <th className="px-4 py-4 text-right font-bold">Basic Power Bank</th>
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

      <section id="reviews" className="sidekick-reveal py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Trust And Reviews</p>
            <h2 className="text-4xl font-black text-admiral-navy">Sidekick Is Already Out There.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Verified owner stories belong here once Admiral Energy has customer images,
              permission, classification, and purchase or tester status. No simulated reviews are
              shown.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Verified Customer",
                copy: "Reserved for customers with confirmed purchase status and permission to publish.",
                icon: Star,
              },
              {
                title: "Admiral Product Tester",
                copy: "Reserved for test units or samples clearly identified as tester feedback.",
                icon: ClipboardList,
              },
              {
                title: "Support Standard",
                copy: "Backed by Admiral Energy support, 30-day returns, and a 1-year limited warranty.",
                icon: ShieldCheck,
              },
            ].map((proof) => {
              const Icon = proof.icon;
              return (
                <button
                  key={proof.title}
                  type="button"
                  onClick={() =>
                    pushSidekickEvent("sidekick_review_engagement", {
                      classification: proof.title,
                    })
                  }
                  className="rounded-lg border border-gray-200 bg-white p-6 text-left transition hover:border-admiral-gold"
                >
                  <Icon className="mb-5 h-8 w-8 text-admiral-gold" />
                  <h3 className="text-xl font-black text-admiral-navy">{proof.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{proof.copy}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">From Admiral Energy</p>
            <h2 className="text-4xl font-black text-admiral-navy">
              Portable Power From People Who Work In Backup Power.
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Admiral Energy helps customers think about energy resilience at every scale. Sidekick
              takes the same philosophy behind backup power and puts it in something you can carry.
            </p>
            <p className="mt-6 text-2xl font-black text-admiral-navy">
              From whole-home backup to power in your pocket, the mission stays the same.
            </p>
            <p className="mt-3 text-2xl font-black text-admiral-gold">Stay powered.</p>
            <Link
              href="/about"
              className="mt-7 inline-flex rounded-lg bg-admiral-navy px-5 py-3 font-bold text-white transition-colors hover:bg-navy-light"
            >
              Learn About Admiral Energy
            </Link>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {[
              ["Admiral Energy", "Parent brand and product support"],
              ["Kings Mountain, NC", "North Carolina energy resilience identity"],
              ["30-Day Returns", "Return policy available before checkout"],
              ["1-Year Warranty", "Limited warranty coverage"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-lg border border-gray-200 bg-admiral-white p-5">
                <MapPin className="mb-4 h-6 w-6 text-admiral-gold" />
                <h3 className="font-black text-admiral-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{copy}</p>
              </div>
            ))}
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
              {[
                "Sidekick PowerBank",
                "Integrated USB-C, Micro-USB, and Lightning cables",
                "Product documentation, pending final packaging verification",
                "Admiral Energy support",
                "1-year limited warranty",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-admiral-gold" />
                  <span className="font-semibold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showDigitalKit && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Included With Sidekick</p>
            <h2 className="text-4xl font-black text-admiral-navy">
              Know How To Use The Power You Have.
            </h2>
          </div>
        </section>
      )}

      <section className="sidekick-reveal bg-white py-16 md:py-20" data-sidekick-reveal>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase text-admiral-gold">Product Details</p>
          <h2 className="text-4xl font-black text-admiral-navy">Know Your Gear.</h2>
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
            <h2 className="text-4xl font-black">Don&apos;t Wait Until You&apos;re At 1%.</h2>
            <p className="mt-5 text-lg leading-8 text-white/78">
              Keep backup power where you keep the rest of the equipment you rely on.
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
              {["Free Shipping", "30-Day Returns", "1-Year Limited Warranty", "Secure Stripe Checkout"].map(
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
        className={`fixed inset-x-3 bottom-3 z-50 md:hidden ${
          showStickyBuy ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        } transition duration-300`}
      >
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-admiral-navy p-3 text-white shadow-2xl">
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

      {videoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sidekick demo video"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
        >
          <div className="relative w-full max-w-5xl rounded-lg bg-white p-4">
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg bg-admiral-navy p-2 text-white"
              aria-label="Close demo video"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-[#111820]">
              <Image
                src="/images/sidekick/demo-thumbnail-real-20260812.webp"
                alt="Sidekick PowerBank charging indicator lights"
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-6 text-center text-white">
                <ImageIcon className="mb-4 h-10 w-10 text-admiral-gold" />
                <p className="text-2xl font-black">Admiral demo video goes here.</p>
                <p className="mt-3 max-w-xl text-white/75">
                  Replace this still image with a 30-60 second product demonstration before launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

