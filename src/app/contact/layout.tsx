import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Admiral Energy",
  description:
    "Reach out for portable power advice, solar consultations, or partnership inquiries. No sales scripts — just a real conversation.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div hidden aria-hidden="true">
        <form
          name="homeowner-inquiry"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="homeowner-inquiry" />
          <input name="bot-field" />
          <input name="first-name" />
          <input name="last-name" />
          <input name="email" />
          <input name="phone" />
          <input name="interest" />
          <textarea name="message" />
        </form>

        <form
          name="partner-inquiry"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="partner-inquiry" />
          <input name="bot-field" />
          <input name="company" />
          <input name="contact-name" />
          <input name="email" />
          <input name="partnership-type" />
          <textarea name="details" />
        </form>
      </div>
      {children}
    </>
  );
}
