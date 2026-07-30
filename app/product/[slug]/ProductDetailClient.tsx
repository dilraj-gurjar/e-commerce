"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiProduct } from "@/lib/api";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

type Review = { id: string; rating: number; comment: string | null; created_at: string; user_name: string };

export default function ProductDetailClient({ product }: { product: ApiProduct }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.reviews.list(product.slug).then(({ reviews }) => setReviews(reviews));
  }, [product.slug]);

  async function submitReview() {
    setReviewError("");
    setSubmitting(true);
    try {
      await api.reviews.create(product.slug, newRating, newComment);
      const { reviews } = await api.reviews.list(product.slug);
      setReviews(reviews);
      setNewComment("");
    } catch (err: any) {
      if (err.message?.includes("Sign in")) {
        router.push("/login");
      } else {
        setReviewError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const variant = product.variants.find((v) => v.size === selectedSize) ?? product.variants[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="aspect-square rounded bg-sand overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <h1 className="font-display text-3xl text-walnut">{product.name}</h1>
        <p className="text-sm text-walnut/60 mt-2">
          ★ {product.rating} ({product.review_count} reviews)
        </p>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl font-medium text-walnut">₹{variant.price}</span>
          {variant.compare_at && (
            <span className="text-walnut/40 line-through">₹{variant.compare_at}</span>
          )}
        </div>

        <p className="text-walnut/70 mt-4">{product.description}</p>

        <div className="mt-6">
          <p className="font-medium text-walnut mb-2">Size</p>
          <div className="flex gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedSize(v.size)}
                className={`px-4 py-2 rounded border text-sm ${
                  selectedSize === v.size
                    ? "border-indigo bg-indigo text-cotton"
                    : "border-line text-walnut/70"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {variant.stock <= 15 && (
          <p className="text-sm text-rose mt-4">Hurry, only {variant.stock} left in stock!</p>
        )}

        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center border border-line rounded">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2" aria-label="Decrease quantity">−</button>
            <span className="px-4">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2" aria-label="Increase quantity">+</button>
          </div>
          <button
            onClick={() =>
              addItem({
                variantId: variant.id,
                productId: product.id,
                slug: product.slug,
                name: product.name,
                size: variant.size,
                price: variant.price,
                image: product.image,
                quantity: qty,
              })
            }
            className="flex-1 bg-walnut text-cotton rounded py-3 hover:bg-indigo transition-colors"
          >
            Add to cart
          </button>
        </div>

        <ul className="text-sm text-walnut/60 mt-8 space-y-1">
          <li>Free shipping, ships within 1–2 business days</li>
          <li>7-day easy returns</li>
        </ul>

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-medium text-walnut mb-4">Reviews ({reviews.length})</h2>

          <div className="mb-6 border border-line rounded p-4">
            <p className="text-sm font-medium text-walnut mb-2">Write a review</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setNewRating(n)}
                  className={`text-xl ${n <= newRating ? "text-turmeric" : "text-line"}`}
                  aria-label={`${n} star`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts (optional)"
              className="w-full border border-line rounded px-3 py-2 text-sm mb-2"
              rows={3}
            />
            {reviewError && <p className="text-sm text-rose mb-2">{reviewError}</p>}
            <button
              onClick={submitReview}
              disabled={submitting}
              className="bg-walnut text-cotton text-sm rounded px-4 py-2 hover:bg-indigo transition-colors disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post review"}
            </button>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-walnut/60">No reviews yet — be the first to write one.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border-b border-line pb-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-walnut text-sm">{r.user_name}</p>
                    <p className="text-turmeric text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                  </div>
                  {r.comment && <p className="text-sm text-walnut/70 mt-1">{r.comment}</p>}
                  <p className="text-xs text-walnut/40 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}