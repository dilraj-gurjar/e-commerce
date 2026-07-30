import { create } from "zustand";

type User = { id: string; name: string; email: string; isAdmin?: boolean };

type UserState = {
  user: User | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setSession: (user, token) => {
    sessionStorage.setItem("sirya_token", token);
    sessionStorage.setItem("sirya_user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    sessionStorage.removeItem("sirya_token");
    sessionStorage.removeItem("sirya_user");
    set({ user: null });
  },
  // Call on app mount to restore session after a page refresh (sessionStorage
  // survives refresh, just not a closed tab).
  hydrate: () => {
    const raw = sessionStorage.getItem("sirya_user");
    if (raw) set({ user: JSON.parse(raw) });
  },
}));