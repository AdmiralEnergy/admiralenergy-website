import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { ArrowRight, CheckCircle, Mail, Phone, ShieldAlert } from "lucide-react";
import PurchaseEvent from "@/components/sidekick/PurchaseEvent";
import PostPurchaseExperience from "@/components/PostPurchaseExperience";
import { commercePolicies } from "@/data/commerce";
import { getProductById } from "@/data/products";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Verify your Admiral Energy order status.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

interface VerifiedOrder {
  transactionId: string;
  value: number;
  quantity: number;
  productId: string;
  productName: string;
}

async function getVerifiedOrder(sessionId: string | undefined): Promise<VerifiedOrder | null> {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2026-01-28.clover" });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.status !== "complete" || session.payment_status !== "paid") return null;

    const productId = session.metadata?.product_id || "hs-43-solar-power-bank";
    const product = getProductById(productId);
    const quantity =
      session.line_items?.data.reduce((total, item) => total + (item.quantity || 0), 0) || 1;

    return {
      transactionId: session.id,
      value: (session.amount_total || 0) / 100,
      quantity,
      productId,
      productName: product?.name || "Admiral Energy product",
    };
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const order = await getVerifiedOrder(sessionId);

  if (!order) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <ShieldAlert className="h-10 w-10 text-amber-700" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-admiral-navy md:text-4xl">
            We could not verify an order from this page.
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            If you completed payment, check for your Stripe confirmation and contact Admiral Energy
            with the email address used at checkout. We will help confirm the order.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={BUSINESS.contact.emailHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-admiral-navy px-6 py-3 font-bold text-white">
              <Mail className="h-4 w-4" /> Email support
            </a>
            <Link href="/sidekick" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-admiral-navy">
              Return to SideKick
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PurchaseEvent {...order} />
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-700" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-admiral-navy md:text-4xl">Order confirmed.</h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Thank you for choosing Admiral Energy. Your paid Stripe checkout was verified, and the
            order will now move into processing.
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left sm:p-8">
            <h2 className="text-xl font-black text-admiral-navy">What happens next?</h2>
            <ol className="mt-5 space-y-5">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-admiral-navy text-sm font-bold text-white">1</span>
                <div><p className="font-bold text-gray-900">Keep your Stripe confirmation</p><p className="mt-1 text-sm leading-6 text-gray-600">It contains the payment record for this checkout.</p></div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-admiral-navy text-sm font-bold text-white">2</span>
                <div><p className="font-bold text-gray-900">Order processing</p><p className="mt-1 text-sm leading-6 text-gray-600">The published processing window is {commercePolicies.shipping.processing}.</p></div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-admiral-navy text-sm font-bold text-white">3</span>
                <div><p className="font-bold text-gray-900">Tracking and delivery</p><p className="mt-1 text-sm leading-6 text-gray-600">Tracking is sent after shipment. Standard shipping is listed as {commercePolicies.shipping.transit}.</p></div>
              </li>
            </ol>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="font-black text-admiral-navy">Need help with your order?</h2>
            <div className="mt-3 flex flex-col justify-center gap-3 text-sm sm:flex-row sm:gap-5">
              <a href={BUSINESS.contact.emailHref} className="inline-flex items-center justify-center gap-2 font-semibold text-admiral-navy"><Mail className="h-4 w-4" /> {BUSINESS.contact.email}</a>
              <a href={BUSINESS.contact.phoneHref} className="inline-flex items-center justify-center gap-2 font-semibold text-admiral-navy"><Phone className="h-4 w-4" /> {BUSINESS.contact.phoneDisplay}</a>
            </div>
          </div>

          <div className="mt-8">
            <PostPurchaseExperience sessionId={order.transactionId} />
          </div>

          <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-3 font-black text-admiral-navy">
            Return to Admiral Energy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
