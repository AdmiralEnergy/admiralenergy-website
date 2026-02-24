import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Mail, ArrowRight, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Admiral Energy order has been placed successfully.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <>
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success icon */}
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-admiral-navy mb-4">
            Order Confirmed!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order is being processed and
            you&apos;ll receive a shipping confirmation email within 24 hours.
          </p>

          {/* What happens next */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left">
            <h2 className="text-xl font-semibold text-admiral-navy mb-4">
              What happens next?
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-admiral-navy text-white text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium text-gray-900">Order confirmation</p>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive an email receipt from Stripe shortly.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-admiral-navy text-white text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium text-gray-900">Shipping notification</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll send tracking information within 1–2 business days.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-admiral-navy text-white text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium text-gray-900">Delivery</p>
                  <p className="text-sm text-gray-600">
                    Estimated delivery: 5–10 business days (free shipping to US addresses).
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Support */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-admiral-navy mb-2">
              Need help with your order?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
              <a
                href="mailto:info@admiralenergy.ai"
                className="inline-flex items-center gap-2 text-admiral-navy hover:text-admiral-gold transition-colors"
              >
                <Mail className="w-4 h-4" /> info@admiralenergy.ai
              </a>
              <a
                href="tel:+19842384187"
                className="inline-flex items-center gap-2 text-admiral-navy hover:text-admiral-gold transition-colors"
              >
                <Phone className="w-4 h-4" /> (984) 238-4187
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-admiral-gold text-admiral-navy px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2 justify-center"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="bg-white text-admiral-navy px-6 py-3 rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors inline-flex items-center gap-2 justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
