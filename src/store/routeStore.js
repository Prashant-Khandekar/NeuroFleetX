import { create } from "zustand";

const useRouteStore = create((set) => ({
  routes: [
  ],

  setRoutes: (data) => set({ routes: data }),
  // Function to add a new route to the list
  
  addRoute: (route) =>
    set((state) => ({
      routes: [
        ...state.routes,
        { id: Date.now(), ...route }
      ],
    })),

  updateRoute: (id, updatedRoute) =>
    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === id ? { ...r, ...updatedRoute } : r
      ),
    })),

  deleteRoute: (id) =>
    set((state) => ({
      routes: state.routes.filter((r) => r.id !== id),
    })),
}));

export default useRouteStore;

