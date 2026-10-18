"use client";

import { useEffect, useRef } from "react";
import { pushDataLayer } from "@/components/sidekick/analytics";

interface PurchaseEventProps {
  transactionId: string;
  value: number;
  quantity: number;
  productId: string;
  productName: string;
}

export default function PurchaseEvent({
  transactionId,
  value,
  quantity,
  productId,
  productName,
}: PurchaseEventProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const storageKey = `admiral_purchase_${transactionId}`;
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // The in-memory guard still prevents duplicate events during this mount
      // when storage is unavailable in a strict privacy mode.
    }

    pushDataLayer("purchase", {
      ecommerce: {
        transaction_id: transactionId,
        currency: "USD",
        value,
        items: [
          {
            item_id: productId,
            item_name: productName,
            item_category: "Portable Power",
            price: quantity > 0 ? value / quantity : value,
            quantity,
          },
        ],
      },
    });
  }, [productId, productName, quantity, transactionId, value]);

  return null;
}
