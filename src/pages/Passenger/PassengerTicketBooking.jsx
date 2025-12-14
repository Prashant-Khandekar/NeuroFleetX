import { useState } from "react";
import useThemeStore from "../../store/themeStore";
import usePassengerBookingStore from "../../store/passengerBookingStore";

export default function PassengerTicketBooking() {
  const { darkMode } = useThemeStore();
  const { bookings, bookTicket } = usePassengerBookingStore();

  // 🔹 Mock Available Trips (Frontend Only)
  const availableTrips = [
    {
      busId: 1,
      busNumber: "MH12 AB 1234",
      route: "Pune Station → Hinjewadi",
      stops: ["Pune Station", "Shivajinagar", "Baner", "Hinjewadi"],
      totalSeats: 40,
      reservedSeats: 22,
    },
    {
      busId: 2,
      busNumber: "MH14 XY 9876",
      route: "Swargate → Katraj",
      stops: ["Swargate", "Bibwewadi", "Katraj"],
      totalSeats: 35,
      reservedSeats: 10,
    },
  ];

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState("");

  const bgCard = darkMode
    ? "bg-[#2f2f2f] border-[#3d3d3d]"
    : "bg-[#b3b3b3] border-[#9e9e9e]";

  const btnPrimary = darkMode
    ? "bg-[#3a3a3a] hover:bg-[#4a4a4a]"
    : "bg-[#8a8a8a] hover:bg-[#7a7a7a]";

  const handleBooking = () => {
    if (!selectedTrip || !date) return alert("Select trip & date");

    if (passengers > selectedTrip.totalSeats - selectedTrip.reservedSeats) {
      return alert("Not enough seats available");
    }

    bookTicket({
      busId: selectedTrip.busId,
      routeName: selectedTrip.route,
      travelDate: date,
      passengers,
    });

    alert("🎟 Ticket booked successfully");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ================= AVAILABLE TRIPS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-5">Available Bus Trips</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {availableTrips.map((trip) => {
            const availableSeats =
              trip.totalSeats - trip.reservedSeats;

            return (
              <div
                key={trip.busId}
                onClick={() => setSelectedTrip(trip)}
                className={`p-6 rounded-xl border cursor-pointer transition
                ${bgCard}
                ${
                  selectedTrip?.busId === trip.busId
                    ? "ring-2 ring-black"
                    : ""
                }`}
              >
                <h2 className="text-xl font-semibold mb-2">
                  {trip.route}
                </h2>

                <p><strong>Bus:</strong> {trip.busNumber}</p>
                <p><strong>Stops:</strong> {trip.stops.join(" → ")}</p>
                <p><strong>Total Seats:</strong> {trip.totalSeats}</p>
                <p><strong>Reserved:</strong> {trip.reservedSeats}</p>
                <p><strong>Available:</strong> {availableSeats}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= BOOKING FORM ================= */}
      <div className={`p-6 rounded-xl border ${bgCard}`}>
        <h2 className="text-2xl font-semibold mb-4">Book Selected Trip</h2>

        {selectedTrip ? (
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 rounded border"
            />

            <input
              type="number"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="p-3 rounded border"
            />

            <button
              onClick={handleBooking}
              className={`p-3 rounded-lg font-semibold ${btnPrimary}`}
            >
              Confirm Booking
            </button>
          </div>
        ) : (
          <p>Select a trip to continue booking</p>
        )}
      </div>

      {/* ================= BOOKING HISTORY ================= */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Booking History</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Route</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Passengers</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="p-3">{b.routeName}</td>
                    <td className="p-3">{b.travelDate}</td>
                    <td className="p-3 text-center">{b.passengers}</td>
                    <td className="p-3 text-center font-semibold">
                      {b.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
