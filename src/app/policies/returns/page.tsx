import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Admiral Energy return and refund policy — 30-day returns, no restocking fees.",
};

export default function ReturnsPage() {
  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h1>Return Policy</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>30-Day Satisfaction Guarantee</h2>
        <p>If you&apos;re not satisfied with your purchase, you may return it within 30 days of delivery for a full refund.</p>

        <h2>Return Conditions</h2>
        <ul>
          <li>Items must be in original packaging, undamaged, and in resalable condition.</li>
          <li>Include all original accessories, manuals, and cables.</li>
          <li>Products showing signs of misuse, physical damage, or modification are not eligible for return.</li>
        </ul>

        <h2>How to Initiate a Return</h2>
        <ol>
          <li>Email <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a> with your order number and reason for return.</li>
          <li>We&apos;ll provide a prepaid return shipping label within 24 hours.</li>
          <li>Pack the item securely and drop it off at the designated carrier.</li>
          <li>Refund is processed within 5-7 business days of receiving the return.</li>
        </ol>

        <h2>Restocking Fees</h2>
        <p><strong>None.</strong> We don&apos;t charge restocking fees. Your refund is for the full purchase price.</p>

        <h2>Return Shipping</h2>
        <p>For standard returns (change of mind), we provide a prepaid label — return shipping is free. For defective or damaged products, we cover all return costs.</p>

        <h2>Exchanges</h2>
        <p>We don&apos;t process direct exchanges. Return the original item for a refund and place a new order for the desired product.</p>

        <h2>Questions?</h2>
        <p>Email us at <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a> or call <a href="tel:+19842384187">(984) 238-4187</a>.</p>
      </div>
    </article>
  );
}
