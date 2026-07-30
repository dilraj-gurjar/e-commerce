"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/api";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const [bundleRule, setBundleRule] = useState<{ minQuantity: number; discountPercent: number } | null>(null);

  useEffect(() => {
    api.bundleRule.get().then(setBundleRule).catch(() => {});
  }, []);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = total();
  const qualifiesForBundle = bundleRule ? totalQuantity >= bundleRule.minQuantity : false;
  const remainingForBundle = bundleRule ? Math.max(0, bundleRule.minQuantity - totalQuantity) : 0;
  const estimatedDiscount = qualifiesForBundle && bundleRule
    ? Math.round((subtotal * bundleRule.discountPercent) / 100)
    : 0;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-walnut mb-3">Your cart is empty</h1>
        <p className="text-walnut/60 mb-6">Add something soft to it.</p>
        <Link href="/" className="inline-block bg-indigo text-cotton px-6 py-3 rounded">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl text-walnut mb-6">Your cart</h1>

      {bundleRule && (
        <div className="bg-sand rounded p-4 mb-8">
          {qualifiesForBundle ? (
            <p className="text-sm text-indigo font-medium">
              ✓ You've unlocked {bundleRule.discountPercent}% off — {bundleRule.minQuantity}+ items in your cart.
            </p>
          ) : (
            <p className="text-sm text-walnut/70">
              Add <span className="font-medium text-walnut">{remainingForBundle} more item{remainingForBundle > 1 ? "s" : ""}</span> to
              unlock {bundleRule.discountPercent}% off your order.
            </p>
          )}
          <div className="w-full bg-line rounded-full h-1.5 mt-2">
            <div
              className="bg-indigo h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalQuantity / bundleRule.minQuantity) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 items-center border-b border-line pb-6">
            <div className="w-20 h-20 rounded bg-sand overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-walnut">{item.name}</p>
              <p className="text-sm text-walnut/60">{item.size}</p>
            </div>
            <div className="flex items-center border border-line rounded">
              <button
                onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                className="px-3 py-1"
              >
                −
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                className="px-3 py-1"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-medium text-walnut">₹{item.price * item.quantity}</p>
            <button onClick={() => removeItem(item.variantId)} className="text-sm text-rose">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-1">
        <div className="flex justify-between text-walnut/70">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        {estimatedDiscount > 0 && (
          <div className="flex justify-between text-indigo">
            <span>Bundle discount</span>
            <span>−₹{estimatedDiscount}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2">
          <p className="text-walnut/60 text-sm">Shipping calculated at checkout</p>
          <p className="font-display text-xl text-walnut">₹{subtotal - estimatedDiscount}</p>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block text-center mt-6 bg-indigo text-cotton rounded py-3 hover:bg-indigo-light transition-colors"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
