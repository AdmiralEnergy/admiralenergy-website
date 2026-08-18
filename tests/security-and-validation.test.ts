import assert from "node:assert/strict";
import test from "node:test";
import { createCsv } from "../src/lib/commerce/csv";
import { createSessionToken, verifySessionToken } from "../src/lib/commerce/session";
import { costAdjustmentSchema, manualOrderSchema } from "../src/lib/commerce/validation";
import { webhookClaimIsEligible } from "../src/lib/commerce/webhook";

test("signed admin sessions verify with the correct secret and reject another secret", async () => {
  const secret = "a-secure-test-session-secret-at-least-32-chars";
  const token = await createSessionToken({ email: "owner@example.com", role: "commerce_admin" }, secret);
  assert.deepEqual(await verifySessionToken(token, secret), { email: "owner@example.com", role: "commerce_admin" });
  assert.equal(await verifySessionToken(token, "another-secure-session-secret-at-least-32"), null);
});

test("webhook claim rules prevent processed duplicates and recover stale attempts", () => {
  const now = new Date("2026-08-17T12:00:00Z");
  assert.equal(webhookClaimIsEligible({ existingStatus: null, now }), true);
  assert.equal(webhookClaimIsEligible({ existingStatus: "processed", now }), false);
  assert.equal(webhookClaimIsEligible({ existingStatus: "failed", now }), true);
  assert.equal(webhookClaimIsEligible({ existingStatus: "processing", receivedAt: new Date("2026-08-17T11:40:00Z"), now }), true);
  assert.equal(webhookClaimIsEligible({ existingStatus: "processing", receivedAt: new Date("2026-08-17T11:59:00Z"), now }), false);
});

test("manual source, Stripe linkage, and dropship historical cost survive validation", () => {
  const base = { sourceChannel: "facebook_marketplace", paymentStatus: "paid", paymentProvider: "cash", fulfillmentMethod: "dropship", shippingCountry: "US", productId: "hs-43-solar-power-bank", quantity: 1, unitPriceCents: 6999, discountCents: 0, shippingRevenueCents: 0, taxCents: 0, processorFeeCents: 0, channelFeeCents: 0, outboundShippingCostCents: 0, packagingFulfillmentCostCents: 0, supplierShippingCostCents: 500, orderedAt: new Date() };
  assert.equal(manualOrderSchema.safeParse(base).success, false);
  const parsed = manualOrderSchema.parse({ ...base, supplierUnitCostCents: 2500, paymentProvider: "stripe", externalOrderId: "cs_test_123", externalPaymentId: "pi_test_123" });
  assert.equal(parsed.sourceChannel, "facebook_marketplace");
  assert.equal(parsed.supplierUnitCostCents, 2500);
  assert.equal(parsed.paymentProvider, "stripe");
  assert.equal(parsed.externalOrderId, "cs_test_123");
  assert.equal(parsed.externalPaymentId, "pi_test_123");
});

test("historical COGS corrections require a specific audit reason", () => {
  assert.equal(costAdjustmentSchema.safeParse({ orderItemId: "item-123", cogsCents: 4600, reason: "fix" }).success, false);
  const correction = costAdjustmentSchema.parse({ orderItemId: "item-123", cogsCents: 4600, reason: "Verified supplier invoice" });
  assert.equal(correction.cogsCents, 4600);
});

test("CSV export neutralizes spreadsheet formulas", () => {
  const csv = createCsv([{ header: "Customer", value: (row) => row.customer }], [{ customer: "=HYPERLINK(\"bad\")" }]);
  assert.match(csv, /'=HYPERLINK/);
});
