"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { api} from "@/lib/api";

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, hydrate } = useUserStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user === null) {
      const timeout = setTimeout(() => {
        if (!sessionStorage.getItem("sirya_user")) {
          router.push("/login");
        }
      }, 100);

      return () => clearTimeout(timeout);
    }

    api.orders
      .list()
      .then(({ orders }) => {
        setOrders(orders);
      })
      .catch((error) => {
        console.error("Failed to load orders:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/account"
          className="text-sm text-walnut/60 hover:text-walnut"
        >
          ← Account
        </Link>

        <h1 className="font-display text-2xl text-walnut">
          Order history
        </h1>
      </div>

      {loading ? (
        <p className="text-walnut/60 text-sm">
          Loading orders…
        </p>
      ) : orders.length === 0 ? (
        <div className="border border-line rounded p-8 text-center">
          <p className="text-walnut text-lg mb-2">
            No orders yet
          </p>

          <p className="text-walnut/60 text-sm mb-5">
            Your orders will appear here after you place an order.
          </p>

          <Link
            href="/"
            className="inline-block bg-walnut text-white px-5 py-3 rounded text-sm"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}/success`}
              className="block border border-line rounded p-5 hover:border-walnut transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-walnut">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <p className="text-walnut/60 text-sm mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-US")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-walnut font-medium">
                    ₹{order.total}
                  </p>

                  <p className="text-walnut/60 text-sm capitalize">
                    {order.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}