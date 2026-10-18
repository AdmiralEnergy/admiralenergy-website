import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import {
  BriefcaseBusiness,
  Cable,
  Car,
  Check,
  CheckCircle,
  ChevronDown,
  Compass,
  ExternalLink,
  Flashlight,
  Gauge,
  HeartHandshake,
  HousePlug,
  MapPin,
  PackageCheck,
  Plane,
  PlugZap,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sun,
  TentTree,
  Truck,
  Usb,
} from "lucide-react";
import SidekickAnalytics from "@/components/sidekick/SidekickAnalytics";
import SidekickBulkInquiry from "@/components/sidekick/SidekickBulkInquiry";
import SidekickCheckoutButton from "@/components/sidekick/SidekickCheckoutButton";
import SidekickGallery from "@/components/sidekick/SidekickGallery";
import SidekickPurchaseModule from "@/components/sidekick/SidekickPurchaseModule";
import SidekickStickyBar from "@/components/sidekick/SidekickStickyBar";
import { commercePolicies } from "@/data/commerce";
import {
  getSidekickSpecGroups,
  sidekickGallery,
  sidekickIncluded,
} from "@/data/sidekick";

interface SidekickProductExperienceProps {
  product: Product;
}

interface IconCard {
  title: string;
  description: string;
  outcome?: string;
  icon: typeof Cable;
}

const immediateValue: IconCard[] = [
  { title: "Fewer loose parts", description: "Built-in cables stay with the unit.", icon: Cable },
  { title: "Personal power nearby", description: "Charge compatible phones and small USB devices.", icon: Smartphone },
  { title: "Light without your phone", description: "Use the integrated dual LED flashlight.", icon: Flashlight },
  { title: "Three input options", description: "Wired first, solar supplemental, crank for emergencies.", icon: PlugZap },
];

const useCases: IconCard[] = [
  { title: "Everyday carry", description: "Keep backup power in the bag you already take with you.", icon: Smartphone },
  { title: "Work", description: "Support the phone, authentication, maps, and small USB gear your day depends on.", icon: BriefcaseBusiness },
  { title: "Travel", description: "Built-in cables mean fewer separate pieces to remember before you leave.", icon: Plane },
  { title: "Vehicle kit", description: "Store charging and lighting where roadside surprises happen.", icon: Car },
  { title: "Storms & outages", description: "Keep personal electronics and lighting available when grid power is interrupted.", icon: HousePlug },
  { title: "Outdoors & family days", description: "Carry practical charging, lighting, and reference tools away from outlets.", icon: TentTree },
];

const convenienceFeatures: IconCard[] = [
  {
    title: "Built-in cables",
    description: "USB-A input, USB-C, Micro-USB, and Lightning cables remain attached to SideKick.",
    outcome: "Grab one device instead of searching for a separate cable.",
    icon: Cable,
  },
  {
    title: "Multiple USB connections",
    description: "Use available USB-A, USB-C, or built-in cable outputs with compatible electronics.",
    outcome: "Connect small devices without treating SideKick like an appliance system.",
    icon: Usb,
  },
  {
    title: "Integrated flashlight",
    description: "Two LEDs provide high, low, SOS, and strobe lighting modes.",
    outcome: "Use dedicated light without spending your phone battery on illumination.",
    icon: Flashlight,
  },
  {
    title: "Supplemental solar input",
    description: "The small integrated panel can add charge when conventional power is unavailable.",
    outcome: "Keep another input option without pretending it is a fast routine charger.",
    icon: Sun,
  },
  {
    title: "Emergency hand crank",
    description: "Manual generation provides a last-resort input when other methods are unavailable.",
    outcome: "Retain one more path back to a small amount of power in an emergency.",
    icon: RotateCcw,
  },
  {
    title: "Compass + bubble level",
    description: "Built-in convenience tools provide quick directional and leveling references.",
    outcome: "Keep simple field references close without treating them as precision instruments.",
    icon: Compass,
  },
];

const rechargeMethods = [
  {
    number: "01",
    title: "Wired USB",
    label: "Normal recharge method",
    description: "Use wired USB charging as the reliable, everyday way to refill SideKick.",
    icon: PlugZap,
  },
  {
    number: "02",
    title: "Integrated solar",
    label: "Supplemental input",
    description: "Use the small panel to add charge in useful sunlight when normal power is unavailable.",
    icon: Sun,
  },
  {
    number: "03",
    title: "Hand crank",
    label: "Emergency / last resort",
    description: "Use manual generation only as a last-resort input—not as a practical full-recharge method.",
    icon: RotateCcw,
  },
];

