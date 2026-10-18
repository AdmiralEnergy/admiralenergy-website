"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  getOrCreateAttribution,
  type LeadAttribution,
} from "@/lib/attribution";
import { BUSINESS } from "@/lib/business";

const FORM_NAME = "home-backup-assessment";
const CONSENT_VERSION = "2026-10-17-v1";
const fieldClass =
  "min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-admiral-gold focus:ring-4 focus:ring-admiral-gold/20";
const invalidClass = "border-red-500 focus:border-red-600 focus:ring-red-100";

const emptyAttribution: LeadAttribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  landing_page: "",
  initial_referrer: "",
  lead_source: "direct",
  attribution_captured_at: "",
};

type RequiredField =
  | "name"
  | "email"
  | "phone"
  | "zip_code"
  | "homeowner_status"
  | "backup_priority"
  | "consideration_timeline"
  | "contact_consent";
type Errors = Partial<Record<RequiredField, string>>;

function valueOf(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validate(form: HTMLFormElement): Errors {
  const data = new FormData(form);
  const errors: Errors = {};

  if (valueOf(data, "name").length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueOf(data, "email"))) {
    errors.email = "Enter a valid email address.";
  }
  if (valueOf(data, "phone").replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a phone number where we can reach you about this request.";
  }
  if (!/^\d{5}(?:-\d{4})?$/.test(valueOf(data, "zip_code"))) {
    errors.zip_code = "Enter a 5-digit ZIP code (or ZIP+4).";
  }
  if (!valueOf(data, "homeowner_status")) {
    errors.homeowner_status = "Select the option that best describes you.";
  }
  if (!valueOf(data, "backup_priority")) {
    errors.backup_priority = "Select your primary backup priority.";
  }
  if (!valueOf(data, "consideration_timeline")) {
    errors.consideration_timeline = "Select a planning timeframe.";
  }
  if (!data.get("contact_consent")) {
    errors.contact_consent = "Consent is required so we can respond to this request.";
  }

  return errors;
}

function encode(form: HTMLFormElement, extra: Record<string, string>) {
  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") body.append(key, value);
  });
  Object.entries(extra).forEach(([key, value]) => body.set(key, value));
  return body.toString();
}

