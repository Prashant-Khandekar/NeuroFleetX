import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  token: null,
  role: null,

  login: (userData, token, role) => {
    // Save to store
    set({ user: userData, token, role });

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Reset store
    set({ user: null, token: null, role: null });
  },

  loadUser: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      set({ user, token, role });
    }
  },
}));

export default useUserStore;
