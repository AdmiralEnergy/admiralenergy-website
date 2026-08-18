"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BriefcaseBusiness,
  Cable,
  Car,
  Check,
  ChevronDown,
  Compass,
  Flashlight,
  Gift,
  Hammer,
  HeartHandshake,
  Home,
  Loader2,
  MapPinned,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sun,
  Tent,
  Truck,
  Users,
  Usb,
} from "lucide-react";
import type { Product } from "@/data/products";
import { sidekickAnalyticsItem, trackEvent } from "@/lib/analytics";
import { BulkOrderForm } from "@/components/LeadForms";

interface Props {
  product: Product;
}

const gallery = [
  { src: "/images/sidekick/hero-real-20260812.webp", alt: "SideKick portable power bank beside its retail packaging", label: "SideKick and box" },
  { src: "/images/sidekick/front-real-20260812.webp", alt: "Integrated solar panel on the front of the SideKick power bank", label: "Front" },
  { src: "/images/sidekick/cables-real-20260812.webp", alt: "Built-in charging cables on the SideKick portable charger", label: "Cables" },
  { src: "/images/sidekick/flashlight-real-20260812.webp", alt: "SideKick emergency power bank flashlight switched on", label: "Flashlight" },
  { src: "/images/sidekick/solar-real-20260812.webp", alt: "Small integrated solar panel on the SideKick portable charger", label: "Solar" },
  { src: "/images/sidekick/crank-real-20260812.webp", alt: "SideKick emergency charger hand crank and compass", label: "Crank" },
];

const everydayUses = [
  { title: "Everyday carry", copy: "A useful backup when your phone needs power between outlets.", icon: Smartphone },
  { title: "Work", copy: "Keep communication, maps, authentication, and small USB devices going.", icon: Hammer },
  { title: "Travel", copy: "Built-in cables mean one less thing to remember before you leave.", icon: MapPinned },
  { title: "Vehicle kit", copy: "Store portable charging and a flashlight where roadside surprises happen.", icon: Car },
  { title: "Storms & outages", copy: "Keep personal electronics and lighting available when grid power is interrupted.", icon: Home },
  { title: "Camping", copy: "Carry practical charging, lighting, and simple reference tools outside.", icon: Tent },
  { title: "Family outings", copy: "A shared backup for phones, earbuds, and compatible small devices.", icon: Users },
  { title: "Gifts & teams", copy: "A practical option for crews, customers, and employee appreciation.", icon: Gift },
];

const features = [
  { title: "Built-in cables", copy: "USB-C, Micro-USB, and Lightning connectors stay attached to the unit.", icon: Cable },
  { title: "Multiple connections", copy: "Use available USB-A, USB-C, or built-in cable connections with compatible devices.", icon: Usb },
  { title: "Integrated flashlight", copy: "Dual LEDs provide useful lighting without draining your phone for illumination.", icon: Flashlight },
  { title: "Solar backup", copy: "The small integrated panel offers supplemental input when normal charging is unavailable.", icon: Sun },
  { title: "Emergency hand crank", copy: "Manual generation provides a last-resort way to create a small amount of power.", icon: RotateCcw },
  { title: "Compass + bubble level", copy: "Built-in convenience tools are available for quick reference—not precision navigation or surveying.", icon: Compass },
];

const rechargeMethods = [
  { step: "01", title: "Wired USB", tag: "Primary method", copy: "Use wired charging as the normal, reliable way to recharge SideKick.", icon: Cable },
  { step: "02", title: "Integrated solar", tag: "Supplemental", copy: "The small panel can add charge in useful sunlight. It is not designed for quick routine full recharges.", icon: Sun },
  { step: "03", title: "Hand crank", tag: "Emergency only", copy: "Use the crank as a last-resort input when an outlet, charger, or useful sunlight is unavailable.", icon: RotateCcw },
];

