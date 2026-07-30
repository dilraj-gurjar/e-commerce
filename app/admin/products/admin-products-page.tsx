"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { api, type ApiProduct } from "@/lib/api";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, hydrate } = useUserStore();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    name: "",
    category: "bedsheets",
    description: "",
    image: "",
    size: "",
    price: "",
    stock: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  function loadProducts() {
    api.admin.products.list().then(({ products }) => setProducts(products)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (user && !user.isAdmin) {
      router.push("/");
      return;
    }
    if (user) loadProducts();
  }, [user, router]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreate() {
    setFormError("");
    setSubmitting(true);
    try {
      await api.admin.products.create({
        slug: form.slug,
        name: form.name,
        category: form.category,
        description: form.description,
        image: form.image,
        variants: [{ size: form.size, price: Number(form.price), stock: Number(form.stock) }],
      });
      setForm({ slug: "", name: "", category: "bedsheets", description: "", image: "", size: "", price: "", stock: "" });
      setShowForm(false);
      loadProducts();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await api.admin.products.delete(id);
    loadProducts();
  }

  async function handleVariantUpdate(variantId: string, field: "price" | "stock", value: string) {
    await api.admin.variants.update(variantId, { [field]: Number(value) });
    loadProducts();
  }

  if (!user?.isAdmin) return null;
  if (loading) return <div className="max-w-5xl mx-auto px-6 py-12 text-walnut/60">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-walnut">Products ({products.length})</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-indigo text-cotton text-sm px-4 py-2 rounded hover:bg-indigo-light"
        >
          {showForm ? "Cancel" : "Add product"}
        </button>
      </div>

      {showForm && (
        <div className="border border-line rounded p-6 mb-8 grid grid-cols-2 gap-4">
          <input placeholder="Slug (e.g. cotton-throw)" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} className="border border-line rounded px-3 py-2 col-span-2" />
          <input placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="border border-line rounded px-3 py-2 col-span-2" />
          <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="border border-line rounded px-3 py-2">
            <option value="bedsheets">Bedsheets</option>
            <option value="comforters">Comforters</option>
            <option value="blankets">Blankets</option>
          </select>
          <input placeholder="Image URL" value={form.image} onChange={(e) => updateField("image", e.target.value)} className="border border-line rounded px-3 py-2" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => updateField("description", e.target.value)} className="border border-line rounded px-3 py-2 col-span-2" rows={2} />
          <input placeholder="Size (e.g. Double)" value={form.size} onChange={(e) => updateField("size", e.target.value)} className="border border-line rounded px-3 py-2" />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="border border-line rounded px-3 py-2" />
          <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} className="border border-line rounded px-3 py-2 col-span-2" />
          {formError && <p className="text-sm text-rose col-span-2">{formError}</p>}
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="bg-walnut text-cotton rounded py-2 col-span-2 hover:bg-indigo disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create product"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="border border-line rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-walnut">{p.name}</p>
                <p className="text-xs text-walnut/50">{p.slug} — {p.category}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-sm text-rose">Delete</button>
            </div>
            <div className="space-y-2">
              {p.variants.map((v) => (
                <div key={v.id} className="flex items-center gap-3 text-sm">
                  <span className="w-20 text-walnut/70">{v.size}</span>
                  <input
                    type="number"
                    defaultValue={v.price}
                    onBlur={(e) => handleVariantUpdate(v.id, "price", e.target.value)}
                    className="w-24 border border-line rounded px-2 py-1"
                  />
                  <span className="text-walnut/40">price</span>
                  <input
                    type="number"
                    defaultValue={v.stock}
                    onBlur={(e) => handleVariantUpdate(v.id, "stock", e.target.value)}
                    className="w-20 border border-line rounded px-2 py-1"
                  />
                  <span className="text-walnut/40">stock</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
