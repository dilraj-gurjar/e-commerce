"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { api, type ApiProduct } from "@/lib/api";

export default function WishlistPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    api.wishlist
      .list()
      .then(({ products }) => setProducts(products))
      .catch(() => setSignedOut(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-12 text-walnut/60">Loading…</div>;
  }

  if (signedOut) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-walnut mb-3">Sign in to see your wishlist</h1>
        <Link href="/login" className="inline-block bg-indigo text-cotton px-6 py-3 rounded">
          Sign in
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-walnut mb-3">Your wishlist is empty</h1>
        <p className="text-walnut/60 mb-6">Tap the heart on any product to save it here.</p>
        <Link href="/" className="inline-block bg-indigo text-cotton px-6 py-3 rounded">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl text-walnut mb-8">Your wishlist</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
