"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ecommercePayload, pushDataLayer } from "@/components/sidekick/analytics";
import { BUSINESS } from "@/lib/business";

interface SidekickCheckoutButtonProps {
  productId: string;
  productName: string;
  price: number;
  inStock: boolean;
  location: string;
  quantity?: number;
  className: string;
  children: ReactNode;
}
export default function SidekickCheckoutButton({
  productId,
  productName,
  price,
  inStock,
  location,
  quantity = 1,
  className,
  children,
}: SidekickCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    const analyticsProduct = {
      id: productId,
      name: productName,
      price,
      quantity,
    };

    pushDataLayer("sidekick_buy_click", {
      cta_location: location,
      product_id: productId,
      price,
      quantity,
    });

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? ((await response.json()) as { url?: string; error?: string })
        : {};

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout could not be started. Please try again.");
      }

      const ecommerce = ecommercePayload(analyticsProduct);
      pushDataLayer("begin_checkout", {
        cta_location: location,
        ecommerce,
      });
      pushDataLayer("sidekick_checkout_start", {
        cta_location: location,
        product_id: productId,
        price,
        quantity,
      });

      window.location.assign(data.url);
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Checkout could not be started. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading || !inStock}
        className={className}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Starting secure checkout…
          </span>
        ) : (
          children
        )}
      </button>
      <div aria-live="polite">
        {error && (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error} If the problem continues, call{" "}
            <a className="font-semibold underline" href={BUSINESS.contact.phoneHref}>
              {BUSINESS.contact.phoneDisplay}
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
