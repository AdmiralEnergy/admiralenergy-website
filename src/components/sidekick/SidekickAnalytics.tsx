"use client";

import { useEffect, useRef } from "react";
import { ecommercePayload, pushDataLayer } from "@/components/sidekick/analytics";

interface SidekickAnalyticsProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
}
export default function SidekickAnalytics({ product }: SidekickAnalyticsProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const ecommerce = ecommercePayload(product);
    pushDataLayer("view_item", { ecommerce });
    pushDataLayer("sidekick_view", {
      product_id: product.id,
      product_slug: "sidekick",
      price: product.price,
    });
  }, [product]);

  return null;
}
