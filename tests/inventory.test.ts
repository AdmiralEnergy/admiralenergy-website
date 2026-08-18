import assert from "node:assert/strict";
import test from "node:test";
import { allocateFifo } from "../src/lib/commerce/inventory";

test("FIFO allocation consumes the oldest inventory and snapshots COGS", () => {
  const result = allocateFifo([
    { id: "new", quantityRemaining: 10, landedUnitCostCents: 2400, receivedAt: "2026-02-01" },
    { id: "old", quantityRemaining: 2, landedUnitCostCents: 2100, receivedAt: "2026-01-01" },
  ], 4);
  assert.deepEqual(result.allocations, [
    { lotId: "old", quantity: 2, unitCostCents: 2100, cogsCents: 4200 },
    { lotId: "new", quantity: 2, unitCostCents: 2400, cogsCents: 4800 },
  ]);
  assert.equal(result.cogsCents, 9000);
  assert.equal(result.missingQuantity, 0);
});
test("inventory shortage is explicit and never receives fabricated cost", () => {
  const result = allocateFifo([{ id: "lot", quantityRemaining: 1, landedUnitCostCents: 2000, receivedAt: "2026-01-01" }], 3);
  assert.equal(result.allocatedQuantity, 1);
  assert.equal(result.missingQuantity, 2);
  assert.equal(result.cogsCents, 2000);
});
