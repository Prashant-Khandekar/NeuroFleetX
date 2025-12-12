import { create } from "zustand";
import { nanoid } from "nanoid";

const useBusStore = create((set) => ({
  buses: [
    { id: nanoid(), number: "MH12 AB 1234", driver: "John Doe", capacity: 50, status: "Active" },
    { id: nanoid(), number: "MH12 XY 9876", driver: "Rahul Patil", capacity: 40, status: "Inactive" },
  ],

  addBus: (bus) =>
    set((state) => ({
      buses: [...state.buses, { id: nanoid(), ...bus }],
    })),

  updateBus: (id, updated) =>
    set((state) => ({
      buses: state.buses.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    })),

  deleteBus: (id) =>
    set((state) => ({
      buses: state.buses.filter((b) => b.id !== id),
    })),
}));

export default useBusStore;
