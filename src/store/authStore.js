import { create } from "zustand";

const STORAGE_KEY = "frikihost_auth";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export const useAuthStore = create((set, get) => ({
  ...loadInitial(),

  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user });
  },

  setUser: (user) => {
    const { token } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null });
  },

  isAdmin: () => get().user?.role === "admin",
}));
