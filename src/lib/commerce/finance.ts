import type { MoneyCents } from "./types";

function assertIntegerCents(value: number, label: string) {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be an integer number of cents.`);
  }
}

export function calculateLandedUnitCost(input: {
  quantity: number;
  unitPurchaseCostCents: MoneyCents;
  inboundShippingCents?: MoneyCents;
  dutyAndFeesCents?: MoneyCents;
  otherLandedCostsCents?: MoneyCents;
}): MoneyCents {
  const { quantity, unitPurchaseCostCents } = input;
  const inboundShippingCents = input.inboundShippingCents ?? 0;
  const dutyAndFeesCents = input.dutyAndFeesCents ?? 0;
  const otherLandedCostsCents = input.otherLandedCostsCents ?? 0;

  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }
  for (const [label, value] of Object.entries({
    unitPurchaseCostCents,
    inboundShippingCents,
    dutyAndFeesCents,
    otherLandedCostsCents,
  })) {
    assertIntegerCents(value, label);
    if (value < 0) throw new Error(`${label} cannot be negative.`);
  }

  return Math.round(
    (quantity * unitPurchaseCostCents + inboundShippingCents + dutyAndFeesCents + otherLandedCostsCents) / quantity,
  );
}

export function calculateOrderFinancials(input: {
  subtotalCents: MoneyCents;
  discountCents?: MoneyCents;
  shippingRevenueCents?: MoneyCents;
  taxCents?: MoneyCents;
  refundTotalCents?: MoneyCents;
  productCogsCents?: MoneyCents;
  processorFeeCents?: MoneyCents;
  channelFeeCents?: MoneyCents;
  outboundShippingCostCents?: MoneyCents;
  supplierShippingCostCents?: MoneyCents;
  packagingFulfillmentCostCents?: MoneyCents;
}) {
  const values = {
    subtotalCents: input.subtotalCents,
    discountCents: input.discountCents ?? 0,
    shippingRevenueCents: input.shippingRevenueCents ?? 0,
    taxCents: input.taxCents ?? 0,
    refundTotalCents: input.refundTotalCents ?? 0,
    productCogsCents: input.productCogsCents ?? 0,
    processorFeeCents: input.processorFeeCents ?? 0,
    channelFeeCents: input.channelFeeCents ?? 0,
    outboundShippingCostCents: input.outboundShippingCostCents ?? 0,
    supplierShippingCostCents: input.supplierShippingCostCents ?? 0,
    packagingFulfillmentCostCents: input.packagingFulfillmentCostCents ?? 0,
  };

  for (const [label, value] of Object.entries(values)) {
    assertIntegerCents(value, label);
    if (value < 0) throw new Error(`${label} cannot be negative.`);
  }

  const grossProductSalesCents = values.subtotalCents;
  const netProductSalesCents = Math.max(
    0,
    grossProductSalesCents - values.discountCents - values.refundTotalCents,
  );
  const totalCustomerPaymentsCents = Math.max(
    0,
    values.subtotalCents - values.discountCents + values.shippingRevenueCents + values.taxCents,
  );
  const grossProfitCents = netProductSalesCents - values.productCogsCents;
  const contributionProfitCents =
    grossProfitCents + values.shippingRevenueCents
    - values.processorFeeCents
    - values.channelFeeCents
    - values.outboundShippingCostCents
    - values.supplierShippingCostCents
    - values.packagingFulfillmentCostCents;

  return {
    grossProductSalesCents,
    netProductSalesCents,
    totalCustomerPaymentsCents,
    grossRevenueCents: totalCustomerPaymentsCents,
    netRevenueCents: netProductSalesCents,
    grossProfitCents,
    contributionProfitCents,
  };
}

export function formatCurrency(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function marginPercent(profitCents: number, revenueCents: number) {
  if (revenueCents <= 0) return null;
  return (profitCents / revenueCents) * 100;
}
