import { create } from "zustand";

const useRouteStore = create((set) => ({
  routes: [
    {
      id: 1,
      name: "Route A",
      origin: "City Center",
      destination: "Tech Park",
      stops: 14,
    },
    {
      id: 2,
      name: "Route B",
      origin: "Metro Station",
      destination: "Industrial Area",
      stops: 9,
    },
  ],

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
