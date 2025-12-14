import { create } from "zustand";

const useDriverRouteStore = create(() => ({
  assignedRoute: {
    id: "RT-101",
    routeName: "Pune Station → Hinjewadi Phase 3",
    busNumber: "MH12 AB 1234",
    startTime: "09:00 AM",
    endTime: "11:15 AM",
    totalStops: 8,
    stops: [
      "Pune Station",
      "Shivajinagar",
      "University Circle",
      "Baner",
      "Balewadi",
      "Wakad",
      "Hinjewadi Phase 1",
      "Hinjewadi Phase 3",
    ],
    distance: "28 km",
    status: "ACTIVE",
  },
}));

export default useDriverRouteStore;
