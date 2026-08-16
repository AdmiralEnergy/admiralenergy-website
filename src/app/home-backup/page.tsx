import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Baby, Briefcase, Check, HeartPulse, Refrigerator, ShieldCheck, ThermometerSun, Waves } from "lucide-react";
import { HomeBackupForm } from "@/components/LeadForms";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Generac Home Standby Generator Assessment | North Carolina",
  description: "Explore professionally installed whole-home backup with Admiral Energy, a Generac Aligned Contractor serving the Charlotte and Kings Mountain, NC area.",
  keywords: ["Generac installer", "home standby generator", "whole home generator", "backup power", "home backup power", "generator installation North Carolina"],
  alternates: { canonical: "/home-backup" },
  openGraph: {
    title: "When a Power Bank Isn’t Enough | Admiral Energy",
    description: "Start a practical whole-home backup conversation with a North Carolina Generac Aligned Contractor.",
    url: `${SITE_URL}/home-backup`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Whole-Home Backup | Admiral Energy",
    description: "A short, no-pressure home backup assessment for North Carolina homeowners.",
  },
};

const needs = [
  { title: "Refrigeration", copy: "Keep food, medication, and essentials cold through longer outages.", icon: Refrigerator },
  { title: "Medical equipment", copy: "Plan for devices that cannot simply wait for utility restoration.", icon: HeartPulse },
  { title: "Home office", copy: "Protect the connection and equipment your work depends on.", icon: Briefcase },
  { title: "Well pumps", copy: "Consider the power demands behind continued access to household water.", icon: Waves },
  { title: "HVAC", copy: "Support comfort and safety during high-heat or cold-weather outages.", icon: ThermometerSun },
  { title: "Family needs", copy: "Reduce disruption for young children, older relatives, and busy households.", icon: Baby },
];

export default function HomeBackupPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Backup Power Assessment",
    provider: { "@type": "Organization", name: "Admiral Energy LLC", url: SITE_URL },
    areaServed: { "@type": "State", name: "North Carolina" },
    serviceType: "Home standby generator assessment",
    url: `${SITE_URL}/home-backup`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="bg-admiral-navy py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8">
          <div><p className="eyebrow">Whole-home resilience</p><h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">When a Power Bank Isn’t Enough.</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">SideKick keeps personal electronics within reach. A professionally installed standby system is designed for larger loads, longer outages, and the parts of home life you cannot put on pause.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="#assessment" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-7 py-4 font-extrabold text-admiral-navy">Request a Home Backup Assessment <ArrowRight className="h-5 w-5" /></Link><Link href="/sidekick" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/30 px-7 py-4 font-bold">Start with SideKick</Link></div></div>
          <aside className="rounded-3xl border border-white/15 bg-white/5 p-7 md:p-9"><ShieldCheck className="h-10 w-10 text-admiral-gold" /><p className="mt-7 text-sm font-extrabold uppercase tracking-[0.15em] text-admiral-gold">Trust signal</p><h2 className="mt-2 text-3xl font-black">Generac Aligned Contractor</h2><p className="mt-4 leading-7 text-slate-300">Admiral Energy helps homeowners explore professionally installed standby backup power solutions. This credential applies to the home-backup service—not to SideKick.</p><p className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-300">SideKick is an Admiral Energy product offering and is not manufactured, endorsed, or warrantied by Generac.</p></aside>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="eyebrow">Is it time to look further?</p><h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">Start with what you need to keep running.</h2><p className="mt-5 text-lg leading-8 text-slate-600">A good assessment begins with your household—not with a one-size-fits-all equipment pitch.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{needs.map((need) => <article key={need.title} className="rounded-2xl border border-slate-200 bg-white p-6"><need.icon className="h-8 w-8 text-admiral-gold" /><h3 className="mt-5 text-xl font-black text-admiral-navy">{need.title}</h3><p className="mt-3 leading-7 text-slate-600">{need.copy}</p></article>)}</div></div>
      </section>

      <section className="bg-[#e9edf0] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8"><div><p className="eyebrow">How the conversation works</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Short form. Real conversation. Clear next step.</h2><p className="mt-5 text-lg leading-8 text-slate-600">The goal is not to force you through a giant questionnaire. It is to understand the outage risks that matter at your home.</p></div><ol className="grid gap-4">{[["1", "Tell us the essentials", "Share your ZIP code and what you most want to keep powered."], ["2", "Talk through the situation", "Admiral Energy follows up to understand your home, priorities, and outage history."], ["3", "Decide whether to go further", "If standby power makes sense, the next step is a professional assessment and proposal."]].map(([step, title, copy]) => <li key={step} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admiral-navy font-black text-admiral-gold">{step}</span><div><h3 className="text-lg font-black text-admiral-navy">{title}</h3><p className="mt-2 leading-7 text-slate-600">{copy}</p></div></li>)}</ol></div>
      </section>

      <section id="assessment" className="scroll-mt-28 bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8"><div><p className="eyebrow">Home backup assessment</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Start the conversation.</h2><p className="mt-5 leading-7 text-slate-600">No pitch. No obligation. Tell us what you want to protect and Admiral Energy will help you understand the next sensible step.</p><ul className="mt-7 grid gap-3 text-sm font-semibold text-slate-700">{["Focused on your actual loads", "North Carolina service context", "Professionally installed solutions", "No account required"].map((item) => <li key={item} className="flex gap-2"><Check className="h-5 w-5 text-admiral-gold" />{item}</li>)}</ul></div><HomeBackupForm /></div>
      </section>

      <section className="bg-admiral-gold py-14 text-admiral-navy"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div><p className="text-sm font-extrabold uppercase tracking-[0.14em]">Questions before the form?</p><h2 className="mt-2 text-3xl font-black">Talk directly with Admiral Energy.</h2></div><div className="flex flex-col gap-2 font-bold sm:flex-row sm:gap-6"><a href="tel:+19842384187">(984) 238-4187</a><a href="mailto:david@admiralenergy.ai">david@admiralenergy.ai</a></div></div></section>
    </>
  );
}
