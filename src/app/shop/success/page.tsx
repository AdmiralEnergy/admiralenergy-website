import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Mail, PackageCheck, Truck } from "lucide-react";
import PostPurchaseExperience from "@/components/PostPurchaseExperience";

export const metadata: Metadata = {
  title: "SideKick Order Confirmed",
  description: "Your Admiral Energy SideKick order has been placed.",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"><CheckCircle className="h-10 w-10 text-emerald-700" /></div>
        <h1 className="mt-7 text-4xl font-black text-admiral-navy md:text-5xl">Your SideKick order is confirmed.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Thank you for choosing Admiral Energy. Stripe will send your payment receipt, and Admiral Energy will send tracking after the order ships.</p>

        <div className="my-10 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Mail className="h-6 w-6 text-admiral-gold" /><h2 className="mt-4 font-black text-admiral-navy">Receipt</h2><p className="mt-2 text-sm leading-6 text-slate-600">Sent to the email used at checkout.</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><PackageCheck className="h-6 w-6 text-admiral-gold" /><h2 className="mt-4 font-black text-admiral-navy">Processing</h2><p className="mt-2 text-sm leading-6 text-slate-600">Normally 1–2 business days.</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><Truck className="h-6 w-6 text-admiral-gold" /><h2 className="mt-4 font-black text-admiral-navy">Delivery</h2><p className="mt-2 text-sm leading-6 text-slate-600">Estimated 5–7 business days after processing.</p></div>
        </div>

        <PostPurchaseExperience sessionId={sessionId} />

        <div className="mt-8 rounded-2xl bg-admiral-navy p-6 text-white"><h2 className="text-xl font-black">Need order help?</h2><p className="mt-2 text-slate-300">Email <a href="mailto:david@admiralenergy.ai" className="font-bold text-admiral-gold">david@admiralenergy.ai</a> or call <a href="tel:+19842384187" className="font-bold text-admiral-gold">(984) 238-4187</a>.</p></div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/resources" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-3 font-extrabold text-admiral-navy">Read Backup Guides <ArrowRight className="h-4 w-4" /></Link><Link href="/home-backup" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-bold text-admiral-navy">Explore Home Backup</Link></div>
      </div>
    </section>
  );
}
