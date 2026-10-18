import type { Metadata } from "next";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Admiral Energy collects, uses, shares, and protects information from site visitors, customers, and leads.",
  alternates: { canonical: "/policies/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="py-16">
      <div className="prose prose-lg mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1>Privacy Policy</h1>
        <p>
          <em>Last updated: October 18, 2026</em>
        </p>
        <p>
          {BUSINESS.name} operates admiralenergy.ai. This policy explains how we handle information
          submitted through the site and collected through normal site operation.
        </p>

        <h2>Information You Provide</h2>
        <ul>
          <li>
            Contact and request details submitted through forms, such as your name, email address,
            phone number, ZIP code, company, planning answers, and optional notes.
          </li>
          <li>
            Communication choices, including request-specific contact consent, optional marketing
            permission, optional partner-referral permission, and the version of the consent shown.
          </li>
          <li>
            Shipping, contact, order, and transaction details needed to complete or support a
            purchase.
          </li>
          <li>
            Interests you choose to share, such as outage preparation, travel, work, portable power,
            or home-backup priorities.
          </li>
        </ul>

        <h2>Attribution and Site Measurement</h2>
        <p>
          On your first visit, the site may store a first-party attribution record in your browser&apos;s
          local storage for up to 90 days. It can include campaign source, medium, campaign and
          content codes, the original landing-page path, a sanitized initial referrer without its
          query string, a general source category, and a capture time. If you submit the
          home-backup assessment, this record is included privately with that form submission. You
          can remove it by clearing site data in your browser.
        </p>
        <p>
          Google Tag Manager and configured analytics services receive event names and limited
          context used to understand site performance, such as a page path, a general lead-source
          category, CTA location, product identifier, or error category. We do not intentionally
          send names, email addresses, phone numbers, ZIP codes, form notes, free-text answers,
          consent values, or raw form fields through GTM, GA4, or advertising pixels.
        </p>
        <p>
          Hosting and analytics providers may process standard technical data such as IP address,
          browser and device information, timestamps, and page URLs. A page URL may contain the
          campaign codes that brought you to the site, so Admiral Energy does not place personal
          information in campaign links.
        </p>

        <h2>How We Use Information</h2>
        <ul>
          <li>Respond to the specific consultation, bulk-order, support, or other request you make.</li>
          <li>Process, fulfill, and support SideKick orders.</li>
          <li>Send resilience or marketing updates only when you separately request them.</li>
          <li>Understand which pages, campaigns, and calls to action are useful.</li>
          <li>Prevent fraud, maintain security, and meet legal and recordkeeping obligations.</li>
        </ul>

        <h2>Forms, Payments, and Service Providers</h2>
        <p>
          Netlify hosts the site and processes and stores form submissions for Admiral Energy,
          including information entered in a form and related submission metadata. Authorized
          Admiral Energy personnel can review, export, and delete those records.
        </p>
        <p>
          Stripe processes checkout and payment-card information. Admiral Energy receives order,
          status, contact, shipping, and transaction information needed to fulfill and support the
          purchase, but does not receive your full payment-card number.
        </p>
        <p>
          We may also use providers that support hosting, analytics, order fulfillment, customer
          communication, security, and business records. They receive information only for the
          services they provide and are subject to their own privacy and security practices.
        </p>

        <h2>Consent and Partner Referrals</h2>
        <p>
          For the home-backup assessment, required contact consent allows Admiral Energy to contact
          you by phone or email about that specific request. It does not enroll you in marketing.
          Marketing permission is a separate optional choice and can be withdrawn.
        </p>
        <p>
          Partner-referral permission is also separate and optional. If your request requires
          licensed installation expertise and you give that permission, Admiral Energy may share
          the minimum necessary request and contact details with an appropriate independent
          qualified or licensed professional for assessment. We do not automatically share a
          home-backup lead with a partner merely because you submitted the form.
        </p>

        <h2>Other Sharing</h2>
        <p>
          Admiral Energy does not sell or rent personal information. We may disclose information to
          the service providers described above, to a partner when you authorize a referral, when
          required by law, to protect rights or safety, or as part of a business transaction subject
          to appropriate safeguards.
        </p>

        <h2>Retention and Security</h2>
        <p>
          We limit access to people who need the information for an approved business purpose and
          use reasonable administrative and technical safeguards. No internet transmission or
          storage system can be guaranteed completely secure.
        </p>
        <p>
          We keep information only as long as reasonably needed for the request, customer
          relationship, order, warranty, fraud prevention, consent record, or applicable legal and
          accounting obligations. Test, spam, duplicate, and inactive lead records are reviewed for
          deletion, and access is reviewed periodically.
        </p>

        <h2>Your Choices</h2>
        <p>
          You may clear browser site data to remove local attribution storage, use browser controls
          that limit analytics, unsubscribe from marketing email, or withdraw future marketing or
          partner-referral permission. You may also ask to access, correct, or delete information,
          subject to identity verification and records we must retain for legal, security, or
          transaction purposes.
        </p>

        <h2>Children</h2>
        <p>
          The site and services are not directed to children under 13, and Admiral Energy does not
          knowingly collect their personal information.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions or requests, email{" "}
          <a href={BUSINESS.contact.emailHref}>{BUSINESS.contact.email}</a>.
        </p>
      </div>
    </article>
  );
}
