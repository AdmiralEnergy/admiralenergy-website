import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Admiral Energy affiliate disclosure — transparency about our partner relationships and commissions.",
};

export default function AffiliateDisclosurePage() {
  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h1>Affiliate Disclosure</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>Transparency Statement</h2>
        <p>Admiral Energy LLC believes in full transparency. Some of the links on our website are affiliate links, meaning we may earn a commission if you make a purchase through them. This comes at <strong>no additional cost to you</strong>.</p>

        <h2>What This Means</h2>
        <ul>
          <li>When we recommend a product (like the EcoFlow DELTA Pro Ultra), we may receive a commission from the manufacturer if you purchase through our link.</li>
          <li>This does NOT increase the price you pay — the commission comes from the manufacturer/retailer.</li>
          <li>We ONLY recommend products we have personally evaluated and believe provide real value.</li>
          <li>Our reviews and recommendations are honest regardless of affiliate relationships.</li>
        </ul>

        <h2>Our Affiliate Partners</h2>
        <ul>
          <li><strong>EcoFlow:</strong> We are an authorized EcoFlow affiliate. Products linked on our EcoFlow pages may generate affiliate commissions.</li>
        </ul>

        <h2>Our Commitment</h2>
        <p>Affiliate income helps us maintain this website and create free educational content. However, we will never:</p>
        <ul>
          <li>Recommend a product solely because of affiliate commission</li>
          <li>Hide affiliate relationships from our audience</li>
          <li>Mislead you about product capabilities or limitations</li>
          <li>Prioritize commission over what&apos;s genuinely best for you</li>
        </ul>

        <p>If a cheaper product from a non-affiliate solves your problem better, we&apos;ll tell you that. Our reputation matters more than any commission.</p>

        <h2>FTC Compliance</h2>
        <p>This disclosure is provided in accordance with the Federal Trade Commission&apos;s guidelines on endorsements and testimonials (16 CFR Part 255).</p>

        <h2>Questions?</h2>
        <p>If you have questions about our affiliate relationships, email <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a>.</p>
      </div>
    </article>
  );
}
