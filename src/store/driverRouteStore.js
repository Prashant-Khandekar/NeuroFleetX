import { create } from "zustand";

const useDriverRouteStore = create((set) => ({
  driverRouteCoordinates: [
    [73.8567, 18.5204], // Pune main area
    [73.8620, 18.5215],
    [73.8700, 18.5230],
    [73.8805, 18.5255],
    [73.8920, 18.5300], // sample path
  ],

  setDriverRouteCoordinates: (coords) =>
    set({ driverRouteCoordinates: coords }),

  clearDriverRoute: () =>
    set({ driverRouteCoordinates: [] }),
}));

export default useDriverRouteStore;
