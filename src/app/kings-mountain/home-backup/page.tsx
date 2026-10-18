import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Gauge,
  Home,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";
import { HomeBackupForm } from "@/components/LeadForms";
import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Backup Generator Planning in Kings Mountain, NC | Admiral Energy",
  description:
    "Explore standby generator options, sizing factors, transfer switches, installation considerations, and an initial Kings Mountain home-backup consultation.",
  alternates: { canonical: "/kings-mountain/home-backup" },
  openGraph: {
    title: "Backup Generator Planning in Kings Mountain, NC | Admiral Energy",
    description:
      "Plain-English standby generator planning for Kings Mountain homeowners, from a veteran-owned local business.",
    url: `${SITE_URL}/kings-mountain/home-backup`,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Admiral Energy home-backup planning in Kings Mountain, North Carolina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backup Generator Planning in Kings Mountain, NC | Admiral Energy",
    description: "A practical first step for Kings Mountain homeowners exploring standby power.",
    images: ["/og.png"],
  },
};

const affectedLoads = [
  ["Refrigeration", "Protect food storage by planning for running watts and compressor starting demand."],
  ["Well pumps", "Motor starting current and pump characteristics can materially affect system sizing."],
  ["Heating and cooling", "HVAC loads vary widely; equipment data and priorities matter."],
  ["Communications", "Internet equipment, phones, lighting, and security systems may be part of the essential-load plan."],
  ["Home offices", "A plan can account for the equipment and connectivity needed to keep work moving."],
] as const;

const priceFactors = [
  "Generator capacity and which loads you want to support",
  "Transfer-switch type and electrical-service configuration",
  "Site access, generator placement, pad, and required clearances",
  "Available fuel type, fuel-supply capacity, and connection work",
  "Electrical upgrades or load-management equipment",
  "Permits, inspections, licensed labor, and project-specific materials",
] as const;

const faqs = [
  {
    question: "Does Admiral Energy install generators directly?",
    answer:
      "Admiral Energy provides preliminary education and an initial consultation path. Required installation work, final electrical design, permits, and definitive proposals must be handled by properly licensed professionals.",
  },
  {
    question: "Is Admiral Energy a Generac dealer?",
    answer:
      "Admiral Energy's current, precise designation is Generac Aligned Contractor. We do not describe the business as an authorized dealer or independent licensed installer without separate verified documentation.",
  },
  {
    question: "Can a portable power station replace a standby generator?",
    answer:
      "They solve different problems. Portable systems can support selected compatible loads within their output and energy limits. A standby system is permanently connected through transfer equipment and is sized around the loads the homeowner plans to support.",
  },
  {
    question: "Can you quote a generator from the form alone?",
    answer:
      "No. The form starts an initial conversation. Accurate system selection and pricing require site- and load-specific review by appropriate licensed professionals.",
  },
  {
    question: "What area does this page cover?",
    answer:
      "This planning page is written for Kings Mountain and nearby Cleveland and Gaston County communities. Follow-up availability depends on the property location and appropriate licensed-professional coverage.",
  },
] as const;

export default function KingsMountainHomeBackupPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/kings-mountain/home-backup#service`,
    name: "Kings Mountain Home Backup Planning Consultation",
    description:
      "Preliminary home-backup education and an initial standby generator planning consultation for homeowners near Kings Mountain, North Carolina.",
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: "Initial home-backup planning consultation",
    areaServed: {
      "@type": "City",
      name: "Kings Mountain",
      containedInPlace: { "@type": "State", name: "North Carolina" },
    },
    url: `${SITE_URL}/kings-mountain/home-backup`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <section className="bg-admiral-navy py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8">
          <div>
            <p className="eyebrow">Kings Mountain home-backup planning</p>
            <h1 className="mt-5 text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">
              Explore Standby Generator Options in Kings Mountain, NC
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-200">
              Understand the equipment, load, site, and professional-installation decisions before you request a final proposal. Admiral Energy is a veteran-owned Kings Mountain business and a {BUSINESS.designation}.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#consultation"
                data-analytics-event="home_backup_cta_click"
                data-analytics-location="kings_mountain_hero"
                data-analytics-destination="/kings-mountain/home-backup#consultation"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-7 py-4 font-extrabold text-admiral-navy"
              >
                Request an Initial Consultation <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="/resources" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/30 px-7 py-4 font-bold text-white">
                Read Backup-Power Resources
              </Link>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 md:p-9">
            <MapPin className="h-10 w-10 text-admiral-gold" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-black">A local first conversation</h2>
            <p className="mt-4 leading-7 text-slate-300">
              This page focuses on Kings Mountain and surrounding Cleveland and Gaston County communities. It does not promise service coverage, a crew, a price, or an installation date.
            </p>
            <div className="mt-6 rounded-2xl bg-white/10 p-5">
              <p className="font-extrabold text-admiral-gold">Clear scope</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Admiral Energy can help organize the early conversation. Licensed professionals must handle final design, permitting, proposals, and required installation work.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Start with the loads</p>
            <h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">What needs power when the utility is unavailable?</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A useful plan begins with real priorities rather than a generic generator size. Running watts matter, but motors and compressors may also draw higher starting current.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {affectedLoads.map(([title, copy]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Zap className="h-7 w-7 text-admiral-gold" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-black text-admiral-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9edf0] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
              <Smartphone className="h-9 w-9 text-admiral-gold" aria-hidden="true" />
              <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-500">Portable personal or critical-load power</p>
              <h2 className="mt-3 text-3xl font-black text-admiral-navy">Flexible, limited, and manually managed</h2>
              <p className="mt-4 leading-7 text-slate-600">
                A phone power bank or portable power station can support compatible devices within its output and stored-energy limits. It must be charged, connected, and managed, and it does not become a whole-home system simply because it is portable.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 font-bold text-admiral-navy">
                <Link href="/sidekick" data-analytics-event="sidekick_referral_click" data-analytics-location="kings_mountain_comparison" data-analytics-destination="/sidekick" className="underline decoration-admiral-gold decoration-2 underline-offset-4">See personal power</Link>
                <Link href="/resources" className="underline decoration-admiral-gold decoration-2 underline-offset-4">Explore education</Link>
              </div>
            </article>
            <article className="rounded-3xl bg-admiral-navy p-7 text-white shadow-sm md:p-9">
              <Home className="h-9 w-9 text-admiral-gold" aria-hidden="true" />
              <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-admiral-gold">Permanently installed standby power</p>
              <h2 className="mt-3 text-3xl font-black">Designed around selected home loads</h2>
              <p className="mt-4 leading-7 text-slate-300">
                A standby generator is integrated with the home through transfer equipment. Capacity, fuel, electrical service, load management, placement, codes, and maintenance all belong in the professional design conversation.
              </p>
              <p className="mt-6 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
                Final equipment selection and installation require property-specific evaluation by appropriate licensed professionals.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <RefreshCw className="h-9 w-9 text-admiral-gold" aria-hidden="true" />
            <h2 className="mt-5 text-4xl font-black text-admiral-navy">What an automatic transfer switch does</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              In plain English, the transfer switch changes the home&apos;s connected load from the normal utility source to the standby source after the system detects an outage and the generator is ready. When utility power returns, it transfers the load back. The switch also keeps the utility and generator sources from feeding the load at the same time.
            </p>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Technical reference: Generac&apos;s official{` `}
              <a href="https://www.generac.com/residential-products/standby-generator-transfer-switches/automatic/" target="_blank" rel="noreferrer" className="font-semibold text-admiral-navy underline">
                automatic transfer switch overview
              </a>. Installation and service involve hazardous voltage and belong with qualified professionals.
            </p>
          </div>
          <div>
            <Gauge className="h-9 w-9 text-admiral-gold" aria-hidden="true" />
            <h2 className="mt-5 text-4xl font-black text-admiral-navy">Why sizing is more than adding labels</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The right capacity depends on which loads may run together, their steady demand, motor starting current, and whether load-management controls will be used. A well pump, compressor, or HVAC system can change the calculation even when its normal running demand looks modest.
            </p>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              An online worksheet can organize questions, but it is not a substitute for electrical data, site review, code requirements, and professional design.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-admiral-navy py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <CircleDollarSign className="h-10 w-10 text-admiral-gold" aria-hidden="true" />
            <h2 className="mt-5 text-4xl font-black">What affects installation pricing?</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              There is no responsible one-price answer before the system and site are understood. These are common scope drivers—not a quote.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {priceFactors.map((factor) => (
              <li key={factor} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-5 leading-7 text-slate-200">
                <Check className="mt-1 h-5 w-5 shrink-0 text-admiral-gold" aria-hidden="true" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">A measured first step</p>
            <h2 className="mt-4 text-4xl font-black text-admiral-navy md:text-5xl">How an initial consultation works</h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["1", "Share your priorities", "Tell us your ZIP code, homeowner status, timeframe, and the loads that matter most—without submitting a street address or detailed electrical inventory."],
              ["2", "Clarify the planning need", "Admiral Energy reviews the preliminary information and follows up about the situation, location, and sensible next step."],
              ["3", "Engage licensed expertise when appropriate", "If the project moves forward, properly licensed professionals handle required site assessment, final design, permits, proposal, and installation work."],
            ].map(([step, title, copy]) => (
              <li key={step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-admiral-navy font-black text-admiral-gold">{step}</span>
                <h3 className="mt-5 text-xl font-black text-admiral-navy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="consultation" className="scroll-mt-28 bg-[#e9edf0] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <Wrench className="h-10 w-10 text-admiral-gold" aria-hidden="true" />
            <p className="eyebrow mt-6">Initial home-backup consultation</p>
            <h2 className="mt-4 text-4xl font-black text-admiral-navy">Start with a short, useful request.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The form collects only the information needed to begin. It does not enroll you in marketing unless you separately opt in, and information is not automatically shared with an installation partner.
            </p>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              <p className="font-black">No installation promise</p>
              <p className="mt-2">Submission is not a contract, quote, service guarantee, or confirmation that licensed coverage is available at your property.</p>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <HomeBackupForm formLocation="kings_mountain_home_backup" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-9 w-9 shrink-0 text-admiral-gold" aria-hidden="true" />
            <div>
              <p className="eyebrow">Straight answers</p>
              <h2 className="mt-3 text-4xl font-black text-admiral-navy">Kings Mountain home-backup FAQ</h2>
            </div>
          </div>
          <div className="mt-9 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <summary className="cursor-pointer font-black text-admiral-navy">{faq.question}</summary>
                <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm leading-6 text-slate-500">
            Looking for broader, non-local service information? Visit the{` `}
            <Link href="/home-backup" className="font-semibold text-admiral-navy underline">regional home-backup overview</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
