import type Stripe from "stripe";
import type { AttributionData, PaymentStatus, StripeOrderInput } from "./types";

const KNOWN_PRODUCT_IDS = new Set(["hs-43-solar-power-bank"]);

function text(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function objectId(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
  return null;
}

export function stripePaymentStatus(value: string | null | undefined): PaymentStatus {
  switch (value) {
    case "paid":
    case "no_payment_required":
      return "paid";
    case "unpaid":
      return "pending";
    default:
      return "pending";
  }
}

export function attributionFromMetadata(metadata: Record<string, string> | null | undefined): AttributionData {
  return {
    acquisitionChannel: text(metadata?.acquisition_channel, 160),
    utmSource: text(metadata?.utm_source, 160),
    utmMedium: text(metadata?.utm_medium, 160),
    utmCampaign: text(metadata?.utm_campaign, 160),
    utmTerm: text(metadata?.utm_term, 160),
    utmContent: text(metadata?.utm_content, 160),
    landingPage: text(metadata?.landing_page),
    referrer: text(metadata?.referrer),
    promoCode: text(metadata?.promo_code, 160),
  };
}

export function normalizeStripeCheckoutSession(session: Stripe.Checkout.Session): StripeOrderInput {
  const sessionWithLegacyFields = session as Stripe.Checkout.Session & {
    shipping_details?: {
      name?: string | null;
      address?: Stripe.Address | null;
    } | null;
  };
  const shipping = sessionWithLegacyFields.shipping_details ?? session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? session.customer_details?.address ?? null;
  const paymentIntent = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const latestCharge = paymentIntent && "latest_charge" in paymentIntent && typeof paymentIntent.latest_charge === "object"
    ? paymentIntent.latest_charge
    : null;
  const balanceTransaction = latestCharge && "balance_transaction" in latestCharge && typeof latestCharge.balance_transaction === "object"
    ? latestCharge.balance_transaction
    : null;
  const processorFeeCents = balanceTransaction && "fee" in balanceTransaction && typeof balanceTransaction.fee === "number"
    ? balanceTransaction.fee
    : 0;
  const productId = text(session.metadata?.product_id, 100);
  const sku = text(session.metadata?.sku, 100);
  const lineItems = session.line_items?.data ?? [];
  const items = lineItems.map((item) => {
    const quantity = item.quantity ?? Number(session.metadata?.quantity ?? 1);
    const totalCents = item.amount_total;
    const discountCents = item.amount_discount;
    const subtotalCents = item.amount_subtotal;
    return {
      externalLineItemId: item.id,
      productId: productId && KNOWN_PRODUCT_IDS.has(productId) ? productId : null,
      productName: text(item.description, 500) ?? "Unmatched Stripe item",
      sku,
      quantity,
      unitPriceCents: quantity > 0 ? Math.round(subtotalCents / quantity) : subtotalCents,
      discountCents,
      totalCents,
    };
  });

  return {
    externalOrderId: session.id,
    externalPaymentId: objectId(session.payment_intent),
    paymentStatus: stripePaymentStatus(session.payment_status),
    customerName: text(session.customer_details?.name ?? shipping?.name, 160),
    customerEmail: text(session.customer_details?.email, 254),
    customerPhone: text(session.customer_details?.phone, 160),
    shippingAddressLine1: text(address?.line1, 160),
    shippingAddressLine2: text(address?.line2, 160),
    shippingCity: text(address?.city, 160),
    shippingState: text(address?.state, 160),
    shippingPostalCode: text(address?.postal_code, 40),
    shippingCountry: text(address?.country, 2) ?? "US",
    currency: (session.currency ?? "usd").toUpperCase(),
    subtotalCents: session.amount_subtotal ?? items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0),
    discountCents: session.total_details?.amount_discount ?? 0,
    shippingRevenueCents: session.total_details?.amount_shipping ?? 0,
    taxCents: session.total_details?.amount_tax ?? 0,
    totalCents: session.amount_total ?? items.reduce((total, item) => total + item.totalCents, 0),
    processorFeeCents,
    orderedAt: new Date(session.created * 1000),
    items,
    ...attributionFromMetadata(session.metadata),
    rawSummary: {
      checkout_session_id: session.id,
      payment_intent_id: objectId(session.payment_intent),
      payment_status: session.payment_status,
      mode: session.mode,
    },
  };
}

export async function retrieveNormalizedStripeOrder(stripe: Stripe, sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: [
      "line_items.data.price.product",
      "payment_intent.latest_charge.balance_transaction",
    ],
  });
  return normalizeStripeCheckoutSession(session);
}

export function stripeRefundInput(refund: Stripe.Refund) {
  return {
    externalPaymentId: objectId(refund.payment_intent),
    externalRefundId: refund.id,
    amountCents: refund.amount,
    currency: refund.currency.toUpperCase(),
    reason: refund.reason ?? null,
    status: refund.status ?? "pending",
    refundedAt: new Date(refund.created * 1000),
  };
}
