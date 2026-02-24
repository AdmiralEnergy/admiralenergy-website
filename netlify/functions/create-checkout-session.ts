import type { Handler, HandlerEvent } from "@netlify/functions";
import Stripe from "stripe";
import { getProductById } from "../../src/data/products";

/**
 * PRICE SYNC REQUIRED
 * These prices MUST match priceCents in src/data/products.ts.
 * Discrepancy = wrong charge. Audit both files on every product change.
 * Last verified: 2026-02-24
 */
// Product prices are defined here as the single source of truth.
// These must match the priceCents in src/data/products.ts.
const PRODUCT_PRICES: Record<string, { name: string; priceCents: number; description: string }> = {
  "hs-43-solar-power-bank": {
    name: "HS-43 Multifunctional Solar Power Bank",
    priceCents: 5999,
    description: "40,000 mAh rugged solar power bank with hand crank, built-in cables, and emergency flashlight.",
  },
};

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://admiralenergy.ai";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://admiralenergy.ai";

const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers["origin"] || event.headers["Origin"] || "";
  const corsHeaders = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (origin && origin !== ALLOWED_ORIGIN) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
  if (!contentType.includes("application/json")) {
    return {
      statusCode: 415,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Unsupported Media Type" }),
    };
  }

  // Validate Stripe key
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Payment service not configured" }),
    };
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-01-27.acacia",
  });

  try {
    let body: unknown;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }

    const { productId, quantity } = body as { productId?: unknown; quantity?: unknown };
    const sanitizedProductId =
      typeof productId === "string" ? productId.replace(/[^a-zA-Z0-9_-]/g, "") : "";

    // Default to HS-43 if no productId
    const resolvedProductId = sanitizedProductId || "hs-43-solar-power-bank";

    // Look up product
    const product = PRODUCT_PRICES[resolvedProductId];
    if (!product) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid product" }),
      };
    }

    const catalogProduct = getProductById(resolvedProductId);
    if (!catalogProduct || catalogProduct.priceCents !== product.priceCents) {
      console.error("Product pricing mismatch for", resolvedProductId);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Product pricing mismatch" }),
      };
    }

    // Validate quantity
    const quantityNumber =
      typeof quantity === "number" ? quantity : Number.parseInt(String(quantity), 10);
    const normalizedQuantity = Number.isFinite(quantityNumber) ? Math.trunc(quantityNumber) : 1;
    const qty = Math.max(1, Math.min(5, normalizedQuantity));

    // Optional: use a Stripe Price ID from env if configured
    const stripePriceId = process.env.STRIPE_PRICE_ID_HS43;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = stripePriceId
      ? [{ price: stripePriceId, quantity: qty }]
      : [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description,
                images: [`${SITE_URL}/images/products/solar-power-bank.svg`],
              },
              unit_amount: product.priceCents,
            },
            quantity: qty,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ],
      success_url: `${SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/shop/hs-43-solar-power-bank?canceled=1`,
      metadata: {
        product_id: resolvedProductId,
        source: "admiral-energy-website",
      },
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to create checkout session" }),
    };
  }
};

export { handler };
