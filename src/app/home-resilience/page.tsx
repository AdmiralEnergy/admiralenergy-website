import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  CloudLightning,
  Thermometer,
  Wifi,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Home Resilience",
  description:
    "Prepare your North Carolina home for storms, outages, and extreme heat. Practical resilience planning from Admiral Energy.",
};

const threats = [
  {
    icon: CloudLightning,
    title: "Hurricanes & Tropical Storms",
    stat: "2-4 named storms impact NC annually",
    description:
      "Multi-day outages are the norm. Hurricane Florence left 700,000+ NC homes without power for days.",
  },
  {
    icon: Thermometer,
    title: "Extreme Heat",
    stat: "Duke Energy rolling blackouts increasing",
    description:
      "Summer peak demand strains the grid. Without cooling, heat-related illness risk soars.",
  },
  {
    icon: AlertTriangle,
    title: "Ice Storms & Winter Events",
    stat: "Dec 2022: 500K+ homes lost power",
    description:
      "Ice on power lines causes widespread, long-duration outages every 2-3 winters.",
  },
  {
    icon: Wifi,
    title: "Infrastructure Aging",
    stat: "40% of NC grid is 30+ years old",
    description:
      "Aging transmission lines and substations mean even average thunderstorms trigger outages.",
  },
];

const checklistItems = [
  {
    title: "Portable Power Station",
    description:
      "A 500Wh–1kWh LiFePO4 unit keeps phones, CPAP, Wi-Fi, and a mini-fridge running for 8-24 hours.",
    link: "/shop/solar-power-bank",
    linkText: "See our 500Wh Power Bank",
  },
  {
    title: "Solar Charging Panel",
    description:
      "A foldable 100W panel recharges your station during the day — indefinite power as long as you have sun.",
    link: "/shop/100w-solar-panel",
    linkText: "See the 100W Panel",
  },
  {
    title: "Emergency Kit Contents",
    description:
      "Flashlight, first-aid kit, battery radio, water purification tabs, 72-hour food supply, important documents in a waterproof bag.",
    link: "/shop/storm-ready-kit",
    linkText: "See our Storm Ready Kit",
  },
  {
    title: "Communication Plan",
    description:
      "Designate an out-of-area contact. Agree on a meetup point. Download offline maps. Register with ReadyNC.gov.",
    link: null,
    linkText: null,
  },
  {
    title: "Home Hardening",
    description:
      "Trim trees near power lines. Secure outdoor furniture. Know your main water shutoff. Consider impact-rated garage door bracing.",
    link: null,
    linkText: null,
  },
  {
    title: "Whole-Home Backup (Advanced)",
    description:
      "For full peace of mind, an EcoFlow DELTA Pro Ultra + Smart Home Panel provides automatic whole-home backup — no generator needed.",
    link: "/partners/ecoflow/delta-pro-ultra",
    linkText: "Learn about EcoFlow whole-home",
  },
];

export default function HomeResiliencePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-admiral-gold text-sm font-semibold tracking-wider uppercase">
            Home Resilience Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
            Protect Your Home. Prepare Your Family.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            North Carolina faces hurricanes, ice storms, rolling blackouts, and
            aging infrastructure. Here&apos;s how to be ready — not scared.
          </p>
          <Link
            href="#checklist"
            className="bg-admiral-gold text-admiral-navy px-8 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors"
          >
            Jump to Resilience Checklist
          </Link>
        </div>
      </section>

      {/* NC Threat Landscape */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-4">
            What NC Homeowners Face
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Understanding the threats is step one. None of this is to scare you
            — it&apos;s to help you prepare before the next event, not during
            it.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {threats.map((t) => (
              <div key={t.title} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                  <t.icon className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-admiral-navy text-lg">{t.title}</h3>
                  <p className="text-admiral-gold text-sm font-medium mb-1">
                    {t.stat}
                  </p>
                  <p className="text-gray-600 text-sm">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resilience Checklist */}
      <section id="checklist" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Home className="w-12 h-12 text-admiral-navy mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-admiral-navy mb-4">
              Your Home Resilience Checklist
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Work through these items at your own pace. Even completing two or
              three dramatically improves your readiness.
            </p>
          </div>

          <div className="space-y-6">
            {checklistItems.map((item, i) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-sm flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-admiral-navy text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-admiral-navy text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  {item.link && (
                    <Link
                      href={item.link}
                      className="text-admiral-gold hover:text-admiral-navy transition-colors text-sm font-medium inline-flex items-center gap-1"
                    >
                      {item.linkText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adviser vs DIY */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            The Adviser Difference
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-bold text-gray-500 text-lg mb-4">
                DIY Research
              </h3>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  Hours comparing specs across Amazon
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  Not sure what size you actually need
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  Mixed reviews, paid placements, affiliate noise
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  No one to call when something doesn&apos;t work
                </li>
              </ul>
            </div>
            <div className="bg-admiral-navy text-white rounded-2xl p-8">
              <h3 className="font-bold text-admiral-gold text-lg mb-4">
                Admiral Energy Adviser
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Right-sized recommendation for YOUR home
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Honest about what you need vs. don&apos;t
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Local NC knowledge — utility rates, storm patterns
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                  Ongoing support after purchase
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-admiral-gold">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-12 h-12 text-admiral-navy mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-admiral-navy mb-4">
            Start Your Resilience Plan
          </h2>
          <p className="text-admiral-navy/80 text-lg mb-8">
            Schedule a free 15-minute call. We&apos;ll walk through your home&apos;s
            specific risks and recommend the right portable power setup.
          </p>
          <Link
            href="/contact"
            className="bg-admiral-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors"
          >
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
