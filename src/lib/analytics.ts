export type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const sidekickAnalyticsItem = {
  item_id: "AE-HS43-001",
  item_name: "SideKick PowerBank",
  item_brand: "SideKick",
  item_category: "Portable Power",
  price: 69.99,
  currency: "USD",
};

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}
