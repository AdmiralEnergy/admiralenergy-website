import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().transform((value) => value || null);
const optionalShortText = z.string().trim().max(160).optional().transform((value) => value || null);
const cents = z.coerce.number().int().min(0).max(100_000_000);

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(1024),
  returnTo: z.string().optional(),
});

export const inventoryLotSchema = z.object({
  productId: z.string().trim().min(1).max(100),
  inventoryLotId: optionalShortText,
  supplierId: optionalShortText,
  reference: optionalShortText,
  supplierProductUrl: z.union([z.literal(""), z.string().url().max(500)]).optional().transform((value) => value || null),
  supplierOrderNumber: optionalShortText,
  purchasedAt: z.union([z.literal(""), z.coerce.date()]).optional().transform((value) => value === "" || value === undefined ? null : value),
  quantityPurchased: z.union([z.literal(""), z.coerce.number().int().positive().max(1_000_000)]).optional().transform((value) => value === "" || value === undefined ? null : value),
  expectedArrivalAt: z.union([z.literal(""), z.coerce.date()]).optional().transform((value) => value === "" || value === undefined ? null : value),
  receivedAt: z.coerce.date(),
  quantityReceived: z.coerce.number().int().positive().max(1_000_000),
  unitPurchaseCostCents: cents,
  inboundShippingCents: cents.default(0),
  dutyAndFeesCents: cents.default(0),
  otherLandedCostsCents: cents.default(0),
  fulfillmentStrategy: z.enum(["stocked_local", "dropship", "third_party_fulfillment", "other"]).default("stocked_local"),
  location: optionalShortText,
  notes: optionalText,
});

export const inventoryAdjustmentSchema = z.object({
  productId: z.string().trim().min(1).max(100),
  quantityDelta: z.coerce.number().int().min(-1_000_000).max(1_000_000).refine((value) => value !== 0),
  reason: z.string().trim().min(3).max(500),
});

export const manualOrderSchema = z.object({
  sourceChannel: z.enum(["manual", "facebook_marketplace", "d2d_local", "marketplace", "wholesale", "other"]).default("manual"),
  acquisitionChannel: optionalShortText,
  paymentStatus: z.enum(["unpaid", "pending", "paid"]).default("paid"),
  paymentProvider: z.enum(["stripe", "cash", "external_marketplace", "other", "unpaid"]).default("other"),
  externalOrderId: optionalShortText,
  externalPaymentId: optionalShortText,
  unmatchedTransactionId: optionalShortText,
  fulfillmentMethod: z.enum(["admiral_inventory", "dropship", "local_pickup", "third_party_fulfillment"]),
  customerName: optionalShortText,
  customerEmail: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().transform((value) => value || null),
  customerPhone: optionalShortText,
  shippingAddressLine1: optionalShortText,
  shippingAddressLine2: optionalShortText,
  shippingCity: optionalShortText,
  shippingState: optionalShortText,
  shippingPostalCode: optionalShortText,
  shippingCountry: z.string().trim().length(2).default("US"),
  productId: z.string().trim().min(1).max(100),
  quantity: z.coerce.number().int().positive().max(10_000),
  unitPriceCents: cents,
  discountCents: cents.default(0),
  shippingRevenueCents: cents.default(0),
  taxCents: cents.default(0),
  processorFeeCents: cents.default(0),
  channelFeeCents: cents.default(0),
  outboundShippingCostCents: cents.default(0),
  packagingFulfillmentCostCents: cents.default(0),
  supplierId: optionalShortText,
  supplierUnitCostCents: z.union([z.literal(""), cents]).optional().transform((value) => value === "" || value === undefined ? null : value),
  supplierShippingCostCents: cents.default(0),
  supplierOrderReference: optionalShortText,
  supplierPurchasedAt: z.union([z.literal(""), z.coerce.date()]).optional().transform((value) => value === "" || value === undefined ? null : value),
  supplierTrackingNumber: optionalShortText,
  deliveryNotes: optionalText,
  orderedAt: z.coerce.date(),
  utmSource: optionalShortText,
  utmMedium: optionalShortText,
  utmCampaign: optionalShortText,
  utmTerm: optionalShortText,
  utmContent: optionalShortText,
  landingPage: optionalShortText,
  referrer: optionalShortText,
  promoCode: optionalShortText,
  notes: optionalText,
}).superRefine((order, context) => {
  if (order.discountCents > order.unitPriceCents * order.quantity) {
    context.addIssue({ code: "custom", path: ["discountCents"], message: "Discount cannot exceed merchandise subtotal." });
  }
  if (order.fulfillmentMethod === "dropship" && order.supplierUnitCostCents === null) {
    context.addIssue({ code: "custom", path: ["supplierUnitCostCents"], message: "Dropship orders require the supplier unit cost." });
  }
});

export const fulfillmentSchema = z.object({
  fulfillmentStatus: z.enum(["unfulfilled", "ready", "shipped", "delivered", "canceled", "returned"]),
  carrier: optionalShortText,
  trackingNumber: optionalShortText,
  trackingUrl: z.union([z.literal(""), z.string().url().max(500)]).optional().transform((value) => value || null),
  supplierPurchasedAt: z.union([z.literal(""), z.coerce.date()]).optional().transform((value) => value === "" || value === undefined ? null : value),
  supplierTrackingNumber: optionalShortText,
  deliveryNotes: optionalText,
  returnDisposition: z.enum(["not_returned", "restocked", "damaged", "lost"]).optional().nullable(),
});

export const costAdjustmentSchema = z.object({
  orderItemId: z.string().trim().min(1).max(100),
  cogsCents: cents,
  reason: z.string().trim().min(5).max(500),
});

export const supplierSchema = z.object({
  name: z.string().trim().min(2).max(160),
  platform: optionalShortText,
  websiteUrl: z.union([z.literal(""), z.string().url().max(500)]).optional().transform((value) => value || null),
  contactName: optionalShortText,
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional().transform((value) => value || null),
  phone: optionalShortText,
  notes: optionalText,
});

export const productSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9][a-z0-9_-]{2,99}$/),
  name: z.string().trim().min(2).max(160),
  sku: z.string().trim().min(2).max(100),
  slug: z.string().trim().regex(/^[a-z0-9][a-z0-9-]{1,99}$/),
  description: optionalText,
  sellingPriceCents: cents,
  currency: z.literal("USD").default("USD"),
  lowStockThreshold: z.union([z.literal(""), z.coerce.number().int().min(0).max(1_000_000)]).optional().transform((value) => value === "" || value === undefined ? null : value),
  status: z.enum(["active", "draft", "archived"]).default("draft"),
});

export const orderFiltersSchema = z.object({
  q: z.string().trim().max(160).optional().default(""),
  source: z.enum(["all", "website", "manual", "facebook_marketplace", "d2d_local", "marketplace", "wholesale", "other"]).optional().default("all"),
  payment: z.enum(["all", "unpaid", "pending", "paid", "partially_refunded", "refunded", "failed", "canceled"]).optional().default("all"),
  fulfillment: z.enum(["all", "unfulfilled", "ready", "shipped", "delivered", "canceled", "returned"]).optional().default("all"),
  product: z.string().trim().max(100).optional().default("all"),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().min(10).max(100).optional().default(25),
});
