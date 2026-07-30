"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { api, type ApiProduct } from "@/lib/api";

const CATEGORIES = ["bedsheets", "comforters", "blankets"];
const SIZES = ["Single", "Double", "King", "Standard"];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(() => {
    setLoading(true);
    api.products
      .search({
        q: query || undefined,
        category: category || undefined,
        size: size || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      })
      .then(({ products }) => setProducts(products))
      .finally(() => setLoading(false));
  }, [query, category, size, minPrice, maxPrice]);

  // Run search on mount and whenever filters change; keep the URL in sync
  // so results are shareable/bookmarkable.
  useEffect(() => {
    runSearch();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (size) params.set("size", size);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.replace(`/search?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, size, minPrice, maxPrice]);

  function clearFilters() {
    setCategory("");
    setSize("");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for bedsheets, comforters, blankets…"
        className="w-full border border-line rounded px-4 py-3 mb-8"
        autoFocus
      />

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-walnut">Filters</p>
              <button onClick={clearFilters} className="text-xs text-indigo hover:underline">
                Clear
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-walnut mb-2">Category</p>
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm text-walnut/80 mb-2 capitalize">
                <input
                  type="radio"
                  name="category"
                  checked={category === c}
                  onChange={() => setCategory(c)}
                  className="accent-indigo"
                />
                {c}
              </label>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-walnut mb-2">Size</p>
            {SIZES.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-walnut/80 mb-2">
                <input
                  type="radio"
                  name="size"
                  checked={size === s}
                  onChange={() => setSize(s)}
                  className="accent-indigo"
                />
                {s}
              </label>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-walnut mb-2">Price range</p>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-line rounded px-2 py-1.5 text-sm"
              />
              <span className="text-walnut/40">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-line rounded px-2 py-1.5 text-sm"
              />
            </div>
          </div>
        </aside>

        <div>
          <p className="text-walnut/60 text-sm mb-6">
            {loading ? "Searching…" : `${products.length} result${products.length === 1 ? "" : "s"}`}
          </p>
          {!loading && products.length === 0 ? (
            <p className="text-walnut/60">No products match your search.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
