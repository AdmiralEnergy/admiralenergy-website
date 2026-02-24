import Link from "next/link";
import Script from "next/script";
import { Shield, ArrowRight, CheckCircle, Battery, Sun } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* TEMP: AvantLink site ownership verification — remove after verification. */}
      <Script
        type="text/javascript"
        src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=b4fccba6d8ff1139cd80f0add54cd84b5a17d636"
        strategy="afterInteractive"
      />

      {/* JSON-LD: LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Admiral Energy",
            description: "Portable energy autonomy and home resilience for North Carolina homeowners.",
            url: "https://admiralenergy.ai",
            email: "david@admiralenergy.ai",
            address: { "@type": "PostalAddress", addressLocality: "Kings Mountain", addressRegion: "NC", addressCountry: "US" },
            areaServed: { "@type": "State", name: "North Carolina" },
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-admiral-navy to-[#0a2540] text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-4">
            Portable Energy Autonomy &amp; Home Resilience
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Keep Your Home Running.<br className="hidden md:block" /> No Matter What.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Backup power you can own today — portable kits, home resilience plans,
            and expert guidance for North Carolina homeowners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors inline-flex items-center justify-center gap-2">
              Shop Backup Power <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/home-resilience" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-admiral-navy transition-colors">
              Build Your Resilience Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Three Paths */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy text-center mb-4">Three Ways We Help</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Whether you need a portable backup for tomorrow&apos;s storm or a whole-home system, we meet you where you are.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-admiral-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-admiral-navy text-white rounded-full w-14 h-14 flex items-center justify-center mb-5"><Battery className="w-7 h-7" /></div>
              <h3 className="text-xl font-semibold text-admiral-navy mb-3">1. Buy Portable Backup</h3>
              <p className="text-gray-600 mb-4">Solar power banks and portable stations you can own today. Plug in, charge up, stay powered during outages.</p>
              <Link href="/shop" className="text-admiral-navy font-semibold hover:text-admiral-gold transition-colors inline-flex items-center gap-1">Browse the Shop <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-admiral-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-admiral-navy text-white rounded-full w-14 h-14 flex items-center justify-center mb-5"><Shield className="w-7 h-7" /></div>
              <h3 className="text-xl font-semibold text-admiral-navy mb-3">2. Plan Your Resilience</h3>
              <p className="text-gray-600 mb-4">Guides, checklists, and NC-specific advice for hurricane prep, outage survival, and energy independence.</p>
              <Link href="/home-resilience" className="text-admiral-navy font-semibold hover:text-admiral-gold transition-colors inline-flex items-center gap-1">Explore Guides <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-admiral-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-admiral-navy text-white rounded-full w-14 h-14 flex items-center justify-center mb-5"><Sun className="w-7 h-7" /></div>
              <h3 className="text-xl font-semibold text-admiral-navy mb-3">3. Whole-Home Solutions</h3>
              <p className="text-gray-600 mb-4">Need solar + battery for the whole house? We refer you to vetted partner installers — no markup, no pressure.</p>
              <Link href="/contact" className="text-admiral-navy font-semibold hover:text-admiral-gold transition-colors inline-flex items-center gap-1">Talk to an Advisor <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-admiral-gold font-semibold text-sm uppercase tracking-wider mb-2">Flagship Product</p>
              <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-4">Solar Power Bank</h2>
              <p className="text-gray-600 text-lg mb-6">Your first line of defense against power outages. Compact, portable, and solar-rechargeable. Keep phones, laptops, medical devices, and Wi-Fi routers running when the grid goes down.</p>
              <ul className="space-y-3 mb-8">
                {["Charges via solar panel or wall outlet", "Multiple USB + AC outlets", "Silent operation — no generator noise", "Perfect for storm prep & camping"].map((item) => (
                  <li key={item} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-admiral-gold mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                ))}
              </ul>
              <Link href="/shop/solar-power-bank" className="bg-admiral-gold text-admiral-navy px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2">
                View Product Details <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-400"><Battery className="w-24 h-24 mx-auto mb-4 text-admiral-navy/30" /><p className="text-sm">Product image coming soon</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Honest Approach */}
      <section className="py-16 bg-white">
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
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-admiral-navy mb-4">How We Work</h3>
              <div className="space-y-4">
                {[{ step: "1", text: "Browse our store or contact us for advice" }, { step: "2", text: "Get honest guidance — no obligation" }, { step: "3", text: "Buy portable gear, or get referred to vetted installers" }].map((s) => (
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

      {/* NC Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-admiral-navy text-center mb-12">Real Results from NC Homeowners</h2>
          <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
            <p className="text-gray-700 text-lg italic mb-6">&quot;When Hurricane Helene knocked out power for 3 days, our battery system kept everything running. Refrigerator, Wi-Fi, even the coffee maker. David at Admiral Energy was honest from day one about what we needed and what we didn&apos;t.&quot;</p>
            <div className="text-sm text-gray-500">
              <p className="font-semibold text-admiral-navy">The Johnson Family — Matthews, NC</p>
              <p>System: Tesla Powerwall 2 + 20kW Solar Array | Backup Runtime: 2.5 days during outage</p>
            </div>
          </div>
          <div className="text-center mt-8"><Link href="/case-studies" className="text-admiral-navy font-semibold underline hover:no-underline">Read more resilience stories →</Link></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-admiral-navy text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Do you install solar panels?", a: "We don't install directly. If you need a whole-home solar + battery system, we refer you to vetted partner installers in the REACH network — no markup, no pressure." },
              { q: "What's in the shop?", a: "Portable solar power banks and backup stations you can buy and use immediately. Perfect for outage prep, camping, and emergency power." },
              { q: "Do you only serve North Carolina?", a: "Our store ships nationwide, but our advisory services and partner installer network are focused on NC homeowners." },
              { q: "Is the Duke PowerPair incentive still available?", a: "The PowerPair program offers up to $9,000 toward qualifying battery systems for Duke Energy customers in NC. Availability is limited — contact us to check your eligibility." },
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
          <p className="text-xl mb-8 text-blue-100">Shop portable backup, plan your resilience, or talk to an advisor. No pressure — ever.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors">Shop Now</Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-admiral-navy transition-colors">Talk to David</Link>
          </div>
        </div>
      </section>
    </>
  );
}
