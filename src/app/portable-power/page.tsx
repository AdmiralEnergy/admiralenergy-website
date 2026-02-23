import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/data/products";
import {
  Battery,
  Sun,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Portable Power Solutions",
  description:
    "Solar-powered portable energy for NC homeowners. Keep your devices charged and your family connected — grid or no grid.",
};

const benefits = [
  {
    icon: Sun,
    title: "Solar Charging",
    description:
      "Harvest free energy from the sun. Our panels and power stations recharge without fuel, noise, or fumes.",
  },
  {
    icon: Battery,
    title: "LiFePO4 Battery Tech",
    description:
      "Lithium iron phosphate batteries last 3,000+ cycles — roughly 10 years of daily use — and are safer than standard lithium-ion.",
  },
  {
    icon: Zap,
    title: "Instant Backup",
    description:
      "No transfer switch. No electrician. Plug in and go. These units power essentials in seconds when the grid drops.",
  },
  {
    icon: ShieldCheck,
    title: "Built for NC Weather",
    description:
      "Hurricanes, ice storms, summer heat — North Carolina throws everything at us. Portable power keeps you ready.",
  },
];

const useCases = [
  {
    title: "Storm Season Prep",
    items: [
      "Charge phones & radios during multi-day outages",
      "Run a CPAP, mini-fridge, or fan overnight",
      "Keep security cameras and Wi-Fi online",
    ],
  },
  {
    title: "Everyday Savings",
    items: [
      "Power a home office from solar during peak TOU hours",
      "Charge e-bikes, tools, and devices off-grid",
      "Reduce phantom load by switching to portable circuits",
    ],
  },
  {
    title: "Outdoor & Travel",
    items: [
      "Tailgating, camping, and RV trips",
      "Jobsite backup when grid access is limited",
      "Emergency kit for the car, boat, or camper",
    ],
  },
];

export default function PortablePowerPage() {
  const featuredProducts = products.filter((p) => p.category === "power-station" || p.category === "solar-panel");

  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-admiral-gold text-sm font-semibold tracking-wider uppercase">
            Portable Energy Autonomy
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
            Power That Goes Where You Go
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Solar-powered stations and panels that keep you running — at home
            during a storm, on the road, or anywhere between.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-admiral-gold text-admiral-navy px-8 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Shop Now
            </Link>
            <Link
              href="/partners/ecoflow/delta-pro-ultra"
              className="border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Explore EcoFlow Whole-Home →
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            Why Portable Solar Power?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="bg-admiral-navy/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-8 h-8 text-admiral-navy" />
                </div>
                <h3 className="font-semibold text-admiral-navy text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-600 text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            Real Uses for Real People
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((uc) => (
              <div key={uc.title} className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-admiral-navy mb-4">
                  {uc.title}
                </h3>
                <ul className="space-y-3">
                  {uc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
              Our Portable Power Lineup
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {featuredProducts.map((p) => (
                <div key={p.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-admiral-navy/5 flex items-center justify-center">
                    <Battery className="w-16 h-16 text-admiral-navy/20" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-admiral-navy mb-1">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{p.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-admiral-navy">
                        ${p.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/shop/${p.slug}`}
                        className="text-admiral-gold hover:text-admiral-navy transition-colors font-medium text-sm inline-flex items-center gap-1"
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-admiral-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Book a free call with one of our energy advisers. We&apos;ll help
            you figure out the right portable power setup — no sales pitch, just
            straight talk.
          </p>
          <Link
            href="/contact"
            className="bg-admiral-gold text-admiral-navy px-8 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2"
          >
            Talk to an Adviser <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
