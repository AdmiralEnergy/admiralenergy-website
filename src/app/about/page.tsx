import type { Metadata } from "next";
import Link from "next/link";
import { Anchor, Shield, Users, ArrowRight, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Admiral Energy",
  description:
    "Admiral Energy was founded in North Carolina by a Navy veteran and intelligence professional. We help families prepare for power disruptions — honestly.",
};

const timeline = [
  { year: "2006-2014", title: "U.S. Navy", description: "Active-duty service — nuclear engineering, operational planning, leadership under pressure." },
  { year: "2014-2020", title: "Intelligence Community", description: "Complex problem-solving, data analysis, systems thinking — skills that transfer directly to energy consulting." },
  { year: "2020", title: "Solar Industry", description: "Entered residential solar in North Carolina. Saw firsthand how families were underserved and oversold." },
  { year: "2024", title: "Admiral Energy Founded", description: "Built on a simple idea: advise first, sell second. Help NC homeowners prepare for power disruptions with portable energy products and honest guidance." },
  { year: "2025", title: "Portable Autonomy", description: "Expanded beyond solar installations to portable power, storm preparedness, and the adviser model that puts homeowners first." },
];

const values = [
  {
    icon: Shield,
    title: "Honesty Over Commission",
    description:
      "We'd rather lose a sale than recommend something you don't need. Our advisers earn trust, not transactions.",
  },
  {
    icon: Anchor,
    title: "Military-Grade Reliability",
    description:
      "Every product we sell, we've tested. Every recommendation we make, we stand behind. No exceptions.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We live in NC. We lose power in the same storms. We're building for our neighbors, not shareholders.",
  },
  {
    icon: Heart,
    title: "Education Over Marketing",
    description:
      "A well-informed homeowner makes better decisions. That's why our blog and guides exist — to help you think clearly about energy.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Anchor className="w-12 h-12 text-admiral-gold mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Built by a Veteran. Led by Values.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Admiral Energy exists because NC homeowners deserve an energy adviser who puts their interests first — not a solar salesman chasing commission.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy mb-8">
            The Founder&apos;s Story
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              My name is David Edwards. I spent eight years in the U.S. Navy and
              six more in the intelligence community. I&apos;ve planned operations,
              analyzed complex systems, and led teams in high-stakes environments.
            </p>
            <p>
              When I entered the solar industry in North Carolina, I saw something
              that bothered me: homeowners being sold systems they didn&apos;t
              understand, by salespeople who wouldn&apos;t be around when something
              went wrong.
            </p>
            <p>
              I founded Admiral Energy to do it differently. We&apos;re not a solar
              company — we&apos;re an{" "}
              <strong>energy resilience company</strong>. Sometimes that means
              selling you a $150 power bank. Sometimes it means recommending a
              whole-home backup system. Sometimes it means telling you that you don&apos;t
              need anything we sell.
            </p>
            <p>
              That&apos;s the adviser model. It&apos;s slower than hard sales, but it builds
              something that matters more: <strong>trust</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            How We Got Here
          </h2>
          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex-shrink-0 w-28 text-right">
                  <span className="text-admiral-gold font-bold text-sm">
                    {item.year}
                  </span>
                </div>
                <div className="w-px bg-admiral-navy/20 relative">
                  <div className="absolute w-3 h-3 bg-admiral-navy rounded-full -left-1.5 top-1" />
                </div>
                <div className="pb-2">
                  <h3 className="font-semibold text-admiral-navy">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="bg-admiral-navy/5 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-6 h-6 text-admiral-navy" />
                </div>
                <div>
                  <h3 className="font-semibold text-admiral-navy text-lg mb-1">
                    {v.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-admiral-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Let&apos;s Talk About Your Home
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            No pitch. No obligation. Just a conversation about what makes sense
            for your family and your home.
          </p>
          <Link
            href="/contact"
            className="bg-admiral-gold text-admiral-navy px-8 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2"
          >
            Talk to Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
