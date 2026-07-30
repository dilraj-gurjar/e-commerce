import ProductCard from "@/components/product/ProductCard";
import { api } from "@/lib/api";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { products } = await api.products.list(params.slug);
  const title = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-walnut mb-2">{title}</h1>
      <p className="text-walnut/60 mb-8">{products.length} products</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        {/* Filters */}
        <aside className="space-y-8">
          <div>
            <p className="font-medium text-walnut mb-3">Size</p>
            {["Single", "Double", "King"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-walnut/80 mb-2">
                <input type="checkbox" className="accent-indigo" /> {s}
              </label>
            ))}
          </div>
          <div>
            <p className="font-medium text-walnut mb-3">Price</p>
            {["Under ₹1,500", "₹1,500 – ₹2,500", "Above ₹2,500"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm text-walnut/80 mb-2">
                <input type="checkbox" className="accent-indigo" /> {s}
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div>
          {products.length === 0 ? (
            <p className="text-walnut/60">No products in this category yet.</p>
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
