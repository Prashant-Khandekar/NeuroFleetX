import { create } from "zustand";

const useBusLocationStore = create((set) => ({
  buses: [
    {
      id: 1,
      number: "MH12 AB 1234",
      driver: "Rahul",
      lat: 18.5204,
      lng: 73.8567,
      speed: 45,
      route: [
        [73.8567, 18.5204],
        [73.8610, 18.5210],
        [73.8700, 18.5230],
      ],
    },
    {
      id: 2,
      number: "MH14 XY 9876",
      driver: "Suresh",
      lat: 18.5250,
      lng: 73.8600,
      speed: 30,
      route: [
        [73.8600, 18.5250],
        [73.8650, 18.5270],
        [73.8720, 18.5300],
      ],
    },
    {
      id: 3,
      number: "MH12 CD 4567",
      driver: "Amit",
      lat: 18.5300,
      lng: 73.8650,
      speed: 50,
      route: [
        [73.8650, 18.5300],
        [73.8700, 18.5320],
        [73.8780, 18.5350],
      ],
    },
    {
      id: 4,
      number: "MH13 EF 8910",
      driver: "Vikas",
      lat: 18.5150,
      lng: 73.8500,
      speed: 20,
      route: [
        [73.8500, 18.5150],
        [73.8550, 18.5180],
        [73.8600, 18.5200],
      ],
    },
    {
      id: 5,
      number: "MH12 GH 2222",
      driver: "Rohit",
      lat: 18.5400,
      lng: 73.8750,
      speed: 0,
      route: [
        [73.8750, 18.5400],
        [73.8800, 18.5430],
        [73.8850, 18.5450],
      ],
    },
    {
      id: 6,
      number: "MH15 IJ 3333",
      driver: "Karan",
      lat: 18.5100,
      lng: 73.8450,
      speed: 35,
      route: [
        [73.8450, 18.5100],
        [73.8500, 18.5130],
        [73.8550, 18.5160],
      ],
    },
    {
      id: 7,
      number: "MH12 KL 4444",
      driver: "Nikhil",
      lat: 18.5450,
      lng: 73.8800,
      speed: 55,
      route: [
        [73.8800, 18.5450],
        [73.8850, 18.5480],
        [73.8900, 18.5500],
      ],
    },
    {
      id: 8,
      number: "MH14 MN 5555",
      driver: "Sanjay",
      lat: 18.5000,
      lng: 73.8400,
      speed: 25,
      route: [
        [73.8400, 18.5000],
        [73.8450, 18.5030],
        [73.8500, 18.5060],
      ],
    },
    {
      id: 9,
      number: "MH12 OP 6666",
      driver: "Arjun",
      lat: 18.5350,
      lng: 73.8700,
      speed: 40,
      route: [
        [73.8700, 18.5350],
        [73.8750, 18.5380],
        [73.8800, 18.5400],
      ],
    },
    {
      id: 10,
      number: "MH16 QR 7777",
      driver: "Manish",
      lat: 18.5050,
      lng: 73.8350,
      speed: 15,
      route: [
        [73.8350, 18.5050],
        [73.8400, 18.5080],
        [73.8450, 18.5100],
      ],
    },
  ],

  updateBusLocation: (id, lat, lng, speed) =>
    set((state) => ({
      buses: state.buses.map((b) =>
        b.id === id ? { ...b, lat, lng, speed } : b
      ),
    })),



fetchLiveBusLocation: async (busId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/buses/location/${busId}`);
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      
      set((state) => ({
        buses: state.buses.map((b) =>
          String(b.id) === String(busId) ? { ...b, lat: data.lat, lng: data.lng } : b
        ),
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  },
}));



export default useBusLocationStore;
