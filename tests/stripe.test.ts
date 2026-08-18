import assert from "node:assert/strict";
import test from "node:test";
import type Stripe from "stripe";
import { normalizeStripeCheckoutSession } from "../src/lib/commerce/stripe";

function session(metadata: Record<string, string>) {
  return {
    id: "cs_test_123",
    created: 1_700_000_000,
    currency: "usd",
    amount_subtotal: 6999,
    amount_total: 6999,
    payment_status: "paid",
    mode: "payment",
    metadata,
    payment_intent: { id: "pi_test_123", latest_charge: { balance_transaction: { fee: 233 } } },
    customer_details: { name: "Test Customer", email: "test@example.com", phone: null, address: { line1: "1 Main St", line2: null, city: "Charlotte", state: "NC", postal_code: "28202", country: "US" } },
    collected_information: null,
    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
    line_items: { data: [{ id: "li_123", quantity: 1, description: "SideKick PowerBank", amount_subtotal: 6999, amount_discount: 0, amount_total: 6999 }] },
  } as unknown as Stripe.Checkout.Session;
}

test("Stripe normalization preserves exact product identity, fee, customer, and attribution", () => {
  const order = normalizeStripeCheckoutSession(session({ product_id: "hs-43-solar-power-bank", sku: "AE-HS43-001", utm_source: "google", landing_page: "/sidekick" }));
  assert.equal(order.externalOrderId, "cs_test_123");
  assert.equal(order.externalPaymentId, "pi_test_123");
  assert.equal(order.items[0].productId, "hs-43-solar-power-bank");
  assert.equal(order.items[0].sku, "AE-HS43-001");
  assert.equal(order.processorFeeCents, 233);
  assert.equal(order.utmSource, "google");
  assert.equal(order.landingPage, "/sidekick");
});
test("Stripe normalization refuses to infer an unknown product by amount", () => {
  const order = normalizeStripeCheckoutSession(session({ product_id: "unknown" }));
  assert.equal(order.items[0].productId, null);
});
