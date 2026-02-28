import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowRight, CheckCircle, Battery, Sun, Zap, MapPin, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";

export default function HomePage() {
  const gb1000 = products.find((p) => p.slug === "gb1000");
  const panel200w = products.find((p) => p.slug === "200w-solar-panel");

  return (
    <>
      {/* JSON-LD: LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Admiral Energy",
            description: "Portable backup power, Generac home generators, and energy resilience for North Carolina homeowners.",
            url: "https://admiralenergy.ai",
            email: "david@admiralenergy.ai",
            address: { "@type": "PostalAddress", addressLocality: "Kings Mountain", addressRegion: "NC", addressCountry: "US" },
            areaServed: [
              { "@type": "City", name: "Charlotte", containedInPlace: { "@type": "State", name: "North Carolina" } },
              { "@type": "City", name: "Kings Mountain", containedInPlace: { "@type": "State", name: "North Carolina" } },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-admiral-navy to-[#0a2540] text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-4">
            Generac Aligned Contractor — North Carolina
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Portable Backup Power +<br className="hidden md:block" /> Generac Home Generators
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Shop the Generac GB1000. Bundle with 200W solar. Or get a quote for a Generac install in the Charlotte&nbsp;/&nbsp;Kings&nbsp;Mountain area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/gb1000" className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Buy GB1000 — $1,049
            </Link>
            <Link href="/shop/200w-solar-panel" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-admiral-navy transition-colors inline-flex items-center justify-center gap-2">
              <Sun className="w-5 h-5" /> Shop 200W Solar Panel
            </Link>
            <Link href="/contact" className="border-2 border-admiral-gold text-admiral-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-admiral-gold hover:text-admiral-navy transition-colors inline-flex items-center justify-center gap-2">
              Get a Generac Install Quote
            </Link>
          </div>
          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-admiral-gold" /> Generac Aligned Contractor (NC)</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-admiral-gold" /> Charlotte Metro + Kings Mountain</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-admiral-gold" /> No Pitch. Just Math.</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy text-center mb-4">Featured Products</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Own backup power today. No permits, no electrician, no wait.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* GB1000 Card */}
            {gb1000 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="bg-gray-50 h-52 flex items-center justify-center relative">
                  <Image src={gb1000.images[0]} alt={gb1000.name} fill sizes="(min-width: 1024px) 400px, 50vw" className="object-contain p-6" />
                  <span className="absolute top-3 left-3 bg-admiral-gold text-admiral-navy text-xs font-bold px-2 py-1 rounded">Generac</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-admiral-navy mb-2">{gb1000.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{gb1000.shortDescription}</p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-admiral-gold flex-shrink-0" /> 1200W AC / 2400W surge</li>
                    <li className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-admiral-gold flex-shrink-0" /> 400W solar input (MPPT)</li>
                    <li className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-admiral-gold flex-shrink-0" /> LiFePO4 — 2,500+ cycles</li>
                  </ul>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-admiral-navy">${gb1000.price.toFixed(2)}</span>
                    <Link href="/shop/gb1000" className="bg-admiral-gold text-admiral-navy px-4 py-2 rounded-md text-sm font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" /> Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 200W Panel Card */}
            {panel200w && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="bg-gray-50 h-52 flex items-center justify-center relative">
                  <Image src={panel200w.images[0]} alt={panel200w.name} fill sizes="(min-width: 1024px) 400px, 50vw" className="object-contain p-6" />
                  <span className="absolute top-3 left-3 bg-admiral-gold text-admiral-navy text-xs font-bold px-2 py-1 rounded">New</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-admiral-navy mb-2">{panel200w.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{panel200w.shortDescription}</p>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-admiral-gold flex-shrink-0" /> ETFE coating, IP65</li>
                    <li className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-admiral-gold flex-shrink-0" /> GB1000 adapter included</li>
                    <li className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-admiral-gold flex-shrink-0" /> Pair 2× for 400W input</li>
                  </ul>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-admiral-navy">${panel200w.price.toFixed(2)}</span>
                    <Link href="/shop/200w-solar-panel" className="bg-admiral-gold text-admiral-navy px-4 py-2 rounded-md text-sm font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Bundle Callout */}
            <div className="bg-gradient-to-br from-admiral-navy to-[#0a2540] rounded-xl shadow-md overflow-hidden flex flex-col text-white p-8 justify-center">
              <Zap className="w-10 h-10 text-admiral-gold mb-4" />
              <h3 className="text-xl font-bold mb-3">Bundle &amp; Save</h3>
              <p className="text-blue-100 text-sm mb-4">
                Pair the GB1000 with one or two Admiral 200W panels for off-grid solar recharging. Full charge in ~5 hours with a single panel, ~2.5 hours with two.
              </p>
              <p className="text-admiral-gold font-semibold text-sm mb-6">GB1000 + 200W Panel — Complete portable solar kit</p>
              <Link href="/shop" className="bg-admiral-gold text-admiral-navy px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors inline-flex items-center gap-1 self-start">
                Browse All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Portable Power */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-2">The New Entry Point</p>
              <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-4">
                Portable Power — Start Here
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                You don&apos;t need a $30,000 solar install to benefit from renewable energy. A portable power station + foldable solar panel gives you real backup power — no permits, no electrician, no wait.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Plug in and go — works out of the box",
                  "Solar recharging with no utility bill",
                  "Perfect for outages, camping, remote work",
                  "Start portable now; upgrade to whole-home later",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="bg-admiral-gold text-admiral-navy px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2">
                Shop Portable Power <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-400">
                <Battery className="w-24 h-24 mx-auto mb-4 text-admiral-navy/30" />
                <p className="text-sm">GB1000 + 200W Panel Setup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generac Install Leads */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 text-admiral-navy mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-4">
            Generac Home Generator Installs
          </h2>
          <p className="text-gray-600 text-lg mb-3 max-w-2xl mx-auto">
            Need whole-home backup that runs for days? We provide Generac generator install quotes for homeowners in the Charlotte metro area, Cleveland County, Gaston County, and Kings Mountain.
          </p>
          <p className="text-admiral-gold font-semibold text-sm mb-8">
            Charlotte Metro • Cleveland County • Gaston County • Kings Mountain
          </p>
          <Link href="/contact" className="bg-admiral-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy-light transition-colors inline-flex items-center gap-2">
            Get a Generac Install Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Trust / Honest Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-4">The Honest Approach</h2>
            <p className="text-xl text-gray-600">No pitch. Just math.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ul className="space-y-4">
              {["We tell you if it doesn't pencil out", "We show the actual math (backup runtime, costs)", "We tell you when to wait vs act", "No door-to-door, no pressure tactics", "North Carolina-focused — we know your grid, your storms, your incentives"].map((item) => (
                <li key={item} className="flex items-start gap-3"><span className="text-admiral-gold text-2xl leading-none">✓</span><span className="text-lg">{item}</span></li>
              ))}
            </ul>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-admiral-navy mb-4">How We Work</h3>
              <div className="space-y-4">
                {[{ step: "1", text: "Browse products or request a quote" }, { step: "2", text: "Get honest guidance — no obligation" }, { step: "3", text: "Buy portable gear, or get a Generac install quote" }].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <span className="bg-admiral-navy text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</span>
                    <span>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy text-center mb-12">Real Results from NC Homeowners</h2>
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm max-w-3xl mx-auto">
            <p className="text-gray-700 text-lg italic mb-6">&quot;When Hurricane Helene knocked out power for 3 days, our battery system kept everything running. Refrigerator, Wi-Fi, even the coffee maker. David at Admiral Energy was honest from day one about what we needed and what we didn&apos;t.&quot;</p>
            <div className="text-sm text-gray-500">
              <p className="font-semibold text-admiral-navy">The Johnson Family — Matthews, NC</p>
              <p>Backup Runtime: 2.5 days during outage</p>
            </div>
          </div>
          <div className="text-center mt-8"><Link href="/blog" className="text-admiral-navy font-semibold underline hover:no-underline">Read more resilience stories →</Link></div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-admiral-navy mb-4">NC Power Outage Survival Guide</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">Free guide covering what to do before, during, and after a power outage in North Carolina. Specific to our grid, our storms, our utility providers.</p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold" />
              <button type="submit" className="bg-admiral-gold text-admiral-navy px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors whitespace-nowrap">
                Get the Guide
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "What's the Generac GB1000?", a: "It's a 1086Wh LiFePO4 portable power station that delivers 1200W of clean AC power. It can run a refrigerator, CPAP, Wi-Fi, and charge devices for hours. Charges from wall, car, or solar panels." },
              { q: "Do you install Generac home generators?", a: "Yes — we provide install quotes for Generac home standby generators in the Charlotte metro, Kings Mountain, Cleveland County, and Gaston County areas. Request a quote to get started." },
              { q: "Can I use non-Generac solar panels with the GB1000?", a: "Yes. The GB1000 accepts 11–50V DC input via MC4 connectors. Our Admiral 200W panel includes the right adapter, but any MC4 panel within that voltage range will work." },
              { q: "Is the Duke PowerPair incentive still available?", a: "PowerPair offers up to $9,000 toward qualifying battery systems for Duke Energy customers in NC. Availability is limited — contact us to check eligibility." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-admiral-navy text-lg mb-2">{q}</h3>
                <p className="text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-admiral-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take Control of Your Power?</h2>
          <p className="text-xl mb-8 text-blue-100">Buy the GB1000, pair it with solar, or get a Generac install quote. No pressure — ever.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors">Shop Now</Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-admiral-navy transition-colors">Get a Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
