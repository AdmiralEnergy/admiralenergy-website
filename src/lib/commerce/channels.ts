import type { StripeOrderInput } from "./types";

export interface ChannelHealth {
  key: string;
  label: string;
  status: "connected" | "active" | "not_connected" | "error";
  lastSyncedAt?: Date | null;
  message?: string | null;
}

export interface CommerceChannelAdapter<ExternalOrder = unknown> {
  readonly key: string;
  readonly label: string;
  getHealth(): Promise<ChannelHealth>;
  pullOrders?(options: { createdAfter?: Date; cursor?: string }): Promise<{
    orders: ExternalOrder[];
    nextCursor?: string;
  }>;
  normalizeOrder(order: ExternalOrder): Promise<StripeOrderInput | null>;
}

export const channelCatalog: ChannelHealth[] = [
  {
    key: "stripe",
    label: "Stripe / Admiral website",
    status: process.env.STRIPE_SECRET_KEY ? "connected" : "not_connected",
    message: "Website payments, refunds, fees, webhooks, and protected manual reconciliation.",
  },
  {
    key: "facebook_marketplace",
    label: "Facebook Marketplace",
    status: "active",
    message: "Record Marketplace leads as their own sales source, even when the customer pays through Stripe.",
  },
  {
    key: "d2d_local",
    label: "D2D / Local",
    status: "active",
    message: "Record local delivery, pickup, door-to-door, cash, or externally paid sales.",
  },
  {
    key: "manual",
    label: "Manual / Wholesale",
    status: "active",
    message: "Owner-entered path for wholesale and other real sales that do not originate on the website.",
  },
  {
    key: "tiktok_shop",
    label: "TikTok Shop",
    status: "not_connected",
    message: "Future adapter seam only; no unverified API or OAuth flow is active.",
  },
  {
    key: "meta_shop",
    label: "Meta Shop",
    status: "not_connected",
    message: "Future shop integration only; Facebook Marketplace remains an active manual sales source today.",
  },
];
