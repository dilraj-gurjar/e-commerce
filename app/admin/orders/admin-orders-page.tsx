"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { api } from "@/lib/api";

type AdminOrder = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
};

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, hydrate } = useUserStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push("/");
      return;
    }
    if (user) {
      api.admin.orders
        .list()
        .then(({ orders }) => setOrders(orders))
        .finally(() => setLoading(false));
    }
  }, [user, router]);

  async function handleStatusChange(orderId: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await api.admin.orders.updateStatus(orderId, status);
    } catch {
      // Revert on failure by refetching
      const { orders } = await api.admin.orders.list();
      setOrders(orders);
    }
  }

  if (!user?.isAdmin) return null;
  if (loading) return <div className="max-w-5xl mx-auto px-6 py-12 text-walnut/60">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl text-walnut mb-8">Orders ({orders.length})</h1>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between border border-line rounded p-4 text-sm">
            <div>
              <p className="font-medium text-walnut">#{o.id.slice(0, 8)}</p>
              <p className="text-walnut/60">{o.customer_name} — {o.customer_email}</p>
              <p className="text-walnut/40 text-xs">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium text-walnut">₹{o.total}</p>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                className="border border-line rounded px-2 py-1.5 text-sm capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
