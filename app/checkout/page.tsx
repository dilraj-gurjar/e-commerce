"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const [bundleRule, setBundleRule] = useState<{ minQuantity: number; discountPercent: number } | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.bundleRule.get().then(setBundleRule).catch(() => {});
  }, []);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = total();
  const estimatedDiscount =
    bundleRule && totalQuantity >= bundleRule.minQuantity
      ? Math.round((subtotal * bundleRule.discountPercent) / 100)
      : 0;

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePay() {
    setError("");
    setLoading(true);
    try {
      const { checkoutUrl } = await api.orders.create(
        items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        form
      );
      // Hands off to the external payment gateway; it redirects back to
      // PAYMENT_REDIRECT_URL (see backend .env) once payment completes.
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || "Couldn't place your order. Check your details and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_360px] gap-12">
      <div>
        <h1 className="font-display text-2xl text-walnut mb-8">Checkout</h1>

        <section className="mb-8">
          <h2 className="font-medium text-walnut mb-4">Delivery address</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="border border-line rounded px-3 py-2 col-span-2"
            />
            <input
              placeholder="Address"
              value={form.line1}
              onChange={(e) => updateField("line1", e.target.value)}
              className="border border-line rounded px-3 py-2 col-span-2"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="border border-line rounded px-3 py-2"
            />
            <input
              placeholder="PIN code"
              value={form.pincode}
              onChange={(e) => updateField("pincode", e.target.value)}
              className="border border-line rounded px-3 py-2"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="border border-line rounded px-3 py-2 col-span-2"
            />
          </div>
        </section>

        <section>
          <h2 className="font-medium text-walnut mb-4">Payment</h2>
          <div className="border border-line rounded p-4 text-sm text-walnut/70">
            Razorpay checkout (UPI, cards, wallets) opens here once payments are wired up.
            For now, placing the order marks it as pending in the backend.
          </div>
        </section>

        {error && <p className="text-sm text-rose mt-4">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-8 w-full bg-indigo text-cotton rounded py-3 hover:bg-indigo-light transition-colors disabled:opacity-60"
        >
          {loading ? "Placing order…" : `Place order — ₹${subtotal - estimatedDiscount}`}
        </button>
      </div>

      <aside className="bg-sand rounded p-6 h-fit">
        <h2 className="font-medium text-walnut mb-4">Order summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span className="text-walnut/80">
                {item.name} ({item.size}) × {item.quantity}
              </span>
              <span className="text-walnut">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm text-walnut/70">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {estimatedDiscount > 0 && (
            <div className="flex justify-between text-sm text-indigo">
              <span>Bundle discount</span>
              <span>−₹{estimatedDiscount}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-walnut pt-1">
            <span>Total</span>
            <span>₹{subtotal - estimatedDiscount}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}