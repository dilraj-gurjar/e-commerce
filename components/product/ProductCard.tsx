"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ApiProduct } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function ProductCard({ product }: { product: ApiProduct }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size);
  const [justAdded, setJustAdded] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { ids, loaded, fetch, toggle } = useWishlistStore();

  useEffect(() => {
    if (!loaded) fetch();
  }, [loaded, fetch]);

  const isSaved = ids.has(product.id);

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 200);
    try {
      await toggle(product.id);
    } catch {
      router.push("/login");
    }
  }

  function handleAddToCart() {
    addItem({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: variant.size,
      price: variant.price,
      image: product.image,
      quantity: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  const variant = product.variants.find((v) => v.size === selectedSize) ?? product.variants[0];
  if (!variant) return null;

  const savePercent = variant.compare_at
    ? Math.round(((variant.compare_at - variant.price) / variant.compare_at) * 100)
    : 0;

  return (
    <div className="group">
      <Link
        href={`/product/${product.slug}`}
        className="block relative rounded overflow-hidden bg-sand aspect-[4/5] shadow-sm group-hover:shadow-md transition-shadow duration-300"
      >
        {savePercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose text-cotton text-xs px-2 py-1 rounded">
            Save {savePercent}%
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isSaved}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-cotton/90 flex items-center justify-center text-lg transition-transform duration-200 ${
            heartPulse ? "scale-125" : "scale-100"
          }`}
        >
          {isSaved ? "♥" : "♡"}
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="mt-3">
        <Link href={`/product/${product.slug}`} className="font-medium text-walnut hover:text-indigo transition-colors">
          {product.name}
        </Link>
        <p className="text-sm text-walnut/60 mt-0.5">
          ★ {product.rating} ({product.review_count})
        </p>

        <div className="flex gap-2 mt-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedSize(v.size)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                selectedSize === v.size
                  ? "border-indigo bg-indigo text-cotton"
                  : "border-line text-walnut/70 hover:border-walnut/40"
              }`}
            >
              {v.size}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium text-walnut">₹{variant.price}</span>
          {variant.compare_at && (
            <span className="text-sm text-walnut/40 line-through">₹{variant.compare_at}</span>
          )}
        </div>

        {variant.stock <= 15 && (
          <p className="text-xs text-rose mt-1">Only {variant.stock} left in stock</p>
        )}

        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full text-sm rounded py-2 transition-colors duration-200 ${
            justAdded ? "bg-indigo text-cotton" : "bg-walnut text-cotton hover:bg-indigo"
          }`}
        >
          {justAdded ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}