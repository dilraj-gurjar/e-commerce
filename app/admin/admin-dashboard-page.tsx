"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

export default function AdminPage() {
  const router = useRouter();
  const { user, hydrate } = useUserStore();

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
    if (user && !user.isAdmin) router.push("/");
  }, [user, router]);

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl text-walnut mb-8">Admin</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link href="/admin/orders" className="border border-line rounded p-6 hover:border-indigo transition-colors">
          <p className="font-medium text-walnut">Orders</p>
          <p className="text-sm text-walnut/60 mt-1">View all orders and update status.</p>
        </Link>
        <Link href="/admin/products" className="border border-line rounded p-6 hover:border-indigo transition-colors">
          <p className="font-medium text-walnut">Products</p>
          <p className="text-sm text-walnut/60 mt-1">Add products, edit price and stock.</p>
        </Link>
      </div>
    </div>
  );
}