const valueStack = [
  "Rechargeable battery for compatible phones and small USB electronics",
  "Integrated USB-A input, USB-C, Micro-USB, and Lightning cables",
  "USB-C and USB-A output options for compatible small electronics",
  "Dual LED flashlight with multiple lighting modes",
  "Supplemental solar input and emergency hand-crank input",
  "Compass and bubble-level reference tools",
  "Free standard shipping, 30-day returns, and a 1-year limited warranty",
  "Support from Admiral Energy in North Carolina",
];

const trustItems: IconCard[] = [
  { title: "Veteran-owned", description: "Admiral Energy was founded by U.S. Navy veteran David Edwards.", icon: ShieldCheck },
  { title: "North Carolina business", description: "Admiral Energy is based in Kings Mountain, North Carolina.", icon: MapPin },
  { title: "Real human support", description: "Call or email the Admiral Energy team when you need help.", icon: HeartHandshake },
  { title: commercePolicies.shipping.label, description: commercePolicies.shipping.summary, icon: Truck },
  { title: commercePolicies.returns.label, description: commercePolicies.returns.summary, icon: RotateCcw },
  { title: commercePolicies.sidekickWarranty.label, description: commercePolicies.sidekickWarranty.summary, icon: ShieldCheck },
];

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "What can SideKick charge?",
    answer: "SideKick is designed for compatible phones and small USB-powered electronics. Check your device's input requirements against the available USB-A, USB-C, or built-in cable outputs.",
  },
  {
    question: "How should I normally recharge it?",
    answer: "Use wired USB charging as the normal method and follow the product instructions with compatible charging equipment. Recharge time varies by power source and conditions.",
  },
  {
    question: "Can the solar panel fully recharge SideKick?",
    answer: "The integrated panel is a supplemental input, not a fast routine charging method. Results depend on sunlight, temperature, positioning, and other conditions, so wired charging should remain your primary method.",
  },
  {
    question: "What is the hand crank actually useful for?",
    answer: "The hand crank is a last-resort emergency input for situations where an outlet, USB charger, or useful sunlight is unavailable. It is not a practical way to refill the entire battery.",
  },
  {
    question: "How is SideKick different from a basic power bank?",
    answer: "SideKick combines a portable battery with built-in charging cables, dedicated lighting, supplemental solar input, emergency manual input, and simple field-reference tools. The value is the complete everyday-plus-preparedness package, not battery storage alone.",
  },
  {
    question: "Is SideKick a replacement for a generator or power station?",
    answer: "No. SideKick is personal portable power for compatible USB electronics. It is not designed for appliances, household circuits, or whole-home loads.",
  },
  {
    question: "What does my purchase include?",
    answer: "Your purchase includes the SideKick PowerBank with its integrated cables and built-in tools, Admiral Energy support, and a one-year limited warranty.",
  },
  {
    question: "How do shipping, returns, and warranty work?",
    answer: (
      <>
        Continental U.S. orders ship free. The shipping policy lists {commercePolicies.shipping.processing} for processing and {commercePolicies.shipping.transit} for standard shipping. Eligible returns are accepted within 30 days of delivery, and SideKick includes a one-year limited warranty. Read the{" "}
        <Link className="font-semibold text-admiral-navy underline" href={commercePolicies.shipping.href}>shipping</Link>,{" "}
        <Link className="font-semibold text-admiral-navy underline" href={commercePolicies.returns.href}>returns</Link>, and{" "}
        <Link className="font-semibold text-admiral-navy underline" href={commercePolicies.sidekickWarranty.href}>warranty</Link>{" "}
        pages for details.
      </>
    ),
  },
  {
    question: "Who sells and supports SideKick? Is it a Generac product?",
    answer: "SideKick is selected, sold, and supported by Admiral Energy. Admiral Energy does not claim to manufacture the underlying hardware. SideKick is separate from Generac; Admiral Energy's Generac Aligned Contractor status applies to its home-backup work.",
  },
];

