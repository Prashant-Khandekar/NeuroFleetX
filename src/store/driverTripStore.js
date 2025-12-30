import { create } from "zustand";

// Haversine distance helper (Km)
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
  // 1. Initial State
  availableRoutes: {
    "Route A": {
      name: "Katraj to Shivajinagar",
      stops: [
        { name: "Katraj", lat: 18.4529, lng: 73.8553 },
        { name: "Snake Park", lat: 18.4575, lng: 73.8558 },
        { name: "Swargate", lat: 18.5018, lng: 73.8636 },
        { name: "Shivajinagar", lat: 18.5314, lng: 73.8446 }
      ]
    },
    "Route B": {
      name: "Hinjewadi Phase 3 to Baner",
      stops: [
        { name: "Hinjewadi Ph 3", lat: 18.5810, lng: 73.6930 },
        { name: "Wakad Highway", lat: 18.5912, lng: 73.7650 },
        { name: "Baner DP Road", lat: 18.5600, lng: 73.7900 },
        { name: "Baner", lat: 18.5590, lng: 73.7787 }
      ]
    }
  },
  
  route: { stops: [] }, 
  currentStopIndex: 0,
  tripActive: false,

  // 2. Actions (Functions)
  setRoute: (routeName) => {
    const selected = get().availableRoutes[routeName];
    if (selected) {
      set({ route: selected, currentStopIndex: 0 });
    }
  },

  startTrip: () => set({ tripActive: true }),
  
  endTrip: () => set({ tripActive: false, currentStopIndex: 0 }),
  
  advanceStop: () => {
    const { currentStopIndex, route } = get();
    if (currentStopIndex < route.stops.length - 1) {
      set({ currentStopIndex: currentStopIndex + 1 });
    }
  },

  // ETA Calculation Function
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

    return Math.ceil((dist / speed) * 60); // returns minutes
  },

  
  setAssignedRoute: async (busId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/routes/bus/${busId}`);
      if (!response.ok) throw new Error("Failed to fetch route");
      const data = await response.json(); 
      
      set({ 
        route: {
          id: data.id,
          stops: data.stops 
        },
        currentStopIndex: 0 
      });
    } catch (error) {
      console.error("Route fetch error:", error);
    }
  }
}));

export default useDriverTripStore;
