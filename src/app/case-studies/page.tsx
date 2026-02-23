import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Resilience Stories",
  description:
    "Real stories from NC homeowners who prepared for the unexpected with Admiral Energy.",
};

const stories = [
  {
    name: "The Johnson Family",
    location: "Raleigh, NC",
    event: "Hurricane Season 2024",
    quote:
      "When our neighborhood lost power for 3 days, we were the only house with lights on. The power station kept our fridge, phones, and Wi-Fi running. Our neighbors kept coming over to charge their phones.",
    product: "Solar Power Bank + 100W Panel",
    outcome: "72 hours of independence during a 3-day outage",
  },
  {
    name: "Mark & Linda",
    location: "Wilmington, NC",
    event: "Ice Storm, Winter 2024",
    quote:
      "We lost power on a Thursday night and didn't get it back until Sunday. Without our backup battery, my wife's CPAP would have been useless. That one product gave us peace of mind all weekend.",
    product: "500Wh Power Station",
    outcome: "Critical medical device powered for 60+ hours",
  },
  {
    name: "Sarah T.",
    location: "Charlotte, NC",
    event: "Summer 2024 Rolling Blackouts",
    quote:
      "Duke Energy kept doing 2-hour rolling blackouts during the heat wave. I was working from home and couldn't afford to lose my internet. The power station kept my router and laptop running through every blackout.",
    product: "Storm Ready Kit + Power Station",
    outcome: "Zero productivity loss during 6 rolling blackout events",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Resilience Stories</h1>
          <p className="text-gray-300 text-lg">
            Real NC homeowners. Real power events. Real outcomes. No stock
            photos — just honest stories from people who were prepared.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {stories.map((story) => (
            <div
              key={story.name}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-8 h-8 text-admiral-gold flex-shrink-0 mt-1" />
                  <blockquote className="text-gray-700 text-lg italic">
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-6">
                  <div>
                    <p className="text-sm text-gray-500">Who</p>
                    <p className="font-semibold text-admiral-navy">{story.name}</p>
                    <p className="text-sm text-gray-600">{story.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event</p>
                    <p className="font-semibold text-admiral-navy">{story.event}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Used</p>
                    <p className="font-semibold text-admiral-navy">{story.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Result</p>
                    <p className="font-semibold text-admiral-gold">{story.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-admiral-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Your Story Starts Here
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Don&apos;t wait for the next storm to find out you weren&apos;t ready.
            Start with a conversation — we&apos;ll help you build a plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-admiral-gold text-admiral-navy px-8 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2"
            >
              Browse Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Talk to an Adviser
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
