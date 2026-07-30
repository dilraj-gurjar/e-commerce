"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { api } from "@/lib/api";
import Link from "next/link";

type Order = { id: string; status: string; total: number; created_at: string };

export default function AccountPage() {
  const router = useRouter();
  const { user, hydrate, logout } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user === null) {
      const timeout = setTimeout(() => {
        if (!sessionStorage.getItem("sirya_user")) router.push("/login");
      }, 100);
      return () => clearTimeout(timeout);
    }
    api.orders
      .list()
      .then(({ orders }) => setOrders(orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-walnut">Hi, {user.name}</h1>
          <p className="text-walnut/60 text-sm">{user.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-sm text-rose"
        >
          Sign out
        </button>
      </div>


      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-walnut">
          Order history
        </h2>

        <Link
          href="/account/orders"
          className="text-sm text-walnut underline"
        >
          View all
        </Link>
      </div>
      {loading ? (
        <p className="text-walnut/60 text-sm">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-walnut/60 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="flex justify-between border border-line rounded p-4 text-sm">
              <div>
                <p className="font-medium text-walnut">#{o.id.slice(0, 8)}</p>
                <p className="text-walnut/60">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-walnut">₹{o.total}</p>
                <p className="text-walnut/60 capitalize">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
