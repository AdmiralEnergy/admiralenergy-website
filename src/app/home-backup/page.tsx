import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Check, Lightbulb, Refrigerator, ShieldCheck, ThermometerSun, Waves } from "lucide-react";
import { HomeBackupForm } from "@/components/LeadForms";
import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home Backup Planning & Initial Assessment | Admiral Energy",
  description: "Learn how standby generator planning works and submit a short initial home-backup assessment. Licensed professionals handle final design, permits, proposals, and installation.",
  alternates: { canonical: "/home-backup" },
  openGraph: {
    title: "Home Backup Planning & Initial Assessment | Admiral Energy",
    description: "Start a practical home-backup planning conversation with Admiral Energy, a Generac Aligned Contractor.",
    url: `${SITE_URL}/home-backup`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Admiral Energy whole-home backup assessment" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Backup Planning & Initial Assessment | Admiral Energy",
    description: "A short, transparent first step for homeowners exploring professionally installed standby power.",
    images: ["/og.png"],
  },
};

const needs = [
  { title: "Refrigeration", copy: "Keep food, medication, and essentials cold through longer outages.", icon: Refrigerator },
  { title: "Lighting and communication", copy: "Identify the circuits and devices that help the household stay connected and move safely.", icon: Lightbulb },
  { title: "Home office", copy: "Protect the connection and equipment your work depends on.", icon: Briefcase },
  { title: "Well pumps", copy: "Consider the power demands behind continued access to household water.", icon: Waves },
  { title: "HVAC", copy: "Support comfort and safety during high-heat or cold-weather outages.", icon: ThermometerSun },
  { title: "Household routines", copy: "Prioritize the loads that make an extended disruption more manageable for your household.", icon: Lightbulb },
];

export default function HomeBackupPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Backup Power Assessment",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "City", name: "Kings Mountain", containedInPlace: { "@type": "State", name: "North Carolina" } },
    serviceType: "Initial home-backup planning assessment",
    url: `${SITE_URL}/home-backup`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      <section className="bg-admiral-navy py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8">
          <div><p className="eyebrow">Home-backup planning</p><h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">When Personal Power Isn’t Enough.</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200">SideKick keeps compatible personal electronics within reach. A professionally installed standby system serves a different job: supporting selected home loads through an integrated, property-specific design.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="#assessment" data-analytics-event="home_backup_cta_click" data-analytics-location="regional_home_backup_hero" data-analytics-destination="/home-backup#assessment" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-7 py-4 font-extrabold text-admiral-navy">Request an Initial Assessment <ArrowRight className="h-5 w-5" /></Link><Link href="/kings-mountain/home-backup" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/30 px-7 py-4 font-bold">Kings Mountain Planning Guide</Link></div></div>
          <aside className="rounded-3xl border border-white/15 bg-white/5 p-7 md:p-9"><ShieldCheck className="h-10 w-10 text-admiral-gold" /><p className="mt-7 text-sm font-extrabold uppercase tracking-[0.15em] text-admiral-gold">Precise designation</p><h2 className="mt-2 text-3xl font-black">{BUSINESS.designation}</h2><p className="mt-4 leading-7 text-slate-300">Admiral Energy provides preliminary education and consultation follow-up. Properly licensed professionals must handle final electrical design, permits, definitive proposals, and required installation work.</p><p className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-300">SideKick is a separate Admiral Energy product offering and is not manufactured, endorsed, or warrantied by Generac.</p></aside>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="eyebrow">Is it time to look further?</p><h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">Start with what you need to keep running.</h2><p className="mt-5 text-lg leading-8 text-slate-600">A good assessment begins with your household—not with a one-size-fits-all equipment pitch.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{needs.map((need) => <article key={need.title} className="rounded-2xl border border-slate-200 bg-white p-6"><need.icon className="h-8 w-8 text-admiral-gold" /><h3 className="mt-5 text-xl font-black text-admiral-navy">{need.title}</h3><p className="mt-3 leading-7 text-slate-600">{need.copy}</p></article>)}</div></div>
      </section>

      <section className="bg-[#e9edf0] py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8"><div><p className="eyebrow">How the conversation works</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Short form. Real conversation. Clear boundary.</h2><p className="mt-5 text-lg leading-8 text-slate-600">The goal is to understand the planning need without collecting a street address, detailed electrical inventory, or other sensitive information at first contact.</p></div><ol className="grid gap-4">{[["1", "Tell us the essentials", "Share your ZIP code, timeframe, and the backup priority that matters most."], ["2", "Clarify the situation", "Admiral Energy follows up about your goals, location, and the sensible next step."], ["3", "Bring in licensed expertise", "If a project moves forward, appropriately licensed professionals handle site review, final design, permits, proposal, and installation."]].map(([step, title, copy]) => <li key={step} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-admiral-navy font-black text-admiral-gold">{step}</span><div><h3 className="text-lg font-black text-admiral-navy">{title}</h3><p className="mt-2 leading-7 text-slate-600">{copy}</p></div></li>)}</ol></div>
      </section>

      <section id="assessment" className="scroll-mt-28 bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8"><div><p className="eyebrow">Home backup assessment</p><h2 className="mt-4 text-4xl font-black text-admiral-navy">Start the conversation.</h2><p className="mt-5 leading-7 text-slate-600">No obligation and no installation promise. Tell us the priority you want to plan around, and Admiral Energy will help identify a sensible next step.</p><ul className="mt-7 grid gap-3 text-sm font-semibold text-slate-700">{["Focused on practical load priorities", "Service availability confirmed during follow-up", "Licensed professionals for required work", "No account required"].map((item) => <li key={item} className="flex gap-2"><Check className="h-5 w-5 text-admiral-gold" />{item}</li>)}</ul></div><HomeBackupForm formLocation="regional_home_backup" /></div>
      </section>

      <section className="bg-admiral-gold py-14 text-admiral-navy"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div><p className="text-sm font-extrabold uppercase tracking-[0.14em]">Questions before the form?</p><h2 className="mt-2 text-3xl font-black">Talk directly with Admiral Energy.</h2></div><div className="flex flex-col gap-2 font-bold sm:flex-row sm:gap-6"><a href={BUSINESS.contact.phoneHref}>{BUSINESS.contact.phoneDisplay}</a><a href={BUSINESS.contact.emailHref}>{BUSINESS.contact.email}</a></div></div></section>
    </>
  );
}
