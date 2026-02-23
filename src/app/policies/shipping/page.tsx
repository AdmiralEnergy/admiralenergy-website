import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Admiral Energy shipping information — free shipping, processing times, and delivery details.",
};

export default function ShippingPage() {
  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h1>Shipping Policy</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>Free Shipping</h2>
        <p>All orders within the continental United States ship free. No minimums, no hidden fees.</p>

        <h2>Processing Time</h2>
        <p>Orders are processed within 1-2 business days. You&apos;ll receive a tracking number via email once your order ships.</p>

        <h2>Delivery Timeframe</h2>
        <ul>
          <li><strong>Standard Shipping:</strong> 5-7 business days</li>
          <li><strong>Expedited Shipping:</strong> 2-3 business days (available at checkout for an additional fee)</li>
        </ul>

        <h2>Shipping Carriers</h2>
        <p>We ship via UPS, FedEx, or USPS depending on package size and destination. Carrier selection is made at our discretion to ensure the fastest, safest delivery.</p>

        <h2>P.O. Boxes</h2>
        <p>We can ship smaller items (under 5 lbs) to P.O. boxes. Larger items like power stations require a street address.</p>

        <h2>Damages in Transit</h2>
        <p>If your order arrives damaged, contact us within 48 hours at <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a> with photos of the damage. We&apos;ll arrange a replacement at no cost.</p>

        <h2>Questions?</h2>
        <p>Email us at <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a> or call <a href="tel:+19842384187">(984) 238-4187</a>.</p>
      </div>
    </article>
  );
}
