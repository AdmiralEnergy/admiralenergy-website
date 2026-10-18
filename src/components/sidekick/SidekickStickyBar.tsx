"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { pushDataLayer } from "@/components/sidekick/analytics";

interface SidekickStickyBarProps {
  price: number;
}
export default function SidekickStickyBar({ price }: SidekickStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.getElementById("overview");
        const purchase = document.getElementById("buy");
        const secondary = document.getElementById("bulk-orders");

        if (!hero || !purchase || !secondary) return;

        const heroPassed = hero.getBoundingClientRect().bottom < 0;
        const purchaseRect = purchase.getBoundingClientRect();
        const purchaseVisible =
          purchaseRect.top < window.innerHeight * 0.88 && purchaseRect.bottom > 96;
        const consumerJourneyActive = secondary.getBoundingClientRect().top > window.innerHeight;

        setVisible(heroPassed && !purchaseVisible && consumerJourneyActive);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 transition duration-200 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-white/10 bg-admiral-navy p-2.5 text-white shadow-2xl">
        <div className="pl-1">
          <p className="text-sm font-black">SideKick</p>
          <p className="text-sm font-bold text-admiral-gold">${price.toFixed(2)}</p>
        </div>
        <a
          href="#buy"
          onClick={() => pushDataLayer("sidekick_buy_click", { cta_location: "sticky_bar" })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-admiral-gold px-5 py-2 text-sm font-black text-admiral-navy"
          tabIndex={visible ? 0 : -1}
        >
          <ShoppingBag className="h-4 w-4" />
          Get yours
        </a>
      </div>
    </div>
  );
}
