export type MoneyCents = number;

export type SourceChannel = "website" | "manual" | "facebook_marketplace" | "d2d_local" | "marketplace" | "wholesale" | "other";
export type FulfillmentMethod = "admiral_inventory" | "dropship" | "local_pickup" | "third_party_fulfillment";
export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "failed"
  | "canceled";
export type FulfillmentStatus = "unfulfilled" | "ready" | "shipped" | "delivered" | "canceled" | "returned";
export type CostStatus = "complete" | "missing_cost";

export interface ProductRecord {
  id: string;
  name: string;
  sku: string;
  slug: string;
  status: "active" | "draft" | "archived";
  description: string | null;
  selling_price_cents: number;
  currency: string;
  low_stock_threshold: number | null;
  active: boolean;
  inventory_on_hand: number;
  inventory_value_cents: number;
}

export interface OrderSummary {
  id: string;
  order_number: string;
  source_channel: SourceChannel;
  acquisition_channel: string | null;
  payment_provider: string | null;
  external_order_id: string | null;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  fulfillment_method: FulfillmentMethod;
  customer_name: string | null;
  customer_email: string | null;
  total_cents: number;
  refund_total_cents: number;
  gross_profit_cents: number;
  contribution_profit_cents: number;
  cost_status: CostStatus;
  ordered_at: string;
  products?: string | null;
  units?: number;
}

export interface DashboardMetrics {
  gross_product_sales_cents: number;
  discount_cents: number;
  gross_revenue_cents: number;
  shipping_revenue_cents: number;
  tax_cents: number;
  net_revenue_cents: number;
  order_count: number;
  units_sold: number;
  product_cogs_cents: number;
  gross_profit_cents: number;
  contribution_profit_cents: number;
  refund_total_cents: number;
  processor_fee_cents: number;
  channel_fee_cents: number;
  shipping_cost_cents: number;
  packaging_cost_cents: number;
  unique_customer_count: number;
  missing_cost_order_count: number;
}

export interface InventoryLotInput {
  id: string;
  productId: string;
  supplierId?: string | null;
  reference?: string | null;
  supplierProductUrl?: string | null;
  supplierOrderNumber?: string | null;
  purchasedAt?: Date | null;
  quantityPurchased?: number | null;
  expectedArrivalAt?: Date | null;
  receivedAt: Date;
  quantityReceived: number;
  unitPurchaseCostCents: number;
  inboundShippingCents: number;
  dutyAndFeesCents: number;
  otherLandedCostsCents: number;
  fulfillmentStrategy?: "stocked_local" | "dropship" | "third_party_fulfillment" | "other";
  location?: string | null;
  notes?: string | null;
}

export interface FifoLot {
  id: string;
  quantityRemaining: number;
  landedUnitCostCents: number;
  receivedAt: Date | string;
}

export interface FifoAllocation {
  lotId: string;
  quantity: number;
  unitCostCents: number;
  cogsCents: number;
}

export interface FifoResult {
  allocations: FifoAllocation[];
  allocatedQuantity: number;
  missingQuantity: number;
  cogsCents: number;
}

export interface AttributionData {
  acquisitionChannel?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  landingPage?: string | null;
  referrer?: string | null;
  promoCode?: string | null;
}

export interface ManualOrderInput extends AttributionData {
  sourceChannel: SourceChannel;
  paymentStatus: PaymentStatus;
  paymentProvider?: string | null;
  externalOrderId?: string | null;
  externalPaymentId?: string | null;
  unmatchedTransactionId?: string | null;
  fulfillmentMethod: FulfillmentMethod;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry: string;
  productId: string;
  inventoryLotId?: string | null;
  quantity: number;
  unitPriceCents: number;
  discountCents: number;
  shippingRevenueCents: number;
  taxCents: number;
  processorFeeCents: number;
  channelFeeCents: number;
  outboundShippingCostCents: number;
  packagingFulfillmentCostCents: number;
  supplierId?: string | null;
  supplierUnitCostCents?: number | null;
  supplierShippingCostCents: number;
  supplierOrderReference?: string | null;
  supplierPurchasedAt?: Date | null;
  supplierTrackingNumber?: string | null;
  deliveryNotes?: string | null;
  orderedAt: Date;
  notes?: string | null;
}

export interface StripeOrderInput extends AttributionData {
  externalOrderId: string;
  externalPaymentId: string | null;
  paymentStatus: PaymentStatus;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string;
  currency: string;
  subtotalCents: number;
  discountCents: number;
  shippingRevenueCents: number;
  taxCents: number;
  totalCents: number;
  processorFeeCents: number;
  orderedAt: Date;
  items: Array<{
    externalLineItemId: string | null;
    productId: string | null;
    productName: string;
    sku: string | null;
    quantity: number;
    unitPriceCents: number;
    discountCents: number;
    totalCents: number;
  }>;
  rawSummary?: Record<string, unknown>;
}
