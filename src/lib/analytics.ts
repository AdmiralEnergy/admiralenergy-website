export type AnalyticsValue = string | number | boolean | Record<string, unknown> | unknown[];
export type AnalyticsPayload = Record<string, AnalyticsValue | null | undefined>;

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

const PII_KEYS = new Set([
  "name",
  "first_name",
  "last_name",
  "email",
  "phone",
  "zip",
  "zip_code",
  "postal_code",
  "address",
  "street_address",
  "notes",
  "message",
]);

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const safePayload = Object.entries(payload).reduce<Record<string, AnalyticsValue>>(
    (safe, [key, value]) => {
      if (PII_KEYS.has(key) || value === null || value === undefined) return safe;
      safe[key] = value;
      return safe;
    },
    {},
  );

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...safePayload });
}
