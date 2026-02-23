import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warranty Information",
  description: "Admiral Energy product warranty details and coverage information.",
};

export default function WarrantyPage() {
  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
        <h1>Warranty Information</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>Product Warranties</h2>
        <p>Warranty coverage varies by product and manufacturer:</p>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Warranty Period</th>
              <th>Coverage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solar Power Bank (500Wh)</td>
              <td>2 Years</td>
              <td>Manufacturer defects, battery degradation below 80%</td>
            </tr>
            <tr>
              <td>100W Solar Panel</td>
              <td>2 Years</td>
              <td>Manufacturer defects, output degradation below 90%</td>
            </tr>
            <tr>
              <td>Storm Ready Kit</td>
              <td>1 Year</td>
              <td>Manufacturer defects on electronic components</td>
            </tr>
            <tr>
              <td>EcoFlow Products</td>
              <td>Per EcoFlow Warranty</td>
              <td>Covered by EcoFlow&apos;s manufacturer warranty</td>
            </tr>
          </tbody>
        </table>

        <h2>What&apos;s Covered</h2>
        <ul>
          <li>Manufacturing defects in materials or workmanship</li>
          <li>Battery capacity falling below stated threshold under normal use</li>
          <li>Electrical component failure under normal operating conditions</li>
        </ul>

        <h2>What&apos;s NOT Covered</h2>
        <ul>
          <li>Physical damage from drops, water immersion (beyond IP rating), or misuse</li>
          <li>Damage from unauthorized modifications or repairs</li>
          <li>Normal wear and tear (scratches, cosmetic blemishes)</li>
          <li>Damage from use outside recommended operating conditions</li>
        </ul>

        <h2>How to File a Warranty Claim</h2>
        <ol>
          <li>Email <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a> with your order number, product name, and description of the issue.</li>
          <li>Include photos or video of the defect if possible.</li>
          <li>We&apos;ll review and respond within 48 hours.</li>
          <li>If approved, we&apos;ll provide a prepaid return label and ship a replacement.</li>
        </ol>

        <h2>Questions?</h2>
        <p>Email us at <a href="mailto:info@admiralenergy.ai">info@admiralenergy.ai</a> or call <a href="tel:+19842384187">(984) 238-4187</a>.</p>
      </div>
    </article>
  );
}
