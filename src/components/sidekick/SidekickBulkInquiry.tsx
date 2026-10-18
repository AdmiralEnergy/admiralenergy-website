"use client";

import { useRef, useState } from "react";
import { Building2, CheckCircle, Loader2, Send } from "lucide-react";
import { pushDataLayer } from "@/components/sidekick/analytics";
import { BUSINESS } from "@/lib/business";

function encodeForm(form: HTMLFormElement) {
  const formData = new FormData(form);
  const encoded = new URLSearchParams();

  formData.forEach((value, key) => {
    if (typeof value === "string") encoded.append(key, value);
  });

  return encoded.toString();
}

export default function SidekickBulkInquiry() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submitLock = useRef(false);

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center" role="status">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-2xl font-black text-admiral-navy">Bulk inquiry received.</h3>
        <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-700">
          Admiral Energy will review the quantity, timeline, and organization details you provided
          and follow up using your contact information.
        </p>
      </div>
    );
  }

  return (
    <form
      name="sidekick-bulk-inquiry"
      method="POST"
      action="/__forms.html"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={async (event) => {
        event.preventDefault();
        if (submitLock.current) return;
        submitLock.current = true;
        setStatus("submitting");
        const form = event.currentTarget;
        const quantity = new FormData(form).get("estimated-quantity");

        try {
          const response = await fetch("/__forms.html", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encodeForm(form),
          });

          if (!response.ok) throw new Error("Bulk inquiry submission failed");

          pushDataLayer("generate_lead", {
            lead_type: "sidekick_bulk_inquiry",
            product_id: "hs-43-solar-power-bank",
            estimated_quantity: typeof quantity === "string" ? quantity : "unknown",
          });
          pushDataLayer("sidekick_bulk_inquiry_success");
          setStatus("success");
        } catch {
          setStatus("error");
        } finally {
          submitLock.current = false;
        }
      }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <input type="hidden" name="form-name" value="sidekick-bulk-inquiry" />
      <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-admiral-navy text-white">
          <Building2 className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-xl font-black text-admiral-navy">Tell us what you need.</h3>
          <p className="text-sm text-gray-600">No consumer checkout interruption—this is a separate inquiry.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bulk-name" className="mb-1.5 block text-sm font-bold text-gray-800">
            Name *
          </label>
          <input id="bulk-name" name="name" required autoComplete="name" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35" />
        </div>
        <div>
          <label htmlFor="bulk-company" className="mb-1.5 block text-sm font-bold text-gray-800">
            Company / organization *
          </label>
          <input id="bulk-company" name="company" required autoComplete="organization" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35" />
        </div>
        <div>
          <label htmlFor="bulk-email" className="mb-1.5 block text-sm font-bold text-gray-800">
            Email *
          </label>
          <input id="bulk-email" name="email" type="email" required autoComplete="email" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35" />
        </div>
        <div>
          <label htmlFor="bulk-phone" className="mb-1.5 block text-sm font-bold text-gray-800">
            Phone
          </label>
          <input id="bulk-phone" name="phone" type="tel" autoComplete="tel" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35" />
        </div>
        <div>
          <label htmlFor="bulk-quantity" className="mb-1.5 block text-sm font-bold text-gray-800">
            Estimated quantity *
          </label>
          <select id="bulk-quantity" name="estimated-quantity" required defaultValue="" className="min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35">
            <option value="" disabled>Select a range</option>
            <option value="10-24">10–24</option>
            <option value="25-49">25–49</option>
            <option value="50-99">50–99</option>
            <option value="100-plus">100+</option>
          </select>
        </div>
        <div>
          <label htmlFor="bulk-timeline" className="mb-1.5 block text-sm font-bold text-gray-800">
            Desired timeline
          </label>
          <input id="bulk-timeline" name="timeline" placeholder="For example, within 60 days" className="min-h-12 w-full rounded-xl border border-gray-300 px-4 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35" />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="bulk-notes" className="mb-1.5 block text-sm font-bold text-gray-800">
          Notes <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea id="bulk-notes" name="notes" rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-admiral-gold focus:outline-none focus:ring-2 focus:ring-admiral-gold/35" />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-admiral-navy px-6 py-3 font-black text-white transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {status === "submitting" ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Sending inquiry…</>
        ) : (
          <><Send className="h-5 w-5" /> Request bulk pricing</>
        )}
      </button>
      <div aria-live="polite">
        {status === "error" && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            We could not send the form. Email{" "}
            <a className="font-semibold underline" href={BUSINESS.contact.emailHref}>{BUSINESS.contact.email}</a>{" "}
            or call <a className="font-semibold underline" href={BUSINESS.contact.phoneHref}>{BUSINESS.contact.phoneDisplay}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
