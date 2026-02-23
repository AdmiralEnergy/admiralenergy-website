"use client";

import { useState } from "react";
import { Loader2, Minus, Plus, ShoppingBag } from "lucide-react";

interface BuyNowButtonProps {
  productId: string;
  productName: string;
  price: number;
  inStock: boolean;
  maxQty?: number;
}

export default function BuyNowButton({
  productId,
  productName,
  price,
  inStock,
  maxQty = 5,
}: BuyNowButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  };

  if (!inStock) {
    return (
      <button
        disabled
        className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Qty:</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || loading}
            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium bg-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
            disabled={quantity >= maxQty || loading}
            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          ${(price * quantity).toFixed(2)} total
        </span>
      </div>

      {/* Buy Now button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-light transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing…
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" /> Buy Now — ${(price * quantity).toFixed(2)}
          </>
        )}
      </button>

      {/* Secure checkout badge */}
      <p className="text-xs text-gray-500 flex items-center gap-1">
        🔒 Secure checkout powered by Stripe
      </p>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
