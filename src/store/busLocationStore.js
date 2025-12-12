import { create } from "zustand";

const useBusLocationStore = create((set) => ({
  buses: [
    {
      id: 1,
      number: "MH12 AB 1234",
      driver: "Rahul",
      lat: 18.5204,
      lng: 73.8567,
      speed: 40,
    },
    {
      id: 2,
      number: "MH14 XY 9876",
      driver: "Suresh",
      lat: 18.5300,
      lng: 73.8700,
      speed: 30,
    }
  ],

  updateBusLocation: (id, lat, lng, speed) =>
    set((state) => ({
      buses: state.buses.map((b) =>
        b.id === id ? { ...b, lat, lng, speed } : b
      )
    })),
}));

export default useBusLocationStore;
