const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type ApiVariant = {
  id: string;
  size: string;
  price: number;
  compare_at: number | null;
  stock: number;
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  review_count: number;
  variants: ApiVariant[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // sessionStorage (not localStorage) — cleared when the tab closes, smaller
  // XSS blast radius. For production, prefer an httpOnly cookie set by a
  // Next.js route handler instead of any client-readable storage.
  const token = typeof window !== "undefined" ? sessionStorage.getItem("sirya_token") : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store", // product/stock/variant data must always be fresh
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data as T;
}

export const api = {
  products: {
    list: (category?: string) =>
      request<{ products: ApiProduct[] }>(`/api/products${category ? `?category=${category}` : ""}`),
    get: (slug: string) => request<{ product: ApiProduct }>(`/api/products/${slug}`),
    search: (params: { q?: string; category?: string; minPrice?: number; maxPrice?: number; size?: string }) => {
      const query = new URLSearchParams();
      if (params.q) query.set("q", params.q);
      if (params.category) query.set("category", params.category);
      if (params.minPrice) query.set("minPrice", String(params.minPrice));
      if (params.maxPrice) query.set("maxPrice", String(params.maxPrice));
      if (params.size) query.set("size", params.size);
      return request<{ products: ApiProduct[] }>(`/api/products/search?${query.toString()}`);
    },
  },
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    signup: (name: string, email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string } }>(
        "/api/auth/signup",
        { method: "POST", body: JSON.stringify({ name, email, password }) }
      ),
  },
  orders: {
    create: (items: { variantId: string; quantity: number }[], address: Record<string, string>) =>
      request<{
        orderId: string;
        total: number;
        checkoutUrl: string;
        transactionId: string;
      }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({ items, address }),
      }),
    list: () => request<{ orders: any[] }>("/api/orders"),
  },
  reviews: {
    list: (slug: string) =>
      request<{ reviews: { id: string; rating: number; comment: string | null; created_at: string; user_name: string }[] }>(
        `/api/products/${slug}/reviews`
      ),
    create: (slug: string, rating: number, comment: string) =>
      request<{ created: boolean }>(`/api/products/${slug}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      }),
  },
  wishlist: {
    list: () => request<{ products: ApiProduct[] }>("/api/wishlist"),
    add: (productId: string) =>
      request<{ added: boolean }>("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
    remove: (productId: string) =>
      request<{ removed: boolean }>(`/api/wishlist/${productId}`, { method: "DELETE" }),
  },
  bundleRule: {
    get: () => request<{ minQuantity: number; discountPercent: number }>("/api/bundle-rule"),
  },
  admin: {
    orders: {
      list: () =>
        request<{ orders: { id: string; status: string; total: number; created_at: string; customer_name: string; customer_email: string }[] }>(
          "/api/admin/orders"
        ),
      updateStatus: (id: string, status: string) =>
        request<{ updated: boolean }>(`/api/admin/orders/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
    },
    products: {
      list: () => request<{ products: ApiProduct[] }>("/api/admin/products"),
      create: (product: {
        slug: string;
        name: string;
        category: string;
        description?: string;
        image?: string;
        variants: { size: string; price: number; compareAt?: number; stock: number }[];
      }) =>
        request<{ productId: string }>("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(product),
        }),
      update: (id: string, fields: Partial<{ name: string; category: string; description: string; image: string }>) =>
        request<{ updated: boolean }>(`/api/admin/products/${id}`, {
          method: "PATCH",
          body: JSON.stringify(fields),
        }),
      delete: (id: string) => request<{ deleted: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" }),
    },
    variants: {
      update: (id: string, fields: Partial<{ price: number; compareAt: number | null; stock: number }>) =>
        request<{ updated: boolean }>(`/api/admin/variants/${id}`, {
          method: "PATCH",
          body: JSON.stringify(fields),
        }),
    },
  },
};