function ErrorMessage({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

export default function HomeBackupAssessmentForm({
  formLocation,
}: {
  formLocation: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<Errors>({});
  const [attribution, setAttribution] = useState<LeadAttribution>(emptyAttribution);
  const started = useRef(false);
  const submitLock = useRef(false);
  const conversionSent = useRef(false);
  const id = `home-backup-${formLocation.replace(/[^a-z0-9-]/gi, "-")}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAttribution(getOrCreateAttribution());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function clearError(name: string) {
    if (!(name in errors)) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[name as RequiredField];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;

    const form = event.currentTarget;
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      trackEvent("form_error", {
        form_name: FORM_NAME,
        lead_type: "home_backup",
        error_type: "validation",
        error_count: Object.keys(nextErrors).length,
        page_path: window.location.pathname,
        form_location: formLocation,
      });
      const first = form.elements.namedItem(Object.keys(nextErrors)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }

    submitLock.current = true;
    setErrors({});
    setStatus("submitting");
    const firstTouch = getOrCreateAttribution();

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(form, {
          consent_version: CONSENT_VERSION,
          form_location: formLocation,
          submission_page: window.location.pathname,
          ...firstTouch,
          lead_created_at_client: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Submission failed");

      if (!conversionSent.current) {
        trackEvent("generate_lead", {
          lead_type: "home_backup",
          form_name: FORM_NAME,
          lead_source: firstTouch.lead_source,
          page_path: window.location.pathname,
          form_location: formLocation,
        });
        conversionSent.current = true;
      }
      setStatus("success");
    } catch {
      trackEvent("form_error", {
        form_name: FORM_NAME,
        lead_type: "home_backup",
        error_type: "submission",
        page_path: window.location.pathname,
        form_location: formLocation,
      });
      setStatus("error");
    } finally {
      submitLock.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950"
      >
        <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
        <div>
          <h3 className="font-black">Your home-backup request was received.</h3>
          <p className="mt-2 leading-7">
            Admiral Energy will review the details and use the contact information you provided to
            discuss a sensible next step. This request does not create an installation agreement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action="/__forms.html"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      noValidate
      aria-busy={status === "submitting"}
      onFocusCapture={(event) => {
        const target = event.target;
        const isField =
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement;
        if (!isField || started.current || target.name === "bot-field" || target.type === "hidden") {
          return;
        }
        started.current = true;
        trackEvent("form_start", {
          form_name: FORM_NAME,
          lead_type: "home_backup",
          page_path: window.location.pathname,
          form_location: formLocation,
        });
      }}
      onInput={(event) => {
        const target = event.target;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        ) {
          clearError(target.name);
        }
      }}
      onSubmit={onSubmit}
      className="grid gap-5"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <input type="hidden" name="consent_version" value={CONSENT_VERSION} />
      <input type="hidden" name="form_location" value={formLocation} />
      <input type="hidden" name="submission_page" value="" />
      <input type="hidden" name="utm_source" value={attribution.utm_source} />
      <input type="hidden" name="utm_medium" value={attribution.utm_medium} />
      <input type="hidden" name="utm_campaign" value={attribution.utm_campaign} />
      <input type="hidden" name="utm_content" value={attribution.utm_content} />
      <input type="hidden" name="landing_page" value={attribution.landing_page} />
      <input type="hidden" name="initial_referrer" value={attribution.initial_referrer} />
      <input type="hidden" name="lead_source" value={attribution.lead_source} />
      <input type="hidden" name="attribution_captured_at" value={attribution.attribution_captured_at} />
      <input type="hidden" name="lead_created_at_client" value="" />
      <input name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${id}-name`} className="text-sm font-semibold text-slate-700">Name *</label>
          <input id={`${id}-name`} className={`${fieldClass} ${errors.name ? invalidClass : ""}`} name="name" autoComplete="name" maxLength={120} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
          <ErrorMessage id={`${id}-name-error`}>{errors.name}</ErrorMessage>
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-email`} className="text-sm font-semibold text-slate-700">Email *</label>
          <input id={`${id}-email`} className={`${fieldClass} ${errors.email ? invalidClass : ""}`} type="email" name="email" autoComplete="email" inputMode="email" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
          <ErrorMessage id={`${id}-email-error`}>{errors.email}</ErrorMessage>
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-phone`} className="text-sm font-semibold text-slate-700">Phone *</label>
          <input id={`${id}-phone`} className={`${fieldClass} ${errors.phone ? invalidClass : ""}`} type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={40} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${id}-phone-error` : undefined} />
          <ErrorMessage id={`${id}-phone-error`}>{errors.phone}</ErrorMessage>
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-zip`} className="text-sm font-semibold text-slate-700">ZIP code *</label>
          <input id={`${id}-zip`} className={`${fieldClass} ${errors.zip_code ? invalidClass : ""}`} name="zip_code" inputMode="numeric" autoComplete="postal-code" maxLength={10} required aria-invalid={Boolean(errors.zip_code)} aria-describedby={errors.zip_code ? `${id}-zip-error` : undefined} />
          <ErrorMessage id={`${id}-zip-error`}>{errors.zip_code}</ErrorMessage>
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-homeowner`} className="text-sm font-semibold text-slate-700">Homeowner status *</label>
          <select id={`${id}-homeowner`} className={`${fieldClass} ${errors.homeowner_status ? invalidClass : ""}`} name="homeowner_status" defaultValue="" required aria-invalid={Boolean(errors.homeowner_status)} aria-describedby={errors.homeowner_status ? `${id}-homeowner-error` : undefined}>
            <option value="" disabled>Select one</option>
            <option value="owner">I own the home</option>
            <option value="buying">I am buying the home</option>
            <option value="renter_or_other">I rent or have another arrangement</option>
          </select>
          <ErrorMessage id={`${id}-homeowner-error`}>{errors.homeowner_status}</ErrorMessage>
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-priority`} className="text-sm font-semibold text-slate-700">Primary backup priority *</label>
          <select id={`${id}-priority`} className={`${fieldClass} ${errors.backup_priority ? invalidClass : ""}`} name="backup_priority" defaultValue="" required aria-invalid={Boolean(errors.backup_priority)} aria-describedby={errors.backup_priority ? `${id}-priority-error` : undefined}>
            <option value="" disabled>Select a priority</option>
            <option value="refrigeration">Refrigeration and food storage</option>
            <option value="well_pump">Well pump and household water</option>
            <option value="heating_cooling">Heating or cooling</option>
            <option value="communications_home_office">Communications or home office</option>
            <option value="multiple_essential_loads">Multiple essential loads / whole-home planning</option>
            <option value="not_sure">Not sure yet</option>
          </select>
          <ErrorMessage id={`${id}-priority-error`}>{errors.backup_priority}</ErrorMessage>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${id}-timeline`} className="text-sm font-semibold text-slate-700">When are you considering backup power? *</label>
        <select id={`${id}-timeline`} className={`${fieldClass} ${errors.consideration_timeline ? invalidClass : ""}`} name="consideration_timeline" defaultValue="" required aria-invalid={Boolean(errors.consideration_timeline)} aria-describedby={errors.consideration_timeline ? `${id}-timeline-error` : undefined}>
          <option value="" disabled>Select a timeframe</option>
          <option value="as_soon_as_practical">As soon as practical</option>
          <option value="within_1_3_months">Within 1–3 months</option>
          <option value="within_3_6_months">Within 3–6 months</option>
          <option value="researching_future">Researching for the future</option>
        </select>
        <ErrorMessage id={`${id}-timeline-error`}>{errors.consideration_timeline}</ErrorMessage>
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${id}-notes`} className="text-sm font-semibold text-slate-700">Anything else we should know? <span className="font-normal text-slate-500">(optional)</span></label>
        <textarea id={`${id}-notes`} className={fieldClass} name="notes" rows={4} maxLength={2000} placeholder="For example: well pump, HVAC, refrigeration, or home-office priorities. Please do not include medical history or other sensitive details." />
      </div>

      <fieldset className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 text-sm font-bold text-admiral-navy">Contact and communication choices</legend>
        <div>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
            <input type="checkbox" name="contact_consent" value="specific_assessment_request" required className="mt-1 h-5 w-5 shrink-0 accent-admiral-navy" aria-invalid={Boolean(errors.contact_consent)} aria-describedby={errors.contact_consent ? `${id}-consent-error` : undefined} />
            <span>I agree that Admiral Energy may contact me by phone or email about this specific assessment request. This does not enroll me in marketing. *</span>
          </label>
          <ErrorMessage id={`${id}-consent-error`}>{errors.contact_consent}</ErrorMessage>
        </div>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input type="checkbox" name="marketing_opt_in" value="yes" className="mt-1 h-5 w-5 shrink-0 accent-admiral-navy" />
          <span>Optional: send me ongoing resilience tips, product news, and educational updates. I can unsubscribe at any time.</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input type="checkbox" name="partner_referral_consent" value="yes" className="mt-1 h-5 w-5 shrink-0 accent-admiral-navy" />
          <span>Optional: if licensed installation expertise is needed, I authorize Admiral Energy to share this request with an appropriate independent licensed professional. Checking this records permission; information is not automatically shared.</span>
        </label>
      </fieldset>

      <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-3 font-bold text-admiral-navy transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:justify-self-start">
        {status === "submitting" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {status === "submitting" ? "Sending…" : "Request a Home Backup Consultation"}
      </button>
      <p className="text-xs leading-5 text-slate-500">
        Submitting starts a conversation, not a contract. Installation, final electrical design,
        permits, and definitive proposals must be handled by properly licensed professionals. See our{" "}
        <Link href="/policies/privacy" className="font-semibold underline">Privacy Policy</Link>.
      </p>
      <div aria-live="polite">
        {status === "error" && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            We couldn’t submit the form. Please try again, call{" "}
            <a className="font-semibold underline" href={BUSINESS.contact.phoneHref}>{BUSINESS.contact.phoneDisplay}</a>, or email{" "}
            <a className="font-semibold underline" href={BUSINESS.contact.emailHref}>{BUSINESS.contact.email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
