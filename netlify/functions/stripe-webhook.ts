import type { Handler, HandlerEvent } from "@netlify/functions";
import Stripe from "stripe";

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return { statusCode: 500, body: "Webhook not configured" };
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-01-27.acacia",
  });

  const sig = event.headers["stripe-signature"];
  if (!sig) {
    return { statusCode: 400, body: "Missing stripe-signature header" };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body || "", sig, webhookSecret);
  } catch {
    // Stripe's verification error can include request details. Keep both the
    // public response and function logs intentionally generic.
    console.warn("Stripe webhook signature verification failed");
    return { statusCode: 400, body: "Invalid webhook signature" };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case "checkout.session.completed": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.info("Stripe checkout event processed", {
        eventType: stripeEvent.type,
        livemode: stripeEvent.livemode,
        paymentStatus: session.payment_status,
      });

      // TODO: Send order confirmation email when email provider is configured
      // TODO: Write to Supabase orders table if credentials exist
      break;
    }

    case "checkout.session.expired": {
      console.info("Stripe checkout event processed", {
        eventType: stripeEvent.type,
        livemode: stripeEvent.livemode,
      });
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};

export { handler };
