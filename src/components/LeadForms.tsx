"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import HomeBackupAssessmentForm from "@/components/HomeBackupAssessmentForm";
import { BUSINESS } from "@/lib/business";

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-admiral-gold focus:ring-4 focus:ring-admiral-gold/20";

async function submitNetlifyForm(form: HTMLFormElement) {
  const encoded = new URLSearchParams();
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") encoded.append(key, value);
  });
  if (form.elements.namedItem("lead_created_at_client")) {
    encoded.set("lead_created_at_client", new Date().toISOString());
  }

  const response = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encoded.toString(),
  });

  if (!response.ok) throw new Error("Form submission failed");
}

function FormStatus({ message }: { message: string }) {
  return (
    <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function EmailCapture({ source = "site" }: { source?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      await submitNetlifyForm(event.currentTarget);
      trackEvent("generate_lead", { lead_type: "resilience_list", form_name: "resilience-list", source });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <FormStatus message="You’re on the Admiral Resilience List. Watch your inbox for practical backup-power guidance." />;
  }

  return (
    <form name="resilience-list" method="POST" action="/__forms.html" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="form-name" value="resilience-list" />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="lead_created_at_client" value="" />
      <input name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor={`resilience-email-${source}`}>Email address</label>
        <input id={`resilience-email-${source}`} className={fieldClass} type="email" name="email" autoComplete="email" placeholder="Email address" required />
        <button type="submit" disabled={submitting} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-3 font-bold text-admiral-navy transition hover:bg-gold-light disabled:opacity-60">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-5 w-5" aria-hidden="true" />}
          Get the Checklist
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs leading-5 text-slate-600">
        <input type="checkbox" name="marketing_consent" value="yes" required className="mt-0.5 h-4 w-4 shrink-0 accent-admiral-navy" />
        <span>Send me resilience tips, SideKick offers, and home-backup education. I can unsubscribe at any time.</span>
      </label>
      {error && <p role="alert" className="text-sm text-red-700">We couldn’t add you right now. Please email <a className="font-semibold underline" href={BUSINESS.contact.emailHref}>{BUSINESS.contact.email}</a>.</p>}
    </form>
  );
}

export function HomeBackupForm({
  formLocation = "home_backup",
}: {
  formLocation?: string;
}) {
  return <HomeBackupAssessmentForm formLocation={formLocation} />;
}

export function BulkOrderForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      await submitNetlifyForm(event.currentTarget);
      trackEvent("generate_lead", { lead_type: "bulk_order", form_name: "bulk-order-inquiry" });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <FormStatus message="Thanks—Admiral Energy will follow up about availability, timing, and bulk pricing." />;
  }

  return (
    <form name="bulk-order-inquiry" method="POST" action="/__forms.html" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="form-name" value="bulk-order-inquiry" />
      <input name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Name<input className={fieldClass} name="name" autoComplete="name" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Company<input className={fieldClass} name="company" autoComplete="organization" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Email<input className={fieldClass} type="email" name="email" autoComplete="email" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Phone<input className={fieldClass} type="tel" name="phone" autoComplete="tel" required /></label>
        <label className="grid gap-2 text-sm font-semibold">Estimated quantity<select className={fieldClass} name="quantity" required defaultValue=""><option value="" disabled>Select a range</option><option>10–24</option><option>25–49</option><option>50–99</option><option>100+</option></select></label>
        <label className="grid gap-2 text-sm font-semibold">Desired timeline<input className={fieldClass} name="timeline" placeholder="e.g. Within 60 days" required /></label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">Notes <span className="font-normal text-slate-500">(optional)</span><textarea className={fieldClass} name="notes" rows={3} /></label>
      <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-3 font-bold text-admiral-navy transition hover:bg-gold-light disabled:opacity-60 sm:justify-self-start">
        {submitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        Request Bulk Pricing
      </button>
      {error && <p role="alert" className="text-sm text-red-700">We couldn’t submit the form. Please email <a className="font-semibold underline" href={BUSINESS.contact.emailHref}>{BUSINESS.contact.email}</a>.</p>}
    </form>
  );
}
