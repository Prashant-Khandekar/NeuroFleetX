import { create } from "zustand";

const useDriverStore = create((set) => ({
  drivers: [
    {
      id: 1,
      name: "Rahul Verma",
      phone: "9876543210",
      license: "MH14-DRV-1024",
      status: "Active",
    },
    {
      id: 2,
      name: "Amit Sharma",
      phone: "9822334455",
      license: "MH12-DRV-9982",
      status: "Inactive",
    },
  ],
 
  setDrivers: (data) => set({ drivers: data }),

  
  addDriver: (driver) =>
    set((state) => ({
      drivers: [...state.drivers, { id: Date.now(), ...driver }],
    })),

  updateDriver: (updated) => set((state) => ({
    drivers: state.drivers.map((d) => 
      ((d.id || d._id) === (updated.id || updated._id) ? updated : d)
    )
})),

  deleteDriver: (id) =>
    set((state) => ({
      drivers: state.drivers.filter((d) => d.id !== id),
    })),
}));

export default useDriverStore;
