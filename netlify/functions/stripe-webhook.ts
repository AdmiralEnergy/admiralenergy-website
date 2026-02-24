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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return { statusCode: 400, body: `Webhook Error: ${message}` };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case "checkout.session.completed": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log("=== ORDER COMPLETED ===");
      console.log("Session ID:", session.id);
      console.log("Customer email:", session.customer_details?.email);
      console.log("Amount total:", session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "N/A");
      console.log("Payment status:", session.payment_status);
      console.log("Shipping:", JSON.stringify(session.shipping_details));
      console.log("Metadata:", JSON.stringify(session.metadata));
      console.log("=======================");

      // TODO: Send order confirmation email when email provider is configured
      // TODO: Write to Supabase orders table if credentials exist
      break;
    }

    case "checkout.session.expired": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log("Checkout session expired:", session.id);
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
