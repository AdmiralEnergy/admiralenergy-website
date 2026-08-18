import type { FifoLot, FifoResult } from "./types";

export function allocateFifo(lots: FifoLot[], requestedQuantity: number): FifoResult {
  if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity <= 0) {
    throw new Error("Requested quantity must be a positive integer.");
  }

  const orderedLots = [...lots]
    .filter((lot) => lot.quantityRemaining > 0)
    .sort((a, b) => {
      const dateDifference = new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime();
      return dateDifference || a.id.localeCompare(b.id);
    });

  let remaining = requestedQuantity;
  const allocations = [];
  let cogsCents = 0;

  for (const lot of orderedLots) {
    if (remaining === 0) break;
    if (!Number.isSafeInteger(lot.quantityRemaining) || lot.quantityRemaining < 0) {
      throw new Error(`Lot ${lot.id} has an invalid remaining quantity.`);
    }
    if (!Number.isSafeInteger(lot.landedUnitCostCents) || lot.landedUnitCostCents < 0) {
      throw new Error(`Lot ${lot.id} has an invalid landed unit cost.`);
    }

    const quantity = Math.min(remaining, lot.quantityRemaining);
    const allocationCogs = quantity * lot.landedUnitCostCents;
    allocations.push({
      lotId: lot.id,
      quantity,
      unitCostCents: lot.landedUnitCostCents,
      cogsCents: allocationCogs,
    });
    cogsCents += allocationCogs;
    remaining -= quantity;
  }

  return {
    allocations,
    allocatedQuantity: requestedQuantity - remaining,
    missingQuantity: remaining,
    cogsCents,
  };
}
