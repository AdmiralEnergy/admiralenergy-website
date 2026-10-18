"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import SidekickCheckoutButton from "@/components/sidekick/SidekickCheckoutButton";
import { commercePolicies } from "@/data/commerce";

interface SidekickPurchaseModuleProps {
  product: {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  };
  includedItems: string[];
}

export default function SidekickPurchaseModule({
  product,
  includedItems,
}: SidekickPurchaseModuleProps) {
  const [quantity, setQuantity] = useState(1);
  const total = product.price * quantity;

  return (
    <section id="buy" className="scroll-mt-28 bg-[#101820] py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-8">
        <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-white/10 bg-admiral-navy sm:min-h-[520px]">
          <Image
            src="/images/sidekick/in-hand-real-20260812.webp"
            alt="SideKick PowerBank beside its retail box for size context"
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-admiral-gold">
            Everything you need to decide
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Keep personal power within reach.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
            One practical device for everyday charging, built-in lighting, and realistic backup
            input options when normal power is not convenient.
          </p>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/65">{product.name}</p>
                <p className="mt-1 text-4xl font-black">${product.price.toFixed(2)}</p>
              </div>
              <p className="inline-flex items-center gap-2 text-sm font-bold text-admiral-gold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                {product.inStock ? "Available to order" : "Currently unavailable"}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-white">Quantity</p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="inline-flex overflow-hidden rounded-xl border border-white/20 bg-[#0a1118]">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity === 1}
                    className="inline-flex min-h-12 min-w-12 items-center justify-center text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <output
                    className="inline-flex min-h-12 min-w-14 items-center justify-center border-x border-white/20 px-3 font-black"
                    aria-label={`Quantity ${quantity}`}
                  >
                    {quantity}
                  </output>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(5, current + 1))}
                    disabled={quantity === 5}
                    className="inline-flex min-h-12 min-w-12 items-center justify-center text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-white/65">${total.toFixed(2)} total</p>
              </div>
            </div>

            <div className="mt-6">
              <SidekickCheckoutButton
                productId={product.id}
                productName={product.name}
                price={product.price}
                inStock={product.inStock}
                location="purchase_module"
                quantity={quantity}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-admiral-gold px-6 py-4 text-base font-black text-admiral-navy transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-65"
              >
                <ShoppingBag className="h-5 w-5" />
                Buy SideKick — ${total.toFixed(2)}
              </SidekickCheckoutButton>
            </div>
            <p className="mt-3 text-center text-xs text-white/60">
              Secure hosted checkout through Stripe. No account required.
            </p>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {includedItems.map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm leading-6 text-white/78">
                <Check className="mt-1 h-4 w-4 shrink-0 text-admiral-gold" />
                {item}
              </p>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-admiral-gold" />
            <p className="text-sm leading-6 text-white/70">
              {commercePolicies.shipping.label}, {commercePolicies.returns.label}, and a{" "}
              {commercePolicies.sidekickWarranty.label}. Read the{" "}
              <Link className="font-semibold text-white underline" href={commercePolicies.returns.href}>
                return policy
              </Link>{" "}
              before checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
