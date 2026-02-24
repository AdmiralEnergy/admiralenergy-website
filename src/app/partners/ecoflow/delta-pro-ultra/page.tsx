import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "EcoFlow DELTA Pro Ultra — Whole-Home Battery Backup",
  description:
    "The EcoFlow DELTA Pro Ultra delivers whole-home backup with up to 90kWh expandable capacity, UL 9540A certification, and seamless automatic transfer.",
};

const specs = [
  { label: "Output", value: "7,200W (surge 14,400W)" },
  { label: "Base Capacity", value: "6kWh (expandable to 90kWh)" },
  { label: "Battery Type", value: "LiFePO4 (3,000+ cycles)" },
  { label: "Weight", value: "170 lbs per unit" },
  { label: "Transfer Time", value: "<20ms (automatic)" },
  { label: "Certification", value: "UL 9540A, FCC, DOE" },
  { label: "Solar Input", value: "5,600W max" },
  { label: "Operating Temp", value: "-4°F to 113°F" },
  { label: "App Control", value: "EcoFlow app (iOS & Android)" },
  { label: "Warranty", value: "5-year limited" },
];

const advantages = [
  {
    title: "No Fuel, No Fumes",
    description:
      "Unlike generators, the DELTA Pro Ultra runs silently with zero emissions. Safe to use indoors (garage or utility closet).",
  },
  {
    title: "Automatic Transfer",
    description:
      "When the grid drops, the Smart Home Panel switches your home to battery in under 20 milliseconds. You won't even notice.",
  },
  {
    title: "Solar Recharging",
    description:
      "Pair with EcoFlow solar panels (up to 5,600W input) for indefinite off-grid capability during extended outages.",
  },
  {
    title: "Expandable System",
    description:
      "Start with 6kWh and expand to 90kWh as your needs grow. Stack up to 15 batteries for a truly independent home.",
  },
  {
    title: "Smart Home Panel",
    description:
      "The Smart Home Panel 2 manages up to 6 circuits — choose exactly which circuits get battery backup.",
  },
  {
    title: "App Monitoring",
    description:
      "Monitor usage, solar production, and battery status from your phone. Set priorities and schedules remotely.",
  },
];

export default function EcoFlowPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-admiral-gold text-sm font-semibold tracking-wider uppercase">
            Admiral Energy × EcoFlow
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
            DELTA Pro Ultra
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            Whole-home battery backup. 7,200W output. Up to 90kWh expandable capacity.
            Automatic transfer in under 20ms.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Authorized EcoFlow Affiliate Partner
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-admiral-gold text-admiral-navy px-8 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors"
            >
              Get a Free Consultation
            </Link>
            <a
              href="https://www.ecoflow.com/delta-pro-ultra-portable-power-station-combo"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              View on EcoFlow.com →
            </a>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="bg-yellow-50 border-b border-yellow-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
          <p className="text-sm text-yellow-800">
            <strong>Disclosure:</strong> Admiral Energy is an authorized EcoFlow
            affiliate. We may earn a commission on purchases made through our
            links, at no extra cost to you.{" "}
            <Link
              href="/policies/affiliate-disclosure"
              className="underline hover:text-yellow-900"
            >
              Full disclosure →
            </Link>
          </p>
        </div>
      </div>

      {/* What It Does */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-4">
            Why This Is Different
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            This isn&apos;t a portable charger. The DELTA Pro Ultra is a
            legitimate whole-home battery backup system — a real alternative to a
            standby generator.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((a) => (
              <div key={a.title} className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-admiral-navy text-lg mb-2">
                  {a.title}
                </h3>
                <p className="text-gray-600 text-sm">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            Technical Specifications
          </h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={`flex justify-between px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <span className="font-medium text-gray-700">{s.label}</span>
                <span className="text-gray-600 font-mono text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Comparison */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            Generator vs. DELTA Pro Ultra
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="font-bold text-gray-500 text-lg mb-4">
                Traditional Generator
              </h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                  Requires fuel (gas/propane) — scarce in emergencies
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                  CO poisoning risk — must be outdoors
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                  Loud (65-80 dB)
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                  Regular maintenance required
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                  Finite runtime — stops when fuel runs out
                </li>
              </ul>
            </div>
            <div className="bg-admiral-navy text-white rounded-2xl p-8">
              <h3 className="font-bold text-admiral-gold text-lg mb-4">
                DELTA Pro Ultra + Solar
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  No fuel — recharges from solar panels
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Zero emissions — safe for indoor use
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Whisper-quiet operation (~30 dB)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  No maintenance — LiFePO4 lasts 10+ years
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Indefinite runtime with solar recharging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Adviser CTA */}
      <section className="py-16 bg-admiral-gold">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Home className="w-12 h-12 text-admiral-navy mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-admiral-navy mb-4">
            Is Whole-Home Backup Right for You?
          </h2>
          <p className="text-admiral-navy/80 text-lg mb-4">
            The DELTA Pro Ultra is a serious investment. We won&apos;t push it if
            a $150 power bank solves your problem. Talk to us first — free, no
            pressure, honest advice.
          </p>
          <p className="text-admiral-navy/60 text-sm mb-8">
            We&apos;ll assess your home&apos;s power needs, roof exposure, and
            budget to recommend the right solution — even if it&apos;s not this one.
          </p>
          <Link
            href="/contact"
            className="bg-admiral-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors inline-flex items-center gap-2"
          >
            Schedule a Free Assessment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
