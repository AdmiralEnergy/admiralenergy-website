import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Cable, CheckCircle, RotateCcw, Smartphone, Sun } from "lucide-react";
import { EmailCapture } from "@/components/LeadForms";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Power Outage & Emergency Charging Resources",
  description: "Practical guides to emergency phone charging, solar power banks, hand-crank charging, storm preparation, and whole-home backup decisions.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Power Outage & Emergency Charging Resources",
    description: "Honest guides to portable charging, storm preparation, battery backup, and whole-home resilience.",
    url: `${SITE_URL}/resources`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Admiral Energy backup power resources" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Power Outage & Emergency Charging Resources",
    description: "Practical guidance for keeping phones charged and choosing the right layer of backup power.",
    images: ["/og.png"],
  },
};

const guides = [
  {
    title: "How to Keep Your Phone Charged During a Power Outage",
    description: "A practical plan for charging early, conserving battery, and keeping more than one backup method available.",
    href: "/blog/keep-phone-charged-during-power-outage",
    category: "Emergency charging",
    icon: Smartphone,
  },
  {
    title: "How Solar Power Banks Work",
    description: "Learn why wired charging comes first and what a small integrated solar panel can realistically add.",
    href: "/blog/how-solar-power-banks-work",
    category: "Portable power",
    icon: Sun,
  },
  {
    title: "Hand-Crank Power Banks: Uses and Limits",
    description: "Understand when manual charging is useful, what it cannot replace, and how to plan around it.",
    href: "/blog/hand-crank-power-bank-guide",
    category: "Emergency charging",
    icon: RotateCcw,
  },
  {
    title: "NC Storm Prep Checklist",
    description: "Prepare communication, supplies, and backup power before severe weather reaches North Carolina.",
    href: "/blog/nc-storm-prep-checklist",
    category: "Preparedness",
    icon: CheckCircle,
  },
  {
    title: "Solar + Battery Backup Explained",
    description: "Understand why ordinary grid-tied solar shuts down during an outage and how battery backup changes the system.",
    href: "/blog/powerpair-solar-battery-explained",
    category: "Whole-home backup",
    icon: BatteryCharging,
  },
] as const;

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-admiral-navy py-20 text-white md:py-24"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"><p className="eyebrow">Admiral Energy resources</p><h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">Prepare with facts, not fear.</h1><p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-300">Clear guidance for the layers between a charged phone and a resilient home.</p></div></section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl"><p className="eyebrow">Practical guides</p><h2 className="mt-4 text-4xl font-black tracking-tight text-admiral-navy md:text-5xl">Choose the question you need answered.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Each guide explains one decision clearly, including the limits that generic product pages often leave out.</p></div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.href} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <guide.icon className="h-9 w-9 text-admiral-gold" />
                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.14em] text-admiral-gold">{guide.category}</p>
                <h3 className="mt-2 text-2xl font-black text-admiral-navy">{guide.title}</h3>
                <p className="mt-4 flex-1 leading-7 text-slate-600">{guide.description}</p>
                <Link href={guide.href} className="mt-6 inline-flex items-center gap-2 font-extrabold text-admiral-navy">Read the guide <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9edf0] py-20 md:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="eyebrow">SideKick charging guide</p><h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">Use the right charging method.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Transparent expectations help you depend on the product appropriately.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{[[Cable, "Wired USB", "Use wired charging as the primary way to recharge SideKick."], [Sun, "Integrated solar", "Treat the small panel as slow, supplemental input in useful sunlight."], [RotateCcw, "Hand crank", "Reserve manual generation for last-resort emergency input."]].map(([Icon, title, copy]) => { const GuideIcon = Icon as typeof Cable; return <article key={title as string} className="rounded-2xl bg-white p-7"><GuideIcon className="h-8 w-8 text-admiral-gold" /><h3 className="mt-5 text-xl font-black text-admiral-navy">{title as string}</h3><p className="mt-3 leading-7 text-slate-600">{copy as string}</p></article>; })}</div></div></section>

      <section className="py-20"><div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8"><div><p className="eyebrow">Get the free checklist</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Join the Admiral Resilience List.</h2><p className="mt-5 leading-7 text-slate-600">Get outage-preparation reminders, SideKick updates, and honest home-backup education in your inbox.</p></div><EmailCapture source="resources" /></div></section>

      <section className="bg-admiral-navy py-14 text-white"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div><CheckCircle className="h-8 w-8 text-admiral-gold" /><h2 className="mt-4 text-3xl font-black">Ready to choose a next step?</h2><p className="mt-2 text-slate-300">Start portable or explore whole-home backup.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/sidekick" className="rounded-xl bg-admiral-gold px-6 py-3 text-center font-extrabold text-admiral-navy">Shop SideKick</Link><Link href="/home-backup" className="rounded-xl border border-white/30 px-6 py-3 text-center font-bold">Home Backup</Link></div></div></section>
    </>
  );
}
