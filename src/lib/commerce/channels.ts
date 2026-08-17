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
    key: "manual",
    label: "Manual / Marketplace",
    status: "active",
    message: "Operational entry path for Facebook Marketplace, local/D2D, cash, wholesale, and other sales.",
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
    message: "Future adapter seam only; Facebook Marketplace remains a manual source today.",
  },
];
