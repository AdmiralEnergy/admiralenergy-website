import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Check, Home, ShieldCheck, ShoppingBag, Smartphone, Wrench, Zap } from "lucide-react";
import { EmailCapture } from "@/components/LeadForms";

export const metadata: Metadata = {
  title: "Home Energy Resilience | SideKick & Whole-Home Backup",
  description: "Start with the SideKick PowerBank for personal portable backup, or talk with Admiral Energy about Generac whole-home standby power in North Carolina.",
  alternates: { canonical: "/" },
};

const ladder = [
  { level: "Level 1", title: "Personal Power", copy: "SideKick keeps phones, small USB devices, and lighting within reach.", icon: Smartphone },
  { level: "Level 2", title: "Critical Power", copy: "Larger portable batteries can cover selected essentials. We explain the category without overselling it.", icon: BatteryCharging },
  { level: "Level 3", title: "Whole-Home Power", copy: "A professionally installed standby system is built for larger, longer resilience needs.", icon: Home },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-admiral-navy text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#d4b85c_0,transparent_34%),radial-gradient(circle_at_80%_85%,#1a4a6e_0,transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow">Home energy resilience, made practical</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Power Starts Small. <span className="text-admiral-gold">Resilience Goes Further.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Admiral Energy helps you prepare for power disruptions—starting with a SideKick you can carry every day and extending to professionally installed whole-home backup.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sidekick#buy" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-7 py-4 text-base font-extrabold text-admiral-navy transition hover:bg-gold-light">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" /> Shop SideKick — $69.99
              </Link>
              <Link href="/home-backup" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-4 text-base font-bold text-white transition hover:border-white hover:bg-white hover:text-admiral-navy">
                Explore Whole-Home Backup <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-8 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-admiral-gold" /> Real product photos</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-admiral-gold" /> Clear policies</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-admiral-gold" /> North Carolina support</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-admiral-gold/15 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl">
              <Image src="/images/sidekick/hero-real-20260812.webp" alt="SideKick PowerBank standing beside its box" fill priority loading="eager" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-[#071f31]/92 p-5 shadow-xl backdrop-blur">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-admiral-gold">Your first layer of backup power</p><p className="mt-1 text-xl font-black">SideKick PowerBank</p></div>
                  <p className="text-2xl font-black text-admiral-gold">$69.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Trust signals" className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 text-center sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex items-center justify-center gap-3"><ShieldCheck className="h-7 w-7 text-admiral-gold" /><div className="text-left"><p className="font-extrabold text-admiral-navy">Generac Aligned Contractor</p><p className="text-sm text-slate-500">For professionally installed standby solutions</p></div></div>
          <div className="flex items-center justify-center gap-3"><Wrench className="h-7 w-7 text-admiral-gold" /><div className="text-left"><p className="font-extrabold text-admiral-navy">Veteran-owned, local guidance</p><p className="text-sm text-slate-500">Based in Kings Mountain, North Carolina</p></div></div>
          <div className="flex items-center justify-center gap-3"><Zap className="h-7 w-7 text-admiral-gold" /><div className="text-left"><p className="font-extrabold text-admiral-navy">Education before hype</p><p className="text-sm text-slate-500">Clear uses, limits, and next steps</p></div></div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Two clear ways to start</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-admiral-navy md:text-5xl">What kind of backup do you need?</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Personal power and whole-home power solve different problems. Admiral Energy helps you choose the right level.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100"><Image src="/images/sidekick/cables-real-20260812.webp" alt="Built-in charging cables on the SideKick PowerBank" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /></div>
              <div className="p-7 md:p-9"><p className="eyebrow">Buy today</p><h3 className="mt-3 text-3xl font-black text-admiral-navy">SideKick PowerBank</h3><p className="mt-4 leading-7 text-slate-600">Portable backup for phones and compatible small USB devices—with cables, lighting, and emergency recharge options already built in.</p><Link href="/sidekick" className="mt-6 inline-flex items-center gap-2 font-extrabold text-admiral-navy underline decoration-admiral-gold decoration-2 underline-offset-4">See SideKick <ArrowRight className="h-4 w-4" /></Link></div>
            </article>
            <article className="rounded-3xl bg-admiral-navy p-7 text-white shadow-sm md:p-9 lg:flex lg:flex-col lg:justify-between">
              <div><p className="eyebrow">Start a conversation</p><h3 className="mt-3 text-3xl font-black">Whole-home standby power</h3><p className="mt-4 text-lg leading-8 text-slate-200">When refrigeration, medical equipment, a well pump, HVAC, or your home office cannot wait, it may be time to assess a standby system.</p><ul className="mt-7 grid gap-3 text-slate-200 sm:grid-cols-2">{["Short assessment form", "No giant questionnaire", "North Carolina service", "Generac Aligned Contractor"].map((item) => <li key={item} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-admiral-gold" />{item}</li>)}</ul></div>
              <Link href="/home-backup#assessment" className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-3 font-extrabold text-admiral-navy">Request an Assessment <ArrowRight className="h-5 w-5" /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#e9edf0] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div><p className="eyebrow">The resilience ladder</p><h2 className="mt-4 text-4xl font-black tracking-tight text-admiral-navy md:text-5xl">Build the right layer. Then build on it.</h2><p className="mt-5 text-lg leading-8 text-slate-600">SideKick and a standby generator belong on the same website because resilience is not one-size-fits-all.</p></div>
            <div className="grid gap-4 md:grid-cols-3">
              {ladder.map((item, index) => <article key={item.level} className={`rounded-2xl p-6 ${index === 2 ? "bg-admiral-navy text-white" : "bg-white text-slate-900"}`}><item.icon className="h-8 w-8 text-admiral-gold" /><p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-admiral-gold">{item.level}</p><h3 className={`mt-2 text-xl font-black ${index === 2 ? "text-white" : "text-admiral-navy"}`}>{item.title}</h3><p className={`mt-3 text-sm leading-6 ${index === 2 ? "text-slate-300" : "text-slate-600"}`}>{item.copy}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-3xl bg-white px-6 py-10 shadow-sm ring-1 ring-slate-200 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-14">
          <div><p className="eyebrow">Free practical guide</p><h2 className="mt-4 text-3xl font-black text-admiral-navy">Join the Admiral Resilience List</h2><p className="mt-4 leading-7 text-slate-600">Get the backup-power checklist, outage-preparation tips, SideKick updates, and straightforward home-backup education.</p></div>
          <EmailCapture source="homepage" />
        </div>
      </section>

      <section className="bg-admiral-gold py-16 text-admiral-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><h2 className="text-3xl font-black md:text-4xl">Start with the power you’ll actually keep close.</h2><p className="mt-2 text-lg">SideKick is in stock at $69.99 with free standard shipping.</p></div>
          <Link href="/sidekick#buy" className="inline-flex min-h-14 shrink-0 items-center gap-2 rounded-xl bg-admiral-navy px-7 py-4 font-extrabold text-white">Get Your SideKick <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>
    </>
  );
}