const faqs = [
  ["What can SideKick charge?", "SideKick is designed for phones and compatible small USB-powered electronics. It is not intended for household appliances."],
  ["How should I recharge it?", "Wired USB charging is the primary method. The integrated solar panel and hand crank are backup or emergency methods."],
  ["Does the solar panel fully charge SideKick?", "The small integrated panel can add supplemental charge in useful sunlight, but it is not intended for fast or routine full recharging. Use wired USB charging whenever it is available."],
  ["What is the hand crank for?", "The crank is a last-resort way to generate a small amount of input when wired charging and useful sunlight are unavailable. It is not a fast or practical way to refill the power bank."],
  ["Is SideKick a replacement for a generator?", "No. SideKick is personal portable power. It does not replace a portable power station, standby generator, or whole-home battery."],
  ["Did Admiral Energy manufacture SideKick?", "Admiral Energy selected, sells, and supports this product. Admiral Energy does not claim to have invented or manufactured the underlying hardware."],
  ["Is SideKick a Generac product?", "No. SideKick is an Admiral Energy product offering and is not manufactured, endorsed, or warrantied by Generac."],
  ["Is shipping included?", "Yes. The current offer includes free standard shipping in the continental United States. See the published shipping policy for processing and delivery details."],
  ["What support is included?", "Admiral Energy publishes a 30-day return policy and a 1-year limited warranty for SideKick. Contact information is available in the site footer and policy pages."],
];

function CheckoutButton({ product, location, children, className }: { product: Product; location: string; children: ReactNode; className: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function startCheckout() {
    trackEvent("select_item", { ecommerce: { item_list_name: location, items: [sidekickAnalyticsItem] } });
    trackEvent("sidekick_buy_click", { cta_location: location, product_id: product.id, price: product.price });
    setLoading(true);
    setError(false);
    try {
      const attribution = {
        acquisitionChannel: sessionStorage.getItem("ae_utm_source") || "direct",
        utmSource: sessionStorage.getItem("ae_utm_source"),
        utmMedium: sessionStorage.getItem("ae_utm_medium"),
        utmCampaign: sessionStorage.getItem("ae_utm_campaign"),
        utmTerm: sessionStorage.getItem("ae_utm_term"),
        utmContent: sessionStorage.getItem("ae_utm_content"),
        landingPage: sessionStorage.getItem("ae_landing_page"),
        referrer: sessionStorage.getItem("ae_referrer"),
      };
      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1, attribution }),
      });
      const data = (await response.json()) as { url?: string };
      if (!response.ok || !data.url) throw new Error("Checkout unavailable");
      trackEvent("begin_checkout", { ecommerce: { currency: "USD", value: product.price, items: [sidekickAnalyticsItem] } });
      window.location.assign(data.url);
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={startCheckout} disabled={loading || !product.inStock} className={className}>
        {loading ? <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Starting secure checkout…</> : children}
      </button>
      {error && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">Checkout could not start. Please try again or email david@admiralenergy.ai.</p>}
    </div>
  );
}

