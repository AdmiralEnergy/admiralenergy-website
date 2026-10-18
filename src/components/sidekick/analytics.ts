export interface SidekickAnalyticsProduct {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export function pushDataLayer(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({ event, ...payload });
}

export function ecommercePayload(product: SidekickAnalyticsProduct) {
  const quantity = product.quantity ?? 1;

  return {
    currency: "USD",
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: "Portable Power",
        price: product.price,
        quantity,
      },
    ],
  };
}
