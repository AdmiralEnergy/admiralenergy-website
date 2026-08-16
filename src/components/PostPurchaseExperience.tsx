"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { sidekickAnalyticsItem, trackEvent } from "@/lib/analytics";

export default function PostPurchaseExperience({ sessionId }: { sessionId?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    const key = `ae_purchase_${sessionId}`;
    if (sessionStorage.getItem(key)) return;
    trackEvent("purchase", {
      ecommerce: { transaction_id: sessionId, currency: "USD", items: [sidekickAnalyticsItem] },
    });
    sessionStorage.setItem(key, "1");
  }, [sessionId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const encoded = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => {
      if (typeof value === "string") encoded.append(key, value);
    });
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encoded.toString(),
      });
      if (!response.ok) throw new Error("Submission failed");
      trackEvent("post_purchase_interest_submitted", { form_name: "sidekick-interest" });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left text-emerald-900"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0" /><p>Thanks. This helps Admiral Energy send more relevant product and resilience guidance.</p></div>;
  }

  return (
    <form name="sidekick-interest" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={onSubmit} className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
      <input type="hidden" name="form-name" value="sidekick-interest" />
      <input type="hidden" name="session-id" value={sessionId || "not-provided"} />
      <input name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
      <h2 className="text-xl font-black text-admiral-navy">What made you choose SideKick?</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">One quick answer helps us tailor future education.</p>
      <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">Primary reason<select name="reason" required defaultValue="" className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-admiral-gold focus:ring-4 focus:ring-admiral-gold/20"><option value="" disabled>Select one</option><option>Everyday use</option><option>Travel</option><option>Work</option><option>Camping</option><option>Storms</option><option>Power outages</option><option>Emergency preparedness</option><option>Gift</option></select></label>
      <button type="submit" disabled={submitting} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-admiral-navy px-5 py-3 font-bold text-white disabled:opacity-60">{submitting && <Loader2 className="h-4 w-4 animate-spin" />}Share My Reason</button>
    </form>
  );
}
