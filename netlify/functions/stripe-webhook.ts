import type { Handler, HandlerEvent } from "@netlify/functions";
import Stripe from "stripe";
import {
  beginWebhookEvent,
  completeWebhookEvent,
  failWebhookEvent,
  recordStripeRefund,
  resetFailedWebhookEvent,
  upsertStripeOrder,
} from "../../src/lib/commerce/repository";
import {
  retrieveNormalizedStripeOrder,
  stripeRefundInput,
} from "../../src/lib/commerce/stripe";

async function ingestRefund(refund: Stripe.Refund) {
  const normalized = stripeRefundInput(refund);
  if (normalized.status !== "succeeded" || !normalized.externalPaymentId) return;
  await recordStripeRefund({ ...normalized, externalPaymentId: normalized.externalPaymentId });
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    console.error("Stripe webhook configuration is incomplete.");
    return { statusCode: 500, body: "Webhook not configured" };
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-01-28.clover",
  });
  const signature = event.headers["stripe-signature"];
  if (!signature) return { statusCode: 400, body: "Missing stripe-signature header" };

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body || "", signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown signature error";
    console.error("Stripe webhook signature verification failed:", message);
    return { statusCode: 400, body: "Invalid webhook signature" };
  }

  try {
    let claimed = await beginWebhookEvent("stripe", stripeEvent.id, stripeEvent.type);
    if (!claimed) claimed = await resetFailedWebhookEvent("stripe", stripeEvent.id);
    if (!claimed) {
      return { statusCode: 200, body: JSON.stringify({ received: true, duplicate: true }) };
    }

    switch (stripeEvent.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const normalized = await retrieveNormalizedStripeOrder(stripe, session.id);
        if (normalized.paymentStatus === "paid") await upsertStripeOrder(normalized);
        break;
      }
      case "refund.created":
      case "refund.updated": {
        await ingestRefund(stripeEvent.data.object as Stripe.Refund);
        break;
      }
      case "charge.refunded": {
        const charge = stripeEvent.data.object as Stripe.Charge;
        const refunds = await stripe.refunds.list({ charge: charge.id, limit: 100 });
        for (const refund of refunds.data) await ingestRefund(refund);
        break;
      }
      default:
        break;
    }

    await completeWebhookEvent("stripe", stripeEvent.id);
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error: unknown) {
    console.error("Stripe webhook processing failed:", error instanceof Error ? error.message : "Unknown error");
    await failWebhookEvent("stripe", stripeEvent.id, error).catch(() => undefined);
    return { statusCode: 503, body: "Webhook processing unavailable" };
  }
};

export { handler };
