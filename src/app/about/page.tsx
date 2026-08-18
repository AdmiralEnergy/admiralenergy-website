import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anchor, ArrowRight, BookOpen, Check, MapPin, Scale, ShieldCheck } from "lucide-react";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Admiral Energy | Veteran-Owned Energy Resilience",
  description: "Meet Admiral Energy, a veteran-owned North Carolina home-energy resilience company built around honest education, practical products, and clear guidance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Admiral Energy | Veteran-Owned Energy Resilience",
    description: "Meet the veteran-owned North Carolina company behind SideKick and practical whole-home backup guidance.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Admiral Energy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Admiral Energy",
    description: "Veteran-owned, North Carolina-based guidance for practical energy resilience.",
    images: ["/og.png"],
  },
};

const principles = [
  { title: "Explain the limits", copy: "Customers should understand what a product can do, what it cannot do, and how to use it realistically.", icon: Scale },
  { title: "Start with the need", copy: "A phone charger, a portable battery, and a standby generator solve very different problems. We begin with yours.", icon: BookOpen },
  { title: "Support what we sell", copy: "SideKick is selected, stocked, sold, and supported by Admiral Energy—not presented as hardware we invented.", icon: ShieldCheck },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-admiral-navy py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div><p className="eyebrow">About Admiral Energy</p><h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">Practical energy resilience. Honest guidance.</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">Admiral Energy helps North Carolina families prepare for power disruptions without turning every conversation into an oversized sale.</p></div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-slate-100 shadow-2xl"><Image src="/images/david-edwards.jpg" alt="David Edwards, founder of Admiral Energy" fill priority loading="eager" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" /></div>
        </div>
      </section>

      <section className="py-20 md:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8"><div><Anchor className="h-10 w-10 text-admiral-gold" /><p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-admiral-gold">Veteran-owned</p><h2 className="mt-3 text-4xl font-black text-admiral-navy">Built to advise first.</h2></div><div className="space-y-6 text-lg leading-8 text-slate-600"><p>Founder David Edwards spent eight years in the U.S. Navy and six years in the intelligence community before entering North Carolina’s residential energy industry.</p><p>He saw homeowners being asked to make complicated, expensive decisions without enough clear explanation. Admiral Energy was created to take a more disciplined approach: understand the problem, explain the options, and recommend the right level of resilience.</p><p>Sometimes that first layer is a $69.99 SideKick. Sometimes it is a professionally installed whole-home standby system. Sometimes the honest answer is that you do not need anything Admiral sells today.</p></div></div></section>

      <section className="bg-[#e9edf0] py-20 md:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="eyebrow">What we stand for</p><h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">Education is part of the product.</h2></div><div className="mt-12 grid gap-5 md:grid-cols-3">{principles.map((principle) => <article key={principle.title} className="rounded-2xl bg-white p-7 shadow-sm"><principle.icon className="h-8 w-8 text-admiral-gold" /><h3 className="mt-6 text-xl font-black text-admiral-navy">{principle.title}</h3><p className="mt-3 leading-7 text-slate-600">{principle.copy}</p></article>)}</div></div></section>

      <section className="bg-white py-20 md:py-24"><div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8"><article className="rounded-3xl border border-slate-200 p-8"><MapPin className="h-8 w-8 text-admiral-gold" /><h2 className="mt-5 text-2xl font-black text-admiral-navy">Local business identity</h2><p className="mt-4 leading-7 text-slate-600">Admiral Energy LLC is based in Kings Mountain, North Carolina, with a service focus on North Carolina homeowners.</p><ul className="mt-5 grid gap-2 text-sm font-semibold text-slate-700"><li className="flex gap-2"><Check className="h-5 w-5 text-admiral-gold" />Veteran-owned</li><li className="flex gap-2"><Check className="h-5 w-5 text-admiral-gold" />Real contact information</li><li className="flex gap-2"><Check className="h-5 w-5 text-admiral-gold" />Published shipping, return, and warranty policies</li></ul></article><article className="rounded-3xl bg-admiral-navy p-8 text-white"><ShieldCheck className="h-8 w-8 text-admiral-gold" /><h2 className="mt-5 text-2xl font-black">Generac Aligned Contractor</h2><p className="mt-4 leading-7 text-slate-300">This credential supports Admiral Energy’s work helping homeowners explore professionally installed standby backup power.</p><p className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-300">SideKick is a separate Admiral Energy product offering. It is not manufactured, endorsed, or warrantied by Generac.</p></article></div></section>

      <section className="bg-admiral-gold py-16 text-admiral-navy"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div><h2 className="text-3xl font-black md:text-4xl">Start at the level that fits.</h2><p className="mt-2 text-lg">Portable personal power or a whole-home backup conversation.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/sidekick" className="inline-flex items-center justify-center gap-2 rounded-xl bg-admiral-navy px-6 py-3 font-extrabold text-white">Shop SideKick <ArrowRight className="h-4 w-4" /></Link><Link href="/home-backup" className="rounded-xl border border-admiral-navy/30 px-6 py-3 text-center font-bold">Explore Home Backup</Link></div></div></section>
    </>
  );
}
