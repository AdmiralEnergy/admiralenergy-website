import assert from "node:assert/strict";
import test from "node:test";
import { calculateLandedUnitCost, calculateOrderFinancials, marginPercent } from "../src/lib/commerce/finance";

test("landed unit cost includes inbound costs and uses integer cents", () => {
  assert.equal(calculateLandedUnitCost({ quantity: 10, unitPurchaseCostCents: 2000, inboundShippingCents: 1000, dutyAndFeesCents: 500, otherLandedCostsCents: 500 }), 2200);
});
test("gross and contribution profit follow the documented operational definitions", () => {
  const result = calculateOrderFinancials({ subtotalCents: 6999, discountCents: 500, shippingRevenueCents: 700, taxCents: 520, productCogsCents: 2500, processorFeeCents: 233, channelFeeCents: 100, outboundShippingCostCents: 600, packagingFulfillmentCostCents: 75 });
  assert.deepEqual(result, { grossProductSalesCents: 6999, netProductSalesCents: 6499, totalCustomerPaymentsCents: 7719, grossRevenueCents: 7719, netRevenueCents: 6499, grossProfitCents: 3999, contributionProfitCents: 3691 });
  assert.equal(marginPercent(result.grossProfitCents, result.netProductSalesCents)?.toFixed(2), "61.53");
});

test("refunds reduce net product sales and profit without changing historical COGS", () => {
  const result = calculateOrderFinancials({ subtotalCents: 6999, discountCents: 500, shippingRevenueCents: 700, taxCents: 520, refundTotalCents: 1000, productCogsCents: 2500, processorFeeCents: 233, channelFeeCents: 100, outboundShippingCostCents: 600, packagingFulfillmentCostCents: 75 });
  assert.equal(result.netProductSalesCents, 5499);
  assert.equal(result.grossProfitCents, 2999);
  assert.equal(result.contributionProfitCents, 2691);
});
