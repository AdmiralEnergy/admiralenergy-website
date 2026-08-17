import Stripe from "stripe";
import {
  beginStripeSync,
  completeStripeSync,
  failStripeSync,
  recordStripeRefund,
  upsertStripeOrder,
} from "./repository";
import { retrieveNormalizedStripeOrder, stripeRefundInput } from "./stripe";

export async function synchronizeStripeOrders(options: {
  initiatedBy: string;
  days: 30 | 90 | 365 | "all";
  maxSessions?: number;
}) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) throw new Error("Stripe is not configured.");
  const stripe = new Stripe(stripeSecret, { apiVersion: "2026-01-28.clover" });
  const runId = await beginStripeSync(options.initiatedBy);
  const counts = { imported: 0, skipped: 0, unmatched: 0 };
  const maxSessions = options.maxSessions ?? 500;
  let examined = 0;
  let truncated = false;

  try {
    const created = options.days === "all"
      ? undefined
      : { gte: Math.floor((Date.now() - options.days * 24 * 60 * 60 * 1000) / 1000) };
    const sessions = stripe.checkout.sessions.list({ limit: 100, status: "complete", ...(created ? { created } : {}) });
    for await (const session of sessions) {
      if (examined >= maxSessions) {
        truncated = true;
        break;
      }
      examined += 1;
      const normalized = await retrieveNormalizedStripeOrder(stripe, session.id);
      if (normalized.paymentStatus !== "paid") {
        counts.skipped += 1;
        continue;
      }
      const result = await upsertStripeOrder(normalized);
      if ("unmatched" in result && result.unmatched) counts.unmatched += 1;
      else if (result.created) counts.imported += 1;
      else counts.skipped += 1;

      if (normalized.externalPaymentId) {
        const refunds = await stripe.refunds.list({ payment_intent: normalized.externalPaymentId, limit: 100 });
        for (const refund of refunds.data) {
          const refundInput = stripeRefundInput(refund);
          if (refundInput.externalPaymentId && refundInput.status === "succeeded") {
            await recordStripeRefund({ ...refundInput, externalPaymentId: refundInput.externalPaymentId });
          }
        }
      }
    }
    await completeStripeSync(runId, counts);
    return { runId, counts, examined, truncated };
  } catch (error) {
    await failStripeSync(runId, error).catch(() => undefined);
    throw error;
  }
}
