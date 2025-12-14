import { create } from "zustand";

// Haversine distance (km)
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const useDriverTripStore = create((set, get) => ({
  tripActive: false,
  currentStopIndex: 0,

  // ✅ MOCK: Assigned by admin later
  route: {
    name: "Katraj → Swargate → Pune Station",
    stops: [
      { name: "Katraj", lat: 18.4467, lng: 73.8577 },
      { name: "Swargate", lat: 18.5018, lng: 73.8636 },
      { name: "Pune Station", lat: 18.5286, lng: 73.8740 },
    ],
  },

  startTrip: () => set({ tripActive: true }),
  endTrip: () => set({ tripActive: false, currentStopIndex: 0 }),

  advanceStop: () =>
    set((state) => ({
      currentStopIndex: Math.min(
        state.currentStopIndex + 1,
        state.route.stops.length - 1
      ),
    })),

  getETA: (busLat, busLng, speed = 30) => {
    const { route, currentStopIndex } = get();
    const nextStop = route.stops[currentStopIndex + 1];
    if (!nextStop) return null;

    const dist = distanceKm(
      busLat,
      busLng,
      nextStop.lat,
      nextStop.lng
    );

    return Math.ceil((dist / speed) * 60); // minutes
  },
}));

export default useDriverTripStore;
