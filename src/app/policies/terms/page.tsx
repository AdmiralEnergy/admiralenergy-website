import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Admiral Energy terms of service governing use of our website and purchases.",
};

export default function TermsPage() {
  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h1>Terms of Service</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>Agreement to Terms</h2>
        <p>By accessing admiralenergy.ai or making a purchase, you agree to these terms. If you don&apos;t agree, please don&apos;t use our website or services.</p>

        <h2>Products & Pricing</h2>
        <ul>
          <li>All prices are in USD and include applicable taxes where required.</li>
          <li>We reserve the right to change prices without notice.</li>
          <li>Product descriptions and specifications are provided in good faith but may contain errors. Contact us if you need clarification before purchasing.</li>
          <li>Images are representative and may differ slightly from actual products.</li>
        </ul>

        <h2>Orders & Payment</h2>
        <ul>
          <li>Orders are processed through Snipcart, our secure payment processor.</li>
          <li>We accept major credit cards and PayPal.</li>
          <li>We reserve the right to refuse or cancel orders at our discretion.</li>
          <li>Order confirmation emails are sent automatically — they confirm receipt, not necessarily shipment.</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>All content on this website — text, images, logos, blog posts, and design — is the property of Admiral Energy LLC unless otherwise noted. You may not reproduce, distribute, or use our content without written permission.</p>

        <h2>User Content</h2>
        <p>When you submit a form, review, or testimonial, you grant us the right to use that content for marketing purposes (with your name/initials, never full identifying information without consent).</p>

        <h2>Limitation of Liability</h2>
        <p>Admiral Energy LLC provides products and advice in good faith. We are not liable for:</p>
        <ul>
          <li>Damages resulting from product misuse or failure to follow instructions</li>
          <li>Losses from power outages or equipment failure beyond our control</li>
          <li>Indirect, incidental, or consequential damages</li>
        </ul>
        <p>Our total liability is limited to the purchase price of the product(s) in question.</p>

        <h2>Affiliate Links</h2>
        <p>Some links on our site are affiliate links. We earn a commission on purchases made through these links at no extra cost to you. See our <a href="/policies/affiliate-disclosure">Affiliate Disclosure</a> for details.</p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of the State of North Carolina. Any disputes will be resolved in the courts of North Carolina.</p>

        <h2>Changes</h2>
        <p>We may update these terms. Continued use of the site after changes constitutes acceptance.</p>

        <h2>Contact</h2>
        <p>Questions about these terms: <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a></p>
      </div>
    </article>
  );
}