export default function SidekickProductExperience({ product }: SidekickProductExperienceProps) {
  const specGroups = getSidekickSpecGroups(product.specs);

  return (
    <div className="w-full overflow-x-hidden bg-admiral-white text-gray-900">
      <SidekickAnalytics product={{ id: product.id, name: product.name, price: product.price }} />

      <section id="overview" className="scroll-mt-28 bg-admiral-navy text-white">
        <div className="sidekick-hero-grid mx-auto w-full max-w-7xl gap-6 px-4 py-7 sm:px-6 sm:py-10 lg:gap-x-12 lg:px-8 lg:py-14">
          <div className="sidekick-hero-intro min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-admiral-gold sm:text-sm">SideKick • Personal portable power</p>
            <h1 className="mt-3 max-w-2xl text-[2.55rem] font-black leading-[1.02] sm:text-5xl lg:text-6xl">Portable emergency power you&apos;ll actually keep with you.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">SideKick combines everyday portable charging, built-in cables, dedicated lighting, and realistic backup input options in one device that earns a place in your bag, vehicle, work kit, or outage plan.</p>
          </div>

          <div className="sidekick-hero-gallery min-w-0"><SidekickGallery images={sidekickGallery} /></div>

          <div className="sidekick-hero-offer min-w-0 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">SideKick PowerBank</p>
                <p className="mt-1 text-4xl font-black">${product.price.toFixed(2)} USD</p>
              </div>
              <p className="inline-flex items-center gap-2 pb-1 text-sm font-bold text-admiral-gold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                {product.inStock ? "In stock" : "Currently unavailable"}
              </p>
            </div>
            <div className="mt-4">
              <SidekickCheckoutButton productId={product.id} productName={product.name} price={product.price} inStock={product.inStock} location="hero" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-admiral-gold px-5 py-4 text-sm font-black text-admiral-navy transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-65 sm:text-base">
                <ShoppingBag className="h-5 w-5" /> Get your SideKick — ${product.price.toFixed(2)}
              </SidekickCheckoutButton>
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-white/65">{commercePolicies.shipping.label} • {commercePolicies.returns.label} • {commercePolicies.sidekickWarranty.label} • Secure Stripe checkout</p>
          </div>

          <div className="sidekick-hero-proof min-w-0">
            <p className="text-sm leading-6 text-white/65">Selected, sold, and supported by Admiral Energy, a veteran-owned energy-resilience business based in Kings Mountain, North Carolina.</p>
            <a href="#recharge" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-admiral-gold underline-offset-4 hover:underline">See how the three recharge methods differ</a>
          </div>
        </div>
      </section>

      <section aria-label="SideKick immediate value" className="bg-[#071c2c] py-6 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {immediateValue.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.05] p-3 sm:p-4">
                <Icon className="h-5 w-5 text-admiral-gold" />
                <h2 className="mt-3 text-sm font-black">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-white/62">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-8">
          <div className="relative min-h-[330px] overflow-hidden rounded-2xl bg-gray-200 sm:min-h-[470px]">
            <Image src="/images/sidekick/field-real-20260812.webp" alt="SideKick PowerBank flashlight lenses and solar-panel surface" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">The product insight</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-admiral-navy sm:text-5xl">Emergency gear only helps when it&apos;s actually with you.</h2>
            <p className="mt-6 text-lg leading-8 text-gray-700">Equipment that gets packed away and forgotten is hard to depend on. SideKick takes a more practical approach: make the backup useful on normal days, so it is more likely to stay charged, nearby, and familiar when an outage or unexpected delay happens.</p>
            <p className="mt-6 border-l-4 border-admiral-gold pl-5 text-2xl font-black leading-tight text-admiral-navy">Preparedness that is useful before the emergency.</p>
          </div>
        </div>
      </section>

      <section id="real-life" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">SideKick in real life</p>
            <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">One backup. More reasons to keep it close.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">SideKick is designed around the small electronics and everyday situations where being away from an outlet becomes inconvenient fast.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-gray-200 bg-admiral-white p-5 sm:p-6">
                  <Icon className="h-7 w-7 text-admiral-gold" />
                  <h3 className="mt-5 text-xl font-black text-admiral-navy">{item.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="demonstration" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Product demonstration</p>
            <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">See the useful parts—not a stock-photo promise.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">These are authentic SideKick product photographs. The built-in connections, ports, flashlight, solar surface, crank area, compass, and bubble level are visible in the gallery and close-ups below.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              { src: "/images/sidekick/back-real-20260812.webp", alt: "Rear of SideKick with integrated cables stored in place", title: "Cables that stay attached", copy: "USB-A input, USB-C, Micro-USB, and Lightning cables store against the unit." },
              { src: "/images/sidekick/truck-real-20260812.webp", alt: "SideKick connection ports and illuminated charge indicators", title: "Ports and charge indicators", copy: "Connection ports and visible indicator lights are grouped at the end of the unit." },
              { src: "/images/sidekick/flashlight-real-20260812.webp", alt: "SideKick dual LED flashlight powered on", title: "Dedicated lighting", copy: "The built-in dual LEDs provide light without relying on your phone's flashlight." },
            ].map((item) => (
              <article key={item.title} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-gray-100"><Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" /></div>
                <div className="p-5"><h3 className="text-xl font-black text-admiral-navy">{item.title}</h3><p className="mt-3 leading-7 text-gray-600">{item.copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Built-in convenience</p>
            <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">Features translated into everyday usefulness.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {convenienceFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-gray-200 bg-admiral-white p-5 sm:p-6">
                  <Icon className="h-8 w-8 text-admiral-navy" />
                  <h3 className="mt-5 text-xl font-black text-admiral-navy">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{feature.description}</p>
                  <p className="mt-4 border-t border-gray-200 pt-4 text-sm font-bold leading-6 text-admiral-navy">{feature.outcome}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="recharge" className="scroll-mt-28 bg-admiral-navy py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Three ways to recharge</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">The hierarchy matters: wired first, backups when needed.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {rechargeMethods.map((method) => {
              const Icon = method.icon;
              return (
                <article key={method.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                  <div className="flex items-center justify-between"><span className="text-3xl font-black text-white/20">{method.number}</span><Icon className="h-8 w-8 text-admiral-gold" /></div>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-admiral-gold">{method.label}</p>
                  <h3 className="mt-2 text-2xl font-black">{method.title}</h3>
                  <p className="mt-4 leading-7 text-white/72">{method.description}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-7 max-w-3xl text-sm leading-6 text-white/60">The integrated solar panel and hand crank are useful because they create additional input options—not because they replace normal wired charging.</p>
        </div>
      </section>

      <section id="value" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Why SideKick costs ${product.price.toFixed(2)}</p>
            <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">You are buying more than battery storage.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">A basic power bank may be the right choice when battery storage is the only job. SideKick is for buyers who value a complete everyday-plus-preparedness package: power, attached connections, lighting, backup inputs, field references, and support in one place.</p>
            <div className="mt-7 rounded-2xl bg-admiral-navy p-6 text-white"><p className="text-sm font-bold uppercase tracking-[0.14em] text-admiral-gold">The practical promise</p><p className="mt-2 text-3xl font-black">Keep personal power within reach.</p></div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-5">
              <div><p className="text-sm font-bold text-gray-500">What ${product.price.toFixed(2)} includes</p><p className="mt-1 text-3xl font-black text-admiral-navy">The SideKick value stack</p></div>
              <Gauge className="h-8 w-8 shrink-0 text-admiral-gold" />
            </div>
            <ul className="mt-5 space-y-3">
              {valueStack.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-admiral-gold" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="details" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <div className="relative min-h-[390px] overflow-hidden rounded-2xl bg-gray-100 sm:min-h-[520px]"><Image src="/images/sidekick/whats-in-box-real-20260812.webp" alt="SideKick PowerBank shown with its retail box" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div>
              <div className="mt-5 rounded-2xl border border-gray-200 bg-admiral-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-admiral-gold">Your purchase includes</p>
                <ul className="mt-4 space-y-3">{sidekickIncluded.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700"><PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-admiral-gold" />{item}</li>)}</ul>
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Product details</p>
              <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">Know what SideKick can—and cannot—do.</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-black text-emerald-900">Designed for</p><p className="mt-2 text-sm leading-6 text-emerald-900/75">Phones and compatible small USB-powered electronics.</p></div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="font-black text-amber-900">Not designed for</p><p className="mt-2 text-sm leading-6 text-amber-900/75">Appliances, household circuits, generators, or whole-home loads.</p></div>
              </div>
              <p className="mt-5 text-sm leading-6 text-gray-500">Specifications below come from the centralized product record. Actual performance varies by device, conditions, temperature, battery state, and use.</p>
              <div className="mt-7 space-y-3">
                {specGroups.map((group) => (
                  <details key={group.title} className="group rounded-2xl border border-gray-200 bg-admiral-white p-5">
                    <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between gap-4 font-black text-admiral-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-admiral-gold [&::-webkit-details-marker]:hidden">{group.title}<ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" /></summary>
                    <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
                      {group.items.map(([label, value], index) => <div key={label} className={`grid gap-1 px-4 py-3 text-sm sm:grid-cols-[190px_1fr] ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}><span className="font-bold text-gray-800">{label}</span><span className="text-gray-600">{value}</span></div>)}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Why buy from Admiral Energy</p>
              <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">A real company behind the checkout.</h2>
              <p className="mt-5 text-lg leading-8 text-gray-700">Admiral Energy focuses on practical energy resilience—from personal portable power to transparent education about professionally installed home-backup systems. The same brand commitment applies here: clear claims, accessible policies, and a real support path.</p>
              <Link href="/about" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-admiral-navy px-5 py-3 font-black text-white transition hover:bg-navy-light">Meet Admiral Energy <ExternalLink className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><Icon className="h-7 w-7 text-admiral-gold" /><h3 className="mt-4 text-lg font-black text-admiral-navy">{item.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p></article>;
              })}
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-admiral-navy/10 bg-admiral-navy p-5 text-white sm:p-6">
            <p className="font-black text-admiral-gold">Seller transparency</p>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/72">SideKick is selected, sold, and supported by Admiral Energy. Admiral Energy does not claim to manufacture the underlying hardware. SideKick is separate from Generac; Admiral Energy&apos;s Generac Aligned Contractor status applies to its separate home-backup work.</p>
          </div>
        </div>
      </section>

      <SidekickPurchaseModule product={{ id: product.id, name: product.name, price: product.price, inStock: product.inStock }} includedItems={sidekickIncluded} />

      <section id="faq" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">Questions before you buy</p>
          <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">Straight answers to the real objections.</h2>
          <div className="mt-9 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between gap-4 font-black text-admiral-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-admiral-gold [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" /></summary>
                <div className="mt-4 leading-7 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="final-consumer-cta" className="bg-admiral-gold py-14 text-admiral-navy md:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-7 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em]">Preparedness useful before the emergency</p>
            <h2 className="mt-2 text-4xl font-black">Keep power within reach.</h2>
            <p className="mt-3 text-lg font-semibold text-admiral-navy/75">SideKick • ${product.price.toFixed(2)} • {commercePolicies.shipping.label} • {commercePolicies.returns.label} • {commercePolicies.sidekickWarranty.label}</p>
          </div>
          <SidekickCheckoutButton productId={product.id} productName={product.name} price={product.price} inStock={product.inStock} location="final_consumer_cta" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-admiral-navy px-7 py-4 text-base font-black text-white transition hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-65 md:w-auto"><ShoppingBag className="h-5 w-5" /> Get your SideKick</SidekickCheckoutButton>
        </div>
      </section>

      <section id="bulk-orders" className="scroll-mt-28 bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">For organizations</p>
            <h2 className="mt-3 text-4xl font-black text-admiral-navy sm:text-5xl">Buying for a crew, organization, or client program?</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">Ask Admiral Energy about larger SideKick orders for field teams, contractors, organizations, employee programs, client gifts, or preparedness initiatives.</p>
            <div className="mt-7 space-y-3 text-sm font-bold text-admiral-navy">
              {["Field-service teams", "Businesses & client programs", "Community & veteran organizations"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-admiral-gold" /> {item}</p>)}
            </div>
          </div>
          <SidekickBulkInquiry />
        </div>
      </section>

      <section className="bg-admiral-navy py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-7 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">When personal portable power is not enough</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Need backup for home loads instead?</h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/72">SideKick is for phones and compatible small USB electronics. Whole-home systems serve a different job. Admiral Energy is a Generac Aligned Contractor and offers preliminary education and consultation follow-up for home-backup planning.</p>
          </div>
          <Link href="/kings-mountain/home-backup" data-analytics-event="home_backup_cta_click" data-analytics-location="sidekick_cross_sell" data-analytics-destination="/kings-mountain/home-backup" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3 font-black text-white transition hover:border-admiral-gold hover:text-admiral-gold md:w-auto">Explore home backup <HousePlug className="h-5 w-5" /></Link>
        </div>
      </section>

      <SidekickStickyBar price={product.price} />
    </div>
  );
}
