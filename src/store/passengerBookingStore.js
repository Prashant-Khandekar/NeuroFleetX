import { create } from "zustand";

const usePassengerBookingStore = create((set) => ({
  bookings: [],
  activeBooking: null,

  bookTicket: (booking) =>
    set((state) => {
      const newBooking = {
        id: Date.now(),
        status: "ACTIVE",
        bookedAt: new Date().toISOString(),
        ...booking,
      };

      return {
        bookings: [...state.bookings, newBooking],
        activeBooking: newBooking,
      };
    }),

  endTrip: () =>
    set((state) => ({
      activeBooking: state.activeBooking
        ? { ...state.activeBooking, status: "COMPLETED" }
        : null,
    })),
}));

export default usePassengerBookingStore;
