import { create } from "zustand";

const useTripStore = create((set) => ({
  tripActive: false,

  startTrip: () => set({ tripActive: true }),
  endTrip: () => set({ tripActive: false }),
}));

export default useTripStore;
