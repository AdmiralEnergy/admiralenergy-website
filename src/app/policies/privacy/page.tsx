import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Admiral Energy privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h1>Privacy Policy</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>Who We Are</h2>
        <p>Admiral Energy LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates admiralenergy.ai. This policy explains how we handle your information.</p>

        <h2>Information We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li>Name, email, phone number (via contact forms)</li>
          <li>Shipping address (via orders)</li>
          <li>Payment information (processed by Snipcart — we never see your full card number)</li>
        </ul>

        <h3>Information Collected Automatically</h3>
        <ul>
          <li>IP address, browser type, device type</li>
          <li>Pages visited, time on site, referral source</li>
          <li>Cookies and similar technologies (via Google Analytics / GTM)</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process and fulfill orders</li>
          <li>Respond to inquiries and provide customer support</li>
          <li>Send order updates and shipping notifications</li>
          <li>Improve our website and products based on usage patterns</li>
          <li>Send marketing emails (only with your explicit consent)</li>
        </ul>

        <h2>We Do NOT</h2>
        <ul>
          <li>Sell your personal information to third parties</li>
          <li>Share your data with unrelated businesses</li>
          <li>Use your phone number for cold calling</li>
          <li>Store credit card numbers on our servers</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services that may collect data:</p>
        <ul>
          <li><strong>Snipcart:</strong> Payment processing and order management</li>
          <li><strong>Google Analytics:</strong> Website traffic analysis</li>
          <li><strong>Netlify:</strong> Website hosting and form submissions</li>
        </ul>

        <h2>Cookies</h2>
        <p>We use cookies for site functionality and analytics. You can disable cookies in your browser settings, though some features may not work properly.</p>

        <h2>Your Rights</h2>
        <p>You may request to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Delete your data (subject to legal obligations)</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h2>Data Security</h2>
        <p>We use industry-standard security measures including HTTPS encryption, secure hosting, and limited access controls. No system is 100% secure, but we take reasonable steps to protect your data.</p>

        <h2>Children&apos;s Privacy</h2>
        <p>Our services are not directed at children under 13. We do not knowingly collect personal information from children.</p>

        <h2>Changes to This Policy</h2>
        <p>We may update this policy from time to time. Changes will be posted on this page with an updated revision date.</p>

        <h2>Contact</h2>
        <p>For privacy-related questions: <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a></p>
      </div>
    </article>
  );
}
