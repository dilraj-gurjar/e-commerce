import { create } from "zustand";
import { api } from "@/lib/api";

type WishlistState = {
  ids: Set<string>;
  loaded: boolean;
  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set(),
  loaded: false,
  fetch: async () => {
    try {
      const { products } = await api.wishlist.list();
      set({ ids: new Set(products.map((p) => p.id)), loaded: true });
    } catch {
      // Not signed in or request failed — leave wishlist empty, no error UI needed here.
      set({ loaded: true });
    }
  },
  toggle: async (productId) => {
    const current = get().ids;
    const isSaved = current.has(productId);

    // Optimistic update, rolled back if the request fails.
    const next = new Set(current);
    isSaved ? next.delete(productId) : next.add(productId);
    set({ ids: next });

    try {
      if (isSaved) {
        await api.wishlist.remove(productId);
      } else {
        await api.wishlist.add(productId);
      }
    } catch {
      set({ ids: current });
      throw new Error("Sign in to save items to your wishlist.");
    }
  },
}));
