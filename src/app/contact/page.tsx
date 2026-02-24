"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Handshake,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [homeownerSubmitted, setHomeownerSubmitted] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const submitNetlifyForm = async (form: HTMLFormElement) => {
    const data = new FormData(form);
    const encoded = new URLSearchParams();

    data.forEach((value, key) => {
      if (typeof value === "string") {
        encoded.append(key, value);
      }
    });

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encoded.toString(),
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-admiral-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="text-gray-300 text-lg">
            Whether you&apos;re a homeowner looking for guidance or a potential
            partner, we&apos;re here to help. No sales scripts — just real conversation.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <Phone className="w-8 h-8 text-admiral-navy mx-auto mb-2" />
              <p className="font-semibold text-admiral-navy">Phone</p>
              <a
                href="tel:+19842384187"
                className="text-gray-600 hover:text-admiral-gold transition-colors"
              >
                (984) 238-4187
              </a>
            </div>
            <div className="text-center">
              <Mail className="w-8 h-8 text-admiral-navy mx-auto mb-2" />
              <p className="font-semibold text-admiral-navy">Email</p>
              <a
                href="mailto:info@admiralenergy.ai"
                className="text-gray-600 hover:text-admiral-gold transition-colors"
              >
                info@admiralenergy.ai
              </a>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-admiral-navy mx-auto mb-2" />
              <p className="font-semibold text-admiral-navy">Service Area</p>
              <p className="text-gray-600">North Carolina</p>
            </div>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Homeowner Form */}
            <div>
              <h2 className="text-2xl font-bold text-admiral-navy mb-2">
                Homeowner Inquiry
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Looking for portable power, storm prep advice, or a solar
                consultation? Tell us what you need.
              </p>

              {homeownerSubmitted ? (
                <div className="bg-green-50 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700 text-sm">
                    We&apos;ll get back to you within 24 hours. No spam, no
                    auto-dialer — just a real person.
                  </p>
                </div>
              ) : (
                <form
                  name="homeowner-inquiry"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    submitNetlifyForm(form)
                      .then(() => setHomeownerSubmitted(true))
                      .catch(() => alert("Something went wrong. Please email us directly."));
                  }}
                  className="space-y-4"
                >
                  <input type="hidden" name="form-name" value="homeowner-inquiry" />
                  <input type="text" name="bot-field" style={{ display: "none" }} aria-hidden="true" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      I&apos;m interested in…
                    </label>
                    <select
                      name="interest"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    >
                      <option value="portable-power">Portable Power Products</option>
                      <option value="storm-prep">Storm Preparedness Advice</option>
                      <option value="whole-home">Whole-Home Battery Backup</option>
                      <option value="solar">Solar Installation Consultation</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                      placeholder="Tell us about your situation..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-admiral-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Partner Form */}
            <div>
              <h2 className="text-2xl font-bold text-admiral-navy mb-2 flex items-center gap-2">
                <Handshake className="w-6 h-6" /> Partner Inquiry
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Interested in affiliate partnerships, dealer opportunities, or
                co-marketing? Let&apos;s explore it.
              </p>

              {partnerSubmitted ? (
                <div className="bg-green-50 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-green-700 text-sm">
                    Our partnership team will review and respond within 48 hours.
                  </p>
                </div>
              ) : (
                <form
                  name="partner-inquiry"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    submitNetlifyForm(form)
                      .then(() => setPartnerSubmitted(true))
                      .catch(() => alert("Something went wrong. Please email us directly."));
                  }}
                  className="space-y-4"
                >
                  <input type="hidden" name="form-name" value="partner-inquiry" />
                  <input type="text" name="bot-field" style={{ display: "none" }} aria-hidden="true" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contact-name"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partnership Type
                    </label>
                    <select
                      name="partnership-type"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                    >
                      <option value="affiliate">Affiliate Partnership</option>
                      <option value="dealer">Dealer / Reseller</option>
                      <option value="co-marketing">Co-Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Details *
                    </label>
                    <textarea
                      name="details"
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-admiral-gold focus:border-admiral-gold"
                      placeholder="Tell us about your organization and what you have in mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-admiral-gold text-admiral-navy px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