export default function SidekickProductExperience({ product }: Props) {
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const formattedPrice = product.price.toFixed(2);
  const availabilityLabel = product.inStock ? "In stock" : "Out of stock";

  useEffect(() => {
    trackEvent("view_item", { ecommerce: { currency: "USD", value: product.price, items: [sidekickAnalyticsItem] } });
    trackEvent("sidekick_view", { product_id: product.id, price: product.price });
  }, [product.id, product.price]);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), { threshold: 0.1 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-hidden bg-admiral-white">
      <section ref={heroRef} className="bg-admiral-navy text-white">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8">
          <div className="order-2 min-w-0 lg:order-1">
            <p className="eyebrow">SideKick PowerBank</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Portable Emergency Power You Actually Keep With You.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">SideKick is a portable emergency power bank and phone charger with built-in cables and a flashlight—useful for outages, work, travel, vehicle kits, and everyday backup.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Recharge by wired USB first. The integrated solar panel is supplemental, and the hand crank is for last-resort input.</p>
            <div className="mt-7 flex flex-wrap items-end gap-4"><p className="text-5xl font-black text-admiral-gold"><data value={formattedPrice}>${formattedPrice} USD</data></p><p className="pb-1 text-sm font-semibold text-slate-300">New • {availabilityLabel} • Free standard shipping</p></div>
            <div id="buy" className="mt-7 scroll-mt-28">
              <CheckoutButton product={product} location="sidekick_hero" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-admiral-gold px-7 py-4 text-base font-extrabold text-admiral-navy transition hover:bg-gold-light disabled:opacity-60 sm:w-auto">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" /> Get Your SideKick — ${formattedPrice}
              </CheckoutButton>
            </div>
            <div className="mt-6 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">{["Secure Stripe checkout", "30-day returns", "1-year limited warranty"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-admiral-gold" />{item}</p>)}</div>
            <p className="mt-6 max-w-xl text-xs leading-5 text-slate-400">Selected, stocked, sold, and supported by Admiral Energy. We do not claim to manufacture the underlying hardware.</p>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-2xl"><Image src={activeImage.src} alt={activeImage.alt} fill priority loading="eager" sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" /></div>
            <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-2" aria-label="SideKick product gallery">
              {gallery.map((image) => <button key={image.src} type="button" onClick={() => { setActiveImage(image); trackEvent("view_item_list", { gallery_item: image.label }); }} aria-label={`Show ${image.label}`} aria-pressed={activeImage.src === image.src} className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${activeImage.src === image.src ? "border-admiral-gold" : "border-transparent"}`}><Image src={image.src} alt="" fill sizes="80px" className="object-cover" /></button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl"><p className="eyebrow">Why people keep it around</p><h2 className="mt-4 text-4xl font-black tracking-tight text-admiral-navy md:text-5xl">Emergency gear that earns a place in daily life.</h2><p className="mt-5 text-lg leading-8 text-slate-600">SideKick is useful before the storm warning ever arrives. That everyday usefulness is what makes it more likely to be charged and close when you really need it.</p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{everydayUses.map((item) => <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><item.icon className="h-7 w-7 text-admiral-gold" /><h3 className="mt-5 text-lg font-black text-admiral-navy">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100"><Image src="/images/sidekick/sidekick-field-features.jpg" alt="SideKick built-in cables, flashlight, solar panel, hand crank, compass, and bubble level" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div>
          <div><p className="eyebrow">Built-in convenience</p><h2 className="mt-4 text-4xl font-black tracking-tight text-admiral-navy md:text-5xl">Fewer loose parts. More useful backup.</h2><div className="mt-9 grid gap-6 sm:grid-cols-2">{features.map((feature) => <div key={feature.title}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-admiral-navy text-admiral-gold"><feature.icon className="h-5 w-5" /></span><h3 className="font-black text-admiral-navy">{feature.title}</h3></div><p className="mt-3 text-sm leading-6 text-slate-600">{feature.copy}</p></div>)}</div></div>
        </div>
      </section>

      <section className="bg-[#071f31] py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl"><p className="eyebrow">Three ways to recharge</p><h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Wired first. Backup methods when needed.</h2><p className="mt-5 text-lg leading-8 text-slate-300">The honest explanation matters: the small solar panel and hand crank are emergency tools, not the primary way to refill SideKick.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">{rechargeMethods.map((method) => <article key={method.step} className="rounded-2xl border border-white/10 bg-white/5 p-7"><div className="flex items-center justify-between"><method.icon className="h-8 w-8 text-admiral-gold" /><span className="font-mono text-sm text-white/45">{method.step}</span></div><p className="mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-admiral-gold">{method.tag}</p><h3 className="mt-2 text-2xl font-black">{method.title}</h3><p className="mt-3 leading-7 text-slate-300">{method.copy}</p></article>)}</div>
          <p className="mt-8 text-slate-300">Read the detailed guides to <Link href="/blog/how-solar-power-banks-work" className="font-bold text-admiral-gold underline underline-offset-4">how solar power banks work</Link> and <Link href="/blog/hand-crank-power-bank-guide" className="font-bold text-admiral-gold underline underline-offset-4">what hand-crank charging can realistically do</Link>.</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
          <div><p className="eyebrow">Know what it is—and what it is not</p><h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">Personal portable power.</h2><p className="mt-5 text-lg leading-8 text-slate-600">SideKick is designed for phones and compatible small USB-powered electronics. It does not power appliances, replace a generator, or provide whole-home backup.</p><div className="mt-8 grid gap-3">{["Best for phones and small USB devices", "Wired charging is the normal recharge method", "Solar and crank are supplemental or emergency methods", "Clear, conservative product claims"].map((item) => <p key={item} className="flex gap-3 rounded-xl bg-white p-4 font-semibold text-slate-700 shadow-sm"><ShieldCheck className="h-5 w-5 shrink-0 text-admiral-gold" />{item}</p>)}</div></div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-100"><Image src="/images/sidekick/in-hand-real-20260812.webp" alt="SideKick PowerBank and its product box shown at a useful portable scale" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div><p className="eyebrow">For organizations</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Need SideKicks for your team?</h2><p className="mt-5 leading-7 text-slate-600">Ask about availability for contractors, field-service teams, real estate professionals, emergency-preparedness groups, employee gifts, customer appreciation, veteran organizations, and local programs.</p><div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-admiral-navy"><span className="rounded-full bg-admiral-gold/20 px-4 py-2"><Truck className="mr-2 inline h-4 w-4" />Field teams</span><span className="rounded-full bg-admiral-gold/20 px-4 py-2"><BriefcaseBusiness className="mr-2 inline h-4 w-4" />Businesses</span><span className="rounded-full bg-admiral-gold/20 px-4 py-2"><HeartHandshake className="mr-2 inline h-4 w-4" />Organizations</span></div></div>
          <BulkOrderForm />
        </div>
      </section>

      <section className="bg-admiral-navy py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><p className="eyebrow">When a power bank isn’t enough</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Explore professionally installed whole-home backup.</h2><p className="mt-3 max-w-2xl text-slate-300">Admiral Energy is a Generac Aligned Contractor. SideKick is a separate Admiral Energy offering and is not manufactured by Generac.</p></div>
          <Link href="/home-backup" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-bold transition hover:bg-white hover:text-admiral-navy">Explore Home Backup <Home className="h-5 w-5" /></Link>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><p className="eyebrow">Questions</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Straight answers before you buy.</h2><div className="mt-9 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-admiral-navy [&::-webkit-details-marker]:hidden">{question}<ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" /></summary><p className="mt-4 leading-7 text-slate-600">{answer}</p></details>)}</div></div>
      </section>

      <section className="bg-admiral-gold py-16 text-admiral-navy">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8"><div><h2 className="text-4xl font-black">Keep power within reach.</h2><p className="mt-3 text-lg">SideKick PowerBank • ${formattedPrice} USD • {availabilityLabel} • Free standard shipping</p></div><CheckoutButton product={product} location="sidekick_final" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-admiral-navy px-7 py-4 font-extrabold text-white transition hover:bg-navy-light sm:w-auto"><ShoppingBag className="h-5 w-5" /> Get Your SideKick</CheckoutButton></div>
      </section>

      <div className={`fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 md:hidden ${stickyVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"} transition duration-300`}>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#071f31] p-3 text-white shadow-2xl"><div><p className="text-sm font-black">SideKick</p><p className="text-sm font-extrabold text-admiral-gold">${formattedPrice} USD</p></div><CheckoutButton product={product} location="sidekick_sticky" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-5 py-2 text-sm font-extrabold text-admiral-navy"><ShoppingBag className="h-4 w-4" /> Buy now</CheckoutButton></div>
      </div>
    </div>
  );
}
