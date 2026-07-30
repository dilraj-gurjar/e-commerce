import { useUserStore } from "@/store/userStore";

export function useAuth() {
  const {
    user,
    hydrate,
    logout,
  } = useUserStore();

  return {
    user,
    isAuthenticated: !!user,
    hydrate,
    logout,
  };
}